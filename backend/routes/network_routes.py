from flask import Blueprint, request, jsonify
import os
from services.epanet_runner import run_inp_file
from db.mongo import networks_collection
from models.network_model import create_network_doc

network_bp = Blueprint("network", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@network_bp.route("/upload-inp", methods=["POST"])
def upload_inp():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".inp"):
        return jsonify({"error": "Invalid file type"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    result_json = run_inp_file(file_path)

    doc = create_network_doc(file.filename, result_json)
    inserted = networks_collection.insert_one(doc)

    return jsonify({
        "message": "Network processed successfully",
        "network_id": str(inserted.inserted_id),
        "data": result_json
    })
