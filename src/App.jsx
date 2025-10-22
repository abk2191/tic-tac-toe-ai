import { useState, useRef, useEffect } from "react";
import Theboard from "./Theboard";
import Confetti from "react-confetti";
import banner from "./assets/banner.jpg";

function App() {
  const [xPlayed, setXPlayed] = useState(true);
  const [value, setValue] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("Player"); // Changed to "Player" instead of "X"
  const [winner, setWinner] = useState(null);
  const [winningIndexes, setWinningIndexes] = useState([]);
  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [randomEmoji, setRandomEmoji] = useState("");
  const [celebrationText, setCelebrationText] = useState("");
  const [gameMode, setGameMode] = useState(null); // null, "ai", or "twoPlayer"
  const [aiThinking, setAiThinking] = useState(false);

  const audioRef = useRef(null);
  const losingAudioRef = useRef(null); // New audio ref for losing sound
  const emojis = ["😊", "🥰", "😇"];
  const losingEmojis = ["😭", "🥶", "🤯", "😰"]; // New losing emojis
  const losingTexts = [
    "Try again",
    "Darn it",
    "Better Luck Next Time",
    "Try Harder",
  ]; // New losing texts

  // Initialize game with random first turn for AI mode
  const initializeGame = (mode) => {
    setValue(Array(9).fill(null));
    setWinner(null);
    setWinningIndexes([]);
    setHistory([]);
    setShowConfetti(false);
    setShowEmoji(false);
    setAiThinking(false);
    setGameMode(mode);

    if (mode === "ai") {
      // Randomly decide who goes first in AI mode
      const playerGoesFirst = Math.random() > 0.5;
      setXPlayed(playerGoesFirst);
      setPlayer(playerGoesFirst ? "Player" : "AI");

      // If AI goes first, make AI move immediately
      if (!playerGoesFirst) {
        setAiThinking(true);
        setTimeout(() => {
          const bestMove = findBestMove(Array(9).fill(null));
          if (bestMove !== -1) {
            handleFirstAIMove(bestMove);
          }
          setAiThinking(false);
        }, 800);
      }
    } else {
      // Two player mode - always start with Player X
      setXPlayed(true);
      setPlayer("X");
    }
  };

  // Handle AI's first move
  const handleFirstAIMove = (index) => {
    const newValue = Array(9).fill(null);
    newValue[index] = "O"; // AI is always "O"

    setHistory((prev) => [
      ...prev,
      {
        board: Array(9).fill(null),
        xPlayed: false,
        player: "AI",
        winner: null,
        winningIndexes: [],
      },
    ]);

    setValue(newValue);
    setPlayer("Player");
    setXPlayed(true);
  };

  // AI move logic
  const makeAIMove = (currentBoard) => {
    setAiThinking(true);

    // Add a longer delay to let the human move be visible
    setTimeout(() => {
      const bestMove = findBestMove([...currentBoard]);
      if (bestMove !== -1) {
        handleAIMove(bestMove, currentBoard);
      }
      setAiThinking(false);
    }, 800);
  };

  const handleAIMove = (index, currentBoard) => {
    if (currentBoard[index] || winner) return;

    // Create new value from the current board state
    const newValue = [...currentBoard];
    newValue[index] = "O"; // AI is always "O"

    // Add to history
    setHistory((prev) => [
      ...prev,
      {
        board: [...currentBoard],
        xPlayed: false, // AI just played
        player: "AI",
        winner: winner,
        winningIndexes: [...winningIndexes],
      },
    ]);

    // Update the board with AI move
    setValue(newValue);
    setPlayer("Player"); // Switch back to human player
    setXPlayed(true); // Next turn is Player (human)

    // Check for winner after AI move
    const gameWinner = calculatewinner(newValue);
    if (gameWinner) {
      const winnerName = gameWinner === "X" ? "Player" : "AI";
      setWinner(winnerName);
      setShowConfetti(true);

      // Use different emojis and texts based on who wins
      if (winnerName === "AI") {
        // AI wins - use losing emojis and texts
        const randomIndex = Math.floor(Math.random() * losingEmojis.length);
        setRandomEmoji(losingEmojis[randomIndex]);
        const randomText =
          losingTexts[Math.floor(Math.random() * losingTexts.length)];
        setCelebrationText(randomText);

        // Play losing sound when AI wins
        if (losingAudioRef.current) {
          losingAudioRef.current.currentTime = 0;
          losingAudioRef.current.play();
        }
      } else {
        // Player wins - use winning emojis and texts
        const randomIndex = Math.floor(Math.random() * emojis.length);
        setRandomEmoji(emojis[randomIndex]);
        const texts = [
          "Amazing!",
          "Incredible!",
          "Brilliant!",
          "Well Played!",
          "Fantastic!",
        ];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        setCelebrationText(randomText);

        // Play winning sound when player wins
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }

      setShowEmoji(true);
      setTimeout(() => {
        setShowEmoji(false);
      }, 2000);
    } else if (newValue.every((cell) => cell !== null)) {
      setWinner("Draw");
    }
  };

  const updateBoard = (index) => {
    if (value[index] || winner || aiThinking) return;

    // Save current state to history
    setHistory((prev) => [
      ...prev,
      {
        board: [...value],
        xPlayed: xPlayed,
        player: player,
        winner: winner,
        winningIndexes: [...winningIndexes],
      },
    ]);

    // Update board with human move
    const newValue = [...value];
    newValue[index] = xPlayed ? "X" : "O";

    // Check for winner immediately after human move
    const gameWinner = calculatewinner(newValue);
    if (gameWinner) {
      const winnerName =
        gameWinner === "X" ? "Player" : gameMode === "ai" ? "AI" : "O";
      setWinner(winnerName);
      setShowConfetti(true);

      // Use different emojis and texts based on who wins
      if (winnerName === "AI") {
        // AI wins - use losing emojis and texts
        const randomIndex = Math.floor(Math.random() * losingEmojis.length);
        setRandomEmoji(losingEmojis[randomIndex]);
        const randomText =
          losingTexts[Math.floor(Math.random() * losingTexts.length)];
        setCelebrationText(randomText);

        // Play losing sound when AI wins
        if (losingAudioRef.current) {
          losingAudioRef.current.currentTime = 0;
          losingAudioRef.current.play();
        }
      } else {
        // Player wins - use winning emojis and texts
        const randomIndex = Math.floor(Math.random() * emojis.length);
        setRandomEmoji(emojis[randomIndex]);
        const texts = [
          "Amazing!",
          "Incredible!",
          "Brilliant!",
          "Well Played!",
          "Fantastic!",
        ];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        setCelebrationText(randomText);

        // Play winning sound when player wins
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }

      setShowEmoji(true);
      setTimeout(() => {
        setShowEmoji(false);
      }, 2000);

      setValue(newValue);
      // For two player mode, keep X/O labels
      if (gameMode === "twoPlayer") {
        setPlayer(xPlayed ? "O" : "X");
      } else {
        setPlayer(xPlayed ? "AI" : "Player");
      }
      setXPlayed(!xPlayed);
    } else if (newValue.every((cell) => cell !== null)) {
      setWinner("Draw");
      setValue(newValue);
      // For two player mode, keep X/O labels
      if (gameMode === "twoPlayer") {
        setPlayer(xPlayed ? "O" : "X");
      } else {
        setPlayer(xPlayed ? "AI" : "Player");
      }
      setXPlayed(!xPlayed);
    } else {
      // No winner yet, update the board and handle AI move if needed
      setValue(newValue);

      if (gameMode === "ai" && !gameWinner) {
        // If playing against AI and no winner, let AI make a move
        setPlayer("AI");
        setXPlayed(false);
        makeAIMove(newValue);
      } else {
        // Regular turn switching for two-player game
        if (gameMode === "twoPlayer") {
          setPlayer(xPlayed ? "O" : "X");
        } else {
          setPlayer(xPlayed ? "AI" : "Player");
        }
        setXPlayed(!xPlayed);
      }
    }
  };

  // Separate function for AI to check winners without setting state
  const checkWinnerForAI = (board) => {
    // Check all winning combinations
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the winner ('X' or 'O')
      }
    }
    return null;
  };

  // AI Logic - uses checkWinnerForAI instead of calculatewinner
  const findBestMove = (board) => {
    // Check for winning move
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        if (checkWinnerForAI(board) === "O") {
          board[i] = null;
          return i;
        }
        board[i] = null;
      }
    }

    // Block opponent's winning move
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        if (checkWinnerForAI(board) === "X") {
          board[i] = null;
          return i;
        }
        board[i] = null;
      }
    }

    // Take center if available
    if (board[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((i) => board[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // Take edges
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter((i) => board[i] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    return -1; // No moves available
  };

  const calculatewinner = (value) => {
    // Reset winning indexes first
    setWinningIndexes([]);

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (value[a] && value[a] === value[b] && value[a] === value[c]) {
        setWinningIndexes([a, b, c]);
        console.log(`${value[a]} wins`);
        return value[a];
      }
    }
    return null;
  };

  const undoMove = () => {
    if (history.length === 0 || aiThinking) return;

    const lastState = history[history.length - 1];
    setValue(lastState.board);
    setXPlayed(lastState.xPlayed);
    setPlayer(lastState.player);
    setWinner(lastState.winner);
    setWinningIndexes(lastState.winningIndexes);
    setHistory((prev) => prev.slice(0, -1));
  };

  const restartGame = () => {
    if (gameMode === "ai") {
      // For AI mode, re-initialize with random first turn
      initializeGame("ai");
    } else {
      // For two player mode, standard restart
      setValue(Array(9).fill(null));
      setXPlayed(true);
      setPlayer("X");
      setWinner(null);
      setWinningIndexes([]);
      setHistory([]);
      setShowConfetti(false);
      setShowEmoji(false);
      setAiThinking(false);
    }
  };

  const startGameWithMode = (mode) => {
    if (mode === "ai") {
      initializeGame("ai");
    } else {
      setValue(Array(9).fill(null));
      setXPlayed(true);
      setPlayer("X");
      setWinner(null);
      setWinningIndexes([]);
      setHistory([]);
      setShowConfetti(false);
      setShowEmoji(false);
      setAiThinking(false);
      setGameMode(mode);
    }
  };

  const backToMenu = () => {
    setValue(Array(9).fill(null));
    setXPlayed(true);
    setPlayer("X");
    setWinner(null);
    setWinningIndexes([]);
    setHistory([]);
    setShowConfetti(false);
    setShowEmoji(false);
    setAiThinking(false);
    setGameMode(null);
  };

  useEffect(() => {
    if (!winner) {
      setShowConfetti(false);
    }
  }, [winner]);

  // Determine display text based on game mode and state
  const getDisplayText = () => {
    if (winner === "Draw") {
      return "It's a Draw! 🤝";
    } else if (winner) {
      return `${winner} Wins!`;
    } else {
      return `${player}'s Turn`;
    }
  };

  return (
    <>
      {/* REPLACE THIS FAKE MP3 WITH REAL LOSING SOUND FILE */}
      <audio ref={losingAudioRef} src="./fail.mp3" preload="auto" />

      {/* REPLACE THIS FAKE MP3 WITH REAL WINNING SOUND FILE */}
      <audio ref={audioRef} src="./winner-sound.mp3" preload="auto" />

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={150}
          gravity={0.15}
          wind={0}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />
      )}

      {showEmoji && (
        <div className="emoji-celebration">
          <span className="emoji">{randomEmoji}</span>
          <div className="celebration-text">{celebrationText}</div>
        </div>
      )}

      <div className="wrapper">
        <div className="banner">
          <h2
            style={{
              fontFamily: "Amarante, serif",
            }}
            className="gradient-text"
          >
            Classic Tic-Tac-Toe
          </h2>
        </div>

        {!gameMode ? (
          // Game Mode Selection Screen
          <div className="mode-selection-container">
            <div className="mode-buttons">
              <button
                onClick={() => startGameWithMode("twoPlayer")}
                className="mode-button two-player-button"
              >
                Two Player Game
              </button>
              <button
                onClick={() => startGameWithMode("ai")}
                className="mode-button ai-button"
              >
                Play with AI
              </button>
            </div>
          </div>
        ) : (
          // Game Screen
          <div className="container">
            <div className="game-header">
              <button onClick={backToMenu} className="back-button">
                Back to Menu
              </button>
            </div>

            <p style={{ fontFamily: "Inter, sans-serif", color: "white" }}>
              {getDisplayText()}
            </p>
            <Theboard
              updateBoard={updateBoard}
              value={value}
              winningIndexes={winningIndexes}
              disabled={aiThinking || (gameMode === "ai" && player === "AI")}
            />
            <button
              onClick={undoMove}
              disabled={history.length === 0 || aiThinking}
              className="undo-button"
            >
              Undo Move ({history.length} moves)
            </button>
            <button onClick={restartGame} className="restart-button">
              Restart Game
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
