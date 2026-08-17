import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { useIndexer } from '@/hooks/use-indexer';

export function IndexerToggle({
  className,
  ...rest
}: { className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { isEnabled, toggleStatus } = useIndexer();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await toggleStatus();
  };

  return (
    <div className={`flex flex-row space-x-2 ${className ?? ''}`} {...rest}>
      <Switch
        checked={isEnabled}
        onCheckedChange={() =>
          handleSubmit(
            new Event('submit') as unknown as React.FormEvent<HTMLFormElement>,
          )
        }
      />
      <Label>Indexer is {isEnabled ? 'active' : 'disabled'}</Label>
    </div>
  );
}
