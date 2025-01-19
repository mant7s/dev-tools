import type { Metadata } from 'next';
import ClientQRCodeTool from '@/components/ClientQRCodeTool';

export const metadata: Metadata = {
  title: '二维码生成 | Dev Tools',
  description: '在线二维码生成工具',
};

export default function QRCodePage() {
  return <ClientQRCodeTool />;
}
