import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RepositoryCard } from '../components/RepositoryCard';
import { Search, Loader2 } from 'lucide-react';

export function Home() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchRepos() {
      try {
        const q = query(collection(db, 'repositories'), orderBy('createdAt', 'desc'), limit(12));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(repo => 
    repo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.techStack?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-6 uppercase italic bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          The Future of Code Sharing
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-10">
          Share your code, snippets, and game assets on a platform built for developers. 
          Powered by Gemini AI for automatic security auditing.
        </p>

        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search repositories, snippets, tech stacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-200 outline-none focus:border-emerald-500/50 transition-all font-mono text-sm shadow-2xl"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Recent Activity
        </h2>
        <div className="text-xs text-zinc-500 font-mono">
          {filteredRepos.length} results found
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <RepositoryCard key={repo.id} repo={repo} />
          ))}
          {filteredRepos.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-500 font-mono italic">No repositories matched your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
