import React, { useState } from 'react';
import { ClipboardCheck, FileText, UserCheck, Clock, ShieldCheck, ChevronRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { approvalEngine, ENGINE_STATUS } from '../../services/control/approvalEngine';
import ControlOverlay from '../../modules/control-engine/ControlOverlay';
import { useAuth } from '../../app/providers/AuthContext';

const Onboarding = () => {
  const { user, role } = useAuth();
  const [status, setStatus] = useState(ENGINE_STATUS.DRAFT);
  const [completion, setCompletion] = useState(85);

  const steps = [
    { name: 'Offer Letter Signed', completed: true },
    { name: 'Payroll Setup (W4/I9)', completed: true },
    { name: 'Employee Handbook Acknowledgement', completed: true },
    { name: 'Client-Specific NDAs', completed: false }
  ];

  const handleSubmitForReview = async () => {
    try {
      await approvalEngine.submit('onboarding', 'temp-onb-123', user.id, role, { 
        title: `Onboarding Activation - Sarah K.`,
        reason: '100% Documentation Complete'
      });
      setStatus(ENGINE_STATUS.SUBMITTED);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminBypass = async (reason) => {
    try {
      await approvalEngine.adminBypass('onboarding', 'temp-onb-123', user.id, reason);
      setStatus(ENGINE_STATUS.BYPASSED);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ControlOverlay 
      isLocked={status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW}
      status={status}
      reviewer="HR Director"
      onBypass={handleAdminBypass}
    >
      <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <ClipboardCheck className="text-primary" size={32} /> Employee Onboarding
          </h1>
          <p className="text-text-dim">Manage W2 consultant onboarding and assignment readiness.</p>
        </div>
        <div className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider ${
          status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          status === ENGINE_STATUS.SUBMITTED ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
          status === ENGINE_STATUS.BYPASSED ? 'bg-red-500/10 border-red-500/20 text-red-500' :
          'bg-white/5 border-border text-text-dim'
        }`}>
          {status === ENGINE_STATUS.APPROVED ? 'Status: Engine Approved' : `Status: ${status}`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-8 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Onboarding Completion</h3>
              <span className="text-primary font-bold">{completion}%</span>
           </div>
           <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${completion}%` }}></div>
           </div>

           <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border bg-white/5">
                   <div className="flex items-center gap-3">
                      {step.completed ? <CheckCircle className="text-emerald-400" size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-border"></div>}
                      <span className={`text-sm ${step.completed ? 'text-white' : 'text-text-dim'}`}>{step.name}</span>
                   </div>
                   {step.completed && <span className="text-[10px] font-bold text-emerald-400 uppercase">Verified</span>}
                </div>
              ))}
           </div>
        </div>

        <div className="md:col-span-1 space-y-6">
           <div className="glass-card p-6 space-y-6">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Assignment Readiness</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-glass flex items-center justify-center text-text-dim">
                       <FileText size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold">Project Assignment</p>
                       <p className="text-[10px] text-text-dim">Verizon - Cloud Migration</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-glass flex items-center justify-center text-text-dim">
                       <UserCheck size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold">Manager Approval</p>
                       <p className="text-[10px] text-text-dim">Waiting for final sign-off</p>
                    </div>
                 </div>
              </div>

                <button 
                  onClick={handleSubmitForReview}
                  className="w-full primary py-3 mt-4 text-[10px] font-bold uppercase tracking-widest"
                >
                  RELEASE TO CONTROL ENGINE <ChevronRight size={18} />
                </button>
              ) : status === ENGINE_STATUS.DRAFT ? (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2 mt-4">
                   <Clock className="text-amber-400 shrink-0" size={14} />
                   <p className="text-[10px] text-amber-400">Complete all steps to release to engine.</p>
                </div>
              ) : status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center mt-4">
                   <p className="text-xs font-bold text-amber-400 uppercase tracking-widest leading-none">
                      {status === ENGINE_STATUS.UNDER_REVIEW ? 'Audit In Progress' : 'Engine Audit Pending'}
                   </p>
                   <p className="text-[10px] text-amber-400/70 mt-1">Ref: #ONB-4202</p>
                </div>
              ) : (
                <div className={`p-4 rounded-xl text-center mt-4 border ${
                    status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <span className={`text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${
                    status === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {status === ENGINE_STATUS.APPROVED ? 'Activation Approved' : 'Admin Bypass Active'}
                  </span>
                </div>
              )}
           </div>
        </div>
      </div>
    </ControlOverlay>

       {/* Simulation Tooltip */}
       <div className="text-center">
         <button onClick={() => setCompletion(100)} className="secondary text-[10px] underline">
            [Dev Only] Mock 100% Completion
         </button>
       </div>
    </div>
  );
};

export default Onboarding;
