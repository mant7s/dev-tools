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
      const hash = window.location.hash.slice(1).replace(/^\//, '');
      const tab = tabs.find(tab => tab.path === hash);
      
      if (tab) {
        setCurrentTab(tab.id);
      }
    };

    // 初始化时检查 hash
    handleHashChange();
    setIsInitialized(true);

    // 监听 hash 变化
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 只有在组件初始化后才处理标签页选择
  const handleTabChange = (key: string | number) => {
    if (!isInitialized) return;
    
    const tab = tabs.find(tab => tab.id === key);
    if (tab) {
      window.location.hash = tab.path;
    }
  };

  return (
    <main className="min-h-screen">
      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl shadow-sm dark:shadow-zinc-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="inline-flex items-center text-default-500 hover:text-primary transition-colors"
              >
                <IoChevronBack className="mr-1" />
                返回首页
              </a>
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
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </main>
  );
}
