# GitHub Pages 部署指南

## 快速开始

### 1. 创建 GitHub 仓库

```bash
# 在 GitHub 上创建新仓库
# 仓库名: louisbuilds-website
# 设置为 Public (免费 GitHub Pages 需要)
```

### 2. 初始化并推送代码

```bash
cd /Users/mac/Desktop/TapPause/website

# 初始化 Git (如果还没有)
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: TapPause website"

# 添加远程仓库 (替换 YOUR_USERNAME)
git remote add origin https://github.com/louischen737/louisbuilds-website.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入仓库页面
2. 点击 **Settings** → **Pages**
3. **Source**: 选择 `Deploy from a branch`
4. **Branch**: 选择 `main`，文件夹选择 `/ (root)`
5. 点击 **Save**

### 4. 配置自定义域名

#### 在 GitHub 中设置

1. 在仓库 Settings → Pages 中
2. 找到 **Custom domain** 部分
3. 输入: `louisbuilds.me`
4. 勾选 **Enforce HTTPS** (等待证书自动配置)

#### 在阿里云 DNS 中配置

1. 登录阿里云控制台
2. 进入 **云解析 DNS** → 找到 `louisbuilds.me` 域名
3. 添加解析记录:

**记录 1 (根域名)**
- **记录类型**: CNAME
- **主机记录**: @ (或留空)
- **解析线路**: 默认
- **记录值**: `YOUR_USERNAME.github.io` (替换为你的 GitHub 用户名)
- **TTL**: 600

**记录 2 (www 子域名，可选)**
- **记录类型**: CNAME
- **主机记录**: www
- **解析线路**: 默认
- **记录值**: `YOUR_USERNAME.github.io`
- **TTL**: 600

### 5. 等待生效

- DNS 解析可能需要 **几分钟到 48 小时**
- GitHub Pages 会自动配置 HTTPS 证书
- 可以在仓库 Settings → Pages 中查看状态

### 6. 验证

访问以下 URL 验证是否正常工作:

- `https://louisbuilds.me` (个人主页)
- `https://louisbuilds.me/tappause` (TapPause 主页)
- `https://louisbuilds.me/tappause/privacy-policy.html` (隐私政策)

## 更新网站内容

```bash
# 修改文件后
git add .
git commit -m "Update website content"
git push origin main
```

GitHub Pages 会自动更新，通常 **1-5 分钟内生效**。

## 添加 Pause Symbol 图片

**重要**: 在部署前，需要添加 `pause-symbol.png` 图片:

1. 按照 `tappause/IMAGE_INSTRUCTIONS.md` 的说明创建图片
2. 将图片保存到 `website/tappause/pause-symbol.png`
3. 提交并推送:

```bash
git add tappause/pause-symbol.png
git commit -m "Add pause symbol image"
git push origin main
```

## 故障排查

### DNS 未生效
- 使用 `dig louisbuilds.me` 或 `nslookup louisbuilds.me` 检查 DNS
- 确认 CNAME 记录指向正确的 GitHub Pages 地址

### HTTPS 证书未配置
- 等待 GitHub 自动配置 (可能需要几小时)
- 确保在 GitHub Pages 设置中勾选了 "Enforce HTTPS"

### 页面 404
- 检查文件路径是否正确
- 确认 GitHub Pages 已启用
- 检查仓库是否为 Public

### 图片不显示
- 确认图片文件已提交到仓库
- 检查图片路径是否正确 (相对路径)
- 清除浏览器缓存

## App Store Connect 配置

部署完成后，在 App Store Connect 中使用以下 URL:

- **营销网站 URL**: `https://louisbuilds.me/tappause`
- **隐私政策 URL**: `https://louisbuilds.me/tappause/privacy-policy.html`
- **使用条款 URL**: `https://louisbuilds.me/tappause/terms-of-use.html`
- **技术支持 URL**: `https://louisbuilds.me/tappause/support.html`
