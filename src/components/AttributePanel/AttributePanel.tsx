"use client";

import { Box, Chip, Paper, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReadOnlyField from "@/components/ReadOnlyField/ReadOnlyField";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { AttributeKey } from "@/types/character";

const ATTR_META: { key: AttributeKey; label: string; en: string }[] = [
	{ key: "STR", label: "力量", en: "STR" },
	{ key: "DEX", label: "敏捷", en: "DEX" },
	{ key: "POW", label: "意志", en: "POW" },
	{ key: "CON", label: "体质", en: "CON" },
	{ key: "APP", label: "外貌", en: "APP" },
	{ key: "EDU", label: "教育", en: "EDU" },
	{ key: "SIZ", label: "体型", en: "SIZ" },
	{ key: "INT", label: "智力", en: "INT" },
	{ key: "Luck", label: "幸运", en: "Luck" },
];

function getAttrDescription(key: AttributeKey, value: number): string {
	if (value <= 0) return "尚未录入";
	const map: Record<AttributeKey, string[]> = {
		STR: ["体能非常薄弱", "力气偏弱", "常人水准", "力量出众", "足以称得上怪力"],
		DEX: ["动作迟缓", "不够灵活", "反应正常", "身手敏捷", "快得惊人"],
		POW: ["意志薄弱", "容易动摇", "自制力正常", "意志坚定", "近乎钢铁意志"],
		CON: ["经常抱恙", "体质较差", "健康正常", "体格强健", "异常耐久"],
		APP: ["不太起眼", "形象普通", "谈吐得体", "颇具魅力", "极具吸引力"],
		EDU: ["教育程度有限", "基础教育", "受过良好教育", "高等教育背景", "学识非常广博"],
		SIZ: ["体格瘦小", "偏小身材", "中等身材", "高大魁梧", "体型巨大"],
		INT: ["思考较慢", "理解力一般", "思维正常", "头脑聪明", "非常敏锐"],
		Luck: ["最近不太走运", "运势平平", "普通运气", "幸运加身", "命运偏爱"],
	};
	if (value <= 20) return map[key][0];
	if (value <= 40) return map[key][1];
	if (value <= 60) return map[key][2];
	if (value <= 80) return map[key][3];
	return map[key][4];
}

export default function AttributePanel({ readOnly }: { readOnly?: boolean }) {
	const storeReadOnly = useCharacterStore((state) => state.readOnly);
	const attributes = useCharacterStore((state) => state.attributes);
	const setAttribute = useCharacterStore((state) => state.setAttribute);
	const isReadOnly = readOnly ?? storeReadOnly;

	const totalPoints = ATTR_META.filter((attribute) => attribute.key !== "Luck").reduce(
		(sum, attribute) => sum + attributes[attribute.key],
		0,
	);

	return readOnly ? (
		<Box>
			<Box
				sx={{
					display: "grid",
					gap: 2,
					gridTemplateColumns: {
						xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
						lg: "repeat(4, minmax(0, 1fr))",
            xl: "repeat(5, minmax(0, 1fr))",
					},
          mb: 2,
				}}>
				{ATTR_META.map(({ key, label, en }) => {
					const value = attributes[key];
					const half = value > 0 ? Math.floor(value / 2) : "—";
					const fifth = value > 0 ? Math.floor(value / 5) : "—";

					return (
						<Box
							key={key}
							sx={{
								py: 1,
                px: 2,
								borderRadius: 0.5,
								border: (theme) => `1px solid ${theme.palette.divider}`,
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
							}}>
							<Box sx={{ display: "grid", gap: 1.75 }}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "baseline",
									}}>
                  <Box sx={{display: "flex", alignItems: "baseline", gap: 1}}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {en}
                    </Typography>
                  </Box>
									<Typography variant="caption" color="text.secondary">
										{value}/{half}/{fifth}
									</Typography>
								</Box>
							</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	) : (
		<Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: alpha("#171d1b", 0.84) }}>
			<Box sx={{ display: "grid", gap: 2.5 }}>
				<Box
					sx={{
						display: "flex",
						gap: 1.5,
						justifyContent: "space-between",
						flexDirection: { xs: "column", sm: "row" },
					}}>
					<Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
						核心属性
					</Typography>
					<Chip label={`总点数 ${totalPoints}`} color="primary" variant="outlined" />
				</Box>

				<Box
					sx={{
						display: "grid",
						gap: 2,
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(3, minmax(0, 1fr))",
							lg: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
						},
					}}>
					{ATTR_META.map(({ key, label, en }) => {
						const value = attributes[key];
						const half = value > 0 ? Math.floor(value / 2) : "—";
						const fifth = value > 0 ? Math.floor(value / 5) : "—";

						return (
							<Box
								key={key}
								sx={{
									p: 2,
									borderRadius: 0.5,
									border: (theme) => `1px solid ${theme.palette.divider}`,
									background:
										"linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
								}}>
								<Box sx={{ display: "grid", gap: 1.75 }}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "baseline",
										}}>
										<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
											{label}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{en}
										</Typography>
									</Box>

									{isReadOnly ? (
										<ReadOnlyField label={`${label}数值`} value={value || ""} />
									) : (
										<TextField
											type="number"
											value={value || ""}
											onChange={(event) => {
												const next = Number(event.target.value) || 0;
												setAttribute(key, Math.max(0, Math.min(99, next)));
											}}
											slotProps={{ htmlInput: { min: 0, max: 99 } }}
											fullWidth
											size="small"
										/>
									)}

									<Box
										sx={{
											display: "grid",
											gap: 1,
											gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
										}}>
										<DerivedBadge label="困难" value={half} />
										<DerivedBadge label="极限" value={fifth} />
									</Box>

									<Typography variant="body2" color="text.secondary">
										{getAttrDescription(key, value)}
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Box>
			</Box>
		</Paper>
	);
}

function DerivedBadge({ label, value }: { label: string; value: string | number }) {
	return (
		<Box
			sx={{
				borderRadius: 0.5,
				border: (theme) => `1px solid ${theme.palette.divider}`,
				px: 1.25,
				py: 1,
				backgroundColor: alpha("#0d1110", 0.4),
			}}>
			<Typography variant="caption" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body1" sx={{ fontWeight: 700 }}>
				{value}
			</Typography>
		</Box>
	);
}
