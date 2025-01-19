'use client';

import dynamic from 'next/dynamic';

const QRCodeTool = dynamic(() => import('./QRCodeTool'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center">
      <div className="text-default-500">加载中...</div>
    </div>
  )
});

export default function ClientQRCodeTool() {
  return <QRCodeTool />;
}
