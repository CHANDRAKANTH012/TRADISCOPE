import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MarkdownRenderer from "../MarkdownRenderer";

const API = import.meta.env.VITE_API_BASE_URL;

const AiAssistant = () => {
  const { isAuthenticated, authFetch, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // All hooks above — early return AFTER all hooks
  useEffect(() => {
    if (isOpen && !historyLoaded && isAuthenticated) {
      loadHistory();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Don't render UI if not authenticated
  if (!isAuthenticated) return null;

  const loadHistory = async () => {
    try {
      const res = await authFetch(`${API}/api/ai/history`);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages.map((m) => ({ role: m.role, content: m.content })));
      } else {
        setMessages([
          {
            role: "assistant",
            content: `Hey ${user?.username || "trader"}! 👋 I'm Tradie, your AI trading assistant. Ask me anything about markets, trade setups, risk management, or analysis.`,
          },
        ]);
      }
      setHistoryLoaded(true);
    } catch {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm Tradie, your AI trading assistant. How can I help you today?",
        },
      ]);
      setHistoryLoaded(true);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", content: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await authFetch(`${API}/api/ai/chat`, {
        method: "POST",
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setMessages((p) => [
        ...p,
        { role: "assistant", content: data.reply || "Sorry, I couldn't respond." },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await authFetch(`${API}/api/ai/history`, { method: "DELETE" });
      setMessages([
        {
          role: "assistant",
          content: "Conversation cleared! Ready to start fresh. What's on your mind?",
        },
      ]);
    } catch {
      console.error("Failed to clear history");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[80vh] bg-[#0a0a0a] border border-white/12 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-gradient-to-r from-[#0d0d0d] to-[#111] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Tradie AI</p>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearHistory}
                    title="Clear history"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 }}
                    className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.role === "assistant" && (
                      <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mt-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-white text-black rounded-br-sm font-medium"
                          : "bg-[#161616] border border-white/8 rounded-bl-sm"
                      }`}
                    >
                      {m.role === "user" ? (
                        <span>{m.content}</span>
                      ) : (
                        <MarkdownRenderer content={m.content} />
                      )}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-[#161616] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/10 bg-[#0d0d0d] shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                    }}
                    onKeyDown={handleKey}
                    placeholder="Ask anything..."
                    rows={1}
                    className="flex-1 px-3.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/30 transition-all resize-none no-scrollbar"
                    style={{ minHeight: "40px", maxHeight: "100px" }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-40"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1.5 text-center">
                  Shift+Enter for new line · Enter to send
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
