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
		<div className="mx-auto grid w-full max-w-[1800px] gap-5 p-3 md:p-5">
			<Header onOpenInfo={() => setInfoDialogOpen(true)} readOnly={readOnly} />
			{readOnly ? (
				<ReadOnlyCharacterSheet />
			) : (
				<div className="grid gap-5 xl:grid-cols-[minmax(360px,0.68fr)_minmax(0,1.55fr)] xl:items-start">
					<div className="grid gap-5">
						<AttributePanel readOnly={false} />
						<OccupationPanel readOnly={false} />

						<Panel
							title="状态、背景与扩展"
							description={`当前最大体力 ${derived.maxHP}，最大理智 ${derived.maxSAN}，最大魔法值 ${derived.maxMP}`}
							action={<StatusBadge tone="default">当前页签 {TABS.find((tab) => tab.id === activeTab)?.label}</StatusBadge>}>
							<Tabs
								value={activeTab}
								onValueChange={(value) => setActiveTab(value as TabId)}
								className="flex flex-col gap-5">
								<TabsList variant="line" className="mb-5 flex w-full justify-start overflow-x-auto">
									{TABS.map((tab) => (
										<TabsTrigger key={tab.id} value={tab.id}>
											<tab.icon data-icon="inline-start" />
											{tab.label}
										</TabsTrigger>
									))}
								</TabsList>
								{TABS.map((tab) => (
									<TabsContent key={tab.id} value={tab.id}>
										{activeTab === tab.id ? tabContent : null}
									</TabsContent>
								))}
							</Tabs>
						</Panel>
					</div>

					<SkillTable readOnly={false} />
				</div>
			)}

			<Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
					<DialogHeader>
						<DialogTitle>调查员档案</DialogTitle>
						<DialogDescription>编辑基础身份与职业模板。</DialogDescription>
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
