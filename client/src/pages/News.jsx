// // pages/News.jsx
// import React, { useContext, useEffect } from "react";
// import { TradeContext } from "../context/TradeContext";
// import Form from "../components/Form/Form";

// const News = () => {
//   const { biasResult, news, fetchNews } = useContext(TradeContext);

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
//       <div className="w-full max-w-6xl border border-white/10 rounded-2xl p-10 bg-[#0a0a0a]/60 backdrop-blur-xl shadow-2xl">
//         <h1 className="text-center text-3xl font-semibold mb-10 tracking-wide text-white/90">
//           Market News Finder
//         </h1>

//         <div className="flex flex-col md:flex-row gap-10">
//           {/* LEFT — Market Insights */}
//           <div className="flex-1 border border-white/10 rounded-xl p-6 bg-black/50 space-y-6 overflow-y-auto max-h-[600px] animate-fadeIn">
//             {news.length > 0 ? (
//               news.slice(0, 5).map((item, i) => (
//                 <div
//                   key={i}
//                   className="p-4 border border-white/10 rounded-lg hover:border-white/30 transition-all duration-300 bg-gradient-to-br from-[#121212] to-[#1a1a1a]"
//                 >
//                   <h3 className="text-lg font-semibold text-white/90 mb-1">
//                     {item.title || `Event: ${item.event}`}
//                   </h3>
//                   <p className="text-sm text-gray-400 mb-2">
//                     Currency: {item.currency}
//                   </p>
//                   <p className="text-gray-300 text-sm">
//                     Impact:{" "}
//                     <span
//                       className={
//                         item.impact === "High"
//                           ? "text-red-400"
//                           : item.impact === "Medium"
//                           ? "text-yellow-400"
//                           : "text-green-400"
//                       }
//                     >
//                       {item.impact}
//                     </span>
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center italic">
//                 Fetching real-time market news...
//               </p>
//             )}

//             {biasResult && (
//               <div className="mt-10 border-t border-white/10 pt-6">
//                 <h3 className="text-lg font-semibold text-white/90 mb-2">
//                   AI Market Bias:
//                 </h3>
//                 <p className="text-gray-300 mb-4">{biasResult.reason}</p>
//                 <span
//                   className={`font-semibold ${
//                     biasResult.bias?.toLowerCase() === "bullish"
//                       ? "text-green-400"
//                       : biasResult.bias?.toLowerCase() === "bearish"
//                       ? "text-red-400"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   {biasResult.bias?.toUpperCase() || "N/A"}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* RIGHT — Form */}
//           <div className="w-full md:w-[40%]">
//             <Form />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default News;

import React, { useContext, useEffect } from "react";
import { TradeContext } from "../context/TradeContext";
import Form from "../components/Form/Form";
import { Loader2, ExternalLink } from "lucide-react";

const News = () => {
  const { news, fetchNews,data} = useContext(TradeContext);
  
  const q_data = data.pair;
  

  useEffect(() => {
    fetchNews(q_data)
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl border border-white/10 rounded-2xl p-10 bg-[#0a0a0a]/70 backdrop-blur-xl shadow-2xl">
        <h1 className="text-center text-3xl font-semibold mb-10 tracking-wide text-white/90">
          Market News & Insights
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT — News Feed */}
          <div className="flex-1 border border-white/10 rounded-xl p-6 bg-black/60 overflow-y-auto max-h-[650px] space-y-6">
            {news.length > 0 ? (
              news.slice(0, 8).map((article, i) => (
                <div
                  key={i}
                  className="p-5 border border-white/10 rounded-lg bg-gradient-to-br from-[#111] to-[#1a1a1a] hover:border-white/30 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-white/90 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {article.description?.slice(0, 120) ||
                      "No summary available..."}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(article.pubDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {article.link && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                      >
                        <span>Read</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                <p className="text-gray-500 italic">
                  Fetching latest financial news...
                </p>
              </div>
            )}
          </div>

          {/* RIGHT — Form */}
          <div className="w-full md:w-[40%]">
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
