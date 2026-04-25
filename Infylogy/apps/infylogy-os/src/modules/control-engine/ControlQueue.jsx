import React, { useState } from 'react';
import { 
  Activity, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, ArrowUpRight, Search, Filter,
  Clock, Shield, User, ExternalLink
} from 'lucide-react';
import { useCollection } from '../../shared/hooks/useFirestore';
import { approvalEngine, ENGINE_STATUS } from '../../services/control/approvalEngine';
import { useAuth } from '../../app/providers/AuthContext';

const ControlQueue = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [reason, setReason] = useState('');

  // In a real app we'd fetch from multiple collections or a unified 'tasks' collection
  // For Step 4, we'll demonstrate using the 'candidates' and 'immigration' collections
  const { data: candidates } = useCollection('candidates');
  
  const pendingTasks = candidates.filter(c => c.status === ENGINE_STATUS.SUBMITTED || c.status === ENGINE_STATUS.UNDER_REVIEW);

  const handleProcess = async (decision) => {
    if (!selectedTask || !reason) return;
    try {
      await approvalEngine.process('candidates', selectedTask.id, user.uid, decision, reason);
      setSelectedTask(null);
      setReason('');
    } catch (e) {
      console.error(e);
    }
  };

  const startReview = async (task) => {
    await approvalEngine.markUnderReview('candidates', task.id, user.uid);
    setSelectedTask(task);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-primary" size={32} /> Central Control Queue
          </h1>
          <p className="text-text-dim">Unified supervisor audit stream for all system transitions.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-xs font-bold text-white uppercase tracking-widest leading-none mb-1">Supervisor Portal</p>
              <p className="text-[10px] text-primary font-bold">{pendingTasks.length} Pending Audits</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Shield size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        {/* Task List - Left */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex gap-2 mb-4">
            {['All', 'Priority', 'Aging'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all ${
                  filter === f ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-border text-text-dim hover:border-white/20'
                }`}
              >
                {f} Tasks
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <button 
                key={task.id}
                onClick={() => startReview(task)}
                className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedTask?.id === task.id ? 'bg-primary/20 border-primary' : 'bg-surface border-border hover:border-white/20'
                }`}
              >
                {task.status === ENGINE_STATUS.UNDER_REVIEW && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase tracking-widest">
                    In Review
                  </div>
                )}
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center text-text-dim shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                      <User size={20} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5">Bench Audit</p>
                      <h4 className="text-sm font-bold text-white truncate">{task.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={10} className="text-text-dim" />
                        <span className="text-[8px] text-text-dim uppercase font-bold tracking-widest">Submitted 2h ago</span>
                      </div>
                   </div>
                </div>
              </button>
            ))}
            {pendingTasks.length === 0 && (
              <div className="p-12 text-center glass border-dashed">
                <CheckCircle className="mx-auto text-emerald-400 opacity-20 mb-3" size={32} />
                <p className="text-xs text-text-dim font-bold uppercase tracking-widest">Queue Clear</p>
              </div>
            )}
          </div>
        </div>

        {/* Audit Portal - Right */}
        <div className="lg:col-span-8">
           {selectedTask ? (
             <div className="glass h-full p-8 flex flex-col space-y-8 animate-scale-up">
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-4xl">
                      {selectedTask.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Candidate Verification</span>
                        <ChevronRight size={14} className="text-text-dim" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Bench Readiness</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white">{selectedTask.name}</h2>
                      <p className="text-text-dim">{selectedTask.role} • {selectedTask.auth}</p>
                    </div>
                  </div>
                  <button className="secondary p-3"><ExternalLink size={20} /></button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Data Verification Checklist</h4>
                        <div className="space-y-2">
                          {['Identity Verified', 'Right to Work Confirmed', 'Skills Validated', 'Rate Reasonableness'].map(check => (
                             <div key={check} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-border">
                               <div className="w-4 h-4 rounded border border-primary flex items-center justify-center">
                                  <div className="w-2 h-2 bg-primary rounded-sm"></div>
                               </div>
                               <span className="text-xs text-white">{check}</span>
                             </div>
                          ))}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Audit Conclusion</h4>
                         <textarea 
                            className="w-full h-32 text-sm bg-white/5 border-border" 
                            placeholder="Provide formal reasoning for this decision..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                         ></textarea>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleProcess('reject')}
                          disabled={!reason}
                          className="flex-1 py-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-400 hover:text-white transition-all"
                        >
                          <XCircle size={18} /> REJECT
                        </button>
                        <button 
                          onClick={() => handleProcess('approve')}
                          disabled={!reason}
                          className="flex-1 py-4 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 hover:text-white transition-all"
                        >
                          <CheckCircle size={18} /> APPROVE
                        </button>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="glass h-full flex flex-col items-center justify-center text-center p-12 space-y-4 border-dashed border-2">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-text-dim">
                  <Activity size={32} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Select Audit Task</h3>
                  <p className="text-xs text-text-dim max-w-[320px] mx-auto leading-relaxed">
                    Choose a pending stage-gate audit from the left to begin formal review. All decisions are logged immutably.
                  </p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ControlQueue;
