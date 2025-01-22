'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Button, Tooltip, ButtonGroup, Input } from '@nextui-org/react';
import { IoColorPalette, IoShareOutline } from 'react-icons/io5';
import { MdContentCopy, MdHistory } from 'react-icons/md';
import { FaCheck, FaUndo, FaRedo } from 'react-icons/fa';
import { HiClipboardCopy } from 'react-icons/hi';

interface ColorFormat {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

interface ColorState {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorTool() {
  const [color, setColor] = useState<ColorState>({
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    cmyk: { c: 0, m: 0, y: 0, k: 100 }
  });
  const [hexInput, setHexInput] = useState(color.hex);
  const [rgbInput, setRgbInput] = useState({
    r: color.rgb.r.toString(),
    g: color.rgb.g.toString(),
    b: color.rgb.b.toString()
  });
  const [history, setHistory] = useState<ColorState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const colorPickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHexInput(color.hex);
    setRgbInput({
      r: color.rgb.r.toString(),
      g: color.rgb.g.toString(),
      b: color.rgb.b.toString()
    });
  }, [color]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  };

  const updateColor = (newColor: ColorState) => {
    setColor(newColor);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newColor]);
    setHistoryIndex(prev => prev + 1);
    
    if (!recentColors.includes(newColor.hex)) {
      setRecentColors(prev => [newColor.hex, ...prev].slice(0, 10));
    }
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = Math.round(l * 255);
      return { r, g, b };
    }

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    g = Math.round(hue2rgb(p, q, h) * 255);
    b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

    return { r, g, b };
  };

  const presetColors = [
    { hex: '#6366F1', name: '靛蓝' },
    { hex: '#8B5CF6', name: '紫色' },
    { hex: '#EC4899', name: '粉色' },
    { hex: '#EF4444', name: '红色' },
    { hex: '#F97316', name: '橙色' },
    { hex: '#EAB308', name: '黄色' },
    { hex: '#22C55E', name: '绿色' },
    { hex: '#06B6D4', name: '青色' },
    { hex: '#000000', name: '黑色' },
    { hex: '#FFFFFF', name: '白色' }
  ];

  const recommendedColors = {
    '主色': [
      { name: '蓝色', hex: '#2563EB' },
      { name: '紫色', hex: '#7C3AED' },
      { name: '绿色', hex: '#059669' },
      { name: '红色', hex: '#DC2626' },
      { name: '橙色', hex: '#EA580C' },
      { name: '粉色', hex: '#DB2777' },
    ],
    '中性色': [
      { name: '黑色', hex: '#000000' },
      { name: '深灰', hex: '#374151' },
      { name: '灰色', hex: '#6B7280' },
      { name: '浅灰', hex: '#D1D5DB' },
      { name: '白色', hex: '#FFFFFF' },
    ],
    '语义色': [
      { name: '成功', hex: '#059669' },
      { name: '警告', hex: '#D97706' },
      { name: '错误', hex: '#DC2626' },
      { name: '信息', hex: '#2563EB' },
    ]
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setColor(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setColor(history[historyIndex + 1]);
    }
  };

  return (
    <Card className="bg-content1 shadow-md">
      <CardBody className="p-6">
        <div className="flex flex-col gap-4">
          {/* 工具栏 */}
          <div className="flex justify-between items-center">
            <ButtonGroup size="sm" variant="flat">
              <Tooltip content="撤销" placement="top">
                <Button
                  isIconOnly
                  isDisabled={historyIndex <= 0}
                  onClick={() => {
                    if (historyIndex > 0) {
                      setHistoryIndex(prev => prev - 1);
                      setColor(history[historyIndex - 1]);
                    }
                  }}
                >
                  <FaUndo className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="重做" placement="top">
                <Button
                  isIconOnly
                  isDisabled={historyIndex >= history.length - 1}
                  onClick={() => {
                    if (historyIndex < history.length - 1) {
                      setHistoryIndex(prev => prev + 1);
                      setColor(history[historyIndex + 1]);
                    }
                  }}
                >
                  <FaRedo className="h-4 w-4" />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧：颜色选择器和最近使用的颜色 */}
            <div className="space-y-6">
              <div className="aspect-square relative rounded-xl overflow-hidden">
                <input
                  ref={colorPickerRef}
                  type="color"
                  value={color.hex}
                  onChange={(e) => {
                    const hex = e.target.value;
                    const rgb = hexToRgb(hex)!;
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
                    updateColor({ hex, rgb, hsl, cmyk });
                  }}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: color.hex }}
                />
              </div>

              {/* 最近使用的颜色 */}
              <div className="space-y-2">
                <label className="text-xs text-default-500">最近使用的颜色</label>
                <div className="grid grid-cols-8 gap-2">
                  {recentColors.map((recentColor, index) => (
                    <Tooltip key={index} content={recentColor} delay={0}>
                      <button
                        className="w-full aspect-square rounded-lg overflow-hidden ring-1 ring-default-200 hover:ring-2 hover:ring-primary transition-all"
                        style={{ backgroundColor: recentColor }}
                        onClick={() => {
                          const rgb = hexToRgb(recentColor)!;
                          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                          const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
                          updateColor({ hex: recentColor, rgb, hsl, cmyk });
                        }}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* 推荐颜色 */}
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">推荐颜色</h3>
                {Object.entries(recommendedColors).map(([category, colors]) => (
                  <div key={category} className="space-y-2">
                    <label className="text-xs text-default-500">{category}</label>
                    <div className="grid grid-cols-6 gap-2">
                      {colors.map((color) => (
                        <Tooltip key={color.hex} content={`${color.name} ${color.hex}`} delay={0}>
                          <button
                            className="w-full aspect-square rounded-lg overflow-hidden ring-1 ring-default-200 hover:ring-2 hover:ring-primary transition-all"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => {
                              const rgb = hexToRgb(color.hex)!;
                              const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                              const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
                              updateColor({ hex: color.hex, rgb, hsl, cmyk });
                            }}
                          />
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧：颜色值和调整器 */}
            <div className="flex flex-col">
              {/* 颜色值显示 */}
              <div className="grid grid-cols-1 gap-4">
                {/* HEX */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-default-500">HEX</label>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(color.hex).then(() => {
                          setCopyStatus(prev => ({ ...prev, hex: true }));
                          setTimeout(() => {
                            setCopyStatus(prev => ({ ...prev, hex: false }));
                          }, 1500);
                        }).catch(err => {
                          console.error('复制失败:', err);
                        });
                      }}
                    >
                      {copyStatus['hex'] ? (
                        <FaCheck className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <MdContentCopy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <Input
                    type="text"
                    className="w-full mt-1 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    value={hexInput}
                    onChange={(e) => {
                      const hex = e.target.value;
                      setHexInput(hex);
                      const rgb = hexToRgb(hex);
                      if (!rgb) return;

                      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

                      updateColor({
                        hex,
                        rgb,
                        hsl,
                        cmyk
                      });
                    }}
                    onBlur={() => {
                      setHexInput(color.hex);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    spellCheck={false}
                    placeholder="#000000"
                  />
                </div>

                {/* RGB */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-default-500">RGB</label>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`).then(() => {
                          setCopyStatus(prev => ({ ...prev, rgb: true }));
                          setTimeout(() => {
                            setCopyStatus(prev => ({ ...prev, rgb: false }));
                          }, 1500);
                        }).catch(err => {
                          console.error('复制失败:', err);
                        });
                      }}
                    >
                      {copyStatus['rgb'] ? (
                        <FaCheck className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <MdContentCopy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="text"
                      className="w-16 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      value={rgbInput.r}
                      onChange={(e) => {
                        const newValue = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                        const newRgbInput = { ...rgbInput, r: e.target.value };
                        setRgbInput(newRgbInput);

                        if (!isNaN(newValue)) {
                          const rgb = {
                            r: newValue,
                            g: parseInt(rgbInput.g) || 0,
                            b: parseInt(rgbInput.b) || 0
                          };

                          const hex = '#' + Object.values(rgb)
                            .map(x => x.toString(16).padStart(2, '0'))
                            .join('');
                          
                          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                          const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

                          updateColor({ hex, rgb, hsl, cmyk });
                        }
                      }}
                      onBlur={() => {
                        setRgbInput(prev => ({
                          ...prev,
                          r: color.rgb.r.toString()
                        }));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      spellCheck={false}
                    />
                    <Input
                      type="text"
                      className="w-16 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      value={rgbInput.g}
                      onChange={(e) => {
                        const newValue = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                        const newRgbInput = { ...rgbInput, g: e.target.value };
                        setRgbInput(newRgbInput);

                        if (!isNaN(newValue)) {
                          const rgb = {
                            r: parseInt(rgbInput.r) || 0,
                            g: newValue,
                            b: parseInt(rgbInput.b) || 0
                          };

                          const hex = '#' + Object.values(rgb)
                            .map(x => x.toString(16).padStart(2, '0'))
                            .join('');
                          
                          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                          const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

                          updateColor({ hex, rgb, hsl, cmyk });
                        }
                      }}
                      onBlur={() => {
                        setRgbInput(prev => ({
                          ...prev,
                          g: color.rgb.g.toString()
                        }));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      spellCheck={false}
                    />
                    <Input
                      type="text"
                      className="w-16 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      value={rgbInput.b}
                      onChange={(e) => {
                        const newValue = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                        const newRgbInput = { ...rgbInput, b: e.target.value };
                        setRgbInput(newRgbInput);

                        if (!isNaN(newValue)) {
                          const rgb = {
                            r: parseInt(rgbInput.r) || 0,
                            g: parseInt(rgbInput.g) || 0,
                            b: newValue
                          };

                          const hex = '#' + Object.values(rgb)
                            .map(x => x.toString(16).padStart(2, '0'))
                            .join('');
                          
                          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                          const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

                          updateColor({ hex, rgb, hsl, cmyk });
                        }
                      }}
                      onBlur={() => {
                        setRgbInput(prev => ({
                          ...prev,
                          b: color.rgb.b.toString()
                        }));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* HSL */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-default-500">HSL</label>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`).then(() => {
                          setCopyStatus(prev => ({ ...prev, hsl: true }));
                          setTimeout(() => {
                            setCopyStatus(prev => ({ ...prev, hsl: false }));
                          }, 1500);
                        }).catch(err => {
                          console.error('复制失败:', err);
                        });
                      }}
                    >
                      {copyStatus['hsl'] ? (
                        <FaCheck className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <MdContentCopy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-sm mt-1 px-2 py-1 bg-default-100 rounded-lg">
                    hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
                  </div>
                </div>

                {/* CMYK */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-default-500">CMYK</label>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`cmyk(${color.cmyk.c}, ${color.cmyk.m}, ${color.cmyk.y}, ${color.cmyk.k})`).then(() => {
                          setCopyStatus(prev => ({ ...prev, cmyk: true }));
                          setTimeout(() => {
                            setCopyStatus(prev => ({ ...prev, cmyk: false }));
                          }, 1500);
                        }).catch(err => {
                          console.error('复制失败:', err);
                        });
                      }}
                    >
                      {copyStatus['cmyk'] ? (
                        <FaCheck className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <MdContentCopy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-sm mt-1 px-2 py-1 bg-default-100 rounded-lg">
                    cmyk({color.cmyk.c}, {color.cmyk.m}, {color.cmyk.y}, {color.cmyk.k})
                  </div>
                </div>
              </div>

              {/* 颜色值调整 */}
              <div className="mt-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'R', value: color.rgb.r, channel: 'r' as const },
                    { label: 'G', value: color.rgb.g, channel: 'g' as const },
                    { label: 'B', value: color.rgb.b, channel: 'b' as const }
                  ].map(({ label, value, channel }) => (
                    <div key={label} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-default-500">{label}</label>
                        <Input
                          type="number"
                          className="w-12 text-xs font-medium text-right bg-transparent"
                          value={value}
                          onChange={(e) => {
                            const newValue = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                            const newRgb = { ...color.rgb, [channel]: newValue };
                            const hex = '#' + Object.values(newRgb)
                              .map(x => x.toString(16).padStart(2, '0'))
                              .join('');
                            const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
                            const cmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b);

                            updateColor({
                              hex,
                              rgb: newRgb,
                              hsl,
                              cmyk
                            });
                          }}
                          min="0"
                          max="255"
                        />
                      </div>
                      <div 
                        className="h-1 rounded-full bg-default-100 overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const percent = x / rect.width;
                          const newValue = Math.round(percent * 255);
                          const newRgb = { ...color.rgb, [channel]: newValue };
                          const hex = '#' + Object.values(newRgb)
                            .map(x => x.toString(16).padStart(2, '0'))
                            .join('');
                          const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
                          const cmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b);

                          updateColor({
                            hex,
                            rgb: newRgb,
                            hsl,
                            cmyk
                          });
                        }}
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(value / 255) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
