// // client/src/pages/Plan.jsx
// import React, { useContext, useState } from "react";
// import { TradeContext } from "../context/TradeContext";
// import { Loader2 } from "lucide-react";

// const Plan = () => {
//   const { data, setData, fetchPlanAnalysis, planResult, planLoading, planError } =
//     useContext(TradeContext);

//   // local form copy to avoid immediate context mutation if undesired
//   const [local, setLocal] = useState({
//     pair: data.pair || "",
//     direction: data.action || "Buy",
//     entry: data.entryPrice || "",
//     stop: "",
//     target: data.expectedPrice || "",
//     reason: "",
//     marketCondition: "trending",
//     riskPercent: 1,
//     confidence: 5,
//     includeAI: true,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setLocal((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!local.pair || !local.entry || !local.stop || !local.target) {
//       alert("Please fill pair, entry, stop and target prices.");
//       return;
//     }

//     // Optionally update global context data for other pages
//     setData((prev) => ({
//       ...prev,
//       pair: local.pair,
//       action: local.direction,
//       entryPrice: local.entry,
//       expectedPrice: local.target,
//     }));

//     const payload = {
//       pair: local.pair,
//       direction: local.direction,
//       entry: Number(local.entry),
//       stop: Number(local.stop),
//       target: Number(local.target),
//       reason: local.reason,
//       marketCondition: local.marketCondition,
//       riskPercent: Number(local.riskPercent),
//       confidence: Number(local.confidence),
//       includeAI: local.includeAI,
//       createdAt: new Date().toISOString(),
//     };

//     // Call context method which hits backend
//     fetchPlanAnalysis(payload);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
//       <div className="w-full max-w-5xl bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-8 shadow-xl grid md:grid-cols-2 gap-8">
//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <h2 className="text-2xl font-semibold mb-2">Create Trade Plan</h2>
//           <div className="grid grid-cols-2 gap-3">
//             <input
//               name="pair"
//               value={local.pair}
//               onChange={handleChange}
//               placeholder="Pair (e.g. XAUUSD)"
//               className="p-3 bg-[#0d0d0d] border border-[#333] rounded"
//               required
//             />
//             <select
//               name="direction"
//               value={local.direction}
//               onChange={handleChange}
//               className="p-3 bg-[#0d0d0d] border border-[#333] rounded"
//             >
//               <option>Buy</option>
//               <option>Sell</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-3 gap-3">
//             <input
//               name="entry"
//               type="number"
//               step="0.01"
//               value={local.entry}
//               onChange={handleChange}
//               placeholder="Entry"
//               className="p-3 bg-[#0d0d0d] border border-[#333] rounded"
//               required
//             />
//             <input
//               name="stop"
//               type="number"
//               step="0.01"
//               value={local.stop}
//               onChange={handleChange}
//               placeholder="Stop Loss"
//               className="p-3 bg-[#0d0d0d] border border-[#333] rounded"
//               required
//             />
//             <input
//               name="target"
//               type="number"
//               step="0.01"
//               value={local.target}
//               onChange={handleChange}
//               placeholder="Target"
//               className="p-3 bg-[#0d0d0d] border border-[#333] rounded"
//               required
//             />
//           </div>

//           <textarea
//             name="reason"
//             value={local.reason}
//             onChange={handleChange}
//             placeholder="Reason for trade (technical/fundamental)"
//             rows={4}
//             className="w-full p-3 bg-[#0d0d0d] border border-[#333] rounded"
//           />

//           <div className="flex items-center justify-between gap-3">
//             <div className="flex items-center gap-2">
//               <label className="text-sm text-gray-300">Risk %</label>
//               <input
//                 name="riskPercent"
//                 value={local.riskPercent}
//                 onChange={handleChange}
//                 type="number"
//                 min="0.1"
//                 step="0.1"
//                 className="p-2 w-20 bg-[#0d0d0d] border border-[#333] rounded"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-sm text-gray-300">Confidence</label>
//               <input
//                 name="confidence"
//                 value={local.confidence}
//                 onChange={handleChange}
//                 type="range"
//                 min="1"
//                 max="10"
//                 className="w-40"
//               />
//               <span className="text-sm text-gray-400">{local.confidence}/10</span>
//             </div>

//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name="includeAI"
//                 checked={local.includeAI}
//                 onChange={handleChange}
//                 className="w-4 h-4"
//               />
//               <span className="text-sm text-gray-300">AI Review</span>
//             </label>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-white text-black rounded font-semibold"
//           >
//             {planLoading ? "Analyzing..." : "Analyze Plan"}
//           </button>
//         </form>

//         {/* Results */}
//         <div className="p-4 bg-gradient-to-br from-[#0f0f0f] to-[#151515] border border-white/5 rounded">
//           <h3 className="text-xl font-semibold mb-4">AI Trade Review</h3>

//           {planLoading && (
//             <div className="flex flex-col items-center justify-center h-40">
//               <Loader2 className="animate-spin w-8 h-8 text-white/60" />
//               <p className="text-gray-500 mt-2">Analyzing plan, please wait…</p>
//             </div>
//           )}

//           {!planLoading && planError && (
//             <div className="text-red-400">Error: {planError}</div>
//           )}

//           {!planLoading && !planResult && !planError && (
//             <div className="text-gray-500 italic">Submit a plan to see AI feedback.</div>
//           )}

//           {!planLoading && planResult && (
//             <div className="space-y-3">
//               {/* If backend returned structured { plan: {...} } */}
//               {planResult.summary && (
//                 <>
//                   <p className="text-gray-300">{planResult.summary}</p>

//                   <div className="flex items-center gap-3">
//                     <span className="text-sm text-gray-400">Bias:</span>
//                     <span className="font-semibold">
//                       {planResult.bias_verdict || "N/A"}
//                     </span>
//                     <span className="ml-3 text-sm text-gray-400">RR:</span>
//                     <span className="font-semibold">{planResult.risk_reward || "N/A"}</span>
//                     <span className="ml-3 text-sm text-gray-400">Confidence:</span>
//                     <span className="font-semibold">{planResult.confidence || "N/A"}</span>
//                   </div>

//                   <div>
//                     <h4 className="text-sm font-semibold mt-2">Technical Notes</h4>
//                     <p className="text-sm text-gray-300">{planResult.technical_notes}</p>
//                   </div>

//                   <div>
//                     <h4 className="text-sm font-semibold mt-2">Fundamental Notes</h4>
//                     <p className="text-sm text-gray-300">{planResult.fundamental_notes}</p>
//                   </div>

//                   <div>
//                     <h4 className="text-sm font-semibold mt-2">Improvements</h4>
//                     <p className="text-sm text-gray-300">{planResult.improvements}</p>
//                   </div>
//                 </>
//               )}

//               {/* fallback: if backend returned raw text under planResult.raw */}
//               {planResult.raw && (
//                 <div>
//                   <h4 className="text-sm font-semibold">Raw AI Output</h4>
//                   <pre className="text-xs p-2 bg-black/40 rounded overflow-auto">{planResult.raw}</pre>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Plan;



import React, { useContext, useState } from "react";
import { TradeContext } from "../context/TradeContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ClipboardList, BrainCircuit } from "lucide-react";

const Plan = () => {
  const {
    data,
    setData,
    fetchPlanAnalysis,
    planResult,
    planLoading,
    planError,
  } = useContext(TradeContext);

  const [local, setLocal] = useState({
    pair: data.pair || "",
    direction: data.action || "Buy",
    entry: data.entryPrice || "",
    stop: "",
    target: data.expectedPrice || "",
    reason: "",
    marketCondition: "trending",
    riskPercent: 1,
    confidence: 5,
    includeAI: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocal((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!local.pair || !local.entry || !local.stop || !local.target) {
      alert("Please fill pair, entry, stop and target prices.");
      return;
    }

    setData((prev) => ({
      ...prev,
      pair: local.pair,
      action: local.direction,
      entryPrice: local.entry,
      expectedPrice: local.target,
    }));

    const payload = {
      pair: local.pair,
      direction: local.direction,
      entry: Number(local.entry),
      stop: Number(local.stop),
      target: Number(local.target),
      reason: local.reason,
      marketCondition: local.marketCondition,
      riskPercent: Number(local.riskPercent),
      confidence: Number(local.confidence),
      includeAI: local.includeAI,
      createdAt: new Date().toISOString(),
    };

    fetchPlanAnalysis(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#101010] text-white flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-[#0a0a0a]/80 border border-white/10 rounded-2xl p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] grid md:grid-cols-2 gap-8 backdrop-blur-lg"
      >
        {/* FORM SIDE */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Create Trade Plan
            </span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="pair"
              value={local.pair}
              onChange={handleChange}
              placeholder="Pair (e.g. XAUUSD)"
              className="p-3 bg-[#0d0d0d] border border-[#333] rounded focus:ring-1 focus:ring-white/20 outline-none transition"
              required
            />
            <select
              name="direction"
              value={local.direction}
              onChange={handleChange}
              className="p-3 bg-[#0d0d0d] border border-[#333] rounded focus:ring-1 focus:ring-white/20 outline-none transition"
            >
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["entry", "stop", "target"].map((field) => (
              <input
                key={field}
                name={field}
                type="number"
                step="0.01"
                value={local[field]}
                onChange={handleChange}
                placeholder={
                  field === "entry"
                    ? "Entry"
                    : field === "stop"
                    ? "Stop"
                    : "Target"
                }
                className="p-3 bg-[#0d0d0d] border border-[#333] rounded focus:ring-1 focus:ring-white/20 outline-none transition"
                required
              />
            ))}
          </div>

          <textarea
            name="reason"
            value={local.reason}
            onChange={handleChange}
            placeholder="Reason for trade (technical/fundamental)"
            rows={4}
            className="w-full p-3 bg-[#0d0d0d] border border-[#333] rounded focus:ring-1 focus:ring-white/20 outline-none transition"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Risk %</label>
              <input
                name="riskPercent"
                value={local.riskPercent}
                onChange={handleChange}
                type="number"
                min="0.1"
                step="0.1"
                className="p-2 w-20 bg-[#0d0d0d] border border-[#333] rounded text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Confidence</label>
              <input
                name="confidence"
                value={local.confidence}
                onChange={handleChange}
                type="range"
                min="1"
                max="10"
                className="w-40 accent-white"
              />
              <span className="text-sm text-gray-400">
                {local.confidence}/10
              </span>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="includeAI"
                checked={local.includeAI}
                onChange={handleChange}
                className="w-4 h-4 accent-white"
              />
              <span className="text-sm text-gray-300">AI Review</span>
            </label>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-gradient-to-r from-white via-gray-200 to-white text-black rounded font-semibold shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">
              {planLoading ? "Analyzing..." : "Analyze Plan"}
            </span>
            {/* shimmer line */}
            <motion.span
              animate={{ x: ["-150%", "150%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-[60px] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40"
            />
          </motion.button>
        </motion.form>

        {/* RESULT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 bg-gradient-to-br from-[#0f0f0f] to-[#151515] border border-white/5 rounded-lg shadow-inner"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI Trade Review
            </span>
          </h3>

          {planLoading && (
            <motion.div
              className="flex flex-col items-center justify-center h-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="animate-spin w-8 h-8 text-white/60" />
              <p className="text-gray-500 mt-2">Analyzing plan, please wait…</p>
            </motion.div>
          )}

          {!planLoading && planError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400"
            >
              Error: {planError}
            </motion.div>
          )}

          {!planLoading && !planResult && !planError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 italic"
            >
              Submit a plan to see AI feedback.
            </motion.div>
          )}

          {!planLoading && planResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              {planResult.summary && (
                <>
                  <p className="text-gray-300">{planResult.summary}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>Bias:</span>
                    <span
                      className={`font-semibold ${
                        planResult.bias_verdict === "Bullish"
                          ? "text-green-400"
                          : planResult.bias_verdict === "Bearish"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {planResult.bias_verdict}
                    </span>
                    <span>RR: {planResult.risk_reward}</span>
                    <span>Confidence: {planResult.confidence}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mt-2">
                      Technical Notes
                    </h4>
                    <p className="text-sm text-gray-300">
                      {planResult.technical_notes}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mt-2">
                      Fundamental Notes
                    </h4>
                    <p className="text-sm text-gray-300">
                      {planResult.fundamental_notes}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mt-2">Improvements</h4>
                    <p className="text-sm text-gray-300">
                      {planResult.improvements}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <div className="absolute -bottom-30 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
    </div>
  );
};

export default Plan;
