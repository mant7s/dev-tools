'use client';

import { Tabs, Tab, Button } from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ThemeSwitch from "@/components/ThemeSwitch";
import { MdHome } from "react-icons/md";
import { 
  FaCode, 
  FaQrcode, 
  FaPalette 
} from "react-icons/fa";
import { IconType } from "react-icons";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      id: "json",
      title: "JSON",
      href: "/tools/json",
      icon: FaCode
    },
    {
      id: "qrcode",
      title: "二维码",
      href: "/tools/qrcode",
      icon: FaQrcode
    },
    {
      id: "color",
      title: "颜色转换",
      href: "/tools/color",
      icon: FaPalette
    }
  ] as const;

  const handleTabChange = (key: React.Key) => {
    const tab = tabs.find(tab => tab.id === key);
    if (tab) {
      router.push(tab.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* 装饰层 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 顶部装饰 */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        {/* 中间装饰 */}
        <div className="absolute inset-x-0 top-[25%] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative right-[calc(0%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary to-primary opacity-10 sm:right-[calc(0%-36rem)] sm:w-[72.1875rem]"></div>
        </div>

        {/* 底部装饰 */}
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative right-[calc(0%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-10 sm:right-[calc(0%-36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      {/* 内容层 */}
      <div className="relative">
        {/* 顶部导航栏 */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl backdrop-saturate-150 bg-background/60">
          <div className="max-w-7xl mx-auto">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <Button
                  as={Link}
                  href="/"
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-default-600 hover:text-primary data-[hover=true]:bg-primary/10 min-w-unit-8 w-unit-8 h-unit-8"
                >
                  <MdHome className="h-5 w-5" />
                </Button>
                <Tabs
                  selectedKey={tabs.find(tab => tab.href === pathname)?.id}
                  onSelectionChange={handleTabChange}
                  aria-label="工具选项"
                  color="primary"
                  variant="light"
                  classNames={{
                    base: "w-full",
                    tabList: "gap-6",
                    tab: "h-12 px-4 data-[hover=true]:bg-content2/40 group",
                    tabContent: "text-sm group-data-[selected=true]:font-medium",
                    cursor: "bg-primary/20 dark:bg-primary/20",
                    panel: "p-0"
                  }}
                >
                  {tabs.map((tab) => {
                    const Icon: IconType = tab.icon;
                    return (
                      <Tab
                        key={tab.id}
                        title={
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-default-500 group-data-[selected=true]:text-primary" />
                            <span>{tab.title}</span>
                          </div>
                        }
                      />
                    );
                  })}
                </Tabs>
              </div>
              <ThemeSwitch />
            </div>
          </div>
        </nav>

        {/* 主内容区域 */}
        <main className="relative z-40 flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
