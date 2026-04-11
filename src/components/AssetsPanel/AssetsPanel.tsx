"use client";

import { Alert, Box, Chip, Paper, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { Assets } from "@/types/character";

const MAIN_FIELDS: { key: keyof Assets; label: string; type?: "number"; multiline?: boolean; minRows?: number }[] = [
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

export default function AssetsPanel() {
  const assets = useCharacterStore((state) => state.assets);
  const updateAsset = useCharacterStore((state) => state.updateAsset);

  const totalAssetValue =
    assets.vehiclesValue +
    assets.residencesValue +
    assets.luxuriesValue +
    assets.securitiesValue +
    assets.otherValue;

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
        }}>
        <MetricCard label="信用评级" value={String(assets.creditRating)} />
        <MetricCard label="当前现金" value={`${assets.currentCash || 0} ${assets.currency || ""}`.trim()} />
        <MetricCard label="资产总和" value={String(totalAssetValue)} />
      </Box>

      <Paper sx={{ p: 2.5, backgroundColor: alpha("#0d1110", 0.26) }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            资产概览
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            }}>
            {MAIN_FIELDS.map(({ key, label, type, multiline, minRows }) => (
              <TextField
                key={String(key)}
                label={label}
                type={type ?? "text"}
                value={assets[key] ?? ""}
                onChange={(event) =>
                  updateAsset(key, type === "number" ? Number(event.target.value) || 0 : event.target.value)
                }
                fullWidth
                size="small"
                multiline={multiline}
                minRows={minRows}
                disabled={key === "creditRating"}
              />
            ))}
          </Box>
          <TextField
            key={String("overviews")}
            label={"资产概览"}
            type={"text"}
            value={assets["overviews"] ?? ""}
            onChange={(event) =>
              updateAsset("overviews", event.target.value)
            }
            fullWidth
            size="small"
            multiline={true}
            minRows={3}
          />

          <Alert
            severity="info"
            sx={{
              alignItems: "flex-start",
              border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.24)}`,
              backgroundColor: (theme) => alpha(theme.palette.info.main, 0.08),
            }}>
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography variant="subtitle2">信用评级参考</Typography>
              <Typography variant="body2">{getCreditRatingHint(assets.creditRating)}</Typography>
            </Box>
          </Alert>
        </Box>
      </Paper>

      <Paper sx={{ p: 2.5, backgroundColor: alpha("#0d1110", 0.26) }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                其他资产表
              </Typography>
              <Typography variant="body2" color="text.secondary">
                对应原型中的交通工具、住所、奢侈品、股票证券和其他资产区域
              </Typography>
            </Box>
            <Chip label={`资产总和 ${totalAssetValue}`} color="primary" variant="outlined" />
          </Box>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            {DETAIL_FIELDS.map(({ textKey, valueKey, label, placeholder }) => (
              <Box
                key={String(textKey)}
                sx={{
                  display: "grid",
                  gap: 1.25,
                  gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 180px" },
                  alignItems: "start",
                }}>
                <TextField
                  label={label}
                  placeholder={placeholder}
                  value={assets[textKey] ?? ""}
                  onChange={(event) => updateAsset(textKey, event.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                />
                <TextField
                  label={`${label}价值`}
                  type="number"
                  value={assets[valueKey] || ""}
                  onChange={(event) => updateAsset(valueKey, Number(event.target.value) || 0)}
                  fullWidth
                  size="small"
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper sx={{ p: 2, backgroundColor: alpha("#0d1110", 0.26) }}>
      <Box sx={{ display: "grid", gap: 0.75 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6">{value || "—"}</Typography>
      </Box>
    </Paper>
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
