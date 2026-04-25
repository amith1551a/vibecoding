import { useState } from 'react';
import { 
  FileText, Sparkles, TrendingUp, CheckCircle, 
  MessageSquare, User, Clock, ChevronRight, ShieldAlert 
} from 'lucide-react';
import { approvalEngine, ENGINE_STATUS } from '../../services/control/approvalEngine';
import ControlOverlay from '../../modules/control-engine/ControlOverlay';
import { useAuth } from '../../app/providers/AuthContext';

const PerformanceReviews = () => {
  const { user, role } = useAuth();
  const [status, setStatus] = useState(ENGINE_STATUS.DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const metrics = [
    { label: 'Technical Accuracy', score: 92 },
    { label: 'Client Communication', score: 88 },
    { label: 'Timeliness', score: 95 }
  ];

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      await approvalEngine.submit('performance', 'temp-perf-123', user.id, role, { 
        title: `Performance Audit - John Doe (Q2)`,
        reason: 'Finalized AI narrative review'
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
      await approvalEngine.adminBypass('performance', 'temp-perf-123', user.id, reason);
      setStatus(ENGINE_STATUS.BYPASSED);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ControlOverlay 
      isLocked={status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW}
      status={status}
      reviewer="Reviewing Supervisor"
      onBypass={handleAdminBypass}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-primary" size={32} /> Performance Reviews
            </h1>
            <p className="text-text-dim">Annual and monthly performance tracking for consultants.</p>
          </div>
          <div className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider ${
            status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            status === ENGINE_STATUS.SUBMITTED ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
            'bg-white/5 border-border text-text-dim'
          }`}>
            {status === ENGINE_STATUS.APPROVED ? 'Status: Engine Approved' : `Status: ${status}`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
             <div className="glass-card p-8 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold">Review for John Doe</h3>
                   <span className="text-xs text-text-dim">Consultant • Verizon Project</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   {metrics.map(m => (
                     <div key={m.label} className="p-4 rounded-xl bg-white/5 border border-border">
                        <p className="text-[10px] font-bold text-text-dim uppercase">{m.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{m.score}%</p>
                     </div>
                   ))}
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-primary/30 relative overflow-hidden group">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                         <Sparkles size={20} />
                      </div>
                      <div className="flex-1 space-y-2">
                         <p className="text-sm font-bold text-white">AI-Generated Narrative</p>
                         <p className="text-xs text-text-dim leading-relaxed">
                            John consistently exceeds expectations in technical delivery. His recent optimization of the CI/CD pipeline reduced deployment time by 40%. Recommend for "Lead" path in the next quarter.
                         </p>
                      </div>
                   </div>
                   <button className="absolute bottom-4 right-6 text-[10px] font-bold text-primary hover:text-white transition-colors">REGENERATE WITH PREMIUM AI →</button>
                </div>
             </div>
          </div>

          <div className="md:col-span-1 border-l border-border pl-0 md:pl-8 space-y-6">
             <div className="glass-card p-6 space-y-6">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Supervisor Gate</h4>
                <p className="text-xs text-text-dim leading-relaxed">
                  All performance reviews must be reviewed by the direct supervisor before being shared with the consultant or accounting.
                </p>
                
                  <button 
                    onClick={handleSubmitForReview}
                    disabled={isSubmitting}
                    className="w-full primary py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                  >
                    {isSubmitting ? 'ENGINE PROCESSING...' : 'SUBMIT FOR CONTROL AUDIT'} <ChevronRight size={18} />
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl text-center space-y-2 border ${
                      status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20' : 
                      status === ENGINE_STATUS.BYPASSED ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'
                  }`}>
                     {status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW ? (
                      <Clock className="mx-auto text-amber-400 animate-pulse" size={24} />
                     ) : status === ENGINE_STATUS.APPROVED ? (
                      <CheckCircle className="mx-auto text-emerald-400" size={24} />
                     ) : (
                      <ShieldAlert className="mx-auto text-red-400" size={24} />
                     )}
                     
                     <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${
                         status === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 
                         status === ENGINE_STATUS.BYPASSED ? 'text-red-400' : 'text-amber-400'
                     }`}>
                         {status === ENGINE_STATUS.APPROVED ? 'Audit Passed' : 
                          status === ENGINE_STATUS.BYPASSED ? 'Admin Override Active' : 
                          status === ENGINE_STATUS.UNDER_REVIEW ? 'Audit In Progress' : 'Engine Audit Pending'}
                     </p>
                  </div>
             </div>
          </div>
        </div>
      </div>
    </ControlOverlay>
  );
};

export default PerformanceReviews;
