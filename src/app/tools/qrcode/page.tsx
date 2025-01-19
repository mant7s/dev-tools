'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@nextui-org/react';

const QRCodeTool = dynamic(() => import('@/components/QRCodeTool'), {
  loading: () => <Spinner />,
});

export default function QRCodeToolPage() {
  return <QRCodeTool />;
}
