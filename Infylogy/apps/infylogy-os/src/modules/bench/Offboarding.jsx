import React, { useState } from 'react';
import { 
  UserMinus, FileText, CheckCircle, Clock, 
  ShieldAlert, Send, Printer, User,
  AlertTriangle, DollarSign, Loader2, Sparkles
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { aiService } from '../../services/ai/aiService';

const Offboarding = () => {
  const { user } = useAuth();
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [docContent, setDocContent] = useState('');
  const [activeDocType, setActiveDocType] = useState(null);

  const mockConsultants = [
    { id: '1', name: 'James Wilson', role: 'Full Stack Developer', project: 'Verizon Digital', endDate: '2024-04-30' },
    { id: '2', name: 'Elena Rodriguez', role: 'DevOps Engineer', project: 'Chase Mortgage', endDate: '2024-05-15' }
  ];

  const handleGenerate = async (type) => {
    if (!selectedConsultant) return;
    setGenerating(true);
    setActiveDocType(type);
    
    const prompts = {
      termination: `Generate a professional, neutral employment termination letter for ${selectedConsultant.name}, a ${selectedConsultant.role} at Infylogy. Last working day: ${selectedConsultant.endDate}. Include standard clauses for return of company property and non-disparagement.`,
      verification: `Generate a formal Employment Verification Letter for ${selectedConsultant.name}. Confirm their role as ${selectedConsultant.role} from [Start Date] to ${selectedConsultant.endDate}. Use standard business language.`,
      benefits: `Summarize post-employment benefits for ${selectedConsultant.name}. Include COBRA health insurance extension details, 401k rollover instructions, and life insurance conversion options.`
    };

    try {
      const response = await aiService.process('polish', prompts[type]);
      setDocContent(response.data);
    } catch (e) {
      console.error(e);
      setDocContent("Error generating document. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-text-dim bg-clip-text text-transparent flex items-center gap-4">
          <UserMinus className="text-primary" size={40} /> Offboarding Package Manager
        </h1>
        <p className="text-text-dim">Execute professional departures, generate exit documentation, and ensure financial clearance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Consultant Selection & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">1. Select Consultant</h3>
            <div className="space-y-2">
              {mockConsultants.map(c => (
                <button 
                  key={c.id}
                  onClick={() => { setSelectedConsultant(c); setDocContent(''); }}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedConsultant?.id === c.id ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-border hover:border-white/20'
                  }`}
                >
                  <p className="font-bold text-white text-sm">{c.name}</p>
                  <p className="text-[10px] text-text-dim">{c.role} • Exit: {c.endDate}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedConsultant && (
            <div className="glass-card p-6 space-y-6 animate-scale-up">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest">2. Clearance Checklist</h3>
              <div className="space-y-4">
                {[
                  { label: 'Laptop & Hardware Return', status: 'Pending' },
                  { label: 'System Access Revocation', status: 'Completed', icon: CheckCircle },
                  { label: 'Final Timesheet Approved', status: 'Completed', icon: CheckCircle },
                  { label: 'Payment / Invoice Clearance', status: 'In Audit', icon: DollarSign }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-border">
                    <span className="text-[11px] font-medium text-text-dim">{item.label}</span>
                    <span className={`text-[9px] font-bold uppercase ${
                      item.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Document Generation */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!selectedConsultant ? (
            <div className="flex-1 glass border-dashed flex flex-col items-center justify-center p-12 text-center space-y-4">
              <User size={48} className="text-text-dim opacity-20" />
              <p className="text-sm text-text-dim max-w-[280px]">Select a consultant from the left to start generating their exit package.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { type: 'termination', label: 'Termination Letter', icon: UserMinus },
                  { type: 'verification', label: 'Emp. Verification', icon: FileText },
                  { type: 'benefits', label: 'Benefits Summary', icon: Gift }
                ].map(btn => (
                  <button 
                    key={btn.type}
                    onClick={() => handleGenerate(btn.type)}
                    disabled={generating}
                    className="glass font-bold text-[10px] uppercase tracking-wider py-4 flex flex-col items-center gap-3 hover:border-primary transition-all relative overflow-hidden group"
                  >
                    <btn.icon size={20} className="text-text-dim group-hover:text-primary" />
                    {btn.label}
                    {generating && activeDocType === btn.type && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="animate-spin text-primary" size={20} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {docContent && (
                <div className="glass-card p-10 flex flex-col h-full animate-scale-up">
                  <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{activeDocType?.replace('_', ' ')} Draft</h3>
                        <p className="text-[10px] text-text-dim">Generated via Infylogy AI Policy Engine</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="secondary p-2"><Printer size={18} /></button>
                       <button className="secondary p-2"><Send size={18} /></button>
                    </div>
                  </div>

                  <div className="flex-1 prose prose-invert max-w-none">
                    <div className="p-8 bg-white/5 border border-border text-text-dim text-sm leading-relaxed font-serif whitespace-pre-wrap rounded-xl min-h-[400px]">
                      {docContent}
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                    <AlertTriangle className="text-amber-500 mt-1" size={18} />
                    <p className="text-[11px] text-text-dim leading-relaxed">
                      <span className="font-bold text-amber-500 uppercase tracking-widest">Compliance Notice:</span> This AI-generated draft must be reviewed by the HR legal team BEFORE transmission. Ensure all dates and non-disclosure references are accurate.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offboarding;
