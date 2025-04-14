import { FaInfoCircle } from "react-icons/fa";
import { ReactNode } from "react";

// 🔹 Displays a label and value in a row with an info icon
export const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b border-gray-200 p-2">
    <div className="flex items-left space-x-1">
      <span className="font-medium text-gray-500 leading-5">{label}:</span>
      <FaInfoCircle className="text-gray-400 text-xs" />
    </div>
    <span className="text-black">{value ? value : "-"}</span>
  </div>
);

// 🔹 Green button with optional icon
export const EditButton = ({
  label,
  icon,
}: {
  label: string;
  icon?: ReactNode;
}) => (
  <div className="flex space-x-2 mt-5">
    <button
      className="cursor-pointer bg-[#4BCC00] hover:drop-shadow-2xl text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-600 flex-1 flex items-center justify-center gap-2"
    >
      {label}
      {icon && <span>{icon}</span>}
    </button>
  </div>
);
