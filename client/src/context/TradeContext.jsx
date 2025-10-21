import { createContext, useState } from "react";

export const TradeContext = createContext();

export const TradeContextProvider = (props) => {
    const [biasResult, setBiasResult] = useState("");



    const value = {
        biasResult,
        setBiasResult
    }

    return (
        <TradeContext.Provider value={value}>{props.children}</TradeContext.Provider>
    )
}


