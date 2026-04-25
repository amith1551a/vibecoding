import React, { useState } from 'react';
import { 
  ShieldCheck, Clock, CheckCircle, XCircle, 
  AlertCircle, ChevronRight, User, Briefcase, 
  FileText, DollarSign, MessageSquare 
} from 'lucide-react';
import { qualityCheckService } from '../../services/control/qualityCheckService';

const MODULE_DATA = {
  immigration: { label: 'Immigration', icon: ShieldCheck, color: 'blue' },
  resumes: { label: 'Resume Match', icon: FileText, color: 'purple' },
  onboarding: { label: 'Onboarding', icon: CheckCircle, color: 'emerald' },
  timesheets: { label: 'Timesheets', icon: Clock, color: 'amber' },
  performance: { label: 'Performance', icon: User, color: 'indigo' },
  billing: { label: 'Invoices', icon: DollarSign, color: 'emerald' },
  payments: { label: 'Payments', icon: DollarSign, color: 'blue' },
  leads: { label: 'Lead Growth', icon: MessageSquare, color: 'sky' }
};

const QCCard = ({ item, onAction }) => {
  const meta = MODULE_DATA[item.module] || { label: item.module, icon: AlertCircle, color: 'slate' };
  
  return (
    <div className="glass-card p-5 flex flex-col gap-4 border border-border hover:border-primary/50 transition-all group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${meta.color}-500/5 blur-3xl -mr-12 -mt-12 rounded-full`}></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-${meta.color}-500/20 flex items-center justify-center text-${meta.color}-400`}>
            <meta.icon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">{meta.label}</span>
              <span className="text-[10px] text-text-dim">• {item.timestamp}</span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">{item.title}</h4>
            <p className="text-xs text-text-dim">Submitted by: {item.submittedBy} ({item.role})</p>
          </div>
        </div>
        
        {item.riskFlag && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400">
            <AlertCircle size={12} />
            <span className="text-[10px] font-bold uppercase">Risk</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 relative z-10">
        <button 
          onClick={() => onAction(item, 'Approve')}
          className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/5 flex items-center justify-center gap-2"
        >
          <CheckCircle size={14} /> Approve
        </button>
        <button 
          onClick={() => onAction(item, 'Reject')}
          className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/5 flex items-center justify-center gap-2"
        >
          <XCircle size={14} /> Reject
        </button>
        <button className="secondary p-2 rounded-xl">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const QualityCheckQueue = () => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState('');

  const mockQC = [
    { id: 1, module: 'immigration', title: 'A. Smith - Ready to Market', submittedBy: 'Marketing A', role: 'Recruiter', timestamp: '2h ago', riskFlag: true },
    { id: 2, module: 'timesheets', title: 'John Doe - 40h @ Verizon', submittedBy: 'John Doe', role: 'Employee', timestamp: '4h ago', riskFlag: false },
    { id: 3, module: 'onboarding', title: 'Sarah K. - Signed Handbook', submittedBy: 'HR Lead', role: 'HR', timestamp: '6h ago', riskFlag: false },
    { id: 4, module: 'billing', title: 'INV-2024-001 ($8,400)', submittedBy: 'Accountant B', role: 'Accounting', timestamp: '1d ago', riskFlag: true }
  ];

  const handleAction = (item, action) => {
    if (action === 'Reject') {
      setSelectedItem(item);
      setShowRejectModal(true);
    } else {
      console.log(`Approved: ${item.title}`);
    }
  };

  const submitRejection = () => {
    console.log(`Rejected: ${selectedItem.title} Reason: ${reason}`);
    setShowRejectModal(false);
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-primary" size={24} /> Quality Check Queue
        </h3>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
             {mockQC.length} Items Pending
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {mockQC.map(item => <QCCard key={item.id} item={item} onAction={handleAction} />)}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="max-w-md w-full glass p-8 space-y-6 animate-fade">
            <div>
              <h3 className="text-2xl font-bold text-white">Quality Check Rejection</h3>
              <p className="text-sm text-text-dim mt-2">Required: Provide a detailed reason for why this record failed the quality check.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-primary tracking-widest">Rejection Reason</label>
              <textarea 
                className="w-full h-32 bg-white/5 border-border focus:border-primary/50 text-white rounded-xl" 
                placeholder="e.g. Missing signature on page 4 of I-94 document..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 secondary py-3"
              >
                Cancel
              </button>
              <button 
                onClick={submitRejection}
                disabled={!reason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityCheckQueue;
