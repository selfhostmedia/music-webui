import { Button } from './ui/button';
import { ListEnd, ListStart, Play } from 'lucide-react';

export function AlbumPlaybackControls() {
  return (
    <menu className="opacity-25 mb-4">
      <Button variant="default" className="mr-2 bg-background/50">
        <Play /> Play
      </Button>
      <Button variant="default" aria-label="Queue at end of queue" className="mr-2 bg-background/50 text-foreground/75">
        <ListStart className="scale-x-[-1]" /> Queue at front
      </Button>
      <Button variant="default" aria-label="Queue at start of queue" className=" bg-background/50 text-foreground/75">
        <ListEnd /> Queue at end
      </Button>
    </menu>
  );
}
