const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (index >= 0 && index < 9 && board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, setMark, resetBoard };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const GameController = (() => {
    const player1 = Player("Jugador X", "X");
    const player2 = Player("Jugador O", "O");
    let activePlayer = player1;
    let isGameOver = false;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const getActivePlayer = () => activePlayer;

    const checkWinner = () => {
        const board = Gameboard.getBoard();

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                isGameOver = true;
                return `${activePlayer.name} ha ganado!`;
            }
        }

        if (!board.includes("")) {
            isGameOver = true;
            return "Es un empate!";
        }

        return null; 
    };

    const playRound = (index) => {
        if (isGameOver) return;
        const markSuccess = Gameboard.setMark(index, activePlayer.mark);

        if (markSuccess) {
            const result = checkWinner();
            
            if (result) {
                DisplayController.setResultMessage(result);
            } else {
                switchPlayerTurn();
                DisplayController.setMessage(`Turno de ${getActivePlayer().name}`);
            }
            
            DisplayController.updateGameboard();
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        isGameOver = false;
        activePlayer = player1;
        DisplayController.setMessage(`Turno de ${player1.name}`);
        DisplayController.updateGameboard();
    };

    return { playRound, getActivePlayer, resetGame, getIsGameOver: () => isGameOver };
})();


const DisplayController = (() => {
    const boardDiv = document.getElementById("board");
    const messageEl = document.getElementById("message");
    const restartBtn = document.getElementById("restart-btn");
    const cells = document.querySelectorAll(".cell");

    const updateGameboard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.classList.remove("x", "circle");
            if (board[index] === "X") cell.classList.add("x");
            if (board[index] === "O") cell.classList.add("circle");
        });
    };

    const setMessage = (msg) => {
        messageEl.textContent = msg;
    };

    const setResultMessage = (result) => {
        messageEl.textContent = result;
    };

    cells.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            GameController.playRound(parseInt(index));
        });
    });

    restartBtn.addEventListener("click", () => {
        GameController.resetGame();
    });

    return { updateGameboard, setMessage, setResultMessage };
})();