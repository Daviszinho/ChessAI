
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/i18n/provider';
import type { GameStatus } from '@/lib/types';
import { Trophy, Handshake, Skull } from 'lucide-react';

interface GameOverDialogProps {
  status: GameStatus;
  winner: 'w' | 'b' | null;
  onNewGame: () => void;
  onClose: () => void;
  open: boolean;
}

export function GameOverDialog({ status, winner, onNewGame, onClose, open }: GameOverDialogProps) {
  const { t } = useTranslation();

  if (status === 'in-progress' || !open) return null;

  const getTitle = () => {
    if (status === 'checkmate') return t('checkmate');
    if (status === 'stalemate') return t('stalemate');
    return t('draw');
  };

  const getDescription = () => {
    if (status === 'checkmate') {
      return winner === 'w' ? t('winnerWhite') : t('winnerBlack');
    }
    if (status === 'stalemate') return t('stalemateMessage');
    return t('drawMessage');
  };

  const getIcon = () => {
    if (status === 'checkmate') return <Trophy className="h-12 w-12 text-accent mb-2" />;
    if (status === 'stalemate' || status === 'draw') return <Handshake className="h-12 w-12 text-primary mb-2" />;
    return <Skull className="h-12 w-12 text-destructive mb-2" />;
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-col items-center justify-center">
          {getIcon()}
          <AlertDialogTitle className="text-2xl font-bold text-center">
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-center">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">
            {t('close')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onNewGame} className="w-full sm:flex-1">
            {t('playAgain')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
