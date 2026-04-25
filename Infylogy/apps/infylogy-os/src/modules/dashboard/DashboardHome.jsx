import React from 'react';
import { 
  Users, ShieldCheck, FileSearch, Clock, 
  DollarSign, TrendingUp, Activity, LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { Link } from 'react-router-dom';

const Tile = ({ name, icon: Icon, path, roles, userRole }) => {
  if (!roles.includes(userRole)) return null;

  return (
    <Link to={path} className="stat-tile group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <Icon size={24} />
        </div>
        <ArrowRight size={18} className="text-text-dim opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-xs text-text-dim">Overview and management for {name.toLowerCase()} modules.</p>
    </Link>
  );
};

const DashboardHome = () => {
  const { role, user } = useAuth();

  const tiles = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['Admin', 'Recruiter', 'Employee', 'HR', 'Immigration', 'Supervisor', 'Accounting', 'Client'] },
    { name: 'Bench', icon: Users, path: '/bench', roles: ['Admin', 'Recruiter', 'HR', 'Supervisor'] },
    { name: 'Immigration', icon: ShieldCheck, path: '/immigration', roles: ['Admin', 'Immigration', 'HR', 'Employee'] },
    { name: 'Resume Engine', icon: FileSearch, path: '/resumes', roles: ['Admin', 'Recruiter'] },
    { name: 'Timesheets', icon: Clock, path: '/timesheets', roles: ['Admin', 'Employee', 'Supervisor', 'Accounting'] },
    { name: 'Billing', icon: DollarSign, path: '/billing', roles: ['Admin', 'Accounting', 'Supervisor'] },
    { name: 'Leads', icon: TrendingUp, path: '/leads', roles: ['Admin', 'Recruiter', 'Supervisor'] },
    { name: 'Control Queue', icon: Activity, path: '/control', roles: ['Admin', 'Supervisor'] },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
        <p className="text-text-dim mt-1">Status and operational health for your Infylogy workspace.</p>
      </div>

      <div className="tile-grid">
        {tiles.map((tile) => (
          <Tile key={tile.name} {...tile} userRole={role} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 space-y-4">
          <h3 className="text-xl font-bold text-white">Action Required</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Pending Approval #{1024 + i}</p>
                    <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest">Supervisor Queue</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary hover:underline">Review Now</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 border-border/50">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-text-dim">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Quick Access Settings</h4>
            <p className="text-xs text-text-dim max-w-[280px]">Custom widgets and system metrics will be available in the next version of the dashboard.</p>
          </div>
          <button className="secondary text-xs">Configure Layout</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
