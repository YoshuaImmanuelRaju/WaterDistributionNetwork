import uuid
import tempfile
import os
import wntr
from fastapi import UploadFile


async def process_epanet_upload(file: UploadFile):
    if not file.filename.endswith(".inp"):
        return {"error": "Only .inp supported"}

    content = (await file.read()).decode("utf-8")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".inp") as f:
        f.write(content.encode("utf-8"))
        inp_path = f.name

    # ---- LOAD NETWORK ----
    wn = wntr.network.WaterNetworkModel(inp_path)

    # ---- FORCE HOURLY HYDRAULICS ----
    wn.options.time.hydraulic_timestep = 3600
    wn.options.time.report_timestep = 3600
    wn.options.time.pattern_timestep = 3600
    wn.options.time.duration = 24 * 3600

    # ---- RUN SIMULATION ----
    sim = wntr.sim.EpanetSimulator(wn)
    results = sim.run_sim()

    pressure_df = results.node["pressure"]

    pressures = {
        int(t // 3600): pressure_df.loc[t].to_dict()
        for t in pressure_df.index
    }

    # =========================
    # NODES WITH FULL PROPERTIES
    # =========================
    nodes = []

    for name, node in wn.nodes():
        coord = node.coordinates or (0, 0)

        node_data = {
            "id": name,
            "type": node.node_type.lower(),
            "x": coord[0] * 10,
            "y": coord[1] * 10,
        }

        node_type = node.node_type.lower()

        if node_type == "junction":
            node_data.update({
                "elevation": node.elevation,
                "base_demand": node.base_demand,
            })

        elif node_type == "tank":
            node_data.update({
                "elevation": node.elevation,
                "init_level": node.init_level,
                "min_level": node.min_level,
                "max_level": node.max_level,
                "diameter": node.diameter,
            })

        elif node_type == "reservoir":
            node_data.update({
                "head": node.head,
            })

        nodes.append(node_data)

    # =========================
    # EDGES WITH FULL PROPERTIES
    # =========================
    edges = []

    for name, link in wn.links():

        link_type = link.link_type.lower()

        link_data = {
            "id": name,
            "source": link.start_node_name,
            "target": link.end_node_name,
            "type": link_type,
        }

        if link_type == "pipe":
            link_data.update({
                "length": link.length,
                "diameter": link.diameter,
                "roughness": link.roughness,
                "loss_coeff": link.minor_loss,
                "status": str(link.initial_status),
            })

        elif link_type == "pump":
            link_data.update({
                "pump_curve": link.pump_curve_name,
                "status": str(link.initial_status),
            })

        edges.append(link_data)

    os.remove(inp_path)

    return {
        "id": str(uuid.uuid4()),
        "name": file.filename,
        "nodes": nodes,
        "edges": edges,
        "pressures": pressures,
    }
