'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@nextui-org/react';

const JsonTool = dynamic(() => import('@/components/JsonTool'), {
  loading: () => <Spinner />,
});

export default function JsonToolPage() {
  return <JsonTool />;
}
