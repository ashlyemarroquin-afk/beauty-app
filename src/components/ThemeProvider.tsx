import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Appearance, ColorSchemeName } from "react-native";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const getEffectiveTheme = (): "light" | "dark" => {
      if (theme === "system") {
        const systemTheme = Appearance.getColorScheme();
        return systemTheme === "dark" ? "dark" : "light";
      }
      return theme;
    };

    const effectiveTheme = getEffectiveTheme();
    setActualTheme(effectiveTheme);
  }, [theme]);

  useEffect(() => {
    if (theme === "system") {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setActualTheme(colorScheme === "dark" ? "dark" : "light");
      });

      return () => subscription.remove();
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // In React Native, you might want to use AsyncStorage to persist theme
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // AsyncStorage.setItem('bookshelf-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
