import React, { useState } from 'react';
import { 
  User, Mail, Shield, Clock, 
  Settings, Key, Bell, CreditCard, 
  CheckCircle, Activity, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';

const UserProfile = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');

  const auditHistory = [
    { id: 1, action: 'Submitted Timesheet', date: '2026-04-18', status: 'In Review' },
    { id: 2, action: 'Updated Skills Profile', date: '2026-04-17', status: 'Completed' },
    { id: 3, action: 'Approved H-1B Document', date: '2026-04-15', status: 'Audited' }
  ];

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Audit Footprint', icon: Activity },
    { name: 'Security', icon: Shield },
    { name: 'Preferences', icon: Settings }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary p-1">
             <div className="w-full h-full rounded-[20px] bg-background flex items-center justify-center text-4xl font-black text-white">
                {user?.displayName?.[0] || 'U'}
             </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-bold text-white tracking-tight">{user?.displayName || 'Infylogy User'}</h1>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30">
                {role}
              </span>
            </div>
            <p className="text-text-dim flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} /> {user?.email || 'user@infylogy.com'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation - Left */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${
                activeTab === tab.name 
                ? 'bg-primary/20 border-primary text-white' 
                : 'bg-white/5 border-border text-text-dim hover:border-white/20'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-sm font-bold tracking-wide">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content - Right */}
        <div className="lg:col-span-9">
          <div className="glass p-8 min-h-[500px] animate-scale-up">
            {activeTab === 'Profile' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">Full Name</label>
                    <input type="text" className="w-full bg-white/5 border-border" defaultValue={user?.displayName || ''} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">Primary Email</label>
                    <input type="text" className="w-full bg-white/5 border-border" defaultValue={user?.email || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">Phone Number</label>
                    <input type="text" className="w-full bg-white/5 border-border" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">Timezone</label>
                    <select className="w-full bg-white/5 border-border">
                       <option>Eastern Standard Time (EST)</option>
                       <option>Pacific Standard Time (PST)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-6 border-t border-border flex justify-end">
                   <button className="primary px-8 py-3 font-bold">Save Profile Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'Audit Footprint' && (
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-bold text-white">Platform Activity Log</h3>
                   <p className="text-xs text-text-dim mt-1">A transparent record of your governance interactions.</p>
                 </div>
                 <div className="space-y-3">
                   {auditHistory.map(item => (
                     <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-white/5 group hover:border-primary/50 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                             <Clock size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">{item.action}</p>
                             <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest">Logged {item.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-border text-[10px] font-bold text-text-dim uppercase tracking-widest">
                            {item.status}
                          </span>
                          <ChevronRight size={16} className="text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
                   <Shield className="text-amber-400 shrink-0" size={24} />
                   <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Multi-Factor Authentication</p>
                      <p className="text-xs text-text-dim leading-relaxed">Boost your account security by enabling SMS or Authenticator app verification.</p>
                   </div>
                </div>
                <div className="space-y-4 pt-4">
                   <button className="w-full text-left p-4 rounded-xl border border-border bg-white/5 hover:border-white/20 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <Key size={20} className="text-text-dim" />
                         <span className="text-sm font-bold">Change Platform Password</span>
                      </div>
                      <ChevronRight size={18} className="text-text-dim" />
                   </button>
                   <button className="w-full text-left p-4 rounded-xl border border-border bg-white/5 hover:border-white/20 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <Bell size={20} className="text-text-dim" />
                         <span className="text-sm font-bold">Manage Active Sessions</span>
                      </div>
                      <ChevronRight size={18} className="text-text-dim" />
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
