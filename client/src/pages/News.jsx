import React, { useContext } from "react";
import { TradeContext } from "../context/TradeContext";
import Form from "../components/Form/Form";

const News = () => {
  const { biasResult } = useContext(TradeContext);

  return (
    <>
      <div>
        {/* Now the biasResult is available globally throughout the Application via Context API */}
        {console.log(biasResult.reason)}
        <Form/>
      </div>
    </>
  );
};

export default News;
