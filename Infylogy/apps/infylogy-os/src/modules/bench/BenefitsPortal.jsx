import React, { useState } from 'react';
import { 
  Gift, Heart, ShieldCheck, Umbrella, 
  TrendingUp, Clock, FileText, ChevronRight,
  ExternalLink, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';

const BenefitCard = ({ title, description, icon: Icon, color, status, actionLabel }) => (
  <div className="glass-card p-6 flex flex-col gap-6 group hover:bg-white/5 transition-all border border-border hover:border-primary/30">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
        status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-text-dim'
      }`}>
        {status}
      </span>
    </div>
    
    <div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-text-dim leading-relaxed">{description}</p>
    </div>

    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
      <button className="text-[10px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
        {actionLabel} <ChevronRight size={14} />
      </button>
      <ExternalLink size={14} className="text-text-dim opacity-40" />
    </div>
  </div>
);

const BenefitsPortal = () => {
  const { user } = useAuth();

  const benefits = [
    {
      title: 'Premium Health Coverage',
      description: 'Blue Cross Gold Plan including Medical, Dental, and Vision coverage for you and your dependents.',
      icon: Heart,
      color: 'rose',
      status: 'Active',
      actionLabel: 'View ID Cards'
    },
    {
      title: '401(k) Retirement',
      description: '4% company match with immediate vesting via Vanguard. Manage your retirement portfolio.',
      icon: TrendingUp,
      color: 'emerald',
      status: 'Active',
      actionLabel: 'Manage Portfolio'
    },
    {
      title: 'Life & Disability',
      description: 'Group life insurance up to 3x salary and short/long-term disability protection.',
      icon: Umbrella,
      color: 'blue',
      status: 'Active',
      actionLabel: 'Review Policy'
    },
    {
      title: 'Commuter Perks',
      description: 'Pre-tax transit and parking benefits for your daily commute to client sites.',
      icon: Clock,
      color: 'amber',
      status: 'Eligible',
      actionLabel: 'Enroll Now'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-text-dim bg-clip-text text-transparent flex items-center gap-4">
          <Gift className="text-primary" size={40} /> Consultant Benefits Portal
        </h1>
        <p className="text-text-dim">Comprehensive perks and protections for your professional journey at Infylogy.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 space-y-2 border-l-4 border-primary">
          <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">PTO Balance</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">14.5</p>
            <p className="text-xs text-text-dim font-medium uppercase">Days Available</p>
          </div>
        </div>
        <div className="glass p-6 space-y-2 border-l-4 border-emerald-500">
          <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">401(k) Balance</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">$24,842</p>
            <p className="text-xs text-emerald-400 font-medium">+12.4% YTD</p>
          </div>
        </div>
        <div className="glass p-6 space-y-2 border-l-4 border-blue-500">
          <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Employer Contribution</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">$1,250</p>
            <p className="text-xs text-text-dim font-medium uppercase">Per Month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, idx) => (
          <BenefitCard key={idx} {...b} />
        ))}
      </div>

      {/* Support & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-primary" size={24} /> Plan Documents
          </h3>
          <div className="space-y-3">
            {[
              '2024 Summary of Benefits & Coverage (Medical)',
              '401(k) Enrollment Guide & Fund Performance',
              'Employee Assistance Program (EAP) Details',
              'VBA Vision Plan Overview'
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-border group hover:border-primary/50 cursor-pointer transition-all">
                <span className="text-sm font-medium text-text-dim group-hover:text-white">{doc}</span>
                <button className="p-2 rounded-lg bg-glass text-text-dim group-hover:text-primary transition-colors">
                  <FileText size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 glass border border-primary/20 p-8 flex flex-col items-center text-center space-y-6">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={32} />
           </div>
           <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">Need Support?</h4>
              <p className="text-xs text-text-dim leading-relaxed">
                Our HR Benefits team is available Mon-Fri, 9am - 6pm EST to assist with enrollment and claims.
              </p>
           </div>
           <button className="w-full primary py-3 text-xs font-bold uppercase tracking-widest">
             Contact HR Expert
           </button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsPortal;
