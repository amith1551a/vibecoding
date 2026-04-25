import React, { useState } from 'react';
import { 
  Users, Phone, MessageSquare, Mail, 
  ChevronRight, Calendar, Search, Filter, 
  Clock, CheckCircle, AlertCircle, TrendingUp, Sparkles, Plus, Loader2 
} from 'lucide-react';
import { aiService } from '../../services/ai/aiService';

const LeadCard = ({ lead }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [signal, setSignal] = useState(null);

  const handleGenerateSignal = async () => {
    setAnalyzing(true);
    try {
      const response = await aiService.process('signals', JSON.stringify(lead));
      const data = typeof response.data === 'string' ? JSON.parse(response.data.replace(/```json|```/g, "")) : response.data;
      setSignal({
        data: Array.isArray(data) ? data[0] : data.signal || "Significant team growth detected.",
        cached: response.cached
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };
    <div className="glass-card p-6 flex flex-col gap-6 border border-border hover:border-primary/50 transition-all group relative overflow-hidden">
      {/* AI Expansion Signal Stripe */}
      {lead.expansionOpportunity && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
      )}

      {/* Lead Identity */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
            lead.type === 'Inbound' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-500 shadow-blue-500/20'
          }`}>
            <Users size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">{lead.type} Lead</span>
              <span className="text-[10px] text-text-dim">• {lead.source}</span>
            </div>
            <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{lead.client}</h4>
            <p className="text-xs text-text-dim">{lead.role} • {lead.location}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full border-2 border-background ${
          lead.urgency === 'High' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
        }`}></div>
      </div>

      {/* AI Intelligence Signal */}
      <div className="space-y-4 relative z-10 min-h-[80px] flex flex-col justify-center">
        {signal ? (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 animate-fade relative overflow-hidden">
             <Sparkles className="text-primary shrink-0" size={16} />
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">AI Signal</p>
                   {signal.cached && <span className="text-[7px] text-text-dim uppercase font-bold">Cached</span>}
                </div>
                <p className="text-[11px] text-white font-medium leading-relaxed">
                  {signal.data}
                </p>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-5">
                <Sparkles size={64} />
             </div>
          </div>
        ) : (
          <button 
            onClick={handleGenerateSignal}
            disabled={analyzing}
            className="w-full py-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 group/btn"
          >
             {analyzing ? (
               <Loader2 className="animate-spin text-primary" size={20} />
             ) : (
               <>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim group-hover/btn:text-primary uppercase tracking-widest">
                   <Sparkles size={12} /> Generate Expansion Signal
                 </div>
                 <p className="text-[9px] text-text-dim opacity-50 font-mono">Est: ${aiService.getEstimate('signals').toFixed(4)}</p>
               </>
             )}
          </button>
        )}
      </div>

      {/* Lead Content */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-dim flex items-center gap-1"><Calendar size={12}/> Updated {lead.lastUpdated}</span>
          <span className="text-text-dim flex items-center gap-1"><Clock size={12}/> Next: {lead.nextFollowUp}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {lead.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-border text-[10px] text-text-dim">{tag}</span>
          ))}
        </div>
      </div>

      {/* Lead Actions */}
      <div className="flex gap-2 relative z-10">
        <button className="flex-1 primary py-2 text-xs font-bold">Log Opportunity</button>
        <button className="secondary p-2"><Phone size={16} /></button>
        <button className="secondary p-2"><MessageSquare size={16} /></button>
      </div>
    </div>
  );
};

const LeadManagement = () => {
  const [analyzingRisk, setAnalyzingRisk] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState(null);

  const handleAnalyzeRisk = async () => {
    setAnalyzingRisk(true);
    try {
      const response = await aiService.process('risk', 'Analyze overall retention and billing risk for active consultants.');
      setRiskAssessment({
        data: response.data,
        cached: response.cached
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingRisk(false);
    }
  };

  const mockLeads = [
    { 
      id: 1, 
      client: 'Verizon', 
      role: 'Frontend Expansion', 
      type: 'Expansion', 
      source: 'Internal Signal', 
      location: 'Basking Ridge, NJ', 
      urgency: 'High', 
      lastUpdated: '2h ago', 
      nextFollowUp: '2026-04-19',
      expansionOpportunity: true,
      tags: ['React', 'Strategic', 'High Margin']
    },
    { 
      id: 2, 
      client: 'Coinbase', 
      role: 'DevOps Architect', 
      type: 'Inbound', 
      source: 'LinkedIn', 
      location: 'Remote', 
      urgency: 'Medium', 
      lastUpdated: '1d ago', 
      nextFollowUp: '2026-04-18',
      expansionOpportunity: false,
      tags: ['Terraform', 'New Logo']
    },
    { 
      id: 3, 
      client: 'Google', 
      role: 'Cloud Engineering', 
      type: 'Expansion', 
      source: 'Direct Manager', 
      location: 'Mountain View, CA', 
      urgency: 'Low', 
      lastUpdated: '3d ago', 
      nextFollowUp: '2026-04-20',
      expansionOpportunity: true,
      tags: ['GCP', 'Volume Account']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-primary" size={32} /> Expansion Radar
          </h1>
          <p className="text-text-dim">Monitor client health signals and identify new job requirements.</p>
        </div>
        <button className="primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        <div className="glass-card p-6 flex flex-col gap-2">
           <span className="text-[10px] font-bold text-text-dim uppercase">Active Relationships</span>
           <span className="text-3xl font-bold text-white">24</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
           <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-bold text-text-dim uppercase">Active Risk Detection</span>
             <button 
                onClick={handleAnalyzeRisk}
                disabled={analyzingRisk}
                className="text-primary hover:text-white transition-colors"
             >
               {analyzingRisk ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
             </button>
           </div>
           {riskAssessment ? (
             <div className="animate-fade">
               <span className="text-2xl font-bold text-red-400">4 <span className="text-xs text-text-dim font-normal">Signals found</span></span>
               <p className="text-[9px] text-text-dim mt-1 leading-tight italic truncate">"{riskAssessment.data.split('.')[0]}..."</p>
             </div>
           ) : (
             <>
               <span className="text-3xl font-bold text-text-dim opacity-30">--</span>
               <p className="text-[9px] text-text-dim font-mono">Est: ${aiService.getEstimate('risk').toFixed(4)}</p>
             </>
           )}
        </div>
        <div className="glass-card p-6 flex flex-col gap-2 border-l-4 border-emerald-500">
           <span className="text-[10px] font-bold text-text-dim uppercase">Expansion Opportunities</span>
           <span className="text-3xl font-bold text-emerald-400">8</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
           <span className="text-[10px] font-bold text-text-dim uppercase">AI Conversion Rate</span>
           <span className="text-3xl font-bold text-primary">92%</span>
        </div>
      </div>

      <div className="flex gap-4 px-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
          <input type="text" placeholder="Search accounts or opportunities..." className="w-full pl-12" />
        </div>
        <button className="secondary"><Filter size={18} /> Filter radar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2 pb-12">
        {mockLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
      </div>

      {/* AI Strategy Suggestion Bottom Bar */}
      <div className="fixed bottom-8 left-[var(--sidebar-width)] right-8 z-[100] px-4 animate-slide-up">
        <div className="bg-gradient-to-r from-background via-surface to-background border border-primary/30 p-4 rounded-2xl backdrop-blur-3xl shadow-2xl flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Strategic Suggestion</span>
                <p className="text-sm font-medium text-white max-w-[600px]">Verizon (Internal Signal) hasn't been engaged since last follow-up. High React team growth detected. Prioritize today.</p>
              </div>
           </div>
           <div className="flex gap-3">
              <button className="secondary py-2 px-6 text-xs font-bold">Dismiss</button>
              <button className="primary py-2 px-6 text-xs font-bold">Contact Manager</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
