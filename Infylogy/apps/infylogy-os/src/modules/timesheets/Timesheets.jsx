import React, { useState } from 'react';
import { Clock, Plus, Upload, CheckCircle, FileText, Calendar, ChevronRight, AlertCircle, Save, ShieldAlert } from 'lucide-react';
import { approvalEngine, ENGINE_STATUS } from '../../services/control/approvalEngine';
import ControlOverlay from '../../modules/control-engine/ControlOverlay';
import { useAuth } from '../../app/providers/AuthContext';

const Timesheets = () => {
  const { user, role } = useAuth();
  const [status, setStatus] = useState(ENGINE_STATUS.DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState([
    { id: 1, date: '2026-04-18', hours: 8, client: 'Verizon', project: 'Cloud Migration', status: ENGINE_STATUS.APPROVED },
    { id: 2, date: '2026-04-17', hours: 8, client: 'Verizon', project: 'Cloud Migration', status: ENGINE_STATUS.SUBMITTED },
    { id: 3, date: '2026-04-16', hours: 8, client: 'Verizon', project: 'Cloud Migration', status: ENGINE_STATUS.DRAFT }
  ]);

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      await approvalEngine.submit('timesheets', 'temp-time-123', user.id, role, { 
        title: `Timesheet Week 16 - John Doe`,
        reason: 'Client-signed hours verification'
      });
      setStatus(ENGINE_STATUS.SUBMITTED);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminBypass = async (reason) => {
    try {
      await approvalEngine.adminBypass('timesheets', 'temp-time-123', user.id, reason);
      setStatus(ENGINE_STATUS.BYPASSED);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ControlOverlay 
      isLocked={status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW}
      status={status}
      reviewer="Project Manager"
      onBypass={handleAdminBypass}
    >
      <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Timesheet</h1>
          <p className="text-text-dim">Log your daily hours and upload client-approved proof.</p>
        </div>
        <button className="primary">
           <Plus size={18} /> Add Entry
        </button>
      </div>

      {/* Week Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-2">
          <span className="text-xs font-bold text-text-dim uppercase">Total Hours (Week)</span>
          <span className="text-3xl font-bold text-white">40.0</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2 border-l-4 border-emerald-500">
          <span className="text-xs font-bold text-text-dim uppercase">Approved</span>
          <span className="text-3xl font-bold text-emerald-400">32.0</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden">
          <span className="text-xs font-bold text-text-dim uppercase">Status</span>
          <span className={`text-xl font-bold ${
              status === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 
              status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW ? 'text-amber-400' : 'text-primary'
          }`}>
              {status === ENGINE_STATUS.APPROVED ? 'Billing Eligible' : 
               status === ENGINE_STATUS.UNDER_REVIEW ? 'Audit In Progress' : status}
          </span>
        </div>
      </div>

      {/* Entry Form - Minimal 3-5 Click Rule */}
      <div className="glass-card p-8 space-y-6 bg-gradient-to-br from-indigo-900/20 to-transparent">
        <h3 className="text-lg font-bold">Quick Log</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="space-y-2">
             <label className="text-xs font-bold text-text-dim uppercase">Date</label>
             <input type="date" className="w-full bg-white/5" defaultValue="2026-04-18" />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-text-dim uppercase">Hours</label>
             <select className="w-full bg-white/5">
                {[...Array(13)].map((_, i) => <option key={i} value={i}>{i} hrs</option>)}
             </select>
           </div>
           <div className="space-y-2 md:col-span-2">
             <label className="text-xs font-bold text-text-dim uppercase">Project / Task</label>
             <select className="w-full bg-white/5">
                <option>Select Project...</option>
                <option>Verizon - Cloud Migration</option>
                <option>Internal - Training</option>
             </select>
           </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-dim uppercase">Comments (AI Improved)</label>
          <textarea className="w-full h-20 text-sm" placeholder="Worked on CI/CD pipeline optimization..."></textarea>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
             <button className="secondary py-2 px-4 flex items-center gap-2">
               <Upload size={16} /> Upload Proof
             </button>
             <span className="text-xs text-text-dim">Screenshot or PDF from client system</span>
          </div>
          {status === ENGINE_STATUS.DRAFT ? (
                <button 
                  onClick={handleSubmitForReview}
                  disabled={isSubmitting}
                  className="primary px-8 py-2 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'ENGINE PROCESSING...' : 'SUBMIT FOR CONTROL AUDIT'} <ChevronRight size={18} />
                </button>
              ) : (
                <div className={`px-6 py-2 rounded-xl text-center border ${
                    status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20' : 
                    status === ENGINE_STATUS.BYPASSED ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'
                }`}>
                   <p className={`text-xs font-bold uppercase tracking-widest leading-none ${
                       status === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 
                       status === ENGINE_STATUS.BYPASSED ? 'text-red-400' : 'text-amber-400'
                   }`}>
                       {status === ENGINE_STATUS.APPROVED ? 'Billing Audit Passed' : 
                        status === ENGINE_STATUS.BYPASSED ? 'Admin Override Active' : 
                        status === ENGINE_STATUS.UNDER_REVIEW ? 'Audit In Progress' : 'Engine Audit Pending'}
                   </p>
                </div>
              )}
        </div>
      </div>

      {/* History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Recent Entries</h3>
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="glass-card p-4 flex items-center justify-between group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-glass flex items-center justify-center text-text-dim group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="font-bold">{entry.hours} Hours @ {entry.client}</p>
                  <p className="text-xs text-text-dim">{entry.date} • {entry.project}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider ${
                  entry.status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                  entry.status === ENGINE_STATUS.SUBMITTED ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {entry.status === ENGINE_STATUS.APPROVED ? 'Ready for Billing' : entry.status}
                </div>
                <ChevronRight size={18} className="text-text-dim group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timesheets;
