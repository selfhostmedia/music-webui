import { Moon, Sun } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export function DarkModeSwitch({
  className,
  onClick,
  ...rest
}: { className?: string; onClick?: () => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [isDark, setIsDark] = useState(true);
  const systemPrefersDark = useMediaQuery(
    {
      query: '(prefers-color-scheme: dark)',
    },
    undefined,
    (isSystemDark) => setIsDark(isSystemDark),
  );

  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
    setIsDark(!isDark);
  };

  const applyDarkMode = useMemo(
    () => (isDark === undefined ? !!systemPrefersDark : isDark),
    [isDark, systemPrefersDark],
  );

  const toggleDarkMode = () => {
    if (applyDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };
  useEffect(toggleDarkMode, [applyDarkMode]);
  return (
    <div className={`flex flex-row space-x-2 ${className ?? ''}`} {...rest}>
      <Sun className="w-4 h-4 mt-0.5" />
      <Switch
        role="button"
        aria-label="Toggle dark mode"
        id="dark-mode"
        checked={isDark}
        onCheckedChange={clickHandler}
      />
      <Moon className="w-4 h-4 mt-0.5" />
    </div>
  );
}
