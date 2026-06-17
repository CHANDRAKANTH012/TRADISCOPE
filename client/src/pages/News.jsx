import React, { useContext, useState } from "react";
import { TradeContext } from "../context/TradeContext";
import Form from "../components/Form/Form";
import NewsAISidebar from "../components/NewsAISidebar/NewsAISidebar";
import {
  Loader2, ExternalLink, BrainCircuit, AlertCircle,
  Newspaper, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const News = () => {
  const {
    news, newsLoading, newsError, aiAnalysis,
    lastOptions, lastQuery, fetchNews, data,
  } = useContext(TradeContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Called by Form on submit — passes pair + AI options
  const handleFormSubmit = (formData) => {
    fetchNews(formData.pair, {
      analysis: formData.news,    // Form checkbox "Analysis" maps to data.news
      trends: formData.events,    // "Trends" maps to data.events
      insights: formData.insights,
    });
  };

  const hasAIOptions = lastOptions && (lastOptions.analysis || lastOptions.trends || lastOptions.insights);
  const showViewAnalysis = hasAIOptions && aiAnalysis && !newsLoading;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-4 sm:p-8">
      <div className="w-full max-w-6xl border border-white/10 rounded-2xl p-5 sm:p-10 bg-[#0a0a0a]/70 backdrop-blur-xl shadow-2xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-white/90 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-blue-400" />
            Market News & Insights
          </h1>

          {/* View Analysis button — appears after fetch with AI options */}
          <AnimatePresence>
            {showViewAnalysis && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-500/20 whitespace-nowrap"
              >
                <BrainCircuit className="w-4 h-4" />
                View AI Analysis
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT — News Feed */}
          <div className="flex-1 border border-white/10 rounded-xl p-5 bg-black/60 overflow-y-auto max-h-[650px] no-scrollbar">

            {/* Loading State */}
            {newsLoading && (
              <div className="flex flex-col items-center justify-center h-64 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                <p className="text-gray-500 text-sm italic">Fetching latest news{hasAIOptions ? " & AI analysis" : ""}...</p>
              </div>
            )}

            {/* Error State */}
            {!newsLoading && newsError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-40 gap-3"
              >
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-red-400 text-sm">{newsError}</p>
                <button
                  onClick={() => fetchNews(lastQuery, lastOptions)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </button>
              </motion.div>
            )}

            {/* Empty / Waiting State */}
            {!newsLoading && !newsError && news.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
                <Newspaper className="w-10 h-10 text-white/20" />
                <p className="text-gray-500 text-sm">
                  Submit the form to fetch the latest financial news.
                </p>
                <p className="text-gray-600 text-xs">
                  Check Analysis, Trends, or Insights for AI-powered insights.
                </p>
              </div>
            )}

            {/* News Articles */}
            {!newsLoading && !newsError && news.length > 0 && (
              <div className="space-y-4">
                {news.slice(0, 8).map((article, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 sm:p-5 border border-white/10 rounded-xl bg-gradient-to-br from-[#111] to-[#1a1a1a] hover:border-white/25 hover:shadow-lg transition-all duration-300"
                  >
                    {article.source_name && (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5 mb-2">
                        {article.source_name}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-white/90 mb-1.5 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 leading-relaxed">
                      {article.description?.slice(0, 130) || "No summary available..."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(article.pubDate).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {article.link && (
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-400 hover:text-white transition"
                        >
                          Read
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Form */}
          <div className="w-full md:w-[40%]">
            <Form onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      <NewsAISidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        aiAnalysis={aiAnalysis}
        requestedOptions={lastOptions}
        newsQuery={lastQuery}
      />
    </div>
  );
};

export default News;
