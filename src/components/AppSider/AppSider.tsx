"use client";

import { ClipboardCheck, FileText, Gavel, IdCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{
		href: "/",
		label: "角色卡",
		description: "调查员创建、属性推演与技能分配",
		badge: "主流程",
		code: "01",
		icon: IdCard,
	},
	{
		href: "/simplify",
		label: "简化卡",
		description: "快速展示调查员核心资料",
		badge: "只读",
		code: "02",
		icon: FileText,
	},
	{
		href: "/combatList",
		label: "武器列表",
		description: "已有的武器内容列表",
		badge: "资料",
		code: "03",
		icon: Gavel,
	},
	{
		href: "/kpChecking",
		label: "KP 审卡",
		description: "守秘人核查角色卡合法性",
		badge: "核查",
		code: "04",
		icon: ClipboardCheck,
	},
];

function normalizePath(path: string) {
	return path === "/" ? path : path.replace(/\/$/, "");
}

function isRouteActive(pathname: string, href: string) {
	const currentPath = normalizePath(pathname);
	const targetPath = normalizePath(href);

	return targetPath === "/" ? currentPath === "/" : currentPath.startsWith(targetPath);
}

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar
			collapsible="icon"
			className="border-sidebar-border/80 bg-[radial-gradient(circle_at_18%_0%,color-mix(in_oklab,var(--sidebar-primary)_18%,transparent),transparent_9rem),linear-gradient(180deg,color-mix(in_oklab,var(--sidebar)_92%,var(--sidebar-primary)),var(--sidebar)_38%)]">
			<SidebarHeader className="gap-3 border-b border-sidebar-border/70 bg-transparent p-3 group-data-[collapsible=icon]:p-1.5">
				<div className="relative overflow-hidden border border-sidebar-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--sidebar-accent)_66%,transparent),transparent_62%),linear-gradient(180deg,color-mix(in_oklab,var(--sidebar)_88%,var(--sidebar-primary)),var(--sidebar))] p-3 shadow-sm group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
					<div className="grid ">
						{/* <Link
							href="/"
							aria-label="CoC 7th 调查员工具箱"
							className="flex size-10 shrink-0 items-center justify-center border border-sidebar-primary/60 bg-sidebar-primary text-sidebar-primary-foreground shadow-xs transition-colors hover:bg-sidebar-primary/90 group-data-[collapsible=icon]:size-8">
							<ScrollText data-icon="inline-start" />
						</Link> */}
						<div className="grid min-w-0 gap-2 pt-0.5 group-data-[collapsible=icon]:hidden">
							<div className="min-w-0">
								<div className="truncate font-serif text-lg font-semibold leading-none text-sidebar-foreground">
									CoC 7th
								</div>
								<div className="mt-1 truncate font-mono text-[11px] uppercase tracking-[0.22em] text-sidebar-primary">
									Investigator dossier
								</div>
							</div>
							<div className="flex items-center justify-between border-l border-sidebar-primary/45 pl-2 text-xs leading-relaxed text-sidebar-foreground/70">
								档案、车卡与审核
								<SidebarTrigger
									size="icon-xs"
									variant="outline"
									title="折叠侧边栏"
									className="cursor-pointer mt-0.5 shrink-0 border-sidebar-border/75 bg-sidebar/55 hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden"
								/>
							</div>
						</div>
					</div>
				</div>
				<SidebarTrigger
					size="icon-xs"
					variant="outline"
					title="展开侧边栏"
					className="cursor-pointer mx-auto hidden border-sidebar-border/75 bg-sidebar/55 hover:bg-sidebar-accent group-data-[collapsible=icon]:flex"
				/>
			</SidebarHeader>

			<SidebarContent className="bg-transparent px-2 py-3">
				<SidebarGroup className="p-0">
					<div className="mb-2 flex items-center gap-2 px-2 group-data-[collapsible=icon]:hidden">
						<SidebarGroupLabel className="h-auto px-0 text-[11px] tracking-[0.24em] text-sidebar-foreground/58">
							工作区
						</SidebarGroupLabel>
						<div className="h-px flex-1 bg-sidebar-border/65" />
					</div>
					<SidebarGroupContent>
						<SidebarMenu className="gap-1.5">
							{NAV_ITEMS.map((item) => {
								const active = isRouteActive(pathname, item.href);

								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											isActive={active}
											tooltip={item.description}
											render={
												<Link
													href={item.href}
													aria-current={active ? "page" : undefined}
													title={item.description}
												/>
											}
											className={cn(
												"h-18 items-stretch gap-0 overflow-visible border border-transparent bg-transparent p-0 text-sidebar-foreground hover:border-sidebar-border/70 hover:bg-sidebar-accent/55 hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-sidebar-border/50 group-data-[collapsible=icon]:p-0!",
												"data-active:border-sidebar-primary/55 data-active:bg-[linear-gradient(90deg,color-mix(in_oklab,var(--sidebar-primary)_18%,transparent),color-mix(in_oklab,var(--sidebar-accent)_62%,transparent))] data-active:shadow-[inset_3px_0_0_var(--sidebar-primary),0_10px_24px_-20px_var(--sidebar-primary)]",
											)}>
											<span className="flex h-full size-11 shrink-0 items-center justify-center border-r border-sidebar-border/55 text-sidebar-foreground/78 group-data-[collapsible=icon]:size-auto group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-sidebar-foreground group-data-[active=true]/menu-button:text-sidebar-primary">
												<item.icon data-icon="inline-start" />
											</span>
											<span className="grid min-w-0 flex-1 content-center gap-1 px-3 py-2 group-data-[collapsible=icon]:hidden">
												<span className="truncate text-sm font-semibold leading-none">
													{item.label}
												</span>
												<span className="line-clamp-2 text-xs leading-snug text-sidebar-foreground/64">
													{item.description}
												</span>
											</span>
											<span className="flex w-8 shrink-0 items-center justify-center border-l border-sidebar-border/40 font-mono text-[10px] text-sidebar-foreground/38 group-data-[collapsible=icon]:hidden group-data-[active=true]/menu-button:text-sidebar-primary/75">
												{item.code}
											</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="gap-3 border-t border-sidebar-border/70 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--sidebar-accent)_28%,transparent))] p-3">
				{/* <SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							tooltip="第七版规则支持"
							className="h-14 cursor-default gap-3 border border-sidebar-border/60 bg-sidebar/45 px-3 hover:bg-sidebar/45 hover:text-sidebar-foreground group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:border-sidebar-border/50 group-data-[collapsible=icon]:p-0!">
							<BookOpenText data-icon="inline-start" />
							<span className="grid min-w-0 gap-1 group-data-[collapsible=icon]:hidden">
								<span className="truncate text-sm font-semibold leading-none">CoC 7 规则集</span>
								<span className="truncate text-xs text-sidebar-foreground/62">属性 / 职业 / 资产</span>
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu> */}
				<SidebarSeparator className="mx-0" />
				<div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
					<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/42 group-data-[collapsible=icon]:hidden">
						Theme
					</span>
					<ThemeToggle showLabel={false} />
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
