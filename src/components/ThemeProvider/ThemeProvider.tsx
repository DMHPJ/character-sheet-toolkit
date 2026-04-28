"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { THEME_CLASS_VALUES } from "@/components/ThemeProvider/theme-options";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="theme-archive"
			themes={THEME_CLASS_VALUES}
			enableSystem
			disableTransitionOnChange
			storageKey="character-sheet-toolkit-theme"
			{...props}>
			{children}
		</NextThemesProvider>
	);
}
