import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEFAULT_COMPANY_SETTINGS,
  getCompanySettings,
} from "../lib/companySettings";
import { logger } from "../lib/logger";

const CompanySettingsContext = createContext(null);

export function CompanySettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_COMPANY_SETTINGS);
  const [loading, setLoading] = useState(true);

  const reloadSettings = useCallback(async () => {
    try {
      const data = await getCompanySettings();
      setSettings(data);
    } catch (error) {
      logger.error("Failed to load company settings", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadSettings();
  }, [reloadSettings]);

  const setupCompleted = Boolean(settings.setup_completed);

  return (
    <CompanySettingsContext.Provider
      value={{ settings, loading, setupCompleted, reloadSettings }}
    >
      {children}
    </CompanySettingsContext.Provider>
  );
}

export function useCompanySettings() {
  const context = useContext(CompanySettingsContext);
  if (!context) {
    throw new Error("useCompanySettings must be used within CompanySettingsProvider");
  }
  return context;
}
