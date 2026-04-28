"use client";

import {
	MetricTile,
	Notice,
	Panel,
	ReadOnlyBox,
	StatusBadge,
	SubPanel,
	TextAreaInput,
	TextInput,
} from "@/components/SheetPrimitives/SheetPrimitives";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { CharacterStoreSnapshot } from "@/stores/useCharacterStore";
import type { Assets } from "@/types/character";

const MAIN_FIELDS: {
	key: keyof Assets;
	label: string;
	type?: "number";
	multiline?: boolean;
	minRows?: number;
}[] = [
	{ key: "creditRating", label: "信用评级", type: "number" },
	{ key: "livingStandard", label: "生活水平" },
	{ key: "spendingLevel", label: "消费水平" },
	{ key: "otherAssets", label: "其他资产", multiline: true },
	{ key: "currentCash", label: "当前现金", type: "number" },
	{ key: "currency", label: "单位" },
];

const DETAIL_FIELDS: {
	textKey: keyof Assets;
	valueKey: keyof Assets;
	label: string;
	placeholder: string;
}[] = [
	{ textKey: "vehicles", valueKey: "vehiclesValue", label: "交通工具", placeholder: "汽车、摩托、船只" },
	{ textKey: "residences", valueKey: "residencesValue", label: "住所", placeholder: "公寓、别墅、乡间宅邸" },
	{ textKey: "luxuries", valueKey: "luxuriesValue", label: "奢侈品", placeholder: "珠宝、收藏品、名贵器材" },
	{ textKey: "securities", valueKey: "securitiesValue", label: "股票 / 证券", placeholder: "债券、股票、基金份额" },
	{ textKey: "other", valueKey: "otherValue", label: "其他", placeholder: "无法归类的额外资产" },
];

export default function AssetsPanel({
	readOnly,
	store,
}: {
	readOnly?: boolean;
	store?: CharacterStoreSnapshot;
}) {
	const globalReadOnly = useCharacterStore((state) => state.readOnly);
	const globalAssets = useCharacterStore((state) => state.assets);
	const globalUpdateAsset = useCharacterStore((state) => state.updateAsset);
	const storeReadOnly = store?.readOnly ?? globalReadOnly;
	const assets = store?.assets ?? globalAssets;
	const updateAsset = store?.updateAsset ?? globalUpdateAsset;
	const isReadOnly = readOnly ?? storeReadOnly;

	const totalAssetValue =
		assets.vehiclesValue +
		assets.residencesValue +
		assets.luxuriesValue +
		assets.securitiesValue +
		assets.otherValue;

	if (isReadOnly) {
		return (
			<div className="mb-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{MAIN_FIELDS.map((main) => (
					<ReadOnlyBox key={main.key} label={main.label} value={assets[main.key]} />
				))}
			</div>
		);
	}

	return (
		<div className="grid min-w-0 gap-4">
			<div className="grid min-w-0 gap-3 md:grid-cols-3">
				<MetricTile label="信用评级" value={String(assets.creditRating)} />
				<MetricTile label="当前现金" value={`${assets.currentCash || 0} ${assets.currency || ""}`.trim()} />
				<MetricTile label="资产总和" value={String(totalAssetValue)} />
			</div>

			<Panel title="资产概览">
				<div className="grid min-w-0 gap-4">
					<div className="grid min-w-0 gap-3 md:grid-cols-2">
						{MAIN_FIELDS.map(({ key, label, type, multiline, minRows }) =>
							multiline ? (
								<TextAreaInput
									key={String(key)}
									label={label}
									value={String(assets[key] ?? "")}
									onChange={(event) => updateAsset(key, event.target.value)}
									rows={minRows ?? 2}
									disabled={key === "creditRating"}
								/>
							) : (
								<TextInput
									key={String(key)}
									label={label}
									type={type ?? "text"}
									value={assets[key] ?? ""}
									onChange={(event) =>
										updateAsset(
											key,
											type === "number" ? Number(event.target.value) || 0 : event.target.value,
										)
									}
									disabled={key === "creditRating"}
								/>
							),
						)}
					</div>

					<TextAreaInput
						label="资产概览"
						value={assets.overviews ?? ""}
						onChange={(event) => updateAsset("overviews", event.target.value)}
						rows={3}
					/>

					<Notice title="信用评级参考">
						{getCreditRatingHint(assets.creditRating)}
					</Notice>
				</div>
			</Panel>

			<Panel
				title="其他资产表"
				description="对应交通工具、住所、奢侈品、股票证券和其他资产区域"
				action={<StatusBadge tone="default">资产总和 {totalAssetValue}</StatusBadge>}>
				<div className="grid min-w-0 gap-3">
					{DETAIL_FIELDS.map(({ textKey, valueKey, label, placeholder }) => (
						<SubPanel key={String(textKey)} className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
							<TextAreaInput
								label={label}
								placeholder={placeholder}
								value={String(assets[textKey] ?? "")}
								onChange={(event) => updateAsset(textKey, event.target.value)}
								rows={2}
							/>
							<TextInput
								label={`${label}价值`}
								type="number"
								value={assets[valueKey] || ""}
								onChange={(event) => updateAsset(valueKey, Number(event.target.value) || 0)}
							/>
						</SubPanel>
					))}
				</div>
			</Panel>
		</div>
	);
}

function getCreditRatingHint(creditRating: number): string {
	if (creditRating <= 0) {
		return "几乎没有可支配财产，生活与出行都需要极度节制";
	}
	if (creditRating <= 9) {
		return "勉强维持最基本生活，住处和交通方式都非常朴素";
	}
	if (creditRating <= 49) {
		return "属于常见市民阶层，能负担稳定生活，但难以长期挥霍";
	}
	if (creditRating <= 89) {
		return "生活条件优越，通常拥有体面的住处、交通工具和可观存款";
	}
	return "处于上流甚至巨富层级，足以支撑奢侈生活和大额资产配置";
}
