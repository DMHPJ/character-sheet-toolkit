"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { APP_THEMES, THEME_CLASS_VALUES, type AppThemeValue } from "@/components/ThemeProvider/theme-options";

const STORAGE_KEY = "character-sheet-toolkit-theme";
const THEME_CHANGE_EVENT = "character-sheet-toolkit-theme-change";
const DEFAULT_THEME: AppThemeValue = "theme-archive";
const DARK_THEMES = new Set<AppThemeValue>(["theme-abyss", "theme-obsidian-cinnabar"]);

type ThemeContextValue = {
	theme: AppThemeValue;
	resolvedTheme: "light" | "dark";
	themes: AppThemeValue[];
	setTheme: (theme: AppThemeValue) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isAppTheme(value: string | null): value is AppThemeValue {
	return APP_THEMES.some((item) => item.value === value);
}

function getStoredTheme() {
	try {
		const storedTheme = window.localStorage.getItem(STORAGE_KEY);

		return isAppTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
	} catch {
		return DEFAULT_THEME;
	}
}

function subscribeThemeChange(callback: () => void) {
	function handleStorageChange(event: StorageEvent) {
		if (event.key === STORAGE_KEY) {
			callback();
		}
	}

	window.addEventListener("storage", handleStorageChange);
	window.addEventListener(THEME_CHANGE_EVENT, callback);

	return () => {
		window.removeEventListener("storage", handleStorageChange);
		window.removeEventListener(THEME_CHANGE_EVENT, callback);
	};
}

function applyThemeClass(theme: AppThemeValue) {
	const root = document.documentElement;

	root.classList.remove(...THEME_CLASS_VALUES);
	root.classList.add(theme);
	root.style.colorScheme = DARK_THEMES.has(theme) ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const theme = useSyncExternalStore(subscribeThemeChange, getStoredTheme, () => DEFAULT_THEME);

	useEffect(() => {
		applyThemeClass(theme);
	}, [theme]);

	const setTheme = useCallback((nextTheme: AppThemeValue) => {
		window.localStorage.setItem(STORAGE_KEY, nextTheme);
		window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
	}, []);

	const value = useMemo<ThemeContextValue>(
		() => ({
			theme,
			resolvedTheme: DARK_THEMES.has(theme) ? "dark" : "light",
			themes: APP_THEMES.map((item) => item.value),
			setTheme,
		}),
		[theme, setTheme],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
}
