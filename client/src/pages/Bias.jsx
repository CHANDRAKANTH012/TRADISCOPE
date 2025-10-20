import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const Bias = () => {
  const [asset, setAsset] = useState("");
  const [biasResult, setBiasResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBiasResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/bias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset }),
      });
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl border border-[#2a2a2a] rounded-2xl p-8 bg-[#0d0d0d] shadow-xl flex flex-col md:flex-row gap-8">
        {/* Left - Summarized Bias */}
        <div className="flex-1 border border-[#2a2a2a] rounded-xl p-6 bg-black/70">
          <h2 className="text-xl font-semibold mb-4 text-white/90">
            Summarized Bias
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin text-white/80" size={36} />
            </div>
          ) : biasResult ? (
            <div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {biasResult.reason || "No explanation available."}
              </p>
              <div className="text-md font-semibold">
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
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Enter an asset to get its market bias.
            </p>
          )}
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-[40%] border border-[#2a2a2a] rounded-xl p-6 bg-black/70">
          <h2 className="text-xl font-semibold mb-4 text-white/90">Form</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Asset (e.g., XAUUSD)"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="p-3 rounded-md bg-[#0d0d0d] border border-[#333] focus:border-white outline-none text-white placeholder-gray-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-md transition-all"
            >
              {loading ? "Analyzing..." : "Get Bias"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Bias;
