import * as React from "react";

const ThemeContext = React.createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem("theme") || defaultTheme;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
