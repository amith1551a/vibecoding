import React, { useState, useEffect } from 'react';
import { 
  FileSearch, Sparkles, Wand2, Target, 
  AlertTriangle, CheckCircle, ChevronRight, 
  Loader2, FileText, User, ShieldAlert
} from 'lucide-react';
import { aiService } from '../../services/ai/aiService';
import { useCollection } from '../../shared/hooks/useFirestore';
import AiGovernancePortal from '../../shared/components/AiGovernancePortal';
import { useAuth } from '../../app/providers/AuthContext';

const ResumeMatch = () => {
  const { user } = useAuth();
  const { data: candidates } = useCollection('candidates');
  
  // Governance State
  const [usage, setUsage] = useState(21);
  const [quota] = useState(30);
  const [cooldown, setCooldown] = useState(0);
  const [showGovernance, setShowGovernance] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobReq, setJobReq] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [refinedResume, setRefinedResume] = useState('');

  const handleAnalyze = async () => {
    if (!selectedCandidate || !jobReq) return;
    setAnalyzing(true);
    setResult(null); // Clear previous
    try {
      const response = await aiService.process(
        'match',
        `RESUME: ${JSON.stringify(selectedCandidate)}\n\nREQ: ${jobReq}`
      );
      
      // Parse JSON if needed
      let data = typeof response.data === 'string' ? JSON.parse(response.data.replace(/```json|```/g, "")) : response.data;
      
      setResult({
        ...data,
        cached: response.cached,
        cost: response.cost
      });
    } catch (e) {
      console.error(e);
      alert('AI Execution failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePolish = async () => {
    if (!selectedCandidate) return;
    setAnalyzing(true);
    try {
      const response = await aiService.process(
        'polish',
        selectedCandidate.role + ": " + selectedCandidate.skills.join(', '),
        "Targeting a Senior Lead position at Verizon"
      );
      setRefinedResume(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Configuration Side */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileSearch className="text-primary" size={32} /> Resume Match Engine
          </h1>
          <p className="text-text-dim">Match consultants to job requirements using AI intelligence.</p>
        </div>

        <div className="glass p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">1. Select Consultant</label>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {candidates.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedCandidate(c)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedCandidate?.id === c.id ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-border text-text-dim hover:border-white/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${selectedCandidate?.id === c.id ? 'bg-primary text-white' : 'bg-white/10'}`}>
                    {c.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{c.name}</p>
                    <p className="text-[10px] opacity-70">{c.role}</p>
                  </div>
                  <User size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">2. Paste Job Requirement</label>
            <textarea 
              className="w-full h-48 text-sm" 
              placeholder="Paste the LinkedIn job description or internal requisition here..."
              value={jobReq}
              onChange={(e) => setJobReq(e.target.value)}
            ></textarea>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <AiGovernancePortal 
              usage={usage}
              totalQuota={quota}
              projectBudget={42.50}
              cooldownRemaining={cooldown}
              cachedResult={null}
            />

            <button 
              onClick={handleAnalyze}
              disabled={analyzing || !selectedCandidate || !jobReq || cooldown > 0}
              className="w-full primary py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Engine Processing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {cooldown > 0 ? `COOLDOWN ACTIVE (${Math.ceil(cooldown/60)}M)` : 'Run Elite AI Match Analysis'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Side */}
      <div className="space-y-6">
        {!result && !analyzing && (
          <div className="h-full min-h-[500px] glass border-dashed border-2 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-text-dim animate-pulse">
              <Target size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Awaiting Input</h3>
              <p className="text-xs text-text-dim max-w-[280px]">Select a candidate and paste a job description to trigger the AI Match Engine.</p>
            </div>
          </div>
        )}

        {analyzing && (
          <div className="h-full min-h-[500px] glass flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Processing Intelligence</h3>
              <p className="text-xs text-text-dim uppercase tracking-widest font-bold">Resilient matching in progress...</p>
            </div>
          </div>
        )}

        {result && !analyzing && (
          <div className="space-y-6 animate-scale-up">
            {/* Score Card */}
            <div className="glass p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
               <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Match Efficiency</span>
                       {result.cached && <span className="text-[8px] bg-white/10 text-text-dim px-2 py-0.5 rounded-full uppercase">Cached Response</span>}
                    </div>
                    <h2 className="text-5xl font-black text-white">{result.score}%</h2>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${result.score >= 95 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {result.score >= 95 ? 'Elite Match' : 'Review Required'}
                    </span>
                  </div>
               </div>
            </div>

            {/* Reasoning & Gaps */}
            <div className="grid grid-cols-1 gap-6">
               <div className="glass p-6 space-y-4 border-l-4 border-primary">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                    <CheckCircle className="text-primary" size={16} /> Matching Logic
                  </h4>
                  <p className="text-sm text-text-dim leading-relaxed italic">"{result.reasoning}"</p>
               </div>

               <div className="glass p-6 space-y-4 border-l-4 border-red-500">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                    <AlertTriangle className="text-red-500" size={16} /> Skills Gaps Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.gaps.map((gap, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold uppercase border border-red-500/20">
                        {gap}
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            {/* AI Polisher Action */}
            <div className="p-1 pr-1 bg-gradient-to-r from-primary to-secondary rounded-2xl">
               <div className="bg-background rounded-[15px] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Wand2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Targeted Optimizer</h4>
                      <p className="text-[10px] text-text-dim">Est. Cost: ${aiService.getEstimate('polish').toFixed(4)}</p>
                    </div>
                  </div>
                  <button onClick={handlePolish} className="px-6 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90 transition-all flex items-center gap-2">
                    POLISH WITH AI
                  </button>
               </div>
            </div>

            {refinedResume && (
              <div className="glass p-6 space-y-4 animate-fade">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Polished Profile Content</h4>
                  <button className="text-[10px] font-bold text-text-dim hover:text-white transition-colors">COPY TO CLIPBOARD</button>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border text-sm text-text-dim leading-relaxed whitespace-pre-wrap font-mono">
                  {refinedResume}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatch;
