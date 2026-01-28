# 网站迁移计划

## 当前状态分析

### 1. PurrrrrFocus
**现状：**
- 智能路由：中国 → 阿里云（purrrrrfocus.top），海外 → GitHub Pages（louischen737）
- 应用内页面：隐私、条款、技术支持、活动（已过期待下架）、壁纸下载
- App Store URL：使用海外 GitHub Pages URL
- 语言：5种（中、英、法、土耳其、丹麦）
- 网站：国内/海外版本，活动/壁纸只有中英文，其他5种语言

**App Store 当前 URL：**
英文版：
- 营销网站：`https://louischen737.github.io/purrrrrfocus-support/index-en.html`
- 隐私政策：`https://louischen737.github.io/purrrrrfocus-support/privacy-policy-en.html`
- 使用条款：`https://louischen737.github.io/purrrrrfocus-support/terms-of-service-en.html`
- 技术支持：`https://louischen737.github.io/purrrrrfocus-support/support-en.html`
中文版：
- 营销网站：`https://louischen737.github.io/purrrrrfocus-support/index.html` (默认中文，无语言后缀)
- 隐私政策：`https://louischen737.github.io/purrrrrfocus-support/privacy-policy-zh.html`
- 使用条款：`https://louischen737.github.io/purrrrrfocus-support/terms-of-service-zh.html`
- 技术支持：`https://louischen737.github.io/purrrrrfocus-support/support.html` (默认中文，无语言后缀)
法语版：
- 营销网站：`https://louischen737.github.io/purrrrrfocus-support/index-fr.html`
- 隐私政策：`https://louischen737.github.io/purrrrrfocus-support/privacy-policy-fr.html`
- 使用条款：`https://louischen737.github.io/purrrrrfocus-support/terms-of-service-fr.html`
- 技术支持：`https://louischen737.github.io/purrrrrfocus-support/support-fr.html`
丹麦语版：
- 营销网站：`https://louischen737.github.io/purrrrrfocus-support/index-da.html`
- 隐私政策：`https://louischen737.github.io/purrrrrfocus-support/privacy-policy-da.html`
- 使用条款：`https://louischen737.github.io/purrrrrfocus-support/terms-of-service-da.html`
- 技术支持：`https://louischen737.github.io/purrrrrfocus-support/support-da.html`
土耳其语版：
- 营销网站：`https://louischen737.github.io/purrrrrfocus-support/index-tr.html`
- 隐私政策：`https://louischen737.github.io/purrrrrfocus-support/privacy-policy-tr.html`
- 使用条款：`https://louischen737.github.io/purrrrrfocus-support/terms-of-service-tr.html`
- 技术支持：`https://louischen737.github.io/purrrrrfocus-support/support-tr.html`

**特殊页面：**
- 活动页面（中英文，下个版本下架或替换新一周期的活动）
- 壁纸下载页面（中英文，下一版本更新春节壁纸）

**迁移目标：**
- 海外版本迁移到 `louisbuilds.me/purrrrrfocus/`
- **保持智能路由**：中国区继续使用阿里云（purrrrrfocus.top），海外路由到 GitHub Pages（louisbuilds.me）
- **保留原有设计风格**（不统一到 TapPause 风格）
- 应用内页面保留，同时维护远程页面（两套内容）

### 2. Phonetic Formatter
**现状：**
- 应用内：隐私、条款使用应用内页面
- App Store：GitHub Pages（louischen737）
- 纯英文

**App Store 当前 URL：**
- 营销网站：`https://louischen737.github.io/phonetic-formatter-website/index.html`
- 隐私政策：`https://louischen737.github.io/phonetic-formatter-website/privacy.html` (注意：使用 privacy.html)
- 使用条款：`https://louischen737.github.io/phonetic-formatter-website/terms.html` (注意：使用 terms.html)
- 技术支持：`https://louischen737.github.io/phonetic-formatter-website/support.html`

**迁移目标：**
- 迁移到 `louisbuilds.me/phoneticformatter/`
- **保留原有设计风格**（不统一到 TapPause 风格）
- **应用内页面保留**，同时维护远程页面（两套内容）

### 3. TransMov
**现状：**
- 应用内：隐私、条款为应用内页面，技术支持打开邮件
- App Store：GitHub Pages（louischen737）
- 中英文

**App Store 当前 URL：**
- 营销网站：`https://louischen737.github.io/transmov-website/` (index.html)
- 隐私政策：`https://louischen737.github.io/transmov-website/privacy-policy.html`
- 使用条款：`https://louischen737.github.io/transmov-website/terms-of-service.html` (注意：使用 terms-of-service)
- 技术支持：`https://louischen737.github.io/transmov-website/support.html`

**迁移目标：**
- 迁移到 `louisbuilds.me/transmov/`
- **保留原有设计风格**（不统一到 TapPause 风格）
- **应用内页面保留**，同时维护远程页面（两套内容）

### 4. TapPause
**现状：**
- 新应用，未上架
- 已使用 `louisbuilds.me/tappause/` 构建页面
- 已关联到个人主页
- 应用内已改为加载远程页面

**状态：** ✅ 已完成迁移

---

## 迁移策略

**已确认方案：混合迁移**
- PurrrrrFocus：保持智能路由（中国→阿里云，海外→louisbuilds.me）
- 其他产品：完全迁移到 louisbuilds.me
- 应用内页面：保留应用内页面，同时维护远程页面（两套内容，有利于轻量级应用用户快速访问）

---

## 迁移步骤

### 阶段 1：创建新网站内容（必须先完成，确保所有页面正常）

**⚠️ 重要：此阶段必须完全完成，确保所有页面可正常访问和跳转后，才能进行后续 URL 更新**

1. **创建产品目录结构（保留各自原有设计风格）**

   **⚠️ 重要：保留各产品原有的设计风格，不统一到 TapPause 风格**

   ```
   louisbuilds-website/
   ├── index.html (个人主页)
   ├── assets/ (共享资源)
   │   └── app-store-badge.svg
   │
   ├── purrrrrfocus/ (保留原有设计风格)
   │   ├── index.html (中文默认)
   │   ├── index-en.html
   │   ├── index-zh.html
   │   ├── index-fr.html
   │   ├── index-da.html
   │   ├── index-tr.html
   │   ├── privacy-policy-en.html
   │   ├── privacy-policy-zh.html
   │   ├── privacy-policy-fr.html
   │   ├── privacy-policy-da.html
   │   ├── privacy-policy-tr.html
   │   ├── terms-of-service-en.html (注意：使用 terms-of-service，不是 terms-of-use)
   │   ├── terms-of-service-zh.html
   │   ├── terms-of-service-fr.html
   │   ├── terms-of-service-da.html
   │   ├── terms-of-service-tr.html
   │   ├── support.html (中文默认)
   │   ├── support-en.html
   │   ├── support-zh.html
   │   ├── support-fr.html
   │   ├── support-da.html
   │   ├── support-tr.html
   │   ├── redeem-activity.html (活动页面-中文)
   │   ├── redeem-activity-en.html (活动页面-英文，下个版本下架或替换)
   │   ├── wallpapers.html (壁纸下载-中文)
   │   ├── wallpapers-en.html (壁纸下载-英文，下一版本更新春节壁纸)
   │   ├── icons/ (应用图标资源)
   │   ├── screenshots/iphone/ (截图资源)
   │   ├── wallpapers/christmas/ (壁纸资源)
   │   ├── app-store-badge-en.svg
   │   ├── app-store-badge-zh.svg
   │   ├── app-store-badge-fr.svg
   │   ├── app-store-badge-da.svg
   │   ├── app-store-badge-tr.svg
   │   ├── AppIcon.png
   │   ├── AppIcon-Preview.png
   │   ├── cat-avatar-header.png
   │   ├── cat-avatar-plus-features.png
   │   ├── robots.txt
   │   └── sitemap.xml
   │
   ├── phoneticformatter/ (保留原有设计风格)
   │   ├── index.html
   │   ├── privacy.html (注意：使用 privacy.html，不是 privacy-policy.html)
   │   ├── terms.html (注意：使用 terms.html，不是 terms-of-use.html)
   │   ├── support.html
   │   ├── app-store-badge.svg
   │   ├── favicon.png
   │   └── logo.png
   │
   ├── transmov/ (保留原有设计风格)
   │   ├── index.html
   │   ├── privacy-policy.html
   │   ├── terms-of-service.html (注意：使用 terms-of-service)
   │   ├── support.html
   │   ├── images/
   │   │   ├── favicon.png
   │   │   └── app-icon.png
   │   ├── robots.txt
   │   └── sitemap.xml
   │
   └── tappause/ (已完成，TapPause 风格) ✅
       ├── index.html
       ├── privacy-policy.html
       ├── terms-of-use.html
       ├── support.html
       └── pause-symbol.png
   ```

   **文件命名规则说明：**
   - **PurrrrrFocus**: 使用 `terms-of-service`（不是 `terms-of-use`），中文默认页面为 `index.html` 和 `support.html`（无语言后缀）
   - **Phonetic Formatter**: 使用 `privacy.html` 和 `terms.html`（简化命名）
   - **TransMov**: 使用 `privacy-policy.html` 和 `terms-of-service.html`
   - **TapPause**: 使用 `privacy-policy.html` 和 `terms-of-use.html`

2. **迁移现有页面内容**
   - 从各 GitHub Pages 仓库复制 HTML 文件到新目录
   - **保留原有设计风格和样式**（不统一到 TapPause 风格）
   - 更新内部链接路径（相对路径）
   - 更新资源文件路径（图片、CSS 等）
   - 更新 App Store 链接（如需要）

3. **验证所有页面**
   - 检查所有页面可正常访问
   - 验证页面间跳转正常
   - 确认多语言版本切换正常
   - 测试移动端和桌面端显示
   - 验证资源文件（图片、图标等）正常加载

3. **创建重定向页面**（在旧 GitHub Pages 仓库）
   - 创建 HTML 重定向页面，指向新 URL
   - 保持旧 URL 可访问，避免 404
   - 重定向页面应长期保留（建议 3-6 个月）

### 阶段 2：更新应用内 URL（可选，根据应用需求）

**策略：应用内页面保留，同时维护远程页面**
- 应用内页面：继续使用应用内 HTML 内容（离线可用，快速加载）
- App Store URL：更新为新的 louisbuilds.me URL
- 两套内容需要同步维护

**更新内容（如需要）：**
- 如果应用内需要跳转到远程页面，更新应用内 WebViewController 的 URL
- 如果应用内继续使用本地页面，则无需修改应用代码

### 阶段 3：更新 App Store Connect URL（关键步骤）

**⚠️ 前置条件：阶段 1 必须完全完成，所有新页面已验证正常**

**更新流程：**
1. **确认新网站完全就绪**
   - 所有页面可正常访问
   - 所有链接跳转正常
   - 多语言版本完整

2. **更新 App Store Connect URL**
   - 登录 App Store Connect
   - 进入各应用的"App 信息"页面
   - 更新"营销网址"、"隐私政策 URL"、"使用条款 URL"、"技术支持 URL"
   - **注意**：更新 URL 后，可能需要重新提交审核（取决于 Apple 政策）

3. **更新顺序建议**
   - TapPause（新应用，未上架）- 无风险 ✅
   - 其他应用：根据版本更新计划，在提交新版本时同步更新 URL
   - 或选择低峰期单独更新 URL（需评估审核风险）

**更新时机选择：**
- **方案 A（推荐）**：在应用版本更新时同步更新 URL
  - 优点：一次性完成，减少审核次数
  - 缺点：需要等待版本更新时机
- **方案 B**：单独更新 URL（不等待版本更新）
  - 优点：可立即迁移
  - 缺点：可能触发额外审核，需要评估风险

### 阶段 4：清理旧网站（最后执行，3-6 个月后）

- 监控旧 URL 访问量，确认流量已迁移
- 保留重定向页面一段时间（建议 3-6 个月）
- 最终关闭旧 GitHub Pages 仓库（PurrrrrFocus 海外版本除外，需保持智能路由）

---

## 具体实施建议

### 立即执行（阶段 1：创建新网站）

1. **迁移现有页面内容**
   - 从 `purrrrrfocus-support` 仓库复制所有 HTML 文件和资源到 `louisbuilds-website/purrrrrfocus/`
   - 从 `phonetic-formatter-website` 仓库复制所有文件到 `louisbuilds-website/phoneticformatter/`
   - 从 `transmov-website` 仓库复制所有文件到 `louisbuilds-website/transmov/`
   - **保留各产品原有的设计风格和样式**（不统一到 TapPause 风格）

2. **更新内部链接**
   - 更新各页面内的相对路径链接
   - 更新资源文件路径（图片、图标等）
   - 确保多语言版本间的链接正确

3. **PurrrrrFocus 特殊页面**
   - 活动页面（redeem-activity.html, redeem-activity-en.html，下个版本下架或替换新活动）
   - 壁纸下载页面（wallpapers.html, wallpapers-en.html，下一版本更新春节壁纸）

4. **创建重定向页面**
   - 在旧 GitHub Pages 仓库创建重定向
   - 确保旧链接不失效
   - 重定向页面应长期保留（建议 3-6 个月）

### 验证阶段（阶段 1 完成后）

1. **全面测试新网站**
   - 测试所有页面可访问
   - 验证所有链接跳转正常
   - 检查多语言版本切换
   - 测试移动端和桌面端显示

2. **确认无问题后，进入阶段 3**

### URL 映射关系（旧 URL → 新 URL）

**PurrrrrFocus：**
- `https://louischen737.github.io/purrrrrfocus-support/index.html` → `https://louisbuilds.me/purrrrrfocus/index.html`
- `https://louischen737.github.io/purrrrrfocus-support/index-en.html` → `https://louisbuilds.me/purrrrrfocus/index-en.html`
- `https://louischen737.github.io/purrrrrfocus-support/index-zh.html` → `https://louisbuilds.me/purrrrrfocus/index-zh.html`
- `https://louischen737.github.io/purrrrrfocus-support/index-fr.html` → `https://louisbuilds.me/purrrrrfocus/index-fr.html`
- `https://louischen737.github.io/purrrrrfocus-support/index-da.html` → `https://louisbuilds.me/purrrrrfocus/index-da.html`
- `https://louischen737.github.io/purrrrrfocus-support/index-tr.html` → `https://louisbuilds.me/purrrrrfocus/index-tr.html`
- `https://louischen737.github.io/purrrrrfocus-support/privacy-policy-*.html` → `https://louisbuilds.me/purrrrrfocus/privacy-policy-*.html`
- `https://louischen737.github.io/purrrrrfocus-support/terms-of-service-*.html` → `https://louisbuilds.me/purrrrrfocus/terms-of-service-*.html`
- `https://louischen737.github.io/purrrrrfocus-support/support*.html` → `https://louisbuilds.me/purrrrrfocus/support*.html`

**Phonetic Formatter：**
- `https://louischen737.github.io/phonetic-formatter-website/index.html` → `https://louisbuilds.me/phoneticformatter/index.html`
- `https://louischen737.github.io/phonetic-formatter-website/privacy.html` → `https://louisbuilds.me/phoneticformatter/privacy.html`
- `https://louischen737.github.io/phonetic-formatter-website/terms.html` → `https://louisbuilds.me/phoneticformatter/terms.html`
- `https://louischen737.github.io/phonetic-formatter-website/support.html` → `https://louisbuilds.me/phoneticformatter/support.html`

**TransMov：**
- `https://louischen737.github.io/transmov-website/index.html` → `https://louisbuilds.me/transmov/index.html`
- `https://louischen737.github.io/transmov-website/privacy-policy.html` → `https://louisbuilds.me/transmov/privacy-policy.html`
- `https://louischen737.github.io/transmov-website/terms-of-service.html` → `https://louisbuilds.me/transmov/terms-of-service.html`
- `https://louischen737.github.io/transmov-website/support.html` → `https://louisbuilds.me/transmov/support.html`

### URL 更新执行（阶段 3）

**更新方式选择：**

1. **方式 A：配合版本更新（推荐）**
   - 在应用版本更新时，同步更新 App Store Connect URL
   - 优点：一次性完成，减少审核风险
   - 需要：等待各应用的版本更新时机

2. **方式 B：单独更新 URL**
   - 不等待版本更新，直接更新 App Store Connect URL
   - 优点：可立即迁移
   - 风险：可能触发额外审核，需要评估

**应用内页面策略：**
- **保留应用内页面**，不改为远程加载
- 同时维护远程页面（App Store 使用）
- 两套内容需要同步维护，确保一致性

---

## 风险评估

### 高风险操作
- ❌ **在新网站未完全就绪时更新 URL**（可能导致 App Store 审核失败）
- ❌ **直接更新已上架应用的 App Store URL 而不配合版本更新**（可能触发额外审核）
- ❌ **删除旧网站**（用户可能还在使用旧链接）

### 中风险操作
- ⚠️ **单独更新 App Store URL**（不等待版本更新）
  - 风险：可能触发额外审核
  - 建议：评估审核风险，或等待版本更新时同步更新

### 低风险操作
- ✅ **创建新网站页面**（不影响现有应用）
- ✅ **创建重定向页面**（保持旧链接可用）
- ✅ **更新新应用（TapPause）的 URL**（未上架，无风险）
- ✅ **在应用版本更新时同步更新 URL**（推荐方式）

---

## URL 更新方式说明

### App Store Connect URL 更新流程

1. **登录 App Store Connect**
   - 进入各应用的"App 信息"页面

2. **更新 URL 字段**
   - 营销网址：更新为 `https://louisbuilds.me/[产品名]/`
   - 隐私政策 URL：更新为 `https://louisbuilds.me/[产品名]/privacy-policy.html`（或对应语言版本）
   - 使用条款 URL：更新为 `https://louisbuilds.me/[产品名]/terms-of-use.html`（或对应语言版本）
   - 技术支持 URL：更新为 `https://louisbuilds.me/[产品名]/support.html`（或对应语言版本）

3. **保存更改**
   - 保存后，Apple 可能会要求重新提交审核
   - 或可能自动通过（取决于 Apple 政策变化）

### 应用内 URL 更新（如需要）

**策略：保留应用内页面，同时维护远程页面**

- **如果应用内需要跳转到远程页面**：
  - 修改应用内 WebViewController 的 URL 配置
  - 更新为新的 louisbuilds.me URL
  - 需要发版更新应用

- **如果应用内继续使用本地页面**：
  - 无需修改应用代码
  - 只需同步维护两套内容（应用内 + 远程）

---

## 下一步行动

### 立即执行
1. ✅ 创建 PurrrrrFocus、Phonetic Formatter、TransMov 的新网站页面
2. ✅ 验证所有页面可正常访问和跳转
3. ✅ 创建旧网站的重定向页面

### 待确认后执行
1. ⏳ 确认新网站完全就绪后，更新 App Store Connect URL
2. ⏳ 根据各应用的版本更新计划，安排 URL 更新时机
3. ⏳ 如需更新应用内 URL，在版本更新时同步修改

### 需要您提供的信息
1. 各应用的当前 App Store Connect URL（用于创建重定向）
2. PurrrrrFocus 活动页面和壁纸页面的具体内容和结构
3. 各应用的版本更新计划（以便安排 URL 更新时机）
