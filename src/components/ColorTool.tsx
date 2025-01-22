'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Button, Tooltip, ButtonGroup } from '@nextui-org/react';
import { IoColorPalette, IoShareOutline } from 'react-icons/io5';
import { MdContentCopy, MdHistory } from 'react-icons/md';
import { FaCheck, FaUndo, FaRedo } from 'react-icons/fa';
import { HiClipboardCopy } from 'react-icons/hi';

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

  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<ColorState[]>([color]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
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
    setHexInput(newColor.hex);
    setRgbInput({
      r: newColor.rgb.r.toString(),
      g: newColor.rgb.g.toString(),
      b: newColor.rgb.b.toString()
    });

    // 添加到历史记录
    if (historyIndex === history.length - 1) {
      setHistory(prev => [...prev, newColor]);
      setHistoryIndex(prev => prev + 1);
    } else {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newColor]);
      setHistoryIndex(prev => prev + 1);
    }
  };

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const rgb = hexToRgb(value);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        updateColor({
          hex: value,
          rgb,
          hsl,
          cmyk
        });
      }
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const newRgbInput = { ...rgbInput, [channel]: value };
    setRgbInput(newRgbInput);

    const r = Math.min(255, Math.max(0, parseInt(newRgbInput.r) || 0));
    const g = Math.min(255, Math.max(0, parseInt(newRgbInput.g) || 0));
    const b = Math.min(255, Math.max(0, parseInt(newRgbInput.b) || 0));

    const hex = '#' + [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
    const hsl = rgbToHsl(r, g, b);
    const cmyk = rgbToCmyk(r, g, b);

    updateColor({
      hex,
      rgb: { r, g, b },
      hsl,
      cmyk
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      const prevColor = history[historyIndex - 1];
      setColor(prevColor);
      setHexInput(prevColor.hex);
      setRgbInput({
        r: prevColor.rgb.r.toString(),
        g: prevColor.rgb.g.toString(),
        b: prevColor.rgb.b.toString()
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      const nextColor = history[historyIndex + 1];
      setColor(nextColor);
      setHexInput(nextColor.hex);
      setRgbInput({
        r: nextColor.rgb.r.toString(),
        g: nextColor.rgb.g.toString(),
        b: nextColor.rgb.b.toString()
      });
    }
  };

  return (
    <Card className="bg-content1">
      <CardBody className="gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 左侧：颜色选择器和历史记录 */}
          <div className="space-y-4">
            {/* 颜色选择器 */}
            <div ref={pickerRef} className="relative">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">颜色选择器</h3>
                <div className="flex gap-1">
                  <Tooltip content="撤销" placement="top">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      isDisabled={historyIndex === 0}
                      onClick={handleUndo}
                    >
                      <FaUndo className="h-3.5 w-3.5" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="重做" placement="top">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      isDisabled={historyIndex === history.length - 1}
                      onClick={handleRedo}
                    >
                      <FaRedo className="h-3.5 w-3.5" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <div
                className="w-full aspect-square rounded-lg cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={() => setIsPickerVisible(!isPickerVisible)}
              />
            </div>

            {/* 颜色历史记录 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">历史记录</h3>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => {
                    setHistory([color]);
                    setHistoryIndex(0);
                  }}
                >
                  <MdHistory className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {history.map((historyColor, index) => (
                  <Tooltip
                    key={index}
                    content={historyColor.hex}
                    placement="top"
                  >
                    <div
                      className={`aspect-square rounded-md cursor-pointer transition-transform hover:scale-110 ${
                        index === historyIndex ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: historyColor.hex }}
                      onClick={() => {
                        setHistoryIndex(index);
                        setColor(historyColor);
                        setHexInput(historyColor.hex);
                        setRgbInput({
                          r: historyColor.rgb.r.toString(),
                          g: historyColor.rgb.g.toString(),
                          b: historyColor.rgb.b.toString()
                        });
                      }}
                    />
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：颜色值和调整 */}
          <div className="flex flex-col h-full">
            {/* 颜色值 */}
            <div className="grid grid-cols-1 gap-4">
              {/* HEX */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">HEX</h3>
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
                      });
                    }}
                  >
                    {copyStatus.hex ? (
                      <FaCheck className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <MdContentCopy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <input
                  type="text"
                  className="w-full mt-1 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  spellCheck={false}
                />
              </div>

              {/* RGB */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">RGB</h3>
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
                      });
                    }}
                  >
                    {copyStatus.rgb ? (
                      <FaCheck className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <MdContentCopy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    className="w-16 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    value={rgbInput.r}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && parseInt(value) <= 255) {
                        handleRgbChange('r', value);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    spellCheck={false}
                  />
                  <input
                    type="text"
                    className="w-16 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    value={rgbInput.g}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && parseInt(value) <= 255) {
                        handleRgbChange('g', value);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    spellCheck={false}
                  />
                  <input
                    type="text"
                    className="w-16 px-2 py-1 font-mono text-sm bg-default-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    value={rgbInput.b}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && parseInt(value) <= 255) {
                        handleRgbChange('b', value);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* HSL */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">HSL</h3>
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
                      });
                    }}
                  >
                    {copyStatus.hsl ? (
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
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">CMYK</h3>
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
                      });
                    }}
                  >
                    {copyStatus.cmyk ? (
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
            <div className="mt-auto">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'R', value: color.rgb.r, channel: 'r' as const },
                  { label: 'G', value: color.rgb.g, channel: 'g' as const },
                  { label: 'B', value: color.rgb.b, channel: 'b' as const }
                ].map(({ label, value, channel }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-default-500">{label}</label>
                      <input
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
      </CardBody>
    </Card>
  );
}
