const boardElement = document.getElementById("sudoku-board");
const solveBtn = document.getElementById("solve-btn");
const errorMessage = document.getElementById("error-message");

let cells = [];
let board = Array.from({ length: 9 }, () => Array(9).fill(0));

// Create Sudoku board UI
function createBoard() {
    for (let row = 0; row < 9; row++) {
        cells[row] = [];
        for (let col = 0; col < 9; col++) {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.classList.add("cell");

            input.addEventListener("input", (e) => {
                const val = e.target.value;
                if (!/^[1-9]?$/.test(val)) {
                    e.target.value = "";
                    showError("Only numbers 1-9 allowed");
                    return;
                }
                clearError();
                if (val) {
                    board[row][col] = parseInt(val);
                    input.classList.add("user-input");
                    if (!isValid(board, row, col)) {
                        showError("Invalid placement!");
                    }
                } else {
                    board[row][col] = 0;
                    input.classList.remove("user-input");
                }
            });

            boardElement.appendChild(input);
            cells[row][col] = input;
        }
    }
}
const eraseBtn = document.getElementById("erase-btn");

eraseBtn.addEventListener("click", () => {
    clearError();
    board = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            cells[r][c].value = "";
            cells[r][c].classList.remove("user-input", "auto-fill");
        }
    }
});

// Show error
function showError(msg) {
    errorMessage.textContent = msg;
}

// Clear error
function clearError() {
    errorMessage.textContent = "";
}

// Check if number is valid at position
function isValid(board, row, col) {
    const num = board[row][col];

    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === num) return false;
        if (i !== row && board[i][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if ((r !== row || c !== col) && board[r][c] === num) return false;
        }
    }
    return true;
}

// Backtracking Sudoku Solver
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    board[row][col] = num;
                    if (isValid(board, row, col) && solveSudoku(board)) {
                        return true;
                    }
                    board[row][col] = 0;
                }
                return false;
            }
        }
    }
    return true;
}

// Solve button click event
solveBtn.addEventListener("click", () => {
    clearError();
    let tempBoard = board.map(row => [...row]);
    if (solveSudoku(tempBoard)) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                cells[r][c].value = tempBoard[r][c];
                if (!cells[r][c].classList.contains("user-input")) {
                    cells[r][c].classList.add("auto-fill");
                }
            }
        }
        board = tempBoard;
    } else {
        showError("No solution exists for the given board");
    }
});

createBoard();
const themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggleBtn.textContent = "☀️ Light Mode";
    } else {
        themeToggleBtn.textContent = "🌙 Dark Mode";
    }
});
