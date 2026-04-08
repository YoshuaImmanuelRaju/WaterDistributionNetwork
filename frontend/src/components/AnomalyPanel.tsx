import { AlertTriangle, Droplet, Activity, ShieldCheck } from 'lucide-react';
import { Anomaly } from "../services/anomalyService";

export default function AnomalyPanel({
  anomalies,
}: {
  anomalies: Anomaly[];
}) {
  // ================= EMPTY STATE =================
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[400px]">
        <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 border border-emerald-800/30">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200">System Normal</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          No anomalies detected in the water network. All sensors are reporting expected pressure levels.
        </p>
      </div>
    );
  }

  // ================= ACTIVE STATE =================
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[400px]">
      
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-200">Detected Anomalies</h2>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold text-red-400 tracking-wider uppercase">
            {anomalies.length} Active
          </span>
        </div>
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {anomalies.map((a, i) => {
          // Determine styles based on anomaly type
          const isLeak = a.type === "LEAK";
          
          const bgColor = isLeak ? 'bg-blue-950/20' : 'bg-orange-950/20';
          const borderColor = isLeak ? 'border-blue-900/40' : 'border-orange-900/40';
          const iconColor = isLeak ? 'text-blue-400' : 'text-orange-400';
          const badgeBg = isLeak ? 'bg-blue-900/40 text-blue-300 border-blue-800' : 'bg-orange-900/40 text-orange-300 border-orange-800';
          
          const Icon = isLeak ? Droplet : Activity;

          return (
            <div
              key={i}
              className={`flex items-start gap-4 p-4 rounded-lg border ${bgColor} ${borderColor} hover:bg-slate-800/50 transition-colors group`}
            >
              {/* ICON */}
              <div className={`mt-0.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  {/* TYPE BADGE */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${badgeBg}`}>
                    {a.type}
                  </span>
                  
                  {/* NODE ID */}
                  <span className="text-xs font-medium text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Node {a.node}
                  </span>
                </div>
                
                {/* MESSAGE */}
                <p className="text-sm text-slate-300 truncate">
                  {a.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}