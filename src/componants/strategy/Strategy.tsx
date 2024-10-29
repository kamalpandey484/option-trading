import React, { useEffect } from "react";

const Strategy = () => {
  const fetchData = async () => {
    // const url = "https://prices.algotest.xyz/contracts";
    const url =
      "https://prices.algotest.xyz/option-chain-with-ltp?underlying=BANKNIFTY";
    const response = await fetch(url);
    if (!response.ok) {
      console.log(response);
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return <div>strategy index</div>;
};

export default Strategy;
