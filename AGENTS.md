<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 项目概述

本项目是一款专为跑团玩家与守秘人（Keeper）设计的在线桌面角色扮演游戏（TRPG）辅助平台。本项目当前核心聚焦于**《克苏鲁的呼唤》（Call of Cthulhu）第七版**规则，旨在提供一个流畅、直观且高度自动化的调查员（Investigator）人物卡创建与全生命周期管理工具。

## 技术栈

- **框架:** Next.js
- **语言:** TypeScript^5
- **组件库:** Material UI^9
- **状态管理:** zustand

## 核心功能与特性

- **向导式车卡流程:**
    -  **属性与衍生推演:** 支持标准掷骰规则生成核心属性，自动处理年龄调整值（如教育增强、体格/力量/敏捷减益），并实时推演衍生数据（如 HP、MP、初始 SAN、移动力 MOV、伤害加值 DB 与体格 Build）
    -  **职业与技能分配:** 依据 CoC 第七版规则，根据所选职业和核心属性自动计算职业技能点（如 EDU×4 等）与个人兴趣点（INT×2）。提供直观的技能加点交互界面，自动计算信用评级下限，并内置防错机制避免超点
    -  **背景与资产管理:** 集成资产换算模块，并提供结构化的调查员背景面板（包含个人描述、思想与信仰、重要之人、随身物品等）

- **高扩展性与模块化架构:**
    -  **多规则兼容潜力:** 底层数据结构与前端 UI 采用模块化解耦设计。在完善 CoC 第七版支持后，系统架构具备平滑扩展的潜力，未来可轻松引入并兼容其他主流 TRPG 规则集（如 DND 龙与地下城等）
    -  **自动化扩展接口:** 预留外部 API 接口，为未来可能接入的自动化工具（如利用 LLM 辅助生成角色背景故事，或通过图像生成模型定制调查员高质量肖像）提供基础支持

## 特别规范

- 在可使用双引号("")的场景下优先使用双引号("")