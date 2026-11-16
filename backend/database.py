import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "logiscan.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Invoices table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        vendor TEXT NOT NULL,
        vendor_risk TEXT NOT NULL,
        po TEXT NOT NULL,
        lot_no TEXT NOT NULL,
        expected_qty INTEGER NOT NULL,
        processed_qty INTEGER NOT NULL,
        verified_qty INTEGER NOT NULL,
        exception_qty INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
    )
    """)

    # Items table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS items (
        item_no TEXT NOT NULL,
        invoice_id TEXT NOT NULL,
        name TEXT NOT NULL,
        batch_no TEXT NOT NULL,
        mrp TEXT NOT NULL,
        mfg_date TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        manifest_expiry TEXT NOT NULL,
        qty INTEGER NOT NULL,
        status TEXT NOT NULL,
        exception_type TEXT,
        context TEXT NOT NULL,
        time TEXT NOT NULL,
        PRIMARY KEY (item_no, invoice_id),
        FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    )
    """)

    # Carton scans / captures (up to 4 captures per carton + webcam uploads)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS carton_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id TEXT NOT NULL,
        item_no TEXT NOT NULL,
        capture_slot INTEGER NOT NULL,
        cam TEXT NOT NULL,
        angle TEXT NOT NULL,
        confidence TEXT NOT NULL,
        captured_at TEXT NOT NULL,
        status TEXT,
        image_url TEXT NOT NULL,
        is_override INTEGER DEFAULT 0,
        override_reason TEXT,
        source_type TEXT DEFAULT 'camera',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Vendors Risk metrics table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vendors_risk (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        risk TEXT NOT NULL,
        total_shipments INTEGER NOT NULL,
        failure_rate TEXT NOT NULL,
        label_discrepancy TEXT NOT NULL,
        batch_discrepancy TEXT NOT NULL,
        date_discrepancy TEXT NOT NULL,
        barcode_discrepancy TEXT NOT NULL,
        qty_discrepancy TEXT NOT NULL,
        status_note TEXT NOT NULL
    )
    """)

    # Audit Trail Log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operator_id TEXT NOT NULL,
        invoice_id TEXT,
        item_no TEXT,
        action TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Seed initial data if invoices table is empty
    cursor.execute("SELECT COUNT(*) FROM invoices")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)
        conn.commit()

    conn.close()

def seed_data(cursor):
    invoices = [
        ('INV-78431', 'Alpha Supplies', 'High Risk', 'PO-2026-4412', 'LOT-2026-1187', 14500, 9850, 9698, 152, 'pending'),
        ('INV-88390', 'Apex Logistics', 'Low Risk', 'PO-2026-4419', 'LOT-2026-1192', 8400, 6200, 6188, 12, 'pending'),
        ('INV-44129', 'Global Freight', 'Medium Risk', 'PO-2026-4425', 'LOT-2026-1198', 11200, 7400, 7345, 55, 'pending')
    ]
    cursor.executemany("""
    INSERT INTO invoices (id, vendor, vendor_risk, po, lot_no, expected_qty, processed_qty, verified_qty, exception_qty, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, invoices)

    items = [
        # Alpha Supplies items
        ('ITM-77120', 'INV-78431', 'GASKET SET - G12', 'BCH-7740', 'Rs. 1,100', '10 Oct 2026', '09 Oct 2028', '11 Oct 2028', 240, 'Exception', 'Expiry Date Mismatch', 'Printed expiry date on outer carton differs by 2 days from vendor manifest (09 Oct 2028 vs 11 Oct 2028).', '10:11 AM'),
        ('ITM-45830', 'INV-78431', 'VALVE ASSEMBLY - V04', 'BCH-7739', 'Rs. 1,100', '12 Oct 2026', '11 Oct 2028', '11 Oct 2028', 1200, 'Matched', None, 'All carton OCR fields match vendor manifest 100%.', '10:09 AM'),
        ('ITM-90412', 'INV-78431', 'HYDRAULIC SEAL KIT', 'BCH-7745', 'Rs. 850', '05 Oct 2026', '04 Oct 2028', '04 Oct 2028', 3100, 'Matched', None, 'Verified via automated conveyor scanner.', '10:06 AM'),
        ('ITM-33219', 'INV-78431', 'BEARING UNIT - B88', 'BCH-7710', 'Rs. 2,400', '01 Oct 2026', '30 Sep 2028', '30 Sep 2028', 5460, 'Matched', None, 'Verified via automated conveyor scanner.', '10:02 AM'),

        # Apex Logistics items
        ('ITM-45830', 'INV-88390', 'GASKET SET - G12', 'BCH-7739', 'Rs. 1,100', '12 Oct 2026', '11 Oct 2028', '11 Oct 2028', 4200, 'Matched', None, 'All attributes verified against Apex Logistics manifest.', '10:10 AM'),
        ('ITM-66104', 'INV-88390', 'COUPLING FLANGE - F9', 'BCH-7752', 'Rs. 1,650', '11 Oct 2026', '10 Oct 2028', '10 Oct 2028', 4200, 'Matched', None, 'All attributes verified.', '10:04 AM'),

        # Global Freight items
        ('ITM-81920', 'INV-44129', 'PRESSURE SENSOR - P2', 'BCH-8812', 'Rs. 3,200', '08 Oct 2026', '07 Oct 2028', '08 Oct 2028', 1200, 'Exception', 'Expiry Date Mismatch', '1-day discrepancy detected between carton OCR and manifest.', '10:08 AM'),
        ('ITM-51209', 'INV-44129', 'FILTER CARTRIDGE - C7', 'BCH-8815', 'Rs. 640', '09 Oct 2026', '08 Oct 2028', '08 Oct 2028', 6200, 'Matched', None, 'Matched 100%.', '10:01 AM')
    ]
    cursor.executemany("""
    INSERT INTO items (item_no, invoice_id, name, batch_no, mrp, mfg_date, expiry_date, manifest_expiry, qty, status, exception_type, context, time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, items)

    vendors = [
        ('VND-104', 'Alpha Supplies', 'High Risk', 48, '29.2%', '11%', '6%', '8%', '2.2%', '2%', 'Mandatory 100% dual-pass OCR audit enforced'),
        ('VND-219', 'Global Freight', 'Medium Risk', 64, '9.4%', '3.1%', '2.0%', '2.8%', '0.5%', '1.0%', 'Standard automated conveyor scan + random spot check'),
        ('VND-308', 'Apex Logistics', 'Low Risk', 92, '1.4%', '0.4%', '0.2%', '0.3%', '0.1%', '0.4%', 'Green-lane fast-track receiving active')
    ]
    cursor.executemany("""
    INSERT INTO vendors_risk (code, name, risk, total_shipments, failure_rate, label_discrepancy, batch_discrepancy, date_discrepancy, barcode_discrepancy, qty_discrepancy, status_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, vendors)

    # Initial system audit log
    cursor.execute("""
    INSERT INTO audit_logs (operator_id, invoice_id, item_no, action, details)
    VALUES ('SYSTEM', 'INV-78431', 'ITM-77120', 'INIT', 'LogiScan OCR database initialized with 3 vendor manifests.')
    """)

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")

