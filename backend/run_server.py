import uvicorn
import os

if __name__ == "__main__":
    print("=" * 60)
    print("Starting LogiScan OCR Warehouse Reconciler Backend...")
    print("FastAPI listening on: http://127.0.0.1:8000")
    print("Interactive Swagger UI docs: http://127.0.0.1:8000/docs")
    print("Static Images URL: http://127.0.0.1:8000/static/carton_images/")
    print("=" * 60)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

