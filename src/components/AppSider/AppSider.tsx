import { ClipboardCheck, FileText, IdCard, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
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
	SidebarRail,
	SidebarTrigger,
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
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<div className="flex items-start justify-between gap-2 px-2 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
					<div className="grid min-w-0 gap-1 group-data-[collapsible=icon]:hidden">
						<div className="truncate text-sm font-semibold uppercase tracking-widest">CoC Toolkit</div>
						<div className="truncate text-xs text-muted-foreground">Keeper archive console</div>
					</div>
					<SidebarTrigger
						size="icon-sm"
						variant="outline"
						title="收缩侧边栏"
						className="shrink-0"
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">工作区</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_ITEMS.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton render={<a href={item.href} title={item.description} />}>
										<item.icon data-icon="inline-start" />
										<span className="group-data-[collapsible=icon]:sr-only">{item.label}</span>
									</SidebarMenuButton>
									<SidebarMenuAction
										title={item.description}
										className="group-data-[collapsible=icon]:hidden">
										<Plus />
									</SidebarMenuAction>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="grid justify-items-start gap-3 px-2 py-3 group-data-[collapsible=icon]:justify-items-center group-data-[collapsible=icon]:px-0">
					<ThemeToggle showLabel={false} />
					<div className="text-xs leading-relaxed text-muted-foreground group-data-[collapsible=icon]:hidden">
						克苏鲁的呼唤第七版调查员档案工具
					</div>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
