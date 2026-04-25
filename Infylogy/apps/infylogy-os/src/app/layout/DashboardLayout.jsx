import React, { useState, useEffect, useCallback } from 'react';
import { User, Bell, Search, ChevronDown, Filter, Loader2, FileText, Activity, Clock, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../providers/AuthContext';
import { globalSearch, debounce } from '../../services/control/searchService';
import { ENGINE_STATUS } from '../../services/control/approvalEngine';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search execution
  const executeSearch = useCallback(
    debounce(async (term, filter) => {
      if (!term && filter === 'All') {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await globalSearch(term, role, user?.uid, { status: filter });
        setResults(data);
      } catch (e) {
        console.error("Search error", e);
      } finally {
        setIsSearching(false);
      }
    }, 400),
    [role, user]
  );

  useEffect(() => {
    executeSearch(searchTerm, statusFilter);
  }, [searchTerm, statusFilter, executeSearch]);

  return (
    <header className="top-header">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-lg">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search OS: Candidates, Leads, Timesheets..." 
              className="w-full pl-12 bg-white/5 border-border text-sm focus:bg-white/10 transition-all rounded-xl py-2.5"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />
            
            {(role === 'Admin' || role === 'Supervisor') && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <div className="w-[1px] h-4 bg-border"></div>
                 <select 
                    className="bg-transparent border-none text-[10px] font-bold text-text-dim focus:ring-0 cursor-pointer hover:text-white transition-colors outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                 >
                    <option value="All">All Status</option>
                    <option value={ENGINE_STATUS.SUBMITTED}>Submitted</option>
                    <option value={ENGINE_STATUS.UNDER_REVIEW}>In Audit</option>
                    <option value={ENGINE_STATUS.APPROVED}>Approved</option>
                 </select>
              </div>
            )}
          </div>

          {showResults && (searchTerm || statusFilter !== 'All') && (
            <div className="absolute top-full left-0 right-0 mt-2 glass p-2 border border-primary/20 shadow-2xl z-[500] animate-scale-up">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 mb-2">
                 <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest leading-none">
                   {isSearching ? 'Indexing OS...' : `${results.length} Discovery Results`}
                 </span>
                 <button onClick={() => setShowResults(false)} className="text-[10px] text-text-dim hover:text-white transition-colors">Close</button>
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {results.map((res) => (
                  <Link 
                    key={`${res.type}-${res.id}`} 
                    to={`/${res.type}`} 
                    onClick={() => setShowResults(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-glass flex items-center justify-center text-text-dim group-hover:bg-primary/20 group-hover:text-primary transition-all">
                          {res.type === 'candidates' ? <User size={16} /> : 
                           res.type === 'leads' ? <Activity size={16} /> : <Clock size={16} />}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white leading-none">{res.name || res.clientName || res.title}</p>
                          <p className="text-[10px] text-text-dim uppercase mt-1 tracking-wider">{res.type}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                         res.status === ENGINE_STATUS.APPROVED ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                         res.status === ENGINE_STATUS.SUBMITTED ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-white/10 border-border text-text-dim'
                       }`}>
                         {res.status}
                       </span>
                       <ChevronRight size={14} className="text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
                
                {results.length === 0 && !isSearching && (
                  <div className="p-8 text-center">
                    <p className="text-xs text-text-dim italic leading-relaxed">No records found within your security scope.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-text-dim hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>

        <div className="h-8 w-[1px] bg-border"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">{user?.displayName || 'User'}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-glass border border-border flex items-center justify-center text-text-dim hover:text-white hover:border-primary transition-all cursor-pointer">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          <div className="animate-scale-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
