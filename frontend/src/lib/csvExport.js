import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

function isTauri() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function browserDownload(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Prompt for a save location (Tauri) or trigger a browser download (web preview).
 * @returns {{ cancelled?: boolean, success?: boolean, path?: string }}
 */
export async function saveCsvFile(csvContent, defaultFileName, options = {}) {
  const { title = "Save CSV file" } = options;
  const fileName = defaultFileName.endsWith(".csv")
    ? defaultFileName
    : `${defaultFileName}.csv`;

  if (isTauri()) {
    const filePath = await save({
      filters: [{ name: "CSV", extensions: ["csv"] }],
      defaultPath: fileName,
      title,
    });

    if (!filePath) {
      return { cancelled: true };
    }

    await writeFile(filePath, new TextEncoder().encode(csvContent));
    return { success: true, path: filePath };
  }

  browserDownload(csvContent, fileName);
  return { success: true };
}
