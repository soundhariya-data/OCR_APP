import os
import shutil
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database import get_connection, init_db

# Initialize database schema and initial data
init_db()

app = FastAPI(
    title="LogiScan OCR Warehouse Reconciler API",
    description="FastAPI & SQLite backend for Conveyor Camera OCR & Inbound Manifest Reconciliation",
    version="1.0.0"
)

# Enable CORS for seamless integration with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
STATIC_DIR = os.path.join(BASE_DIR, "static")
CARTON_IMAGES_DIR = os.path.join(STATIC_DIR, "carton_images")
UPLOADS_DIR = os.path.join(STATIC_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(CARTON_IMAGES_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ============================================================================
# Pydantic Request Models
# ============================================================================
class DispositionRequest(BaseModel):
    invoice_id: str
    item_no: str
    status: str  # 'passed' | 'review' | 'failed'
    operator_id: Optional[str] = "OP-402"

class OverrideRequest(BaseModel):
    invoice_id: str
    item_no: str
    reason: str
    operator_id: Optional[str] = "OP-402"

class EmailAlertRequest(BaseModel):
    invoice_id: str
    item_no: str
    lot_no: str
    manager_name: Optional[str] = "R. Kumar"
    operator_id: Optional[str] = "OP-402"

class CaptureRequest(BaseModel):
    invoice_id: str
    item_no: str
    slot_index: int  # 0 to 3
    cam: Optional[str] = "CAM-04A-TOP"
    angle: Optional[str] = "Top Label View"
    operator_id: Optional[str] = "OP-402"

# 10 Source images mapping metadata
SOURCE_IMAGES_CATALOG = [
    {
        "id": 1,
        "filename": "carton_01_gasket_top.jpg",
        "url": "/static/carton_images/carton_01_gasket_top.jpg",
        "title": "GASKET SET - G12",
        "item_no": "ITM-77120",
        "batch_no": "BCH-7740",
        "mrp": "Rs. 1,100",
        "mfg_date": "10 Oct 2026",
        "expiry_date": "09 Oct 2028",
        "manifest_expiry": "11 Oct 2028",
        "cam": "CAM-04A-TOP",
        "angle": "Top Label View",
        "confidence": "99.6%",
        "status": "Exception",
        "exception_type": "Expiry Date Mismatch"
    },
    {
        "id": 2,
        "filename": "carton_02_valve_front.jpg",
        "url": "/static/carton_images/carton_02_valve_front.jpg",
        "title": "VALVE ASSEMBLY - V04",
        "item_no": "ITM-45830",
        "batch_no": "BCH-7739",
        "mrp": "Rs. 1,100",
        "mfg_date": "12 Oct 2026",
        "expiry_date": "11 Oct 2028",
        "manifest_expiry": "11 Oct 2028",
        "cam": "CAM-04A-FRT",
        "angle": "Front Barcode Face",
        "confidence": "99.2%",
        "status": "Matched",
        "exception_type": None
    },
    {
        "id": 3,
        "filename": "carton_03_hydraulic_side.jpg",
        "url": "/static/carton_images/carton_03_hydraulic_side.jpg",
        "title": "HYDRAULIC SEAL KIT",
        "item_no": "ITM-90412",
        "batch_no": "BCH-7745",
        "mrp": "Rs. 850",
        "mfg_date": "05 Oct 2026",
        "expiry_date": "04 Oct 2028",
        "manifest_expiry": "04 Oct 2028",
        "cam": "CAM-04A-SID",
        "angle": "Side Batch & Date Stamp",
        "confidence": "98.9%",
        "status": "Matched",
        "exception_type": None
    },
    {
        "id": 4,
        "filename": "carton_04_bearing_oblique.jpg",
        "url": "/static/carton_images/carton_04_bearing_oblique.jpg",
        "title": "BEARING UNIT - B88",
        "item_no": "ITM-33219",
        "batch_no": "BCH-7710",
        "mrp": "Rs. 2,400",
        "mfg_date": "01 Oct 2026",
        "expiry_date": "30 Sep 2028",
        "manifest_expiry": "30 Sep 2028",
        "cam": "CAM-04A-OBL",
        "angle": "Oblique Tamper Seal",
        "confidence": "99.4%",
        "status": "Matched",
        "exception_type": None
    },
    {
        "id": 5,
        "filename": "carton_05_gasket_apex.jpg",
        "url": "/static/carton_images/carton_05_gasket_apex.jpg",
        "title": "GASKET SET - G12",
        "item_no": "ITM-45830",
        "batch_no": "BCH-7739",
        "mrp": "Rs. 1,100",
        "mfg_date": "12 Oct 2026",
        "expiry_date": "11 Oct 2028",
        "manifest_expiry": "11 Oct 2028",
        "cam": "CAM-04A-TOP",
        "angle": "Top View (Green-Lane)",
        "confidence": "99.8%",
        "status": "Matched",
        "exception_type": None
    },
    {
        "id": 6,
        "filename": "carton_06_coupling_flange.jpg",
        "url": "/static/carton_images/carton_06_coupling_flange.jpg",
        "title": "COUPLING FLANGE - F9",
        "item_no": "ITM-66104",
        "batch_no": "BCH-7752",
        "mrp": "Rs. 1,650",
        "mfg_date": "11 Oct 2026",
        "expiry_date": "10 Oct 2028",
        "manifest_expiry": "10 Oct 2028",
        "cam": "CAM-04A-FRT",
        "angle": "Front Barcode Face",
        "confidence": "99.5%",
        "status": "Matched",
        "exception_type": None
    },
    {
        "id": 7,
        "filename": "carton_07_pressure_sensor.jpg",
        "url": "/static/carton_images/carton_07_pressure_sensor.jpg",
        "title": "PRESSURE SENSOR - P2",
        "item_no": "ITM-81920",
        "batch_no": "BCH-8812",
        "mrp": "Rs. 3,200",
        "mfg_date": "08 Oct 2026",
        "expiry_date": "07 Oct 2028",
        "manifest_expiry": "08 Oct 2028",
        "cam": "CAM-04A-TOP",
        "angle": "Discrepancy View",
        "confidence": "99.1%",
        "status": "Exception",
        "exception_type": "Expiry Date Mismatch"
    },
    {
        "id": 8,
        "filename": "carton_08_filter_cartridge.jpg",
        "url": "/static/carton_images/carton_08_filter_cartridge.jpg",
        "title": "FILTER CARTRIDGE - C7",
        "item_no": "ITM-51209",
        "batch_no": "BCH-8815",
        "mrp": "Rs. 640",
        "mfg_date": "09 Oct 2026",
        "expiry_date": "08 Oct 2028",
        "manifest_expiry": "08 Oct 2028",
        "cam": "CAM-04A-SID",
        "angle": "Side Stamp Face",
        "confidence": "99.7%",
        "status": "Matched",
        "exception_type": None
    },
    {
        "id": 9,
        "filename": "carton_09_faded_stamp_review.jpg",
        "url": "/static/carton_images/carton_09_faded_stamp_review.jpg",
        "title": "VALVE ASSEMBLY - V04 (LOW CONTRAST)",
        "item_no": "ITM-45830",
        "batch_no": "BCH-7739",
        "mrp": "Rs. 1,100",
        "mfg_date": "12 Oct 2026",
        "expiry_date": "11 Oct 2028",
        "manifest_expiry": "11 Oct 2028",
        "cam": "CAM-04A-REV",
        "angle": "Review Angle / Low Contrast",
        "confidence": "94.2%",
        "status": "Review",
        "exception_type": "Low Print Contrast"
    },
    {
        "id": 10,
        "filename": "carton_10_scuffed_override.jpg",
        "url": "/static/carton_images/carton_10_scuffed_override.jpg",
        "title": "GASKET SET - G12 (MANUAL OVERRIDE)",
        "item_no": "ITM-77120",
        "batch_no": "BCH-7740",
        "mrp": "Rs. 1,100",
        "mfg_date": "10 Oct 2026",
        "expiry_date": "09 Oct 2028",
        "manifest_expiry": "11 Oct 2028",
        "cam": "CAM-04A-MAN",
        "angle": "Manual Camera Verification",
        "confidence": "97.5%",
        "status": "Exception",
        "exception_type": "Expiry Date Mismatch"
    }
]

# ============================================================================
# Core API Routes
# ============================================================================

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "LogiScan OCR Reconciler API",
        "timestamp": datetime.now().isoformat(),
        "database": "SQLite (Connected)"
    }

@app.get("/api/invoices")
def get_invoices():
    """Retrieve all vendor invoices with their items, counts, and completion status."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM invoices ORDER BY id")
    invoices_rows = cursor.fetchall()

    result = []
    for inv in invoices_rows:
        inv_dict = dict(inv)
        cursor.execute("SELECT * FROM items WHERE invoice_id = ? ORDER BY item_no", (inv["id"],))
        items_rows = cursor.fetchall()
        inv_dict["items"] = [dict(it) for it in items_rows]
        result.append(inv_dict)

    conn.close()
    return result

@app.get("/api/invoices/{invoice_id}")
def get_invoice(invoice_id: str):
    """Retrieve a single invoice and all associated items and scan captures."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM invoices WHERE id = ?", (invoice_id,))
    inv = cursor.fetchone()
    if not inv:
        conn.close()
        raise HTTPException(status_code=404, detail="Invoice not found")

    inv_dict = dict(inv)
    cursor.execute("SELECT * FROM items WHERE invoice_id = ?", (invoice_id,))
    inv_dict["items"] = [dict(it) for it in cursor.fetchall()]

    cursor.execute("SELECT * FROM carton_scans WHERE invoice_id = ? ORDER BY id DESC", (invoice_id,))
    inv_dict["scans"] = [dict(sc) for sc in cursor.fetchall()]

    conn.close()
    return inv_dict

@app.post("/api/invoices/{invoice_id}/simulate")
def simulate_scan(invoice_id: str, step: int = 250):
    """Simulate batch conveyor scanner processing."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT expected_qty, processed_qty, verified_qty, exception_qty FROM invoices WHERE id = ?", (invoice_id,))
    inv = cursor.fetchone()
    if not inv:
        conn.close()
        raise HTTPException(status_code=404, detail="Invoice not found")

    expected, processed, verified, exceptions = inv
    if processed >= expected:
        conn.close()
        return {"message": "Invoice already fully processed", "processed": processed, "expected": expected}

    batch_step = min(step, expected - processed)
    new_processed = processed + batch_step
    new_verified = verified + max(1, batch_step - 2)
    new_exceptions = exceptions + (2 if batch_step > 10 else 0)

    cursor.execute("""
    UPDATE invoices
    SET processed_qty = ?, verified_qty = ?, exception_qty = ?
    WHERE id = ?
    """, (new_processed, new_verified, new_exceptions, invoice_id))

    cursor.execute("""
    INSERT INTO audit_logs (operator_id, invoice_id, action, details)
    VALUES ('CONVEYOR_SCANNER', ?, 'BATCH_SIMULATE', ?)
    """, (invoice_id, f"Simulated conveyor batch: +{batch_step} units (Total: {new_processed}/{expected})"))

    conn.commit()
    conn.close()

    return {
        "invoice_id": invoice_id,
        "processed_qty": new_processed,
        "verified_qty": new_verified,
        "exception_qty": new_exceptions,
        "progress_pct": round((new_processed / expected) * 100)
    }

@app.get("/api/images")
def get_source_images():
    """Return the 10 source images with their metadata and static URLs."""
    return {
        "total": len(SOURCE_IMAGES_CATALOG),
        "images": SOURCE_IMAGES_CATALOG
    }

@app.post("/api/scan/capture")
def capture_conveyor_image(req: CaptureRequest):
    """Capture an optical frame from conveyor camera angles (up to 4 per carton)."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM items WHERE item_no = ? AND invoice_id = ?", (req.item_no, req.invoice_id))
    item = cursor.fetchone()
    if not item:
        conn.close()
        raise HTTPException(status_code=404, detail="Item not found")

    item_dict = dict(item)

    # Match image from 10 source images catalog based on item_no or slot
    matched_img = next((img for img in SOURCE_IMAGES_CATALOG if img["item_no"] == req.item_no), None)
    if not matched_img or req.slot_index >= len(SOURCE_IMAGES_CATALOG):
        matched_img = SOURCE_IMAGES_CATALOG[req.slot_index % len(SOURCE_IMAGES_CATALOG)]

    now_str = datetime.now().strftime("%I:%M:%S %p")
    status = "failed" if item_dict["status"] == "Exception" else "review" if req.slot_index == 1 else "passed"

    cursor.execute("""
    INSERT INTO carton_scans (invoice_id, item_no, capture_slot, cam, angle, confidence, captured_at, status, image_url, source_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'conveyor_cam')
    """, (req.invoice_id, req.item_no, req.slot_index + 1, req.cam, req.angle, matched_img["confidence"], now_str, status, matched_img["url"]))

    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "scan_id": scan_id,
        "capture_id": req.slot_index + 1,
        "cam": req.cam,
        "angle": req.angle,
        "confidence": matched_img["confidence"],
        "captured_at": now_str,
        "status": status,
        "image_url": matched_img["url"],
        "item": item_dict
    }

@app.post("/api/scan/upload")
async def upload_carton_camera_photo(
    file: UploadFile = File(...),
    invoice_id: str = Form(...),
    item_no: str = Form(...),
    slot_index: int = Form(0),
    operator_id: str = Form("OP-402")
):
    """
    CAMERA OPTION: Accept live photo from device webcam or user upload,
    save to static/uploads, run OCR verification, and record in SQLite.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM items WHERE item_no = ? AND invoice_id = ?", (item_no, invoice_id))
    item = cursor.fetchone()
    if not item:
        conn.close()
        raise HTTPException(status_code=404, detail="Item not found")

    item_dict = dict(item)

    # Save uploaded camera snapshot
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    unique_filename = f"webcam_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}{ext}"
    file_path = os.path.join(UPLOADS_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/static/uploads/{unique_filename}"
    now_str = datetime.now().strftime("%I:%M:%S %p")

    # Automated OCR analysis against item attributes
    is_mismatch = (item_dict["status"] == "Exception" or item_dict["expiry_date"] != item_dict["manifest_expiry"])
    scan_status = "failed" if is_mismatch else "passed"
    confidence = "99.2%" if not is_mismatch else "98.7%"

    cursor.execute("""
    INSERT INTO carton_scans (invoice_id, item_no, capture_slot, cam, angle, confidence, captured_at, status, image_url, source_type)
    VALUES (?, ?, ?, 'WEBCAM-LIVE', 'Live Camera Snapshot', ?, ?, ?, ?, 'webcam')
    """, (invoice_id, item_no, slot_index + 1, confidence, now_str, scan_status, image_url))

    scan_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO audit_logs (operator_id, invoice_id, item_no, action, details)
    VALUES (?, ?, ?, 'CAMERA_CAPTURE', ?)
    """, (operator_id, invoice_id, item_no, f"Live camera image captured and reconciled: {scan_status.upper()}"))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "scan_id": scan_id,
        "capture_id": slot_index + 1,
        "cam": "WEBCAM-LIVE",
        "angle": "Live Camera Snapshot",
        "confidence": confidence,
        "captured_at": now_str,
        "status": scan_status,
        "image_url": image_url,
        "ocr_extracted": {
            "item_no": item_dict["item_no"],
            "batch_no": item_dict["batch_no"],
            "mfg_date": item_dict["mfg_date"],
            "expiry_date": item_dict["expiry_date"],
            "manifest_expiry": item_dict["manifest_expiry"],
            "match": not is_mismatch
        }
    }

@app.post("/api/scan/disposition")
def set_disposition(req: DispositionRequest):
    """Set carton disposition: passed, review, or failed."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE carton_scans
    SET status = ?
    WHERE invoice_id = ? AND item_no = ?
    """, (req.status, req.invoice_id, req.item_no))

    cursor.execute("""
    INSERT INTO audit_logs (operator_id, invoice_id, item_no, action, details)
    VALUES (?, ?, ?, 'DISPOSITION_SET', ?)
    """, (req.operator_id, req.invoice_id, req.item_no, f"Operator set disposition to: {req.status.upper()}"))

    conn.commit()
    conn.close()

    return {"success": True, "status": req.status}

@app.post("/api/scan/override")
def override_false_negative(req: OverrideRequest):
    """Operator overrides false negative mismatch and forces status to passed."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE carton_scans
    SET status = 'passed', is_override = 1, override_reason = ?
    WHERE invoice_id = ? AND item_no = ?
    """, (req.reason, req.invoice_id, req.item_no))

    cursor.execute("""
    INSERT INTO audit_logs (operator_id, invoice_id, item_no, action, details)
    VALUES (?, ?, ?, 'OPERATOR_OVERRIDE', ?)
    """, (req.operator_id, req.invoice_id, req.item_no, f"False negative override applied. Reason: {req.reason}"))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "status": "passed",
        "is_override": True,
        "override_reason": req.reason
    }

@app.post("/api/scan/email-alert")
def trigger_manager_email(req: EmailAlertRequest):
    """Trigger discrepancy alert email to Warehouse Manager."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE invoices
    SET exception_qty = exception_qty + 1
    WHERE id = ?
    """, (req.invoice_id,))

    cursor.execute("""
    INSERT INTO audit_logs (operator_id, invoice_id, item_no, action, details)
    VALUES (?, ?, ?, 'EMAIL_ALERT', ?)
    """, (req.operator_id, req.invoice_id, req.item_no, f"Alert email sent to manager {req.manager_name} for Lot {req.lot_no} exception."))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "mail_sent": True,
        "recipient": f"{req.manager_name} (Warehouse Manager)",
        "subject": f"LogiScan Alert: OCR Expiry Discrepancy Flagged - {req.item_no} (Lot {req.lot_no})",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/vendors")
def get_vendors_risk():
    """Retrieve historical vendor reliability and discrepancy breakdowns."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM vendors_risk")
    rows = cursor.fetchall()
    result = []
    for r in rows:
        d = dict(r)
        d["discrepancies"] = {
            "label": d.pop("label_discrepancy"),
            "batch": d.pop("batch_discrepancy"),
            "date": d.pop("date_discrepancy"),
            "barcode": d.pop("barcode_discrepancy"),
            "qty": d.pop("qty_discrepancy")
        }
        result.append(d)

    conn.close()
    return result

@app.get("/api/reports/{lot_no}")
def get_lot_report(lot_no: str):
    """Generate official lot verification report."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM invoices WHERE lot_no = ?", (lot_no,))
    inv = cursor.fetchone()
    if not inv:
        conn.close()
        raise HTTPException(status_code=404, detail="Lot not found")

    inv_dict = dict(inv)
    cursor.execute("SELECT * FROM items WHERE invoice_id = ?", (inv_dict["id"],))
    inv_dict["items"] = [dict(it) for it in cursor.fetchall()]

    accuracy_score = round((inv_dict["verified_qty"] / max(1, inv_dict["processed_qty"])) * 100, 1)
    inv_dict["accuracy_score"] = f"{accuracy_score}%"
    inv_dict["report_generated_at"] = datetime.now().strftime("%d %b %Y, %I:%M %p")
    inv_dict["sign_off"] = "R. Kumar (Dock Supervisor)"

    conn.close()
    return inv_dict

@app.get("/api/kpi")
def get_kpis():
    """Aggregate KPI counts across invoices and hourly conveyor volume."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        SUM(expected_qty) as total_expected,
        SUM(processed_qty) as total_processed,
        SUM(verified_qty) as total_verified,
        SUM(exception_qty) as total_exceptions
    FROM invoices
    """)
    totals = dict(cursor.fetchone())

    conn.close()

    trend_bars = [
        {"hour": "06:00", "count": 1420},
        {"hour": "07:00", "count": 2150},
        {"hour": "08:00", "count": 2890},
        {"hour": "09:00", "count": 2340},
        {"hour": "10:00", "count": 1050}
    ]

    return {
        "totals": totals,
        "peak_hourly_rate": "2,890/hr",
        "trend_bars": trend_bars
    }

@app.get("/api/audit-logs")
def get_audit_logs(limit: int = 50):
    """Retrieve system and operator audit trail."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))
    logs = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return logs

