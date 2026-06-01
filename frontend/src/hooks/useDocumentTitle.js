import { useEffect } from 'react';
import { useCompanySettings } from '../context/CompanySettingsContext';
import { usePageTitle } from '../context/PageTitleContext';
import { buildDocumentTitle } from '../lib/pageMeta';

async function setTauriWindowTitle(title) {
  try {
    const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
    const appWindow = getCurrentWebviewWindow();
    if (appWindow) {
      await appWindow.setTitle(title);
    }
  } catch {
    // Not in Tauri
  }
}

/** Syncs browser tab + Tauri window title with the active screen. */
export default function useDocumentTitle() {
  const { title } = usePageTitle();
  const { settings } = useCompanySettings();
  const fullTitle = buildDocumentTitle(title, settings?.company_name);

  useEffect(() => {
    document.title = fullTitle;
    setTauriWindowTitle(fullTitle);
  }, [fullTitle]);
}
