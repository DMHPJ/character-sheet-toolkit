"use client";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { Box, Paper, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCharacterStore } from "@/stores/useCharacterStore";

const INFO_FIELDS = [
  { key: "name" as const, label: "姓名", placeholder: "调查员姓名" },
  { key: "player" as const, label: "玩家", placeholder: "玩家名" },
  { key: "age" as const, label: "年龄", placeholder: "25", type: "number" },
  { key: "era" as const, label: "时代", placeholder: "1920s" },
  { key: "gender" as const, label: "性别", placeholder: "男 / 女 / 其他" },
  { key: "nationality" as const, label: "国籍", placeholder: "中国" },
  { key: "residence" as const, label: "住地", placeholder: "上海" },
  { key: "birthplace" as const, label: "故乡", placeholder: "波士顿" },
  { key: "portrait" as const, label: "头像 URL", placeholder: "https://example.com/portrait.png" },
] as const;

export default function InfoPanel({ inDialog = false }: { inDialog?: boolean }) {
  const info = useCharacterStore((state) => state.info);
  const setInfo = useCharacterStore((state) => state.setInfo);

  const content = (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
        <BadgeRoundedIcon color="secondary" />
        <Box>
          <Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
            调查员信息
          </Typography>
          <Typography variant="body2" color="text.secondary">
            填写角色的基础身份信息，职业模板和职业点配置在职业面板中处理
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: inDialog ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {INFO_FIELDS.map(({ key, label, placeholder, ...rest }) => (
          <TextField
            key={key}
            type={(rest as { type?: string }).type || "text"}
            label={label}
            placeholder={placeholder}
            value={info[key] ?? ""}
            onChange={(event) => {
              const value =
                (rest as { type?: string }).type === "number"
                  ? event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                  : event.target.value;
              setInfo(key, value as string & number);
            }}
            fullWidth
            size="small"
          />
        ))}
      </Box>
    </Box>
  );

  if (inDialog) {
    return content;
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: alpha("#171d1b", 0.84) }}>
      {content}
    </Paper>
  );
}
