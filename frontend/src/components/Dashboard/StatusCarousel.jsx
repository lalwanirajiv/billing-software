import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";

export default function StatusCarousel({ stats }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const statusItems = [
    {
      label: "Invoices Due",
      value: stats.invoicesDue,
      status: "Due",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-100 dark:border-amber-800",
    },
    {
      label: "Invoices Overdue",
      value: stats.invoicesOverdue,
      status: "Overdue",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-100 dark:border-red-800",
    },
    {
      label: "Invoices Paid",
      value: stats.invoicesPaid,
      status: "Paid",
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-100 dark:border-emerald-800",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statusItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [statusItems.length]);

  const currentItem = statusItems[currentIndex];
  const Icon = currentItem.icon;

  return (
    <div 
      onClick={() => navigate(`/invoices?status=${currentItem.status}`)}
      className={`group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-400 dark:hover:border-indigo-500`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-xl ${currentItem.bgColor} transition-colors duration-500`}>
            <Icon size={24} className={`${currentItem.color} transition-colors duration-500`} />
          </div>
          <ChevronRight 
            size={20} 
            className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" 
          />
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
              {currentItem.value}
            </h3>
            <span className="text-xs font-medium text-gray-400 lowercase">invoices</span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-4">
          {statusItems.map((_, idx) => (
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
