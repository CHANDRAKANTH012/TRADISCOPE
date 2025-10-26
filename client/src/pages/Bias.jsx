import React, { useContext, useState } from "react";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Brain,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { TradeContext } from "../context/TradeContext";
import axios from 'axios'

const Bias = () => {
  const [asset, setAsset] = useState("");
  // const [biasResult, setBiasResult] = useState(null);
  const { biasResult, setBiasResult } = useContext(TradeContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBiasResult(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/bias/`,
        {
          asset
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setBiasResult(data.result);
    } catch (error) {
      console.error(error);
      setBiasResult({
        bias: "Error",
        reason: "Unable to fetch bias right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-start relative overflow-hidden">
      {/* Floating animated glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#1a1a1a] via-[#222] to-[#111] blur-3xl opacity-30 animate-pulse-slow"></div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10 tracking-wide text-white"
      >
        Market Bias Analyzer
      </motion.h1>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl border border-[#2a2a2a] rounded-2xl p-8 bg-[#0d0d0d]/90 shadow-2xl flex flex-col lg:flex-row gap-8 backdrop-blur-lg"
      >
        {/* Left - Summarized Bias */}
        <div className="flex-1 border border-[#2a2a2a] rounded-xl p-6 bg-black/70 relative">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Brain className="text-blue-400" size={20} /> Summarized Bias
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin text-white/80" size={36} />
            </div>
          ) : biasResult ? (
            <motion.div
              key={biasResult.bias}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <p className="text-gray-300 leading-relaxed text-[15px] tracking-wide">
                {biasResult.reason || "No explanation available."}
              </p>

              <div className="flex items-center gap-3">
                {biasResult.bias?.toLowerCase() === "bullish" ? (
                  <TrendingUp className="text-green-400" size={22} />
                ) : (
                  <TrendingDown className="text-red-400" size={22} />
                )}
                <span className="text-lg font-semibold">
                  Direction:{" "}
                  <span
                    className={`${
                      biasResult.bias?.toLowerCase() === "bullish"
                        ? "text-green-400"
                        : biasResult.bias?.toLowerCase() === "bearish"
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {biasResult.bias?.toUpperCase() || "N/A"}
                  </span>
                </span>
              </div>

              {/* Strength visualization */}
              <div className="mt-4">
                <p className="text-gray-400 mb-2 text-sm">
                  Market Momentum Strength
                </p>
                <div className="w-full bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        biasResult.bias?.toLowerCase() === "bullish"
                          ? "80%"
                          : biasResult.bias?.toLowerCase() === "bearish"
                          ? "60%"
                          : "30%",
                    }}
                    transition={{ duration: 1 }}
                    className={`h-full ${
                      biasResult.bias?.toLowerCase() === "bullish"
                        ? "bg-green-400"
                        : biasResult.bias?.toLowerCase() === "bearish"
                        ? "bg-red-400"
                        : "bg-gray-500"
                    }`}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-gray-500 italic">
              Enter an asset to get its current market bias.
            </p>
          )}
        </div>

        {/* Right - Form */}
        <div className="w-full lg:w-[40%] border border-[#2a2a2a] rounded-xl p-6 bg-black/70">
          <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center gap-2">
            <Activity className="text-teal-400" size={20} /> Market Query
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Asset (e.g., XAUUSD)"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="p-3 rounded-md bg-[#0d0d0d] border border-[#333] focus:border-white outline-none text-white placeholder-gray-500 transition-all"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition-all"
            >
              {loading ? "Analyzing..." : "Get Bias"}
            </motion.button>
          </form>

          {/* Info cards below form */}
          <div className="mt-8 space-y-3">
            <div className="border border-[#2a2a2a] p-3 rounded-md bg-[#111] text-sm text-gray-400 hover:text-white transition-all cursor-default">
              🧭 Provides AI-driven directional outlook for selected assets.
            </div>
            <div className="border border-[#2a2a2a] p-3 rounded-md bg-[#111] text-sm text-gray-400 hover:text-white transition-all cursor-default">
              ⚙️ Considers market bias, volatility, and short-term momentum.
            </div>
            <div className="border border-[#2a2a2a] p-3 rounded-md bg-[#111] text-sm text-gray-400 hover:text-white transition-all cursor-default">
              📊 Ideal for traders assessing short-term market strength.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center text-sm text-gray-500 max-w-3xl leading-relaxed"
      >
        <p>
          Tradiscope uses algorithmic reasoning to identify short-term and
          long-term biases for major assets. This helps traders visualize
          directional confidence and volatility clusters dynamically.
        </p>
      </motion.div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
    </div>
  );
};

export default Bias;
