from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import uuid

from services.detector import detect_waste


app = FastAPI(title="KABADIWALA AI Backend")


# Allow your Next.js frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "KABADIWALA AI Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/v1/waste/detect")
async def detect(image: UploadFile = File(...)):

    # Check that an image was uploaded
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image."
        )

    try:
        # Read uploaded image
        image_bytes = await image.read()

        # Convert bytes to PIL image
        pil_image = Image.open(BytesIO(image_bytes)).convert("RGB")

        # Run YOLO
        detections = detect_waste(pil_image)

        # Calculate total estimated value
        total_value = sum(
    detection.get("estimated_value") or 0
    for detection in detections
)

        return {
            "success": True,
            "image_id": f"img_{uuid.uuid4().hex[:12]}",
            "detections": detections,
            "total_estimated_value": total_value,
            "currency": "INR"
        }

    except Exception as e:
        print("Detection error:", e)

        raise HTTPException(
            status_code=500,
            detail="AI detection failed."
        )