import os
import sys

backend_dir = r"C:\Users\USER\Downloads\Google Gemini_files\backend"
sys.path.insert(0, backend_dir)

import main

def test_routes_directly():
    print("Testing backend logic directly...")
    
    # 1. Health
    h = main.health()
    assert h["status"] == "healthy"
    print("[PASS] health():", h["status"])

    # 2. Invoices
    invs = main.get_invoices()
    assert len(invs) == 3
    print(f"[PASS] get_invoices(): {len(invs)} invoices loaded with items")

    # 3. Images
    imgs = main.get_source_images()
    assert imgs["total"] == 10
    print(f"[PASS] get_source_images(): {imgs['total']} source carton images verified")

    # 4. Optical capture
    cap = main.capture_conveyor_image(main.CaptureRequest(
        invoice_id="INV-78431",
        item_no="ITM-77120",
        slot_index=0,
        cam="CAM-04A-TOP",
        angle="Top Label View"
    ))
    assert cap["capture_id"] == 1
    print("[PASS] capture_conveyor_image(): Slot 1 captured with confidence", cap["confidence"])

    # 5. Override
    ov = main.override_false_negative(main.OverrideRequest(
        invoice_id="INV-78431",
        item_no="ITM-77120",
        reason="Physical carton text verified manually."
    ))
    assert ov["status"] == "passed"
    print("[PASS] override_false_negative(): Status set to", ov["status"])

    # 6. Email alert
    em = main.trigger_manager_email(main.EmailAlertRequest(
        invoice_id="INV-78431",
        item_no="ITM-77120",
        lot_no="LOT-2026-1187"
    ))
    assert em["mail_sent"] is True
    print("[PASS] trigger_manager_email(): Mail sent to", em["recipient"])

    # 7. Vendors
    vnds = main.get_vendors_risk()
    assert len(vnds) == 3
    print(f"[PASS] get_vendors_risk(): {len(vnds)} vendor risk tiers")

    # 8. Report
    rep = main.get_lot_report("LOT-2026-1187")
    assert rep["lot_no"] == "LOT-2026-1187"
    print("[PASS] get_lot_report(): Lot report generated for", rep["lot_no"], "Accuracy:", rep["accuracy_score"])

    # 9. KPIs
    kpi = main.get_kpis()
    assert "totals" in kpi
    print("[PASS] get_kpis(): Total expected:", kpi["totals"]["total_expected"])

    # 10. Audit logs
    logs = main.get_audit_logs(10)
    assert len(logs) > 0
    print(f"[PASS] get_audit_logs(): {len(logs)} audit entries logged in SQLite")

    print("\nALL BACKEND ROUTES AND SQLITE OPERATIONS VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_routes_directly()

