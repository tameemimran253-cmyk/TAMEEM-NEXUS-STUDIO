import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Building, Briefcase, Phone, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audio } from '../utils/audioSystem';

export const ProfileModal: React.FC = () => {
  const { user, profileModalOpen, setProfileModalOpen, updateProfile, deleteAccount } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [projectType, setProjectType] = useState(user?.projectType || 'Website Development');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!profileModalOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    audio.playClick();

    const res = await updateProfile({
      name,
      company,
      projectType,
      phone,
    });

    setSaving(false);
    if (res.success) {
      setSuccessMsg('Profile updated successfully.');
      audio.playSuccess();
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleDelete = async () => {
    audio.playClick();
    await deleteAccount();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#08060f] border border-white/15 p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-neutral-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-syne font-bold text-white">Client Profile & Preferences</h3>
                <p className="text-xs font-mono-code text-neutral-400">
                  Tameem Nexus Studio Client ID: <span className="text-purple-400">{user.id}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setProfileModalOpen(false);
                audio.playClick();
              }}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Feedback banner */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono-code text-emerald-300 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-mono-code text-neutral-400 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1.5">
                  Company / Brand
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Innovations"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1.5">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1.5">
                Primary Project Interest
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="Website Development" className="bg-neutral-900 text-white">
                    Website Development (Interactive WebGL / React)
                  </option>
                  <option value="App Development" className="bg-neutral-900 text-white">
                    App Development (iOS / Android)
                  </option>
                  <option value="Software Automation" className="bg-neutral-900 text-white">
                    Software Automation (Pipelines / APIs)
                  </option>
                  <option value="AI Agent Development" className="bg-neutral-900 text-white">
                    AI Agent Development (LLM / Copilots)
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-neutral-500">
                Auth Method: <span className="uppercase text-purple-400">{user.authProvider}</span>
              </span>

              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-syne font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </form>

          {/* Account Deletion / Danger Zone */}
          <div className="mt-8 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-syne font-bold text-red-400 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </h4>
                <p className="text-[11px] font-mono-code text-neutral-500">
                  Permanently remove all user data and credentials.
                </p>
              </div>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 border border-red-500/20 text-red-400 text-[11px] font-mono-code transition-colors cursor-pointer"
                >
                  DELETE
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 text-neutral-400 text-[11px] font-mono-code hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-[11px] font-mono-code font-bold hover:bg-red-500"
                  >
                    CONFIRM DELETE
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
