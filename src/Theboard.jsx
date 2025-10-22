function Theboard({ updateBoard, value, winningIndexes, disabled = false }) {
  const playClickSound = () => {
    if (disabled) return;

    const audio = new Audio("./tap.mp3");
    audio.volume = 0.3;
    audio.play().catch((error) => console.log("Audio play failed:", error));
  };

  const handleClick = (index) => {
    if (disabled) return;

    playClickSound();
    updateBoard(index);
  };

  return (
    <>
      <div className="board">
        <button
          className={`buttons ${
            winningIndexes.includes(0) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(0)}
          disabled={disabled || value[0] !== null}
        >
          {value[0] && (
            <span className={`symbol symbol-${value[0]}`}>{value[0]}</span>
          )}
        </button>
        <button
          className={`buttons ${
            winningIndexes.includes(1) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(1)}
          disabled={disabled || value[1] !== null}
        >
          {value[1] && (
            <span className={`symbol symbol-${value[1]}`}>{value[1]}</span>
          )}
        </button>
        <button
          className={`buttons ${
            winningIndexes.includes(2) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(2)}
          disabled={disabled || value[2] !== null}
        >
          {value[2] && (
            <span className={`symbol symbol-${value[2]}`}>{value[2]}</span>
          )}
        </button>
      </div>
      <div className="board">
        <button
          className={`buttons ${
            winningIndexes.includes(3) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(3)}
          disabled={disabled || value[3] !== null}
        >
          {value[3] && (
            <span className={`symbol symbol-${value[3]}`}>{value[3]}</span>
          )}
        </button>
        <button
          className={`buttons ${
            winningIndexes.includes(4) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(4)}
          disabled={disabled || value[4] !== null}
        >
          {value[4] && (
            <span className={`symbol symbol-${value[4]}`}>{value[4]}</span>
          )}
        </button>
        <button
          className={`buttons ${
            winningIndexes.includes(5) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(5)}
          disabled={disabled || value[5] !== null}
        >
          {value[5] && (
            <span className={`symbol symbol-${value[5]}`}>{value[5]}</span>
          )}
        </button>
      </div>
      <div className="board">
        <button
          className={`buttons ${
            winningIndexes.includes(6) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(6)}
          disabled={disabled || value[6] !== null}
        >
          {value[6] && (
            <span className={`symbol symbol-${value[6]}`}>{value[6]}</span>
          )}
        </button>
        <button
          className={`buttons ${
            winningIndexes.includes(7) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(7)}
          disabled={disabled || value[7] !== null}
        >
          {value[7] && (
            <span className={`symbol symbol-${value[7]}`}>{value[7]}</span>
          )}
        </button>
        <button
          className={`buttons ${
            winningIndexes.includes(8) ? "winning-cell" : ""
          }`}
          onClick={() => handleClick(8)}
          disabled={disabled || value[8] !== null}
        >
          {value[8] && (
            <span className={`symbol symbol-${value[8]}`}>{value[8]}</span>
          )}
        </button>
      </div>
    </>
  );
}

export default Theboard;
