import os
import random
from PIL import Image, ImageDraw, ImageFont

output_dir = r"C:\Users\USER\Downloads\Google Gemini_files\backend\static\carton_images"
os.makedirs(output_dir, exist_ok=True)

# 10 Carton metadata specifications aligned with frontend invoices & items
cartons_meta = [
    {
        "filename": "carton_01_gasket_top.jpg",
        "title": "GASKET SET - G12",
        "item_no": "ITM-77120",
        "batch_no": "BCH-7740",
        "mrp": "Rs. 1,100",
        "mfg_date": "10 Oct 2026",
        "exp_date": "09 Oct 2028",
        "manifest_exp": "11 Oct 2028",
        "po": "PO-2026-4412",
        "lot": "LOT-2026-1187",
        "vendor": "Alpha Supplies",
        "cam": "CAM-04A-TOP",
        "angle": "Top Label View",
        "status": "Exception",
        "confidence": "99.6%"
    },
    {
        "filename": "carton_02_valve_front.jpg",
        "title": "VALVE ASSEMBLY - V04",
        "item_no": "ITM-45830",
        "batch_no": "BCH-7739",
        "mrp": "Rs. 1,100",
        "mfg_date": "12 Oct 2026",
        "exp_date": "11 Oct 2028",
        "manifest_exp": "11 Oct 2028",
        "po": "PO-2026-4412",
        "lot": "LOT-2026-1187",
        "vendor": "Alpha Supplies",
        "cam": "CAM-04A-FRT",
        "angle": "Front Barcode Face",
        "status": "Matched",
        "confidence": "99.2%"
    },
    {
        "filename": "carton_03_hydraulic_side.jpg",
        "title": "HYDRAULIC SEAL KIT",
        "item_no": "ITM-90412",
        "batch_no": "BCH-7745",
        "mrp": "Rs. 850",
        "mfg_date": "05 Oct 2026",
        "exp_date": "04 Oct 2028",
        "manifest_exp": "04 Oct 2028",
        "po": "PO-2026-4412",
        "lot": "LOT-2026-1187",
        "vendor": "Alpha Supplies",
        "cam": "CAM-04A-SID",
        "angle": "Side Batch & Date Stamp",
        "status": "Matched",
        "confidence": "98.9%"
    },
    {
        "filename": "carton_04_bearing_oblique.jpg",
        "title": "BEARING UNIT - B88",
        "item_no": "ITM-33219",
        "batch_no": "BCH-7710",
        "mrp": "Rs. 2,400",
        "mfg_date": "01 Oct 2026",
        "exp_date": "30 Sep 2028",
        "manifest_exp": "30 Sep 2028",
        "po": "PO-2026-4412",
        "lot": "LOT-2026-1187",
        "vendor": "Alpha Supplies",
        "cam": "CAM-04A-OBL",
        "angle": "Oblique Tamper Seal",
        "status": "Matched",
        "confidence": "99.4%"
    },
    {
        "filename": "carton_05_gasket_apex.jpg",
        "title": "GASKET SET - G12",
        "item_no": "ITM-45830",
        "batch_no": "BCH-7739",
        "mrp": "Rs. 1,100",
        "mfg_date": "12 Oct 2026",
        "exp_date": "11 Oct 2028",
        "manifest_exp": "11 Oct 2028",
        "po": "PO-2026-4419",
        "lot": "LOT-2026-1192",
        "vendor": "Apex Logistics",
        "cam": "CAM-04A-TOP",
        "angle": "Top View (Green-Lane)",
        "status": "Matched",
        "confidence": "99.8%"
    },
    {
        "filename": "carton_06_coupling_flange.jpg",
        "title": "COUPLING FLANGE - F9",
        "item_no": "ITM-66104",
        "batch_no": "BCH-7752",
        "mrp": "Rs. 1,650",
        "mfg_date": "11 Oct 2026",
        "exp_date": "10 Oct 2028",
        "manifest_exp": "10 Oct 2028",
        "po": "PO-2026-4419",
        "lot": "LOT-2026-1192",
        "vendor": "Apex Logistics",
        "cam": "CAM-04A-FRT",
        "angle": "Front Barcode Face",
        "status": "Matched",
        "confidence": "99.5%"
    },
    {
        "filename": "carton_07_pressure_sensor.jpg",
        "title": "PRESSURE SENSOR - P2",
        "item_no": "ITM-81920",
        "batch_no": "BCH-8812",
        "mrp": "Rs. 3,200",
        "mfg_date": "08 Oct 2026",
        "exp_date": "07 Oct 2028",
        "manifest_exp": "08 Oct 2028",
        "po": "PO-2026-4425",
        "lot": "LOT-2026-1198",
        "vendor": "Global Freight",
        "cam": "CAM-04A-TOP",
        "angle": "Discrepancy View",
        "status": "Exception",
        "confidence": "99.1%"
    },
    {
        "filename": "carton_08_filter_cartridge.jpg",
        "title": "FILTER CARTRIDGE - C7",
        "item_no": "ITM-51209",
        "batch_no": "BCH-8815",
        "mrp": "Rs. 640",
        "mfg_date": "09 Oct 2026",
        "exp_date": "08 Oct 2028",
        "manifest_exp": "08 Oct 2028",
        "po": "PO-2026-4425",
        "lot": "LOT-2026-1198",
        "vendor": "Global Freight",
        "cam": "CAM-04A-SID",
        "angle": "Side Stamp Face",
        "status": "Matched",
        "confidence": "99.7%"
    },
    {
        "filename": "carton_09_faded_stamp_review.jpg",
        "title": "VALVE ASSEMBLY - V04 (LOW CONTRAST)",
        "item_no": "ITM-45830",
        "batch_no": "BCH-7739",
        "mrp": "Rs. 1,100",
        "mfg_date": "12 Oct 2026",
        "exp_date": "11 Oct 2028",
        "manifest_exp": "11 Oct 2028",
        "po": "PO-2026-4412",
        "lot": "LOT-2026-1187",
        "vendor": "Alpha Supplies",
        "cam": "CAM-04A-REV",
        "angle": "Review Angle / Low Contrast",
        "status": "Review",
        "confidence": "94.2%"
    },
    {
        "filename": "carton_10_scuffed_override.jpg",
        "title": "GASKET SET - G12 (MANUAL OVERRIDE)",
        "item_no": "ITM-77120",
        "batch_no": "BCH-7740",
        "mrp": "Rs. 1,100",
        "mfg_date": "10 Oct 2026",
        "exp_date": "09 Oct 2028",
        "manifest_exp": "11 Oct 2028",
        "po": "PO-2026-4412",
        "lot": "LOT-2026-1187",
        "vendor": "Alpha Supplies",
        "cam": "CAM-04A-MAN",
        "angle": "Manual Camera Verification",
        "status": "Exception",
        "confidence": "97.5%"
    }
]

def draw_carton(item):
    width, height = 700, 480
    # Cardboard background
    img = Image.new("RGB", (width, height), color=(202, 160, 114))
    draw = ImageDraw.Draw(img)

    # Corrugated grain simulation
    random.seed(hash(item["filename"]))
    for y in range(0, height, 4):
        tint = random.randint(-8, 8)
        color = (max(0, min(255, 202 + tint)), max(0, min(255, 160 + tint)), max(0, min(255, 114 + tint)))
        draw.line([(0, y), (width, y)], fill=color, width=2)

    # Tape strip across top/bottom
    draw.rectangle([0, 15, width, 55], fill=(168, 125, 75))
    draw.line([0, 15, width, 15], fill=(140, 100, 55), width=2)
    draw.line([0, 55, width, 55], fill=(140, 100, 55), width=2)

    # Shipping Label (clean white/cream sticker)
    label_x1, label_y1 = 45, 75
    label_x2, label_y2 = 655, 435
    draw.rectangle([label_x1, label_y1, label_x2, label_y2], fill=(250, 248, 243), outline=(120, 100, 80), width=2)

    # Label Header Banner
    banner_color = (225, 29, 72) if item["status"] == "Exception" else (245, 158, 11) if item["status"] == "Review" else (16, 185, 129)
    draw.rectangle([label_x1 + 8, label_y1 + 8, label_x2 - 8, label_y1 + 42], fill=(15, 23, 42))
    
    # Header texts
    draw.text((label_x1 + 18, label_y1 + 16), "LOGISCAN INDUSTRIAL OCR VERIFICATION", fill=(255, 255, 255))
    draw.rectangle([label_x2 - 130, label_y1 + 14, label_x2 - 18, label_y1 + 36], fill=banner_color)
    draw.text((label_x2 - 120, label_y1 + 18), f"{item['status'].upper()}", fill=(255, 255, 255))

    # Product Title & SKU
    draw.text((label_x1 + 20, label_y1 + 55), item["title"], fill=(15, 23, 42))
    draw.text((label_x1 + 20, label_y1 + 75), f"SKU: {item['item_no']}  |  VENDOR: {item['vendor']}  |  PO: {item['po']}", fill=(71, 85, 105))

    # Barcode Drawing
    bc_x = label_x1 + 20
    bc_y = label_y1 + 105
    bc_h = 48
    draw.rectangle([bc_x, bc_y, bc_x + 360, bc_y + bc_h], fill=(255, 255, 255), outline=(203, 213, 225))
    curr_x = bc_x + 10
    pattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 1, 4, 2, 1, 2, 3, 1, 2, 1, 4, 1]
    for w in pattern:
        draw.rectangle([curr_x, bc_y + 4, curr_x + w, bc_y + bc_h - 4], fill=(0, 0, 0))
        curr_x += w + 2
        if curr_x >= bc_x + 350:
            break
    draw.text((bc_x + 40, bc_y + bc_h + 3), f"* {item['item_no']} * {item['batch_no']} *", fill=(15, 23, 42))

    # Camera & AI confidence badge on right of barcode
    draw.rectangle([label_x1 + 400, bc_y, label_x2 - 20, bc_y + bc_h + 18], fill=(241, 245, 249), outline=(203, 213, 225))
    draw.text((label_x1 + 412, bc_y + 6), f"CAMERA FEED: {item['cam']}", fill=(15, 23, 42))
    draw.text((label_x1 + 412, bc_y + 24), f"ANGLE: {item['angle']}", fill=(71, 85, 105))
    draw.text((label_x1 + 412, bc_y + 42), f"OCR ACCURACY: {item['confidence']}", fill=(16, 185, 129))

    # 4 Data Blocks (Batch, MRP, MFG, EXPIRY)
    grid_y = label_y1 + 190
    box_w = 142
    box_h = 60

    # Box 1: Batch
    draw.rectangle([label_x1 + 15, grid_y, label_x1 + 15 + box_w, grid_y + box_h], fill=(248, 250, 252), outline=(203, 213, 225), width=1)
    draw.text((label_x1 + 22, grid_y + 8), "BATCH NUMBER", fill=(100, 116, 139))
    draw.text((label_x1 + 22, grid_y + 28), item["batch_no"], fill=(15, 23, 42))

    # Box 2: MRP
    draw.rectangle([label_x1 + 167, grid_y, label_x1 + 167 + box_w, grid_y + box_h], fill=(248, 250, 252), outline=(203, 213, 225), width=1)
    draw.text((label_x1 + 174, grid_y + 8), "MAX RETAIL PRICE", fill=(100, 116, 139))
    draw.text((label_x1 + 174, grid_y + 28), item["mrp"], fill=(15, 23, 42))

    # Box 3: MFG
    draw.rectangle([label_x1 + 319, grid_y, label_x1 + 319 + box_w, grid_y + box_h], fill=(248, 250, 252), outline=(203, 213, 225), width=1)
    draw.text((label_x1 + 326, grid_y + 8), "MFG. DATE", fill=(100, 116, 139))
    draw.text((label_x1 + 326, grid_y + 28), item["mfg_date"], fill=(15, 23, 42))

    # Box 4: EXPIRY DATE (Highlighted if mismatch)
    is_mismatch = (item["status"] == "Exception" or item["exp_date"] != item["manifest_exp"])
    exp_bg = (255, 241, 242) if is_mismatch else (248, 250, 252)
    exp_border = (225, 29, 72) if is_mismatch else (203, 213, 225)
    draw.rectangle([label_x1 + 471, grid_y, label_x1 + 471 + box_w, grid_y + box_h], fill=exp_bg, outline=exp_border, width=2 if is_mismatch else 1)
    draw.text((label_x1 + 478, grid_y + 8), "PRINTED EXPIRY", fill=(225, 29, 72) if is_mismatch else (100, 116, 139))
    draw.text((label_x1 + 478, grid_y + 28), item["exp_date"], fill=(190, 18, 60) if is_mismatch else (15, 23, 42))

    # Discrepancy warning alert bar at bottom
    alert_y = grid_y + 70
    if is_mismatch:
        draw.rectangle([label_x1 + 15, alert_y, label_x2 - 15, alert_y + 40], fill=(255, 228, 230), outline=(225, 29, 72), width=1)
        draw.text((label_x1 + 25, alert_y + 12), f"(!) MANIFEST MISMATCH: Manifest Expiry is '{item['manifest_exp']}' vs Carton Printed '{item['exp_date']}'", fill=(159, 18, 57))
    elif item["status"] == "Review":
        draw.rectangle([label_x1 + 15, alert_y, label_x2 - 15, alert_y + 40], fill=(254, 243, 199), outline=(217, 119, 6), width=1)
        draw.text((label_x1 + 25, alert_y + 12), "(!) LOW PRINT CONTRAST: Review required - verify against physical carton label", fill=(146, 64, 14))
    else:
        draw.rectangle([label_x1 + 15, alert_y, label_x2 - 15, alert_y + 40], fill=(236, 253, 245), outline=(16, 185, 129), width=1)
        draw.text((label_x1 + 25, alert_y + 12), f"[OK] ALL ATTRIBUTES MATCHED: 100% agreement with Manifest {item['lot']}", fill=(6, 95, 70))

    # Optical reticle stamp on bottom-right
    draw.text((label_x1 + 20, label_y2 - 25), f"FM DOCK #04 • OP-402 • {item['lot']}", fill=(148, 163, 184))

    save_path = os.path.join(output_dir, item["filename"])
    img.save(save_path, "JPEG", quality=92)
    print(f"Generated: {item['filename']}")

for carton in cartons_meta:
    draw_carton(carton)

print("All 10 source images generated successfully!")

