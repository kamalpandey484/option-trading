interface VixDisplayProps {
  indiaVix: number;
}

const VixDisplay: React.FC<VixDisplayProps> = ({ indiaVix }) => (
  <div className="hidden md:block md:w-2/5 sm:w-0 p-4 border-l-2 border-l-gray-300">
    <div>
      <div>India VIX</div>
      <div>{indiaVix}</div>
    </div>
  </div>
);

export default VixDisplay;
