import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Star, Shield, Code, Box, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { motion } from 'motion/react';

interface Repository {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  techStack: string[];
  type: 'snippet' | 'repo' | 'asset';
  stars: number;
  auditStatus: 'pending' | 'safe' | 'warning' | 'dangerous';
  createdAt: any;
}

export function RepositoryCard({ repo }: { repo: Repository }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'dangerous': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-3 h-3" />;
      case 'warning': return <AlertTriangle className="w-3 h-3" />;
      case 'dangerous': return <AlertTriangle className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'snippet': return <Code className="w-4 h-4" />;
      case 'repo': return <Github className="w-4 h-4" />;
      case 'asset': return <Box className="w-4 h-4" />;
      default: return <Github className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/30 hover:bg-zinc-900 transition-all"
    >
      <Link to={`/repo/${repo.id}`} className="block p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              {getTypeIcon(repo.type)}
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                {repo.title}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formatDate(repo.createdAt?.toDate ? repo.createdAt.toDate() : repo.createdAt)}
              </p>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider",
            getStatusColor(repo.auditStatus)
          )}>
            {getStatusIcon(repo.auditStatus)}
            {repo.auditStatus}
          </div>
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 min-h-[40px]">
          {repo.description || "No description provided for this repository."}
        </p>

        <div className="flex items-center flex-wrap gap-2 mb-4">
          {repo.techStack?.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 font-mono">
              {tech}
            </span>
          ))}
          {repo.techStack?.length > 3 && (
            <span className="text-[10px] text-zinc-500 font-mono">+{repo.techStack.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <Star className="w-3 h-3" />
            {repo.stars || 0} stars
          </div>
          <div className="text-emerald-500/0 group-hover:text-emerald-500 transition-all text-xs font-bold uppercase flex items-center gap-1">
            View Details
            <span className="text-sm">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
