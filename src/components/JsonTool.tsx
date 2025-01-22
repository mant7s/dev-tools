'use client';

import React, { useState } from 'react';
import { Card, CardBody, Button, ButtonGroup } from "@nextui-org/react";
import { MdContentCopy } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { editor } from 'monaco-editor';

export default function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const { resolvedTheme } = useTheme();

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'off' as const,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    formatOnPaste: true,
    automaticLayout: true,
  };

  const formatJson = (jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch {
      return '';
    }
  };

  const minifyJson = (jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj);
    } catch {
      return '';
    }
  };

  const handleInputChange = (value: string = '') => {
    setInput(value);
    setError('');

    if (!value.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = mode === 'format' ? formatJson(value) : minifyJson(value);
      setOutput(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('无效的 JSON 格式');
      }
      setOutput('');
    }
  };

  const handleFormat = () => {
    setMode('format');
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      return;
    }

    try {
      const formatted = formatJson(input);
      setOutput(formatted);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('无效的 JSON 格式');
      }
    }
  };

  const handleMinify = () => {
    setMode('minify');
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      return;
    }

    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('无效的 JSON 格式');
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <Card className="bg-content1 shadow-md">
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧：输入区域 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">输入</h3>
              <ButtonGroup variant="flat">
                <Button
                  size="sm"
                  onClick={handleFormat}
                  className={mode === 'format' ? 'bg-primary/20' : ''}
                >
                  格式化
                </Button>
                <Button
                  size="sm"
                  onClick={handleMinify}
                  className={mode === 'minify' ? 'bg-primary/20' : ''}
                >
                  压缩
                </Button>
              </ButtonGroup>
            </div>
            <div className="h-[calc(100vh-280px)] rounded-lg overflow-hidden border-2 border-default-200 dark:border-default-100">
              <Editor
                defaultLanguage="json"
                value={input}
                onChange={handleInputChange}
                theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                options={editorOptions}
              />
            </div>
          </div>

          {/* 右侧：输出区域 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">输出</h3>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => copyToClipboard(output)}
                isDisabled={!output}
              >
                {copied ? <IoCheckmark className="text-success" /> : <MdContentCopy />}
              </Button>
            </div>
            <div className="h-[calc(100vh-280px)] rounded-lg overflow-hidden border-2 border-default-200 dark:border-default-100">
              <Editor
                defaultLanguage="json"
                value={output}
                theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  ...editorOptions,
                  readOnly: true,
                }}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-danger">{error}</p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
