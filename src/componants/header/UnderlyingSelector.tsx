import { useEffect, useState } from "react";
import arrow from "../../assets/arrow.svg";

interface UnderlyingSelectorProps {
  underlying: string;
  underlyingValue: number;
  isOpen: boolean;
  contracts: Record<string, unknown>;
  onToggle: () => void;
  onSelect: (item: string) => void;
  expireValue: string;
}

const UnderlyingSelector: React.FC<UnderlyingSelectorProps> = ({
  underlying,
  underlyingValue,
  isOpen,
  contracts,
  onToggle,
  onSelect,
  expireValue,
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");
  const [underlyingValueData, setUnderlyingValueData] =
    useState<number>(underlyingValue);

  useEffect(() => {
    const wsConnection = new WebSocket(
      "wss://prices.algotest.xyz/mock/updates"
    );

    wsConnection.onopen = () => {
      setConnectionStatus("Connected");
      setWs(wsConnection);

      const testMessage = {
        msg: {
          type: "subscribe",
          datatypes: ["ltp"],
          underlyings: [
            {
              underlying: "BANKNIFTY",
              cash: true,
              options: [expireValue],
            },
          ],
        },
      };

      wsConnection.send(JSON.stringify(testMessage));
    };

    wsConnection.onmessage = (message) => {
      console.log("Received message:", message.data);
      const data = JSON.parse(message.data);

      // Update underlyingValue if "ltp" data is available
      if (data.ltp && data.ltp[0]) {
        setUnderlyingValueData(data.ltp[0].ltp);
      }
    };

    wsConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("Error");
    };

    wsConnection.onclose = (event) => {
      console.log("WebSocket closed:", event.reason);
      setConnectionStatus("Closed");
      setWs(null);
    };

    return () => wsConnection.close();
  }, []);

  return (
    <div className="w-3/5 md:w-1/2 p-4">
      <button
        onClick={onToggle}
        className="w-full text-left flex justify-between items-center"
      >
        <div>
          <div>{underlying}</div>
          <div>{underlyingValueData.toFixed(2)}</div>
        </div>
        <div className="pointer-events-none">
          <img src={arrow} alt="" className="w-4 h-4" />
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 py-4 left-0 bg-white border rounded shadow-lg absolute w-1/2">
          {Object.keys(contracts).map((item, index) => (
            <p
              className="p-1 cursor-pointer hover:bg-blue-50"
              key={index}
              onClick={() => onSelect(item)}
            >
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnderlyingSelector;
