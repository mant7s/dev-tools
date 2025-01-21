'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@nextui-org/react';

const TimestampTool = dynamic(() => import('@/components/TimestampTool'), {
  loading: () => <Spinner />,
});

export default function TimestampToolPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <TimestampTool />
    </div>
  );
}
