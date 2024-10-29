import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Contract,
  OptionData,
  OptionChainResponse,
  SelectedFuture,
} from "./componants/types/types";
import Header from "./componants/common/Header";
import ErrorMessage from "./componants/common/ErrorMessage";
import UnderlyingSelector from "./componants/header/UnderlyingSelector";
import FuturesSelector from "./componants/header/FuturesSelector";
import VixDisplay from "./componants/header/VixDisplay";
import ExpiryFilter from "./componants/expiryfilter/ExpiryFilter";
import OptionChainTable from "./componants/optionchain/OptionChainTable";

const App: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [optionChain, setOptionChain] = useState<{
    [expiryDate: string]: OptionData;
  }>({});
  const [underlyingValue, setUnderlyingValue] = useState<number>(0);
  const [futures, setFutures] = useState<{ [expiryDate: string]: OptionData }>(
    {}
  );
  const [selectedFuture, setSelectedFuture] = useState<SelectedFuture>({
    timestamp: "",
    close: 0,
  });
  const [indiaVix, setIndiaVix] = useState<number>(0);
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");
  const [expiries, setExpiries] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [underlying, setUnderlying] = useState<string>("BANKNIFTY");
  const [isDropdownOpen, setIsDropdownOpen] = useState<{
    [key: number]: boolean;
  }>({
    1: false,
    2: false,
    3: false,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const contractResponse = await axios.get<Contract[]>(
          "https://prices.algotest.xyz/contracts"
        );
        setContracts(contractResponse.data);
        console.log("Contracts data-->", contractResponse);

        const optionChainResponse = await axios.get<OptionChainResponse>(
          `https://prices.algotest.xyz/option-chain-with-ltp?underlying=${underlying}`
        );

        setOptionChain(optionChainResponse.data.options);
        setFutures(optionChainResponse.data.futures);
        setSelectedFuture({
          timestamp: Object.keys(optionChainResponse.data.futures)[0],
          close:
            optionChainResponse.data.futures[
              Object.keys(optionChainResponse.data.futures)[0]
            ].close,
        });
        setUnderlyingValue(optionChainResponse.data.cash.close);
        setIndiaVix(optionChainResponse.data.vix.close);
        setExpiries(Object.keys(optionChainResponse.data.options));
        setSelectedExpiry(Object.keys(optionChainResponse.data.options)[0]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to fetch initial data. Check console for details.");
      }
    };

    fetchInitialData();
  }, []);

  const toggleDropdown = (index: number) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleUnderlying = async (item: string) => {
    try {
      setUnderlying(item);
      toggleDropdown(1);
      const optionChainResponse = await axios.get<OptionChainResponse>(
        `https://prices.algotest.xyz/option-chain-with-ltp?underlying=${item}`
      );

      if (optionChainResponse.data.options) {
        setOptionChain(optionChainResponse.data.options);
        setFutures(optionChainResponse.data.futures);
        setSelectedFuture({
          timestamp: Object.keys(optionChainResponse.data.futures)[0],
          close:
            optionChainResponse.data.futures[
              Object.keys(optionChainResponse.data.futures)[0]
            ].close,
        });
        setUnderlyingValue(optionChainResponse.data.cash.close);
        setIndiaVix(optionChainResponse.data.vix.close);
        setExpiries(Object.keys(optionChainResponse.data.options));
        setSelectedExpiry(Object.keys(optionChainResponse.data.options)[0]);
        setError("");
      } else {
        setError(`Unable to load data at this moment for ${item}.`);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load data at this moment.");
    }
  };

  return (
    <div className="bg-gray-200 h-screen">
      <Header />
      <ErrorMessage message={error} />

      <div className="flex w-full border-b-2 border-b-gray-300">
        <UnderlyingSelector
          underlying={underlying}
          underlyingValue={underlyingValue}
          isOpen={isDropdownOpen[1]}
          contracts={contracts}
          onToggle={() => toggleDropdown(1)}
          onSelect={handleUnderlying}
          expireValue={selectedExpiry}
        />

        <div className="w-2/5 md:w-1/2 flex">
          <FuturesSelector
            selectedFuture={selectedFuture}
            futures={futures}
            isOpen={isDropdownOpen[2]}
            onToggle={() => toggleDropdown(2)}
            onSelect={(timestamp, close) => {
              setSelectedFuture({ timestamp, close });
              toggleDropdown(2);
            }}
          />
          <VixDisplay indiaVix={indiaVix} />
        </div>
      </div>

      <ExpiryFilter
        expiries={expiries}
        selectedExpiry={selectedExpiry}
        handleChange={setSelectedExpiry}
      />

      <OptionChainTable
        optionChain={optionChain}
        selectedExpiry={selectedExpiry}
      />
    </div>
  );
};

export default App;
