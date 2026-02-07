import { useState } from 'react';
import { toast } from 'react-toastify';
import { Database, CreditCard as Edit2, Save, Upload } from 'lucide-react';
import networksData from '../../mockData/networks.json';

export default function DemandManager() {
  const [clusters, setClusters] = useState(networksData.clusters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleEdit = (cluster: typeof clusters[0]) => {
    setEditingId(cluster.id);
    setEditValue(cluster.demand.toString());
  };

  const handleSave = (id: string) => {
    setClusters(clusters.map(c =>
      c.id === id ? { ...c, demand: parseFloat(editValue) } : c
    ));
    setEditingId(null);
    toast.success('Demand updated successfully');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Demand Manager</h1>
        <p className="text-gray-600 mt-1">Edit and manage cluster water demands</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload Network Design</span>
        </h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <input
              type="file"
              accept=".json,.inp"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Click to upload network design</p>
              <p className="text-sm text-gray-500 mt-1">Supports .json and .inp files</p>
            </label>
          </div>
          {uploadedFile && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Uploaded
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Cluster Demands</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cluster ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nodes</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Demand (L/s)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((cluster) => (
                <tr key={cluster.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{cluster.id}</td>
                  <td className="py-3 px-4 text-gray-600">{cluster.name}</td>
                  <td className="py-3 px-4 text-gray-600">{cluster.nodes.join(', ')}</td>
                  <td className="py-3 px-4">
                    {editingId === cluster.id ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <span className="font-semibold text-gray-800">{cluster.demand}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === cluster.id ? (
                      <button
                        onClick={() => handleSave(cluster.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        <Save className="w-4 h-4" />
                        <span className="text-sm">Save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(cluster)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium mb-1">Total Clusters</p>
          <p className="text-3xl font-bold text-blue-900">{clusters.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium mb-1">Total Demand</p>
          <p className="text-3xl font-bold text-green-900">
            {clusters.reduce((sum, c) => sum + c.demand, 0)} L/s
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700 font-medium mb-1">Avg Demand</p>
          <p className="text-3xl font-bold text-orange-900">
            {(clusters.reduce((sum, c) => sum + c.demand, 0) / clusters.length).toFixed(0)} L/s
          </p>
        </div>
      </div>
    </div>
  );
}
