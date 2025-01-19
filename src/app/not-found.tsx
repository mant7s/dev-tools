'use client';

import { Button } from '@nextui-org/react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">页面未找到</h2>
      <p className="text-default-500 mb-6">抱歉，您访问的页面不存在。</p>
      <Button
        color="primary"
        href="/"
      >
        返回首页
      </Button>
    </div>
  );
}
