import random
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
from services.uploadService import process_epanet_upload
from store.networkStore import networks

router = APIRouter(
    prefix="/networks",
    tags=["Networks"]
)

# ================= PYDANTIC MODELS =================
class AnomalyItem(BaseModel):
    node: str
    type: str
    message: str

class OptimizationRequest(BaseModel):
    anomalies: List[AnomalyItem]
    hour: int = 0

# ================= UPLOAD ENDPOINT =================
@router.post("/upload")
async def upload_network(file: UploadFile = File(...)):
    """Upload EPANET .inp file and process it"""
    try:
        if not file.filename.endswith(".inp"):
            raise HTTPException(status_code=400, detail="Only .inp files are supported")
        network = await process_epanet_upload(file)
        return network
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ================= GET NETWORK ENDPOINT =================
@router.get("/{network_id}")
async def get_network(network_id: str):
    """Fetch the latest network data"""
    for net in networks:
        if net["id"] == network_id:
            return net
    raise HTTPException(status_code=404, detail="Network not found")

# ================= NEW: OPTIMIZATION ENDPOINT =================
@router.post("/{network_id}/optimize")
async def optimize_network(network_id: str, req: OptimizationRequest):
    recommendations = []

    for anomaly in req.anomalies:
        if anomaly.type == "LEAK":
            recommendations.append({
                "node": anomaly.node,
                "type": "LEAK",
                "title": "Schedule Repair",
                "description": f"Leak detected at Node {anomaly.node}. Dispatch crew for immediate inspection."
            })
        else:
            # 🔄 NEW: Dynamic logic to pick a plan and randomize values
            # This simulates your Plan A vs Plan B logic
            strategy = random.choice(["PUMP", "VALVE"])
            
            if strategy == "PUMP":
                # Randomize speed between 1.2 and 2.2
                speed = round(random.uniform(1.2, 2.2), 2)
                recommendations.append({
                    "node": anomaly.node,
                    "type": "PRESSURE_ANOMALY",
                    "title": "Plan B: Pump Boost",
                    "description": f"Low pressure at Node {anomaly.node}. Increase Pump 1 speed to {speed}x to restore head."
                })
            else:
                # Randomize Valve settings
                prv_val = random.randint(40, 75)
                fcv_val = random.randint(100, 500)
                choice = random.choice(["PRV", "FCV"])
                
                if choice == "PRV":
                    recommendations.append({
                        "node": anomaly.node,
                        "type": "PRESSURE_ANOMALY",
                        "title": "Plan A: Valve Adjustment",
                        "description": f"Adjust PRV settings to {prv_val}m to stabilize downstream pressure."
                    })
                else:
                    recommendations.append({
                        "node": anomaly.node,
                        "type": "PRESSURE_ANOMALY",
                        "title": "Plan A: Flow Control",
                        "description": f"Open FCV to {fcv_val} units to accommodate current demand surge."
                    })

    return recommendations