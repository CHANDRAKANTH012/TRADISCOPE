import { useState } from "react";

const useFetchNews = () => {
  const [news, setNews] = useState([]);

  const fetchNews = async (q_data) => {
    console.log("Query sent", q_data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/news/news`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q_data: q_data }),
          method: "POST",
        }
      );
      console.log("Query passed:", q_data);
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  return { news, fetchNews };
};

export default useFetchNews;
