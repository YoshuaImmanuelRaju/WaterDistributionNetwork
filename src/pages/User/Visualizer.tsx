import { useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import networksData from '../../mockData/networks.json';
import alertsData from '../../mockData/alerts.json';
import { Network, AlertTriangle } from 'lucide-react';

export default function Visualizer() {
  const [selectedNetwork, setSelectedNetwork] = useState(networksData.networks[0]);

  const networkAlerts = alertsData.alerts.filter(
    a => a.networkId === selectedNetwork.id && !a.acknowledged
  );

  const nodes: Node[] = selectedNetwork.nodes.map((node) => {
    const hasAlert = networkAlerts.some(alert =>
      alert.location.includes(node.id)
    );

    return {
      id: node.id,
      position: { x: node.x, y: node.y },
      data: {
        label: (
          <div className="text-center">
            <div className={`font-bold ${hasAlert ? 'text-red-600' : 'text-gray-800'}`}>
              {node.id}
            </div>
            {node.type === 'junction' && (
              <div className="text-xs text-gray-600">{node.demand} L/s</div>
            )}
            {hasAlert && (
              <AlertTriangle className="w-4 h-4 text-red-600 mx-auto mt-1" />
            )}
          </div>
        )
      },
      style: {
        background: hasAlert ? '#fee2e2' : node.type === 'reservoir' ? '#dbeafe' : '#fff',
        border: hasAlert ? '2px solid #dc2626' : '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '10px',
        width: 100
      }
    };
  });

  const edges: Edge[] = selectedNetwork.edges.map((edge) => {
    const hasAlert = networkAlerts.some(alert =>
      alert.location.includes(edge.id)
    );

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: `${edge.diameter}"`,
      type: 'smoothstep',
      animated: hasAlert,
      style: {
        stroke: hasAlert ? '#dc2626' : '#3b82f6',
        strokeWidth: hasAlert ? 3 : 2
      }
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Network Visualizer</h1>
        <p className="text-gray-600 mt-1">Interactive water distribution network graph</p>
      </div>

      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Select Network:</label>
        <select
          value={selectedNetwork.id}
          onChange={(e) => {
            const network = networksData.networks.find(n => n.id === e.target.value);
            if (network) setSelectedNetwork(network);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {networksData.networks.map((network) => (
            <option key={network.id} value={network.id}>
              {network.name}
            </option>
          ))}
        </select>

        {networkAlerts.length > 0 && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              {networkAlerts.length} Active Alert{networkAlerts.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          className="bg-gray-50"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Network className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Nodes</p>
              <p className="text-2xl font-bold text-gray-800">{selectedNetwork.nodes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Network className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Pipes</p>
              <p className="text-2xl font-bold text-gray-800">{selectedNetwork.edges.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-800">{networkAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
