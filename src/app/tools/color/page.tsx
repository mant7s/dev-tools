'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@nextui-org/react';

const ColorTool = dynamic(() => import('@/components/ColorTool'), {
  loading: () => <Spinner />,
});

export default function ColorToolPage() {
  return <ColorTool />;
}
