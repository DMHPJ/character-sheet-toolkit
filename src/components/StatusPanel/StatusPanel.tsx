"use client";

import { useEffect, useState } from "react";
import { Box, Button, LinearProgress, Paper, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCharacterStore } from "@/stores/useCharacterStore";

export default function StatusPanel({ readOnly }: { readOnly?: boolean }) {
  const storeReadOnly = useCharacterStore((state) => state.readOnly);
  const derived = useCharacterStore((state) => state.derived);
  const status = useCharacterStore((state) => state.currentStatus);
  const setCurrentHP = useCharacterStore((state) => state.setCurrentHP);
  const setCurrentMP = useCharacterStore((state) => state.setCurrentMP);
  const setCurrentSAN = useCharacterStore((state) => state.setCurrentSAN);
  const setCondition = useCharacterStore((state) => state.setCondition);
  const isReadOnly = readOnly ?? storeReadOnly;

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <StatBlock label="体力 HP" current={status.currentHP} max={derived.maxHP} extra={`重伤阈值 ${derived.majorWound}`} color="error.main" onChange={setCurrentHP} inGrid={false} readOnly={isReadOnly} />
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
        <StatBlock label="理智 SAN" current={status.currentSAN} max={derived.maxSAN} color="info.main" onChange={setCurrentSAN} inGrid readOnly={isReadOnly} />
        <StatBlock label="魔法 MP" current={status.currentMP} max={derived.maxMP} color="primary.main" onChange={setCurrentMP} inGrid readOnly={isReadOnly} />
      </Box>

      <Paper sx={{ p: 2.5, backgroundColor: alpha("#0d1110", 0.26) }}>
        <Box sx={{ display: "grid", gap: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            异常状态
          </Typography>
          <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" } }}>
            <ConditionToggle label="重伤" checked={status.conditions.majorWound} onChange={(value) => setCondition("majorWound", value)} color="error" disabled={isReadOnly} />
            <ConditionToggle label="昏迷" checked={status.conditions.unconscious} onChange={(value) => setCondition("unconscious", value)} color="warning" disabled={isReadOnly} />
            <ConditionToggle label="濒死" checked={status.conditions.dying} onChange={(value) => setCondition("dying", value)} color="error" disabled={isReadOnly} />
            <ConditionToggle label="临时疯狂" checked={status.conditions.tempInsanity} onChange={(value) => setCondition("tempInsanity", value)} color="warning" disabled={isReadOnly} />
            <ConditionToggle label="不定疯狂" checked={status.conditions.indefInsanity} onChange={(value) => setCondition("indefInsanity", value)} color="error" disabled={isReadOnly} />
            <ConditionToggle label="永久疯狂" checked={status.conditions.permInsanity} onChange={(value) => setCondition("permInsanity", value)} color="error" disabled={isReadOnly} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function StatBlock({ label, current, max, extra, color, onChange, inGrid, readOnly }: { label: string; current: number; max: number; extra?: string; color: string; onChange: (value: number) => void; inGrid: boolean; readOnly: boolean }) {
  const [draftCurrent, setDraftCurrent] = useState(String(current));
  const progress = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  const inputWidth = inGrid ? "4rem" : "12rem";

  useEffect(() => {
    setDraftCurrent(String(current));
  }, [current]);

  const commitCurrent = () => {
    const parsedValue = Number(draftCurrent);
    const nextValue = Number.isFinite(parsedValue) ? Math.min(max, Math.max(0, Math.floor(parsedValue))) : current;
    setDraftCurrent(String(nextValue));
    onChange(nextValue);
  };

  return (
    <Paper sx={{ p: 2.5, backgroundColor: alpha("#0d1110", 0.26) }}>
      <Box sx={{ display: "grid", gap: 1.5 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {label}
          </Typography>
          <Box sx={{ display: "flex", gap: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              最大值 {max}
            </Typography>
            {extra ? (
              <Typography variant="body2" color="text.secondary">
                {extra}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 999, backgroundColor: alpha("#ffffff", 0.08), "& .MuiLinearProgress-bar": { backgroundColor: color } }} />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "center" }}>
          <Button sx={{ minWidth: inGrid ? "1rem" : "64px" }} variant="outlined" onClick={() => onChange(Math.max(0, current - 1))} disabled={readOnly}>-1</Button>
          <TextField
            value={draftCurrent}
            onChange={(event) => {
              const nextValue = event.target.value;
              if (/^\d*$/.test(nextValue)) {
                setDraftCurrent(nextValue);
              }
            }}
            onBlur={commitCurrent}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            disabled={readOnly}
            size="small"
            sx={{
              width: inputWidth,
              "& .MuiInputBase-input": {
                py: 1,
                textAlign: "center",
              },
            }}
          />
          <Button sx={{ minWidth: inGrid ? "1rem" : "64px" }} variant="outlined" onClick={() => onChange(Math.min(max, current + 1))} disabled={readOnly}>+1</Button>
        </Box>
      </Box>
    </Paper>
  );
}

function ConditionToggle({ label, checked, onChange, color, disabled = false }: { label: string; checked: boolean; onChange: (value: boolean) => void; color: "error" | "warning"; disabled?: boolean }) {
  return (
    <Button variant={checked ? "contained" : "outlined"} color={color} onClick={() => onChange(!checked)} sx={{ justifyContent: "flex-start" }} disabled={disabled}>
      {label}
    </Button>
  );
}
