'use client';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  RotateCcw,
  Undo2,
  History,
  Cog,
  Languages,
  ClipboardCopy,
} from 'lucide-react';
import type { useChessGame } from '@/hooks/use-chess-game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { EngineType, HistoryItem } from '@/lib/types';
import { useTranslation, type Locale } from '@/i18n/provider';
import { Switch } from '@/components/ui/switch';


type GameSidebarProps = {
  game: ReturnType<typeof useChessGame>;
};

export const GameSidebar: FC<GameSidebarProps> = ({ game }) => {
  const [fen, setFen] = useState(game.position);
  const [sideForNewGame, setSideForNewGame] = useState<'w' | 'b'>('w');
  const { toast } = useToast();
  const { t, locale, setLocale, locales } = useTranslation();

  useEffect(() => {
    if (game.position) {
      setFen(game.position);
    }
  }, [game.position]);

  const handleLoadFen = () => {
    if (game.loadFen(fen)) {
      toast({
        title: t('loadFenSuccess'),
      });
    } else {
      toast({
        variant: 'destructive',
        title: t('errorTitle'),
        description: t('loadFenError'),
      });
    }
  };

  const handleExportPgn = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(game.pgn).then(() => {
        toast({ title: t('pgnCopied') });
      });
    }
  };

  const statusMessage = () => {
    switch (game.status) {
      case 'checkmate':
        return t('checkmate');
      case 'stalemate':
        return t('stalemate');
      case 'draw':
        return t('draw');
      default:
        return game.isAITurn ? t('aiTurn') : t('yourTurn');
    }
  };

  const movePairs: HistoryItem[][] = [];
  for (let i = 0; i < game.history.length; i += 2) {
    movePairs.push(game.history.slice(i, i + 2));
  }

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-between">
          <span>{t('gameStatus')}</span>
          <span className="text-lg font-normal text-foreground/80">{statusMessage()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex space-x-2">
          <Button onClick={() => game.newGame(sideForNewGame)} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> {t('newGame')}
          </Button>
          <Button
            onClick={game.undoMove}
            disabled={game.history.length < 2}
            variant="outline"
            className="w-full"
          >
            <Undo2 className="mr-2 h-4 w-4" /> {t('undo')}
          </Button>
        </div>
        
        <div>
            <h3 className="flex items-center mb-2 font-semibold"><History className="mr-2 h-4 w-4" />{t('history')}</h3>
            <ScrollArea className="h-64 rounded-md border p-2">
              {movePairs.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">{t('noMoves')}</p>
              ) : (
                <ol className="space-y-1">
                  {movePairs.map((pair, index) => (
                    <li key={index} className="grid grid-cols-[auto_1fr_1fr] items-baseline gap-x-4 text-sm p-1 rounded-md even:bg-muted/50">
                      <span className="font-mono text-right text-muted-foreground">{`${index + 1}.`}</span>
                      <span className="font-mono">{pair[0]?.san}</span>
                      <span className="font-mono text-foreground/80">{pair[1]?.san}</span>
                    </li>
                  ))}
                </ol>
              )}
            </ScrollArea>
            <Button onClick={handleExportPgn} variant="outline" className="w-full mt-2" disabled={game.history.length === 0}>
              <ClipboardCopy className="mr-2 h-4 w-4" /> {t('exportPgn')}
            </Button>
        </div>

        <Separator />
        
        <div className="space-y-4">
            <h3 className="flex items-center font-semibold"><Cog className="mr-2 h-4 w-4" />{t('settings')}</h3>
            <div>
              <Label>{t('playAs')}</Label>
              <div className="flex items-center space-x-2 mt-1">
                  <span>{t('white')}</span>
                  <Switch
                      id="play-as-switch"
                      checked={sideForNewGame === 'b'}
                      onCheckedChange={(checked) => setSideForNewGame(checked ? 'b' : 'w')}
                  />
                  <span>{t('black')}</span>
              </div>
               <p className="text-xs text-muted-foreground mt-1">{t('playAsNote')}</p>
            </div>
            <div>
              <Label htmlFor="engine">{t('aiEngine')}</Label>
              <Select
                value={game.engine}
                onValueChange={(value) => game.setEngine(value as EngineType)}
                disabled={game.isLoadingAiMove || game.history.length > 0}
              >
                <SelectTrigger id="engine">
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stockfish">{t('engine.stockfish')}</SelectItem>
                  <SelectItem value="gnuchess">{t('engine.gnuchess')}</SelectItem>
                  <SelectItem value="fruit">{t('engine.fruit')}</SelectItem>
                  <SelectItem value="toga2">{t('engine.toga2')}</SelectItem>
                  <SelectItem value="sjeng">{t('engine.sjeng')}</SelectItem>
                  <SelectItem value="phalanx">{t('engine.phalanx')}</SelectItem>
                </SelectContent>
              </Select>
               {game.history.length > 0 && <p className="text-xs text-muted-foreground mt-1">{t('engineChangeNote')}</p>}
            </div>
            <div>
              <Label htmlFor="fen">{t('loadFen')}</Label>
              <div className="flex space-x-2">
                <Input
                  id="fen"
                  placeholder="rnbqkbnr/pppppppp/8/8/..."
                  value={fen}
                  onChange={(e) => setFen(e.target.value)}
                />
                <Button onClick={handleLoadFen}>{t('load')}</Button>
              </div>
          </div>
          <div>
              <Label htmlFor="language">{t('language')}</Label>
              <Select
                value={locale}
                onValueChange={(value) => setLocale(value as Locale)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
