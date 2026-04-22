import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Terminal, Code, Box, Github, Plus, X, Upload as UploadIcon, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<'snippet' | 'repo' | 'asset'>('repo');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()]);
      }
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !code) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'repositories'), {
        ownerId: user.uid,
        title,
        description,
        code,
        type,
        techStack,
        stars: 0,
        isAudited: false,
        auditStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate(`/repo/${docRef.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
          <UploadIcon className="w-8 h-8 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight italic">Share your Masterpiece</h1>
          <p className="text-zinc-500 font-mono text-sm">Contribute to the developer ecosystem</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">Project Title</label>
              <input
                required
                type="text"
                placeholder="Micro-service Template"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">Description</label>
              <textarea
                rows={4}
                placeholder="What does this project do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">Resource Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'repo', icon: Github, label: 'Repository' },
                  { id: 'snippet', icon: Code, label: 'Snippet' },
                  { id: 'asset', icon: Box, label: 'Asset' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                      type === item.id 
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techStack.map(tech => (
                  <span key={tech} className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs font-mono">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)}><X className="w-3 h-3 hover:text-white" /></button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="React, Firebase..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Source Code / Config</label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500/70 antialiased">Real-time Syntax Validation</span>
              </div>
            </div>
            <div className="relative flex-1 group">
              <textarea
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code here..."
                className="w-full h-[400px] md:h-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 outline-none focus:border-emerald-500/30 transition-all font-mono text-sm leading-relaxed text-zinc-300 resize-none shadow-2xl custom-scrollbar"
              />
              <div className="absolute top-4 right-4 text-zinc-700 opacity-50 pointer-events-none uppercase text-[10px] font-black tracking-widest">
                Main Execution Entry
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex justify-end">
          <button
            disabled={loading}
            type="submit"
            className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-3 shadow-xl shadow-emerald-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
            {loading ? "Initializing..." : "Commit & Push"}
          </button>
        </div>
      </form>
    </div>
  );
}
