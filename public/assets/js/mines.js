// GAME INIT 
const minesBoard = document.getElementById("mines-board");
const actualScoreEl = document.getElementById("actual-score");
const highestScoreEl = document.getElementById("highest-score");
const notifEl = document.getElementById('notif');
const resetBtn = document.getElementById("reset-btn");
const pauseBtn = document.getElementById("pause-btn");
const flagBtn = document.getElementById("flag-btn")
const mineSound = document.getElementById("mine-sound");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

const boardWidth = 350;
const boardHeight = 350;
const cellSize = 25;
const cellsInRow = boardWidth / cellSize;
const cellsInCol = boardHeight / cellSize;
const cellsSum = cellsInRow * cellsInCol;
const minesNum = 25;

let cellsArray = [];
let cellRemaining = cellsSum - minesNum;
let running = false;
let paused = false;
let gameLost = false;
let actualTime = 0;
let bestTime = 0;
let tickSpeed = 1000;
let gameTimer = null;

resetBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", pauseGame);

// Function initializes default values and call essential functions to run game
function gameStart() {
    running = true;
    paused = false;
    gameLost = false;
    cellRemaining = cellsSum - minesNum;
    actualTime = 0;

    actualScoreEl.textContent = "0:00";
    notifEl.className = "";
    notifEl.textContent = "";
    
    renderMinesBoard();
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

// Function generates minesBoard as 2D array of cells
function generateCells() {
    cellsArray = Array.from({ length: cellsInRow }, () => 
        Array.from({ length: cellsInCol }, () => ({
            isRevealed: false,
            isMined: false,
            isFlagged: false,
            minesAround: 0,
            htmlEl: null
        }))
    );
}

// Function picks random cells from game board and place mines
function placeMines() {
    let placedMines = 0;
    while (placedMines < minesNum) {
        let x = Math.floor(Math.random() * cellsInRow);
        let y = Math.floor(Math.random() * cellsInCol);
        if (!cellsArray[x][y].isMined) {
            cellsArray[x][y].isMined = true;
            placedMines++;
            // If the cell is mined successfully, increase the number of mines around neighbouring cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (x + i >= 0 && x + i < cellsInRow && y + j >= 0 && y + j < cellsInCol) {
                        cellsArray[x + i][y + j].minesAround++;
                    }
                }
            }
        }
    }
}

// Function renders mines board dynamically into HTML DOM 
function renderMinesBoard() {
    generateCells();
    placeMines();

    for (let y = 0; y < cellsInRow; y++) {
        // Create a row as wrapper of cells
        const rowEl = document.createElement('div');
        rowEl.classList.add('mines-row');

        for (let x = 0; x < cellsInCol; x++) {
            // Create a cell
            const cellEl = document.createElement('div');
            cellEl.classList.add('mines-cell');
            cellEl.setAttribute('data-x', x);
            cellEl.setAttribute('data-y', y);
            cellEl.addEventListener('click', handleCellLeftClick);
            cellEl.addEventListener('contextmenu', handleCellRightClick);
            cellsArray[x][y].htmlEl = cellEl;
            rowEl.appendChild(cellEl);
        }
        minesBoard.appendChild(rowEl);
    }
}

// Function to handle left-click on a cell (reveal a cell), if the cell was mined, display game lost notif
function handleCellLeftClick(event) {
    const cellEl = event.target;
    const x = parseInt(cellEl.getAttribute('data-x'));
    const y = parseInt(cellEl.getAttribute('data-y'));

    if (cellsArray[x][y].isRevealed || cellsArray[x][y].isFlagged || !running || paused || gameLost) {
        return;
    }

    if (cellsArray[x][y].isMined) {
        cellsArray[x][y].isRevealed = true;
        cellEl.textContent = "💣";
        cellEl.classList.add('mines-cell-revealed');
        mineSound.play();
        running = false;
        gameLost = true;
        displayGameOver();
    } else {
        revealCells(x, y);
        checkGameOver();
    }
}

// Function to handle right-click on a cell (mark a cell with flag)
function handleCellRightClick(event) {
    event.preventDefault();
    const cellEl = event.target;
    const x = parseInt(cellEl.getAttribute('data-x'));
    const y = parseInt(cellEl.getAttribute('data-y'));

    if (cellsArray[x][y].isRevealed || !running || paused || gameLost) {
        return;
    }

    cellsArray[x][y].isFlagged = !cellsArray[x][y].isFlagged;
    
    if (cellsArray[x][y].isFlagged) {
        cellEl.textContent = "🚩";
    } else {
        cellEl.textContent = "";
    }
}

// Function which recursively reveals non mined neighbour cells 
function revealCells(x,y) {
    if ((x < 0 || x >= cellsInRow) || (y < 0 || y >= cellsInCol) || 
        cellsArray[x][y].isRevealed || cellsArray[x][y].isMined) {
        return;
    }

    cellsArray[x][y].isRevealed = true;
    cellsArray[x][y].htmlEl.classList.add('mines-cell-revealed');

    if (cellsArray[x][y].minesAround > 0) {
        cellsArray[x][y].htmlEl.textContent = cellsArray[x][y].minesAround;
        setClassIdentifier(x, y);
    } else {
        cellsArray[x][y].htmlEl.textContent = '';
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i !== 0 || j !== 0) {
                    revealCells(x + i, y + j);
                }
            }
        }
    }
    cellRemaining--;
}

// Function adds class to html cell, which changes text color according the number of mines around
function setClassIdentifier(x,y) {
    switch (cellsArray[x][y].minesAround) {
        case 1:
            cellsArray[x][y].htmlEl.classList.add('m1');
            break;
        case 2:
            cellsArray[x][y].htmlEl.classList.add('m2');
            break;
        case 3:
            cellsArray[x][y].htmlEl.classList.add('m3');
            break;
        case 4:
            cellsArray[x][y].htmlEl.classList.add('m4');
            break;
        case 5:
            cellsArray[x][y].htmlEl.classList.add('m5');
            break;
        case 6:
            cellsArray[x][y].htmlEl.classList.add('m6');
            break;
        case 7:
            cellsArray[x][y].htmlEl.classList.add('m7');
            break;
        case 8:
            cellsArray[x][y].htmlEl.classList.add('m8');
            break;
    }
}

// Function checks if all cells except mined ones have been revealed = player won 
function checkGameOver() {
    if (cellRemaining == 0 && running && !gameLost) {
        running = false;
        gameLost = false;
        displayGameOver();
    }
}

// Function displays result of game and update score
function displayGameOver() {
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";

    revealAll();
    displayNotification();

    // If bestTime == 0, it means that player did not play the game yet, so actual time can be set as its highest score
    if(!gameLost && (bestTime == 0 || actualTime < bestTime)) {
        updateBestTime();
        updateHighestScore(bestTime);
        updateRecordScore(bestTime);
        fetchHighestScore();
    } 
}

// Function to reveal all cells
function revealAll() {
    for (let y = 0; y < cellsInRow; y++) {
        for (let x = 0; x < cellsInCol; x++) {
            if (cellsArray[x][y].isMined) {
                cellsArray[x][y].htmlEl.textContent = "💣";
                cellsArray[x][y].isRevealed = true;
                cellsArray[x][y].htmlEl.classList.add('mines-cell-revealed');
            } else {
                if(cellsArray[x][y].minesAround == 0) {
                    cellsArray[x][y].htmlEl.textContent = "";
                } else {
                    cellsArray[x][y].htmlEl.textContent = cellsArray[x][y].minesAround;
                }
                cellsArray[x][y].isRevealed = true;
                cellsArray[x][y].htmlEl.classList.add('mines-cell-revealed');
                setClassIdentifier(x,y);
            }
        }
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

// Function delete all cells in mines gameboard, called in reset function
function deleteMinesBoard() {
    if(minesBoard) {
        while(minesBoard.firstChild) {
            minesBoard.removeChild(minesBoard.firstChild);
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

    deleteMinesBoard();
    clearTimeout(gameTimer);
    gameStart();
}