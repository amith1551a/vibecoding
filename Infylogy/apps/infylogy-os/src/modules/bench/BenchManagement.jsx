import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronDown, Globe, FileText, CheckCircle, Upload } from 'lucide-react';
import { useCollection, firestoreService } from '../../shared/hooks/useFirestore';
import { useAuth } from '../../app/providers/AuthContext';

const STATUS_COLORS = {
  'Bench': 'bg-blue-500/10 text-blue-400',
  'Resume Ready': 'bg-purple-500/10 text-purple-400',
  'Marketing': 'bg-emerald-500/10 text-emerald-400'
};

const BenchManagement = () => {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    skills: '',
    rate: '',
    auth: ''
  });

  const { data: candidates, loading, error } = useCollection('candidates');

  const handleAddConsultant = async (e) => {
    e.preventDefault();
    try {
      await firestoreService.add('candidates', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        status: 'Bench',
        ownerId: user.uid,
        ownerEmail: user.email
      });
      setShowAdd(false);
      setFormData({ name: '', role: '', skills: '', rate: '', auth: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Check Firestore rules.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Bench Management</h1>
          <p className="text-text-dim">Manage consultants ready for marketing and client matching.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="primary">
          <Plus size={18} /> Add Consultant
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, skills, or role..." 
            className="w-full pl-12"
          />
        </div>
        <button className="secondary">
          <Filter size={18} /> Filter <ChevronDown size={14} />
        </button>
      </div>

      {/* Bench Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-text-dim">Synchronizing Bench Data...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Error connecting to Staffing OS.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-border bg-white/5">
              <tr>
                <th className="p-4 text-xs font-bold text-text-dim uppercase">Consultant</th>
                <th className="p-4 text-xs font-bold text-text-dim uppercase">Core Skills</th>
                <th className="p-4 text-xs font-bold text-text-dim uppercase">Target Rate</th>
                <th className="p-4 text-xs font-bold text-text-dim uppercase">Work Auth</th>
                <th className="p-4 text-xs font-bold text-text-dim uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-text-dim uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {candidates.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary text-sm uppercase">
                        {item.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-xs text-text-dim">{item.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(item.skills) ? item.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-glass border border-border text-[10px] text-text-dim">
                          {skill}
                        </span>
                      )) : (
                        <span className="text-[10px] text-text-dim italic">No skills listed</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-white">{item.rate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-text-dim text-xs">
                      <Globe size={14} /> {item.auth}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[item.status] || 'bg-white/10 text-text-dim'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="secondary p-2"><FileText size={16} /></button>
                      <button className="secondary p-2 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20"><CheckCircle size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-text-dim italic">The bench is currently empty. Start adding consultants to begin marketing.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Consultant Slide-over Placeholder */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-[500px] h-full bg-background border-l border-border p-8 animate-fade shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Add Consultant</h2>
              <button onClick={() => setShowAdd(false)} className="secondary p-2">×</button>
            </div>

            <form onSubmit={handleAddConsultant} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dim">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full" 
                  placeholder="e.g. John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dim">Current Role</label>
                <input 
                  type="text" 
                  required 
                  className="w-full" 
                  placeholder="e.g. Full Stack Engineer" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dim">Core Skills (Comma Separated)</label>
                <input 
                  type="text" 
                  required 
                  className="w-full" 
                  placeholder="React, Node, AWS" 
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dim">Target Rate</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full" 
                    placeholder="$ / hr" 
                    value={formData.rate}
                    onChange={(e) => setFormData({...formData, rate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dim">Work Authorization</label>
                  <select 
                    className="w-full"
                    required
                    value={formData.auth}
                    onChange={(e) => setFormData({...formData, auth: e.target.value})}
                  >
                    <option value="">Select Auth</option>
                    <option value="U.S. Citizen">U.S. Citizen</option>
                    <option value="Lawful Permanent Resident">LPR (Green Card)</option>
                    <option value="H-1B">H-1B</option>
                    <option value="TN">TN (Canada/Mexico)</option>
                    <option value="E-3">E-3 (Australia)</option>
                    <option value="OPT/STEM OPT">OPT / STEM OPT</option>
                    <option value="H-4 EAD">H-4 EAD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-border rounded-2xl flex flex-col items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                <Upload className="text-primary" size={32} />
                <div className="text-center">
                  <p className="font-bold">Upload Resume</p>
                  <p className="text-xs text-text-dim">PDF or DOCX (Max 5MB)</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex gap-4">
                <button type="button" onClick={() => setShowAdd(false)} className="secondary flex-1">Cancel</button>
                <button type="submit" className="primary flex-1">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenchManagement;
