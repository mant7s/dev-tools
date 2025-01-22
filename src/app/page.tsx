'use client';

import { Card, CardBody } from "@nextui-org/react";
import { MdArrowOutward } from "react-icons/md";
import { SiJson } from "react-icons/si";
import { IoQrCode, IoColorPalette } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { BsHourglassSplit } from "react-icons/bs";
import ThemeSwitch from "@/components/ThemeSwitch";

const tools = [
  {
    title: "JSON 工具",
    description: "格式化、压缩、转换 JSON 数据",
    href: "#/tools/json",
    icon: <SiJson className="w-5 h-5" />,
    decorativeIcon: <SiJson className="w-48 h-48" />,
    gradient: "from-[#FF1CF7] to-[#7928CA]",
    glowColor: "hover:shadow-[#FF1CF7]/30",
    disabled: false,
  },
  {
    title: "二维码工具",
    description: "生成和解析二维码",
    href: "#/tools/qrcode",
    icon: <IoQrCode className="w-5 h-5" />,
    decorativeIcon: <IoQrCode className="w-48 h-48" />,
    gradient: "from-[#5EA2EF] to-[#0072F5]",
    glowColor: "hover:shadow-[#0072F5]/30",
    disabled: false,
  },
  {
    title: "时间戳工具",
    description: "时间戳转换工具",
    href: "#/tools/timestamp",
    icon: <BiTime className="w-5 h-5" />,
    decorativeIcon: <BiTime className="w-48 h-48" />,
    gradient: "from-[#0072F5] to-[#0055B5]",
    glowColor: "hover:shadow-[#0072F5]/30",
    disabled: false,
  },
  {
    title: "颜色工具",
    description: "颜色格式转换、调色板生成",
    href: "#/tools/color",
    icon: <IoColorPalette className="w-5 h-5" />,
    decorativeIcon: <IoColorPalette className="w-48 h-48" />,
    gradient: "from-[#FF4D4D] to-[#F31260]",
    glowColor: "hover:shadow-[#F31260]/30",
    disabled: false,
  },
  {
    title: "敬请期待",
    description: "更多工具正在开发中...",
    href: "",
    icon: <BsHourglassSplit className="w-5 h-5" />,
    decorativeIcon: <BsHourglassSplit className="w-48 h-48" />,
    gradient: "from-[#7828C8] to-[#4C2889]",
    glowColor: "hover:shadow-[#7828C8]/30",
    disabled: true,
  },
];

export default function Home() {
  return (
    <main className="relative w-full min-h-screen flex flex-col items-center bg-white dark:bg-black transition-colors duration-200">
      {/* 主题切换按钮 */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeSwitch />
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 左上角装饰 */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/5 rounded-full blur-3xl" />
        {/* 右下角装饰 */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-secondary/20 to-transparent dark:from-secondary/5 rounded-full blur-3xl" />
        {/* 中间装饰点 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 dark:bg-primary/10 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary/30 dark:bg-secondary/10 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary/30 dark:bg-primary/10 rounded-full" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-secondary/30 dark:bg-secondary/10 rounded-full" />
      </div>

      {/* 内容区域 */}
      <div className="relative w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center z-10">
        {/* 标题区域 */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6">
            开发者工具箱
          </h1>
          <p className="text-xl text-default-500">
            快速、高效的开发辅助工具集
          </p>
        </div>

        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {tools.map((tool) => (
            <Card
              key={tool.title}
              isPressable={!tool.disabled}
              isHoverable={!tool.disabled}
              className={`w-full h-full bg-gradient-to-br ${tool.gradient} relative dark:opacity-90 transition-all duration-300 ${!tool.disabled ? `hover:scale-[1.02] shadow-lg ${tool.glowColor}` : 'cursor-not-allowed'} overflow-hidden`}
              onPress={() => {
                if (!tool.disabled && tool.href) {
                  window.location.replace(tool.href);
                }
              }}
            >
              <CardBody className="p-6 relative overflow-hidden">
                {/* 装饰性图标背景 */}
                <div className="absolute -top-8 -right-8 opacity-10 transform rotate-12 transition-transform duration-300 group-hover:rotate-6">
                  {tool.decorativeIcon}
                </div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-white">
                      {tool.icon}
                    </div>
                  </div>
                  <div className={`p-2 rounded-full bg-white/20 backdrop-blur-sm ${!tool.disabled && 'transform transition-transform duration-300 group-hover:rotate-45'}`}>
                    <MdArrowOutward className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white mb-2">{tool.title}</h2>
                  <p className="text-white/90 dark:text-white/80">{tool.description}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
