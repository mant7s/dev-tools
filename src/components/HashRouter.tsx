'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from '@nextui-org/react';
import ToolsLayout from '@/app/tools/layout';

// 定义工具路径类型
type ToolPath = 'tools/json' | 'tools/qrcode' | 'tools/color' | 'tools/timestamp' | 'tools/base64' | 'tools/url';

// 动态导入工具组件
const tools: Record<ToolPath, { component: React.ComponentType }> = {
  'tools/json': {
    component: dynamic(() => import('@/components/JsonTool'), {
      loading: () => <Spinner />,
      ssr: false,
    }),
  },
  'tools/qrcode': {
    component: dynamic(() => import('@/components/QRCodeTool'), {
      loading: () => <Spinner />,
      ssr: false,
    }),
  },
  'tools/color': {
    component: dynamic(() => import('@/components/ColorTool'), {
      loading: () => <Spinner />,
      ssr: false,
    }),
  },
  'tools/timestamp': {
    component: dynamic(() => import('@/components/TimestampTool'), {
      loading: () => <Spinner />,
      ssr: false,
    }),
  },
  'tools/base64': {
    component: dynamic(() => import('@/components/Base64Tool'), {
      loading: () => <Spinner />,
      ssr: false,
    }),
  },
  'tools/url': {
    component: dynamic(() => import('@/components/URLTool'), {
      loading: () => <Spinner />,
      ssr: false,
    }),
  },
};

export default function HashRouter({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash;
      // 移除开头的 #/ 或 #
      const path = rawHash.replace(/^#\/?/, '');

      // 如果 hash 为空，设置为根路径
      if (!path) {
        setCurrentPath('/');
        return;
      }

      setCurrentPath(path);
    };

    // 监听 hash 变化
    window.addEventListener('hashchange', handleHashChange);
    
    // 初始化时检查 hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 在初始化之前显示加载状态
  if (currentPath === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 如果当前 hash 对应一个工具组件，则渲染该组件
  if (currentPath in tools) {
    const Component = tools[currentPath as ToolPath].component;
    return (
      <ToolsLayout>
        <Component />
      </ToolsLayout>
    );
  }

  // 否则渲染默认内容（首页）
  return <>{children}</>;
}
