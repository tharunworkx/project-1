import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;