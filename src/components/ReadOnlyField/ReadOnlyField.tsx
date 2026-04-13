"use client";

import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

function isEmpty(value: ReactNode) {
  return value === null || value === undefined || value === "";
}

export default function ReadOnlyField({
  label,
  value,
  placeholder = "—",
  multiline = false,
  minHeight,
  onClick,
}: {
  label: string;
  value: ReactNode;
  placeholder?: string;
  multiline?: boolean;
  minHeight?: number | string;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "grid",
        gap: 0.75,
        px: 1.5,
        py: 1.25,
        minHeight,
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha("#0d1110", 0.32),
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: multiline ? "pre-wrap" : "normal",
          wordBreak: "break-word",
          color: isEmpty(value) ? "text.secondary" : "text.primary",
        }}
      >
        {isEmpty(value) ? placeholder : value}
      </Typography>
    </Box>
  );
}
