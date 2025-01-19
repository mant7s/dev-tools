'use client';

import dynamic from 'next/dynamic';

const JsonTool = dynamic(() => import('./JsonTool'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center">
      <div className="text-default-500">加载中...</div>
    </div>
  )
});

export default function ClientJsonTool() {
  return <JsonTool />;
}
