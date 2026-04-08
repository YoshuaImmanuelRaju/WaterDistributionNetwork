import { useState, useEffect } from 'react';
import { Wrench, Settings2, CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { Anomaly } from '../services/anomalyService';
import { fetchOptimizationRecommendations } from '../services/networkService';

interface Recommendation {
  node: string;
  type: string;
  title: string;
  description: string;
}

interface RecommendationsPanelProps {
  networkId: string | null;
  anomalies: Anomaly[];
}

export default function RecommendationsPanel({ networkId, anomalies }: RecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch real recommendations from the backend when anomalies change
  useEffect(() => {
    const getRecommendations = async () => {
      if (!networkId || anomalies.length === 0) {
        setRecommendations([]);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchOptimizationRecommendations(networkId, anomalies);
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [networkId, anomalies]);

  // ================= EMPTY STATE =================
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 border border-emerald-800/30">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Network Optimized</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-[250px]">
          No actions required. The system is operating at peak efficiency.
        </p>
      </div>
    );
  }

  // ================= ACTIVE STATE =================
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[400px]">
      
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-slate-200">Actionable Suggestions</h2>
        </div>
        {loading && <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />}
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {recommendations.map((rec, i) => {
          const isLeak = rec.type === 'LEAK';
          
          const bgColor = isLeak ? 'bg-red-950/20' : 'bg-indigo-950/20';
          const borderColor = isLeak ? 'border-red-900/40' : 'border-indigo-900/40';
          const iconColor = isLeak ? 'text-red-400' : 'text-indigo-400';
          const Icon = isLeak ? Wrench : Settings2;

          return (
            <div
              key={i}
              className={`flex items-start gap-4 p-4 rounded-lg border ${bgColor} ${borderColor} hover:bg-slate-800/50 transition-colors`}
            >
              <div className={`mt-0.5 p-2 rounded-lg bg-slate-950 border border-slate-800 ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 text-sm">
                    {rec.title}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Node {rec.node}
                  </span>
                </div>
                {/* 👇 This description is now coming directly from your Python Backend! */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}