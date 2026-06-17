import React, { useContext, useEffect, useState } from "react";
import { optionsData } from "../../assets/assets";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
} from "lucide-react";
import { TradeContext } from "../../context/TradeContext";

const Form = ({ onSubmit }) => {
  const [options, setOptions] = useState([]);
  const { data, setData } = useContext(TradeContext);
  const [pair_value, setPair_value] = useState("");

  useEffect(() => {
    setOptions(optionsData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(data);

    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

    const handlePair = (e) => {
      setPair_value(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.action) {
      alert("Please select Buy or Sell action.");
      return;
    }

    setData((prev) => ({
      ...prev,
      pair: pair_value,
    }));

    console.log("Submitted Pair:", pair_value);

    onSubmit?.({
      ...data,
      pair: pair_value,
    });

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0a0a0a]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl text-white"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <h3 className="text-2xl font-semibold tracking-wide text-white">
          Enter Trade Details
        </h3>
      </div>

      {/* Action Buttons & Pair Select */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Action
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setData({ ...data, action: "Buy" })}
              className={`flex items-center justify-center space-x-2 py-3 rounded-lg border-2 transition-all duration-200 ${
                data.action === "Buy"
                  ? "border-emerald-500 bg-emerald-400 text-white"
                  : "border-white/10 hover:border-white/30 text-gray-400"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Buy</span>
            </button>
            <button
              type="button"
              onClick={() => setData({ ...data, action: "Sell" })}
              className={`flex items-center justify-center space-x-2 py-3 rounded-lg border-2 transition-all duration-200 ${
                data.action === "Sell"
                  ? "border-red-500 bg-red-400 text-white"
                  : "border-white/10 hover:border-white/30 text-gray-400"
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              <span>Sell</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Trading Pair
          </label>
          <select
            name="pair"
            value={pair_value}
            onChange={handlePair}
            required
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all"
          >
            <option value="">Select pair</option>
            {options.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-400 mb-3">
          include ?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "news", label: "Analysis" },
            { id: "events", label: "Trends" },
            { id: "insights", label: "Insights" },
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                data[opt.id]
                  ? "border-white bg-white/10 text-white"
                  : "border-white/10 hover:border-white/30 text-gray-400"
              }`}
            >
              <input
                type="checkbox"
                name={opt.id}
                checked={data[opt.id]}
                onChange={handleChange}
                className="accent-white w-5 h-5"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Entry and Target Prices */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Entry Price
          </label>
          <DollarSign className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
          <input
            type="number"
            name="entryPrice"
            value={data.entryPrice}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Target Price
          </label>
          <Target className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
          <input
            type="number"
            name="expectedPrice"
            value={data.expectedPrice}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all"
          />
        </div>
      </div> */}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-white/10 text-white font-semibold py-4 rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
      >
        Analyze Trade
      </button>
    </form>
  );
};

export default Form;
