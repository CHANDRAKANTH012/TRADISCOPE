import { useState } from "react";

const useFetchPairNews = () => {
  const [pair, setPair] = useState([]);

  const fetchPair = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/pair/pair`,
        {}
      );
      const data = await response.json();
      setPair(data);
    } catch (err) {
      console.error("Error fetching pair-news:", err);
    }
  };

  return { pair, fetchPair };
};

export default useFetchPairNews;
