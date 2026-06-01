import React from "react";
import { logger } from "../../lib/logger";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("React render error", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              The app encountered an unexpected error. Reload to continue working.
              Error details are saved to the app log file.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg overflow-auto max-h-36">
                {this.state.error.message}
              </pre>
            )}
            <button type="button" onClick={this.handleReload} className="btn-cta-primary">
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
