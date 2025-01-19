import type { Metadata } from 'next';
import ClientJsonTool from '@/components/ClientJsonTool';

export const metadata: Metadata = {
  title: 'JSON 格式化 | Dev Tools',
  description: 'JSON 格式化和压缩工具',
};

export default function JsonPage() {
  return <ClientJsonTool />;
}
