import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { auth } from '../../services/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please contact your system administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md glass p-10 space-y-8 animate-scale-up relative z-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-xl shadow-primary/30 mb-6">
            I
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-text-dim text-sm">Log in to manage your Infylogy workspace</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-fade">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
              <input 
                type="email" 
                required 
                className="w-full pl-12 bg-white/5 border-border text-white focus:border-primary transition-all rounded-xl py-3" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-12 bg-white/5 border-border text-white focus:border-primary transition-all rounded-xl py-3" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full primary py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base shadow-lg shadow-primary/25 active:scale-95 transition-all"
          >
            {loading ? 'Authenticating...' : <><LogIn size={20} /> Access Infylogy</>}
          </button>
        </form>

        <div className="text-center">
          <button className="text-xs text-text-dim hover:text-white transition-colors bg-transparent border-none">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
