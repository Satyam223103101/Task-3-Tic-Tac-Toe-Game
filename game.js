window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const display = document.getElementById('winningMessage');
    const aiButton = document.getElementById('aiBtn');
    const humanButton = document.getElementById('humanBtn');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let isAIEnabled = false;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleResultValidation() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === 'X' ? PLAYERX_WON : PLAYERO_WON;
            }
        }

        return board.includes('') ? undefined : TIE;
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                display.innerText = 'Player O Won!';
                break;
            case PLAYERX_WON:
                display.innerText = 'Player X Won!';
                break;
            case TIE:
                display.innerText = 'It\'s a Tie!';
                display.style.color = 'black';
                break;
        }
        display.classList.remove('hidden');
    };

    const updateDisplay = () => {
        display.innerText = `Player ${currentPlayer}'s turn`;

        display.classList.remove('playerX', 'playerO');
        display.classList.add(`player${currentPlayer}`);
    };

    updateDisplay();

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }
        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    };

    const aiMove = () => {
        const bestMove = minimax(board, currentPlayer).index;
        return bestMove;
    };

    const performAIMove = () => {
        const aiMoveIndex = aiMove();
        tiles[aiMoveIndex].innerText = currentPlayer;
        updateBoard(aiMoveIndex);

        const aiResult = handleResultValidation();
        if (aiResult) {
            announce(aiResult);
            isGameActive = false;
        } else {
            changePlayer();
            updateDisplay();
        }
    };

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);

            const result = handleResultValidation();
            if (result) {
                announce(result);
                isGameActive = false;
            } else {
                changePlayer();
                updateDisplay();

                if (isAIEnabled && currentPlayer === 'O' && isGameActive) {
                    performAIMove();
                }
            }
        }
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        display.classList.remove('hidden');
        currentPlayer = 'X';
        updateDisplay();

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX', 'playerO');
        });
    };

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);

    aiButton.addEventListener('click', () => {
        isAIEnabled = true;
        resetBoard();
        if (currentPlayer === 'O') {
            performAIMove();    
        }
    });

    humanButton.addEventListener('click', () => {
        isAIEnabled = false;
        resetBoard();
        display.classList.remove('playerX', 'playerO');
    });

    // Helper function to get available moves
    function getAvailableMoves(board) {
        return board.reduce((moves, cell, index) => {
            if (!cell) {
                moves.push(index);
            }
            return moves;
        }, []);
    }

    // Minimax algorithm
    function minimax(board, player) {
        const availableMoves = getAvailableMoves(board);

        if (handleResultValidation() === PLAYERX_WON) {
            return { score: -1 };
        } else if (handleResultValidation() === PLAYERO_WON) {
            return { score: 1 };
        } else if (handleResultValidation() === TIE) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < availableMoves.length; i++) {
            const move = {};
            move.index = availableMoves[i];

            board[availableMoves[i]] = player;

            if (player === 'O') {
                const result = minimax(board, 'X');
                move.score = result.score;
            } else {
                const result = minimax(board, 'O');
                move.score = result.score;
            }

            board[availableMoves[i]] = '';

            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }
});
