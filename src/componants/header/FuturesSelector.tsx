import { SelectedFuture, OptionData } from "../types/types";
import arrow from "../../assets/arrow.svg";

interface FuturesSelectorProps {
  selectedFuture: SelectedFuture;
  futures: Record<string, OptionData>;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (timestamp: string, close: number) => void;
}

const FuturesSelector: React.FC<FuturesSelectorProps> = ({
  selectedFuture,
  futures,
  isOpen,
  onToggle,
  onSelect,
}) => (
  <div className="w-full md:w-3/5 p-4 border-l-2 border-l-gray-300 relative">
    <button
      onClick={onToggle}
      className="w-full text-left flex justify-between items-center"
    >
      {selectedFuture.timestamp && (
        <div>
          <div>FUT ({selectedFuture.timestamp})</div>
          <div>{selectedFuture.close}</div>
        </div>
      )}
      <div className="pointer-events-none">
        <img src={arrow} alt="" className="w-4 h-4" />
      </div>
    </button>
    {isOpen && (
      <div className="mt-2 p-2 left-0 bg-white border rounded shadow-lg absolute w-full">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Expiry</th>
              <th className="px-6 py-3">LTP</th>
              <th className="px-6 py-3">Lots</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(futures).map(([date, values]) => (
              <tr
                key={date}
                className="hover:bg-blue-50 whitespace-nowrap text-gray-900 text-center cursor-pointer"
                onClick={() => onSelect(date, values.close)}
              >
                <td className="px-6 py-4">{date}</td>
                <td className="px-6 py-4">{values.close}</td>
                <td className="px-6 py-4">
                  <button className="border border-blue-900 px-2 rounded-sm hover:bg-green-50 hover:text-green-600">
                    B
                  </button>
                  <button className="border border-blue-900 ml-2 px-2 rounded-sm hover:bg-red-50 hover:text-red-600">
                    S
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default FuturesSelector;
