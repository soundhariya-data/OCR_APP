# LogiScan OCR - Warehouse Inbound Reconciler

An automated optical character recognition (OCR) and manifest reconciliation system for warehouse receiving docks. Verifies physical cartons arriving on conveyor belts or pallet docks against digital vendor purchase order manifests in real time.

---

## 🚀 Key Features

- **Dual-Mode Camera Ingestion**:
  - **Conveyor Rig**: Multi-angle optical inspection presets (Top Label View, Front Barcode Face, Side Batch Stamp, Oblique Tamper Seal).
  - **Live Device Webcam**: Stream live video directly inside the industrial reticle via `navigator.mediaDevices.getUserMedia` with instant snapshot capture.
  - **Manual Upload**: Support for uploading high-resolution carton photos directly from disk.
- **Automated Manifest Reconciliation**:
  - Real-time matching of carton label attributes (Item SKU, Batch Number, MRP, Mfg Date, Expiry Date) against purchase order records.
  - Automatic status disposition: **Passed** (Green), **Review** (Yellow), or **Failed Exception** (Red).
- **Interactive Exception Manifest Audit**:
  - Vertical-scrollable side-by-side audit panel highlighting date discrepancies and low print contrast flags.
  - False Negative Operator Override workflow with mandatory justification logging.
  - One-click discrepancy escalation email dispatch to warehouse managers.
- **10 Industrial Source Images**:
  - Pre-generated reference carton images with realistic cardboard textures, Code128 barcodes, and quality stamps.
- **Full-Stack Architecture**:
  - **Backend**: FastAPI with async route handlers, CORS middleware, multipart upload processing, and static image serving.
  - **Database**: SQLite (`logiscan.db`) with relational tables for manifests, items, scans, vendor risk matrices, and immutable audit logs.
  - **Frontend**: React + TypeScript dashboard (`logiscan_ocr_warehouse_dashboard.tsx`) and standalone interactive preview (`shim(1).html`).

---

## 🛠️ Project Structure

```text
├── backend/
│   ├── main.py                  # FastAPI application with all 11 reconciliation endpoints
│   ├── database.py              # SQLite schema initialization and seed manifests
│   ├── run_server.py            # Uvicorn server launcher (port 8000)
│   ├── test_api.py              # Direct API verification test suite
│   ├── generate_cartons.py      # Pillow script for generating realistic carton reference images
│   ├── requirements.txt         # Python dependencies
│   └── static/
│       ├── carton_images/       # 10 generated carton label source images
│       └── uploads/             # Live webcam snapshots & uploads
├── logiscan_ocr_warehouse_dashboard.tsx # Master React/TypeScript dashboard
├── shim(1).html                 # Standalone interactive Canvas preview
└── README.md
```

---

## ⚡ Quick Start

### 1. Start the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python run_server.py
```
*API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.*

### 2. Run API Tests
```bash
python test_api.py
```

### 3. Open the Frontend
- Open `shim(1).html` in any modern web browser, or mount `logiscan_ocr_warehouse_dashboard.tsx` inside your React / Vite application.
