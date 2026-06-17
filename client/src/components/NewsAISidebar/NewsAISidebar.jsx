import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Loader2, TrendingUp, BarChart2, Lightbulb,
  MessageSquare, ChevronRight, Bot
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MarkdownRenderer from "../MarkdownRenderer";

const API = import.meta.env.VITE_API_BASE_URL;

const SectionTab = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      active
        ? "bg-white text-black"
        : "text-gray-400 hover:text-white hover:bg-white/10"
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

const NewsAISidebar = ({ isOpen, onClose, aiAnalysis, requestedOptions, newsQuery }) => {
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    if (requestedOptions?.analysis) return "analysis";
    if (requestedOptions?.trends) return "trends";
    if (requestedOptions?.insights) return "insights";
    return "chat";
  });

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I've analyzed the latest ${newsQuery || "market"} news for you. Ask me anything about the current market situation, or check the tabs above for detailed analysis.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, activeTab]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || chatLoading) return;

    const userMsg = { role: "user", content: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setChatLoading(true);

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
      setChatLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const tabs = [];
  if (requestedOptions?.analysis) tabs.push({ id: "analysis", label: "Analysis", icon: BarChart2 });
  if (requestedOptions?.trends) tabs.push({ id: "trends", label: "Trends", icon: TrendingUp });
  if (requestedOptions?.insights) tabs.push({ id: "insights", label: "Insights", icon: Lightbulb });
  tabs.push({ id: "chat", label: "Chat", icon: MessageSquare });

  const renderTabContent = () => {
    if (activeTab === "chat") {
      return (
        <div className="flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar py-3">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-white text-black rounded-br-sm"
                          : "bg-[#1a1a1a] border border-white/8 rounded-bl-sm"
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
            {chatLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-3 border-t border-white/8">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about the market..."
              className="flex-1 px-3.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/30 transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={chatLoading || !input.trim()}
              className="w-10 h-10 shrink-0 bg-white rounded-xl flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      );
    }

    const content = aiAnalysis?.[activeTab];
    return (
      <div className="flex-1 overflow-y-auto no-scrollbar py-3">
        {content ? (
            <div className="bg-[#111] border border-white/8 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                {activeTab === "analysis" && <BarChart2 className="w-4 h-4 text-blue-400" />}
                {activeTab === "trends" && <TrendingUp className="w-4 h-4 text-green-400" />}
                {activeTab === "insights" && <Lightbulb className="w-4 h-4 text-yellow-400" />}
                <span className="font-semibold text-white text-sm capitalize">{activeTab}</span>
              </div>
              <MarkdownRenderer content={content} />

              <button
                onClick={() => setActiveTab("chat")}
                className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Ask a follow-up question
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            No {activeTab} data available.
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">AI News Analysis</h2>
                  <p className="text-xs text-gray-500">{newsQuery || "Market Overview"}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 px-5 py-3 border-b border-white/8 shrink-0 overflow-x-auto no-scrollbar">
              {tabs.map((t) => (
                <SectionTab
                  key={t.id}
                  id={t.id}
                  label={t.label}
                  icon={t.icon}
                  active={activeTab === t.id}
                  onClick={setActiveTab}
                />
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 px-5 overflow-hidden flex flex-col min-h-0">
              {renderTabContent()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsAISidebar;
