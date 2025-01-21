'use client';

import { useState, useEffect } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import { IoColorPalette } from 'react-icons/io5';
import { SiJson } from 'react-icons/si';
import { IoQrCode } from 'react-icons/io5';
import { BiTime } from 'react-icons/bi';
import ThemeSwitch from "@/components/ThemeSwitch";

interface ToolTab {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
}

const tabs: ToolTab[] = [
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
    id: 'timestamp',
    label: '时间戳工具',
    path: 'tools/timestamp',
    icon: <BiTime className="w-4 h-4" />,
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
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      // 从 URL hash 中提取路径
      const hash = window.location.hash;
      const path = hash.replace(/^#\/?/, '');
      
      // 查找匹配的标签页
      const tab = tabs.find(tab => path === tab.path);
      
      if (tab) {
        setCurrentTab(tab.id);
      }
    };

    // 监听 hash 变化
    window.addEventListener('hashchange', handleHashChange);
    
    // 初始化时检查 hash
    handleHashChange();
    setIsInitialized(true);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 处理标签页切换
  const handleTabChange = (key: string | number) => {
    if (!isInitialized) return;
    
    const tab = tabs.find(tab => tab.id === key);
    if (tab) {
      window.location.hash = `/${tab.path}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* 渐变背景层 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-md" />
        {/* 阴影效果 */}
        <div className="absolute inset-0 shadow-[0_4px_16px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_-3px_rgba(255,255,255,0.1)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
              >
                <IoChevronBack className="text-xl" />
                <span className="font-medium">返回首页</span>
              </a>
              <div className="h-4 w-px bg-default-200/50 dark:bg-default-100/20" />
              <Tabs
                aria-label="工具导航"
                color="primary"
                selectedKey={currentTab}
                onSelectionChange={handleTabChange}
                variant="light"
                classNames={{
                  base: "w-full p-0",
                  tabList: "gap-6 relative rounded-none p-0",
                  cursor: "w-full bg-primary/20 dark:bg-primary/20",
                  tab: "max-w-fit px-4 h-12",
                  tabContent: "group-data-[selected=true]:text-primary font-medium"
                }}
              >
                {tabs.map((tab) => (
                  <Tab key={tab.id} title={
                    <div className="flex items-center space-x-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                  } />
                ))}
              </Tabs>
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
