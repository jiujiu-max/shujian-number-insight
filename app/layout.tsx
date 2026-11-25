import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://jiaming27.cn/"),
  title: "数见八型 · 你是哪种人，容易在哪吃亏？",
  description:
    "你是主心骨、行动派，还是点子王？从手机号码出发，看看自己的长处和容易吃的亏，生成性格卡。传统数字文化体验，非心理测评。",
  openGraph: {
    title: "数见八型 · 你是哪种人？",
    description: "有什么长处，容易在哪吃亏？八种数字画像，传统文化体验。",
    type: "website",
    images: [{ url: "/og-v5.jpg", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "数见八型 · 你是哪种人？",
    description: "有什么长处，容易在哪吃亏？八种数字画像，传统文化体验。",
    images: ["/og-v5.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
