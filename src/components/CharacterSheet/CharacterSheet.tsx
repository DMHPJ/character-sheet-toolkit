"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Landmark, ScrollText, ShieldAlert } from "lucide-react";
import AttributePanel from "@/components/AttributePanel/AttributePanel";
import AssetsPanel from "@/components/AssetsPanel/AssetsPanel";
import BackstoryPanel from "@/components/BackstoryPanel/BackstoryPanel";
import CombatPanel from "@/components/CombatPanel/CombatPanel";
import Header from "@/components/Header/Header";
import InfoPanel from "@/components/InfoPanel/InfoPanel";
import OccupationPanel from "@/components/OccupationPanel/OccupationPanel";
import SkillTable from "@/components/SkillTable/SkillTable";
import StatusPanel from "@/components/StatusPanel/StatusPanel";
import { Panel, StatusBadge } from "@/components/SheetPrimitives/SheetPrimitives";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharacterStore } from "@/stores/useCharacterStore";
import ReadOnlyCharacterSheet from "./ReadOnlyCharacterSheet";

type TabId = "status" | "backstory" | "combat" | "property";

const TABS = [
	{ id: "status", label: "状态", icon: ShieldAlert },
	{ id: "backstory", label: "背景故事", icon: ScrollText },
	{ id: "combat", label: "武器与携带物", icon: BriefcaseBusiness },
	{ id: "property", label: "资产", icon: Landmark },
] satisfies { id: TabId; label: string; icon: typeof ShieldAlert }[];

export default function CharacterSheet({ readOnly = false }: { readOnly?: boolean }) {
	const [activeTab, setActiveTab] = useState<TabId>("status");
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const derived = useCharacterStore((state) => state.derived);

	const tabContent = useMemo(() => {
		if (activeTab === "status") return <StatusPanel readOnly={readOnly} />;
		if (activeTab === "backstory") return <BackstoryPanel readOnly={readOnly} />;
		if (activeTab === "combat") return <CombatPanel readOnly={readOnly} />;
		return <AssetsPanel readOnly={readOnly} />;
	}, [activeTab, readOnly]);

	return (
		<div className="mx-auto grid min-h-[100svh] w-full min-w-0 max-w-[1800px] gap-5 p-2 sm:p-3 md:p-5 xl:p-6 2xl:h-[100svh] 2xl:grid-rows-[auto_minmax(0,1fr)] 2xl:overflow-hidden">
			<Header onOpenInfo={() => setInfoDialogOpen(true)} readOnly={readOnly} />
			{readOnly ? (
				<div className="2xl:min-h-0 2xl:overflow-y-auto 2xl:pr-1">
					<ReadOnlyCharacterSheet />
				</div>
			) : (
				<div className="grid min-w-0 gap-5 2xl:min-h-0 2xl:grid-cols-[minmax(360px,0.68fr)_minmax(0,1.55fr)] 2xl:overflow-hidden">
					<div className="flex min-w-0 flex-col gap-5 2xl:min-h-0 2xl:overflow-y-auto 2xl:pr-1">
						<div className="shrink-0">
							<AttributePanel readOnly={false} />
						</div>
						<div className="shrink-0">
							<OccupationPanel readOnly={false} />
						</div>

						<Panel
							title="状态、背景与扩展"
							description={`当前最大体力 ${derived.maxHP}，最大理智 ${derived.maxSAN}，最大魔法值 ${derived.maxMP}`}
							className="shrink-0 gap-0 data-[size=sm]:gap-0"
							contentClassName="pt-0"
							action={<StatusBadge tone="default">当前页签 {TABS.find((tab) => tab.id === activeTab)?.label}</StatusBadge>}>
							<Tabs
								value={activeTab}
								onValueChange={(value) => setActiveTab(value as TabId)}
								className="flex flex-col gap-2">
								<TabsList variant="line" className="flex h-10 w-full justify-start overflow-x-auto border-b border-border/60 p-0">
									{TABS.map((tab) => (
										<TabsTrigger key={tab.id} value={tab.id}>
											<tab.icon data-icon="inline-start" />
											{tab.label}
										</TabsTrigger>
									))}
								</TabsList>
								{TABS.map((tab) => (
									<TabsContent key={tab.id} value={tab.id} className="min-w-0">
										{activeTab === tab.id ? tabContent : null}
									</TabsContent>
								))}
							</Tabs>
						</Panel>
					</div>

					<SkillTable readOnly={false} className="2xl:min-h-0 gap-0 data-[size=sm]:gap-0" />
				</div>
			)}

			<Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
					<DialogHeader>
						<DialogTitle>调查员档案</DialogTitle>
					</DialogHeader>
					<div className="grid gap-5">
						<InfoPanel inDialog readOnly={readOnly} />
						<OccupationPanel inDialog readOnly={readOnly} />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
