'use client';
import { useState } from 'react';
import type { FC } from 'react';
import {
  BrainCircuit,
  RotateCcw,
  Undo2,
  Settings,
  History,
  Loader,
} from 'lucide-react';
import type { useChessGame } from '@/hooks/use-chess-game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
        <Tabs defaultValue="history">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />History</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <ScrollArea className="h-64 mt-2 rounded-md border p-2">
              {game.history.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">No moves yet.</p>
              ) : (
                <ol className="space-y-2">
                  {game.history.map((move, index) => (
                    <li key={index} className="flex items-center justify-between text-sm p-2 rounded-md even:bg-muted/50">
                      <span className="font-mono">{`${Math.floor(index / 2) + 1}. ${move.san}`}</span>
                      {move.by === 'ai' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => game.getAiExplanation(move)}
                          className="h-7 w-7"
                        >
                          <BrainCircuit className="h-4 w-4 text-accent" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-4 p-2">
              <div>
                <Label htmlFor="engine">Chess Engine</Label>
                <Select
                  value={game.settings.engine}
                  onValueChange={(val) => game.setSettings({ ...game.settings, engine: val })}
                >
                  <SelectTrigger id="engine">
                    <SelectValue placeholder="Select engine" />
                  </SelectTrigger>
                  <SelectContent>
                    {game.engines.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>AI Level: {game.settings.level}</Label>
                <Slider
                  min={1}
                  max={20}
                  step={1}
                  value={[game.settings.level]}
                  onValueChange={([val]) => game.setSettings({ ...game.settings, level: val })}
                />
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
          </TabsContent>
        </Tabs>
      </CardContent>
      <Dialog open={!!game.aiExplanation || game.isExplaining} onOpenChange={(open) => !open && game.closeExplanation()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5 text-accent" />
              AI Move Explanation
            </DialogTitle>
          </DialogHeader>
          {game.isExplaining ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DialogDescription className="prose dark:prose-invert">
              {game.aiExplanation}
            </DialogDescription>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
