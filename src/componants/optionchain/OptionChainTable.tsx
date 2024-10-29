interface Option {
  callPrice: number;
  strike: number;
  putPrice: number;
  token: string;
  [key: string]: any;
}

interface OptionData {
  call: Option[];
  put: Option[];
  [key: string]: any; // For any additional properties at this level
}

interface OptionChainResponse {
  optionChain: {
    [expiryDate: string]: OptionData;
  };
  selectedExpiry: string;
}

const OptionChainTable: React.FC<OptionChainResponse> = ({
  optionChain,
  selectedExpiry,
}) => {
  console.log("OPtion chain-->", optionChain[`${selectedExpiry}`]);
  console.log("selectedExpiry chain-->", selectedExpiry);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-100">
        <thead>
          <tr className="bg-gray-200 border border-gray-300">
            <th className="py-2 px-4 border-b">Call Price</th>
            <th className="py-2 px-4 border-b">Strike</th>
            <th className="py-2 px-4 border-b">Put Price</th>
          </tr>
        </thead>
        <tbody>
          {optionChain[selectedExpiry]?.strike?.map((_: any, index: number) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b">
                {optionChain[selectedExpiry].call_close[index] || "---"}
              </td>
              <td className="py-2 px-4 border-b">
                {optionChain[selectedExpiry].strike[index] || "---"}
              </td>
              <td className="py-2 px-4 border-b">
                {optionChain[selectedExpiry].put_close[index] || "---"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OptionChainTable;
