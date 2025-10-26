import React, { useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const OutcomeProbability = () => {
  const [input, setInput] = useState({ winRate: 60, rr: 2, trades: 20 });
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const calculate = () => {
    const expectedValue =
      (input.winRate / 100) * input.rr - (1 - input.winRate / 100);
    const profitProbability = Math.min(
      100,
      Math.max(0, 50 + expectedValue * 25)
    );
    setResult({ expectedValue, profitProbability });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#0f0f0f] p-6 rounded-xl border border-white/10 shadow-lg w-full"
    >
      <h2 className="text-xl font-semibold mb-6 text-center md:text-left">
        🎯 Outcome Probability
      </h2>

      {/* Responsive inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 text-sm md:text-base">
        <input
          name="winRate"
          placeholder="Win %"
          type="number"
          value={input.winRate}
          onChange={handleChange}
          className="p-3 bg-black border border-white/10 rounded text-white w-full"
        />
        <input
          name="rr"
          placeholder="R:R"
          type="number"
          value={input.rr}
          onChange={handleChange}
          className="p-3 bg-black border border-white/10 rounded text-white w-full"
        />
        <input
          name="trades"
          placeholder="Trades"
          type="number"
          value={input.trades}
          onChange={handleChange}
          className="p-3 bg-black border border-white/10 rounded text-white w-full"
        />
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-white text-black rounded font-semibold mb-6 hover:bg-white/90 transition-all"
      >
        Estimate
      </button>

      {/* Result display */}
      {result && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center sm:text-left space-y-3"
        >
          <div>
            <p className="text-gray-400 text-sm">Expected Value per Trade:</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp end={result.expectedValue} decimals={2} />
            </h3>
          </div>

          <div>
            <p className="text-gray-400 text-sm mt-3">Probability of Profit:</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400">
              <CountUp end={result.profitProbability} decimals={2} />%
            </h3>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OutcomeProbability;
