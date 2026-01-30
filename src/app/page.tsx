'use client';

import { Chessboard } from '@/components/chessboard';
import { GameSidebar } from '@/components/game-sidebar';
import { useChessGame } from '@/hooks/use-chess-game';
import { Card } from '@/components/ui/card';

export default function Home() {
  const game = useChessGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-2 sm:p-4">
      <header className="mb-4 text-center">
        <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl">
          ChessAI
        </h1>
        <p className="mt-2 text-lg text-foreground/80">
          The intelligent chess game.
        </p>
      </header>
      <main className="flex w-full max-w-5xl flex-col items-start gap-4 md:flex-row">
        <div className="w-full md:flex-1">
          <Card className="aspect-square w-full p-2 shadow-lg sm:p-4">
            <Chessboard
              position={game.position}
              onPieceDrop={game.onDrop}
              lastMove={game.lastMove}
              isFlipped={false}
              isAITurn={game.isAITurn}
              isLoadingAiMove={game.isLoadingAiMove}
            />
          </Card>
        </div>
        <div className="w-full md:w-[320px] md:shrink-0">
          <GameSidebar game={game} />
        </div>
      </main>
    </div>
  );
}
