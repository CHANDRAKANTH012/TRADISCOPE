import { useState } from "react";

const useFetchNews = () => {
  const [news, setNews] = useState([]);

  const fetchNews = async (q_data) => {
    try {
      console.log("Query Data Sent:", q_data);

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
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  return { news, fetchNews };
};

export default useFetchNews;
