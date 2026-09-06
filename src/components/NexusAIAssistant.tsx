import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Sparkles, ArrowRight, ShieldCheck, RefreshCw, Layers, Zap, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audio } from '../utils/audioSystem';
import { resolveInstantQuery } from '../utils/nexusInstantEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: string;
  timestamp: string;
}

interface NexusAIAssistantProps {
  onOpenProjectModal: () => void;
  onOpenPricingModal?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

const QUICK_PROMPTS = [
  { label: 'WEB DEVELOPMENT', prompt: 'Tell me about your Website Development services and interactive 3D architecture.' },
  { label: 'APP DEVELOPMENT', prompt: 'What mobile app frameworks and platforms do you build for iOS and Android?' },
  { label: 'SOFTWARE AUTOMATION', prompt: 'How does software automation work at Tameem Nexus Studio?' },
  { label: 'AI AGENTS', prompt: 'What kind of AI agents and Google Gemini integrations do you build?' },
  { label: 'PRICING', prompt: 'What are your commission packages and pricing tiers?' },
  { label: 'START A PROJECT', prompt: 'How do I start a project with Tameem Nexus Studio?' },
];

export const NexusAIAssistant: React.FC<NexusAIAssistantProps> = ({
  onOpenProjectModal,
  onOpenPricingModal,
  onNavigateSection,
}) => {
  const { user, nexusChatOpen, setNexusChatOpen } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content:
        "Hello. I'm Nexus, the AI assistant for Tameem Nexus Studio. I can help you explore our services, development process, automation solutions, AI agents, pricing, and project inquiry process. What would you like to build?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (nexusChatOpen) {
      scrollToBottom();
    }
  }, [messages, nexusChatOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isTyping) return;

    setInputPrompt('');
    audio.playClick();

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // 1. ULTRA-FAST INSTANT RESOLUTION (<100ms) for high-confidence questions
    const instant = resolveInstantQuery(query, user?.name);
    if (instant) {
      // Natural rapid typing flutter (100ms) for instant responsiveness without perceived lag
      setTimeout(() => {
        const assistantMsg: Message = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: instant.text,
          action: instant.action,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
        audio.playSuccess();
      }, 100);
      return;
    }

    // 2. BACKEND QUERY WITH SNAPPY 1.2s TIMEOUT RACE
    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const fetchPromise = fetch('/api/nexus/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          userName: user?.name,
        }),
      }).then(async (r) => {
        const contentType = r.headers.get('content-type');
        if (r.ok && contentType && contentType.includes('application/json')) {
          return r.json();
        }
        throw new Error('API unavailable or non-JSON response');
      });

      const timeoutPromise = new Promise<{ success: boolean; text?: string; action?: string }>((resolve) =>
        setTimeout(() => {
          resolve({
            success: true,
            text: `I am **NEXUS**, the AI assistant for **Tameem Nexus Studio**.\n\nWe engineer bespoke solutions across 4 core disciplines:\n• **Website Development** (Kinetic 3D WebGL)\n• **App Development** (iOS & Android)\n• **Software Automation** (Autonomous Pipelines)\n• **AI Agent Development** (Custom Gemini Copilots)\n\nWhat can we engineer for your project?`,
            action: 'START_PROJECT',
          });
        }, 1200)
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]);

      const assistantMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.text || "I'm ready to assist you with any questions about Tameem Nexus Studio.",
        action: data.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      audio.playSuccess();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          role: 'assistant',
          content:
            "I'm ready to assist you. You can explore our services directly or contact Tameem Nexus Studio at tameemimran253@gmail.com.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (actionName?: string) => {
    if (!actionName) return;
    audio.playClick();

    if (actionName === 'START_PROJECT') {
      onOpenProjectModal();
      setNexusChatOpen(false);
    } else if (actionName === 'OPEN_PRICING') {
      if (onOpenPricingModal) onOpenPricingModal();
      else if (onNavigateSection) onNavigateSection('pricing');
      setNexusChatOpen(false);
    } else if (actionName === 'OPEN_WEB_DEV' || actionName === 'OPEN_APP_DEV' || actionName === 'OPEN_AUTOMATION' || actionName === 'OPEN_AI_AGENTS') {
      if (onNavigateSection) onNavigateSection('services');
      setNexusChatOpen(false);
    } else if (actionName === 'CONTACT_STUDIO') {
      onOpenProjectModal();
      setNexusChatOpen(false);
    }
  };

  return (
    <>
      {/* 1. Floating Nexus AI Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setNexusChatOpen(!nexusChatOpen);
            audio.playClick();
          }}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0d091a]/95 border border-purple-500/50 hover:border-cyan-400/70 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all cursor-pointer overflow-hidden"
        >
          {/* Subtle animated edge beam */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent pointer-events-none"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />

          {/* Holographic pulsing core */}
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-purple-400 to-cyan-400" />
          </span>

          <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold tracking-widest text-purple-200 group-hover:text-white relative z-10">
            <Bot className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span>NEXUS AI</span>
          </div>
        </motion.button>
      </div>

      {/* 2. Floating AI Chat Modal Panel */}
      <AnimatePresence>
        {nexusChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 md:right-8 z-50 w-[92vw] sm:w-[430px] h-[600px] max-h-[85vh] rounded-3xl bg-[#090614]/95 border border-purple-500/40 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-neutral-200"
          >
            {/* UPPER SIDE ANIMATION: Kinetic Top Laser / Scanline Beam */}
            <div className="relative w-full h-[3px] overflow-hidden bg-white/5 z-20">
              <motion.div
                className="absolute top-0 bottom-0 w-36 bg-gradient-to-r from-transparent via-cyan-400 to-purple-400 blur-[1px]"
                animate={{
                  x: ['-100%', '350%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isTyping ? 0.9 : 2.4,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Upper Header Container */}
            <div className="relative p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-950/70 via-[#100926]/90 to-purple-950/70 overflow-hidden">
              {/* Subtle background ambient floating neural stars */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <motion.span
                  className="absolute top-2 left-1/4 w-1 h-1 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                />
                <motion.span
                  className="absolute bottom-2 right-1/3 w-1 h-1 rounded-full bg-purple-400"
                  animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 3.1, delay: 0.5, ease: 'easeInOut' }}
                />
              </div>

              {/* Upper Left: Animated Miniature Hologram Core + Identification */}
              <div className="flex items-center gap-3 relative z-10">
                {/* Small Animated Holographic Core Avatar */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                  {/* Outer spinning kinetic orbit */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border border-dashed border-purple-400/50"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: isTyping ? 3 : 8, ease: 'linear' }}
                  />
                  {/* Inner counter-spinning reticle */}
                  <motion.div
                    className="absolute inset-1 rounded-lg border border-cyan-400/40"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: isTyping ? 2.5 : 6, ease: 'linear' }}
                  />
                  {/* Glowing center orb with Bot */}
                  <motion.div
                    className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-800 to-[#1e103d] border border-purple-500/60 flex items-center justify-center text-cyan-300 shadow-[0_0_18px_rgba(168,85,247,0.5)]"
                    animate={{
                      scale: isTyping ? [1, 1.1, 1] : [1, 1.04, 1],
                      boxShadow: isTyping
                        ? ['0 0 15px rgba(6,182,212,0.6)', '0 0 25px rgba(168,85,247,0.8)', '0 0 15px rgba(6,182,212,0.6)']
                        : '0 0 15px rgba(168,85,247,0.4)',
                    }}
                    transition={{ repeat: Infinity, duration: isTyping ? 0.6 : 2.5, ease: 'easeInOut' }}
                  >
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </motion.div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-syne font-bold text-white tracking-wide flex items-center gap-1.5">
                      NEXUS
                      <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono-code text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] font-mono-code text-neutral-400 flex items-center gap-1">
                    <span>Tameem Nexus AI</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-cyan-400/90 font-medium">Instant Engine</span>
                  </p>
                </div>
              </div>

              {/* Upper Right: Small Dynamic Waveform Equalizer + Close Button */}
              <div className="flex items-center gap-2.5 relative z-10">
                {/* Miniature Neural Equalizer / Waveform animation */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all ${
                    isTyping
                      ? 'bg-cyan-950/70 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-purple-900/40 border-purple-500/30'
                  }`}
                  title={isTyping ? 'Neural Core Active' : 'Instant Response Ready'}
                >
                  <span className="text-[8px] font-mono-code tracking-wider uppercase text-cyan-300">
                    {isTyping ? 'SYNC' : 'FAST'}
                  </span>
                  <div className="flex items-center gap-[2px] h-3.5">
                    {[0.4, 0.9, 0.3, 1.0, 0.6].map((base, i) => (
                      <motion.span
                        key={i}
                        className="w-[2px] rounded-full bg-gradient-to-t from-purple-400 to-cyan-300"
                        animate={{
                          height: isTyping ? [3, 13, 4, 12, 3] : [2, 7, 3, 8, 2],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: isTyping ? 0.35 : 1.2,
                          delay: i * 0.09,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setNexusChatOpen(false);
                    audio.playClick();
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 border-b border-white/5 bg-black/30 overflow-x-auto flex gap-1.5 no-scrollbar">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/40 text-[10px] font-mono-code text-neutral-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-700/80 text-white rounded-br-none shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-white/5 border border-white/10 text-neutral-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line font-light">{msg.content}</div>

                    {/* Interactive Action Button */}
                    {msg.action && (
                      <div className="mt-3 pt-2 border-t border-white/10">
                        <button
                          onClick={() => handleActionClick(msg.action)}
                          className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-mono-code font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <span>
                            {msg.action === 'START_PROJECT'
                              ? 'START A PROJECT NOW'
                              : msg.action === 'OPEN_PRICING'
                              ? 'VIEW PRICING TIERS'
                              : 'EXPLORE SERVICES'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono-code text-neutral-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 w-24 text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about websites, apps, automation, AI..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono-code text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isTyping}
                className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
