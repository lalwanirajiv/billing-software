import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-4 ${className}`}
    >
      <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">Back</span>
    </button>
  );
};
