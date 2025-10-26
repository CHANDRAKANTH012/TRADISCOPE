// client/src/components/calculator/PortfolioRiskAnalyzer.jsx
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const COLORS = ["#34d399", "#f87171", "#60a5fa", "#facc15", "#a78bfa"];

const PortfolioRiskAnalyzer = () => {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ pair: "", risk: "", capital: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTrade = () => {
    if (!form.pair || !form.risk || !form.capital) return;
    setTrades([...trades, { ...form, id: Date.now() }]);
    setForm({ pair: "", risk: "", capital: "" });
  };

  const totalRisk = trades.reduce(
    (acc, t) => acc + t.capital * (t.risk / 100),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0f0f0f] p-6 md:p-8 rounded-xl border border-white/10 shadow-lg w-full max-w-5xl mx-auto"
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center justify-center md:justify-start gap-2">
        <span role="img" aria-label="chart">
          📊
        </span>
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Portfolio Risk Analyzer
        </span>
      </h2>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <input
          name="pair"
          placeholder="Pair (e.g. XAUUSD)"
          value={form.pair}
          onChange={handleChange}
          className="p-3 bg-black border border-white/10 rounded flex-1 min-w-[140px] text-sm focus:ring-1 focus:ring-white/20 outline-none"
        />
        <input
          name="capital"
          type="number"
          placeholder="Capital"
          value={form.capital}
          onChange={handleChange}
          className="p-3 bg-black border border-white/10 rounded flex-1 min-w-[140px] text-sm focus:ring-1 focus:ring-white/20 outline-none"
        />
        <input
          name="risk"
          type="number"
          placeholder="Risk %"
          value={form.risk}
          onChange={handleChange}
          className="p-3 bg-black border border-white/10 rounded flex-1 min-w-[140px] text-sm focus:ring-1 focus:ring-white/20 outline-none"
        />
        <button
          onClick={addTrade}
          className="px-5 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition-all min-w-[100px]"
        >
          Add
        </button>
      </div>

      {/* Chart + Result */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Chart Section */}
        {/* <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trades}
                dataKey="risk"
                nameKey="pair"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
              >
                {trades.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div> */}

        {/* Result Section */}
        <div className="text-center md:text-right w-full md:w-1/2 space-y-2 ml-10">
          <p className="text-gray-400 text-sm md:text-base">
            Total Risk Exposure:
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            <CountUp end={totalRisk} decimals={2} /> USD
          </h3>
          {trades.length > 0 && (
            <p className="text-xs text-gray-500">
              Across {trades.length} active trades
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioRiskAnalyzer;
