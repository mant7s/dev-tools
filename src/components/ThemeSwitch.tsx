'use client';

import { Switch } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      isSelected={theme === 'dark'}
      size="lg"
      color="secondary"
      onValueChange={(isSelected) => setTheme(isSelected ? 'dark' : 'light')}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <FaMoon className={className} />
        ) : (
          <FaSun className={className} />
        )
      }
    />
  );
}
