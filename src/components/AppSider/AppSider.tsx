import { ClipboardCheck, FileText, IdCard, Plus } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
	{
		href: "/",
		label: "角色卡",
		description: "调查员创建与管理",
		icon: IdCard,
	},
	{
		href: "/simplify/",
		label: "简化卡",
		description: "调查员信息简化展示",
		icon: FileText,
	},
	{
		href: "/kpChecking/",
		label: "KP 审卡",
		description: "守秘人核查角色卡",
		icon: ClipboardCheck,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="grid gap-1 px-2 py-3">
					<div className="text-sm font-semibold uppercase tracking-widest">CoC Toolkit</div>
					<div className="text-xs text-muted-foreground">Keeper archive console</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>工作区</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_ITEMS.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton render={<a href={item.href} />}>
										<item.icon data-icon="inline-start" />
										<span>{item.label}</span>
									</SidebarMenuButton>
									<SidebarMenuAction title={item.description}>
										<Plus />
									</SidebarMenuAction>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="px-2 py-3 text-xs leading-relaxed text-muted-foreground">
					克苏鲁的呼唤第七版调查员档案工具
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
