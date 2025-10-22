

import { useState } from "react";

const useFetchNews = () => {
  const [news, setNews] = useState([]);

  const fetchNews = async (q_data) => {
    try {
      console.log(q_data);

      const response = await fetch("http://localhost:5000/api/news/news", {
        body: JSON.stringify({ q_data: q_data }),
        method: "POST",
      });
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  return { news, fetchNews };
};

export default useFetchNews;
