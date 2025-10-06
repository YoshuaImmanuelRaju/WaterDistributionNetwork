import { AlertTriangle, Network, Database, TrendingUp } from 'lucide-react';
import StatCard from '../../components/StatCard';
import alertsData from '../../mockData/alerts.json';
import networksData from '../../mockData/networks.json';

export default function UserDashboard() {
  const activeAlerts = alertsData.alerts.filter(a => !a.acknowledged);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor your water distribution network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Networks"
          value={networksData.networks.length}
          icon={Network}
          color="blue"
        />
        <StatCard
          title="Active Alerts"
          value={activeAlerts.length}
          icon={AlertTriangle}
          color="red"
          change="2 new today"
        />
        <StatCard
          title="Total Clusters"
          value={networksData.clusters.length}
          icon={Database}
          color="green"
        />
        <StatCard
          title="Avg Demand"
          value="405 L/s"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Networks</h2>
          <div className="space-y-3">
            {networksData.networks.map((network) => (
              <div key={network.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Network className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{network.name}</p>
                    <p className="text-sm text-gray-500">Uploaded: {network.uploadDate}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
            <span>Leak Alerts</span>
            {activeAlerts.length > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {activeAlerts.length} Active
              </span>
            )}
          </h2>
          <div className="space-y-3">
            {alertsData.alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-500'
                    : alert.severity === 'medium'
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-yellow-50 border-yellow-500'
                } ${alert.acknowledged ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.severity === 'high'
                          ? 'text-red-600'
                          : alert.severity === 'medium'
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      }`} />
                      <span className="font-medium text-gray-800">{alert.location}</span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {alert.acknowledged && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                      Ack
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
