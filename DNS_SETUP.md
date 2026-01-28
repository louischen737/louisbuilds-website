# 阿里云 DNS 配置指南

## 问题诊断

当前状态：`louisbuilds.me` 域名无法解析到 GitHub Pages。

## 解决步骤

### 1. 登录阿里云控制台

1. 访问 https://dns.console.aliyun.com/
2. 使用您的阿里云账号登录

### 2. 找到域名并添加解析记录

1. 在左侧菜单选择 **域名解析** → **解析设置**
2. 找到 `louisbuilds.me` 域名，点击 **解析设置**

### 3. 添加 CNAME 记录（根域名）

点击 **添加记录**，填写以下信息：

| 字段 | 值 | 说明 |
|------|-----|------|
| **记录类型** | `CNAME` | 选择 CNAME |
| **主机记录** | `@` | 根域名，表示 `louisbuilds.me` |
| **解析请求来源** | `默认` | 保持默认 |
| **记录值** | `louischen737.github.io` | GitHub Pages 地址（注意：**不要**加 `http://` 或 `https://`） |
| **TTL** | `600` | 或选择 `10分钟` |

点击 **确认** 保存。

### 4. 添加 CNAME 记录（www 子域名，可选）

如果需要 `www.louisbuilds.me` 也能访问，再添加一条：

| 字段 | 值 | 说明 |
|------|-----|------|
| **记录类型** | `CNAME` | 选择 CNAME |
| **主机记录** | `www` | www 子域名 |
| **解析请求来源** | `默认` | 保持默认 |
| **记录值** | `louischen737.github.io` | GitHub Pages 地址 |
| **TTL** | `600` | 或选择 `10分钟` |

### 5. 检查现有记录

**重要**：如果之前有 A 记录或其他记录指向其他 IP，需要：
- **删除**旧的 A 记录（如果有）
- **删除**旧的 CNAME 记录（如果指向错误地址）
- 只保留指向 `louischen737.github.io` 的 CNAME 记录

### 6. 验证 DNS 配置

配置完成后，等待 **5-10 分钟**，然后运行以下命令验证：

```bash
# 方法 1: 使用 dig
dig louisbuilds.me +short
# 应该返回: louischen737.github.io

# 方法 2: 使用 nslookup
nslookup louisbuilds.me
# 应该显示 CNAME 记录指向 louischen737.github.io

# 方法 3: 使用在线工具
# 访问 https://dnschecker.org/
# 输入 louisbuilds.me，选择 CNAME 记录类型
# 检查全球 DNS 服务器是否都已更新
```

### 7. 在 GitHub 中重新检查

DNS 配置正确后：

1. 返回 GitHub 仓库 Settings → Pages
2. 点击 **Check again** 按钮
3. 等待几秒钟，应该显示 "DNS check successful"
4. 然后可以勾选 **Enforce HTTPS**

## 常见问题

### Q1: 为什么显示 "DNS check unsuccessful"？

**原因**：
- DNS 记录还没有配置
- DNS 记录配置错误（记录值不正确）
- DNS 传播还没有完成（需要等待）

**解决**：
1. 确认阿里云 DNS 中已添加正确的 CNAME 记录
2. 确认记录值写的是 `louischen737.github.io`（不是 `https://louischen737.github.io`）
3. 等待 5-30 分钟让 DNS 传播

### Q2: 主机记录应该填什么？

- **根域名** (`louisbuilds.me`): 填写 `@` 或留空
- **www 子域名** (`www.louisbuilds.me`): 填写 `www`

### Q3: 记录值应该填什么？

**正确**：`louischen737.github.io`  
**错误**：`https://louischen737.github.io`（不要加协议）  
**错误**：`louischen737.github.io/`（不要加斜杠）

### Q4: DNS 传播需要多长时间？

- **最快**：5-10 分钟
- **通常**：30 分钟到 2 小时
- **最长**：最多 48 小时（全球 DNS 服务器更新）

### Q5: 如何确认 DNS 已生效？

运行以下命令：

```bash
dig louisbuilds.me CNAME +short
```

如果返回 `louischen737.github.io`，说明 DNS 已生效。

### Q6: 配置后还是不行？

1. **检查记录类型**：必须是 CNAME，不是 A 记录
2. **检查记录值**：必须是 `louischen737.github.io`（完整，无协议）
3. **删除冲突记录**：如果有其他 A 记录或 CNAME 记录，先删除
4. **等待更长时间**：DNS 传播可能需要更长时间
5. **清除 DNS 缓存**：
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

## 配置完成后的验证清单

- [ ] 阿里云 DNS 中已添加 CNAME 记录（主机记录：@，记录值：louischen737.github.io）
- [ ] `dig louisbuilds.me CNAME +short` 返回 `louischen737.github.io`
- [ ] GitHub Pages 设置中显示 "DNS check successful"
- [ ] 可以勾选 "Enforce HTTPS"
- [ ] 访问 `https://louisbuilds.me` 可以正常打开网站

## 下一步

DNS 配置成功后：

1. 在 GitHub Pages 设置中点击 **Check again**
2. 等待显示 "DNS check successful"
3. 勾选 **Enforce HTTPS**
4. 访问 `https://louisbuilds.me` 验证网站是否正常
