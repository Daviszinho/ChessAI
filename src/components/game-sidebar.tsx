'use client';
import { useState } from 'react';
import type { FC } from 'react';
import {
  RotateCcw,
  Undo2,
  History,
} from 'lucide-react';
import type { useChessGame } from '@/hooks/use-chess-game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type GameSidebarProps = {
  game: ReturnType<typeof useChessGame>;
};

export const GameSidebar: FC<GameSidebarProps> = ({ game }) => {
  const [fen, setFen] = useState('');
  const { toast } = useToast();

  const handleLoadFen = () => {
    if (game.loadFen(fen)) {
      toast({
        title: 'Success',
        description: 'Game loaded from FEN.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid FEN string.',
      });
    }
  };

  const statusMessage = () => {
    switch (game.status) {
      case 'checkmate':
        return 'Checkmate!';
      case 'stalemate':
        return 'Stalemate!';
      case 'draw':
        return 'Draw!';
      default:
        return game.isAITurn ? "AI's Turn" : "Your Turn";
    }
  };

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-between">
          <span>Game Status</span>
          <span className="text-lg font-normal text-foreground/80">{statusMessage()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button onClick={game.newGame} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> New Game
          </Button>
          <Button
            onClick={game.undoMove}
            disabled={game.history.length === 0}
            variant="outline"
            className="w-full"
          >
            <Undo2 className="mr-2 h-4 w-4" /> Undo
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="flex items-center mb-2 font-semibold"><History className="mr-2 h-4 w-4" />History</h3>
            <ScrollArea className="h-64 rounded-md border p-2">
              {game.history.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">No moves yet.</p>
              ) : (
                <ol className="space-y-2">
                  {game.history.map((move, index) => (
                    <li key={index} className="flex items-center justify-between text-sm p-2 rounded-md even:bg-muted/50">
                      <span className="font-mono">{`${Math.floor(index / 2) + 1}. ${move.san}`}</span>
                    </li>
                  ))}
                </ol>
              )}
            </ScrollArea>
          </div>
            <div>
              <Label htmlFor="fen">Load from FEN</Label>
              <div className="flex space-x-2">
                <Input
                  id="fen"
                  placeholder="rnbqkbnr/pppppppp/8/8/..."
                  value={fen}
                  onChange={(e) => setFen(e.target.value)}
                />
                <Button onClick={handleLoadFen}>Load</Button>
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
