import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Users, Clock, AlertCircle, Plus, Filter, ChevronDown } from 'lucide-react';

const STATUS_COLORS = {
  'Open': 'bg-primary/10 text-primary',
  'In Review': 'bg-amber-500/10 text-amber-400',
  'Submitted': 'bg-indigo-500/10 text-indigo-400',
  'Interviewing': 'bg-purple-500/10 text-purple-400',
  'Filled': 'bg-emerald-500/10 text-emerald-400',
  'Closed': 'bg-red-500/10 text-red-400'
};

const ReqCard = ({ req }) => (
  <div className="glass-card p-6 flex flex-col gap-4 border border-border hover:border-primary/50 transition-all group">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{req.vendor}</span>
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{req.title}</h3>
      </div>
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[req.status]}`}>
        {req.status}
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {req.skills.map(skill => (
        <span key={skill} className="px-2 py-0.5 rounded bg-glass border border-border text-[10px] text-text-dim">
          {skill}
        </span>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2 text-xs text-text-dim">
        <MapPin size={14} /> {req.location}
      </div>
      <div className="flex items-center gap-2 text-xs text-text-dim">
        <DollarSign size={14} /> {req.rate}
      </div>
      <div className="flex items-center gap-2 text-xs text-text-dim">
        <Clock size={14} /> {req.posted}
      </div>
      <div className="flex items-center gap-2 text-xs text-text-dim">
        <Users size={14} /> {req.owner}
      </div>
    </div>

    <div className="flex gap-2 mt-2">
      <button className="flex-1 primary py-2 text-xs font-bold">Find Matches</button>
      <button className="secondary p-2"><AlertCircle size={16} /></button>
    </div>
  </div>
);

const JobRequisitions = () => {
  const [showAdd, setShowAdd] = useState(false);

  const mockReqs = [
    { id: 'REQ-101', vendor: 'Infosys / Verizon', title: 'Sr. React Architect', skills: ['React 18', 'Typescript', 'Node.js'], location: 'Basking Ridge, NJ', rate: '$90/hr', posted: '2h ago', owner: 'Amith', status: 'Open' },
    { id: 'REQ-102', vendor: 'TATA / Google', title: 'Data Engineer', skills: ['Spark', 'Scala', 'GCP'], location: 'Mountain View, CA', rate: '$95/hr', posted: '1d ago', owner: 'Amith', status: 'In Review' },
    { id: 'REQ-103', vendor: 'Wipro / Apple', title: 'Full Stack Engineer', skills: ['Python', 'Django', 'React'], location: 'Austin, TX', rate: '$85/hr', posted: '3d ago', owner: 'Marketing Team', status: 'Submitted' },
    { id: 'REQ-104', vendor: 'Direct Client', title: 'Golang Backend Developer', skills: ['Go', 'Kubernetes', 'gRPC'], location: 'Remote', rate: '$100/hr', posted: '4d ago', owner: 'Amith', status: 'Interviewing' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Job Requisitions</h1>
          <p className="text-text-dim">Track and manage active requirements from vendors and direct clients.</p>
        </div>
        <button className="primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> New Requisition
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
          <input 
            type="text" 
            placeholder="Search reqs, clients, or skills..." 
            className="w-full pl-12"
          />
        </div>
        <button className="secondary">
          <Filter size={18} /> Filter <ChevronDown size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockReqs.map(req => <ReqCard key={req.id} req={req} />)}
      </div>
    </div>
  );
};

export default JobRequisitions;
