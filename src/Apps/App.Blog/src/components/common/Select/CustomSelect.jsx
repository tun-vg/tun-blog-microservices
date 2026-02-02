import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function CustomSelect({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    options.find(opt => opt.isSelect)?.label || ""
  );


  return (
    <button className="relative w-48 text-left">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center border border-gray-400 rounded-md px-3 py-2 cursor-pointer bg-white"
      >
        <span>{selected}</span>
        <IoIosArrowDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full border border-gray-400 rounded-md bg-white shadow-md z-10">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
