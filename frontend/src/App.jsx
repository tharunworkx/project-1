import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <ToastProvider>
            <TooltipProvider>
              <AppRoutes />
            </TooltipProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;