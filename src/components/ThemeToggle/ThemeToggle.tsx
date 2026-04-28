"use client";

import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { APP_THEMES, type AppThemeValue } from "@/components/ThemeProvider/theme-options";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FALLBACK_THEME: AppThemeValue = "theme-archive";

export function ThemeToggle({ showLabel = true }: { showLabel?: boolean }) {
	const { theme, setTheme } = useTheme();

	const currentTheme = APP_THEMES.some((item) => item.value === theme)
		? (theme as AppThemeValue)
		: FALLBACK_THEME;
	const currentMeta = useMemo(
		() => APP_THEMES.find((item) => item.value === currentTheme) ?? APP_THEMES[0],
		[currentTheme],
	);

	return (
		<Select value={currentTheme} onValueChange={(value) => setTheme(value as AppThemeValue)}>
			<SelectTrigger
				size="sm"
				title={`当前主题：${currentMeta.label}`}
				className={cn(
					"border border-border/70 bg-background/55 px-3 shadow-xs hover:bg-muted/70",
					showLabel ? "w-44" : "w-11 justify-center px-2",
				)}>
				<Palette data-icon="inline-start" />
				<SelectValue className={showLabel ? "" : "sr-only"} />
			</SelectTrigger>
			<SelectContent align="end" className="min-w-52">
				<SelectGroup>
					<SelectLabel>界面主题</SelectLabel>
					{APP_THEMES.map((item) => {
						const Icon = item.icon;

						return (
							<SelectItem key={item.value} value={item.value}>
								<Icon data-icon="inline-start" />
								<span className="grid gap-0.5">
									<span>{item.label}</span>
									<span className="text-xs text-muted-foreground">{item.description}</span>
								</span>
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
