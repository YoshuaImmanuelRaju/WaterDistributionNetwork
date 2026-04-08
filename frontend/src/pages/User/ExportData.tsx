import { useState, useEffect } from 'react';
import { Download, FileText, History, Database, Loader2, CheckCircle, Clock } from 'lucide-react';
import { useNetworkStore } from '../../store/networkStore';
import { generateAnomalies } from '../../services/anomalyService';
import { fetchOptimizationRecommendations } from '../../services/networkService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

interface ExportRecord {
  id: string;
  filename: string;
  timestamp: string;
  networkName: string;
}

export default function ExportData() {
  const { networks, activeNetworkId } = useNetworkStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportRecord[]>([]);

  const activeNetwork = networks.find(n => n.id === activeNetworkId);
  const anomalies = activeNetwork ? generateAnomalies(activeNetwork) : [];

  // --- Dashboard Data Logic ---
  const totalNodes = activeNetwork?.nodes.length || 0;
  const leakyCount = anomalies.filter(a => a.type === 'LEAK').length > 0 ? 1 : 0;
  const warningCount = anomalies.filter(a => a.type !== 'LEAK').length;
  const healthyCount = Math.max(0, totalNodes - (leakyCount + warningCount));
  const healthPct = ((healthyCount / (totalNodes || 1)) * 100).toFixed(1);
  const avgPressure = activeNetwork ? (activeNetwork.nodes.reduce((acc, n) => acc + (activeNetwork.pressures['0']?.[n.id] || 0), 0) / totalNodes).toFixed(2) : "0";

  useEffect(() => {
    if (activeNetworkId && anomalies.length > 0) {
      fetchOptimizationRecommendations(activeNetworkId, anomalies)
        .then(data => setRecommendations(data));
    }
  }, [activeNetworkId, anomalies.length]);

  const exportToPDF = () => {
    if (!activeNetwork) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      const safeName = activeNetwork.name ?? 'network';
      const filename = `Full_Report_${safeName.replace('.inp', '')}_${Date.now()}.pdf`;

      // 1. PAGE HEADER
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("Water Network Status Report", 14, 22);
      doc.setFontSize(10);
      doc.text(`Digital Twin Snapshot | Generated: ${timestamp}`, 14, 32);

      // 2. SYSTEM OVERVIEW TABLE
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.text("1. Executive Health Summary", 14, 50);
      autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Value', 'Status']],
        body: [
          ['Network Health', `${healthPct}%`, parseFloat(healthPct) > 90 ? 'OPTIMAL' : 'MONITOR'],
          ['Active Alerts', anomalies.length.toString(), anomalies.length > 0 ? 'ATTENTION' : 'CLEAR'],
          ['Leak Suspects', leakyCount.toString(), leakyCount > 0 ? 'CRITICAL' : 'NONE'],
          ['Average Pressure', `${avgPressure} m`, 'STABLE'],
          ['Healthy / Warning Nodes', `${healthyCount} / ${warningCount}`, 'STABLE']
        ],
        headStyles: { fillColor: [51, 65, 85] },
      });

      // 3. RECOMMENDATIONS & SUGGESTIONS
      let finalY = (doc as any).lastAutoTable.finalY;
      doc.text("2. Actionable Suggestions", 14, finalY + 15);
      if (recommendations.length > 0) {
        autoTable(doc, {
          startY: finalY + 20,
          head: [['Node', 'Type', 'Recommended Action']],
          body: recommendations.map(r => [`Node ${r.node}`, r.type, r.description]),
          headStyles: { fillColor: [79, 70, 229] },
          columnStyles: { 2: { cellWidth: 100 } }
        });
      } else {
        doc.setFontSize(10);
        doc.text("No specific maintenance actions required at this time.", 14, finalY + 25);
      }

      // 4. ANOMALY LOG
      finalY = (doc as any).lastAutoTable.finalY || finalY + 30;
      doc.setFontSize(14);
      doc.text("3. Active Anomaly Log", 14, finalY + 15);
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Type', 'Location', 'Message']],
        body: anomalies.map(a => [a.type, `Node ${a.node}`, a.message]),
        headStyles: { fillColor: [185, 28, 28] },
      });

      // 5. FULL NODE PRESSURE DATA (New Page)
      doc.addPage();
      doc.text("4. Complete Node Pressure Log (Last Interval)", 14, 20);
      const hours = Object.keys(activeNetwork.pressures);
      const lastHour = hours[hours.length - 1];
      
      autoTable(doc, {
        startY: 25,
        head: [['Node ID', 'Node Type', 'Pressure (m)', 'Health']],
        body: activeNetwork.nodes.map(n => {
          const p = activeNetwork.pressures[lastHour]?.[n.id] || 0;
          return [n.id, n.type.toUpperCase(), `${p.toFixed(2)}`, p < 20 ? 'CRITICAL' : p < 30 ? 'WARNING' : 'HEALTHY'];
        }),
        headStyles: { fillColor: [30, 41, 59] },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const val = data.cell.raw;
            if (val === 'CRITICAL') doc.setTextColor(220, 38, 38);
            else if (val === 'WARNING') doc.setTextColor(217, 119, 6);
          }
        }
      });

      doc.save(filename);

      // --- Update History ---
      const newRecord: ExportRecord = {
        id: Math.random().toString(36).substr(2, 9),
        filename: filename,
        timestamp: new Date().toLocaleTimeString(),
        networkName: activeNetwork.name ?? 'Unknown Network' 
      };
      setExportHistory(prev => [newRecord, ...prev]);
      toast.success("Full system report generated!");
    } catch (error) {
      toast.error("Export failed");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="text-blue-500" /> Export Data
        </h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-400">
          <FileText size={20} /> Comprehensive Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Target Network</p>
            <p className="text-lg font-medium">{activeNetwork?.name || "None Selected"}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Content</p>
            <p className="text-sm text-slate-300">All anomalies, suggestions, and node pressures included.</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={exportToPDF}
            disabled={!activeNetwork || isGenerating}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
              !activeNetwork 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
            }`}
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={20} />}
            Download Full System Report
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-400">
          <History size={20} /> Session History
        </h2>

        {exportHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
            No reports generated in this session.
          </div>
        ) : (
          <div className="space-y-3">
            {exportHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    <CheckCircle className="text-blue-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{item.filename}</p>
                    <p className="text-xs text-slate-500">Network: {item.networkName}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">{item.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}