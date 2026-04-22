import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Tag, User } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';

interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  commentCount: number;
  createdAt: any;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group"
    >
      <Link to={`/community/post/${post.id}`} className="block space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <User className="w-3.5 h-3.5" />
            <span className="font-mono">Author: {post.authorId.slice(0, 6)}...</span>
            <span>•</span>
            <span>{formatDate(post.createdAt?.toDate ? post.createdAt.toDate() : post.createdAt)}</span>
          </div>
          <div className="flex gap-2">
            {post.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-400 font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h3>

        <p className="text-zinc-400 text-sm line-clamp-2 italic">
          {post.content}
        </p>

        <div className="flex items-center gap-6 pt-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 group-hover:text-emerald-500/70 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-bold">{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 group-hover:text-blue-500/70 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-bold">{post.commentCount || 0}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
