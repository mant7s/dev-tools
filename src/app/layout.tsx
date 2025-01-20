import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import clsx from 'clsx';
import HashRouter from "@/components/HashRouter";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "开发者工具箱",
  description: "快速、高效的开发辅助工具集",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={clsx('font-sans antialiased', geistSans.variable, geistMono.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <HashRouter>
              {children}
            </HashRouter>
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
