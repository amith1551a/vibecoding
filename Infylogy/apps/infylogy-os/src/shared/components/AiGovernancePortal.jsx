import React from 'react';
import { 
  Zap, Clock, ShieldAlert, Sparkles, 
  HelpCircle, RefreshCcw, DollarSign, TrendingDown 
} from 'lucide-react';

const AiGovernancePortal = ({ 
  usage, 
  totalQuota, 
  projectBudget, 
  cooldownRemaining, 
  cachedResult, 
  onReuse, 
  onRunAnyway 
}) => {
  const usagePercent = (usage / totalQuota) * 100;

  // 1. COOLDOWN PROTECTOR
  if (cooldownRemaining > 0) {
    return (
      <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-center space-y-4 animate-scale-up">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
          <Clock size={32} />
        </div>
        <div className="space-y-2">
           <h3 className="text-xl font-bold text-white">Temporary Quota Cooldown</h3>
           <p className="text-sm text-amber-400 font-bold">Try again in {Math.ceil(cooldownRemaining / 60)} minutes</p>
           <p className="text-xs text-text-dim max-w-sm mx-auto">
             You have reached your AI usage limit for now. These limits ensure project-wide budget health.
           </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
           <div className="p-4 rounded-xl bg-white/5 border border-border">
              <p className="text-[10px] font-bold text-text-dim uppercase">Today's Usage</p>
              <p className="text-lg font-bold text-white">{usage} / {totalQuota}</p>
           </div>
           <div className="p-4 rounded-xl bg-white/5 border border-border">
              <p className="text-[10px] font-bold text-text-dim uppercase">Project Monthly</p>
              <p className="text-lg font-bold text-white">${projectBudget} / $100</p>
           </div>
        </div>

        <div className="pt-4 border-t border-border">
           <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles size={12} /> Optimization Strategy
           </p>
           <ul className="text-left text-xs text-text-dim space-y-2 mt-4 px-4 list-disc pl-6 leading-relaxed">
              <li>Use shorter, more specific prompts</li>
              <li>Reuse cached results instead of re-running data</li>
              <li>Reserve premium mode for client-facing exports only</li>
              <li>Identify top 3 risks instead of full narratives</li>
           </ul>
        </div>
      </div>
    );
  }

  // 2. CACHE PROMPT (REUSE BEFORE RE-RUN)
  if (cachedResult) {
     return (
        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-4 animate-scale-up">
           <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <RefreshCcw size={20} />
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-bold text-white">Cached Perspective Available</h4>
                 <p className="text-xs text-text-dim leading-relaxed">
                    A cached result for this data exists from {cachedResult.date}. Reuse it to save AI credits.
                 </p>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={onReuse}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-2 rounded-lg transition-all"
              >
                REUSE CACHED RESULT ($0.00)
              </button>
              <button 
                onClick={onRunAnyway}
                className="secondary px-4 text-[10px] font-bold"
              >
                 RUN AGAIN ANYWAY
              </button>
           </div>
        </div>
     );
  }

  // 3. THRESHOLD WARNINGS
  return (
    <div className="space-y-4">
      {usagePercent >= 70 && (
        <div className={`p-4 rounded-xl border flex items-center gap-4 animate-pulse ${
          usagePercent >= 90 ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <ShieldAlert className={usagePercent >= 90 ? 'text-red-400' : 'text-amber-400'} size={20} />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-white uppercase tracking-wider">
               {usagePercent >= 90 ? 'Critical Usage Alert' : 'Quota Warning'}
            </p>
            <p className="text-[10px] text-text-dim leading-none mt-1">
              You've used {usagePercent.toFixed(0)}% of your daily AI credits. Consider low-cost summary mode.
            </p>
          </div>
        </div>
      )}

      {/* FOOTER STATS */}
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-2">
            <Zap className="text-primary" size={14} />
            <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{usage} / {totalQuota} Credits Used</span>
         </div>
         <div className="flex items-center gap-2">
            <DollarSign className="text-emerald-500" size={12} />
            <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">${projectBudget} Total Spend</span>
         </div>
      </div>
    </div>
  );
};

export default AiGovernancePortal;
