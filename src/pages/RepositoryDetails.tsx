import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc, collection, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { auditCode } from '../lib/gemini';
import { CodeViewer } from '../components/CodeViewer';
import { 
  Shield, AlertTriangle, CheckCircle, Bug, Star, 
  Share2, ArrowLeft, Loader2, User as UserIcon, Calendar 
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { motion } from 'motion/react';

export function RepositoryDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  useEffect(() => {
    async function fetchRepo() {
      if (!id) return;
      try {
        const docRef = doc(db, 'repositories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRepo({ id: docSnap.id, ...docSnap.data() });
          
          // Fetch existing audit if any
          const auditSnap = await getDocs(query(collection(db, 'repositories', id, 'audits'), orderBy('timestamp', 'desc')));
          if (!auditSnap.empty) {
            setAuditResult(auditSnap.docs[0].data());
          }
        }
      } catch (error) {
        console.error("Error fetching repository:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRepo();
  }, [id]);

  const handleAudit = async () => {
    if (!repo || !id || auditing) return;
    setAuditing(true);
    try {
      const result = await auditCode(repo.code, repo.title);
      
      // Save audit result
      const auditRef = doc(collection(db, 'repositories', id, 'audits'));
      const auditData = {
        ...result,
        repoId: id,
        timestamp: serverTimestamp(),
      };
      await setDoc(auditRef, auditData);
      
      // Update repo status
      await updateDoc(doc(db, 'repositories', id), {
        auditStatus: result.status,
        isAudited: true,
        updatedAt: serverTimestamp()
      });

      setAuditResult(auditData);
      setRepo(prev => ({ ...prev, auditStatus: result.status, isAudited: true }));
    } catch (error) {
      console.error("Audit failed:", error);
    } finally {
      setAuditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Repository not found</h1>
        <Link to="/" className="text-emerald-500 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tightest mb-2 italic">
                  {repo.title}
                </h1>
                <div className="flex items-center gap-4 text-zinc-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4" />
                    {repo.ownerId === user?.uid ? 'You' : 'Community Author'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(repo.createdAt?.toDate ? repo.createdAt.toDate() : repo.createdAt)}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                <Star className="w-4 h-4" />
                {repo.stars || 0}
              </button>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {repo.description}
            </p>
            <div className="flex gap-2">
              {repo.techStack?.map((tech: string) => (
                <span key={tech} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-500">
              Source Code
            </h2>
            <CodeViewer 
              code={repo.code} 
              language="javascript" 
              filename={`${repo.title.toLowerCase().replace(/\s+/g, '-')}.js`} 
            />
          </div>

        </div>

        {/* Sidebar - Audit Section */}
        <div className="space-y-6">
          <div className={cn(
            "p-6 rounded-2xl border transition-all duration-500",
            repo.auditStatus === 'safe' ? "bg-emerald-500/5 border-emerald-500/20" :
            repo.auditStatus === 'warning' ? "bg-yellow-500/5 border-yellow-500/20" :
            repo.auditStatus === 'dangerous' ? "bg-red-500/5 border-red-500/20" :
            "bg-zinc-900 border-zinc-800"
          )}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <Shield className={cn(
                  "w-5 h-5",
                  repo.auditStatus === 'safe' ? "text-emerald-400" :
                  repo.auditStatus === 'warning' ? "text-yellow-400" :
                  repo.auditStatus === 'dangerous' ? "text-red-400" :
                  "text-zinc-500"
                )} />
                Security Audit
              </h3>
              {repo.isAudited && (
                <div className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                  repo.auditStatus === 'safe' ? "bg-emerald-400 text-black" :
                  repo.auditStatus === 'warning' ? "bg-yellow-400 text-black" :
                  "bg-red-500 text-white"
                )}>
                  {repo.auditStatus}
                </div>
              )}
            </div>

            {repo.isAudited ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="32" cy="32" r="28"
                        className="fill-none stroke-zinc-800 stroke-[4]"
                      />
                      <circle
                        cx="32" cy="32" r="28"
                        className={cn(
                          "fill-none stroke-[4] transition-all duration-1000",
                          repo.auditStatus === 'safe' ? "stroke-emerald-400" :
                          repo.auditStatus === 'warning' ? "stroke-yellow-400" :
                          "stroke-red-400"
                        )}
                        strokeDasharray={176}
                        strokeDashoffset={176 - (176 * (auditResult?.score || 0)) / 100}
                      />
                    </svg>
                    <span className="absolute text-lg font-black font-mono">
                      {auditResult?.score}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Safety Score</div>
                    <div className="text-sm font-medium italic text-zinc-300 line-clamp-2">
                      {auditResult?.summary}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Findings</h4>
                  <ul className="space-y-2">
                    {auditResult?.findings?.map((finding: string, i: number) => (
                      <li key={i} className="flex gap-2 text-xs text-zinc-400">
                        <Bug className="w-3.5 h-3.5 shrink-0 text-zinc-600 mt-0.5" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={handleAudit}
                  disabled={auditing}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {auditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  Rescan with Gemini
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-zinc-500 mb-6 italic">
                  This repository has not been audited yet. Users are advised to scan before use.
                </p>
                <button
                  onClick={handleAudit}
                  disabled={auditing}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  {auditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  {auditing ? "Analyzing..." : "Perform AI Audit"}
                </button>
              </div>
            )}
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <h3 className="font-bold uppercase tracking-wider text-sm mb-4">Share Repository</h3>
            <div className="flex gap-2">
              <button className="flex-1 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase">
                <Share2 className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
