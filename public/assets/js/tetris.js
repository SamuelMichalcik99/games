// GAME INIT 
const tetrisBoard = document.getElementById("tetris-board");
const nextTetrominoesBoard = document.getElementById("next-tetrominoes");
const context = tetrisBoard.getContext("2d");
const contextNext = nextTetrominoesBoard.getContext("2d");
const actualScoreEl = document.getElementById("actual-score");
const highestScoreEl = document.getElementById("highest-score");
const notifEl = document.getElementById('notif');
const resetBtn = document.getElementById("reset-btn");
const pauseBtn = document.getElementById("pause-btn");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const boardWidth = tetrisBoard.width;
const boardHeight = tetrisBoard.height;
const boardColor = "#cccccc";
const fieldSize = 25;
const fieldsInRow = boardWidth / fieldSize;
const fieldsInCol = boardHeight / fieldSize;

const ITetrominoColor = "#1a85ff";
const OTetrominoColor = "#00cf26";
const TTetrominoColor = "#f19800";
const STetrominoColor = "#ff3be8";
const ZTetrominoColor = "#450072";
const JTetrominoColor = "#FF0000";
const LTetrominoColor = "#780000";
const fieldBorderColor = "#777777";

let running = false;
let paused = false;
let gameOver = false;
let actualScore = 0;
let tickSpeed = 200;
let saveTickSpeed = 200;
let gameTimer = null;
let leftPressed = false;
let rightPressed = false;
let downPressed = false;
let horizontalMoveTimeout = null;

let tetrominoPosX = Math.floor(fieldsInRow / 2)-1;
let tetrominoPosY = -1;
let currentTetromino = null;
let fieldsArray = [];
let nextFieldsArray = [];
let nextTetrominoes = [];

const tetrominoes = [
    {
        shape: [
            [1, 1, 1, 1], 
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: ITetrominoColor,
        type: "I"
    },
    {
        shape: [
            [1, 1, 0], // O
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: OTetrominoColor,
        type: "O"
    },
    {
        shape: [
            [0, 1, 0], // T
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: TTetrominoColor,
        type: "T"
    },
    {
        shape: [
            [0, 1, 1], // S
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: STetrominoColor,
        type: "S"
    },
    {
        shape: [
            [1, 1, 0], // Z
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: ZTetrominoColor,
        type: "Z"
    },
    {
        shape: [
            [0, 1, 0], // J
            [0, 1, 0],
            [1, 1, 0]
        ],
        color: JTetrominoColor,
        type: "J"
    },
    {
        shape: [
            [1, 0, 0], // L
            [1, 0, 0],
            [1, 1, 0]
        ],
        color: LTetrominoColor,
        type: "L"
    },
];

window.addEventListener("keydown", controlTetromino);
window.addEventListener("keyup", keyUpHandler);
resetBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", pauseGame);

// Function initializes default values and call essential functions to run game
function gameStart() {
    running = true;
    paused = false;
    gameOver = false;

    actualScoreEl.textContent = 0;
    notifEl.className = "";
    notifEl.textContent = "";

    tetrominoPosX = Math.floor(fieldsInRow / 2)-1;
    tetrominoPosY = -1;
    currentTetromino = getNextTetromino();
    generateFields();
    generateNextFields();
    clearBoard(contextNext, nextFieldsArray);
    printnextTetrominoesBoard();
    nextTick();
}

// Function handles timer, which calls functions used to move and print tetrominoes 
function nextTick() {
    if(running && !paused){
        gameTimer = setTimeout(()=>{
            clearBoard(context, fieldsArray);
            moveTetromino();
            printTetromino();
            if(!gameOver) {
                nextTick();
            } else {
                displayGameOver();
            }
        }, tickSpeed);
    }
}

// Functiom generates array, which represents data structure of gameboard to store where the generated tetromino have been placed during game
function generateFields() {
    fieldsArray = Array.from({ length: fieldsInCol }, () => 
        Array.from({ length: fieldsInRow }, () => ({
            isEmpty: true,
            color: boardColor,
        }))
    );
}

// Functiom generates array, which represents data structure of next tetrominos
function generateNextFields() {
    nextFieldsArray = Array.from({ length: 5 }, () => 
        Array.from({ length: 11 }, () => ({
            isEmpty: true,
            color: boardColor,
        }))
    );
}

// Function clears the canvas 
function clearBoard(context, array) {
    context.strokeStyle = fieldBorderColor;

    array.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            context.fillStyle = value.color;

            context.fillRect(
                colIndex * fieldSize, 
                rowIndex * fieldSize, 
                fieldSize, 
                fieldSize
            );
            context.strokeRect(
                colIndex * fieldSize, 
                rowIndex * fieldSize, 
                fieldSize, 
                fieldSize
            );
        });
    });
}

// Function generates random number that represent random index in tetrominoes array
function getRandomTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    const tetromino = JSON.parse(JSON.stringify(tetrominoes[randomIndex]));
    return tetromino;
}

// Function handles returning first element of array nextTetrominos, extract first one and add new random one
function getNextTetromino() {
    let resultTetromino = null;
    if (nextTetrominoes.length != 2) {
        nextTetrominoes = [getRandomTetromino(), getRandomTetromino()]

    }
    resultTetromino = nextTetrominoes.shift();
    nextTetrominoes.push(getRandomTetromino());
    return resultTetromino;
}

// Function handles tetromino movement from top to bottom, checks collisions and lock tetromino in place, also update next tetrominos info
function moveTetromino() {
    tetrominoPosY++;

    if (checkCollision()) {
        tetrominoPosY--;
        placeTetromino();
        deleteLine();
        currentTetromino = getNextTetromino();
        clearBoard(contextNext, nextFieldsArray);
        printnextTetrominoesBoard();

        tetrominoPosX = Math.floor(fieldsInRow / 2)-1;
        tetrominoPosY = 0;

        // Check for game over condition when a new tetromino spawns
        if (checkCollision()) {
            gameOver = true;
            clearBoard(context, fieldsArray);
        }
    }
}

// Function checks if the current tetromino hits bottom or another tetrominoes
function checkCollision() {
    const shape = currentTetromino.shape;

    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
        for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
            if (shape[rowIndex][colIndex] === 1) {
                // Calculate absolute position on the board
                const absX = (tetrominoPosX + colIndex);
                const absY = (tetrominoPosY + rowIndex);

                // Check collision with bottom boundary
                if (absY == fieldsInCol) {
                    return true;
                }

                // Check collision with other tetrominoes
                if (absY >= 0 && absX >= 0 && absX < fieldsInRow && !fieldsArray[absY][absX].isEmpty) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Function handles tetromino's movement and rotations according player's interaction (keyboard arrows)
function controlTetromino(event) {
    const keyPressed = event.keyCode;
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;

    // Prevent the default action (scrolling) for arrow keys
    if ([leftKey, rightKey, upKey, downKey].includes(keyPressed)) {
        event.preventDefault();
    }

    // Shift tetromino left, right, rotate or place down faster
    switch (keyPressed) {
        case leftKey:
            if (!leftPressed) {
                leftPressed = true;
                startHorizontalMove('left');
            }
            break;
        case rightKey:
            if (!rightPressed) {
                rightPressed = true;
                startHorizontalMove('right');
            }
            break;
        case upKey:
            rotateTetromino();
            break;
        case downKey:
            if (!downPressed) {
                downPressed = true;
                shiftTetrominoDown();
            }
            break;
    }
}

// Function to start smooth horizontal movement
function startHorizontalMove(direction) {
    if ((direction === 'left' && leftPressed) || (direction === 'right' && rightPressed)) {
        if (direction === 'left') {
            tetrominoPosX--;
            if (checkCollision() || isOutOfBounds()) {
                tetrominoPosX++;
            }
        } else if (direction === 'right') {
            tetrominoPosX++;
            if (checkCollision() || isOutOfBounds()) {
                tetrominoPosX--;
            }
        }

        clearBoard(context, fieldsArray);
        printTetromino();

        // Continue moving horizontally with a timeout
        horizontalMoveTimeout = setTimeout(() => startHorizontalMove(direction), 100);
    }
}

// Function handles tetromino's left movement controlled by player
function shiftTetrominoLeft() {
    tetrominoPosX--;
    if (checkCollision() || isOutOfBounds()) {
        tetrominoPosX++; // Revert move if collision or out of bounds detected
    }
}

// Function handles tetromino's right movement controlled by player
function shiftTetrominoRight() {
    tetrominoPosX++;
    if (checkCollision() || isOutOfBounds()) {
        tetrominoPosX--; // Revert move if collision or out of bounds detected
    }
}

// Function handles tetromino's down movement controlled by player by increasing tickspeed
function shiftTetrominoDown() {
    tickSpeed = 25;
}

// Function stops horizontal movement or reset tick speed
function keyUpHandler(event) {
    const keyPressed = event.keyCode;
    const leftKey = 37;
    const rightKey = 39;
    const downKey = 40;

    if (keyPressed === leftKey) {
        leftPressed = false;
        stopHorizontalMove();
    } else if (keyPressed === rightKey) {
        rightPressed = false;
        stopHorizontalMove();
    } else if (keyPressed === downKey) {
        downPressed = false;
        resetTickSpeed();
    }
}

// Function handles reseting tickspeed to saved tickspeed value before pressing down key
function resetTickSpeed() {
    tickSpeed = saveTickSpeed;
}

// Function stops  horizontal movement
function stopHorizontalMove() {
    clearTimeout(horizontalMoveTimeout);
    horizontalMoveTimeout = null;
}

// Function rotates tetromino by 90°
function rotateTetromino() {
    const shape = currentTetromino.shape;
    const transposedShape = transponeAndReverseMatrix(shape);
    const alignedShape = alignTopLeft(transposedShape);


    // Check for collisions or out of bounds after rotation, revert the rotation if needed
    const previousShape = currentTetromino.shape;
    currentTetromino.shape = alignedShape;
    if (checkCollision() || isOutOfBounds()) {
        currentTetromino.shape = previousShape;
    }
}

// Functions transposes the matrix (shape) and reverses order of rows (first row of original matrix -> first column but reversed in new matrix)
function transponeAndReverseMatrix(shape) {
    const transposed = [];
    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
        for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
            if (!transposed[colIndex]) {
                transposed[colIndex] = [];
            }
            transposed[colIndex][shape.length - 1 - rowIndex] = shape[rowIndex][colIndex];
        }
    }
    return transposed;
}

// Function to align the tetromino shape to the top-left corner
function alignTopLeft(shape) {
    let minRowIndex = shape.length;
    let maxRowIndex = 0;
    let minColIndex = shape[0].length;
    let maxColIndex = 0;

    // Determine the bounds of non-empty cells
    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
        for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
            if (shape[rowIndex][colIndex] !== 0) {
                if (rowIndex < minRowIndex) minRowIndex = rowIndex;
                if (rowIndex > maxRowIndex) maxRowIndex = rowIndex;
                if (colIndex < minColIndex) minColIndex = colIndex;
                if (colIndex > maxColIndex) maxColIndex = colIndex;
            }
        }
    }

    // Create a new matrix (shape) with the aligned shape
    const trimmedShape = Array.from({ length: shape.length }, () => Array(shape[0].length).fill(0));
    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
        for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
            trimmedShape[rowIndex - minRowIndex][colIndex - minColIndex] = shape[rowIndex][colIndex];
        }
    }

    return trimmedShape;
}

// Check if the tetromino fits to the board
function isOutOfBounds() {
    const shape = currentTetromino.shape;

    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
        for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
            if (shape[rowIndex][colIndex] === 1) {
                // Calculate absolute position on the board
                const absX = (tetrominoPosX + colIndex);

                if (absX < 0 || absX >= fieldsInRow) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Function places tetromino after collision so save its position 
function placeTetromino() {
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;

    shape.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 1) {
                // Calculate the position in the fieldsArray
                const absX = tetrominoPosX + colIndex;
                const absY = tetrominoPosY + rowIndex;

                // Update the fieldsArray
                fieldsArray[absY][absX].isEmpty = false;
                fieldsArray[absY][absX].color = color;
            }
        });
    });
}

// Function deletes full row from gameboard, increase score, speed up the game by decreasing tickspeed
function deleteLine() {
    fieldsArray.forEach((row, rowIndex) => {
        let fullRowFlag = true;
        row.forEach((value, colIndex) => {
            if(value.isEmpty)
                fullRowFlag = false;
        });
        if(fullRowFlag) {
            // Remove the full row
            fieldsArray.splice(rowIndex, 1);

            // Add a new empty row at the top
            fieldsArray.unshift(Array.from({ length: fieldsInRow }, () => ({
                isEmpty: true,
                color: boardColor,
            })));

            actualScore++;
            actualScoreEl.textContent = actualScore;

            resetTickSpeed();
            if (tickSpeed > 25) {
                tickSpeed = tickSpeed * 0.95;
                saveTickSpeed = tickSpeed;
            } else {
                tickSpeed = 25;
                saveTickSpeed = tickSpeed;
            }
        }
    });
}

// Function prints current tetromino on canvas
function printTetromino() {
    context.fillStyle = currentTetromino.color;
    context.strokeStyle = fieldBorderColor;

    currentTetromino.shape.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 1) {
                context.fillRect(
                    (tetrominoPosX + colIndex) * fieldSize, 
                    (tetrominoPosY + rowIndex) * fieldSize, 
                    fieldSize, 
                    fieldSize
                );
                context.strokeRect(
                    (tetrominoPosX + colIndex) * fieldSize, 
                    (tetrominoPosY + rowIndex) * fieldSize, 
                    fieldSize, 
                    fieldSize
                );
            }
        });
    });
}

// Function prints next tetrominoes on next canvas
function printnextTetrominoesBoard() {
    let nextTetrominoPosX = 1;
    let nextTetrominoPosY = 1;

    nextTetrominoes.forEach((tetromino) => {
        contextNext.fillStyle = tetromino.color;
        contextNext.strokeStyle = fieldBorderColor;

        tetromino.shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value === 1) {
                    contextNext.fillRect(
                        (nextTetrominoPosX + colIndex) * fieldSize, 
                        (nextTetrominoPosY + rowIndex) * fieldSize, 
                        fieldSize, 
                        fieldSize
                    );
                    contextNext.strokeRect(
                        (nextTetrominoPosX + colIndex) * fieldSize, 
                        (nextTetrominoPosY + rowIndex) * fieldSize, 
                        fieldSize, 
                        fieldSize
                    );
                }
            });
        });

        nextTetrominoPosX = nextTetrominoPosX + tetromino.shape.length + 1;
    });
}

// End the game if a new tetromino immediately collides
function displayGameOver() {
    running = false;
    gameOver = true;

    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";

    notifEl.classList.add('title-M', 'notif-lost');
    notifEl.textContent = "GAME OVER";

    if(actualScore > highestScore) {
        highestScore = actualScore;
        updateHighestScore(highestScore);
        updateRecordScore(highestScore);
        fetchHighestScore();
    }
}

// Function to pause game and timer
function pauseGame() {
    paused = !paused;

    if(gameOver) {
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
    actualScore = 0;
    tickSpeed = 200;
    saveTickSpeed = 200;
    nextTetrominoes = [];

    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";

    clearTimeout(gameTimer);
    gameStart();
};