import {
  AlertTriangle,
  Network,
  Gauge,
  Layers,
} from 'lucide-react';
import { useNetworkStore } from '../../store/networkStore';
import StatCard from '../../components/StatCard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { networks, setActiveNetwork } =
    useNetworkStore();
  const navigate = useNavigate();

  const totalNetworks = networks.length;
  const totalNodes = networks.reduce(
    (sum, n) => sum + n.nodes.length,
    0
  );
  const totalEdges = networks.reduce(
    (sum, n) => sum + n.edges.length,
    0
  );
  const totalAlerts = networks.reduce(
    (sum, n) => sum + (n.alerts?.length ?? 0),
    0
  );

  const totalDemand = networks.reduce(
    (sum, n) =>
      sum +
      n.nodes.reduce(
        (s, node) => s + (node.demand ?? 0),
        0
      ),
    0
  );

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-300">
      <h1 className="text-3xl font-bold text-slate-400">
        System Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<Layers />} label="Networks" value={totalNetworks} />
        <StatCard icon={<Network />} label="Nodes" value={totalNodes} />
        <StatCard icon={<Network />} label="Pipes" value={totalEdges} />
        <StatCard icon={<Gauge />} label="Total Demand" value={Math.round(totalDemand)} />
        <StatCard icon={<AlertTriangle />} label="Alerts" value={totalAlerts} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-400">
          Network Health
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-left">
              <th className="py-2">Network</th>
              <th>Nodes</th>
              <th>Pipes</th>
              <th>Demand</th>
              <th>Alerts</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {networks.map((n) => (
              <tr
                key={n.id}
                className="border-b border-slate-800 hover:bg-slate-800"
              >
                <td className="py-2 font-medium text-slate-300">
                  {n.name}
                </td>
                <td>{n.nodes.length}</td>
                <td>{n.edges.length}</td>
                <td>
                  {Math.round(
                    n.nodes.reduce((s, node) => s + (node.demand ?? 0), 0)
                  )}
                </td>
                <td className={n.alerts?.length ? 'text-red-400' : 'text-emerald-400'}>
                  {n.alerts?.length ?? 0}
                </td>
                <td>
                  <button
                    onClick={() => {
                      setActiveNetwork(n.id);
                      navigate('/user/visualizer');
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
