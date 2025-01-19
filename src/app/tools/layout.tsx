'use client';

import { usePathname } from 'next/navigation';
import { Tabs, Tab } from '@nextui-org/react';
import { IoChevronBack } from 'react-icons/io5';
import { IoColorPalette } from 'react-icons/io5';
import { SiJson } from 'react-icons/si';
import { IoQrCode } from 'react-icons/io5';
import ThemeSwitch from "@/components/ThemeSwitch";

const tabs = [
  {
    id: 'json',
    label: 'JSON 工具',
    href: '#/tools/json',
    icon: <SiJson className="w-4 h-4" />,
  },
  {
    id: 'qrcode',
    label: '二维码工具',
    href: '#/tools/qrcode',
    icon: <IoQrCode className="w-4 h-4" />,
  },
  {
    id: 'color',
    label: '颜色工具',
    href: '#/tools/color',
    icon: <IoColorPalette className="w-4 h-4" />,
  },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleTabChange = (key: React.Key) => {
    const tab = tabs.find(tab => tab.id === key);
    if (tab) {
      window.location.hash = tab.href;
    }
  };

  const currentTab = pathname.split('/').pop();

  return (
    <main className="min-h-screen">
      <nav className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <a
                href="#/"
                className="inline-flex items-center text-default-500 hover:text-primary transition-colors"
              >
                <IoChevronBack className="mr-1" />
                返回首页
              </a>
              <Tabs
                selectedKey={currentTab}
                onSelectionChange={handleTabChange}
                aria-label="工具导航"
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-primary",
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    title={
                      <a
                        href={tab.href}
                        className="flex items-center space-x-2"
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </a>
                    }
                  />
                ))}
              </Tabs>
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  );
}
