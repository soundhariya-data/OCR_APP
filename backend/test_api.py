import os
import sys

backend_dir = r"C:\Users\USER\Downloads\Google Gemini_files\backend"
sys.path.insert(0, backend_dir)

from starlette.testclient import TestClient
from main import app

client = TestClient(app)

def test_endpoints():
    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Healthcheck failed: {res.text}"
    print("[PASS] GET /api/health ->", res.json()["status"])

    # 2. Invoices list
    res = client.get("/api/invoices")
    assert res.status_code == 200, f"Get invoices failed: {res.text}"
    invoices = res.json()
    assert len(invoices) >= 3, "Expected at least 3 invoices"
    print(f"[PASS] GET /api/invoices -> {len(invoices)} invoices loaded")

    # 3. 10 Source images
    res = client.get("/api/images")
    assert res.status_code == 200, f"Get images failed: {res.text}"
    images = res.json()["images"]
    assert len(images) == 10, f"Expected 10 source images, got {len(images)}"
    print(f"[PASS] GET /api/images -> {len(images)} carton source images available")

    # 4. Optical capture simulation
    res = client.post("/api/scan/capture", json={
        "invoice_id": "INV-78431",
        "item_no": "ITM-77120",
        "slot_index": 0,
        "cam": "CAM-04A-TOP",
        "angle": "Top Label View"
    })
    assert res.status_code == 200, f"Capture failed: {res.text}"
    capture_data = res.json()
    assert capture_data["capture_id"] == 1
    print("[PASS] POST /api/scan/capture -> Capture ID:", capture_data["capture_id"], "Status:", capture_data["status"])

    # 5. False negative override
    res = client.post("/api/scan/override", json={
        "invoice_id": "INV-78431",
        "item_no": "ITM-77120",
        "reason": "Visual inspection confirmed printed batch is within tolerance."
    })
    assert res.status_code == 200, f"Override failed: {res.text}"
    override_data = res.json()
    assert override_data["status"] == "passed"
    print("[PASS] POST /api/scan/override -> Status:", override_data["status"])

    # 6. Email alert trigger
    res = client.post("/api/scan/email-alert", json={
        "invoice_id": "INV-78431",
        "item_no": "ITM-77120",
        "lot_no": "LOT-2026-1187"
    })
    assert res.status_code == 200, f"Email alert failed: {res.text}"
    print("[PASS] POST /api/scan/email-alert -> Recipient:", res.json()["recipient"])

    # 7. Webcam snapshot upload test (multipart/form-data)
    sample_img_path = os.path.join(backend_dir, "static", "carton_images", "carton_01_gasket_top.jpg")
    with open(sample_img_path, "rb") as f:
        res = client.post(
            "/api/scan/upload",
            files={"file": ("webcam_test.jpg", f, "image/jpeg")},
            data={
                "invoice_id": "INV-78431",
                "item_no": "ITM-77120",
                "slot_index": 0,
                "operator_id": "OP-402"
            }
        )
    assert res.status_code == 200, f"Webcam upload failed: {res.text}"
    upload_res = res.json()
    assert upload_res["success"] is True
    assert upload_res["cam"] == "WEBCAM-LIVE"
    print("[PASS] POST /api/scan/upload -> Uploaded & OCR analyzed:", upload_res["image_url"], "Confidence:", upload_res["confidence"])

    # 8. Vendors risk
    res = client.get("/api/vendors")
    assert res.status_code == 200
    vendors = res.json()
    assert len(vendors) >= 3
    print(f"[PASS] GET /api/vendors -> {len(vendors)} vendors retrieved")

    # 9. Reports
    res = client.get("/api/reports/LOT-2026-1187")
    assert res.status_code == 200
    report = res.json()
    print("[PASS] GET /api/reports/LOT-2026-1187 -> Lot Accuracy Score:", report["accuracy_score"])

    # 10. KPIs
    res = client.get("/api/kpi")
    assert res.status_code == 200
    kpis = res.json()
    print("[PASS] GET /api/kpi -> Peak Volume:", kpis["peak_hourly_rate"])

    print("\nALL 10 API & BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()

