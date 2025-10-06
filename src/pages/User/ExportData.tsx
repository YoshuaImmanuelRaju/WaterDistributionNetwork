import { useState } from 'react';
import { toast } from 'react-toastify';
import { Download, FileJson, FileText, Calendar } from 'lucide-react';
import networksData from '../../mockData/networks.json';
import alertsData from '../../mockData/alerts.json';

export default function ExportData() {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv'>('json');
  const [selectedData, setSelectedData] = useState<'networks' | 'alerts' | 'clusters'>('networks');

  const exportData = () => {
    let data: any;
    let filename: string;

    switch (selectedData) {
      case 'networks':
        data = networksData.networks;
        filename = `networks_${Date.now()}`;
        break;
      case 'alerts':
        data = alertsData.alerts;
        filename = `alerts_${Date.now()}`;
        break;
      case 'clusters':
        data = networksData.clusters;
        filename = `clusters_${Date.now()}`;
        break;
    }

    if (selectedFormat === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvData = convertToCSV(data);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success(`Data exported as ${selectedFormat.toUpperCase()}`);
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj =>
      Object.values(obj).map(val =>
        typeof val === 'object' ? JSON.stringify(val) : val
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const exportHistory = [
    { id: 1, name: 'networks_export', date: '2025-10-05', format: 'JSON', size: '24 KB' },
    { id: 2, name: 'alerts_export', date: '2025-10-04', format: 'CSV', size: '12 KB' },
    { id: 3, name: 'clusters_export', date: '2025-10-03', format: 'JSON', size: '8 KB' },
    { id: 4, name: 'networks_export', date: '2025-10-02', format: 'CSV', size: '28 KB' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Export Data</h1>
        <p className="text-gray-600 mt-1">Download your network data in various formats</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Export Configuration</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Data Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'networks', label: 'Networks', icon: FileJson },
                { value: 'alerts', label: 'Alerts', icon: FileText },
                { value: 'clusters', label: 'Clusters', icon: FileJson }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedData(option.value as any)}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition ${
                    selectedData === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option.icon className={`w-6 h-6 ${
                    selectedData === option.value ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    selectedData === option.value ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'json', label: 'JSON', desc: 'JavaScript Object Notation' },
                { value: 'csv', label: 'CSV', desc: 'Comma-Separated Values' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFormat(option.value as any)}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    selectedFormat === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-bold mb-1 ${
                    selectedFormat === option.value ? 'text-blue-900' : 'text-gray-800'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={exportData}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Export History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">File Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Format</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {exportHistory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {item.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.size}</td>
                  <td className="py-3 px-4">
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
