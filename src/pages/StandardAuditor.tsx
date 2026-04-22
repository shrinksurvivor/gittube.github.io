import React, { useState } from 'react';
import { auditCode } from '../lib/gemini';
import { CodeViewer } from '../components/CodeViewer';
import { Shield, Loader2, Bug, Terminal, Copy } from 'lucide-react';
import { cn } from '../lib/utils';

export function StandAloneAuditor() {
  const [code, setCode] = useState('');
  const [auditing, setAuditing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!code || auditing) return;
    setAuditing(true);
    try {
      const res = await auditCode(code, 'standalone-audit.js');
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="bg-emerald-500 p-4 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/20">
          <Shield className="w-12 h-12 text-black" />
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tightest mb-4 italic">Security Auditor</h1>
        <p className="text-zinc-500 max-w-xl font-mono text-sm uppercase">
          AI-Powered static analysis for vulnerabilities and malicious patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Input Buffer
            </h3>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste any code fragment here for security analysis..."
            className="w-full h-[500px] bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 outline-none focus:border-emerald-500/30 transition-all font-mono text-sm resize-none shadow-2xl"
          />
          <button
            onClick={handleAudit}
            disabled={!code || auditing}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {auditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
            {auditing ? "Scanning System..." : "Analyze Security"}
          </button>
        </div>

        <div className="space-y-6">
           <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">Audit Report</h3>
           {result ? (
             <div className="space-y-6">
                <div className={cn(
                  "p-8 rounded-3xl border flex items-center gap-8",
                  result.status === 'safe' ? "bg-emerald-500/10 border-emerald-500/20" :
                  result.status === 'warning' ? "bg-yellow-500/10 border-yellow-500/20" :
                  "bg-red-500/10 border-red-500/20"
                )}>
                  <div className="relative w-24 h-24 flex items-center justify-center scale-110">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="44" className="fill-none stroke-zinc-800 stroke-[6]" />
                      <circle
                        cx="48" cy="48" r="44"
                        className={cn(
                          "fill-none stroke-[6] transition-all duration-1000",
                          result.status === 'safe' ? "stroke-emerald-400" :
                          result.status === 'warning' ? "stroke-yellow-400" :
                          "stroke-red-400"
                        )}
                        strokeDasharray={276}
                        strokeDashoffset={276 - (276 * result.score) / 100}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black font-mono leading-none">{result.score}</span>
                      <span className="text-[8px] font-black uppercase opacity-50 tracking-tighter">SCORE</span>
                    </div>
                  </div>
                  <div>
                    <div className={cn(
                      "text-sm font-black uppercase tracking-widest mb-2",
                      result.status === 'safe' ? "text-emerald-400" :
                      result.status === 'warning' ? "text-yellow-400" :
                      "text-red-400"
                    )}>
                      {result.status}
                    </div>
                    <p className="text-zinc-300 italic text-sm max-w-sm">
                      "{result.summary}"
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Security Findings</h4>
                    <ul className="space-y-3">
                      {result.findings.map((f: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-zinc-400">
                          <Bug className="w-4 h-4 shrink-0 text-zinc-600 mt-0.5" />
                          {f}
                        </li>
                      ))}
                      {result.findings.length === 0 && (
                        <li className="text-sm text-zinc-500 italic">No significant vulnerabilities detected by Gemini.</li>
                      )}
                    </ul>
                  </div>
                </div>
             </div>
           ) : (
             <div className="h-[500px] flex flex-col items-center justify-center bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-zinc-600 space-y-4">
                <Shield className="w-12 h-12 opacity-20" />
                <p className="font-mono text-xs uppercase tracking-widest">Awaiting Input Stream</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
