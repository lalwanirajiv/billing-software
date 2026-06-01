import {
  BaseDirectory,
  exists,
  mkdir,
  writeFile,
} from "@tauri-apps/plugin-fs";

const LOG_DIR = "logs";
const LOG_FILE = "logs/app.log";

function isTauri() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function formatDetail(detail) {
  if (detail == null) return "";
  if (detail instanceof Error) {
    return detail.stack || detail.message;
  }
  if (typeof detail === "string") return detail;
  try {
    return JSON.stringify(detail);
  } catch {
    return String(detail);
  }
}

function formatLogLine(level, message, detail) {
  const ts = new Date().toISOString();
  const extra = detail != null ? ` | ${formatDetail(detail)}` : "";
  return `[${ts}] [${level.toUpperCase()}] ${message}${extra}\n`;
}

async function appendToLogFile(line) {
  if (!isTauri()) return;

  try {
    if (!(await exists(LOG_DIR, { baseDir: BaseDirectory.AppConfig }))) {
      await mkdir(LOG_DIR, { baseDir: BaseDirectory.AppConfig, recursive: true });
    }

    await writeFile(LOG_FILE, line, {
      baseDir: BaseDirectory.AppConfig,
      append: true,
    });
  } catch (err) {
    console.error("Failed to write log file:", err);
  }
}

export const logger = {
  debug(message, detail) {
    if (import.meta.env.DEV) {
      console.debug(message, detail ?? "");
    }
  },

  info(message, detail) {
    console.info(message, detail ?? "");
    void appendToLogFile(formatLogLine("info", message, detail));
  },

  warn(message, detail) {
    console.warn(message, detail ?? "");
    void appendToLogFile(formatLogLine("warn", message, detail));
  },

  error(message, detail) {
    console.error(message, detail ?? "");
    void appendToLogFile(formatLogLine("error", message, detail));
  },
};

export function installGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    logger.error("Uncaught error", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    logger.error("Unhandled promise rejection", event.reason);
  });
}
