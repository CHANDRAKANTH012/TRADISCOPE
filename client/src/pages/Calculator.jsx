// client/src/pages/Calculator.jsx
import React, { useState } from "react";
import PortfolioRiskAnalyzer from "../components/calculator/PortfolioRiskAnalyzer";
import LeverageMarginCalculator from "../components/calculator/LeverageMarginCalculator";
import CompoundingProjection from "../components/calculator/CompoundingProjection";
import MultiTradeOptimizer from "../components/calculator/MultiTradeOptimizer";
import OutcomeProbability from "../components/calculator/OutcomeProbability";
import { motion } from "framer-motion";
import {
  Calculator,
  BarChart3,
  TrendingUp,
  Brain,
  Percent,
} from "lucide-react";

const CalculatorPage = () => {
  const [active, setActive] = useState("risk");

  const renderComponent = () => {
    switch (active) {
      case "margin":
        return <LeverageMarginCalculator />;
      case "compounding":
        return <CompoundingProjection />;
      case "optimizer":
        return <MultiTradeOptimizer />;
      case "probability":
        return <OutcomeProbability />;
      default:
        return <PortfolioRiskAnalyzer />;
    }
  };

  const tabs = [
    { key: "risk", label: "Portfolio Risk" },
    { key: "margin", label: "Leverage & Margin" },
    { key: "compounding", label: "Compounding" },
    { key: "optimizer", label: "Optimizer" },
    { key: "probability", label: "Outcome Probability" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Tabs - responsive (wrap/scroll on small screens) */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto py-2 px-1 md:justify-center">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-md text-sm md:text-base transition-all flex-shrink-0 ${
                active === t.key
                  ? "bg-white text-black shadow-md"
                  : "bg-white/8 hover:bg-white/12 text-white/90"
              }`}
              aria-pressed={active === t.key}
              aria-label={`Show ${t.label}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      {/* Active tool */}
      <div className="max-w-6xl mx-auto mb-10">{renderComponent()}</div>

      {/* Guide / Description Section */}
      <CalculatorGuideSection />
    </div>
  );
};

export default CalculatorPage;

/* ===================== Guide Section (responsive) ===================== */

const CalculatorGuideSection = () => {
  const guides = [
    {
      title: "Portfolio Risk Analyzer",
      icon: <BarChart3 className="w-7 h-7 text-emerald-400" />,
      desc: "Understand your total portfolio exposure at a glance. Visualize the risk percentage and capital allocation across multiple open positions.",
      guide: [
        "Add trades with pair, capital, and risk percentage.",
        "Use the chart to identify overexposed assets and concentration risk.",
        "Rebalance allocations to keep total exposure within your risk limit.",
      ],
      img: "https://cdn-icons-png.flaticon.com/512/4149/4149657.png",
      alt: "Portfolio risk chart illustration",
    },
    {
      title: "Leverage & Margin Calculator",
      icon: <Calculator className="w-7 h-7 text-yellow-400" />,
      desc: "Quickly estimate margin required and free margin left after opening a position. Avoid using excessive leverage and know your liquidation risk.",
      guide: [
        "Enter account balance, leverage and lot size.",
        "Check required margin and free margin before opening orders.",
        "Adjust leverage or lot size to keep sufficient free margin.",
      ],
      img: "https://cdn-icons-png.flaticon.com/512/9131/9131556.png",
      alt: "Margin and leverage illustration",
    },
    {
      title: "Compounding Projection",
      icon: <TrendingUp className="w-7 h-7 text-blue-400" />,
      desc: "Simulate how your account could grow using compounding based on risk per trade, win rate and reward ratio. Useful for long-term planning.",
      guide: [
        "Set starting balance, risk per trade, R:R and win rate.",
        "Run multiple-trade simulations to visualize possible equity curves.",
        "Use results to set realistic targets and risk per trade.",
      ],
      img: "https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
      alt: "Compounding growth illustration",
    },
    {
      title: "Multi-Trade Optimizer",
      icon: <Brain className="w-7 h-7 text-purple-400" />,
      desc: "Run stochastic simulations of a trading strategy to estimate expected final balance, ROI and distribution of outcomes under your parameters.",
      guide: [
        "Input average R:R, win rate and number of trades.",
        "Simulate sequences of wins/losses to see variance in outcomes.",
        "Adjust risk or position sizing to improve expected outcomes.",
      ],
      img: "https://cdn-icons-png.flaticon.com/512/4762/4762314.png",
      alt: "Optimizer / AI simulation illustration",
    },
    {
      title: "Outcome Probability",
      icon: <Percent className="w-7 h-7 text-pink-400" />,
      desc: "Estimate the probability of finishing profitable given your win rate and reward/risk ratio. Great for testing if a system is statistically viable.",
      guide: [
        "Enter your historical win rate and average R:R.",
        "Estimate expected value and probability of profit.",
        "Use the result to validate strategy robustness before risking capital.",
      ],
      img: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
      alt: "Probability and statistics illustration",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-16">
      {guides.map((item, i) => {
        const isReversed = i % 2 !== 0;
        return (
          <motion.section
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.06 }}
            className={`flex flex-col gap-6 md:gap-10 items-center ${
              isReversed ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* IMAGE */}
            <div className="md:w-1/2 w-full flex justify-center">
              <motion.img
                src={item.img}
                alt={item.alt}
                className="w-full max-w-[320px] md:w-64 md:max-w-none object-contain rounded-lg bg-gradient-to-br from-[#0a0a0a] to-[#141414] p-4 border border-white/8 shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
                loading="lazy"
              />
            </div>

            {/* TEXT */}
            <div className="md:w-1/2 w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-md bg-white/5">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95">
                  {item.title}
                </h3>
              </div>

              <p className="text-gray-400 mb-4 leading-relaxed">{item.desc}</p>

              <div className="bg-black/30 border border-white/6 rounded-md p-4">
                <h4 className="text-sm text-gray-300 font-semibold mb-2">
                  Quick guide
                </h4>
                <ul className="list-disc ml-5 text-gray-400 space-y-2 text-sm">
                  {item.guide.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>

              {/* CTA: view tool (scroll to top / activate) - small and responsive */}
              <div className="mt-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // scroll to top: the tool area is near top of page; scroll smoothly
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    // optionally, could also activate a tab by exposing setter via props/context
                  }}
                  className="inline-block mt-2 px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 text-white/90 text-sm"
                >
                  View tool
                </a>
              </div>
            </div>
          </motion.section>
        );
      })}
    </div>
  );
};
