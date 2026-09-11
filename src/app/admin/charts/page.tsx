'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Clock,
  ThumbsUp,
  Search,
  Filter,
  BarChart3,
  Bot,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
  MoreVertical,
  Circle,
  RefreshCw,
  Phone,
  Mail,
  CheckCheck,
  ShieldAlert,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatChatTime } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatConversation {
  id: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  channel: string;
  status: 'waiting' | 'active' | 'resolved';
  assignedAgentId?: string;
  assignedAgentName?: string;
  lastMessage?: string;
  lastMessageAt: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: 'visitor' | 'agent' | 'bot';
  senderName?: string;
  message: string;
  createdAt: string;
}

import { io, Socket } from 'socket.io-client';

export default function AgentChartsPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'Online' | 'Away' | 'Offline'>('Online');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const prevMessageCountRef = useRef<number>(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat area to latest message ONLY when new messages arrive or switching conversation
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  // Reset scroll position to bottom when switching conversation
  useEffect(() => {
    prevMessageCountRef.current = 0;
  }, [selectedConvId]);

  // Socket.io integration for instant agent dashboard updates
  useEffect(() => {
    fetch('/api/socket/io').finally(() => {
      const socket = io({ path: '/api/socket/io' });
      socketRef.current = socket;

      if (selectedConvId) {
        socket.emit('join-room', selectedConvId);
      }

      socket.on('new-message', (data: any) => {
        if (data.conversationId === selectedConvId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
        fetchConversations();
      });

      socket.on('conversation-updated', () => {
        fetchConversations();
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedConvId]);

  // Fetch live chat conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (res.ok) {
        const data = await res.json();
        const convList = data.conversations || [];
        setConversations(convList);
        setSelectedConvId((prev) => (prev ? prev : (convList.length > 0 ? convList[0].id : null)));
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for selected conversation
  const fetchMessages = React.useCallback(async () => {
    if (!selectedConvId) return;
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${selectedConvId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [selectedConvId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Send message as Agent
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConvId || isSending) return;

    const text = replyText.trim();
    setReplyText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConvId,
          senderType: 'agent',
          message: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        fetchConversations();
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setIsSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.userEmail && c.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-70px)] bg-[#F8FAFC] p-2 md:p-4 overflow-hidden flex flex-col">
      {/* Main WhatsApp-Style Interface */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Column: Chat Conversation List */}
        <div className="lg:col-span-4 border-r border-slate-100 flex flex-col bg-slate-50/40 h-full overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search visitor name or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border-none rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4B2A63]"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No active conversations found
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const isWaiting = conv.status === 'waiting';
                const isActive = conv.status === 'active';
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={cn(
                      'p-4 cursor-pointer transition-colors flex items-start gap-3 relative border-l-4',
                      isSelected
                        ? 'bg-purple-50/70 border-[#4B2A63]'
                        : 'border-transparent hover:bg-slate-100/60'
                    )}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-[#4B2A63] font-extrabold text-sm shrink-0 border border-purple-200/50">
                      {conv.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{conv.userName}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatChatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mb-1.5">{conv.lastMessage || 'No messages'}</p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize',
                            isWaiting
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-700'
                          )}
                        >
                          {conv.status}
                        </span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded-md">
                          {conv.channel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: WhatsApp-Style Chat Panel */}
        <div className="lg:col-span-8 flex flex-col bg-[#E5DDD5]/20 relative h-full overflow-hidden">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#4B2A63] text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                    {selectedConv.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {selectedConv.userName}
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {selectedConv.channel}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      {selectedConv.userEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-purple-600" /> {selectedConv.userEmail}
                        </span>
                      )}
                      {selectedConv.userPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" /> {selectedConv.userPhone}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!selectedConvId) return;
                      try {
                        const res = await fetch('/api/chat/request-lead', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ conversationId: selectedConvId }),
                        });
                        const data = await res.json();
                        if (data.success || data.triggered) {
                          toast.success('Requested contact details from visitor');
                          fetchMessages();
                        } else {
                          toast.info(data.reason || 'Contact details prompt already sent');
                        }
                      } catch (err) {
                        toast.error('Failed to request contact details');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#4B2A63] text-white font-bold text-xs rounded-xl hover:bg-[#3b204e] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" /> Request Contact Details
                  </button>
                </div>
              </div>

              {/* Chat Messages Area (WhatsApp Patterned View) */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50">
                {messages.map((m) => {
                  const isVisitor = m.senderType === 'visitor';
                  const isBot = m.senderType === 'bot';
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex flex-col max-w-[70%]',
                        isVisitor ? 'mr-auto items-start' : isBot ? 'mx-auto items-center text-center' : 'ml-auto items-end'
                      )}
                    >
                      {!isBot && (
                        <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                          {isVisitor ? selectedConv.userName : m.senderName || 'Agent'}
                        </span>
                      )}
                      <div
                        className={cn(
                          'p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm relative',
                          isVisitor
                            ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                            : isBot
                            ? 'bg-purple-100 text-purple-950 border border-purple-200 rounded-xl font-medium max-w-[85%]'
                            : 'bg-[#4B2A63] text-white rounded-tr-none'
                        )}
                      >
                        {m.message}
                        <div
                          className={cn(
                            'text-[9px] mt-1.5 text-right font-medium opacity-70',
                            isVisitor ? 'text-slate-400' : isBot ? 'text-purple-700' : 'text-purple-200'
                          )}
                        >
                          {formatChatTime(m.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Reply to ${selectedConv.userName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-5 py-3 bg-slate-100 border-none rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#4B2A63] text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  className="px-6 py-3 bg-[#4B2A63] text-white font-bold text-xs rounded-2xl hover:bg-[#3b204e] transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Send Reply
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
              <h3 className="font-bold text-slate-700 text-sm mb-1">Select a Conversation</h3>
              <p className="text-xs text-slate-400">Choose a visitor conversation from the left panel to reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
