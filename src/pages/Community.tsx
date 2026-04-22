import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { PostCard } from '../components/PostCard';
import { MessageSquare, Plus, Loader2, X, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newContent) return;

    setSubmitting(true);
    try {
      const tagsArray = newTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      const postData = {
        authorId: user.uid,
        title: newTitle,
        content: newContent,
        tags: tagsArray,
        likes: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'posts'), postData);
      setPosts([{ id: docRef.id, ...postData, createdAt: new Date() }, ...posts]);
      setShowCreate(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight italic bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2">
            Discuss architecture, share ideas, and connect with devs.
          </p>
        </div>
        
        <button
          onClick={() => user ? setShowCreate(true) : alert("Please sign in to post")}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Create Topic
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleCreatePost} className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  New Discussion
                </h2>
                <button type="button" onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Topic Title (e.g. Best way to scale React apps?)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Elaborate on your topic..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-all resize-none italic"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated: react, architecture, help)"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 outline-none focus:border-emerald-500/50 transition-all font-mono text-xs"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  disabled={submitting}
                  type="submit"
                  className="px-8 py-3 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Publish Post
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-700 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
            <span className="font-mono text-xs uppercase tracking-widest">Loading Transmission...</span>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {posts.length === 0 && (
              <div className="py-24 text-center border border-dashed border-zinc-800 rounded-3xl">
                <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 font-mono italic">No discussions yet. Be the first to start one!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
