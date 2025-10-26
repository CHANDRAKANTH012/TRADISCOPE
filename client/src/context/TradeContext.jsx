// context/TradeContext.jsx
import { createContext, useState } from "react";
import useFetchNews from "../hooks/useFetchNews.js";
import useFetchPairNews from "../hooks/useFetchPairNews.js";

export const TradeContext = createContext();

export const TradeContextProvider = ({ children }) => {
  const [biasResult, setBiasResult] = useState("");
  const { news, fetchNews } = useFetchNews();
  // const { pair, fetchPair } = useFetchPairNews();

  const [planResult, setPlanResult] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState(null);

  const fetchPlanAnalysis = async (planPayload) => {
    setPlanLoading(true);
    setPlanError(null);
    setPlanResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch plan analysis");
      }

      // store plan result (either parsed plan or raw)
      setPlanResult(data.plan || data); // backend returns {plan: ...}
    } catch (err) {
      console.error("Error fetching plan analysis:", err);
      setPlanError(err.message || "Unknown error");
    } finally {
      setPlanLoading(false);
    }
  };

  const [data, setData] = useState({
    action: "",
    pair: "",
    news: false,
    events: false,
    insights: false,
    entryPrice: "",
    expectedPrice: "",
  });

  const value = {
    biasResult,
    setBiasResult,
    news,
    fetchNews,
    // pair,
    // fetchPair,
    data,
    setData,
    planResult,
    planLoading,
    planError,
    fetchPlanAnalysis,
  };

  return (
    <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
  );
};
