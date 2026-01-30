'use client';
import { useMemo } from 'react';
import type { FC } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import type { Square } from 'chess.js';
import type { Move } from '@/lib/types';

interface ChessboardProps {
  position: string;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  lastMove: Move | null;
  isFlipped: boolean;
  isAITurn: boolean;
  isLoadingAiMove: boolean;
}

export const Chessboard: FC<ChessboardProps> = ({
  position,
  onPieceDrop,
  lastMove,
  isFlipped,
  isAITurn,
  isLoadingAiMove,
}) => {
  const customSquareStyles = useMemo(() => {
    const styles: { [key: string]: React.CSSProperties } = {};
    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: 'hsl(var(--accent) / 0.4)' };
      styles[lastMove.to] = { backgroundColor: 'hsl(var(--accent) / 0.4)' };
    }
    return styles;
  }, [lastMove]);
  
  return (
    <div className="relative aspect-square w-full">
      {isLoadingAiMove && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <svg
              className="h-12 w-12 animate-spin text-primary-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-lg font-semibold text-primary-foreground">
              AI is thinking...
            </p>
          </div>
        </div>
      )}
      <ReactChessboard
        position={position}
        onPieceDrop={onPieceDrop}
        boardOrientation={isFlipped ? 'black' : 'white'}
        arePiecesDraggable={!isAITurn}
        customBoardStyle={{
          borderRadius: 'var(--radius)',
        }}
        customSquareStyles={customSquareStyles}
        customLightSquareStyle={{ backgroundColor: 'yellow' }}
        customDarkSquareStyle={{ backgroundColor: 'green' }}
      />
    </div>
  );
};
