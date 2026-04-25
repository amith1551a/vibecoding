import { 
  Users, Shield, Landmark, Sparkles, TrendingUp, AlertTriangle, 
  Settings, Database, CreditCard, ChevronRight, CheckCircle, Clock
} from 'lucide-react';
import ControlQueue from '../control-engine/ControlQueueComponent';

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
  <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 blur-3xl -mr-12 -mt-12 rounded-full`}></div>
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <h4 className="text-text-dim text-sm font-medium">{label}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

const NavTile = ({ title, description, icon: Icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="group glass-card p-6 flex flex-col gap-4 cursor-pointer hover:bg-white/5 transition-all border border-border hover:border-primary/50"
  >
    <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
      <Icon size={28} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-text-dim mt-1 leading-relaxed">{description}</p>
    </div>
    <div className="mt-auto pt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
      OPEN MODULE <ChevronRight size={14} />
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Welcome & System Pulse */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-text-dim bg-clip-text text-transparent">
          System Overview
        </h1>
        <p className="text-text-dim">Real-time pulse of Infylogy operations and compliance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard label="Active Consultants" value="142" trend={12} icon={Users} color="blue" />
            <StatCard label="Active Control Audits" value="4" trend={-20} icon={Shield} color="amber" />
            <StatCard label="Monthly Revenue" value="$842k" trend={8} icon={TrendingUp} color="emerald" />
            <StatCard label="AI Quality Score" value="98%" trend={2} icon={Sparkles} color="purple" />
          </div>

          {/* Main Navigation Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NavTile 
              title="Global Control Queue" 
              description="Singleton queue for all system transitions. 4 active audits pending review."
              icon={Shield}
              color="amber"
            />
            <NavTile 
              title="Performance Reviews" 
              description="Review AI-generated performance narratives and finalize consultant metrics."
              icon={TrendingUp}
              color="purple"
            />
            <NavTile 
              title="Control Engine Governance" 
              description="System-wide gatekeeping for all 8 major modules. Enforcing mandatory transitions."
              icon={AlertTriangle}
              color="red"
            />
            <NavTile 
              title="Workflow Configuration" 
              description="Enable or disable supervisor approvals for stage transitions across modules."
              icon={Settings}
              color="slate"
            />
          </div>
        </div>

        {/* Right Sidebar - Approval Queue */}
        <div className="lg:col-span-1 border-l border-border pl-0 lg:pl-8 space-y-8">
          <ControlQueue />
          
          {/* Engine Governance Toggles */}
          <div className="glass-card p-6 space-y-4">
             <h4 className="text-xs font-bold uppercase text-primary tracking-widest">Engine Gate Toggles</h4>
             <div className="space-y-3">
                {[
                  { id: 'imm', label: 'Immigration Control Gate', active: true },
                  { id: 'res', label: 'Resume Control Gate', active: true },
                  { id: 'onb', label: 'Onboarding Control Gate', active: true },
                  { id: 'time', label: 'Timesheet Control Gate', active: true }
                ].map(t => (
                  <div key={t.id} className="flex items-center justify-between">
                    <span className="text-sm text-text-dim">{t.label}</span>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${t.active ? 'bg-primary' : 'bg-white/10'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${t.active ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* AI Helper Next Step Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border border-primary/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-primary-light uppercase tracking-widest">AI Suggestion</span>
            <p className="text-lg font-medium text-white">4 audits waiting in the Control Engine. One H-1B case has been 'Under Review' for 12 hours.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="secondary">Review Risks</button>
          <button className="primary">Execute Notification</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
