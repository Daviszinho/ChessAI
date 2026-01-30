import type { FC } from 'react';
import type { ChessPiece as PieceType } from '@/lib/types';

interface ChessPieceProps extends PieceType {
  size: number;
}

const ChessPiece: FC<ChessPieceProps> = ({ type, color, size }) => {
  const fill = color === 'b' ? 'var(--foreground)' : 'hsl(var(--card))';
  const stroke = color === 'b' ? 'hsl(var(--card))' : 'var(--foreground)';

  switch (type) {
    case 'p': // Pawn
      return (
        <svg width={size} height={size} viewBox="0 0 45 45" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 36C22.5 36 22.5 36 22.5 36C22.5 36 22.5 36 22.5 36C25.5 33 27 30 27 27C27 24 26 21.5 22.5 21.5C19 21.5 18 24 18 27C18 30 19.5 33 22.5 36Z" />
          <path d="M22.5 21.5C22.5 19.5 22.5 17.5 22.5 15.5C22.5 13.5 23.5 11.5 22.5 9.5C21.5 7.5 19.5 9.5 19.5 9.5" stroke={stroke} fill="none" />
        </svg>
      );
    case 'n': // Knight
      return (
        <svg width={size} height={size} viewBox="0 0 45 45" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22,10 C32.5,10 31.5,22 31.5,22 C31.5,24 29,26 29,26 C29,26 22.5,25.5 22.5,25.5 C22.5,25.5 24.5,27.5 24.5,29.5 C24.5,31.5 22.5,33 22.5,33 C22.5,33 20,31.5 20,29.5 C20,27.5 18,26 18,26 C18,26 10,24.5 10,24.5 C10,24.5 14,13.5 22,10 Z" fill={fill} />
          <path d="M13,29 C13,29 13,31 14.5,32.5 C16,34 19,34 19,34 C19,34 20,33 20.5,32.5 C21,32 22.5,30 22.5,30" />
        </svg>
      );
    case 'b': // Bishop
      return (
        <svg width={size} height={size} viewBox="0 0 45 45" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5,36 C22.5,36 27,34 27,30 C27,26 23.5,25 22.5,25 C21.5,25 18,26 18,30 C18,34 22.5,36 22.5,36 Z" fill={fill} />
          <path d="M22.5,25 C22.5,22 24.5,19.5 22.5,17 C20.5,14.5 22.5,10 22.5,10" />
          <path d="M24,12 C24.2,11.8 24.8,11.2 25,11" />
        </svg>
      );
    case 'r': // Rook
      return (
        <svg width={size} height={size} viewBox="0 0 45 45" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18,36 L27,36 L27,30 L18,30 L18,36 Z M18,30 L18,15 L27,15 L27,30 Z M18,15 L16,15 L16,12 L19,12 L19,9 L22.5,9 L26,9 L26,12 L29,12 L29,15 L27,15" />
        </svg>
      );
    case 'q': // Queen
      return (
        <svg width={size} height={size} viewBox="0 0 45 45" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.5,36 L31.5,36 L31.5,30 C31.5,30 29.5,28.5 28.5,27 C27.5,25.5 28,24 28,24 C28,24 27,22 25.5,21 C24,20 22.5,18 22.5,18 C22.5,18 21,20 19.5,21 C18,22 17,24 17,24 C17,24 17.5,25.5 16.5,27 C15.5,28.5 13.5,30 13.5,30 L13.5,36 Z" fill={fill} />
          <circle cx="12" cy="12" r="1.5" fill={fill} />
          <circle cx="17.5" cy="9.5" r="1.5" fill={fill} />
          <circle cx="22.5" cy="8" r="1.5" fill={fill} />
          <circle cx="27.5" cy="9.5" r="1.5" fill={fill} />
          <circle cx="33" cy="12" r="1.5" fill={fill} />
        </svg>
      );
    case 'k': // King
      return (
        <svg width={size} height={size} viewBox="0 0 45 45" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5,36 L22.5,30 M16.5,36 L28.5,36 M16.5,30 C16.5,30 13.5,27.5 13.5,24 C13.5,20.5 16.5,18 22.5,18 C28.5,18 31.5,20.5 31.5,24 C31.5,27.5 28.5,30 28.5,30 M22.5,25 L22.5,18" />
          <path d="M20,12 L25,12 M22.5,9.5 L22.5,14.5" stroke={stroke} fill="none" />
          <path d="M22.5,30 C22.5,30 22.5,30 22.5,30 C22.5,30 22.5,30 22.5,30 C25.5,27 27,24 27,24 C27,21 26,18.5 22.5,18.5 C19,18.5 18,21 18,24 C18,24 19.5,27 22.5,30" fill={fill} />
        </svg>
      );
    default:
      return null;
  }
};

export default ChessPiece;
