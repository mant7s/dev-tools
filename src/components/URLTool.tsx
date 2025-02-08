"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Button, Textarea } from "@nextui-org/react";

export default function URLTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleConvert = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (_error) {
      setOutput("转换失败：输入内容无效");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">URL 转换工具</p>
          <p className="text-small text-default-500">在线进行 URL 编码和解码</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              color={mode === "encode" ? "primary" : "default"}
              onClick={() => setMode("encode")}
            >
              编码
            </Button>
            <Button
              color={mode === "decode" ? "primary" : "default"}
              onClick={() => setMode("decode")}
            >
              解码
            </Button>
          </div>
          <Textarea
            label="输入内容"
            placeholder={mode === "encode" ? "输入要编码的 URL" : "输入要解码的 URL"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button color="primary" onClick={handleConvert}>
            转换
          </Button>
          <Textarea
            label="输出结果"
            value={output}
            readOnly
          />
        </div>
      </CardBody>
    </Card>
  );
}