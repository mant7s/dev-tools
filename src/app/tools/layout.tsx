'use client';

import { useState, useEffect } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { IoChevronBack } from 'react-icons/io5';
import { IoColorPalette } from 'react-icons/io5';
import { SiJson } from 'react-icons/si';
import { IoQrCode } from 'react-icons/io5';
import { BiTime } from 'react-icons/bi';
import ThemeSwitch from "@/components/ThemeSwitch";
import Link from 'next/link';

interface ToolTab {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const tabs: ToolTab[] = [
  {
    id: 'json',
    label: 'JSON 工具',
    path: '#/tools/json',
    icon: <SiJson className="w-4 h-4" />,
  },
  {
    id: 'qrcode',
    label: '二维码工具',
    path: '#/tools/qrcode',
    icon: <IoQrCode className="w-4 h-4" />,
  },
  {
    id: 'timestamp',
    label: '时间戳工具',
    path: '#/tools/timestamp',
    icon: <BiTime className="w-4 h-4" />,
  },
  {
    id: 'color',
    label: '颜色工具',
    path: '#/tools/color',
    icon: <IoColorPalette className="w-4 h-4" />,
  },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTab, setCurrentTab] = useState<string>('json');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = hash.replace(/^#\/?/, '');
      const tab = tabs.find(t => path.includes(t.id));
      if (tab) {
        setCurrentTab(tab.id);
      }
    };

    // 初始化时检查 hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (!hash || hash === '#') {
        // 如果没有 hash，设置默认工具
        window.location.replace('#/tools/json');
      }
      handleHashChange();
    }

    // 监听 hash 变化
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleTabChange = (key: React.Key) => {
    const tab = tabs.find(t => t.id === key);
    if (tab) {
      window.location.replace(tab.path);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/70 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.replace('/');
                }}
              >
                <IoChevronBack className="text-xl" />
                <span className="font-medium">返回首页</span>
              </Link>
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
      <div className="container mx-auto px-4 pt-8">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
