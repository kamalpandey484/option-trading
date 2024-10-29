import { useRef, useState } from "react";
interface ExpiryFilterProps {
  expiries: string[];
  selectedExpiry: string;
  handleChange: (expiry: string) => void;
}

const ExpiryFilter: React.FC<ExpiryFilterProps> = ({
  expiries,
  selectedExpiry,
  handleChange,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container instanceof HTMLDivElement) {
      container.scrollBy({
        left: -150,
        behavior: "smooth",
      });
      setScrollPosition(container.scrollLeft);
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container instanceof HTMLDivElement) {
      container.scrollBy({
        left: 150,
        behavior: "smooth",
      });
      setScrollPosition(container.scrollLeft);
    }
  };

  const expiryStyle = "bg-blue-100 font-semibold text-blue-900";
  return (
    <div className="w-full flex justify-between">
      <button
        className={`hidden md:flex items-center justify-center h-full p-4`}
        onClick={scrollLeft}
      >
        &lt;
      </button>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto md:overflow-hidden whitespace-nowrap px-10 py-2 scroll-smooth snap-x"
      >
        {expiries.map((expiry, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-2 rounded-md snap-start ${
              expiry === selectedExpiry ? expiryStyle : ""
            }`}
            onClick={() => handleChange(expiry)}
          >
            {expiry}
          </button>
        ))}
      </div>

      <button
        className={`hidden md:flex items-center justify-center h-full p-4`}
        onClick={scrollRight}
      >
        &gt;
      </button>
    </div>
  );
};

export default ExpiryFilter;
