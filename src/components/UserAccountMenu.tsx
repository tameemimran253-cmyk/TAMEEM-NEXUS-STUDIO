import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, Shield, Bot, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audio } from '../utils/audioSystem';

interface UserAccountMenuProps {
  onOpenProjectModal: () => void;
}

export const UserAccountMenu: React.FC<UserAccountMenuProps> = ({ onOpenProjectModal }) => {
  const { user, logout, setProfileModalOpen, setAdminModalOpen, setNexusChatOpen } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'NX';

  const isAdmin = user.role === 'admin' || user.email.toLowerCase() === 'tameemimran253@gmail.com';

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          audio.playClick();
        }}
        onMouseEnter={() => audio.playHover()}
        className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group"
      >
        {user.profilePhotoUrl ? (
          <img
            src={user.profilePhotoUrl}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-purple-500/30"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-700 text-white flex items-center justify-center text-[10px] font-mono-code font-bold tracking-wider border border-purple-400/40">
            {initials}
          </div>
        )}

        <span className="text-xs font-mono-code text-neutral-200 group-hover:text-white max-w-[100px] truncate hidden md:inline-block">
          {user.name.split(' ')[0]}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#08060f]/95 border border-white/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-2 z-50 text-neutral-200"
          >
            {/* User Header */}
            <div className="p-3 border-b border-white/10 mb-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-syne font-bold text-white truncate block max-w-[150px]">
                  {user.name}
                </span>
                {isAdmin && (
                  <span className="px-1.5 py-0.5 rounded bg-purple-900/60 border border-purple-500/40 text-[9px] font-mono-code text-purple-300 uppercase">
                    Admin
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono-code text-neutral-400 truncate block">
                {user.email}
              </span>
            </div>

            {/* Menu Options */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setProfileModalOpen(true);
                  setIsOpen(false);
                  audio.playClick();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono-code hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Profile & Account</span>
              </button>

              <button
                onClick={() => {
                  onOpenProjectModal();
                  setIsOpen(false);
                  audio.playClick();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono-code hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Start / Track Inquiry</span>
              </button>

              <button
                onClick={() => {
                  setNexusChatOpen(true);
                  setIsOpen(false);
                  audio.playClick();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono-code hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                <Bot className="w-3.5 h-3.5 text-purple-300" />
                <span>Ask Nexus AI</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setAdminModalOpen(true);
                    setIsOpen(false);
                    audio.playClick();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono-code bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 text-purple-300 transition-colors cursor-pointer text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <div className="h-[1px] bg-white/10 my-1" />

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  audio.playClick();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono-code text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
