'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardBody, Textarea, Button, Tooltip, Slider, Select, SelectItem } from '@nextui-org/react';
import { MdContentCopy, MdDownload } from 'react-icons/md';
import { IoCheckmark, IoQrCodeOutline, IoColorPalette } from 'react-icons/io5';
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
  const [copyIcon, setCopyIcon] = useState(<MdContentCopy className="h-4 w-4" />);
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
      setCopyIcon(<IoCheckmark className="h-4 w-4" />);
      setTimeout(() => {
        setCopyIcon(<MdContentCopy className="h-4 w-4" />);
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

  useEffect(() => {
    if (!text) {
      setQrCode('');
      return;
    }

    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then(url => {
        setQrCode(url);
        setError('');
      })
      .catch(err => {
        console.error('生成二维码失败:', err);
        setError('生成二维码失败');
        setQrCode('');
      });
  }, [text, size, fgColor, bgColor]);

  const copyQRCodeHandler = async () => {
    try {
      if (!qrCode) return;

      const response = await fetch(qrCode);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const downloadQRCodeHandler = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-content1 shadow-md">
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧：生成二维码 */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">生成二维码</h3>
              <Textarea
                placeholder="请输入文本或网址..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full"
                minRows={4}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">二维码大小</label>
                <Slider
                  size="sm"
                  step={50}
                  maxValue={400}
                  minValue={100}
                  value={size}
                  onChange={setSize}
                  className="max-w-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">容错级别</label>
                <Select
                  size="sm"
                  selectedKeys={[level]}
                  onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                >
                  {levelOptions.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                color="primary"
                isDisabled={!text}
                onClick={downloadQRCodeHandler}
                startContent={<MdDownload className="text-xl" />}
              >
                下载二维码
              </Button>
            </div>
          </div>

          {/* 右侧：预览 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">二维码预览</h3>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={copyQRCodeHandler}
                  isDisabled={!qrCode}
                >
                  {copied ? <IoCheckmark className="text-success" /> : <MdContentCopy />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-default-100 rounded-lg min-h-[300px]">
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="max-w-full h-auto"
                  style={{ width: size }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-default-400">
                  <IoQrCodeOutline className="w-16 h-16 mb-2" />
                  <p className="text-sm">输入内容后将生成二维码</p>
                </div>
              )}
            </div>
            {error && (
              <div className="mt-2 text-danger text-sm">{error}</div>
            )}
          </div>
        </div>

        {/* 颜色配置 */}
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
  );
}
