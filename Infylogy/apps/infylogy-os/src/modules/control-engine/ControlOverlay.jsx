import React, { useState } from 'react';
import { Shield, Clock, Lock, ChevronRight, AlertTriangle } from 'lucide-react';
import { ENGINE_STATUS } from '../../services/control/approvalEngine';

const ControlOverlay = ({ isLocked, status, children, reviewer = 'Supervisor', onBypass }) => {
  const [showBypass, setShowBypass] = useState(false);
  const [bypassReason, setBypassReason] = useState('');

  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative">
      {/* The Locked Content */}
      <div className="opacity-40 pointer-events-none filter blur-[2px] select-none transition-all duration-700">
        {children}
      </div>

      {/* The Security Layer */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg glass p-8 border-primary/30 shadow-2xl animate-scale-up text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto relative">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
             <Shield className="text-primary relative z-10" size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Record Under Control Audit</h2>
            <p className="text-text-dim text-sm max-w-[320px] mx-auto">
              This module is currently locked. A **{reviewer}** is auditing the data for compliance and accuracy.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 py-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-border">
                <Clock className="text-amber-400 animate-pulse" size={16} />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{status}</span>
             </div>
          </div>

          <div className="pt-6 border-t border-border space-y-4">
            {!showBypass ? (
              <button 
                onClick={() => setShowBypass(true)}
                className="text-[10px] font-bold text-text-dim hover:text-red-400 transition-colors tracking-widest uppercase flex items-center gap-2 mx-auto"
              >
                <Lock size={12} /> Request High-Privilege Admin Bypass
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <textarea 
                  className="w-full text-xs bg-red-500/5 border-red-500/20 focus:border-red-500/50" 
                  placeholder="Mandatory: Why is this bypass required?"
                  value={bypassReason}
                  onChange={(e) => setBypassReason(e.target.value)}
                ></textarea>
                <div className="flex gap-2">
                  <button onClick={() => setShowBypass(false)} className="secondary text-[10px] flex-1">Cancel</button>
                  <button 
                    onClick={() => onBypass(bypassReason)}
                    disabled={!bypassReason}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] py-2 px-4 rounded-xl flex-1 flex items-center justify-center gap-2"
                  >
                    <AlertTriangle size={12} /> CONFIRM BYPASS
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

export default ControlOverlay;
