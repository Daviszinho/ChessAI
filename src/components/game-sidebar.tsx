'use client';
import { useState } from 'react';
import type { FC } from 'react';
import {
  RotateCcw,
  Undo2,
  History,
  Cog,
  Languages,
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
import type { EngineType } from '@/lib/types';
import { useTranslation, type Locale } from '@/i18n/provider';


type GameSidebarProps = {
  game: ReturnType<typeof useChessGame>;
};

export const GameSidebar: FC<GameSidebarProps> = ({ game }) => {
  const [fen, setFen] = useState('');
  const { toast } = useToast();
  const { t, locale, setLocale, locales } = useTranslation();

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
          <Button onClick={game.newGame} className="w-full">
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
              {game.history.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">{t('noMoves')}</p>
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

        <Separator />
        
        <div className="space-y-4">
            <h3 className="flex items-center font-semibold"><Cog className="mr-2 h-4 w-4" />{t('settings')}</h3>
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
                  <SelectItem value="crafty">{t('engine.crafty')}</SelectItem>
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
        </div>
      </CardContent>
    </Card>
  );
};
