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
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 操作栏 */}
      <Card className="bg-content1">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={handleTabChange}
                variant="solid"
                color="primary"
                radius="full"
                classNames={{
                  base: "w-full",
                  tabList: "bg-default-100 p-0.5",
                  cursor: "bg-primary",
                  tab: "px-4 py-2",
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

            <div className="flex items-center gap-2">
              <ButtonGroup variant="flat">
                <Tooltip content="撤销">
                  <Button
                    isIconOnly
                    isDisabled={historyIndex <= 0}
                    onClick={handleUndo}
                  >
                    <FaUndo className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="重做">
                  <Button
                    isIconOnly
                    isDisabled={historyIndex >= history.length - 1}
                    onClick={handleRedo}
                  >
                    <FaRedo className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </ButtonGroup>

              <ButtonGroup variant="flat">
                <Tooltip content="上传文件">
                  <Button
                    isIconOnly
                    as="label"
                    className="cursor-pointer"
                  >
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <MdUpload className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="下载">
                  <Button
                    isIconOnly
                    isDisabled={!jsonOutput}
                    onClick={handleDownload}
                  >
                    <MdDownload className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 输入区域 */}
        <Card className="bg-content1">
          <CardBody className="p-0">
            <div className="flex justify-between items-center p-3 border-b border-divider">
              <h3 className="text-sm font-medium">输入 JSON</h3>
              <Tooltip content={copyStatus['input'] ? "已复制！" : "复制"}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  isDisabled={!jsonInput}
                  onClick={() => handleCopy(jsonInput)}
                >
                  {copyStatus['input'] ? (
                    <FaCheck className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <MdContentCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </Tooltip>
            </div>
            <Editor
              height="400px"
              defaultLanguage="json"
              value={jsonInput}
              onChange={(value) => setJsonInput(value || '')}
              options={editorOptions}
              beforeMount={handleBeforeMount}
              onMount={handleEditorDidMount}
              className="overflow-hidden rounded-b-lg"
            />
          </CardBody>
        </Card>

        {/* 输出区域 */}
        <Card className="bg-content1">
          <CardBody className="p-0">
            <div className="flex justify-between items-center p-3 border-b border-divider">
              <h3 className="text-sm font-medium">输出 JSON</h3>
              <Tooltip content={copyStatus['output'] ? "已复制！" : "复制"}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  isDisabled={!jsonOutput}
                  onClick={() => handleCopy(jsonOutput)}
                >
                  {copyStatus['output'] ? (
                    <FaCheck className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <MdContentCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </Tooltip>
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
          </CardBody>
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
  );
}
