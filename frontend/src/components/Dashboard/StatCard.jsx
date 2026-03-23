// StatCard.jsx
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, change, changeType, onClick }) => {
  const isPositive = changeType === "positive";

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col justify-between ${onClick ? "cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1" : ""}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </span>
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-2.5 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/20 transition-all">
          {Icon && <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {value}
        </h3>

        {/* Only show change if it's provided */}
        {change !== null &&
          change !== undefined &&
          changeType !== null &&
          changeType !== undefined && (
            <div
              className={`mt-1 flex items-center text-sm ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{change}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default StatCard;
