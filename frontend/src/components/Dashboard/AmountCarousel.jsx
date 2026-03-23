import React, { useState, useEffect } from "react";
import { DollarSign, ChevronRight, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AmountCarousel({ stats }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const amountItems = [
    {
      label: "Overdue Amount",
      value: stats.overdueAmount,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      change: stats.overdueAmountChange,
    },
    {
      label: "Due Amount",
      value: stats.dueAmount,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      change: null,
    },
    {
      label: "Paid Amount",
      value: stats.paidAmount,
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      change: null,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % amountItems.length);
    }, 4500); // Slightly different timing from the status carousel
    return () => clearInterval(timer);
  }, [amountItems.length]);

  const currentItem = amountItems[currentIndex];
  const Icon = currentItem.icon;

  return (
    <div 
      className={`group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-xl ${currentItem.bgColor} transition-colors duration-500`}>
            <Icon size={24} className={`${currentItem.color} transition-colors duration-500`} />
          </div>
          {currentItem.change !== null && (
            <div className={`flex items-center space-x-1 text-xs font-medium ${currentItem.change >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {currentItem.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(currentItem.change)}%</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="overflow-hidden h-6">
            <p 
              key={currentIndex + "-label"}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider animate-in slide-in-from-bottom-full duration-500"
            >
              {currentItem.label}
            </p>
          </div>
          <div className="overflow-hidden h-10 flex items-baseline gap-2">
            <h3 
              key={currentIndex + "-value"}
              className="text-3xl font-bold text-gray-900 dark:text-white animate-in slide-in-from-bottom-full duration-500"
            >
              ₹{Number(currentItem.value).toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-4">
          {amountItems.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentIndex ? "w-6 bg-indigo-600" : "w-1.5 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Animated background decoration */}
      <div 
        className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 transition-colors duration-500 ${currentItem.bgColor}`} 
      />
    </div>
  );
}
