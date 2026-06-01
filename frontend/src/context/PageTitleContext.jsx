import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMeta } from '../lib/pageMeta';

const PageTitleContext = createContext(null);

export function PageTitleProvider({ children }) {
  const { pathname } = useLocation();
  const [overrideTitle, setOverrideTitle] = useState(null);

  // Reset custom title when navigating to a new screen
  useEffect(() => {
    setOverrideTitle(null);
  }, [pathname]);

  const routeMeta = useMemo(() => getPageMeta(pathname), [pathname]);
  const title = overrideTitle || routeMeta.title;

  const setPageTitle = useCallback((next) => {
    setOverrideTitle(next || null);
  }, []);

  const value = useMemo(
    () => ({
      ...routeMeta,
      title,
      routeTitle: routeMeta.title,
      setPageTitle,
    }),
    [routeMeta, title, setPageTitle]
  );

  return (
    <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const ctx = useContext(PageTitleContext);
  if (!ctx) {
    throw new Error('usePageTitle must be used within PageTitleProvider');
  }
  return ctx;
}
