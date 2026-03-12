
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Chess, type Square, type PieceSymbol } from 'chess.js';
import { useToast } from '@/hooks/use-toast';
import type {
  HistoryItem,
  GameStatus,
  Move,
  EngineType,
} from '@/lib/types';
import { suggestBestMove } from '@/ai/flows/suggest-best-move';

// Helper to create a new game instance from an existing one, preserving history
const cloneGame = (game: Chess): Chess => {
  const newGame = new Chess();
  // Using loadPgn is the way to clone a game and preserve history with chess.js v1+
  newGame.loadPgn(game.pgn());
  return newGame;
};

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [status, setStatus] = useState<GameStatus>('in-progress');
  const [winner, setWinner] = useState<'w' | 'b' | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAITurn, setIsAITurn] = useState(false);
  const [isLoadingAiMove, setIsLoadingAiMove] = useState(false);
  const [engine, setEngine] = useState<EngineType>('stockfish');
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [turn, setTurn] = useState(game.turn());
  const [promotionToSelect, setPromotionToSelect] = useState<{from: Square, to: Square} | null>(null);
  const { toast } = useToast();

  const playMoveSound = useCallback(() => {
    const audio = document.getElementById('move-sound') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        // This can happen if the user hasn't interacted with the page yet.
        console.error("Error playing move sound:", error);
      });
    }
  }, []);

  const updateGame = useCallback((gameInstance: Chess, newPlayerColor?: 'w' | 'b') => {
    const currentPlayerColor = newPlayerColor || playerColor;
    setPosition(gameInstance.fen());
    setTurn(gameInstance.turn());
    const moves = gameInstance.history({ verbose: true });
    setHistory(
      moves.map((move) => ({
        san: move.san,
        fen: move.after,
        by: move.color === currentPlayerColor ? 'player' : 'ai',
      }))
    );

    if (gameInstance.isCheckmate()) {
        setStatus('checkmate');
        setWinner(gameInstance.turn() === 'w' ? 'b' : 'w');
    } else {
        setWinner(null);
        if (gameInstance.isStalemate()) setStatus('stalemate');
        else if (gameInstance.isDraw()) setStatus('draw');
        else setStatus('in-progress');
    }

    const aiColor = currentPlayerColor === 'w' ? 'b' : 'w';
    setIsAITurn(gameInstance.turn() === aiColor);
  }, [playerColor]);

  useEffect(() => {
    if (isAITurn && status === 'in-progress') {
      const getAiMove = async () => {
        setIsLoadingAiMove(true);
        try {
          const { move: aiMove } = await suggestBestMove({
            fen: game.fen(),
            engine: engine,
            level: 5,
          });

          const gameCopy = cloneGame(game);
          
          let moveResult = null;
          try {
            moveResult = gameCopy.move(aiMove);
          } catch(e) {
            // chess.js v1 can throw on invalid move string
          }

          if (!moveResult && aiMove && aiMove.length >= 4) {
            try {
              moveResult = gameCopy.move({
                from: aiMove.substring(0, 2) as Square,
                to: aiMove.substring(2, 4) as Square,
                promotion: aiMove.length === 5 ? aiMove.substring(4, 5) as PieceSymbol : undefined,
              });
            } catch(e) {
                // Ignore errors
            }
          }

          if (moveResult) {
            setGame(gameCopy);
            updateGame(gameCopy);
            playMoveSound();
          } else {
            console.error('API move is invalid', aiMove);
            toast({
              variant: 'destructive',
              title: 'AI Error',
              description: `AI returned an invalid move: ${aiMove}`,
            });
          }
        } catch (error: any) {
          console.error('Failed to get AI move from API.', error);
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: `Could not fetch AI move: ${error.message}`,
          });
        } finally {
          setIsLoadingAiMove(false);
        }
      };

      setTimeout(getAiMove, 500);
    }
  }, [isAITurn, status, game, updateGame, toast, engine, playerColor, playMoveSound]);

  const newGame = useCallback((color: 'w' | 'b' = 'w') => {
    const newGameInstance = new Chess();
    setGame(newGameInstance);
    setPlayerColor(color);
    updateGame(newGameInstance, color);

    if (color === 'b') {
        const aiColor = 'w';
        setIsAITurn(newGameInstance.turn() === aiColor);
    }
  }, [updateGame]);

  const loadFen = useCallback((fen: string) => {
    try {
      const newGameInstance = new Chess(fen);
      const player = newGameInstance.turn();
      setGame(newGameInstance);
      setPlayerColor(player);
      updateGame(newGameInstance, player);
      return true;
    } catch (e) {
      return false;
    }
  }, [updateGame]);

  const undoMove = useCallback(() => {
    const gameCopy = cloneGame(game);
    gameCopy.undo();
    gameCopy.undo(); 
    setGame(gameCopy);
    updateGame(gameCopy);
  }, [game, updateGame]);

  const handlePromotion = useCallback((piece: PieceSymbol) => {
    if (!promotionToSelect) return;

    if (piece === 'q') {
        setPromotionToSelect(null);
        return;
    }

    const gameCopy = cloneGame(game);
    gameCopy.undo();
    const move = gameCopy.move({
        ...promotionToSelect,
        promotion: piece
    });

    if (move) {
        setGame(gameCopy);
        updateGame(gameCopy);
        playMoveSound();
    }
    
    setPromotionToSelect(null);
  }, [game, promotionToSelect, updateGame, playMoveSound]);

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (isAITurn || status !== 'in-progress') return false;

    const gameCopy = cloneGame(game);
    try {
        const move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        });
        
        if (move === null) {
            return false;
        }

        setGame(gameCopy);
        updateGame(gameCopy);
        playMoveSound();

        if (move.flags.includes('p')) {
            setPromotionToSelect({ from: sourceSquare, to: targetSquare });
        }

        return true;

    } catch (error) {
        return false;
    }
  };

  const lastMove: Move | null = useMemo(() => {
    const history = game.history({ verbose: true });
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    return { from: last.from, to: last.to };
  }, [game]);

  return {
    position,
    status,
    winner,
    history,
    isAITurn,
    isLoadingAiMove,
    lastMove,
    engine,
    playerColor,
    turn,
    promotionToSelect,
    pgn: game.pgn(),
    setEngine,
    newGame,
    undoMove,
    loadFen,
    onDrop,
    handlePromotion,
    resetStatus: () => setStatus('in-progress'),
  };
};
