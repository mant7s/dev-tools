'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardBody, Textarea, Button, Tooltip } from '@nextui-org/react';
import { FaCopy, FaDownload, FaCheck } from 'react-icons/fa';
import { IoColorPalette } from 'react-icons/io5';
import dynamic from 'next/dynamic';

// 动态导入 QRCode 组件以避免 SSR 问题
const QRCodeSVG = dynamic(
  () => import('qrcode.react').then(mod => mod.QRCodeSVG),
  { ssr: false }
);

export default function QRCodeTool() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [copyIcon, setCopyIcon] = useState(<FaCopy className="h-4 w-4" />);

  const downloadQRCode = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, []);

  const copyQRCode = useCallback(async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopyIcon(<FaCheck className="h-4 w-4" />);
      setTimeout(() => {
        setCopyIcon(<FaCopy className="h-4 w-4" />);
      }, 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, []);

  const sizeOptions = [128, 200, 256, 512];
  const levelOptions = [
    { value: 'L' as const, label: '低容错 (7%)' },
    { value: 'M' as const, label: '中容错 (15%)' },
    { value: 'Q' as const, label: '高容错 (25%)' },
    { value: 'H' as const, label: '最高容错 (30%)' }
  ];

  // 预设颜色选项
  const presetColors = {
    foreground: [
      { label: '黑色', value: '#000000' },
      { label: '深蓝', value: '#1E40AF' },
      { label: '深紫', value: '#6B21A8' },
      { label: '深绿', value: '#15803D' },
      { label: '深红', value: '#B91C1C' },
      { label: '深棕', value: '#92400E' }
    ],
    background: [
      { label: '白色', value: '#FFFFFF' },
      { label: '浅灰', value: '#F9FAFB' },
      { label: '米色', value: '#FAFAF9' },
      { label: '浅蓝', value: '#F0F9FF' },
      { label: '浅绿', value: '#F0FDF4' },
      { label: '浅黄', value: '#FEFCE8' }
    ]
  };

  // 自定义颜色选择器组件
  const ColorPicker = ({ 
    color, 
    onChange, 
    label 
  }: { 
    color: string; 
    onChange: (color: string) => void; 
    label: string;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-small font-medium">{label}</label>
          <div className="flex items-center gap-2">
            <Tooltip content={color}>
              <div 
                className="w-6 h-6 rounded-md border border-default-200 shadow-small cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => inputRef.current?.click()}
              />
            </Tooltip>
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className="w-8 h-8"
              onClick={() => inputRef.current?.click()}
            >
              <IoColorPalette className="text-xl text-default-600" />
              <input
                ref={inputRef}
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
                aria-label={`选择${label}`}
              />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 预设颜色按钮组件
  const PresetColorButtons = ({
    colors,
    selectedColor,
    onChange,
    isBackground = false
  }: {
    colors: { label: string; value: string; }[];
    selectedColor: string;
    onChange: (color: string) => void;
    isBackground?: boolean;
  }) => (
    <div className="grid grid-cols-3 gap-2">
      {colors.map((color) => (
        <Button
          key={color.value}
          className="w-full h-16 p-1 min-w-0 group"
          variant={selectedColor === color.value ? "shadow" : "flat"}
          onClick={() => onChange(color.value)}
        >
          <div className="flex flex-col items-center gap-1">
            <div 
              className={`w-6 h-6 rounded-md shadow-small transition-transform group-hover:scale-110 ${
                isBackground && color.value === '#FFFFFF' ? 'border border-default-200' : ''
              }`}
              style={{ backgroundColor: color.value }}
            />
            <span className="text-tiny text-default-600 transition-colors group-hover:text-primary">
              {color.label}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 输入区域 */}
        <Card className="bg-content1">
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">输入文本</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="请输入要生成二维码的文本..."
                  minRows={4}
                  classNames={{
                    base: "w-full",
                    input: "resize-none",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">二维码大小</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={size === s ? "solid" : "flat"}
                      color={size === s ? "primary" : "default"}
                      onClick={() => setSize(s)}
                    >
                      {s}px
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">容错级别</label>
                <div className="flex flex-wrap gap-2">
                  {levelOptions.map((l) => (
                    <Button
                      key={l.value}
                      size="sm"
                      variant={level === l.value ? "solid" : "flat"}
                      color={level === l.value ? "primary" : "default"}
                      onClick={() => setLevel(l.value)}
                    >
                      {l.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 预览区域 */}
        <Card className="bg-content1">
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">预览</label>
                <div className="flex items-center justify-center p-4 bg-default-100 rounded-lg">
                  {text ? (
                    <div className="relative group">
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <QRCodeSVG
                          value={text}
                          size={size}
                          level={level}
                          fgColor={fgColor}
                          bgColor={bgColor}
                          includeMargin
                        />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Tooltip content="复制二维码" placement="top">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onClick={copyQRCode}
                              className="bg-white/80 backdrop-blur-sm"
                            >
                              {copyIcon}
                            </Button>
                          </Tooltip>
                          <Tooltip content="下载二维码" placement="top">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onClick={downloadQRCode}
                              className="bg-white/80 backdrop-blur-sm"
                            >
                              <FaDownload className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-default-400">
                      <div className="w-48 h-48 mx-auto mb-4 border-2 border-dashed border-default-200 rounded-xl flex items-center justify-center">
                        <span className="text-xl">二维码预览</span>
                      </div>
                      <p className="text-small">输入文本后自动生成二维码</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 颜色配置 */}
      <Card className="bg-content1">
        <CardBody>
          <div className="space-y-6">
            {/* 前景色选择 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">前景色</label>
              <ColorPicker
                color={fgColor}
                onChange={setFgColor}
                label="前景色"
              />
              <PresetColorButtons
                colors={presetColors.foreground}
                selectedColor={fgColor}
                onChange={setFgColor}
              />
            </div>

            {/* 背景色选择 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">背景色</label>
              <ColorPicker
                color={bgColor}
                onChange={setBgColor}
                label="背景色"
              />
              <PresetColorButtons
                colors={presetColors.background}
                selectedColor={bgColor}
                onChange={setBgColor}
                isBackground
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
