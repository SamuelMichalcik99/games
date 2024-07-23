// GAME INIT 
const sudokuBoard = document.getElementById("sudoku-board");
const actualScoreEl = document.getElementById("actual-score");
const highestScoreEl = document.getElementById("highest-score");
const notifEl = document.getElementById('notif');
const resetBtn = document.getElementById("reset-btn");
const pauseBtn = document.getElementById("pause-btn");
const flagBtn = document.getElementById("flag-btn")
const mineSound = document.getElementById("mine-sound");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

const boardWidth = 360;
const boardHeight = 360;
const cellSize = 40;
const cellsInRow = boardWidth / cellSize;
const cellsInCol = boardHeight / cellSize;
const cellsSum = cellsInRow * cellsInCol;
const filledCells = 35; 

let cellsArray = [];
let cellsArrayCopy = [];
let cellsArraySolved = [];
let cellRemaining = cellsSum - filledCells;
let running = false;
let paused = false;
let gameLost = false;
let actualTime = 0;
let bestTime = 0;
let tickSpeed = 1000;
let gameTimer = null;
let solutions = 0;

resetBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", pauseGame);

// Function initializes default values and call essential functions to run game
function gameStart() {
    running = true;
    paused = false;
    gameLost = false;
    cellRemaining = cellsSum - filledCells;
    actualTime = 0;

    actualScoreEl.textContent = "0:00";
    notifEl.className = "";
    notifEl.textContent = "";
    
    renderSudokuBoard();
    nextTick();
};

// Function handles timer and function that updates the player's time in actual game
function nextTick() {
    if(running && !paused){
        gameTimer = setTimeout(()=>{
            updateActualTime();
            if (running && !gameLost) {
                nextTick();
            }
        }, tickSpeed);
    }
};

// Function generates sudokuBoard as 2D array of cells
function generateGrid() {
    cellsArray = Array.from({ length: cellsInCol }, () => 
        Array.from({ length: cellsInRow }, () => 0)
    );
}

// Function generates the sudoku using backtracking alghoritm (similar to solveSudoku) but adds some randomness by shuffling the possible input array. 
function fillGrid() {
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            if (cellsArray[rowIndex][colIndex] === 0) {
                let numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isValid(cellsArray, rowIndex, colIndex, num)) {
                        cellsArray[rowIndex][colIndex] = num;
                        if (fillGrid()) {
                            return true;
                        } else {
                            cellsArray[rowIndex][colIndex] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    cellsArraySolved = JSON.parse(JSON.stringify(cellsArray));
    return true;
}

// Function solves the sudoku using backtracking alghoritm
// Alghoritm tries to find solution of the sudoku. If the sudoku has more than one solution, the generated grid was not correct sudoku.
function solveSudoku() {
    if (solutions > 1) {
        return;
    }

    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            if (cellsArray[rowIndex][colIndex] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(cellsArray, rowIndex, colIndex, num)) {
                        cellsArray[rowIndex][colIndex] = num;
                        solveSudoku();
                        cellsArray[rowIndex][colIndex] = 0;
                    }
                }
                return;
            }
        }
    }
    solutions++;
}

// Function checks how many solutions has current state of grid using solveSudoku
function checkUniqueSolution() {
    solutions = 0;
    solveSudoku();
    return solutions;
}

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function checks if placing a number is valid
function isValid(grid, rowIndex, colIndex, num) {
    if (checkRowValidity(grid, rowIndex, num) && checkColumnValidity(grid, colIndex, num) && checkBlockValidity(grid, rowIndex, colIndex, num)) {
        return true;
    } else {
        return false;
    }
}

// Function checks if the number is valid in the given row
function checkRowValidity(grid, rowIndex, num) {
    for (let colIndex = 0; colIndex < cellsInRow; colIndex++) {
        if (grid[rowIndex][colIndex] === num) {
            return false;
        }
    }
    return true;
}

// Function checks if the number is valid in the given column
function checkColumnValidity(grid, colIndex, num) {
    for (let rowIndex = 0; rowIndex < cellsInCol; rowIndex++) {
        if (grid[rowIndex][colIndex] === num) {
            return false;
        }
    }
    return true;
}

// Function checks if the number is valid in its 3x3 block
function checkBlockValidity(grid, rowIndex, colIndex, num) {
    let startRow = 3 * Math.floor(rowIndex / 3);
    let startCol = 3 * Math.floor(colIndex / 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Function creates sudoku by removing numbers at random positions in already generated grid
// Number is deleted in order to preserve the unique solution of sudoku
function createSudoku() {
    let removedCells = 0;
    while (removedCells < cellsSum - filledCells) {
        let rowIndex = Math.floor(Math.random() * 9);
        let colIndex = Math.floor(Math.random() * 9);
        if (cellsArray[rowIndex][colIndex] !== 0) {
            let temp = cellsArray[rowIndex][colIndex];
            cellsArray[rowIndex][colIndex] = 0;
            if (checkUniqueSolution() != 1) {
                cellsArray[rowIndex][colIndex] = temp; // Restore if not unique
            } else {
                removedCells++;
            }
        }
    }
}

// Function renders sudoku board dynamically into HTML DOM 
function renderSudokuBoard() {
    generateGrid();
    fillGrid();
    createSudoku();

    for (let i = 0; i < 3; i++) {
        const blockRow = document.createElement('div');
        blockRow.classList.add('sudoku-block-row');
        
        for (let j = 0; j < 3; j++) {
            const block = document.createElement('div');
            block.classList.add('sudoku-block');
            
            for (let k = 0; k < 3; k++) {
                const row = document.createElement('div');
                row.classList.add('sudoku-row');
                
                for (let l = 0; l < 3; l++) {
                    const cell = document.createElement('div');
                    cell.classList.add('sudoku-cell');
                    
                    // Calculate the correct indexes in the cellsArray
                    let rowIndex = i * 3 + k;
                    let colIndex = j * 3 + l;

                    if (cellsArray[rowIndex][colIndex] === 0) {
                        const input = document.createElement('input');
                        input.classList.add('sudoku-input');
                        input.setAttribute('data-x', colIndex);
                        input.setAttribute('data-y', rowIndex);
                        input.type = 'text';
                        input.maxLength = 1;
                        input.addEventListener('input', handleUserInput);
                        cell.appendChild(input);
                    } else {
                        cell.textContent = cellsArray[rowIndex][colIndex];
                    }
                    row.appendChild(cell);
                }
                block.appendChild(row);
            }
            blockRow.appendChild(block);
        }
        sudokuBoard.appendChild(blockRow);
    }
}

// Function to handle user input
function handleUserInput(event) {
    const input = event.target.value;
    const x = parseInt(event.target.getAttribute('data-x'));
    const y = parseInt(event.target.getAttribute('data-y'));

    // Validate input - only numbers 1-9 allowed
    if (!/^[1-9]$/.test(input)) {
        event.target.value = '';
        return;
    }

    cellsArray[y][x] = parseInt(input);
    cellRemaining--;
    checkGameOver();
}

// Function checks if the players's solution is valid solution
function checkResult() {
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            if (cellsArray[rowIndex][colIndex] != cellsArraySolved[rowIndex][colIndex]) {
                return false;
            }
        }
    }
    return true;
}

// Function evaluates if player won or lost
function checkGameOver() {
    console.log(cellRemaining);
    if (cellRemaining == 0 && running) {
        running = false;
        gameLost = checkResult() ? false : true;
        displayGameOver();
    }
}

// Function displays result of game and update score
function displayGameOver() {
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";

    displayNotification();

    // If bestTime == 0, it means that player did not play the game yet, so actual time can be set as its highest score
    if(!gameLost && (bestTime == 0 || actualTime < bestTime)) {
        updateBestTime();
        updateHighestScore(bestTime);
        updateRecordScore(bestTime);
        fetchHighestScore();
    } 
}

// Function displays notification whether the player won or lost
function displayNotification() {
    notifEl.classList.add('title-M');

    if(gameLost) {
        notifEl.textContent = "GAME LOST";
        notifEl.classList.add('notif-lost');
    } else {
        notifEl.textContent = "GAME WON";
        notifEl.classList.add('notif-won');
    }
}

// Function which convert seconds and updates actual time
function updateActualTime() {
    actualTime++;
    let minutes = Math.floor(actualTime / 60);
    let seconds = actualTime % 60;

    actualScoreEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function which convert seconds and updates best time
function updateBestTime() {
    bestTime = actualTime;
    let minutes = Math.floor(bestTime / 60);
    let seconds = bestTime % 60;

    highestScoreEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function delete all html elements and cells in sudoku gameboard, called in reset function
function deleteSudokuBoard() {
    if(sudokuBoard) {
        while(sudokuBoard.firstChild) {
            sudokuBoard.removeChild(sudokuBoard.firstChild);
        }
    }
}

// Function to pause game and timer
function pauseGame() {
    paused = !paused;

    if(!running) {
        resetGame();
        return;
    }

    if (running && paused) {
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
    } else {
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline";
    }

    if(paused == false) {
        nextTick();
    }
}

// Function to reset game and clear timer
function resetGame() {
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";

    cellsArray = [];
    cellsArrayCopy = [];
    cellsArraySolved = [];

    deleteSudokuBoard();
    clearTimeout(gameTimer);
    gameStart();
}