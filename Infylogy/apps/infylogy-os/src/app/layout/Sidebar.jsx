import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShieldCheck, FileSearch, 
  Clock, DollarSign, TrendingUp, Activity, 
  LogOut, ClipboardCheck, User, ShieldAlert,
  Gift, UserMinus
} from 'lucide-react';
import { useAuth } from '../providers/AuthContext';

const Sidebar = () => {
  const { role } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Recruiter', 'Employee', 'HR', 'Immigration', 'Supervisor', 'Accounting', 'Client'] },
    { name: 'Bench', path: '/bench', icon: Users, roles: ['Admin', 'Recruiter', 'HR', 'Supervisor'] },
    { name: 'Immigration', path: '/immigration', icon: ShieldCheck, roles: ['Admin', 'Immigration', 'HR', 'Employee'] },
    { name: 'Onboarding', path: '/onboarding', icon: ClipboardCheck, roles: ['Admin', 'HR', 'Supervisor'] },
    { name: 'Benefits', path: '/benefits', icon: Gift, roles: ['Admin', 'Employee', 'HR'] },
    { name: 'Resume Match', path: '/resumes', icon: FileSearch, roles: ['Admin', 'Recruiter'] },
    { name: 'Leads', path: '/leads', icon: TrendingUp, roles: ['Admin', 'Recruiter', 'Supervisor'] },
    { name: 'Timesheets', path: '/timesheets', icon: Clock, roles: ['Admin', 'Employee', 'Supervisor', 'Accounting'] },
    { name: 'Performance', path: '/performance', icon: Activity, roles: ['Admin', 'Supervisor', 'Employee'] },
    { name: 'Billing', path: '/billing', icon: DollarSign, roles: ['Admin', 'Accounting', 'Supervisor'] },
    { name: 'Offboarding', path: '/offboarding', icon: UserMinus, roles: ['Admin', 'HR', 'Supervisor'] },
    { name: 'Control Queue', path: '/control', icon: ShieldAlert, roles: ['Admin', 'Supervisor'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="sidebar">
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
          I
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Infylogy</h1>
          <p className="text-[10px] text-text-dim uppercase tracking-widest font-bold">Staffing OS</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
        {filteredItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-border mt-auto">
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-link mb-2 ${isActive ? 'active' : ''}`}
        >
          <User size={20} />
          <span>My Profile</span>
        </NavLink>
        <button className="nav-link w-full text-left hover:text-red-400 bg-transparent">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
