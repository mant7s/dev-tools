'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@nextui-org/react';

const ColorTool = dynamic(() => import('@/components/ColorTool'), {
  loading: () => <Spinner />,
});

export default function ColorToolPage() {
  return (
    <div className="flex flex-col gap-4">
      <ColorTool />
    </div>
  );
}
