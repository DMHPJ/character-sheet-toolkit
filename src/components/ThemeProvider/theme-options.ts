import { FileStack, MoonStar, RadioTower, Sparkles } from "lucide-react";

export const APP_THEMES = [
	{
		value: "theme-archive",
		label: "档案室",
		description: "泛黄卷宗、朱红标记与旧木桌面",
		icon: FileStack,
	},
	{
		value: "theme-abyss",
		label: "午夜仪式",
		description: "深海墨色、黄铜仪表与冷光读数",
		icon: MoonStar,
	},
	{
		value: "theme-telegram",
		label: "电报码",
		description: "打字纸、蓝黑油墨与红色批注",
		icon: RadioTower,
	},
	{
		value: "system",
		label: "跟随系统",
		description: "根据系统浅深色映射到档案室或午夜仪式",
		icon: Sparkles,
	},
] as const;

export const THEME_CLASS_VALUES = ["theme-archive", "theme-abyss", "theme-telegram", "light", "dark"];

export type AppThemeValue = (typeof APP_THEMES)[number]["value"];
