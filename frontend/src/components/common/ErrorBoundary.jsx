import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef] p-6">
          <div className="max-w-md rounded-2xl border border-[#e7e3da] bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              ⚠️
            </div>
            <h2 className="text-lg font-semibold text-[#172b35]">Something went wrong</h2>
            <p className="mt-2 text-xs text-[#718087]">
              {this.state.error?.message || "An unexpected error occurred while rendering this page."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-5 rounded-xl bg-[#102522] px-4 py-2 text-xs font-medium text-white hover:bg-[#1a3834] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
