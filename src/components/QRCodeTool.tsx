'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Input, Button, Select, SelectItem } from '@nextui-org/react';
import { IoCheckmark, IoQrCodeOutline } from 'react-icons/io5';
import { MdContentCopy, MdDownload } from 'react-icons/md';
import QRCode from 'qrcode';
import Image from 'next/image';

export default function QRCodeTool() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!text) {
      setQrCode('');
      return;
    }

    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
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
  }, [text, size]);

  const copyQRCode = async () => {
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

  const downloadQRCode = () => {
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
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">文本内容</h3>
              <Input
                value={text}
                onValueChange={setText}
                variant="bordered"
                placeholder="请输入要生成二维码的文本内容..."
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">二维码尺寸</h3>
              <Select
                selectedKeys={[size.toString()]}
                onChange={(e) => setSize(Number(e.target.value))}
                variant="bordered"
              >
                <SelectItem key="128" value={128}>128 x 128</SelectItem>
                <SelectItem key="256" value={256}>256 x 256</SelectItem>
                <SelectItem key="512" value={512}>512 x 512</SelectItem>
                <SelectItem key="1024" value={1024}>1024 x 1024</SelectItem>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">二维码预览</h3>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={copyQRCode}
                  isDisabled={!qrCode}
                >
                  {copied ? <IoCheckmark className="text-success" /> : <MdContentCopy />}
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={downloadQRCode}
                  isDisabled={!qrCode}
                >
                  <MdDownload />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-default-100 rounded-lg min-h-[300px]">
              {qrCode ? (
                <div className="relative" style={{ width: size, height: size }}>
                  <Image
                    src={qrCode}
                    alt="QR Code"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
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
      </CardBody>
    </Card>
  );
}
