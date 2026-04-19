"use client";

import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import UploadRounded from "@mui/icons-material/UploadRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReadOnlyField from "@/components/ReadOnlyField/ReadOnlyField";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { convertCharacterJsonToSt } from "@/utils/jsonToSt";
import { useState } from "react";

export default function Header({
  onOpenInfo,
  readOnly,
}: {
  onOpenInfo: () => void;
  readOnly?: boolean;
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const storeReadOnly = useCharacterStore((state) => state.readOnly);
  const info = useCharacterStore((state) => state.info);
  const attrs = useCharacterStore((state) => state.attributes);
  const derived = useCharacterStore((state) => state.derived);
  const status = useCharacterStore((state) => state.currentStatus);
  const exportJSON = useCharacterStore((state) => state.exportJSON);
  const importJSON = useCharacterStore((state) => state.importJSON);
  const isReadOnly = readOnly ?? storeReadOnly;

  const conditions = [
    status.conditions.majorWound ? "重伤" : null,
    status.conditions.dying ? "濒死" : null,
    status.conditions.unconscious ? "昏迷" : null,
    status.conditions.tempInsanity ? "临时疯狂" : null,
    status.conditions.indefInsanity ? "不定疯狂" : null,
    status.conditions.permInsanity ? "永久疯狂" : null,
  ].filter(Boolean) as string[];

  const handleJsonToSt = () => {
    const json = exportJSON();
    const stInfo = convertCharacterJsonToSt(json);
    navigator.clipboard.writeText(stInfo).catch(() => {
      const el = document.createElement('textarea');
      el.value = stInfo;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setOpenSnackbar(true);
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${info.name || "character"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }
      importJSON(await file.text());
    };
    input.click();
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(23,29,27,0.96), rgba(15,20,18,0.96))",
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="outlined">
            已复制到剪切板
        </Alert>
      </Snackbar>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at right top, rgba(209,171,87,0.12), transparent 28%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(280px, 1.3fr) minmax(340px, 1fr) minmax(260px, 0.9fr)",
          },
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar
            src={info.portrait || undefined}
            sx={{
              width: 88,
              height: 88,
              bgcolor: alpha("#3fa17b", 0.22),
              color: "primary.main",
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <PersonRoundedIcon sx={{ fontSize: 42 }} />
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            {isReadOnly ? (
              <ReadOnlyField
                label="调查员"
                value={info.name}
                placeholder="未填写调查员姓名"
                onClick={onOpenInfo}
              />
            ) : (
              <TextField
                value={info.name}
                onClick={onOpenInfo}
                placeholder="调查员姓名"
                label="调查员"
                fullWidth
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                sx={{
                  cursor: "pointer",
                  "& .MuiInputBase-root": {
                    cursor: "pointer",
                  },
                  "& .MuiInputBase-input": {
                    cursor: "pointer",
                  },
                }}
              />
            )}

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.25, alignItems: "center" }}>
              <Chip label={info.occupation || "未设置职业"} color="secondary" variant="outlined" />
              <Chip label={info.era || "未设置时代"} variant="outlined" />
              {/* <Chip label={info.player || "未填写玩家"} variant="outlined" /> */}
              <Button variant="outlined" startIcon={<GetAppRoundedIcon />} onClick={handleImport}>
                导入人物卡
              </Button>
              <Button variant="contained" startIcon={<UploadRounded />} onClick={handleExport}>
                导出人物卡
              </Button>
              <Button variant="outlined" startIcon={<UploadRounded />} onClick={handleJsonToSt}>
                导出为骰娘可用格式
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: { xs: 2, md: 3 }, flexWrap: "wrap", justifyContent: "center" }}>
          <VitalGauge label="HP" current={status.currentHP} max={derived.maxHP} color="error.main" />
          <VitalGauge label="SAN" current={status.currentSAN} max={derived.maxSAN} color="info.main" />
          <VitalGauge label="MP" current={status.currentMP} max={derived.maxMP} color="primary.main" />
          <VitalGauge label="Luck" current={attrs.Luck} max={99} color="warning.main" />
        </Box>

        <Box sx={{ display: "grid", gap: 1.5 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {conditions.length > 0 ? (
              conditions.map((condition) => (
                <Chip
                  key={condition}
                  label={condition}
                  color={condition.includes("疯狂") || condition === "昏迷" ? "warning" : "error"}
                />
              ))
            ) : (
              <Chip label="状态稳定" color="success" variant="outlined" />
            )}
          </Box>

          <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            <MiniStat label="移动力 MOV" value={derived.MOV} />
            <MiniStat label="伤害加值 DB" value={derived.damageBonus} />
            <MiniStat label="体格 Build" value={derived.build} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function VitalGauge({ label, current, max, color }: { label: string; current: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;

  return (
    <Box sx={{ display: "grid", gap: 1, justifyItems: "center" }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" value={100} size={72} thickness={4} sx={{ color: alpha("#ffffff", 0.08) }} />
        <CircularProgress variant="determinate" value={pct} size={72} thickness={4} sx={{ color, position: "absolute", left: 0 }} />
        <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1, fontWeight: 700 }}>
              {current}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / {max}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ p: 1.25, borderRadius: 0.5, border: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: alpha("#0d1110", 0.45) }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );
}
