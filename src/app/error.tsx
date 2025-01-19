'use client';

import { useEffect } from 'react';
import { Button } from '@nextui-org/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">出错了</h2>
      <p className="text-default-500 mb-6">抱歉，发生了一些错误。</p>
      <Button
        color="primary"
        onClick={reset}
      >
        重试
      </Button>
    </div>
  );
}
