import { Button } from './ui/button';
import { ListEnd, ListStart, Play } from 'lucide-react';

export function TrackPlaybackControls() {
  return (
    <menu className="inline-block opacity-75">
      <Button variant="ghost" className="inline w-fit self-start p-1 mx-1 px-2">
        <Play />
      </Button>
      <Button variant="ghost" aria-label="Queue at end of queue" className="inline w-fit self-start p-1 mr-1 px-2">
        <ListStart className="scale-x-[-1]" />
      </Button>
      <Button variant="ghost" aria-label="Queue at start of queue" className="inline w-fit self-start p-1 px-2">
        <ListEnd />
      </Button>
    </menu>
  );
}
