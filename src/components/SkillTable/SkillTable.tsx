'use client';

import { useMemo, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
  Checkbox,
  Chip,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCharacterStore } from '@/stores/useCharacterStore';
import type { Skill } from '@/types/character';

export default function SkillTable() {
  const skills = useCharacterStore((s) => s.skills);
  const setSkillField = useCharacterStore((s) => s.setSkillField);
  const toggleSkillCheck = useCharacterStore((s) => s.toggleSkillCheck);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return skills;
    const query = search.toLowerCase();
    return skills.filter(
      (skill) => skill.name.toLowerCase().includes(query) || (skill.subName && skill.subName.toLowerCase().includes(query)),
    );
  }, [search, skills]);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: alpha('#171d1b', 0.84) }}>
      <Box sx={{ display: 'grid', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box>
            <Typography variant="h2" sx={{ fontSize: '1.15rem' }}>
              技能表
            </Typography>
            <Typography variant="body2" color="text.secondary">
              支持检索、成长标记和基础成功率自动换算。
            </Typography>
          </Box>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索技能或子类"
            size="small"
            sx={{ minWidth: { xs: '100%', md: 280 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TableContainer sx={{ borderRadius: 0.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{width: '4.5rem !important'}} padding="checkbox">成长</TableCell>
                <TableCell>技能</TableCell>
                <TableCell sx={{width: '5rem'}} align="center">初始</TableCell>
                <TableCell sx={{width: '8rem'}} align="center">成长</TableCell>
                <TableCell sx={{width: '8rem'}} align="center">职业</TableCell>
                <TableCell sx={{width: '8rem'}} align="center">兴趣</TableCell>
                <TableCell sx={{width: '5.5rem'}} align="center">常规</TableCell>
                <TableCell sx={{width: '5rem'}} align="center">困难</TableCell>
                <TableCell sx={{width: '5rem'}} align="center">极限</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((skill) => (
                <SkillRow key={skill.id} skill={skill} onFieldChange={setSkillField} onToggleCheck={toggleSkillCheck} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            没有找到匹配的技能。
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

function SkillRow({
  skill,
  onFieldChange,
  onToggleCheck,
}: {
  skill: Skill;
  onFieldChange: (id: string, field: 'growth' | 'occupationPoints' | 'interestPoints' | 'subName', value: number | string) => void;
  onToggleCheck: (id: string) => void;
}) {
  const total = skill.baseValue + skill.growth + skill.occupationPoints + skill.interestPoints;
  const hard = Math.floor(total / 2);
  const extreme = Math.floor(total / 5);
  const isSpecial = skill.id === 'cthulhu_mythos' || skill.id === 'credit_rating';
  const hasSubName = /（.*）|\(|[①②③]|自定义/.test(skill.name);

  return (
    <TableRow hover sx={{ backgroundColor: skill.checked ? (theme) => alpha(theme.palette.primary.main, 0.08) : isSpecial ? (theme) => alpha(theme.palette.secondary.main, 0.05) : undefined }}>
      <TableCell padding="checkbox">
        <Checkbox checked={skill.checked} onChange={() => onToggleCheck(skill.id)} color="primary" />
      </TableCell>
      <TableCell sx={{ minWidth: 220 }}>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {skill.name}
            </Typography>
            {isSpecial ? <Chip label="特殊" size="small" color="secondary" variant="outlined" /> : null}
          </Box>
          {hasSubName ? (
            <TextField
              sx={{maxWidth: '16rem'}}
              value={skill.subName ?? ''}
              onChange={(e) => onFieldChange(skill.id, 'subName', e.target.value)}
              placeholder="子类 / 语言 / 专精"
              size="small"
              fullWidth
            />
          ) : null}
        </Box>
      </TableCell>
      <TableCell align="center">{skill.baseValue}</TableCell>
      <EditableNumberCell value={skill.growth} onChange={(value) => onFieldChange(skill.id, 'growth', value)} />
      <EditableNumberCell value={skill.occupationPoints} onChange={(value) => onFieldChange(skill.id, 'occupationPoints', value)} disabled={skill.cannotAssignOccupation} />
      <EditableNumberCell value={skill.interestPoints} onChange={(value) => onFieldChange(skill.id, 'interestPoints', value)} disabled={skill.cannotAssignInterest} />
      <TableCell align="center">{total}</TableCell>
      <TableCell align="center">{hard}</TableCell>
      <TableCell align="center">{extreme}</TableCell>
    </TableRow>
  );
}

function EditableNumberCell({ value, onChange, disabled = false }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  return (
    <TableCell align="center" sx={{ minWidth: 88 }}>
      <TextField
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        size="small"
        disabled={disabled}
        slotProps={{ htmlInput: { min: 0, style: { textAlign: 'center' },  } }}
        sx={{ width: 80 }}
      />
    </TableCell>
  );
}
