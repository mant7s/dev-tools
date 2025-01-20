import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ThemeProvider } from 'next-themes';
import HashRouter from '@/components/HashRouter';
import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: '开发者工具箱',
  description: '快速、高效的开发辅助工具集',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <body className={clsx('font-sans antialiased h-full', inter.variable)}>
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
