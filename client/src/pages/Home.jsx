import React, { useState, useEffect } from "react";
import Form from "../components/Form/Form";
import {
  TrendingUp,
  Newspaper,
  ClipboardList,
  Calculator,
  Zap,
  Shield,
  BarChart3,
  Cpu,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 300);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Market Bias",
      description:
        "AI-powered analysis to determine the most probable market direction for the day",
      link: "/bias",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Newspaper,
      title: "News & Events",
      description:
        "Get relevant news headlines and economic events affecting your trading pairs",
      link: "/news",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: ClipboardList,
      title: "Trade Planning",
      description:
        "AI agent helps you plan the best trade setup based on chart analysis",
      link: "/plan",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Calculator,
      title: "Position Calculator",
      description:
        "Calculate position sizes, risk/reward ratios, and profit targets",
      link: "/calculator",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-3xl animate-pulse" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div
            className={`inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 transition-all duration-1000 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Trading Analytics
            </span>
          </div>

          <h1
            className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent transition-all duration-1000 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
              TRADISCOPE
            </span>
          </h1>

          <p
            className={`text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Get comprehensive trading insights powered by AI. Analyze news, plan
            trades, and calculate positions—all in one place.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              to="/plan"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-transform duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Floating Glow Circles */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Shield, label: "AI-Powered", value: "Analysis" },
          { icon: Zap, label: "Real-time", value: "Insights" },
          { icon: BarChart3, label: "Data-Driven", value: "Decisions" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-dark-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </section>

      {/* DEMO AI AGENT SECTION */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#0f0f0f] to-black">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold mb-4">
            Experience the Capabilities of AI
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Watch how Artificial Intelligence analyzes market conditions and
            provides actionable insights.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-dark-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold">Trady is Thinking...</h3>
          </div>

          <div className="bg-black/40 rounded-xl p-6 border border-white/10 animate-pulse">
            <p className="text-gray-300 text-sm text-left font-mono leading-relaxed">
              <span className="text-cyan-400">
                [Analyzing market sentiment...]
              </span>{" "}
              <br />
              Predicted Bias:{" "}
              <span className="text-green-400 font-semibold">Bullish</span>{" "}
              <br />
              Suggested Trade:{" "}
              <span className="text-yellow-400">
                Buy XAU/USD above 2380.50
              </span>{" "}
              <br />
              Risk: <span className="text-red-400">1.2%</span> | Reward:{" "}
              <span className="text-green-400">3.4%</span> <br />
              Confidence Level: <span className="text-blue-400">87%</span>
            </p>
          </div>

          <p className="mt-4 text-sm text-white-500 italic text-center">
            Login to Experience the{" "}
            <span className="text-sm text-white italic text-center font-bold">
              "World of AI"
            </span>
          </p>
        </div>

        <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0f0f0f] to-black">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-gray-400">
            Powerful AI tools designed for Forex traders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link
                key={idx}
                to={feature.link}
                className="group bg-dark-card/50 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all transform hover:-translate-y-2"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
