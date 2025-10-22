// context/TradeContext.jsx
import { createContext, useState } from "react";
import useFetchNews from "../hooks/useFetchNews.js";
import useFetchPairNews from "../hooks/useFetchPairNews.js";

export const TradeContext = createContext();

export const TradeContextProvider = ({ children }) => {
  const [biasResult, setBiasResult] = useState("");
  const { news, fetchNews } = useFetchNews();
  // const { pair, fetchPair } = useFetchPairNews();
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
  };

  return (
    <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
  );
};
