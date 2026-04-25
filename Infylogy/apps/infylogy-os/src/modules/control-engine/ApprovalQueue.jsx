import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, Shield, Briefcase, 
  FileText, DollarSign, MessageSquare, AlertCircle, ChevronRight 
} from 'lucide-react';
import { APPROVAL_STATUS } from '../../services/control/workflowService';

const MODULE_ICONS = {
  immigration: Shield,
  resumes: FileText,
  onboarding: CheckCircle,
  timesheets: Clock,
  billing: DollarSign,
  leads: MessageSquare,
  recs: Briefcase
};

const ApprovalItem = ({ item, onApprove, onReject }) => {
  const Icon = MODULE_ICONS[item.module] || AlertCircle;
  
  return (
    <div className="glass-card p-4 flex items-center justify-between group hover:bg-white/5 transition-all border border-border hover:border-primary/30">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-primary tracking-widest">{item.module}</span>
            <span className="text-[10px] text-text-dim">• {item.timestamp}</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.title}</h4>
          <p className="text-xs text-text-dim">Submitted by {item.user}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onApprove(item)}
          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
        >
          <CheckCircle size={18} />
        </button>
        <button 
          onClick={() => onReject(item)}
          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
        >
          <XCircle size={18} />
        </button>
        <button className="p-2 text-text-dim hover:text-white">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const ApprovalQueue = () => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState('');

  const mockPending = [
    { id: 1, module: 'immigration', title: 'John Doe - Ready to Market', user: 'Recruiter A', timestamp: '2h ago' },
    { id: 2, module: 'timesheets', title: 'Mike Ross - Weekly Hours (40h)', user: 'Mike Ross', timestamp: '4h ago' },
    { id: 3, module: 'billing', title: 'Invoice INV-2024-001 (Verizon)', user: 'Accounting B', timestamp: '1d ago' },
    { id: 4, module: 'onboarding', title: 'Sarah K. - Completion Final', user: 'HR Lead', timestamp: '3h ago' }
  ];

  const handleReject = (item) => {
    setSelectedItem(item);
    setShowRejectModal(true);
  };

  const submitRejection = () => {
    console.log(`Rejecting ${selectedItem.title} for: ${reason}`);
    setShowRejectModal(false);
    setReason('');
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Clock size={20} className="text-primary" /> Approval Queue
        </h3>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
          {mockPending.length} Pending
        </span>
      </div>

      <div className="space-y-2">
        {mockPending.map(item => (
          <ApprovalItem 
            key={item.id} 
            item={item} 
            onApprove={(i) => console.log('Approved', i.title)}
            onReject={handleReject}
          />
        ))}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full glass p-8 space-y-6 animate-fade">
            <div>
              <h3 className="text-xl font-bold">Reject Item</h3>
              <p className="text-sm text-text-dim mt-1">Provide a reason for the rejection so the user can correct it.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-dim">Rejection Reason</label>
              <textarea 
                className="w-full h-32" 
                placeholder="e.g. Missing manager signature on page 3..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 secondary"
              >
                Cancel
              </button>
              <button 
                onClick={submitRejection}
                disabled={!reason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ApprovalQueue;
