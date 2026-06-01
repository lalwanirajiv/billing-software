import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getAvailableFinancialYears } from '../lib/api';
import {
  getCurrentFyStartYear,
  getFyRangeFromStartYear,
} from '../lib/financialYear';
import { logger } from '../lib/logger';

const STORAGE_KEY = 'billing-selected-fy-start-year';

const FinancialYearContext = createContext(null);

export function FinancialYearProvider({ children }) {
  const [availableYears, setAvailableYears] = useState(() => [
    getFyRangeFromStartYear(getCurrentFyStartYear()),
  ]);
  const [selectedStartYear, setSelectedStartYear] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    return Number.isNaN(parsed) ? getCurrentFyStartYear() : parsed;
  });
  const [loading, setLoading] = useState(true);

  const refreshAvailableYears = useCallback(async () => {
    try {
      const res = await getAvailableFinancialYears();
      const list = res.data || [];
      if (list.length > 0) {
        setAvailableYears(list);
        setSelectedStartYear((prev) => {
          if (list.some((fy) => fy.startYear === prev)) return prev;
          const current = list.find((fy) => fy.isCurrent);
          return current?.startYear ?? list[0].startYear;
        });
      }
    } catch (error) {
      logger.error('Failed to load financial years', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAvailableYears();
  }, [refreshAvailableYears]);

  const selectedFy = useMemo(
    () =>
      availableYears.find((fy) => fy.startYear === selectedStartYear) ??
      getFyRangeFromStartYear(selectedStartYear),
    [availableYears, selectedStartYear]
  );

  const setSelectedFyStartYear = useCallback((startYear) => {
    setSelectedStartYear(startYear);
    localStorage.setItem(STORAGE_KEY, String(startYear));
  }, []);

  const value = useMemo(
    () => ({
      loading,
      availableYears,
      selectedFy,
      selectedStartYear,
      startDate: selectedFy.startDate,
      endDate: selectedFy.endDate,
      label: selectedFy.label,
      isCurrentFy: selectedFy.isCurrent,
      setSelectedFyStartYear,
      refreshAvailableYears,
    }),
    [
      loading,
      availableYears,
      selectedFy,
      selectedStartYear,
      setSelectedFyStartYear,
      refreshAvailableYears,
    ]
  );

  return (
    <FinancialYearContext.Provider value={value}>
      {children}
    </FinancialYearContext.Provider>
  );
}

export function useFinancialYear() {
  const ctx = useContext(FinancialYearContext);
  if (!ctx) {
    throw new Error('useFinancialYear must be used within FinancialYearProvider');
  }
  return ctx;
}
