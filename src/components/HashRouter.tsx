'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function HashRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        router.push(hash);
      } else if (pathname !== '/') {
        router.push('/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    setMounted(true);

    // 初始化时检查 hash
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      router.push(hash);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [router, pathname]);

  // 在客户端渲染之前不显示任何内容
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
