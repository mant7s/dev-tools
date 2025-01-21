'use client';

import { IoColorPalette, IoQrCode } from 'react-icons/io5';
import { MdArrowOutward } from "react-icons/md";
import { BsHourglassSplit } from 'react-icons/bs';
import ThemeSwitch from "@/components/ThemeSwitch";
import { SiJson } from 'react-icons/si';

const tools = [
  {
    title: "JSON 工具",
    description: "JSON 格式化、压缩、美化工具",
    icon: <SiJson className="w-8 h-8" />,
    decorativeIcon: <SiJson className="w-32 h-32" />,
    path: "tools/json",
    gradient: "from-[#FF4B4B] to-[#A90000]",
    glowColor: "group-hover:shadow-[#FF4B4B]/20",
  },
  {
    title: "二维码工具",
    description: "生成和解析二维码",
    icon: <IoQrCode className="w-8 h-8" />,
    decorativeIcon: <IoQrCode className="w-32 h-32" />,
    path: "tools/qrcode",
    gradient: "from-[#007AFF] to-[#0055B0]",
    glowColor: "group-hover:shadow-[#007AFF]/20",
  },
  {
    title: "颜色工具",
    description: "颜色格式转换、调色板",
    icon: <IoColorPalette className="w-8 h-8" />,
    decorativeIcon: <IoColorPalette className="w-32 h-32" />,
    path: "tools/color",
    gradient: "from-[#17C964] to-[#0F9549]",
    glowColor: "group-hover:shadow-[#17C964]/20",
  },
  {
    title: "敬请期待",
    description: "更多工具正在开发中...",
    icon: <BsHourglassSplit className="w-8 h-8" />,
    decorativeIcon: <BsHourglassSplit className="w-32 h-32" />,
    path: "#",
    gradient: "from-[#7828C8] to-[#4C2889]",
    glowColor: "group-hover:shadow-[#7828C8]/20",
    disabled: true,
  }
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-hidden">
          {tools.map((tool) => (
            tool.disabled ? (
              <div 
                key={tool.title}
                className={`group w-full h-full bg-gradient-to-br ${tool.gradient} relative dark:opacity-90 cursor-not-allowed transition-all duration-300 shadow-lg rounded-xl ${tool.glowColor} overflow-hidden`}
              >
                <div className="p-6 relative overflow-hidden">
                  {/* 装饰性图标背景 */}
                  <div className="absolute -top-8 -right-8 opacity-10 transform rotate-12 transition-transform duration-300 group-hover:rotate-6 overflow-hidden">
                    {tool.decorativeIcon}
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-white">
                        {tool.icon}
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm opacity-50">
                      <MdArrowOutward className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h2 className="text-xl font-semibold text-white mb-2">{tool.title}</h2>
                    <p className="text-white/90 dark:text-white/80">{tool.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={tool.title}
                href={`#/${tool.path}`}
                className="block group"
              >
                <div 
                  className={`w-full h-full bg-gradient-to-br ${tool.gradient} relative dark:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg rounded-xl ${tool.glowColor} overflow-hidden`}
                >
                  <div className="p-6 relative overflow-hidden">
                    {/* 装饰性图标背景 */}
                    <div className="absolute -top-8 -right-8 opacity-10 transform rotate-12 transition-transform duration-300 group-hover:rotate-6 overflow-hidden">
                      {tool.decorativeIcon}
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                        <div className="text-white">
                          {tool.icon}
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm transform transition-transform duration-300 group-hover:rotate-45">
                        <MdArrowOutward className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-xl font-semibold text-white mb-2">{tool.title}</h2>
                      <p className="text-white/90 dark:text-white/80">{tool.description}</p>
                    </div>
                  </div>
                </div>
              </a>
            )
          ))}
        </div>
      </div>
    </main>
  );
}
