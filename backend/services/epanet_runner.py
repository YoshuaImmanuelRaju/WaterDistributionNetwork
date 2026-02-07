import wntr
import json

def run_inp_file(file_path):
    wn = wntr.network.WaterNetworkModel(file_path)

    sim = wntr.sim.EpanetSimulator(wn)
    results = sim.run_sim()

    nodes = {}
    for node_name in wn.node_name_list:
        demand = results.node["demand"].loc[:, node_name].mean()
        pressure = results.node["pressure"].loc[:, node_name].mean()

        nodes[node_name] = {
            "avg_demand": float(demand),
            "avg_pressure": float(pressure)
        }

    return {
        "nodes": nodes,
        "total_nodes": len(nodes)
    }
