import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Activity, FileText, Shield, RefreshCw, CheckCircle2, Clock, Mail, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audio } from '../utils/audioSystem';

interface AdminStats {
  totalUsers: number;
  newUsers24h: number;
  logins24h: number;
  totalLeads: number;
  newLeads: number;
  activeProjects: number;
}

interface LeadItem {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  status: 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  createdAt: string;
}

interface AuthEventItem {
  id: string;
  eventType: string;
  provider: string;
  email: string;
  name: string;
  timestamp: string;
  isNewUser: boolean;
  requestedPage: string;
}

export const AdminDashboardModal: React.FC = () => {
  const { adminModalOpen, setAdminModalOpen, token } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'users' | 'logs'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [authEvents, setAuthEvents] = useState<AuthEventItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, leadsRes, usersRes, eventsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/leads', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/auth-events', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (leadsRes.ok) setLeads((await leadsRes.json()).leads);
      if (usersRes.ok) setUsersList((await usersRes.json()).users);
      if (eventsRes.ok) setAuthEvents((await eventsRes.json()).events);
    } catch (err) {
      console.error('[Admin] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminModalOpen) {
      fetchAdminData();
    }
  }, [adminModalOpen]);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l)));
        audio.playSuccess();
      }
    } catch (err) {
      console.error('[Admin] Error updating lead:', err);
    }
  };

  if (!adminModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl h-[85vh] rounded-3xl bg-[#080512] border border-purple-500/30 flex flex-col overflow-hidden text-neutral-200 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-purple-950/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-syne font-bold text-white tracking-wide">
                    TAMEEM NEXUS STUDIO ADMIN
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-purple-900/80 border border-purple-400/40 text-[9px] font-mono-code text-purple-300 uppercase">
                    LIVE AUTOMATION
                  </span>
                </div>
                <p className="text-xs font-mono-code text-neutral-400">
                  Notification Recipient: <span className="text-purple-300">tameemimran253@gmail.com</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
              </button>

              <button
                onClick={() => {
                  setAdminModalOpen(false);
                  audio.playClick();
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 px-4 md:px-6 bg-black/40 gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview & Stats', icon: Activity },
              { id: 'leads', label: `Project Inquiries (${leads.length})`, icon: FileText },
              { id: 'users', label: `Registered Users (${usersList.length})`, icon: Users },
              { id: 'logs', label: `Auth Event Logs (${authEvents.length})`, icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    audio.playClick();
                  }}
                  className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest block mb-1">
                      Total Registered Users
                    </span>
                    <span className="text-2xl md:text-3xl font-syne font-bold text-white">
                      {stats?.totalUsers ?? '—'}
                    </span>
                    <span className="text-[10px] font-mono-code text-purple-400 block mt-1">
                      +{stats?.newUsers24h ?? 0} in last 24h
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest block mb-1">
                      Logins Last 24 Hours
                    </span>
                    <span className="text-2xl md:text-3xl font-syne font-bold text-cyan-400">
                      {stats?.logins24h ?? '—'}
                    </span>
                    <span className="text-[10px] font-mono-code text-neutral-500 block mt-1">
                      Automated email throttled
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest block mb-1">
                      Total Project Leads
                    </span>
                    <span className="text-2xl md:text-3xl font-syne font-bold text-purple-400">
                      {stats?.totalLeads ?? '—'}
                    </span>
                    <span className="text-[10px] font-mono-code text-emerald-400 block mt-1">
                      {stats?.newLeads ?? 0} Pending Action
                    </span>
                  </div>
                </div>

                {/* Recent Inquiries summary */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xs font-mono-code text-neutral-300 uppercase tracking-widest mb-3">
                    Recent Inquiries
                  </h3>
                  {leads.length === 0 ? (
                    <p className="text-xs font-mono-code text-neutral-500">No project inquiries recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {leads.slice(0, 3).map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono-code"
                        >
                          <div>
                            <span className="text-white font-bold block">{lead.name}</span>
                            <span className="text-neutral-400">{lead.projectType} &bull; {lead.budget}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 text-[10px]">
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. LEADS TAB */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                {leads.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 font-mono-code text-xs">
                    No leads currently registered.
                  </div>
                ) : (
                  leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono-code space-y-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-white/5">
                        <div>
                          <span className="text-white font-bold text-sm block">{lead.name}</span>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-purple-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{lead.email}</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-500">Status:</span>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1 text-xs text-purple-300 focus:outline-none"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="IN_DISCUSSION">IN_DISCUSSION</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-neutral-300 text-[11px]">
                        <div>
                          <span className="text-neutral-500 block">Service:</span>
                          <span>{lead.projectType}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Budget:</span>
                          <span>{lead.budget}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Timeline:</span>
                          <span>{lead.timeline}</span>
                        </div>
                      </div>

                      {lead.description && (
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-neutral-300 text-[11px]">
                          {lead.description}
                        </div>
                      )}

                      <div className="text-[10px] text-neutral-500 flex items-center justify-between pt-1">
                        <span>Lead ID: {lead.id}</span>
                        <span>{new Date(lead.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. USERS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-3">
                {usersList.map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono-code"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-[10px]">
                        {u.name?.slice(0, 2).toUpperCase() || 'NX'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{u.name}</span>
                          {u.role === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-950 border border-purple-400 text-purple-300 text-[9px]">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-neutral-400">{u.email}</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 uppercase">
                        {u.authProvider}
                      </span>
                      <span className="text-[10px] text-neutral-500 block mt-1">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. EVENT LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="space-y-2">
                {authEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono-code"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          evt.eventType === 'SIGNUP'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : evt.eventType === 'LOGIN'
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {evt.eventType}
                      </span>
                      <span className="text-white">{evt.name}</span>
                      <span className="text-neutral-500">({evt.email})</span>
                    </div>

                    <div className="flex items-center gap-3 text-neutral-400 text-[10px]">
                      <span className="uppercase text-purple-400">{evt.provider}</span>
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
