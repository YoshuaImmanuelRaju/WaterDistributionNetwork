from fastapi import APIRouter, UploadFile, File
from services.uploadService import process_epanet_upload

router = APIRouter(
    prefix="/networks",
    tags=["Networks"]
)

@router.post("/upload")
async def upload_network(file: UploadFile = File(...)):
    return await process_epanet_upload(file)
