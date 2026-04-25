import React, { useState } from 'react';
import { 
  ShieldCheck, Clock, CheckCircle, XCircle, 
  AlertCircle, ChevronRight, User, Briefcase, 
  FileText, DollarSign, MessageSquare, Eye
} from 'lucide-react';
import { ENGINE_STATUS, approvalEngine } from '../../services/control/approvalEngine';
import { useAuth } from '../../app/providers/AuthContext';

const MODULE_CONFIG = {
  immigration: { label: 'Immigration', icon: ShieldCheck, color: 'blue' },
  resumes: { label: 'Resume', icon: FileText, color: 'purple' },
  onboarding: { label: 'Onboarding', icon: CheckCircle, color: 'emerald' },
  timesheets: { label: 'Timesheets', icon: Clock, color: 'amber' },
  performance: { label: 'Performance', icon: User, color: 'indigo' },
  billing: { label: 'Billing', icon: DollarSign, color: 'emerald' },
  payments: { label: 'Payments', icon: DollarSign, color: 'blue' },
  leads: { label: 'Leads', icon: MessageSquare, color: 'sky' }
};

const ControlCard = ({ item, onAction, onReview }) => {
  const meta = MODULE_CONFIG[item.module] || { label: item.module, icon: AlertCircle, color: 'slate' };
  
  return (
    <div className={`glass-card p-5 flex flex-col gap-4 border transition-all group relative overflow-hidden ${
      item.status === ENGINE_STATUS.UNDER_REVIEW ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
    }`}>
      {item.status === ENGINE_STATUS.UNDER_REVIEW && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl tracking-tighter uppercase z-20">
          In Review
        </div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-${meta.color}-500/20 flex items-center justify-center text-${meta.color}-400`}>
            <meta.icon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">{meta.label} Audit</span>
              <span className="text-[10px] text-text-dim">• {item.timestamp}</span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
            <p className="text-xs text-text-dim">By: {item.submittedBy} • {item.docId}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 relative z-10">
        {item.status === ENGINE_STATUS.UNDER_REVIEW ? (
          <>
            <button 
              onClick={() => onAction(item, 'Approve')}
              className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={14} /> Approve
            </button>
            <button 
              onClick={() => onAction(item, 'Reject')}
              className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <XCircle size={14} /> Reject
            </button>
          </>
        ) : (
          <button 
            onClick={() => onReview(item)}
            className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Eye size={14} /> Start Control Audit
          </button>
        )}
      </div>
    </div>
  );
};

const ControlQueue = () => {
  const { user } = useAuth();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState('');

  const [tasks, setTasks] = useState([
    { id: 1, module: 'immigration', title: 'H-1B Release - Case #4202', submittedBy: 'System', docId: 'IMM-001', timestamp: '2h ago', status: ENGINE_STATUS.SUBMITTED },
    { id: 2, module: 'resumes', title: 'Submission: John Doe @ Verizon', submittedBy: 'Recruiter A', docId: 'MATCH-12', timestamp: '4h ago', status: ENGINE_STATUS.UNDER_REVIEW },
    { id: 3, module: 'onboarding', title: 'Activation: Sarah Jenkins', submittedBy: 'HR Lead', docId: 'ONB-99', timestamp: '6h ago', status: ENGINE_STATUS.SUBMITTED },
    { id: 4, module: 'billing', title: 'Invoice Batch: April (Verizon)', submittedBy: 'Accounting', docId: 'BATCH-4', timestamp: '1d ago', status: ENGINE_STATUS.SUBMITTED }
  ]);

  const handleAction = (item, action) => {
    if (action === 'Reject') {
      setSelectedItem(item);
      setShowRejectModal(true);
    } else {
      setTasks(tasks.filter(t => t.id !== item.id));
    }
  };

  const handleReview = async (item) => {
    // Transition to Under Review
    setTasks(tasks.map(t => t.id === item.id ? { ...t, status: ENGINE_STATUS.UNDER_REVIEW } : t));
    await approvalEngine.markUnderReview(item.module, item.docId, user?.id);
  };

  const submitRejection = () => {
    setTasks(tasks.filter(t => t.id !== selectedItem.id));
    setShowRejectModal(false);
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-primary" size={24} /> Global Control Queue
        </h3>
        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
          {tasks.length} Active Audits
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => (
          <ControlCard 
            key={task.id} 
            item={task} 
            onAction={handleAction} 
            onReview={handleReview} 
          />
        ))}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="max-w-md w-full glass p-8 space-y-6 animate-scale-up">
            <div>
              <h3 className="text-2xl font-bold text-white">Audit Rejection</h3>
              <p className="text-sm text-text-dim mt-2 tracking-wide">Enter the mandatory reason for blocking this transition in the Control Engine.</p>
            </div>
            
            <textarea 
              className="w-full h-32 bg-white/5 border-border focus:border-red-500/50 text-white rounded-2xl p-4 text-sm" 
              placeholder="e.g. Missing I-9 documentation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>

            <div className="flex gap-4 pt-2">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 secondary py-3">CANCEL</button>
              <button 
                onClick={submitRejection}
                disabled={!reason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                CONFIRM REJECT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlQueue;
