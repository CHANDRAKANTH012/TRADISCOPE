import React, { useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const LeverageMarginCalculator = () => {
  const [data, setData] = useState({ balance: "", leverage: "", lotSize: "" });
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const calculate = () => {
    if (!data.balance || !data.leverage || !data.lotSize) return;

    const margin = (data.lotSize * 100000) / data.leverage;
    const usedMargin = margin;
    const freeMargin = data.balance - usedMargin;
    setResult({ margin, freeMargin });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#0f0f0f] p-6 rounded-xl border border-white/10 shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-6 text-center md:text-left">
        ⚖️ Leverage & Margin Calculator
      </h2>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <input
          name="balance"
          placeholder="Account Balance"
          onChange={handleChange}
          type="number"
          className="p-3 bg-black border border-white/10 rounded w-full text-sm md:text-base"
        />
        <input
          name="lotSize"
          placeholder="Lot Size"
          onChange={handleChange}
          type="number"
          className="p-3 bg-black border border-white/10 rounded w-full text-sm md:text-base"
        />
        <input
          name="leverage"
          placeholder="Leverage (e.g. 100)"
          onChange={handleChange}
          type="number"
          className="p-3 bg-black border border-white/10 rounded w-full text-sm md:text-base"
        />
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-white text-black rounded font-semibold mb-6 hover:bg-white/90 transition-all"
      >
        Calculate
      </button>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between gap-6 text-center sm:text-left"
        >
          <div className="flex-1">
            <p className="text-gray-400 text-sm md:text-base">Required Margin:</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              <CountUp end={result.margin} decimals={2} /> USD
            </h3>
          </div>

          <div className="flex-1">
            <p className="text-gray-400 text-sm md:text-base">Free Margin:</p>
            <h3 className="text-2xl md:text-3xl font-bold text-green-400">
              <CountUp end={result.freeMargin} decimals={2} /> USD
            </h3>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LeverageMarginCalculator;
