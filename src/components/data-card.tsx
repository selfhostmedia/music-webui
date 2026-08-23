import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function DataCard({ children, ...rest }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className="min-w-32 bg-background/80" {...rest}>
      {children}
    </Card>
  );
}

export function DataCardTitle({ children }: { children: React.ReactNode }) {
  return (
    <CardHeader>
      <CardTitle className="text-base">{children}</CardTitle>
    </CardHeader>
  );
}

export function DataCardContent({ children }: { children: React.ReactNode }) {
  return <CardContent className="space-y-4">{children}</CardContent>;
}

export function DataCardSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium uppercase text-muted-foreground">{children}</p>;
}

export function DataCardFooter({ children }: { children: React.ReactNode }) {
  return (
    <CardFooter>
      <div className="flex flex-wrap gap-2">{children}</div>
    </CardFooter>
  );
}
