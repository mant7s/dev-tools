'use client';

import { useState, useCallback } from 'react';
import { Card, CardBody, Button, Textarea } from "@nextui-org/react";
import { MdContentCopy } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";

export default function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const formatJson = useCallback((jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch (err) {
      return '';
    }
  }, []);

  const minifyJson = useCallback((jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj);
    } catch (err) {
      return '';
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setError('');

    if (!value.trim()) {
      setOutput('');
      return;
    }

    try {
      const formatted = formatJson(value);
      setOutput(formatted);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('无效的 JSON 格式');
      }
      setOutput('');
    }
  }, [formatJson]);

  const handleFormat = useCallback(() => {
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
  }, [input, formatJson]);

  const handleMinify = useCallback(() => {
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
  }, [input, minifyJson]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, []);

  return (
    <Card className="bg-content1 shadow-md">
      <CardBody className="p-6">
        <div className="flex flex-col gap-6">
          {/* 输入区域 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">输入</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="light"
                  onClick={handleFormat}
                >
                  格式化
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  onClick={handleMinify}
                >
                  压缩
                </Button>
              </div>
            </div>
            <Textarea
              value={input}
              onValueChange={handleInputChange}
              placeholder="请输入 JSON 数据..."
              minRows={8}
              variant="bordered"
              classNames={{
                input: "font-mono",
              }}
            />
          </div>

          {/* 输出区域 */}
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
            <Textarea
              value={output}
              isReadOnly
              placeholder="JSON 输出..."
              minRows={8}
              variant="bordered"
              color={error ? "danger" : "default"}
              errorMessage={error}
              classNames={{
                input: "font-mono",
              }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
