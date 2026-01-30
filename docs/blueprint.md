# **App Name**: ChessAI

## Core Features:

- Chessboard UI: Display a standard 8x8 chessboard with interactive piece movement.
- Move Validation: Validate user moves according to chess rules.
- API Communication: Communicate with the external chess API (https://daviszinhovm.westus2.cloudapp.azure.com/api/move) to get the best move.
- AI Move Suggestion: Use the AI chess engine via the external API to suggest the best move, using engine Stockfish (default) or one among: crafty, fruit, toga2. User will set the skill level between 1 and 20.
- FEN Notation Handling: Convert the board state to FEN notation for API requests and parse FEN notation from API responses. User can optionally input the FEN notation to start or continue a game
- Game History: Maintain a history of moves made in the current game. Allow for the user to undo moves by consulting history.
- Engine Discovery: Implement a 'Settings' option in the user interface which uses GET `https://daviszinhovm.westus2.cloudapp.azure.com/api/engines` to allow the user to select which engine and difficulty level to use.

## Style Guidelines:

- Primary color: Dark forest green (#228B22) to evoke the classic color of chessboards.
- Background color: Soft beige (#F5F5DC), a lighter hue of the primary, but desaturated for a calm backdrop.
- Accent color: Golden yellow (#FFD700) to highlight interactive elements and suggested moves.
- Body and headline font: 'Literata', a transitional serif to provide an intellectual and vintage feel to the UI.
- Use a set of clean, minimalist icons for settings, undo/redo actions, and other interface elements. The icons will have a style derived from chess pieces: geometric and simple but clearly readable.
- Center the chessboard prominently on the screen. Utilize a clean, intuitive layout with game controls and history neatly arranged around the board.
- Use subtle animations to highlight legal moves, capture pieces, and indicate AI move suggestions.