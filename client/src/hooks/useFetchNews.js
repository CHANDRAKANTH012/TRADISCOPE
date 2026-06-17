import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

const useFetchNews = () => {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [lastOptions, setLastOptions] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const { authFetch } = useAuth();

  const fetchNews = async (q_data, options = {}) => {
    setNewsLoading(true);
    setNewsError(null);
    setAiAnalysis(null);

    const query = q_data || "";
    setLastQuery(query);
    setLastOptions(options);

    try {
      const res = await authFetch(`${API}/api/news/fetch`, {
        method: "POST",
        body: JSON.stringify({
          q_data: query,
          analysis: !!options.analysis,
          trends: !!options.trends,
          insights: !!options.insights,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch news");
      }

      setNews(data.news || []);

      if (data.aiAnalysis) {
        setAiAnalysis(data.aiAnalysis);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setNewsError(err.message);
    } finally {
      setNewsLoading(false);
    }
  };

  return { news, newsLoading, newsError, aiAnalysis, lastOptions, lastQuery, fetchNews };
};

export default useFetchNews;
