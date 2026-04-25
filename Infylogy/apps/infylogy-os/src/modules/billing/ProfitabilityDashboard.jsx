import { 
  TrendingUp, TrendingDown, DollarSign, Users, AlertCircle, 
  ShieldAlert, Sparkles, Filter, Download, CheckCircle, Clock 
} from 'lucide-react';
import { useState } from 'react';
import { approvalEngine, ENGINE_STATUS } from '../../services/control/approvalEngine';
import ControlOverlay from '../../modules/control-engine/ControlOverlay';
import { useAuth } from '../../app/providers/AuthContext';

const RiskItem = ({ type, severity, description, action, status = 'Alert', onStatusChange }) => {
  const [submissionStatus, setSubmissionStatus] = useState(status === ENGINE_STATUS.SUBMITTED || status === ENGINE_STATUS.UNDER_REVIEW ? status : ENGINE_STATUS.DRAFT);
  const severityColors = {
    'Critical': 'border-red-500/50 bg-red-500/5 text-red-500',
    'High': 'border-amber-500/50 bg-amber-500/5 text-amber-500',
    'Medium': 'border-blue-500/50 bg-blue-500/5 text-blue-500',
    'Low': 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500'
  };

  return (
    <div className={`p-4 rounded-xl border-l-4 ${severityColors[severity]} flex items-start justify-between gap-4 glass`}>
      <div className="flex gap-4">
        <div className="mt-1">
          {type === 'Financial' ? <DollarSign size={20} /> : <ShieldAlert size={20} />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider">{severity} Risk</span>
            <span className="text-xs text-text-dim">• {type}</span>
          </div>
          <p className="text-sm font-medium text-white mt-1">{description}</p>
          <div className="flex items-center justify-between mt-2">
            {submissionStatus === ENGINE_STATUS.DRAFT ? (
              <button 
                onClick={() => setSubmissionStatus(ENGINE_STATUS.SUBMITTED)}
                className="text-xs font-bold underline hover:text-white transition-colors"
              >
                {action}
              </button>
            ) : (
              <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                  submissionStatus === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {submissionStatus === ENGINE_STATUS.SUBMITTED || submissionStatus === ENGINE_STATUS.UNDER_REVIEW ? (
                   <><Clock size={10} className="animate-pulse" /> {submissionStatus === ENGINE_STATUS.UNDER_REVIEW ? 'Audit In Progress' : 'Engine Audit Pending'}</>
                ) : 'Audit Passed'}
              </span>
            )}
          </div>
        </div>
      </div>
      <Sparkles size={16} className="text-primary opacity-50" />
    </div>
  );
};

const ProfitabilityDashboard = () => {
  const { user, role } = useAuth();
  const [invoiceStatus, setInvoiceStatus] = useState(ENGINE_STATUS.DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      await approvalEngine.submit('billing', 'batch-4202-A', user.id, role, { 
        title: `Billing Batch - Verizon - April`,
        reason: 'Monthly invoice cycle reconciliation'
      });
      setInvoiceStatus(ENGINE_STATUS.SUBMITTED);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminBypass = async (reason) => {
    try {
      await approvalEngine.adminBypass('billing', 'batch-4202-A', user.id, reason);
      setInvoiceStatus(ENGINE_STATUS.BYPASSED);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ControlOverlay 
      isLocked={invoiceStatus === ENGINE_STATUS.SUBMITTED || invoiceStatus === ENGINE_STATUS.UNDER_REVIEW}
      status={invoiceStatus}
      reviewer="Financial Controller"
      onBypass={handleAdminBypass}
    >
      <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Intelligence</h1>
          <p className="text-text-dim">Profitability, margins, and AI-driven risk detection.</p>
        </div>
        <div className="flex gap-3">
          {invoiceStatus === ENGINE_STATUS.DRAFT ? (
            <button 
              onClick={handleSubmitForReview}
              disabled={isSubmitting}
              className="primary"
            >
              <CheckCircle size={18} /> {isSubmitting ? 'ENGINE PROCESSING...' : 'SUBMIT BATCH FOR CONTROL AUDIT'}
            </button>
          ) : (
            <div className={`px-4 py-2 border rounded-xl flex items-center gap-2 ${
                invoiceStatus === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20' : 
                invoiceStatus === ENGINE_STATUS.BYPASSED ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              {invoiceStatus === ENGINE_STATUS.SUBMITTED || invoiceStatus === ENGINE_STATUS.UNDER_REVIEW ? (
                <Clock className="text-amber-400 animate-pulse" size={16} />
              ) : invoiceStatus === ENGINE_STATUS.APPROVED ? (
                <CheckCircle className="text-emerald-400" size={16} />
              ) : (
                <ShieldAlert className="text-red-400" size={16} />
              )}
              
              <span className={`text-xs font-bold uppercase tracking-widest ${
                invoiceStatus === ENGINE_STATUS.APPROVED ? 'text-emerald-400' : 
                invoiceStatus === ENGINE_STATUS.BYPASSED ? 'text-red-400' : 'text-amber-400'
              }`}>
                 {invoiceStatus === ENGINE_STATUS.APPROVED ? 'Billing Audit Passed' : 
                  invoiceStatus === ENGINE_STATUS.BYPASSED ? 'Admin Override Active' : 
                  invoiceStatus === ENGINE_STATUS.UNDER_REVIEW ? 'Audit In Progress' : 'Engine Audit Pending'}
              </span>
            </div>
          )}
          <button className="secondary"><Download size={18} /> Export</button>
        </div>
      </div>
    </ControlOverlay>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-dim uppercase">Total Margin (Avg)</span>
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <span className="text-4xl font-bold text-white">28.4%</span>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '28%' }}></div>
          </div>
        </div>
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-dim uppercase">Monthly Revenue</span>
            <DollarSign size={20} className="text-primary" />
          </div>
          <span className="text-4xl font-bold text-white">$412,850</span>
          <p className="text-xs text-emerald-400 font-bold">+12.5% from last month</p>
        </div>
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-dim uppercase">Active AI Spend</span>
            <Sparkles size={20} className="text-purple-400" />
          </div>
          <span className="text-4xl font-bold text-white">$12.45 <span className="text-lg text-text-dim">/ $100</span></span>
          <p className="text-xs text-text-dim font-bold">Projected: $38.20 (Low Risk)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profitability by Employee/Project */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-bold">Margin Analysis by Project</h3>
          <div className="space-y-4">
            {[
              { name: 'Verizon - Cloud Migration', margin: '34%' },
              { name: 'Apple - iOS Refresh', margin: '22%' },
              { name: 'Google - Data Lake', margin: '18%' },
              { name: 'Coinbase - Wallet UI', margin: '42%' }
            ].map((p, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium text-text-dim group-hover:text-white transition-colors">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${parseInt(p.margin) < 20 ? 'text-amber-400' : 'text-white'}`}>{p.margin}</span>
                  <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: p.margin }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full text-xs font-bold text-primary hover:text-white transition-all pt-4 border-t border-border">
            VIEW FULL BREAKDOWN →
          </button>
        </div>

        {/* AI Risk Dashboard */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-primary" /> AI Risk Dashboard
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 font-bold uppercase tracking-widest">4 Critical Issues</span>
          </div>

          <div className="space-y-4">
            <RiskItem 
              type="Financial" 
              severity="Critical" 
              description="Project 'Google - Data Lake' dropped below 20% margin due to high vendor cost."
              action="Optimize Vendor Rates"
            />
            <RiskItem 
              type="Compliance" 
              severity="High" 
              description="3 OPT STEM extensions filing due in less than 30 days."
              action="Open Immigration Task"
            />
            <RiskItem 
              type="Operational" 
              severity="Medium" 
              description="Weekly timesheet approval delay exceeding 48 hours for 12 consultants."
              action="Send Supervisor Reminders"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityDashboard;
