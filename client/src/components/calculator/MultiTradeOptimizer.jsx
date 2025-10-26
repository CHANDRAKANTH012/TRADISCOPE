import React, { useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const MultiTradeOptimizer = () => {
  const [input, setInput] = useState({
    balance: 1000,
    risk: 2,
    rr: 2,
    winRate: 60,
    trades: 10,
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const simulate = () => {
    let bal = Number(input.balance);
    for (let i = 0; i < input.trades; i++) {
      const win = Math.random() * 100 < input.winRate;
      bal += win
        ? bal * (input.risk / 100) * input.rr
        : -bal * (input.risk / 100);
    }
    const profit = bal - input.balance;
    const roi = (profit / input.balance) * 100;
    setResult({ bal, profit, roi });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#0f0f0f] p-6 rounded-xl border border-white/10 shadow-lg w-full"
    >
      <h2 className="text-xl font-semibold mb-6 text-center md:text-left">
        🧠 Multi-Trade Optimizer
      </h2>

      {/* Responsive input grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5 text-sm md:text-base">
        {["balance", "risk", "rr", "winRate", "trades"].map((k) => (
          <input
            key={k}
            name={k}
            value={input[k]}
            onChange={handleChange}
            type="number"
            placeholder={k}
            className="p-3 bg-black border border-white/10 rounded text-white w-full"
          />
        ))}
      </div>

      <button
        onClick={simulate}
        className="w-full py-3 bg-white text-black rounded font-semibold mb-6 hover:bg-white/90 transition-all"
      >
        Optimize
      </button>

      {/* Results section */}
      {result && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center sm:text-left space-y-3"
        >
          <div>
            <p className="text-gray-400 text-sm">Expected Final Balance:</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400">
              <CountUp end={result.bal} decimals={2} /> USD
            </h3>
          </div>

          <div>
            <p className="text-gray-400 text-sm mt-3">Profit / ROI:</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp end={result.roi} decimals={2} />%
            </h3>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MultiTradeOptimizer;
