import { useMemo } from 'react';
import { useNetworkStore } from '../../store/networkStore';
import { Network } from 'lucide-react';

export default function ExportData() {
  const {
    networks,
    activeNetworkId,
    setActiveNetwork,
    getActiveNetwork,
  } = useNetworkStore();

  const activeNetwork = getActiveNetwork();

  /* ---------------- JSON EXPORT ---------------- */

  const exportJson = useMemo(() => {
    if (!activeNetwork) return null;

    return {
      networkId: activeNetwork.id,
      networkName: activeNetwork.name,
      nodeCount: activeNetwork.nodes.length,
      edgeCount: activeNetwork.edges.length,
      nodes: activeNetwork.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        x: n.x,
        y: n.y,
        demand: n.demand ?? null,
      })),
    };
  }, [activeNetwork]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Export Network Data
      </h1>

      {/* Network selector */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Network className="w-5 h-5" />
          Select Network
        </h2>

        <select
          value={activeNetworkId ?? ''}
          onChange={(e) =>
            setActiveNetwork(e.target.value)
          }
          className="border px-3 py-2 rounded w-full"
        >
          <option value="" disabled>
            Select a network
          </option>
          {networks.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </div>

      {/* JSON Output */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-3">
          Exported JSON
        </h2>

        {!exportJson ? (
          <p className="text-gray-500">
            Select a network to view exported data.
          </p>
        ) : (
          <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-[500px]">
            {JSON.stringify(exportJson, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
