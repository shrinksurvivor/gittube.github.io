import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RepositoryCard } from '../components/RepositoryCard';
import { User, Github, Globe, Mail, Loader2, Code, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';

export function Profile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!uid) return;
      try {
        // Fetch user doc
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }

        // Fetch user's repos
        const q = query(
          collection(db, 'repositories'),
          where('ownerId', '==', uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setRepos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold uppercase italic text-zinc-500">Subject Not Found in Database</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="relative w-32 h-32 rounded-full border-2 border-zinc-900 object-cover"
              />
            </div>
            
            <h1 className="text-2xl font-black uppercase tracking-tight italic mb-2">
              {profile.displayName}
            </h1>
            <p className="text-zinc-500 text-sm italic mb-6">
              {profile.bio || "No biography provided. A mysterious developer."}
            </p>

            <div className="w-full space-y-3">
              {profile.githubUrl && (
                <a href={profile.githubUrl} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all text-xs font-bold uppercase text-zinc-400 hover:text-white">
                  <Github className="w-4 h-4" />
                  GitHub Profile
                </a>
              )}
              <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase text-zinc-400">
                <Mail className="w-4 h-4" />
                {profile.email}
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-6">
             <div className="flex justify-between items-center text-sm font-mono tracking-tighter">
                <span className="text-zinc-500 uppercase">Repos</span>
                <span className="text-emerald-500 font-bold">{repos.length}</span>
             </div>
             <div className="flex justify-between items-center text-sm font-mono tracking-tighter">
                <span className="text-zinc-500 uppercase">Rank</span>
                <span className="text-blue-500 font-bold">Lvl {Math.floor(repos.length / 5) + 1}</span>
             </div>
          </div>
        </div>

        {/* Repositories Feed */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Code className="w-6 h-6 text-emerald-500" />
              Published Source
            </h2>
            <LayoutGrid className="w-5 h-5 text-zinc-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map(repo => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
            {repos.length === 0 && (
              <div className="col-span-full py-24 text-center border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-600 font-mono text-sm">Target has not published any repositories yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
