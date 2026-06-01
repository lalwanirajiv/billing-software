import useDocumentTitle from '../hooks/useDocumentTitle';

/** Keeps document / window title in sync with the current route. */
export default function TitleUpdater() {
  useDocumentTitle();
  return null;
}
