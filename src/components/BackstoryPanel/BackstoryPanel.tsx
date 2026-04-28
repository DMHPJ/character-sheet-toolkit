"use client";

import { BookOpen } from "lucide-react";
import { TextAreaInput } from "@/components/SheetPrimitives/SheetPrimitives";
import ReadOnlyField from "@/components/ReadOnlyField/ReadOnlyField";
import { useCharacterStore } from "@/stores/useCharacterStore";

const STORY_FIELDS = [
	{ key: "personalDescription" as const, label: "个人描述 / 外貌", rows: 2 },
	{ key: "ideologyBeliefs" as const, label: "思想与信念", rows: 2 },
	{ key: "significantPeople" as const, label: "重要之人", rows: 2 },
	{ key: "meaningfulLocations" as const, label: "意义非凡之地", rows: 2 },
	{ key: "treasuredPossessions" as const, label: "宝贵之物", rows: 2 },
	{ key: "traits" as const, label: "特质", rows: 2 },
	{ key: "injuriesScars" as const, label: "伤口与疤痕", rows: 2 },
	{ key: "phobiasManias" as const, label: "恐惧症与狂躁症", rows: 2 },
	{ key: "overviews" as const, label: "概述", rows: 8 },
] as const;

export default function BackstoryPanel({ readOnly }: { readOnly?: boolean }) {
	const storeReadOnly = useCharacterStore((state) => state.readOnly);
	const backstory = useCharacterStore((state) => state.backstory);
	const isReadOnly = readOnly ?? storeReadOnly;

	return (
		<div className="grid min-w-0 gap-5">
			<div className="flex min-w-0 items-start gap-3">
				<BookOpen className="mt-0.5 text-primary" />
				<div className="grid min-w-0 gap-1">
					<h2 className="text-base font-semibold uppercase tracking-widest">背景故事</h2>
					<p className="text-sm text-muted-foreground">
						把人物的动机、关系和创伤都记录下来，方便在跑团中快速代入
					</p>
				</div>
			</div>

			<div className="grid min-w-0 gap-3">
				{STORY_FIELDS.map(({ key, label, rows }) =>
					isReadOnly ? (
						<ReadOnlyField key={key} label={label} value={backstory[key]} multiline minHeight={rows * 24 + 20} />
					) : (
						<TextAreaInput
							key={key}
							label={label}
							value={backstory[key]}
							onChange={(event) => {
								useCharacterStore.setState((state) => ({
									backstory: { ...state.backstory, [key]: event.target.value },
								}));
							}}
							rows={rows}
						/>
					),
				)}
			</div>
		</div>
	);
}
