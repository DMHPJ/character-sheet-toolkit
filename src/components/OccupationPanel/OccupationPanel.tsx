"use client";

import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { OCCUPATIONS, getOccupationById } from "@/data/occupations";
import { useCharacterStore } from "@/stores/useCharacterStore";

export default function OccupationPanel({
  inDialog = false,
  readOnly,
}: {
  inDialog?: boolean;
  readOnly?: boolean;
}) {
  const storeReadOnly = useCharacterStore((state) => state.readOnly);
  const info = useCharacterStore((state) => state.info);
  const occupationState = useCharacterStore((state) => state.occupationState);
  const occupationSummary = useCharacterStore((state) => state.occupationSummary);
  const setOccupation = useCharacterStore((state) => state.setOccupation);
  const setOccupationSelection = useCharacterStore((state) => state.setOccupationSelection);
  const isReadOnly = readOnly ?? storeReadOnly;

  const occupation = getOccupationById(occupationState.occupationId);

  const content = (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
        职业模板
      </Typography>

      <Autocomplete
        size="small"
        options={OCCUPATIONS}
        value={occupation}
        disabled={isReadOnly}
        getOptionLabel={(option) => `${option.id}. ${option.name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText="没有匹配的职业"
        clearText="清除"
        openText="展开"
        closeText="收起"
        onChange={(_, value) => {
          setOccupation(value?.id ?? null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="职业"
            placeholder="搜索职业名称或编号"
          />
        )}
      />

      {occupation ? (
        <>
          <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" } }}>
            <SummaryCard label="职业点公式" value={occupationSummary.formulaLabel} />
            <SummaryCard label="职业点 / 已分配" value={`${occupationSummary.occupationPointsTotal} / ${occupationSummary.occupationPointsSpent}`} />
            <SummaryCard label="兴趣点 / 已分配" value={`${occupationSummary.interestPointsTotal} / ${occupationSummary.interestPointsSpent}`} />
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={`信用评级 ${occupationSummary.creditRatingMin}-${occupationSummary.creditRatingMax}`} color={occupationSummary.creditRatingInRange ? "success" : "warning"} variant="outlined" />
            <Chip label={`当前职业：${info.occupation || "未选择"}`} variant="outlined" />
            <Chip label={`剩余职业点 ${Math.max(0, occupationSummary.occupationPointsRemaining)}`} color={occupationSummary.occupationPointsRemaining < 0 ? "error" : "secondary"} variant="outlined" />
          </Box>

          <Typography variant="body2" color="text.secondary">{occupation.description}</Typography>
          <Typography variant="body2" color="text.secondary">推荐关系人：{occupation.contacts}</Typography>

          {occupation.choiceGroups.map((group) => (
            <FormControl key={group.id} fullWidth size="small">
              <InputLabel id={`${group.id}-label`}>{group.label}</InputLabel>
              <Select
                labelId={`${group.id}-label`}
                multiple={group.count > 1}
                label={group.label}
                disabled={isReadOnly}
                value={occupationState.selectedSkills[group.id] ?? []}
                onChange={(event) => {
                  const rawValue = event.target.value;
                  const value = Array.isArray(rawValue) ? rawValue.map(String) : [String(rawValue)];
                  setOccupationSelection(group.id, value.slice(0, group.count));
                }}
                renderValue={(selected) =>
                  (selected as string[])
                    .map((optionId) => {
                      const find = group.options.find((item) => item.id === optionId);
                      return find?.subName ? `${find.label}（${find.subName}）` : find?.label;
                    })
                    .join("，")
                }
              >
                {group.options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                    {option.subName ? `（${option.subName}）` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {!occupationSummary.creditRatingInRange && (
            <Alert severity="warning">
              当前信用评级为 {occupationSummary.creditRatingValue}，未落在该职业要求的 {occupationSummary.creditRatingMin}-{occupationSummary.creditRatingMax} 区间内。
            </Alert>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          先选择职业，再进入技能表分配本职技能点。未选择职业时，职业点输入将保持锁定。
        </Typography>
      )}
    </Box>
  );

  if (inDialog) {
    return content;
  }

  return <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: alpha("#171d1b", 0.84) }}>{content}</Paper>;
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ p: 1.5, borderRadius: 0.5, border: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: alpha("#0d1110", 0.48) }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
