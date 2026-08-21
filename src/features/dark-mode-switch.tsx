import { Moon, Sun } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export function DarkModeSwitch({
  className,
  onChange,
  ...rest
}: {
  className?: string;
  onChange?: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);

  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  const applyDarkMode = isDark ?? systemPrefersDark;

  useEffect(() => {
    document.body.classList.toggle('dark', applyDarkMode);
  }, [applyDarkMode]);

  const clickHandler = (checked: boolean) => {
    setIsDark(checked);
    document.body.classList.toggle('dark', checked);
    onChange?.();
  };

  return (
    <div className={`flex flex-row space-x-2 ${className ?? ''}`} {...rest}>
      <Sun className="mt-0.5 h-4 w-4" />

      <Switch role="button" aria-label="Toggle dark mode" checked={applyDarkMode} onCheckedChange={clickHandler} />

      <Moon className="mt-0.5 h-4 w-4" />
    </div>
  );
}
