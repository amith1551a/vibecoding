import React, { useState, useEffect } from 'react';
import { Shield, FileWarning, CheckCircle, Upload, Calendar, Globe, Info, AlertCircle, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { approvalEngine, ENGINE_STATUS } from '../../services/control/approvalEngine';
import ControlOverlay from '../../modules/control-engine/ControlOverlay';
import { useAuth } from '../../app/providers/AuthContext';

const CATEGORIES = [
  "U.S. Citizen", "Lawful Permanent Resident", "H-1B", "TN", "E-3", 
  "OPT", "STEM OPT", "CPT", "EAD Holder", "H-4 EAD", "L-2S Spouse",
  "E-1S / E-2S / E-3S Spouse", "Asylee", "Refugee", "Other"
];

const ImmigrationReadiness = () => {
  const { user, role } = useAuth();
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState(ENGINE_STATUS.DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const checklist = [
    { name: 'I-797 (Approval Notice)', status: 'uploaded', date: '2025-10-12' },
    { name: 'I-94 (Latest)', status: 'uploaded', date: '2024-05-20' },
    { name: 'Passport (Bio Page)', status: 'missing', date: null },
    { name: 'Latest 3 Paystubs', status: 'missing', date: null }
  ];

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      await approvalEngine.submit('immigration', 'temp-id-123', user.id, role, { 
        title: `H-1B Review - Case #4202`,
        reason: 'Ready to Market release'
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
      await approvalEngine.adminBypass('immigration', 'temp-id-123', user.id, reason);
      setStatus(ENGINE_STATUS.BYPASSED);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ControlOverlay 
      isLocked={status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW}
      status={status}
      submittedAt="2 minutes ago"
      onBypass={handleAdminBypass}
    >
      <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="text-primary" size={32} /> Immigration Readiness
          </h1>
          <p className="text-text-dim">Verify work authorization and compliance before marketing.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 border rounded-full ${
          status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          status === ENGINE_STATUS.SUBMITTED ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
          status === ENGINE_STATUS.BYPASSED ? 'bg-red-500/10 border-red-500/20 text-red-500' :
          'bg-white/10 border-border text-text-dim'
        }`}>
          <FileWarning size={16} className={status === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 'text-amber-400'} />
          <span className="text-xs font-bold uppercase tracking-wider">Control Status: {status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Auth Info - LEFT */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Core Profile</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-dim">Work Authorization Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border-border"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-dim">Country of Citizenship</label>
              <input type="text" placeholder="e.g. India" className="w-full" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-dim">Authorization Expiry Date</label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                <input type="date" className="w-full" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
              <Info size={16} className="text-primary mt-0.5" />
              <p className="text-xs leading-relaxed">
                Marketing will be enabled automatically once all mandatory documents are verified by the Compliance team.
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Center - RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Document Checklist</h3>
              <span className="text-xs text-text-dim">2 of 4 Uploaded</span>
            </div>

            <div className="space-y-4">
              {checklist.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${doc.status === 'uploaded' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {doc.status === 'uploaded' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{doc.name}</h4>
                      <p className="text-xs text-text-dim">
                        {doc.status === 'uploaded' ? `Verified till ${doc.date}` : 'Action Required'}
                      </p>
                    </div>
                  </div>
                  <button className={`p-2 rounded-lg transition-colors ${doc.status === 'uploaded' ? 'bg-glass text-text-dim hover:text-white' : 'primary'}`}>
                    {doc.status === 'uploaded' ? <Globe size={18} /> : <Upload size={18} />}
                  </button>
                </div>
              ))}
            </div>

            {/* AI Assistant Readiness Insight */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-primary/30 relative overflow-hidden">
               {status === ENGINE_STATUS.DRAFT ? (
                <button 
                  onClick={handleSubmitForReview}
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? 'ENGINE PROCESSING...' : 'RELEASE TO SUPERVISOR ENGINE'} <ChevronRight size={18} />
                </button>
              ) : status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW ? (
                <div className="w-full p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <span className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Clock className="animate-pulse" size={18} /> {status === ENGINE_STATUS.UNDER_REVIEW ? 'Audit In Progress' : 'Engine Audit Pending'}
                  </span>
                </div>
              ) : (
                <div className={`w-full p-4 rounded-xl text-center border ${
                  status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <span className={`text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${
                    status === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {status === ENGINE_STATUS.APPROVED ? (
                      <><CheckCircle size={18} /> Ready to Market release Approved</>
                    ) : (
                      <><ShieldAlert size={18} /> ADMIN BYPASS ACTIVE</>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ControlOverlay>
    </div>
  );
};

export default ImmigrationReadiness;

