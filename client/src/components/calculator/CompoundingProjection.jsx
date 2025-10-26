import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const CompoundingProjection = () => {
  const [input, setInput] = useState({
    balance: 1000,
    risk: 2,
    rr: 2,
    winRate: 60,
    trades: 20,
  });
  const [data, setData] = useState([]);

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const simulate = () => {
    let bal = Number(input.balance);
    const arr = [{ trade: 0, balance: bal }];
    for (let i = 1; i <= input.trades; i++) {
      const win = Math.random() * 100 < input.winRate;
      const change = win
        ? bal * (input.risk / 100) * input.rr
        : -bal * (input.risk / 100);
      bal += change;
      arr.push({ trade: i, balance: Math.max(0, bal) });
    }
    setData(arr);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#0f0f0f] p-6 rounded-xl border border-white/10 shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-6 text-center md:text-left">
        📈 Compounding Projection
      </h2>

      {/* Input Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5 text-sm md:text-base">
        {["balance", "risk", "rr", "winRate", "trades"].map((k) => (
          <input
            key={k}
            name={k}
            value={input[k]}
            onChange={handleChange}
            placeholder={k}
            type="number"
            className="p-3 bg-black border border-white/10 rounded text-white w-full"
          />
        ))}
      </div>

      <button
        onClick={simulate}
        className="w-full py-3 bg-white text-black rounded font-semibold mb-6 hover:bg-white/90 transition-all"
      >
        Simulate
      </button>

      {/* Responsive Chart */}
      {data.length > 0 && (
        <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="trade" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default CompoundingProjection;
