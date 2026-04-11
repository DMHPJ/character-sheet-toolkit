"use client";

import { useMemo, useState } from "react";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import HistoryEduRoundedIcon from "@mui/icons-material/HistoryEduRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { Box, Chip, Dialog, DialogContent, Paper, Tab, Tabs, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactElement } from "react";
import AttributePanel from "@/components/AttributePanel/AttributePanel";
import AssetsPanel from "@/components/AssetsPanel/AssetsPanel";
import BackstoryPanel from "@/components/BackstoryPanel/BackstoryPanel";
import CombatPanel from "@/components/CombatPanel/CombatPanel";
import Header from "@/components/Header/Header";
import InfoPanel from "@/components/InfoPanel/InfoPanel";
import SkillTable from "@/components/SkillTable/SkillTable";
import StatusPanel from "@/components/StatusPanel/StatusPanel";
import { useCharacterStore } from "@/stores/useCharacterStore";

type TabId = "status" | "backstory" | "combat" | "property";

const TABS: { id: TabId; label: string; icon: ReactElement }[] = [
  { id: "status", label: "状态", icon: <Inventory2RoundedIcon fontSize="small" /> },
  { id: "backstory", label: "背景故事", icon: <HistoryEduRoundedIcon fontSize="small" /> },
  { id: "combat", label: "武器与携带物", icon: <GavelRoundedIcon fontSize="small" /> },
  { id: "property", label: "资产", icon: <AccountBalanceWalletRoundedIcon fontSize="small" /> },
];

export default function CharacterSheet() {
  const [activeTab, setActiveTab] = useState<TabId>("status");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const derived = useCharacterStore((state) => state.derived);

  const tabContent = useMemo(() => {
    if (activeTab === "status") return <StatusPanel />;
    if (activeTab === "backstory") return <BackstoryPanel />;
    if (activeTab === "combat") return <CombatPanel />;
    return <AssetsPanel />;
  }, [activeTab]);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Box sx={{ mx: "4vw" }}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <Header onOpenInfo={() => setInfoDialogOpen(true)} />

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.55fr) minmax(360px, 0.68fr)" },
              alignItems: "start",
            }}>
            <SkillTable />

            <Box sx={{ display: "grid", gap: 3 }}>
              <AttributePanel />

              <Paper sx={{ overflow: "hidden", backgroundColor: alpha("#171d1b", 0.86) }}>
                <Box
                  sx={{
                    px: { xs: 2, md: 3 },
                    pt: 2,
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", md: "center" },
                      flexDirection: { xs: "column", md: "row" },
                    }}>
                    <Box>
                      <Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
                        状态、背景与扩展
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        当前最大体力 {derived.maxHP}，最大理智 {derived.maxSAN}，最大魔法值 {derived.maxMP}
                      </Typography>
                    </Box>
                    <Chip
                      color="secondary"
                      variant="outlined"
                      label={`当前页签 ${TABS.find((tab) => tab.id === activeTab)?.label}`}
                    />
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(_, value: TabId) => setActiveTab(value)}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    sx={{ mt: 2 }}>
                    {TABS.map((tab) => (
                      <Tab key={tab.id} icon={tab.icon} iconPosition="start" label={tab.label} value={tab.id} />
                    ))}
                  </Tabs>
                </Box>

                <Box sx={{ p: { xs: 2, md: 3 } }}>{tabContent}</Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ pt: 1, marginTop: "1rem" }}>
          <InfoPanel inDialog />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
