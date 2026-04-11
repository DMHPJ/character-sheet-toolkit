'use client';

import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCharacterStore } from "@/stores/useCharacterStore";

export default function StatusPanel() {
  const derived = useCharacterStore((s) => s.derived);
  const status = useCharacterStore((s) => s.currentStatus);
  const setCurrentHP = useCharacterStore((s) => s.setCurrentHP);
  const setCurrentMP = useCharacterStore((s) => s.setCurrentMP);
  const setCurrentSAN = useCharacterStore((s) => s.setCurrentSAN);
  const setCondition = useCharacterStore((s) => s.setCondition);

  return (
    <Box sx={{ display: 'grid', gap: 2.5 }}>
      
      <StatBlock label="体力 HP" current={status.currentHP} max={derived.maxHP} extra={`重伤阈值 ${derived.majorWound}`} color="error.main" onChange={setCurrentHP} inGrid={false}/>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
        <StatBlock label="理智 SAN" current={status.currentSAN} max={derived.maxSAN} color="info.main" onChange={setCurrentSAN} inGrid/>
        <StatBlock label="魔法 MP" current={status.currentMP} max={derived.maxMP} color="primary.main" onChange={setCurrentMP} inGrid/>
      </Box>

      <Paper sx={{ p: 2.5, backgroundColor: alpha('#0d1110', 0.26) }}>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            异常状态
          </Typography>
          <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' } }}>
            <ConditionToggle label="重伤" checked={status.conditions.majorWound} onChange={(value) => setCondition('majorWound', value)} color="error" />
            <ConditionToggle label="昏迷" checked={status.conditions.unconscious} onChange={(value) => setCondition('unconscious', value)} color="warning" />
            <ConditionToggle label="濒死" checked={status.conditions.dying} onChange={(value) => setCondition('dying', value)} color="error" />
            <ConditionToggle label="临时疯狂" checked={status.conditions.tempInsanity} onChange={(value) => setCondition('tempInsanity', value)} color="warning" />
            <ConditionToggle label="不定疯狂" checked={status.conditions.indefInsanity} onChange={(value) => setCondition('indefInsanity', value)} color="error" />
            <ConditionToggle label="永久疯狂" checked={status.conditions.permInsanity} onChange={(value) => setCondition('permInsanity', value)} color="error" />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function StatBlock({ label, current, max, extra, color, onChange, inGrid }: { label: string; current: number; max: number; extra?: string; color: string; onChange: (value: number) => void; inGrid: boolean }) {
  const progress = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;

  return (
    <Paper sx={{ p: 2.5, backgroundColor: alpha('#0d1110', 0.26) }}>
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {label}
          </Typography>
          <Box sx={{display: 'flex', gap: 2.5}}>
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

        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 999, backgroundColor: alpha('#ffffff', 0.08), '& .MuiLinearProgress-bar': { backgroundColor: color } }} />

        {
          
        }

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button sx={{minWidth: inGrid ? '1rem' : '64px'}} variant="outlined" onClick={() => onChange(Math.max(0, current - 1))}>-1</Button>
          <Box sx={{ minWidth: inGrid ? '4rem' : '12rem', py: 1, borderRadius: 2.5, textAlign: 'center', border: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: alpha('#0d1110', 0.45) }}>
            <Typography variant="h6">{current}</Typography>
          </Box>
          <Button sx={{minWidth: inGrid ? '1rem' : '64px'}} variant="outlined" onClick={() => onChange(Math.min(max, current + 1))}>+1</Button>
        </Box>
      </Box>
    </Paper>
  );
}

function ConditionToggle({ label, checked, onChange, color }: { label: string; checked: boolean; onChange: (value: boolean) => void; color: 'error' | 'warning' }) {
  return (
    <Button variant={checked ? 'contained' : 'outlined'} color={color} onClick={() => onChange(!checked)} sx={{ justifyContent: 'flex-start' }}>
      {label}
    </Button>
  );
}
