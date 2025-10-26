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
      const data = await response.json();
      console.log("Query passed:", q_data);
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  return { news, fetchNews };
};

export default useFetchNews;
