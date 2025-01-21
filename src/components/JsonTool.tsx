'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardBody, Button, ButtonGroup, Tooltip, Tabs, Tab } from "@nextui-org/react";
import { FaExpand, FaCompress, FaUndo, FaRedo, FaCheck } from "react-icons/fa";
import { MdUpload, MdDownload, MdContentCopy } from "react-icons/md";
import { IoMdWarning } from "react-icons/io";
import dynamic from 'next/dynamic';
import { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';

// 动态导入 Monaco Editor 以避免 SSR 问题
const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

export default function JsonTool() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'format' | 'compress'>('format');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  // 等待客户端渲染完成
  useEffect(() => {
    setMounted(true);
  }, []);

  // 编辑器主题配置
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
  } as const;

  // 编辑器加载前的配置
  const handleBeforeMount = useCallback((monaco: typeof import('monaco-editor')) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#000000',
      }
    });
    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      }
    });
  }, []);

  // 编辑器加载完成后的配置
  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    if (mounted) {
      const theme = resolvedTheme === 'dark' ? 'custom-dark' : 'custom-light';
      monaco.editor.setTheme(theme);
    }
  }, [resolvedTheme, mounted]);

  // 处理 JSON 格式化
  const formatJson = useCallback((input: string) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonOutput(formatted);
      setError('');
      const newHistory = [...history.slice(0, historyIndex + 1), formatted];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的 JSON 格式');
      setJsonOutput('');
    }
  }, [history, historyIndex]);

  // 处理 JSON 压缩
  const compressJson = useCallback((input: string) => {
    try {
      const parsed = JSON.parse(input);
      const compressed = JSON.stringify(parsed);
      setJsonOutput(compressed);
      setError('');
      const newHistory = [...history.slice(0, historyIndex + 1), compressed];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的 JSON 格式');
      setJsonOutput('');
    }
  }, [history, historyIndex]);

  // 处理选项卡切换
  const handleTabChange = useCallback((key: React.Key) => {
    const newTab = key as 'format' | 'compress';
    setActiveTab(newTab);
    if (jsonInput) {
      if (newTab === 'format') {
        formatJson(jsonInput);
      } else {
        compressJson(jsonInput);
      }
    }
  }, [jsonInput, formatJson, compressJson]);

  // 处理 JSON 转换
  const handleTransform = useCallback(() => {
    if (activeTab === 'format') {
      formatJson(jsonInput);
    } else {
      compressJson(jsonInput);
    }
  }, [activeTab, jsonInput, formatJson, compressJson]);

  // 撤销
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setJsonOutput(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  // 重做
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setJsonOutput(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  // 处理文件上传
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      if (activeTab === 'format') {
        formatJson(content);
      } else {
        compressJson(content);
      }
    };
    reader.readAsText(file);
  }, [activeTab, formatJson, compressJson]);

  // 处理文件下载
  const handleDownload = useCallback(() => {
    if (!jsonOutput) return;

    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [jsonOutput]);

  // 复制到剪贴板
  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [text]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [text]: false }));
      }, 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, []);

  // 如果还没有挂载，显示加载状态
  if (!mounted) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <Card className="bg-content1">
          <CardBody>
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-default-500">加载中...</div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Card className="bg-content1 shadow-md">
      <CardBody className="p-6">
        <div className="flex flex-col gap-4">
          {/* 工具栏 */}
          <div className="flex items-center justify-between">
            <Tabs 
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as 'format' | 'compress')}
              variant="light"
              color="primary"
              classNames={{
                base: "w-full p-0",
                tabList: "gap-6 relative rounded-none p-0",
                cursor: "w-full bg-primary/20 dark:bg-primary/20",
                tab: "max-w-fit px-4 h-12",
                tabContent: "group-data-[selected=true]:text-primary font-medium"
              }}
            >
              <Tab
                key="format"
                title={
                  <div className="flex items-center gap-2">
                    <FaExpand className="h-4 w-4" />
                    <span>格式化</span>
                  </div>
                }
              />
              <Tab
                key="compress"
                title={
                  <div className="flex items-center gap-2">
                    <FaCompress className="h-4 w-4" />
                    <span>压缩</span>
                  </div>
                }
              />
            </Tabs>
          </div>

          {/* 工具栏按钮 */}
          <div className="flex items-center gap-2">
            <ButtonGroup size="sm" variant="flat">
              <Tooltip content="撤销" placement="top">
                <Button
                  isIconOnly
                  isDisabled={historyIndex <= 0}
                  onClick={handleUndo}
                >
                  <FaUndo className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="重做" placement="top">
                <Button
                  isIconOnly
                  isDisabled={historyIndex >= history.length - 1}
                  onClick={handleRedo}
                >
                  <FaRedo className="h-4 w-4" />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <Card className="p-4 flex-1">
              <div className="flex flex-col gap-4 h-[600px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">输入 JSON</h3>
                  <Button
                    variant="light"
                    size="sm"
                    startContent={copyStatus[activeTab] ? <FaCheck className="text-success" /> : <MdContentCopy />}
                    onClick={() => {
                      navigator.clipboard.writeText(jsonInput).then(() => {
                        setCopyStatus(prev => ({ ...prev, [activeTab]: true }));
                        setTimeout(() => {
                          setCopyStatus(prev => ({ ...prev, [activeTab]: false }));
                        }, 1500);
                      }).catch(err => {
                        console.error('复制失败:', err);
                      });
                    }}
                  >
                    {copyStatus[activeTab] ? '已复制' : '复制'}
                  </Button>
                </div>
                <Editor
                  height="600px"
                  defaultLanguage="json"
                  value={jsonInput}
                  onChange={(value) => setJsonInput(value || '')}
                  options={editorOptions}
                  beforeMount={handleBeforeMount}
                  onMount={handleEditorDidMount}
                  className="overflow-hidden rounded-b-lg"
                />
              </div>
            </Card>

            {/* 输出区域 */}
            <Card className="p-4 flex-1">
              <div className="flex flex-col gap-4 h-[600px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">输出 JSON</h3>
                  <Button
                    variant="light"
                    size="sm"
                    startContent={copyStatus[activeTab] ? <FaCheck className="text-success" /> : <MdContentCopy />}
                    onClick={() => {
                      navigator.clipboard.writeText(jsonOutput).then(() => {
                        setCopyStatus(prev => ({ ...prev, [activeTab]: true }));
                        setTimeout(() => {
                          setCopyStatus(prev => ({ ...prev, [activeTab]: false }));
                        }, 1500);
                      }).catch(err => {
                        console.error('复制失败:', err);
                      });
                    }}
                  >
                    {copyStatus[activeTab] ? '已复制' : '复制'}
                  </Button>
                </div>
                <Editor
                  height="400px"
                  defaultLanguage="json"
                  value={jsonOutput}
                  options={{ ...editorOptions, readOnly: true }}
                  beforeMount={handleBeforeMount}
                  onMount={handleEditorDidMount}
                  className="overflow-hidden rounded-b-lg"
                />
              </div>
            </Card>
          </div>

          {/* 错误提示 */}
          {error && (
            <Card className="bg-danger-50 border-danger">
              <CardBody>
                <div className="flex items-center gap-2 text-danger text-sm">
                  <IoMdWarning className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* 转换按钮 */}
          <div className="flex justify-center">
            <Button
              size="lg"
              color="primary"
              className="px-8"
              isDisabled={!jsonInput}
              onClick={handleTransform}
            >
              {activeTab === 'format' ? '格式化' : '压缩'}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
