import { FileStack, MoonStar, RadioTower } from "lucide-react";

export const APP_THEMES = [
	{
		value: "theme-archive",
		label: "档案室",
		icon: FileStack,
	},
	{
		value: "theme-abyss",
		label: "午夜仪式",
		icon: MoonStar,
	},
	{
		value: "theme-telegram",
		label: "电报码",
		icon: RadioTower,
	},
] as const;

export const THEME_CLASS_VALUES = ["theme-archive", "theme-abyss", "theme-telegram"];

export type AppThemeValue = (typeof APP_THEMES)[number]["value"];
