'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { PieceSymbol } from 'chess.js';
import { useTranslation } from '@/i18n/provider';

interface PromotionDialogProps {
  open: boolean;
  onSelect: (piece: PieceSymbol) => void;
  color: 'w' | 'b';
}

// Simple text representation of pieces
const pieceToText = (piece: PieceSymbol, color: 'w' | 'b') => {
  // chess.js uses lowercase for black
  const p = color === 'w' ? piece.toUpperCase() : piece.toLowerCase();
  switch (p) {
    case 'Q': return '♕';
    case 'R': return '♖';
    case 'B': return '♗';
    case 'N': return '♘';
    case 'q': return '♛';
    case 'r': return '♜';
    case 'b': return '♝';
    case 'n': return '♞';
    default: return '';
  }
}

export function PromotionDialog({ open, onSelect, color }: PromotionDialogProps) {
  const { t } = useTranslation();
  const promotionPieces: PieceSymbol[] = ['q', 'r', 'b', 'n'];

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('promotePawn')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('promotePawnDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-around py-4">
          {promotionPieces.map((piece) => (
            <Button
              key={piece}
              variant="outline"
              className="w-16 h-16 text-4xl"
              onClick={() => onSelect(piece)}
            >
              {pieceToText(piece, color)}
            </Button>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
