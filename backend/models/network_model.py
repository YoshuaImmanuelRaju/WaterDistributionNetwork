from datetime import datetime

def create_network_doc(filename, data):
    return {
        "filename": filename,
        "result": data,
        "created_at": datetime.utcnow()
    }
