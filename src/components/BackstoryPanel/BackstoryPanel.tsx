"use client";

import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { Box, TextField, Typography } from "@mui/material";
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
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
        <MenuBookRoundedIcon color="secondary" />
        <Box>
          <Typography variant="h2" sx={{ fontSize: "1.1rem" }}>
            背景故事
          </Typography>
          <Typography variant="body2" color="text.secondary">
            把人物的动机、关系和创伤都记录下来，方便在跑团中快速代入
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr" } }}>
        {STORY_FIELDS.map(({ key, label, rows }) =>
          isReadOnly ? (
            <ReadOnlyField key={key} label={label} value={backstory[key]} multiline minHeight={rows * 24 + 20} />
          ) : (
            <TextField
              key={key}
              label={label}
              value={backstory[key]}
              onChange={(event) => {
                useCharacterStore.setState((state) => ({
                  backstory: { ...state.backstory, [key]: event.target.value },
                }));
              }}
              multiline
              minRows={rows}
              fullWidth
            />
          ),
        )}
      </Box>
    </Box>
  );
}
