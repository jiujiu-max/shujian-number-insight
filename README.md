# 数见八型 · GitHub Pages 版

这是“理清号码引流网站需求”原站的静态发布副本。号码分析、性格卡生成与二维码展示都在浏览器本地运行；本站没有接收或保存访客输入的后端接口。原 ChatGPT Sites 站点独立保留。

## 本地验证

需要 Node.js 22 和 pnpm 11。运行 `pnpm install --frozen-lockfile`、`pnpm test`、`pnpm build`。静态文件会生成在 `out/`。

## 发布

推送到 `main` 后，`.github/workflows/pages.yml` 会构建并发布 `out/` 到 GitHub Pages。仓库的 Settings → Pages → Build and deployment → Source 需要选择 **GitHub Actions**。站点主域名为 `jiaming27.cn`，已写入 `public/CNAME`、网页元信息、分享卡入口和二维码。

DNSPod 中已为根域名 `@` 添加两条 A 记录：`185.199.108.153`、`185.199.109.153`；免费套餐阻止再添加同主机记录。GitHub Pages 至少需要一条 A 记录，现有两条已可用。`www` 的 CNAME 指向 `jiujiu-max.github.io`。GitHub Pages 已绑定主域名并启用 Enforce HTTPS；不要删除邮件所需的 MX、TXT 等其他记录。

`public/type-entry-qr.png` 是指向 `https://jiaming27.cn/` 的二维码。换域名时，更新 `app/eight-types.ts`、`app/layout.tsx`、工作流、`public/CNAME` 和 `scripts/generate-entry-qr.py`，再用 Python 的 ReportLab 与 Pillow 运行脚本重生二维码。

## 与原 Sites 站同步

以原 Sites 站的**已发布源码提交**为内容源。原站成功发布后，先确认其工作区已提交且干净，再用已发布版本对应的完整 SHA 执行：

```bash
python3 scripts/sync-from-sites.py --sites-checkout "$SHUJIAN_SITES_CHECKOUT" --source-commit "$SHUJIAN_PUBLISHED_SHA"
python3 scripts/sync-from-sites.py --sites-checkout "$SHUJIAN_SITES_CHECKOUT" --source-commit "$SHUJIAN_PUBLISHED_SHA" --apply
pnpm test
pnpm build
git diff --check
git add app tests public scripts/sites-source-commit.txt
git commit -m "Sync published Sites content"
git push origin main
```

`SHUJIAN_SITES_CHECKOUT` 是原站本地工程路径；`SHUJIAN_PUBLISHED_SHA` 必须从已发布 Sites 版本取得。脚本只读取该提交，不会复制工作区中尚未提交的改动。网页元信息、域名链接、背景 JPG 和入口二维码为 GitHub Pages 专用；原站布局元信息、依赖配置、OG 图片或新增公开素材变化时，脚本会停止并要求人工核对。GitHub Actions 成功后，再核验自有域名。这个流程需在原站每次发布后执行；Sites 不会自行推送到 GitHub。
