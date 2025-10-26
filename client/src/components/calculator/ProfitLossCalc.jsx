import React, { useState } from "react";
import { DollarSign } from "lucide-react";

const ProfitLossCalc = () => {
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [positionSize, setPositionSize] = useState("");

  const profitLoss =
    entry && exit && positionSize
      ? ((exit - entry) * positionSize).toFixed(2)
      : 0;

  const profitPercent =
    entry && exit ? (((exit - entry) / entry) * 100).toFixed(2) : 0;

  return (
    <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 rounded-xl p-6 hover:shadow-lg hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-semibold text-white">Profit / Loss</h2>
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
          value={exit}
          onChange={(e) => setExit(e.target.value)}
          placeholder="Exit Price"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
        <input
          type="number"
          value={positionSize}
          onChange={(e) => setPositionSize(e.target.value)}
          placeholder="Position Size (units)"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
      </div>

      <div className="mt-4 border-t border-white/10 pt-4 text-sm space-y-2">
        <p>
          Profit/Loss:{" "}
          <span
            className={`font-semibold ${
              profitLoss > 0
                ? "text-green-400"
                : profitLoss < 0
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            ${profitLoss || "—"}
          </span>
        </p>
        <p>
          P/L %:{" "}
          <span
            className={`font-semibold ${
              profitPercent > 0
                ? "text-green-400"
                : profitPercent < 0
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {profitPercent || "—"}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfitLossCalc;
