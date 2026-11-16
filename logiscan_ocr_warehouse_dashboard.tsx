import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Users,
  FileText,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  ArrowRight,
  Download,
  Printer,
  ShieldAlert,
  Play,
  Package,
  Camera,
  RefreshCw,
  Mail,
  LogOut,
  UserCheck,
  ScanLine,
  Check,
  XCircle,
  Video,
  Upload
} from 'lucide-react';

export default function App() {
  // Start directly on the Line Operator Login page while retaining Manager Dashboard access
  const [userRole, setUserRole] = useState('login');
  const [activeTab, setActiveTab] = useState('Receiving');
  const [kpiFilter, setKpiFilter] = useState('all');
  const [showDetailedExceptionView, setShowDetailedExceptionView] = useState(false);

  // 3 Vendor Invoices Data
  const vendorInvoices = [
    {
      id: 'INV-78431',
      vendor: 'Alpha Supplies',
      vendorRisk: 'High Risk',
      po: 'PO-2026-4412',
      lotNo: 'LOT-2026-1187',
      expectedQty: 14500,
      initialProcessed: 9850,
      initialVerified: 9698,
      initialExceptions: 152,
      items: [
        {
          itemNo: 'ITM-77120',
          name: 'GASKET SET - G12',
          batchNo: 'BCH-7740',
          mrp: '₹ 1,100',
          mfgDate: '10 Oct 2026',
          expiryDate: '09 Oct 2028',
          manifestExpiry: '11 Oct 2028',
          qty: 240,
          status: 'Exception',
          exceptionType: 'Expiry Date Mismatch',
          context: 'Printed expiry date on outer carton differs by 2 days from vendor manifest (09 Oct 2028 vs 11 Oct 2028).',
          time: '10:11 AM'
        },
        {
          itemNo: 'ITM-45830',
          name: 'VALVE ASSEMBLY - V04',
          batchNo: 'BCH-7739',
          mrp: '₹ 1,100',
          mfgDate: '12 Oct 2026',
          expiryDate: '11 Oct 2028',
          manifestExpiry: '11 Oct 2028',
          qty: 1200,
          status: 'Matched',
          exceptionType: null,
          context: 'All carton OCR fields match vendor manifest 100%.',
          time: '10:09 AM'
        },
        {
          itemNo: 'ITM-90412',
          name: 'HYDRAULIC SEAL KIT',
          batchNo: 'BCH-7745',
          mrp: '₹ 850',
          mfgDate: '05 Oct 2026',
          expiryDate: '04 Oct 2028',
          manifestExpiry: '04 Oct 2028',
          qty: 3100,
          status: 'Matched',
          exceptionType: null,
          context: 'Verified via automated conveyor scanner.',
          time: '10:06 AM'
        },
        {
          itemNo: 'ITM-33219',
          name: 'BEARING UNIT - B88',
          batchNo: 'BCH-7710',
          mrp: '₹ 2,400',
          mfgDate: '01 Oct 2026',
          expiryDate: '30 Sep 2028',
          manifestExpiry: '30 Sep 2028',
          qty: 5460,
          status: 'Matched',
          exceptionType: null,
          context: 'Verified via automated conveyor scanner.',
          time: '10:02 AM'
        }
      ]
    },
    {
      id: 'INV-88390',
      vendor: 'Apex Logistics',
      vendorRisk: 'Low Risk',
      po: 'PO-2026-4419',
      lotNo: 'LOT-2026-1192',
      expectedQty: 8400,
      initialProcessed: 6200,
      initialVerified: 6188,
      initialExceptions: 12,
      items: [
        {
          itemNo: 'ITM-45830',
          name: 'GASKET SET - G12',
          batchNo: 'BCH-7739',
          mrp: '₹ 1,100',
          mfgDate: '12 Oct 2026',
          expiryDate: '11 Oct 2028',
          manifestExpiry: '11 Oct 2028',
          qty: 4200,
          status: 'Matched',
          exceptionType: null,
          context: 'All attributes verified against Apex Logistics manifest.',
          time: '10:10 AM'
        },
        {
          itemNo: 'ITM-66104',
          name: 'COUPLING FLANGE - F9',
          batchNo: 'BCH-7752',
          mrp: '₹ 1,650',
          mfgDate: '11 Oct 2026',
          expiryDate: '10 Oct 2028',
          manifestExpiry: '10 Oct 2028',
          qty: 4200,
          status: 'Matched',
          exceptionType: null,
          context: 'All attributes verified.',
          time: '10:04 AM'
        }
      ]
    },
    {
      id: 'INV-44129',
      vendor: 'Global Freight',
      vendorRisk: 'Medium Risk',
      po: 'PO-2026-4425',
      lotNo: 'LOT-2026-1198',
      expectedQty: 11200,
      initialProcessed: 7400,
      initialVerified: 7345,
      initialExceptions: 55,
      items: [
        {
          itemNo: 'ITM-81920',
          name: 'PRESSURE SENSOR - P2',
          batchNo: 'BCH-8812',
          mrp: '₹ 3,200',
          mfgDate: '08 Oct 2026',
          expiryDate: '07 Oct 2028',
          manifestExpiry: '08 Oct 2028',
          qty: 1200,
          status: 'Exception',
          exceptionType: 'Expiry Date Mismatch',
          context: '1-day discrepancy detected between carton OCR and manifest.',
          time: '10:08 AM'
        },
        {
          itemNo: 'ITM-51209',
          name: 'FILTER CARTRIDGE - C7',
          batchNo: 'BCH-8815',
          mrp: '₹ 640',
          mfgDate: '09 Oct 2026',
          expiryDate: '08 Oct 2028',
          manifestExpiry: '08 Oct 2028',
          qty: 6200,
          status: 'Matched',
          exceptionType: null,
          context: 'Matched 100%.',
          time: '10:01 AM'
        }
      ]
    }
  ];

  // Manager State
  const [selectedInvoice, setSelectedInvoice] = useState(vendorInvoices[0]);
  const [processedCount, setProcessedCount] = useState(vendorInvoices[0].initialProcessed);
  const [verifiedCount, setVerifiedCount] = useState(vendorInvoices[0].initialVerified);
  const [exceptionCount, setExceptionCount] = useState(vendorInvoices[0].initialExceptions);
  const [activeItem, setActiveItem] = useState(vendorInvoices[0].items[0]);
  const [recommendedAction, setRecommendedAction] = useState('accept_variance');
  const [remarks, setRemarks] = useState('2-day expiry variance within acceptable shelf-life tolerance for Lot 1187.');

  // Line Operator State
  const [opInvoice, setOpInvoice] = useState(vendorInvoices[0]);
  const [opStage, setOpStage] = useState('select'); // 'select' | 'scanning' | 'completed'
  const [opItemIndex, setOpItemIndex] = useState(0);
  const [opCapturedImages, setOpCapturedImages] = useState([]); // Up to 4 images per carton
  const [opSelectedImageIdx, setOpSelectedImageIdx] = useState(0);
  const [opScanStatus, setOpScanStatus] = useState(null); // null | 'passed' | 'review' | 'failed'
  const [opIsPassedLocked, setOpIsPassedLocked] = useState(false);
  const [opItemHistory, setOpItemHistory] = useState({}); // { [itemIndex]: 'passed' | 'review' | 'failed' }
  const [opOverrideReason, setOpOverrideReason] = useState('False negative verified visually against physical carton label.');
  const [opMailSent, setOpMailSent] = useState(false);
  const [completedInvoices, setCompletedInvoices] = useState([]);
  const [opLoginId, setOpLoginId] = useState('OP-402');
  const [opPasscode, setOpPasscode] = useState('••••••');
  const [cameraActive, setCameraActive] = useState(true);
  const [cameraMode, setCameraMode] = useState('conveyor'); // 'conveyor' | 'webcam'
  const [backendOnline, setBackendOnline] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // 10 Source images mapped to dataset
  const sourceImagesList = [
    { id: 1, itemNo: 'ITM-77120', angle: 'Top Label View', cam: 'CAM-04A-TOP', url: 'http://localhost:8000/static/carton_images/carton_01_gasket_top.jpg', confidence: '99.6%' },
    { id: 2, itemNo: 'ITM-45830', angle: 'Front Barcode Face', cam: 'CAM-04A-FRT', url: 'http://localhost:8000/static/carton_images/carton_02_valve_front.jpg', confidence: '99.2%' },
    { id: 3, itemNo: 'ITM-90412', angle: 'Side Batch & Date Stamp', cam: 'CAM-04A-SID', url: 'http://localhost:8000/static/carton_images/carton_03_hydraulic_side.jpg', confidence: '98.9%' },
    { id: 4, itemNo: 'ITM-33219', angle: 'Oblique Tamper Seal', cam: 'CAM-04A-OBL', url: 'http://localhost:8000/static/carton_images/carton_04_bearing_oblique.jpg', confidence: '99.4%' },
    { id: 5, itemNo: 'ITM-45830', angle: 'Top View (Green-Lane)', cam: 'CAM-04A-TOP', url: 'http://localhost:8000/static/carton_images/carton_05_gasket_apex.jpg', confidence: '99.8%' },
    { id: 6, itemNo: 'ITM-66104', angle: 'Front Barcode Face', cam: 'CAM-04A-FRT', url: 'http://localhost:8000/static/carton_images/carton_06_coupling_flange.jpg', confidence: '99.5%' },
    { id: 7, itemNo: 'ITM-81920', angle: 'Discrepancy View', cam: 'CAM-04A-TOP', url: 'http://localhost:8000/static/carton_images/carton_07_pressure_sensor.jpg', confidence: '99.1%' },
    { id: 8, itemNo: 'ITM-51209', angle: 'Side Stamp Face', cam: 'CAM-04A-SID', url: 'http://localhost:8000/static/carton_images/carton_08_filter_cartridge.jpg', confidence: '99.7%' },
    { id: 9, itemNo: 'ITM-45830', angle: 'Review Angle / Low Contrast', cam: 'CAM-04A-REV', url: 'http://localhost:8000/static/carton_images/carton_09_faded_stamp_review.jpg', confidence: '94.2%' },
    { id: 10, itemNo: 'ITM-77120', angle: 'Manual Camera Verification', cam: 'CAM-04A-MAN', url: 'http://localhost:8000/static/carton_images/carton_10_scuffed_override.jpg', confidence: '97.5%' }
  ];

  // Ping FastAPI backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  // Manage Webcam stream lifecycle
  useEffect(() => {
    let streamInstance = null;
    if (cameraMode === 'webcam' && cameraActive && opStage === 'scanning') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then((stream) => {
          streamInstance = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Webcam permission not granted or device not available:', err);
        });
    }

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraMode, cameraActive, opStage]);

  const captureAngles = [
    { angle: 'Top Label View', cam: 'CAM-04A-TOP', confidence: '99.6%' },
    { angle: 'Front Barcode Face', cam: 'CAM-04A-FRT', confidence: '99.2%' },
    { angle: 'Side Batch & Date Stamp', cam: 'CAM-04A-SID', confidence: '98.9%' },
    { angle: 'Oblique Tamper Seal', cam: 'CAM-04A-OBL', confidence: '99.4%' }
  ];

  // Sync manager counts when invoice changes
  useEffect(() => {
    setProcessedCount(selectedInvoice.initialProcessed);
    setVerifiedCount(selectedInvoice.initialVerified);
    setExceptionCount(selectedInvoice.initialExceptions);
    setActiveItem(selectedInvoice.items[0]);
    setShowDetailedExceptionView(false);
    setKpiFilter('all');
  }, [selectedInvoice]);

  const remainingCount = Math.max(0, selectedInvoice.expectedQty - processedCount);
  const progressPct = Math.min(100, Math.round((processedCount / selectedInvoice.expectedQty) * 100));

  const handleSimulateScan = () => {
    if (processedCount >= selectedInvoice.expectedQty) return;
    const batchStep = Math.min(250, selectedInvoice.expectedQty - processedCount);
    setProcessedCount((prev) => prev + batchStep);
    setVerifiedCount((prev) => prev + Math.max(1, batchStep - 2));
    setExceptionCount((prev) => prev + (batchStep > 10 ? 2 : 0));

    if (backendOnline) {
      fetch(`http://localhost:8000/api/invoices/${selectedInvoice.id}/simulate?step=${batchStep}`, {
        method: 'POST'
      }).catch(() => {});
    }
  };

  // Line Operator Handlers
  const handleStartOperatorScanning = () => {
    setOpItemIndex(0);
    setOpCapturedImages([]);
    setOpSelectedImageIdx(0);
    setOpScanStatus(null);
    setOpIsPassedLocked(false);
    setOpItemHistory({});
    setOpMailSent(false);
    setOpStage('scanning');
  };

  const handleCaptureCarton = () => {
    if (opCapturedImages.length >= 4) return;
    const currentItem = opInvoice.items[opItemIndex];
    const angleMeta = captureAngles[opCapturedImages.length] || captureAngles[0];
    const matchedSource = sourceImagesList.find((s) => s.itemNo === currentItem.itemNo) || sourceImagesList[opCapturedImages.length % 10];

    const newCapture = {
      ...currentItem,
      captureId: opCapturedImages.length + 1,
      angle: angleMeta.angle,
      cam: angleMeta.cam,
      confidence: matchedSource ? matchedSource.confidence : angleMeta.confidence,
      capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      imageUrl: matchedSource ? matchedSource.url : null
    };

    if (backendOnline) {
      fetch('http://localhost:8000/api/scan/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: opInvoice.id,
          item_no: currentItem.itemNo,
          slot_index: opCapturedImages.length,
          cam: angleMeta.cam,
          angle: angleMeta.angle,
          operator_id: opLoginId
        })
      }).catch(() => {});
    }

    const updated = [...opCapturedImages, newCapture];
    setOpCapturedImages(updated);
    setOpSelectedImageIdx(updated.length - 1);

    if (updated.length === 1 && !opIsPassedLocked) {
      let initialStatus = 'passed';
      if (currentItem.status === 'Exception') {
        initialStatus = 'failed';
      } else if (opItemIndex === 1) {
        initialStatus = 'review';
      }
      setOpScanStatus(initialStatus);
      setOpItemHistory((prev) => ({ ...prev, [opItemIndex]: initialStatus }));
    }
    setOpMailSent(false);
  };

  const handleCaptureWebcam = () => {
    if (opCapturedImages.length >= 4) return;
    const currentItem = opInvoice.items[opItemIndex];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let dataUrl = null;
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        if (backendOnline) {
          canvas.toBlob((blob) => {
            if (blob) {
              const fd = new FormData();
              fd.append('file', blob, `webcam_snap_${Date.now()}.jpg`);
              fd.append('invoice_id', opInvoice.id);
              fd.append('item_no', currentItem.itemNo);
              fd.append('slot_index', opCapturedImages.length.toString());
              fd.append('operator_id', opLoginId);
              fetch('http://localhost:8000/api/scan/upload', {
                method: 'POST',
                body: fd
              }).catch(() => {});
            }
          }, 'image/jpeg');
        }
      }
    }

    if (!dataUrl) {
      const matchedSource = sourceImagesList.find((s) => s.itemNo === currentItem.itemNo) || sourceImagesList[opCapturedImages.length % 10];
      dataUrl = matchedSource ? matchedSource.url : null;
    }

    const isMismatch = (currentItem.status === 'Exception' || currentItem.expiryDate !== currentItem.manifestExpiry);
    const initialStatus = isMismatch ? 'failed' : 'passed';

    const newCapture = {
      ...currentItem,
      captureId: opCapturedImages.length + 1,
      angle: `Live Camera Snapshot #${opCapturedImages.length + 1}`,
      cam: 'WEBCAM-LIVE',
      confidence: isMismatch ? '98.7%' : '99.4%',
      capturedAt: nowStr,
      imageUrl: dataUrl
    };

    const updated = [...opCapturedImages, newCapture];
    setOpCapturedImages(updated);
    setOpSelectedImageIdx(updated.length - 1);

    if (updated.length === 1 && !opIsPassedLocked) {
      setOpScanStatus(initialStatus);
      setOpItemHistory((prev) => ({ ...prev, [opItemIndex]: initialStatus }));
    }
    setOpMailSent(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || opCapturedImages.length >= 4) return;
    const currentItem = opInvoice.items[opItemIndex];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const isMismatch = (currentItem.status === 'Exception' || currentItem.expiryDate !== currentItem.manifestExpiry);
      const initialStatus = isMismatch ? 'failed' : 'passed';

      if (backendOnline) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('invoice_id', opInvoice.id);
        fd.append('item_no', currentItem.itemNo);
        fd.append('slot_index', opCapturedImages.length.toString());
        fd.append('operator_id', opLoginId);
        fetch('http://localhost:8000/api/scan/upload', {
          method: 'POST',
          body: fd
        }).catch(() => {});
      }

      const newCapture = {
        ...currentItem,
        captureId: opCapturedImages.length + 1,
        angle: `Uploaded Sample (${file.name})`,
        cam: 'USER-FILE',
        confidence: '99.1%',
        capturedAt: nowStr,
        imageUrl: dataUrl
      };

      const updated = [...opCapturedImages, newCapture];
      setOpCapturedImages(updated);
      setOpSelectedImageIdx(updated.length - 1);

      if (updated.length === 1 && !opIsPassedLocked) {
        setOpScanStatus(initialStatus);
        setOpItemHistory((prev) => ({ ...prev, [opItemIndex]: initialStatus }));
      }
      setOpMailSent(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectDisposition = (status) => {
    if (opIsPassedLocked && status !== 'passed') return;
    setOpScanStatus(status);
    setOpItemHistory((prev) => ({ ...prev, [opItemIndex]: status }));
    if (status === 'passed') {
      setOpIsPassedLocked(true);
    }
  };

  const handleOperatorOverridePass = () => {
    setOpScanStatus('passed');
    setOpIsPassedLocked(true);
    setOpItemHistory((prev) => ({ ...prev, [opItemIndex]: 'passed' }));
  };

  const handleOperatorRescan = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setOpCapturedImages((prev) =>
      prev.map((img, i) =>
        i === opSelectedImageIdx ? { ...img, capturedAt: now, confidence: '99.8%', rescanned: true } : img
      )
    );
    setOpScanStatus('passed');
    setOpIsPassedLocked(true);
    setOpItemHistory((prev) => ({ ...prev, [opItemIndex]: 'passed' }));
  };

  const handleTriggerManagerMail = () => {
    setOpMailSent(true);
    setExceptionCount((prev) => prev + 1);
  };

  const handleOperatorNextItem = () => {
    if (opItemIndex + 1 < opInvoice.items.length) {
      setOpItemIndex((prev) => prev + 1);
      setOpCapturedImages([]);
      setOpSelectedImageIdx(0);
      setOpScanStatus(null);
      setOpIsPassedLocked(false);
      setOpMailSent(false);
    } else {
      if (!completedInvoices.includes(opInvoice.id)) {
        setCompletedInvoices((prev) => [...prev, opInvoice.id]);
      }
      setOpStage('completed');
    }
  };

  const handleReturnToPendingInvoices = () => {
    const nextPending =
      vendorInvoices.find((inv) => inv.id !== opInvoice.id && !completedInvoices.includes(inv.id)) ||
      vendorInvoices[0];
    setOpInvoice(nextPending);
    setOpStage('select');
    setOpCapturedImages([]);
    setOpSelectedImageIdx(0);
    setOpScanStatus(null);
    setOpIsPassedLocked(false);
    setOpItemHistory({});
    setOpMailSent(false);
  };

  const filteredItems = selectedInvoice.items.filter((item) => {
    if (kpiFilter === 'verified') return item.status === 'Matched';
    if (kpiFilter === 'exceptions') return item.status === 'Exception';
    return true;
  });

  const vendorsRiskData = [
    {
      name: 'Alpha Supplies',
      code: 'VND-104',
      risk: 'High Risk',
      totalShipments: 48,
      failureRate: '29.2%',
      discrepancies: { label: '11%', batch: '6%', date: '8%', barcode: '2.2%', qty: '2%' },
      statusNote: 'Mandatory 100% dual-pass OCR audit enforced'
    },
    {
      name: 'Global Freight',
      code: 'VND-219',
      risk: 'Medium Risk',
      totalShipments: 64,
      failureRate: '9.4%',
      discrepancies: { label: '3.1%', batch: '2.0%', date: '2.8%', barcode: '0.5%', qty: '1.0%' },
      statusNote: 'Standard automated conveyor scan + random spot check'
    },
    {
      name: 'Apex Logistics',
      code: 'VND-308',
      risk: 'Low Risk',
      totalShipments: 92,
      failureRate: '1.4%',
      discrepancies: { label: '0.4%', batch: '0.2%', date: '0.3%', barcode: '0.1%', qty: '0.4%' },
      statusNote: 'Green-lane fast-track receiving active'
    }
  ];

  const trendBars = [
    { hour: '06:00', count: 1420 },
    { hour: '07:00', count: 2150 },
    { hour: '08:00', count: 2890 },
    { hour: '09:00', count: 2340 },
    { hour: '10:00', count: 1050 }
  ];
  const maxTrend = 3000;

  // ============================================================================
  // VIEW A: LINE OPERATOR LOGIN PAGE (WITH MANAGER DASHBOARD ACCESS)
  // ============================================================================
  if (userRole === 'login') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 font-sans select-none">
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                FM
              </div>
              <div>
                <h1 className="font-black text-lg text-slate-900 leading-none">
                  LogiScan<span className="text-indigo-600">OCR</span> • Line Operator Login
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Dock Bay #04 • Conveyor Camera & Manifest Verification
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              CAM-04A READY
            </span>
          </div>

          {/* Primary Line Operator Login Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpStage('select');
              setUserRole('operator');
            }}
            className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/40 space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900">Line Operator Sign-In</div>
                  <div className="text-[11px] text-slate-500">
                    Scan cartons, verify OCR labels & escalate discrepancies
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                OPERATOR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Operator Badge ID
                </label>
                <input
                  type="text"
                  required
                  value={opLoginId}
                  onChange={(e) => setOpLoginId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. OP-402"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Shift PIN / Passcode
                </label>
                <input
                  type="password"
                  required
                  value={opPasscode}
                  onChange={(e) => setOpPasscode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              Login as Line Operator <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Secondary Warehouse Manager Access */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">Warehouse Manager Console</div>
                <div className="text-[11px] text-slate-500">R. Kumar • Full Receiving, Risk & Lot Reports</div>
              </div>
            </div>
            <button
              onClick={() => setUserRole('manager')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Manager UI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW B: LINE OPERATOR WORKSTATION (ZERO-SCROLL 100VH)
  // ============================================================================
  if (userRole === 'operator') {
    const currentItem = opInvoice.items[opItemIndex] || opInvoice.items[0];
    const activeCapture = opCapturedImages[opSelectedImageIdx] || null;
    const pendingCount = vendorInvoices.filter((v) => !completedInvoices.includes(v.id)).length;
    const totalBatchItems = opInvoice.items.length;
    const completedScansCount = Object.keys(opItemHistory).length;
    const pendingScansCount = Math.max(0, totalBatchItems - completedScansCount);

    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 flex flex-col font-sans select-none">
        {/* TOP OPERATOR HEADER */}
        <header className="h-12 bg-slate-950 text-white px-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xs">
              FM
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight">
                LogiScan<span className="text-indigo-400">OCR</span>
              </span>
              <span className="ml-2.5 text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-bold">
                LINE OPERATOR • BAY #04
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className={backendOnline ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                {backendOnline ? 'FastAPI + SQLite: Online' : 'FastAPI: Standby (:8000)'}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-300">
              Badge: <strong className="text-white">{opLoginId}</strong>
            </span>
            <button
              onClick={() => setUserRole('manager')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-300 border border-slate-700 transition-colors"
            >
              Manager Dashboard
            </button>
            <button
              onClick={() => setUserRole('login')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Logout to Login Page"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* OPERATOR MAIN CONTENT (STRICT 100VH) */}
        <main className="flex-1 p-3.5 overflow-hidden flex flex-col gap-2.5">
          {/* INVOICE SELECTION BAR MATCHING REFERENCE SCREENSHOT */}
          <div className="bg-white rounded-2xl p-3 px-4 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs leading-tight">
                    Inbound Manifest
                    <br />
                    Arrival Inbox
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Select vendor manifest to reconcile conveyor camera OCR feeds.
                  </p>
                </div>
                <span className="bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full text-[11px] text-center leading-tight shrink-0">
                  {pendingCount} Invoices
                  <br />
                  Pending
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {vendorInvoices.map((inv) => {
                const isSelected = opInvoice.id === inv.id;
                const isDone = completedInvoices.includes(inv.id);
                const isHighRisk = inv.vendorRisk === 'High Risk';
                return (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setOpInvoice(inv);
                      setOpStage('select');
                      setOpCapturedImages([]);
                      setOpSelectedImageIdx(0);
                      setOpScanStatus(null);
                      setOpIsPassedLocked(false);
                      setOpItemHistory({});
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50/70 hover:bg-slate-100 text-slate-800 border-slate-200/90'
                    }`}
                  >
                    <FileText
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-indigo-200' : isDone ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <div className="text-center leading-snug">
                      <div>
                        {inv.vendor} ({inv.id})
                      </div>
                      {isDone && <div className="text-[9px] font-extrabold uppercase">✓ Completed</div>}
                    </div>
                    {isHighRisk && !isDone && (
                      <span
                        className={`w-2 h-2.5 rounded-full shrink-0 ${
                          isSelected ? 'bg-rose-300' : 'bg-rose-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleStartOperatorScanning}
                className="ml-1 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="leading-tight text-left">
                  Start
                  <br />
                  Scanning
                </span>
              </button>
            </div>
          </div>

          {/* TOP SCAN COUNTER & COLOR-CODED PROGRESS BAR (GREEN, YELLOW, RED) */}
          {opStage === 'scanning' && (
            <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-extrabold">
                    Completed: {completedScansCount} / {totalBatchItems}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono font-extrabold">
                    Pending: {pendingScansCount}
                  </span>
                </div>
                <div className="hidden lg:flex items-center gap-2.5 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Passed (
                    {Object.values(opItemHistory).filter((s) => s === 'passed').length})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Review (
                    {Object.values(opItemHistory).filter((s) => s === 'review').length})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Failed (
                    {Object.values(opItemHistory).filter((s) => s === 'failed').length})
                  </span>
                </div>
              </div>

              {/* Segmented Multi-Color Progress Bar */}
              <div className="flex-1 flex items-center gap-2.5">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/80 p-0.5 gap-0.5">
                  {opInvoice.items.map((item, idx) => {
                    const st = opItemHistory[idx];
                    let barColor = 'bg-slate-200';
                    if (st === 'passed') barColor = 'bg-emerald-500';
                    else if (st === 'review') barColor = 'bg-amber-400';
                    else if (st === 'failed') barColor = 'bg-rose-500';
                    else if (idx === opItemIndex) barColor = 'bg-indigo-300 animate-pulse';

                    return (
                      <div
                        key={item.itemNo}
                        title={`Carton ${idx + 1} (${item.itemNo}): ${st ? st.toUpperCase() : 'PENDING'}`}
                        className={`flex-1 h-full rounded-full transition-all duration-300 ${barColor}`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-mono font-black text-slate-800 w-10 text-right">
                  {Math.round((completedScansCount / Math.max(1, totalBatchItems)) * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* STAGE A: INVOICE SELECTED -> READY FOR START SCANNING */}
          {opStage === 'select' && (
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-extrabold text-slate-900">
                      Selected Manifest: {opInvoice.vendor} ({opInvoice.id})
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        opInvoice.vendorRisk === 'High Risk'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {opInvoice.vendorRisk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    PO: <strong>{opInvoice.po}</strong> • Lot: <strong>{opInvoice.lotNo}</strong> • Total Batch Items:{' '}
                    <strong>{opInvoice.items.length} Cartons</strong>
                  </p>
                </div>

                <button
                  onClick={handleStartOperatorScanning}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Camera className="w-4 h-4" /> Start Scanning Batch
                </button>
              </div>

              <div className="overflow-y-auto flex-1 my-3 rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Item SKU</th>
                      <th className="p-2.5 font-sans">Description</th>
                      <th className="p-2.5">Batch</th>
                      <th className="p-2.5">Manifest Expiry</th>
                      <th className="p-2.5">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {opInvoice.items.map((item, idx) => (
                      <tr key={item.itemNo} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">{item.itemNo}</td>
                        <td className="p-2.5 font-sans font-semibold text-slate-800">{item.name}</td>
                        <td className="p-2.5 text-slate-600">{item.batchNo}</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">{item.manifestExpiry}</td>
                        <td className="p-2.5 font-bold">{item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 shrink-0">
                <span>Optical Camera CAM-04A aligned over conveyor belt.</span>
                <span className="font-bold text-indigo-600">Press "Start Scanning" to activate live camera feed.</span>
              </div>
            </div>
          )}

          {/* STAGE B: VISIBLE LIVE CAMERA (UP TO 4 IMAGES) + GALLERY + MANIFEST AUDIT */}
          {opStage === 'scanning' && (
            <div className="flex-1 grid grid-cols-12 gap-3 overflow-hidden">
              {/* LEFT 5 COLS: VISIBLE LIVE CONVEYOR CAMERA & WEBCAM (UP TO 4 IMAGES) */}
              <div className="col-span-5 bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between text-white overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-extrabold tracking-wide uppercase text-emerald-300">
                      LIVE CAMERA • {cameraMode === 'webcam' ? 'DEVICE WEBCAM' : 'MULTI-ANGLE'} ({opCapturedImages.length}/4)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCameraMode('conveyor')}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                        cameraMode === 'conveyor'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      Conveyor Rig
                    </button>
                    <button
                      onClick={() => setCameraMode('webcam')}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        cameraMode === 'webcam'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Video className="w-3 h-3" /> Live Webcam
                    </button>
                    <button
                      onClick={() => setCameraActive((v) => !v)}
                      className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300"
                    >
                      {cameraActive ? 'ON' : 'Standby'}
                    </button>
                    <span className="text-[11px] font-mono bg-indigo-600/30 border border-indigo-500/40 px-2 py-0.5 rounded-lg text-indigo-200 font-bold">
                      Carton {opItemIndex + 1}/{totalBatchItems}
                    </span>
                  </div>
                </div>

                {/* Live Camera Optical Feed Frame with Webcam Support */}
                <div className="my-2.5 flex-1 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/40 relative flex flex-col items-center justify-center p-3 overflow-hidden">
                  {cameraMode === 'webcam' && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #34d399 1px, transparent 1px), linear-gradient(to bottom, #34d399 1px, transparent 1px)',
                      backgroundSize: '26px 26px'
                    }}
                  />
                  <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-2.5 left-2.5 pointer-events-none" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-2.5 right-2.5 pointer-events-none" />
                  <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-2.5 left-2.5 pointer-events-none" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-2.5 right-2.5 pointer-events-none" />

                  <div className="absolute top-2.5 left-10 text-[10px] font-mono text-emerald-400 bg-slate-950/70 px-2 py-0.5 rounded pointer-events-none">
                    {cameraMode === 'webcam'
                      ? 'WEBCAM STREAM ● ACTIVE (1080P)'
                      : `REC ● 120FPS • ${
                          opCapturedImages.length < 4
                            ? `NEXT: ${captureAngles[opCapturedImages.length].angle.toUpperCase()}`
                            : 'MAX 4 CAPTURES REACHED'
                        }`}
                  </div>

                  {/* Live Carton Target Preview inside Camera */}
                  <div className="z-10 bg-slate-900/85 backdrop-blur-sm border border-slate-700/90 rounded-2xl p-3 text-center max-w-xs w-full shadow-xl">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-300 mb-1">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      {cameraMode === 'webcam' ? 'POINT WEBCAM AT CARTON LABEL' : 'ACTIVE CARTON IN FRAME'}
                    </div>
                    <div className="text-xs font-black text-white mt-0.5 truncate">{currentItem.name}</div>
                    <div className="text-[11px] font-mono text-indigo-300 mt-0.5">
                      {currentItem.itemNo} • {currentItem.batchNo}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Qty: {currentItem.qty} Units • Slot {Math.min(4, opCapturedImages.length + 1)} of 4
                    </div>
                  </div>
                </div>

                {/* Capture Image Button (Multi-Angle or Live Webcam + File Upload) */}
                <div className="flex items-center justify-between gap-2 shrink-0">
                  <button
                    onClick={() => setOpStage('select')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    Back
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={opCapturedImages.length >= 4}
                    title="Upload sample carton photo"
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>

                  {cameraMode === 'webcam' ? (
                    <button
                      onClick={handleCaptureWebcam}
                      disabled={opCapturedImages.length >= 4}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      {opCapturedImages.length >= 4
                        ? 'All 4 Camera Images Captured'
                        : `Snap Photo (${opCapturedImages.length}/4)`}
                    </button>
                  ) : (
                    <button
                      onClick={handleCaptureCarton}
                      disabled={opCapturedImages.length >= 4}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      {opCapturedImages.length >= 4
                        ? 'All 4 Camera Images Captured'
                        : `Capture Source Image (${opCapturedImages.length}/4)`}
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT 7 COLS: 4-IMAGE GALLERY + VIEWER + MANIFEST AUDIT (PASSED / FAILED / REVIEW) */}
              <div className="col-span-7 bg-white rounded-2xl p-3.5 border border-slate-200/90 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      Captured Images ({opCapturedImages.length}/4) & Manifest Verification
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Click any captured thumbnail to inspect • Validate OCR against manifest
                    </p>
                  </div>
                  {activeCapture && (
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                      {activeCapture.cam} • {activeCapture.capturedAt}
                    </span>
                  )}
                </div>

                {opCapturedImages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Camera className="w-10 h-10 mb-2 text-slate-300" />
                    <div className="text-xs font-bold text-slate-600">No Images Captured Yet (0/4)</div>
                    <p className="text-[11px] max-w-xs mt-1">
                      Use <strong>"Capture Image (0/4)"</strong> on the camera panel to take up to 4 angles and load them here for inspection.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between py-1.5 gap-2 overflow-hidden">
                    {/* 4-SLOT INTERACTIVE THUMBNAIL STRIP */}
                    <div className="grid grid-cols-4 gap-2 shrink-0">
                      {[0, 1, 2, 3].map((slotIdx) => {
                        const img = opCapturedImages[slotIdx];
                        const isSelected = opSelectedImageIdx === slotIdx && Boolean(img);
                        return (
                          <button
                            key={slotIdx}
                            disabled={!img}
                            onClick={() => img && setOpSelectedImageIdx(slotIdx)}
                            className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                                : img
                                ? 'bg-amber-50/50 border-amber-300/80 hover:bg-amber-50'
                                : 'bg-slate-50 border-dashed border-slate-200 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-mono font-extrabold text-slate-800">
                                IMG #{slotIdx + 1}
                              </span>
                              {img ? (
                                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 rounded">
                                  {img.confidence}
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono text-slate-400">Empty</span>
                              )}
                            </div>
                            {img && img.imageUrl && (
                              <div className="h-8 w-full rounded overflow-hidden bg-slate-900 my-0.5 border border-slate-200">
                                <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="text-[10px] font-semibold text-slate-600 truncate mt-0.5">
                              {img ? img.angle : 'Click Capture'}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* ACTIVE CAPTURED IMAGE PREVIEW + SIDE-BY-SIDE MANIFEST AUDIT FOR FAILED / REVIEW */}
                    {activeCapture && (
                      <div className="grid grid-cols-12 gap-2.5 items-stretch flex-1 overflow-hidden">
                        {/* Left: Selected Captured Carton Label / Image */}
                        <div
                          className={`${
                            opScanStatus === 'failed' || opScanStatus === 'review' ? 'col-span-6' : 'col-span-12'
                          } flex items-center justify-center overflow-hidden`}
                        >
                          {activeCapture.imageUrl ? (
                            <div className="w-full max-w-[340px] max-h-[310px] h-full rounded-2xl p-2 border-4 border-[#b5895a] bg-slate-900 relative shadow-inner flex flex-col items-center justify-center overflow-hidden">
                              <div className="absolute top-2 left-2 z-10 bg-slate-950/85 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-emerald-300 border border-slate-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {activeCapture.cam} • {activeCapture.angle}
                              </div>
                              <img
                                src={activeCapture.imageUrl}
                                alt="Captured Carton"
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-full max-w-[340px] rounded-2xl p-3 border-4 border-[#b5895a] shadow-inner relative"
                              style={{
                                backgroundColor: '#d2a679',
                                backgroundImage: 'radial-gradient(#b5895a 0.75px, transparent 0.75px)',
                                backgroundSize: '10px 10px'
                              }}
                            >
                              <div className="flex items-start justify-between gap-2 pb-1.5 border-b-2 border-[#9e7347]/60">
                                <div>
                                  <div className="text-[9px] font-mono font-bold text-[#4a3219]">
                                    IMG #{activeCapture.captureId} • {activeCapture.angle.toUpperCase()}
                                  </div>
                                  <div className="text-xs font-mono font-black text-[#2b1b0c] mt-0.5">
                                    {activeCapture.name}
                                  </div>
                                </div>
                                <div className="bg-white px-2 py-0.5 rounded border border-slate-400 text-[9px] font-mono font-extrabold text-slate-900 shrink-0">
                                  {activeCapture.itemNo}
                                </div>
                              </div>

                            <div className="grid grid-cols-2 gap-1.5 mt-2 font-mono">
                              <div className="bg-[#e3be96]/90 p-1.5 rounded-lg">
                                <div className="text-[8px] font-bold text-[#5c3e21]">BATCH NO:</div>
                                <div className="text-[11px] font-black text-[#1f1308]">{activeCapture.batchNo}</div>
                              </div>
                              <div className="bg-[#e3be96]/90 p-1.5 rounded-lg">
                                <div className="text-[8px] font-bold text-[#5c3e21]">MRP:</div>
                                <div className="text-[11px] font-black text-[#1f1308]">{activeCapture.mrp}</div>
                              </div>
                              <div className="bg-[#e3be96]/90 p-1.5 rounded-lg">
                                <div className="text-[8px] font-bold text-[#5c3e21]">MFG DATE:</div>
                                <div className="text-[11px] font-black text-[#1f1308]">{activeCapture.mfgDate}</div>
                              </div>
                              <div
                                className={`p-1.5 rounded-lg ${
                                  activeCapture.expiryDate !== activeCapture.manifestExpiry || opScanStatus === 'failed'
                                    ? 'bg-rose-50 border-2 border-rose-600'
                                    : opScanStatus === 'review'
                                    ? 'bg-amber-50 border-2 border-amber-500'
                                    : 'bg-emerald-50 border border-emerald-500'
                                }`}
                              >
                                <div className="text-[8px] font-bold text-[#5c3e21]">EXPIRY DATE:</div>
                                <div
                                  className={`text-[11px] font-black ${
                                    activeCapture.expiryDate !== activeCapture.manifestExpiry || opScanStatus === 'failed'
                                      ? 'text-rose-700'
                                      : opScanStatus === 'review'
                                      ? 'text-amber-700'
                                      : 'text-emerald-800'
                                  }`}
                                >
                                  {activeCapture.expiryDate}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        </div>

                        {/* Right: Manager-Style Exception / Review Manifest Audit Panel (Green = Correct, Red = Mismatch + Override) */}
                        {(opScanStatus === 'failed' || opScanStatus === 'review') && (
                          <div className="col-span-6 rounded-2xl border-2 border-slate-300 bg-slate-50/95 p-3.5 flex flex-col justify-between text-xs overflow-y-auto max-h-full space-y-3 shadow-sm">
                            <div>
                              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                                <span
                                  className={`font-black uppercase text-xs tracking-wider ${
                                    opScanStatus === 'failed' ? 'text-rose-700' : 'text-amber-800'
                                  }`}
                                >
                                  {opScanStatus === 'failed'
                                    ? 'Exception Manifest Audit'
                                    : 'Review Quality & Manifest Audit'}
                                </span>
                                <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                                  {activeCapture.itemNo}
                                </span>
                              </div>

                              {/* Green = Correct, Red = Mismatch Rows */}
                              <div className="space-y-2 font-mono text-xs">
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950">
                                  <span className="font-sans font-bold text-slate-700">Item SKU:</span>
                                  <span className="font-bold text-emerald-800">{activeCapture.itemNo} ✓ Match</span>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950">
                                  <span className="font-sans font-bold text-slate-700">Batch Code:</span>
                                  <span className="font-bold text-emerald-800">{activeCapture.batchNo} ✓ Match</span>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950">
                                  <span className="font-sans font-bold text-slate-700">Mfg. Date:</span>
                                  <span className="font-bold text-emerald-800">{activeCapture.mfgDate} ✓ Match</span>
                                </div>
                                {activeCapture.expiryDate !== activeCapture.manifestExpiry || opScanStatus === 'failed' ? (
                                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-rose-50 border-2 border-rose-500 text-rose-950 shadow-xs">
                                    <span className="font-sans font-extrabold text-rose-900">Expiry Date:</span>
                                    <span className="font-black text-rose-700">
                                      {activeCapture.expiryDate} ≠ {activeCapture.manifestExpiry} (!)
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-amber-50 border-2 border-amber-400 text-amber-950 shadow-xs">
                                    <span className="font-sans font-extrabold text-amber-900">Expiry / Print:</span>
                                    <span className="font-black text-amber-800">
                                      {activeCapture.expiryDate} (Low Print Contrast)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* False Negative Override Box */}
                            <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-2">
                              <div className="text-xs font-black text-slate-800">
                                False Negative Override (Operator Verified):
                              </div>
                              <input
                                type="text"
                                value={opOverrideReason}
                                onChange={(e) => setOpOverrideReason(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
                              />
                              <button
                                onClick={handleOperatorOverridePass}
                                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Override False Negative & Pass
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3 STATUS TABS: PASSED (GREEN), FAILED (RED - DISABLED IF PASSED), REVIEW (YELLOW - DISABLED IF PASSED) */}
                    <div className="space-y-2 shrink-0">
                      <div className="grid grid-cols-3 gap-2">
                        {/* PASSED (GREEN) */}
                        <button
                          onClick={() => handleSelectDisposition('passed')}
                          className={`py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border-2 transition-all ${
                            opScanStatus === 'passed'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-150'
                          }`}
                        >
                          <Check className="w-4 h-4" /> Passed (Pass)
                        </button>

                        {/* FAILED (RED) - Disabled once Passed */}
                        <button
                          disabled={opIsPassedLocked}
                          onClick={() => handleSelectDisposition('failed')}
                          className={`py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border-2 transition-all ${
                            opIsPassedLocked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                              : opScanStatus === 'failed'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <XCircle className="w-4 h-4" /> Failed (Red)
                        </button>

                        {/* REVIEW (YELLOW) - Disabled once Passed */}
                        <button
                          disabled={opIsPassedLocked}
                          onClick={() => handleSelectDisposition('review')}
                          className={`py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border-2 transition-all ${
                            opIsPassedLocked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                              : opScanStatus === 'review'
                              ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4" /> Review (Yellow)
                        </button>
                      </div>

                      {/* IF REVIEW -> OPTION TO RESCAN AVAILABLE THEN PASS IT */}
                      {opScanStatus === 'review' && (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-900">
                            Review flagged: Rescan active image or override false negative above.
                          </span>
                          <button
                            onClick={handleOperatorRescan}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-extrabold flex items-center gap-1.5 shrink-0"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Rescan & Pass
                          </button>
                        </div>
                      )}

                      {/* IF FAIL -> TRIGGER MAIL TO MANAGER THEN SHOW GO NEXT */}
                      {opScanStatus === 'failed' && (
                        <div className="p-2 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-between text-xs gap-2">
                          <span className="font-bold text-rose-900">
                            {opMailSent
                              ? '✓ Alert mail triggered to Manager (R. Kumar).'
                              : 'Mismatch confirmed: Trigger mail to Manager or override false negative.'}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            {!opMailSent ? (
                              <button
                                onClick={handleTriggerManagerMail}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-extrabold flex items-center gap-1.5"
                              >
                                <Mail className="w-3.5 h-3.5" /> Trigger Mail to Manager
                              </button>
                            ) : (
                              <button
                                onClick={handleOperatorNextItem}
                                className="px-3.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-extrabold flex items-center gap-1.5"
                              >
                                Go Next <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* IF PASSED -> LOCKED & GO NEXT */}
                      {opScanStatus === 'passed' && (
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900">
                            ✓ Passed OCR verification (Failed & Review locked). Proceed to next carton.
                          </span>
                          <button
                            onClick={handleOperatorNextItem}
                            className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-extrabold flex items-center gap-1.5"
                          >
                            Go Next <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE C: ENTIRE BATCH / INVOICE COMPLETED -> RETURN TO SELECT NEXT PENDING INVOICE */}
          {opStage === 'completed' && (
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Entire Batch Completed
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Invoice {opInvoice.id} ({opInvoice.vendor}) Complete
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  All {opInvoice.items.length} cartons in {opInvoice.lotNo} have been processed. Return to select the next pending invoice.
                </p>
              </div>
              <button
                onClick={handleReturnToPendingInvoices}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                Select Next Pending Invoice <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================================
  // VIEW C: WAREHOUSE MANAGER DASHBOARD (RETAINED INTACT, ZERO-SCROLL 100VH)
  // ============================================================================
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 flex font-sans select-none">
      {/* SLIM LEFT SIDEBAR (w-44) */}
      <aside className="w-44 bg-slate-950 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand Logo */}
          <div className="px-3.5 py-3.5 border-b border-slate-800/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xs shadow-md shadow-indigo-900/40 shrink-0">
              FM
            </div>
            <div className="truncate">
              <div className="font-extrabold text-xs tracking-tight text-white leading-none">
                LogiScan<span className="text-indigo-400">OCR</span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
                Dock Bay #04 • Live
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-2.5 mt-3 space-y-1">
            {[
              { name: 'Receiving', icon: Box },
              { name: 'Inbound Inbox', icon: FileSpreadsheet, badge: '3' },
              { name: 'Vendors', icon: Users },
              { name: 'Reports', icon: FileText },
              { name: 'Settings', icon: SettingsIcon }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-900/50 font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/40 text-purple-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch to Line Operator + Camera Status */}
        <div className="p-2.5 m-2.5 space-y-2">
          <button
            onClick={() => setUserRole('operator')}
            className="w-full py-2 px-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-[10px] font-extrabold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" /> Line Operator UI
          </button>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-semibold">OCR Vision Rig</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="text-slate-300 font-mono text-[9px]">CAM-04A • 120 FPS</div>
            <div className="text-slate-500 text-[9px] mt-0.5">Active Lot: {selectedInvoice.lotNo}</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT SHELL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER BAR */}
        <header className="h-11 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">
              {activeTab === 'Receiving' && 'Live Conveyor OCR Receiving'}
              {activeTab === 'Inbound Inbox' && 'Inbound Manifest Arrival Inbox'}
              {activeTab === 'Vendors' && 'Vendor Risk & Shipment Reliability'}
              {activeTab === 'Reports' && 'Official Lot Verification Report'}
              {activeTab === 'Settings' && 'OCR Vision & Threshold Settings'}
            </h1>
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200/70 px-2 py-0.5 rounded-md font-bold">
              {selectedInvoice.vendor} • {selectedInvoice.id}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('Inbound Inbox')}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              3 Manifests Loaded
            </button>
            <div className="relative p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                RK
              </div>
              <span className="text-xs font-bold text-slate-700">R. Kumar</span>
              <button
                onClick={() => setUserRole('login')}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-rose-600"
                title="Switch Role / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* TAB 1: RECEIVING WORKSPACE */}
        {activeTab === 'Receiving' && (
          <main className="p-3.5 flex-1 overflow-hidden flex flex-col gap-2.5">
            {selectedInvoice.vendorRisk === 'High Risk' && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-extrabold text-rose-900">
                    HIGH RISK VENDOR ALERT: {selectedInvoice.vendor} ({selectedInvoice.id})
                  </span>
                  <span className="text-rose-700 text-[11px]">
                    • Historical Failure Rate: 29.2%. Increased label audit active.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('Inbound Inbox')}
                    className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-rose-200 px-2 py-0.5 rounded-lg transition-colors"
                  >
                    Switch Manifest
                  </button>
                  <span className="font-mono bg-rose-200/80 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    RISK: RED
                  </span>
                </div>
              </div>
            )}

            {/* 1. TOP INTERACTIVE KPI CARDS */}
            <div className="grid grid-cols-5 gap-2.5 shrink-0">
              <div
                onClick={() => setKpiFilter('all')}
                className={`bg-white rounded-2xl p-3 border cursor-pointer transition-all ${
                  kpiFilter === 'all' ? 'border-indigo-500 ring-2 ring-indigo-500/15' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Expected Manifest</span>
                  <Package className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1">
                  {selectedInvoice.expectedQty.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">PO: {selectedInvoice.po}</div>
              </div>

              <div
                onClick={() => setKpiFilter('all')}
                className="bg-white rounded-2xl p-3 border border-slate-200/80"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Processed (OCR)</span>
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1">
                  {processedCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-sky-600 font-bold mt-0.5">{progressPct}% Conveyor Complete</div>
              </div>

              <div
                onClick={() => setKpiFilter('verified')}
                className={`bg-white rounded-2xl p-3 border cursor-pointer transition-all ${
                  kpiFilter === 'verified' ? 'border-emerald-500 ring-2 ring-emerald-500/15' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Verified Matched</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 font-mono mt-1">
                  {verifiedCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Click to filter matched</div>
              </div>

              <div
                onClick={() => setKpiFilter('exceptions')}
                className={`bg-white rounded-2xl p-3 border cursor-pointer transition-all ${
                  kpiFilter === 'exceptions' ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Exceptions Flagged</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="text-xl font-black text-rose-600 font-mono mt-1">
                  {exceptionCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Click to filter exceptions</div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">Remaining Units</div>
                  <div className="text-xl font-black text-slate-900 font-mono mt-1">
                    {remainingCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">In staging queue</div>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-600 transition-all duration-300"
                      strokeDasharray={`${progressPct}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-extrabold text-slate-800">{progressPct}%</span>
                </div>
              </div>
            </div>

            {/* 2. LOWER SPLIT: RECENT SCANNED ITEMS + EXPANDED INSPECTION WORKSPACE */}
            <div className="grid grid-cols-12 gap-3 flex-1 overflow-hidden">
              <div className="col-span-5 flex flex-col gap-2.5 overflow-hidden">
                <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800">Conveyor Scan Volume (Units / Hr)</span>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      Peak: 2,890/hr
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 items-end h-16 pt-2 px-1">
                    {trendBars.map((b) => {
                      const heightPct = Math.round((b.count / maxTrend) * 100);
                      return (
                        <div key={b.hour} className="flex flex-col items-center gap-1 h-full justify-end">
                          <span className="text-[9px] font-mono font-bold text-slate-600">{b.count}</span>
                          <div className="w-full bg-slate-100 rounded-t-md h-10 flex items-end overflow-hidden">
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md transition-all"
                            />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">{b.hour}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-slate-200/80 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-extrabold text-slate-900">Recent Scanned Items</h3>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {filteredItems.length} SKUs
                      </span>
                    </div>
                    {kpiFilter !== 'all' && (
                      <button
                        onClick={() => setKpiFilter('all')}
                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto flex-1 rounded-xl border border-slate-100">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 sticky top-0">
                        <tr>
                          <th className="p-2">Item / SKU</th>
                          <th className="p-2">Batch</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredItems.map((item) => {
                          const isSelected = activeItem.itemNo === item.itemNo;
                          return (
                            <tr
                              key={item.itemNo}
                              onClick={() => {
                                setActiveItem(item);
                                setShowDetailedExceptionView(false);
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-indigo-50/90' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="p-2">
                                <div className="font-mono font-bold text-slate-900">{item.itemNo}</div>
                                <div className="text-[10px] text-slate-500 truncate max-w-[125px]">{item.name}</div>
                              </td>
                              <td className="p-2 font-mono text-slate-600">{item.batchNo}</td>
                              <td className="p-2 font-mono font-bold text-slate-800">{item.qty}</td>
                              <td className="p-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.status === 'Matched'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {item.status === 'Matched' ? 'Matched' : 'Mismatch'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-span-7 bg-white rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between overflow-hidden">
                {!showDetailedExceptionView ? (
                  <>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 shrink-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-extrabold text-slate-900">
                            Selected Item – Inspection
                          </h2>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                              activeItem.status === 'Matched'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {activeItem.status === 'Matched'
                              ? 'Verified Matched'
                              : activeItem.exceptionType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Live OCR label extraction vs. vendor manifest reconciliation
                        </p>
                      </div>

                      {activeItem.status === 'Exception' && (
                        <button
                          onClick={() => setShowDetailedExceptionView(true)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          Review Exception <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-4 my-auto py-2 items-center flex-1 overflow-hidden">
                      <div className="col-span-7 flex items-center justify-center h-full">
                        <div
                          className="w-full max-w-[340px] rounded-2xl p-4 border-4 border-[#b5895a] shadow-inner relative"
                          style={{
                            backgroundColor: '#d2a679',
                            backgroundImage:
                              'radial-gradient(#b5895a 0.75px, transparent 0.75px)',
                            backgroundSize: '10px 10px'
                          }}
                        >
                          <div className="flex items-start justify-between gap-2 pb-2.5 border-b-2 border-[#9e7347]/60">
                            <div>
                              <div className="text-[9px] font-mono font-bold tracking-wider text-[#4a3219] uppercase">
                                FRAGILE • LOGISTICS CARTON
                              </div>
                              <div className="text-sm font-mono font-black text-[#2b1b0c] mt-1 tracking-tight">
                                {activeItem.name}
                              </div>
                            </div>

                            <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-400 text-center shrink-0 shadow-2xs">
                              <div className="flex items-center justify-center gap-[1.5px] h-6">
                                {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2].map((w, i) => (
                                  <span
                                    key={i}
                                    style={{ width: `${w}px` }}
                                    className="h-full bg-slate-900 inline-block"
                                  />
                                ))}
                              </div>
                              <div className="text-[8px] font-mono font-bold text-slate-800 mt-0.5">
                                {activeItem.itemNo}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 mt-3 font-mono">
                            <div className="bg-[#e3be96]/90 p-2 rounded-lg border border-[#b5895a]/50">
                              <div className="text-[9px] font-bold text-[#5c3e21]">BATCH NO:</div>
                              <div className="text-xs font-black text-[#1f1308] mt-0.5">
                                {activeItem.batchNo}
                              </div>
                            </div>

                            <div className="bg-[#e3be96]/90 p-2 rounded-lg border border-[#b5895a]/50">
                              <div className="text-[9px] font-bold text-[#5c3e21]">MAX RETAIL PRICE:</div>
                              <div className="text-xs font-black text-[#1f1308] mt-0.5">
                                {activeItem.mrp}
                              </div>
                            </div>

                            <div className="bg-[#e3be96]/90 p-2 rounded-lg border border-[#b5895a]/50">
                              <div className="text-[9px] font-bold text-[#5c3e21]">MFG DATE:</div>
                              <div className="text-xs font-black text-[#1f1308] mt-0.5">
                                {activeItem.mfgDate}
                              </div>
                            </div>

                            <div
                              className={`p-2 rounded-lg relative transition-all ${
                                activeItem.expiryDate !== activeItem.manifestExpiry
                                  ? 'bg-rose-50 border-2 border-rose-600 shadow-sm'
                                  : 'bg-[#e3be96]/90 border border-[#b5895a]/50'
                              }`}
                            >
                              {activeItem.expiryDate !== activeItem.manifestExpiry && (
                                <span className="absolute -top-2.5 right-1.5 bg-rose-600 text-white text-[8px] font-sans font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                                  MISMATCH!
                                </span>
                              )}
                              <div
                                className={`text-[9px] font-bold ${
                                  activeItem.expiryDate !== activeItem.manifestExpiry
                                    ? 'text-rose-700'
                                    : 'text-[#5c3e21]'
                                }`}
                              >
                                EXPIRY DATE:
                              </div>
                              <div
                                className={`text-xs font-black mt-0.5 ${
                                  activeItem.expiryDate !== activeItem.manifestExpiry
                                    ? 'text-rose-700'
                                    : 'text-[#1f1308]'
                                }`}
                              >
                                {activeItem.expiryDate}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-5 flex flex-col gap-2.5">
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                          <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
                            OCR vs. Manifest Audit
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Item SKU:</span>
                            <span className="font-mono font-bold text-slate-900">{activeItem.itemNo} ✓</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Batch Code:</span>
                            <span className="font-mono font-bold text-slate-900">{activeItem.batchNo} ✓</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Scanned Exp:</span>
                            <span
                              className={`font-mono font-bold ${
                                activeItem.expiryDate !== activeItem.manifestExpiry
                                  ? 'text-rose-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {activeItem.expiryDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Manifest Exp:</span>
                            <span className="font-mono font-bold text-emerald-700">
                              {activeItem.manifestExpiry}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Lot Quantity:</span>
                            <span className="font-mono font-bold text-slate-900">{activeItem.qty} Units</span>
                          </div>
                        </div>

                        <div
                          className={`rounded-xl p-2.5 border text-[11px] leading-snug ${
                            activeItem.status === 'Exception'
                              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                              : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                          }`}
                        >
                          <span className="font-extrabold block mb-0.5">OCR Engine Note:</span>
                          {activeItem.context}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
                      <span className="text-[11px] text-slate-500">
                        Scanned at <strong className="text-slate-700">{activeItem.time}</strong> • Camera Confidence: <strong className="text-emerald-700">99.4%</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('Reports')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
                        >
                          Lot Report
                        </button>
                        {activeItem.status === 'Exception' && (
                          <button
                            onClick={() => setShowDetailedExceptionView(true)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                          >
                            Resolve Discrepancy
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-between h-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => setShowDetailedExceptionView(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center gap-1 font-bold"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <span className="text-slate-300">|</span>
                        <span className="font-extrabold text-slate-900">Exception Details</span>
                        <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {activeItem.exceptionType}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">{activeItem.itemNo}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-2 overflow-y-auto pr-1">
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-2.5 text-xs space-y-1.5">
                        <div className="font-extrabold text-indigo-900 text-[11px]">SCANNED FROM ITEM (OCR)</div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Item No.</span>
                          <span className="font-mono font-bold">{activeItem.itemNo} ✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Batch No.</span>
                          <span className="font-mono font-bold">{activeItem.batchNo} ✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Mfg. Date</span>
                          <span className="font-mono font-bold">{activeItem.mfgDate} ✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Expiry Date</span>
                          <span className="font-mono font-bold text-rose-600">{activeItem.expiryDate} (!)</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-2.5 text-xs space-y-1.5">
                        <div className="font-extrabold text-emerald-900 text-[11px]">VENDOR MANIFEST</div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Item No.</span>
                          <span className="font-mono font-bold">{activeItem.itemNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Batch No.</span>
                          <span className="font-mono font-bold">{activeItem.batchNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Mfg. Date</span>
                          <span className="font-mono font-bold">{activeItem.mfgDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Expiry Date</span>
                          <span className="font-mono font-bold text-emerald-700">{activeItem.manifestExpiry}</span>
                        </div>
                      </div>

                      <div className="col-span-2 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-2 text-xs">
                        <div className="font-extrabold text-slate-800 text-[11px]">Recommended Supervisor Action</div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'accept_variance', label: 'Accept w/ Variance' },
                            { id: 'quarantine', label: 'Hold in Quarantine' },
                            { id: 'reject_rtv', label: 'Reject (RTV)' }
                          ].map((opt) => (
                            <label
                              key={opt.id}
                              className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer font-bold text-[11px] ${
                                recommendedAction === opt.id
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="action"
                                checked={recommendedAction === opt.id}
                                onChange={() => setRecommendedAction(opt.id)}
                                className="accent-indigo-600"
                              />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add audit remarks..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 shrink-0">
                      <button
                        onClick={() => setShowDetailedExceptionView(false)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowDetailedExceptionView(false)}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Update & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}

        {/* TAB 2: INBOUND INBOX */}
        {activeTab === 'Inbound Inbox' && (
          <main className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-3.5 px-4 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                      Inbound Manifest
                      <br />
                      Arrival Inbox
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Select vendor manifest to reconcile conveyor camera OCR feeds.
                    </p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs text-center leading-tight shrink-0">
                    3 Invoices
                    <br />
                    Loaded
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {vendorInvoices.map((inv) => {
                  const isSelected = selectedInvoice.id === inv.id;
                  const isHighRisk = inv.vendorRisk === 'High Risk';
                  return (
                    <button
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50/70 hover:bg-slate-100 text-slate-800 border-slate-200/90'
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      />
                      <div className="text-center leading-snug">
                        <div>
                          {inv.vendor} ({inv.id})
                        </div>
                      </div>
                      {isHighRisk && (
                        <span
                          className={`w-2 h-3 rounded-full shrink-0 ${
                            isSelected ? 'bg-rose-300' : 'bg-rose-500'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={handleSimulateScan}
                  disabled={processedCount >= selectedInvoice.expectedQty}
                  className="ml-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="leading-tight text-left">
                    Simulate
                    <br />
                    Scan
                  </span>
                </button>
              </div>
            </div>

            {selectedInvoice.vendorRisk === 'High Risk' && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-2 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-extrabold text-rose-900">
                    HIGH RISK VENDOR ALERT: {selectedInvoice.vendor}
                  </span>
                  <span className="text-rose-700">
                    • Historical Failure Rate: 29.2%. Multi-pass OCR verification enforced on incoming cartons.
                  </span>
                </div>
                <span className="font-mono bg-rose-200/80 text-rose-900 font-bold px-2.5 py-0.5 rounded text-[10px]">
                  RISK LEVEL: RED
                </span>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-[10px] font-sans text-slate-400 block">Selected Invoice</span>
                    <strong className="text-sm text-indigo-700">{selectedInvoice.id}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans text-slate-400 block">Vendor Name</span>
                    <strong className="text-sm font-sans text-slate-900">{selectedInvoice.vendor}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans text-slate-400 block">Purchase Order</span>
                    <strong className="text-slate-800">{selectedInvoice.po}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans text-slate-400 block">Assigned Lot</span>
                    <strong className="text-slate-800">{selectedInvoice.lotNo}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans text-slate-400 block">Live Scan Progress</span>
                    <strong className="text-emerald-700">
                      {processedCount.toLocaleString()} / {selectedInvoice.expectedQty.toLocaleString()} (
                      {Math.round((processedCount / selectedInvoice.expectedQty) * 100)}%)
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('Receiving')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all"
                >
                  Open in Live Receiving <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">Item No.</th>
                      <th className="p-2.5 font-sans">Item Description</th>
                      <th className="p-2.5">Batch No.</th>
                      <th className="p-2.5">MRP</th>
                      <th className="p-2.5">Mfg. Date</th>
                      <th className="p-2.5">Manifest Exp.</th>
                      <th className="p-2.5">Scanned Exp.</th>
                      <th className="p-2.5">Total Qty</th>
                      <th className="p-2.5">OCR Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr
                        key={idx}
                        onClick={() => {
                          setActiveItem(item);
                          setActiveTab('Receiving');
                        }}
                        className="hover:bg-indigo-50/60 cursor-pointer transition-colors"
                      >
                        <td className="p-2.5 font-bold text-slate-900">{item.itemNo}</td>
                        <td className="p-2.5 font-sans font-medium text-slate-800">{item.name}</td>
                        <td className="p-2.5 text-slate-600">{item.batchNo}</td>
                        <td className="p-2.5 font-bold text-slate-800">{item.mrp}</td>
                        <td className="p-2.5 text-slate-600">{item.mfgDate}</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">{item.manifestExpiry}</td>
                        <td
                          className={`p-2.5 font-semibold ${
                            item.expiryDate !== item.manifestExpiry ? 'text-rose-600' : 'text-slate-600'
                          }`}
                        >
                          {item.expiryDate}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900">{item.qty.toLocaleString()}</td>
                        <td className="p-2.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Matched'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status === 'Matched' ? '✓ Matched' : `! ${item.exceptionType}`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* TAB 3: VENDORS */}
        {activeTab === 'Vendors' && (
          <main className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {vendorsRiskData.map((v) => {
                const badgeStyle =
                  v.risk === 'High Risk'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : v.risk === 'Medium Risk'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200';
                return (
                  <div key={v.code} className="bg-white rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400">{v.code}</span>
                        <h3 className="font-extrabold text-sm text-slate-900">{v.name}</h3>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeStyle}`}>
                        {v.risk}
                      </span>
                    </div>

                    <div className="my-3 flex items-baseline justify-between border-y border-slate-100 py-2.5">
                      <div>
                        <span className="text-[10px] text-slate-500 block">OCR Failure Rate</span>
                        <span className="text-xl font-black font-mono text-slate-900">{v.failureRate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Shipments Audited</span>
                        <span className="text-sm font-bold font-mono text-slate-800">{v.totalShipments} Lots</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      {v.statusNote}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex-1 flex flex-col overflow-hidden">
              <h3 className="font-extrabold text-xs text-slate-900 mb-2.5 shrink-0">
                Historical Discrepancy Breakdown by Attribute
              </h3>
              <div className="overflow-y-auto flex-1 rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Vendor Name</th>
                      <th className="p-2.5">Risk Tier</th>
                      <th className="p-2.5">Label Print Error</th>
                      <th className="p-2.5">Batch Mismatch</th>
                      <th className="p-2.5">Expiry Date Error</th>
                      <th className="p-2.5">Barcode Read Fail</th>
                      <th className="p-2.5">Qty Short/Over</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {vendorsRiskData.map((v) => (
                      <tr key={v.code} className="hover:bg-slate-50">
                        <td className="p-2.5 font-sans font-bold text-slate-900">{v.name}</td>
                        <td className="p-2.5 font-sans font-bold">{v.risk}</td>
                        <td className="p-2.5">{v.discrepancies.label}</td>
                        <td className="p-2.5">{v.discrepancies.batch}</td>
                        <td className="p-2.5">{v.discrepancies.date}</td>
                        <td className="p-2.5">{v.discrepancies.barcode}</td>
                        <td className="p-2.5">{v.discrepancies.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* TAB 4: REPORTS */}
        {activeTab === 'Reports' && (
          <main className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">
                      LOT VERIFICATION REPORT • {selectedInvoice.lotNo}
                    </h2>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      CONDITIONAL RELEASE (VARIANCE LOGGED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vendor: <strong>{selectedInvoice.vendor}</strong> • Invoice: <strong>{selectedInvoice.id}</strong> • PO: <strong>{selectedInvoice.po}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button
                    onClick={() => {}}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Export PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 my-2 shrink-0">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] text-slate-500 font-semibold">Manifest Expected</div>
                  <div className="text-lg font-black font-mono text-slate-900 mt-0.5">
                    {selectedInvoice.expectedQty.toLocaleString()} Units
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-[11px] text-emerald-700 font-semibold">OCR Verified Clean</div>
                  <div className="text-lg font-black font-mono text-emerald-800 mt-0.5">
                    {verifiedCount.toLocaleString()} Units
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                  <div className="text-[11px] text-rose-700 font-semibold">Flagged Exceptions</div>
                  <div className="text-lg font-black font-mono text-rose-800 mt-0.5">
                    {exceptionCount.toLocaleString()} Units
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                  <div className="text-[11px] text-indigo-700 font-semibold">Lot Accuracy Score</div>
                  <div className="text-lg font-black font-mono text-indigo-900 mt-0.5">
                    {((verifiedCount / Math.max(1, processedCount)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 rounded-xl border border-slate-200/80 my-1">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5 font-sans">Item Name</th>
                      <th className="p-2.5">Batch</th>
                      <th className="p-2.5">Expiry (OCR / Manifest)</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Disposition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.itemNo}>
                        <td className="p-2.5 font-bold text-slate-900">{item.itemNo}</td>
                        <td className="p-2.5 font-sans text-slate-800">{item.name}</td>
                        <td className="p-2.5 text-slate-600">{item.batchNo}</td>
                        <td className="p-2.5">
                          {item.expiryDate} / {item.manifestExpiry}
                        </td>
                        <td className="p-2.5 font-bold">{item.qty}</td>
                        <td className="p-2.5 font-sans font-bold">
                          {item.status === 'Matched' ? (
                            <span className="text-emerald-700">Putaway Approved</span>
                          ) : (
                            <span className="text-amber-700">Supervisor Override Logged</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                <span>Generated automatically by LogiScan OCR Engine v4.2</span>
                <span>Sign-off: R. Kumar (Dock Supervisor)</span>
              </div>
            </div>
          </main>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'Settings' && (
          <main className="p-4 flex-1 overflow-hidden">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 max-w-2xl space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900">Conveyor OCR & Tolerance Configuration</h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div>
                    <div className="font-bold text-slate-900">Minimum OCR Confidence Threshold</div>
                    <div className="text-slate-500 text-[11px]">Auto-flag cartons below confidence score</div>
                  </div>
                  <span className="font-mono font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">98.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div>
                    <div className="font-bold text-slate-900">High-Risk Vendor Dual-Scan Rule</div>
                    <div className="text-slate-500 text-[11px]">Enforce top + side camera OCR verification for Red-tier vendors</div>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">ENABLED</span>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}