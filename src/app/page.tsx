
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chessboard } from '@/components/chessboard';
import { GameSidebar } from '@/components/game-sidebar';
import { useChessGame } from '@/hooks/use-chess-game';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/i18n/provider';
import { PromotionDialog } from '@/components/promotion-dialog';
import { GameOverDialog } from '@/components/game-over-dialog';

function ChessGameContent() {
  const game = useChessGame();
  const { t } = useTranslation();
  const [boardTheme, setBoardTheme] = useState('default');
  const [modalDismissed, setModalDismissed] = useState(false);
  const searchParams = useSearchParams();

  // Load FEN from URL parameter if present (case-insensitive)
  useEffect(() => {
    const fenParam = searchParams.get('FEN') || searchParams.get('fen');
    if (fenParam) {
      game.loadFen(fenParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset modal dismissal when game status returns to in-progress (e.g. on new game)
  useEffect(() => {
    if (game.status === 'in-progress') {
      setModalDismissed(false);
    }
  }, [game.status]);

  useEffect(() => {
    document.documentElement.setAttribute('data-board-theme', boardTheme);
    return () => {
      document.documentElement.removeAttribute('data-board-theme');
    };
  }, [boardTheme]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered: ', registration);
          })
          .catch(registrationError => {
            console.log('Service Worker registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const promotingColor = game.turn === 'w' ? 'b' : 'w';

  const handleRestart = () => {
      game.newGame(game.playerColor);
      setModalDismissed(false);
  };

  const handleCloseModal = () => {
    setModalDismissed(true);
  };

  const isGameOverVisible = game.status !== 'in-progress' && !modalDismissed;

  return (
    <>
      <audio id="move-sound" src="https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3" preload="auto" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-2 sm:p-4">
        <header className="mb-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            {t('description')}
          </p>
        </header>
        <main className="flex w-full max-w-5xl flex-col items-start gap-4 md:flex-row">
          <div className="w-full md:flex-1">
            <Card className="aspect-square w-full p-2 shadow-lg sm:p-4">
              <Chessboard
                position={game.position}
                onPieceDrop={game.onDrop}
                lastMove={game.lastMove}
                isFlipped={game.playerColor === 'b'}
                isAITurn={game.isAITurn}
                isLoadingAiMove={game.isLoadingAiMove}
              />
            </Card>
          </div>
          <div className="w-full md:w-[320px] md:shrink-0">
            <GameSidebar
              game={game}
              boardTheme={boardTheme}
              setBoardTheme={setBoardTheme}
            />
          </div>
        </main>
      </div>
      <PromotionDialog
        open={!!game.promotionToSelect}
        onSelect={game.handlePromotion}
        color={promotingColor}
      />
      <GameOverDialog
        open={isGameOverVisible}
        status={game.status}
        winner={game.winner}
        onNewGame={handleRestart}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-primary">Cargando ajedrez...</div>}>
      <ChessGameContent />
    </Suspense>
  );
}
