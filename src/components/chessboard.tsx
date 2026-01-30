'use client';
import type { FC } from 'react';
import type { Square } from 'chess.js';
import { cn } from '@/lib/utils';
import type { ChessPiece as PieceType, Move } from '@/lib/types';
import ChessPiece from './chess-piece';

interface ChessboardProps {
  board: (PieceType | null)[][];
  onSquareClick: (square: Square) => void;
  selectedPiece: Square | null;
  legalMoves: Square[];
  lastMove: Move | null;
  isFlipped: boolean;
  isAITurn: boolean;
}

export const Chessboard: FC<ChessboardProps> = ({
  board,
  onSquareClick,
  selectedPiece,
  legalMoves,
  lastMove,
  isFlipped,
  isAITurn,
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const boardRanks = isFlipped ? [...ranks] : [...ranks].reverse();

  return (
    <div className="relative aspect-square w-full">
      {isAITurn && (
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
      <div className="grid grid-cols-8 aspect-square w-full">
        {boardRanks.map((rank, rankIndex) => {
          const boardFiles = isFlipped ? [...files].reverse() : [...files];
          return boardFiles.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const piece = board[7 - rankIndex][fileIndex];
            const isLight = (rankIndex + fileIndex) % 2 !== 0;

            const isLegalMove = legalMoves.includes(square);
            const isSelected = selectedPiece === square;
            const isLastMove = lastMove?.from === square || lastMove?.to === square;

            return (
              <div
                key={square}
                onClick={() => onSquareClick(square)}
                className={cn(
                  'relative flex aspect-square items-center justify-center',
                  isLight ? 'bg-beige-200' : 'bg-green-700',
                   isLight ? 'bg-background' : 'bg-primary/80',
                   'cursor-pointer transition-colors duration-200'
                )}
              >
                {piece && <ChessPiece {...piece} size={-1} />}
                 <div className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl lg:text-7xl">
                  {piece && (
                    <ChessPiece
                      type={piece.type}
                      color={piece.color}
                      size="90%"
                    />
                  )}
                </div>

                {isLegalMove && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1/3 w-1/3 rounded-full bg-accent/50"></div>
                  </div>
                )}
                 {isSelected && <div className="absolute inset-0 bg-accent/50" />}
                 {isLastMove && <div className="absolute inset-0 bg-accent/40" />}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
