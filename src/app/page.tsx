'use client';

import { Chessboard } from '@/components/chessboard';
import { GameSidebar } from '@/components/game-sidebar';
import { useChessGame } from '@/hooks/use-chess-game';
import { Card } from '@/components/ui/card';

export default function Home() {
  const game = useChessGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-2 sm:p-4 lg:p-6">
      <header className="mb-4 text-center">
        <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
          ChessAI
        </h1>
        <p className="mt-2 text-lg text-foreground/80">
          The intelligent chess game.
        </p>
      </header>
      <main className="flex w-full max-w-7xl flex-col items-start gap-4 lg:flex-row">
        <div className="w-full lg:flex-1">
          <Card className="aspect-square w-full p-2 shadow-lg sm:p-4">
            <Chessboard
              board={game.board}
              onSquareClick={game.handleSquareClick}
              selectedPiece={game.selectedPiece}
              legalMoves={game.legalMoves}
              lastMove={game.lastMove}
              isFlipped={false}
              isAITurn={game.isAITurn}
            />
          </Card>
        </div>
        <div className="w-full lg:w-[360px] lg:shrink-0">
          <GameSidebar game={game} />
        </div>
      </main>
    </div>
  );
}
