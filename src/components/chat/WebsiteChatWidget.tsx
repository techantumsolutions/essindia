'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Check, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

export function WebsiteChatWidget() {
  const pathname = usePathname();

  // Do not display chat widget inside admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserName] = useState('Guest User');
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Array<{ id: string; senderType: string; senderName?: string; message: string; createdAt: string }>>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact lead state
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [isTyping, setIsTyping] = useState(false);

  const prevMessageCountRef = useRef<number>(0);
  const prevShowLeadPromptRef = useRef<boolean>(false);
  const prevIsTypingRef = useRef<boolean>(false);

  // Auto-scroll chat view ONLY when new messages arrive, typing starts, or lead prompt appears
  useEffect(() => {
    const hasNewMessage = messages.length > prevMessageCountRef.current;
    const hasNewPrompt = showLeadPrompt && !prevShowLeadPromptRef.current;
    const hasNewTyping = isTyping && !prevIsTypingRef.current;

    if (hasNewMessage || hasNewPrompt || hasNewTyping) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    prevMessageCountRef.current = messages.length;
    prevShowLeadPromptRef.current = showLeadPrompt;
    prevIsTypingRef.current = isTyping;
  }, [messages, showLeadPrompt, isTyping]);

  // Ensure active conversation session exists on mount
  useEffect(() => {
    const initSession = async () => {
      const savedConvId = localStorage.getItem('ess_chat_conv_id');
      if (savedConvId) {
        try {
          const res = await fetch(`/api/chat/messages?conversationId=${savedConvId}`);
          if (res.ok) {
            setConversationId(savedConvId);
            setHasStarted(true);
            return;
          }
        } catch (e) {}
      }

      // Create new session if none exists
      try {
        const res = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: 'Guest User', channel: 'Website Widget' }),
        });
        const data = await res.json();
        if (data.success && data.conversation) {
          setConversationId(data.conversation.id);
          localStorage.setItem('ess_chat_conv_id', data.conversation.id);
          localStorage.setItem('ess_chat_user_name', 'Guest User');
          setHasStarted(true);
        }
      } catch (err) {
        console.error('Session init error:', err);
      }
    };

    initSession();
  }, []);

  // Fetch messages immediately when conversationId becomes active & poll as fallback
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);

          // Turn off typing indicator and clear fallback timer if agent responded
          const hasAgentResponded = data.messages?.some(
            (m: any) => m.senderType === 'agent'
          );
          if (hasAgentResponded) {
            setIsTyping(false);
            if (fallbackTimerRef.current) {
              clearTimeout(fallbackTimerRef.current);
              fallbackTimerRef.current = null;
            }
          }

          const lastMsg = data.messages?.[data.messages.length - 1];
          if (lastMsg && (lastMsg.senderType === 'bot' || lastMsg.senderType === 'agent')) {
            setIsTyping(false);
          }

          // Check if bot asked for contact details
          const botAskedLead = data.messages?.some(
            (m: any) => m.senderType === 'bot' && (m.message.toLowerCase().includes('provide your email') || m.message.toLowerCase().includes('busy right now'))
          );
          const leadAlreadySubmitted = data.messages?.some(
            (m: any) => m.senderType === 'bot' && m.message.includes('received your contact details')
          );
          if (botAskedLead && !leadAlreadySubmitted) {
            setShowLeadPrompt(true);
          } else if (leadAlreadySubmitted) {
            setShowLeadPrompt(false);
          }
        }
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [conversationId]);

  // Auto start conversation when widget opens if not started
  const handleOpenWidget = async () => {
    setIsOpen(true);
    if (!hasStarted && !conversationId && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: 'Guest User', channel: 'Website Widget' }),
        });
        const data = await res.json();
        if (data.success && data.conversation) {
          setConversationId(data.conversation.id);
          localStorage.setItem('ess_chat_conv_id', data.conversation.id);
          localStorage.setItem('ess_chat_user_name', 'Guest User');
          setHasStarted(true);
        }
      } catch (err) {
        console.error('Auto-start chat error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Send message from visitor
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = inputMsg.trim();
    if (!cleanText || isSubmitting) return;

    setInputMsg('');
    setIsSubmitting(true);

    let activeConvId = conversationId;

    // Create session if not present yet
    if (!activeConvId) {
      try {
        const convRes = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: 'Guest User', channel: 'Website Widget' }),
        });
        const convData = await convRes.json();
        if (convData.success && convData.conversation) {
          activeConvId = convData.conversation.id;
          setConversationId(activeConvId);
          localStorage.setItem('ess_chat_conv_id', activeConvId as string);
          localStorage.setItem('ess_chat_user_name', 'Guest User');
          setHasStarted(true);
        }
      } catch (err) {
        console.error('Failed to create session before sending:', err);
      }
    }

    if (!activeConvId) {
      setIsSubmitting(false);
      return;
    }

    // Optimistic append
    const tempMsg = {
      id: Date.now().toString(),
      senderType: 'visitor',
      senderName: userName,
      message: cleanText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          senderType: 'visitor',
          senderName: userName,
          message: cleanText,
        }),
      });

      if (res.ok) {
        setIsTyping(true);
        // Start 20 second fallback timer for automated AI response if no agent answers in time
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = setTimeout(async () => {
          setIsTyping(false);
          try {
            const fallbackRes = await fetch('/api/chat/fallback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ conversationId: activeConvId }),
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackData.triggered) {
              setShowLeadPrompt(true);
            }
          } catch (e) {
            console.error('Fallback error:', e);
          }
        }, 20000);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit name, email & mobile lead details
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!nameInput.trim() && !emailInput.trim() && !phoneInput.trim()) || !conversationId || isSubmittingLead) return;

    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          name: nameInput.trim() || undefined,
          email: emailInput.trim() || undefined,
          phone: phoneInput.trim() || undefined,
        }),
      });
      if (res.ok) {
        if (nameInput.trim()) {
          setUserName(nameInput.trim());
          localStorage.setItem('ess_chat_user_name', nameInput.trim());
        }
        setShowLeadPrompt(false);
        setNameInput('');
        setEmailInput('');
        setPhoneInput('');
      }
    } catch (err) {
      console.error('Error submitting lead:', err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4B2A63] to-[#2E1543] p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#4B2A63]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">ESS India Live Support</h3>
                  <p className="text-[11px] text-purple-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> We are online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                {messages.map((m) => {
                  const isVisitor = m.senderType === 'visitor';
                  const isBot = m.senderType === 'bot';
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex flex-col max-w-[85%]',
                        isVisitor ? 'ml-auto items-end' : 'mr-auto items-start'
                      )}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                        {isVisitor ? 'You' : isBot ? 'ESS Bot' : m.senderName || 'Agent'}
                      </span>
                      <div
                        className={cn(
                          'p-3 rounded-2xl text-xs leading-relaxed shadow-sm',
                          isVisitor
                            ? 'bg-[#4B2A63] text-white rounded-br-none'
                            : isBot
                            ? 'bg-purple-100/80 text-purple-950 border border-purple-200/60 rounded-bl-none font-medium'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                        )}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col max-w-[85%] mr-auto items-start"
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">Support Team</span>
                    <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#4B2A63] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-[#4B2A63] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-[#4B2A63] animate-bounce" />
                    </div>
                  </motion.div>
                )}

                {/* Contact Lead Capture Form overlay when requested by AI Bot */}
                {showLeadPrompt && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleSubmitLead}
                    className="bg-white border border-purple-200 rounded-2xl p-3 shadow-lg my-2 space-y-2"
                  >
                    <p className="text-[11px] font-bold text-[#4B2A63] flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> Contact Details Request
                    </p>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4B2A63]"
                    />
                    <input
                      type="email"
                      placeholder="Your Email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4B2A63]"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4B2A63]"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-2 bg-[#4B2A63] text-white rounded-xl font-bold text-xs hover:bg-[#3b204e] transition-colors"
                    >
                      Submit Details
                    </button>
                  </motion.form>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#4B2A63]"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || isSubmitting}
                  className="w-9 h-9 rounded-2xl bg-[#4B2A63] text-white flex items-center justify-center hover:bg-[#3b204e] transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={handleOpenWidget}
            className="w-14 h-14 !rounded-full bg-gradient-to-r from-[#4B2A63] to-[#2E1543] text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/20 cursor-pointer overflow-hidden"
            aria-label="Chat with us"
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-6 h-6 group-hover:[transform:rotateY(180deg)] transition-transform duration-500 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#4B2A63]" />
            </div>
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap z-50 pointer-events-none">
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            Chat with us
          </div>
        </div>
      )}
    </div>
  );
}
