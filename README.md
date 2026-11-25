# 数见八型 · GitHub Pages 版

这是“理清号码引流网站需求”原站的静态发布副本。号码分析、性格卡生成与二维码展示都在浏览器本地运行；本站没有接收或保存访客输入的后端接口。原 ChatGPT Sites 站点独立保留。

## 本地验证

需要 Node.js 22 和 pnpm 11。运行 `pnpm install --frozen-lockfile`、`pnpm test`、`pnpm build`。静态文件会生成在 `out/`。

## 发布

推送到 `main` 后，`.github/workflows/pages.yml` 会构建并发布 `out/` 到 GitHub Pages。仓库的 Settings → Pages → Build and deployment → Source 需要选择 **GitHub Actions**。站点主域名为 `jiaming27.cn`，已写入 `public/CNAME`、网页元信息、分享卡入口和二维码。

DNSPod 中已为根域名 `@` 添加两条 A 记录：`185.199.108.153`、`185.199.109.153`；免费套餐阻止再添加同主机记录。GitHub Pages 至少需要一条 A 记录，现有两条已可用。`www` 的 CNAME 指向 `jiujiu-max.github.io`。GitHub Pages 已绑定主域名并启用 Enforce HTTPS；不要删除邮件所需的 MX、TXT 等其他记录。

`public/type-entry-qr.png` 是指向 `https://jiaming27.cn/` 的二维码。换域名时，更新 `app/eight-types.ts`、`app/layout.tsx`、工作流、`public/CNAME` 和 `scripts/generate-entry-qr.py`，再用 Python 的 ReportLab 与 Pillow 运行脚本重生二维码。
