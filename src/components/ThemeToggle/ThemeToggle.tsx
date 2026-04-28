"use client";

import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const THEMES = ["light", "dark", "system"] as const;

const THEME_META = {
	light: { label: "浅色", icon: Sun },
	dark: { label: "深色", icon: Moon },
	system: { label: "系统", icon: MonitorCog },
};

export function ThemeToggle({ showLabel = true }: { showLabel?: boolean }) {
	const { theme, setTheme } = useTheme();

	const currentTheme = THEMES.includes(theme as (typeof THEMES)[number])
		? (theme as (typeof THEMES)[number])
		: "light";
	const Icon = THEME_META[currentTheme].icon;

	const toggleTheme = () => {
		const currentIndex = THEMES.indexOf(currentTheme);
		setTheme(THEMES[(currentIndex + 1) % THEMES.length]);
	};

	return (
		<Button
			type="button"
			variant="outline"
			size={showLabel ? "sm" : "icon-sm"}
			onClick={toggleTheme}
			title={`当前主题：${THEME_META[currentTheme].label}`}>
			<Icon data-icon="inline-start" />
			{showLabel ? <span>主题：{THEME_META[currentTheme].label}</span> : <span className="sr-only">切换主题</span>}
		</Button>
	);
}
