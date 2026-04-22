import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Github, LogIn, LogOut, Plus, Search, Terminal, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const { user, profile, login, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Explore', path: '/', icon: Search },
    { name: 'Community', path: '/community', icon: Github },
    { name: 'Auditor', path: '/auditor', icon: Shield },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:bg-emerald-400 transition-colors">
              <Terminal className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-500 font-mono italic">GitTube</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-zinc-800",
                  location.pathname === item.path ? "text-emerald-500" : "text-zinc-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/upload"
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Upload
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                <Link to={`/profile/${user.uid}`} className="flex items-center gap-2 group">
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-zinc-700 group-hover:border-emerald-500 transition-colors" />
                  <span className="hidden sm:inline text-sm font-medium text-zinc-300 group-hover:text-white truncate max-w-[100px]">
                    {profile?.displayName || user.displayName}
                  </span>
                </Link>

                <button onClick={logout} className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
