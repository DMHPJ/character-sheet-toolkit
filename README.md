# character-sheet-toolkit

一个面向桌面角色扮演游戏玩家与守秘人（Keeper）的在线角色卡辅助平台，当前核心聚焦于《克苏鲁的呼唤》（Call of Cthulhu）第七版规则，目标是提供流畅、直观、可扩展的调查员人物卡创建与管理体验。

## 项目概览

本项目围绕 CoC 7 版调查员的创建与生命周期管理设计，当前重点包括：

- 向导式车卡流程，覆盖属性生成、年龄调整与衍生数值推演
- 职业与技能点自动计算，辅助合法分配职业技能点与兴趣点
- 背景与资产信息整理，支持更完整的人物卡记录
- 模块化架构设计，为后续扩展更多 TRPG 规则集预留空间

## 项目技术栈

- Next.js
- TypeScript ^5
- Shadcn ^4.5.0
- Tailwind CSS ^4.2.4
- zustand ^5.0.12

## 预览网址

- 在线预览：[https://dmhpj.github.io/character-sheet-toolkit/](https://dmhpj.github.io/character-sheet-toolkit/)

## 本地开发

安装依赖后，运行开发服务器：

```bash
npm run dev
```

然后在浏览器中打开 `http://localhost:3000` 查看效果。

## License

### 中文说明

本项目采用 `PolyForm Noncommercial 1.0.0` 许可发布。

正式法律文本请参阅 [LICENSE](./LICENSE)，中文参考译文请参阅 [LICENSE.zh-CN.md](./LICENSE.zh-CN.md)。

你可以在非商业前提下使用、学习、修改和分发本项目源码，例如：

- 个人玩家自用
- 跑团社群内部使用
- 非营利组织、教育用途、研究用途

你不可以在未获得作者额外书面授权的情况下，将本项目或基于本项目的衍生版本用于商业用途，例如：

- 直接售卖本项目
- 将本项目作为付费 SaaS 或商业服务的一部分提供
- 为商业客户基于本项目进行收费部署、定制开发或二次分发

### English Summary

This project is released under `PolyForm Noncommercial 1.0.0`.

For the legally operative text, see [LICENSE](./LICENSE). A Chinese reference translation is available in [LICENSE.zh-CN.md](./LICENSE.zh-CN.md).

You may use, study, modify, and share this software for noncommercial purposes, including:

- personal use by individual players
- use within tabletop RPG groups or fan communities
- nonprofit, educational, and research use

You may not use this project, or derivatives of it, for commercial purposes without prior written permission from the author, including:

- selling the software
- offering it as part of a paid SaaS or commercial service
- paid deployment, customization, or redistribution for commercial clients
