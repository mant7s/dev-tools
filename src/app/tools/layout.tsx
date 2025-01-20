'use client';

import { useEffect, useState } from 'react';
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
    path: 'tools/json',
    icon: <SiJson className="w-4 h-4" />,
  },
  {
    id: 'qrcode',
    label: '二维码工具',
    path: 'tools/qrcode',
    icon: <IoQrCode className="w-4 h-4" />,
  },
  {
    id: 'color',
    label: '颜色工具',
    path: 'tools/color',
    icon: <IoColorPalette className="w-4 h-4" />,
  },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTab, setCurrentTab] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const tab = tabs.find((t) => window.location.hash.includes(t.path));
      
      if (tab) {
        setCurrentTab(tab.id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    setIsInitialized(true);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleTabChange = (value: string | number | null) => {
    if (typeof value === 'string') {
      const tab = tabs.find((t) => t.id === value);
      if (tab) {
        window.location.hash = `/${tab.path}`;
      }
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-200">
      {/* 顶部导航栏 */}
      <header className="w-full border-b border-divider bg-background/70 backdrop-blur-md backdrop-saturate-150 z-40 fixed top-0">
        <nav className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <a
                href="#/"
                className="inline-flex items-center text-default-500 hover:text-primary transition-colors"
              >
                <IoChevronBack className="mr-1" />
                返回首页
              </a>
              <div className="h-4 w-px bg-default-200 dark:bg-default-100" />
              <Tabs
                selectedKey={currentTab}
                onSelectionChange={handleTabChange}
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-primary",
                  tab: "h-12 px-4",
                  tabContent: "group-data-[selected=true]:text-primary font-medium"
                }}
                color="primary"
                variant="underlined"
                radius="full"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    title={
                      <div className="flex items-center space-x-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                    }
                  />
                ))}
              </Tabs>
            </div>
            <ThemeSwitch />
          </div>
        </nav>
      </header>

      {/* 内容区域 */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
