# ChessAI - The Intelligent Chess Game

ChessAI is a modern, responsive web-based chess application that allows you to play against a variety of powerful AI chess engines. Built with Next.js and TypeScript, it offers a clean interface and a rich set of features for both casual players and chess enthusiasts.

## ✨ Key Features

- **Play Against AI**: Challenge yourself against multiple chess engines.
- **Multiple AI Engines**: Choose from a selection of engines including Stockfish, GnuChess, Sjeng, and more.
- **Adjustable AI Strength**: Control the difficulty level of the AI opponent.
- **Special Moves Support**: Fully supports special chess moves like castling, en-passant, and pawn promotion with piece selection.
- **Game Controls**:
    - Start a new game at any time.
    - Undo the last two moves (player and AI).
    - Load any board position using FEN notation.
    - Export your game history in PGN format.
- **Customization**:
    - Choose your playing side (White or Black).
    - Select from multiple color themes for the chessboard.
- **Internationalization**: Available in English, Spanish, and Portuguese.
- **Progressive Web App (PWA)**: Installable on your desktop or mobile device for an app-like experience.
- **Responsive Design**: Enjoy a seamless experience across all your devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with React & TypeScript)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Chess Logic**: [chess.js](https://github.com/jhlywa/chess.js)
- **AI Engine API**: A custom-built backend that interfaces with various UCI chess engines.
- **Internationalization (i18n)**: Implemented using React Context and JSON files.

## 🚀 Getting Started

This project is ready to run in Firebase Studio.

1.  To start the development server, simply use the integrated terminal.
2.  The application will be available on the port indicated by the development server.

## ♟️ How to Play

1.  The board is presented, and you can start playing as White.
2.  To make a move, click and drag a piece from its starting square to its target square.
3.  The AI will automatically make its move after yours.
4.  Use the sidebar to access settings, game history, and other controls.
    - **New Game**: Starts a fresh game. You can select your side (White or Black) before starting.
    - **Undo**: Reverts the last move made by both you and the AI.
    - **History**: Shows a list of all moves made in the current game.
    - **Settings**: Customize the AI engine, load a game from a FEN string, change the board theme, and switch the language.

---
This project was bootstrapped with Firebase Studio.
