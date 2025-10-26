import React, { useState } from "react";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

const RiskRewardCalc = () => {
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");

  const risk = entry && stop ? Math.abs(entry - stop) : 0;
  const reward = entry && target ? Math.abs(target - entry) : 0;
  const rr = risk > 0 ? (reward / risk).toFixed(2) : 0;

  return (
    <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 rounded-xl p-6 hover:shadow-lg hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Risk–Reward Ratio</h2>
      </div>

      <div className="space-y-3">
        <input
          type="number"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Entry Price"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
        <input
          type="number"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
          placeholder="Stop Loss"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
      </div>

      <div className="mt-4 border-t border-white/10 pt-4 text-sm space-y-2">
        <p>
          Risk: <span className="text-gray-300">{risk}</span>
        </p>
        <p>
          Reward: <span className="text-gray-300">{reward}</span>
        </p>
        <p>
          RR Ratio:{" "}
          <span
            className={`font-semibold ${
              rr >= 2
                ? "text-green-400"
                : rr >= 1
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {rr || "—"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RiskRewardCalc;
