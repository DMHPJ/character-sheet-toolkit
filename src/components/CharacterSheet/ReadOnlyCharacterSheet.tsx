"use client";

import AttributePanel from "@/components/AttributePanel/AttributePanel";
import AssetsPanel from "@/components/AssetsPanel/AssetsPanel";
import CombatPanel from "@/components/CombatPanel/CombatPanel";
import SkillTable from "@/components/SkillTable/SkillTable";
import type { CharacterStoreSnapshot } from "@/stores/useCharacterStore";

export default function ReadOnlyCharacterSheet({
	store,
}: {
	store?: CharacterStoreSnapshot;
}) {
	return (
		<div className="grid gap-4">
			<AttributePanel readOnly={true} store={store} />
			<SkillTable readOnly={true} store={store} />
			<CombatPanel readOnly={true} store={store} />
			<AssetsPanel readOnly={true} store={store} />
		</div>
	);
}
