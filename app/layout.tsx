import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Tin học trẻ — Học để bứt phá",
  description: "Lộ trình cá nhân hóa, luyện đề thông minh và theo dõi tiến bộ dành cho học sinh ôn thi Tin học trẻ Việt Nam.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Mở khóa tư duy · Chinh phục Tin học trẻ",
    description: "Lộ trình cá nhân · Luyện đề thông minh · Theo dõi tiến bộ",
    type: "website",
    images: [{ url: "/og.png", width: 1732, height: 909, alt: "Ứng dụng học và luyện thi Tin học trẻ" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${beVietnam.variable} ${jetBrainsMono.variable}`}>{children}</body></html>;
}
