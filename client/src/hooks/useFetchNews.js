// import { useEffect, useState } from "react";
// import dotenv from "dotenv";
// dotenv.config();

// const useFetchNews = () => {
//   const [news, setNews] = useState("");

//   //   const url = `${process.env.API_EVENT_ENDPOINT}`;
//   const url = "https://www.jblanked.com/news/api/forex-factory/calendar/today/";
//   const headers = {
//     Authorization: "Api-Key arJgyXqT.4EuUfiBEXmn9ieGul47nL8gxgcy9dYEU",
//     "Content-Type": "application/json",
//   };

//   useEffect(()=>{
//     getForexEvents();
//   },[])

//   const getForexEvents = async () => {
//     try {
//       const response = await fetch(url, { method: "GET", headers: headers });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       // console.log(data);
//       const eurUsdEvents = data.filter(
//         (event) => event.currency === "EUR" || event.currency === "USD"
//       );
//       console.log("EUR/USD Events:", eurUsdEvents);
//       return data;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
// };

// export default useFetchNews;

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
