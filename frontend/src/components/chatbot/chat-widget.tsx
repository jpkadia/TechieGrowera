'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import {
  X,
  SendHorizontal,
  Bot,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SESSION_STORAGE_KEY = 'tg_chat_session_id';

const WELCOME_MESSAGE =
  "Hi! I'm here from the Techie Growera team. How can I help you today? Feel free to ask about our services, client projects, or how we can help grow your business.";

const SUGGESTED_QUESTIONS = [
  'What services do you provide?',
  'Tell me about Techie Growera.',
  'What technologies do you use?',
  'Tell me about your projects.',
  'How can I contact you?',
];

function FormattedContent({ text, isUser }: { text: string; isUser?: boolean }) {
  const lines = text.split('\n');

  return (
    <div className={`space-y-1.5 leading-relaxed text-sm ${isUser ? 'text-white' : 'text-[#092d49]'}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed);
        const cleanLine = isBullet
          ? trimmed.replace(/^[-*]\s+|\d+\.\s+/, '')
          : trimmed;

        const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className={`font-semibold ${isUser ? '!text-white' : 'text-[#092d49]'}`}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.includes('@') && !part.includes(' ')) {
            return (
              <a
                key={pIdx}
                href={`mailto:${part}`}
                className={`${isUser ? '!text-cyan-200 underline' : 'text-[#007e83] underline hover:text-[#01bfc3]'} font-medium transition-colors`}
              >
                {part}
              </a>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className={`${isUser ? '!text-white' : 'text-[#007e83]'} select-none mt-1 text-xs`}>•</span>
              <div className="flex-1">{renderedLine}</div>
            </div>
          );
        }

        return (
          <p key={idx} className={isUser ? '!text-white font-normal' : '!text-[#092d49]'}>
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      let currentId = localStorage.getItem(SESSION_STORAGE_KEY) || '';
      if (!currentId) {
        currentId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sess_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(SESSION_STORAGE_KEY, currentId);
      }
      return currentId;
    } catch {
      return '';
    }
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const messageIdCounterRef = useRef(0);
  const historyLoadedRef = useRef(false);

  // Fetch previous chat history for returning user
  useEffect(() => {
    if (!sessionId || historyLoadedRef.current) return;
    historyLoadedRef.current = true;
    fetch(`/api/chat?sessionId=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.ok && Array.isArray(data.messages) && data.messages.length > 0) {
          const restored: ChatMessage[] = data.messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
            id: `hist-${++messageIdCounterRef.current}`,
            role: m.role,
            content: m.content,
          }));
          setMessages(restored);
        }
      })
      .catch(() => {
        // Graceful fallback to welcome message if network/storage is unavailable
      });
  }, [sessionId]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('instant');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading, isOpen, scrollToBottom]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend ?? input).trim();
    if (!text || isLoading) return;

    setError(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `u-${++messageIdCounterRef.current}`,
      role: 'user',
      content: text,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = newMessages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId || undefined,
          history: historyPayload.slice(0, -1),
        }),
      });

      let data: { ok?: boolean; message?: string; reply?: string; sessionId?: string } = {};
      try {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch {
        // Non-JSON response
      }

      if (!res.ok || !data.ok) {
        const errorMsg =
          data.message ||
          (res.status === 404
            ? "API service route was not found. Please restart the frontend development server."
            : "Sorry, I'm having trouble responding right now. Please try again in a moment.");
        setError(errorMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${++messageIdCounterRef.current}`,
            role: 'assistant',
            content: errorMsg,
          },
        ]);
        return;
      }

      // If backend returns a new or confirmed sessionId, store it
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
        } catch {}
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${++messageIdCounterRef.current}`,
          role: 'assistant',
          content: data.reply || "I'm sorry, I couldn't process that response.",
        },
      ]);
    } catch {
      const fallbackMsg =
        "Sorry, I'm having trouble connecting right now. Please try again in a moment or contact us at techiegrowera@gmail.com.";
      setError(fallbackMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${++messageIdCounterRef.current}`,
          role: 'assistant',
          content: fallbackMsg,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}`;
    setSessionId(newId);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, newId);
    } catch {}

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
      },
    ]);
    setError(null);
    setInput('');
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[998] flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#092d49] via-[#006069] to-[#007e83] text-white shadow-[0_10px_32px_rgba(0,126,131,0.32)] border border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007e83] group cursor-pointer"
        aria-label={isOpen ? 'Close TechieGrowera Chat' : 'Open TechieGrowera Chat'}
        aria-expanded={isOpen}
      >
        <div className="relative">
          {isOpen ? (
            <X size={22} className="text-white transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <>
              <Bot size={22} className="text-[#01bfc3] transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#01bfc3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#01bfc3]"></span>
              </span>
            </>
          )}
        </div>
        <span className="hidden sm:inline font-medium text-sm tracking-wide text-white drop-shadow-sm">
          {isOpen ? 'Close' : 'Chat with us'}
        </span>
      </button>

      {/* Chat Window Panel - Brand Aligned Light Theme */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="chat-heading"
          className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-22 z-[999] w-auto sm:w-[420px] h-[560px] max-h-[calc(100vh-100px)] flex flex-col rounded-2xl bg-white border border-[#d0e4e4] shadow-[0_24px_64px_rgba(9,45,73,0.18)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#092d49] text-white border-b border-[#0d3b60] select-none">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-[#01bfc3]">
                <Bot size={20} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#092d49]" />
              </div>
              <div>
                <h3 id="chat-heading" className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                  Techie Growera
                  <Sparkles size={13} className="text-[#01bfc3]" />
                </h3>
                <span className="block text-[11px] !text-white/75 font-normal tracking-wide mt-0.5">
                  Digital Growth & Tech Team
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Start new conversation"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Start new conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close chat window"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fcfc] scroll-smooth">
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-[#eaf4f4] border border-[#d0e4e4] flex items-center justify-center text-[#007e83] shrink-0 mt-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      isAssistant
                        ? 'bg-white border border-[#d0e4e4] text-[#092d49] rounded-tl-sm shadow-[0_2px_8px_rgba(9,45,73,0.04)]'
                        : 'bg-[#007e83] text-white rounded-tr-sm shadow-sm [&_*]:!text-white'
                    }`}
                    style={{ color: !isAssistant ? '#ffffff' : undefined }}
                  >
                    <FormattedContent text={message.content} isUser={!isAssistant} />
                  </div>
                </div>
              );
            })}

            {/* Suggested Question Pills (Shown when conversation is in early stage) */}
            {messages.length <= 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-semibold text-[#566773] uppercase tracking-wider pl-1">
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleSend(question)}
                      className="text-left text-xs bg-white hover:bg-[#eaf4f4] text-[#092d49] hover:text-[#007e83] border border-[#d0e4e4] hover:border-[#007e83]/50 rounded-xl px-3 py-1.5 transition-all duration-200 active:scale-95 shadow-[0_1px_4px_rgba(0,0,0,0.03)] cursor-pointer"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thinking / Loading State */}
            {isLoading && (
              <div className="flex items-start gap-2.5 justify-start animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-lg bg-[#eaf4f4] border border-[#d0e4e4] flex items-center justify-center text-[#007e83] shrink-0">
                  <Bot size={15} />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-[#d0e4e4] flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007e83] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007e83] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007e83] animate-bounce" />
                  <span className="text-xs text-[#566773] pl-2 font-medium">Replying...</span>
                </div>
              </div>
            )}

            {/* Inline Error Notice */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2.5 mt-2">
                <AlertCircle size={14} className="shrink-0 text-rose-500" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-[#d0e4e4]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <label htmlFor={inputId} className="sr-only">
                  Ask a question
                </label>
                <input
                  id={inputId}
                  ref={inputRef}
                  type="text"
                  value={input}
                  maxLength={500}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about web, SEO, design, or projects..."
                  disabled={isLoading}
                  className="w-full bg-[#f1f8f8] border border-[#d0e4e4] focus:border-[#007e83] focus:bg-white text-[#092d49] placeholder-[#7d8f9d] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none transition-all pr-12 disabled:opacity-50"
                />
                {input.length > 350 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#566773]">
                    {input.length}/500
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#007e83] to-[#01bfc3] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <SendHorizontal size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
