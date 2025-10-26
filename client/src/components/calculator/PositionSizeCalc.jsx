import React, { useState } from "react";
import { Scale } from "lucide-react";

const PositionSizeCalc = () => {
  const [balance, setBalance] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [stopDistance, setStopDistance] = useState("");

  const riskAmount =
    balance && riskPercent ? (balance * (riskPercent / 100)).toFixed(2) : 0;
  const positionSize =
    riskAmount && stopDistance ? (riskAmount / stopDistance).toFixed(2) : 0;

  return (
    <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 rounded-xl p-6 hover:shadow-lg hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Position Size</h2>
      </div>

      <div className="space-y-3">
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Account Balance ($)"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
        <input
          type="number"
          value={riskPercent}
          onChange={(e) => setRiskPercent(e.target.value)}
          placeholder="Risk % per trade"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
        <input
          type="number"
          value={stopDistance}
          onChange={(e) => setStopDistance(e.target.value)}
          placeholder="Stop distance (points/pips)"
          className="w-full p-2 bg-black/40 border border-white/10 rounded"
        />
      </div>

      <div className="mt-4 border-t border-white/10 pt-4 text-sm space-y-2">
        <p>
          Risk Amount:{" "}
          <span className="text-gray-300">${riskAmount || "—"}</span>
        </p>
        <p>
          Position Size:{" "}
          <span className="text-emerald-400 font-semibold">
            {positionSize || "—"} units
          </span>
        </p>
      </div>
    </div>
  );
};

export default PositionSizeCalc;
