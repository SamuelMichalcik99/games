// GAME INIT 
const snakeBoard = document.getElementById("snake-board");
const context = snakeBoard.getContext("2d");
const actualScoreEl = document.getElementById("actual-score");
const highestScoreEl = document.getElementById("highest-score");
const notifEl = document.getElementById('notif');
const resetBtn = document.getElementById("reset-btn");
const pauseBtn = document.getElementById("pause-btn");
const biteSound = document.getElementById("bite-sound");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const boardWidth = snakeBoard.width;
const boardHeight = snakeBoard.height;
const boardColor = "#f2f2f2";
const fieldSize = 10;
const snakeColor = "#00ac17";
const snakeBorder = "#2d2d2d";
const foodColor = "red";

let running = false;
let paused = false;
let gameOver = false;
let directionChanged = false;
let xVelocity = fieldSize;
let yVelocity = 0;
let foodX = 0;
let foodY = 0;
let actualScore = 0;
let tickSpeed = 80;
let gameTimer = null;

let snake = [
    {x:fieldSize * 3, y:170},
    {x:fieldSize * 2, y:170},
    {x:fieldSize, y:170},
    {x:0, y:170}
]

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", pauseGame);

// Function initializes default values and call essential functions to run game
function gameStart() {
    running = true;
    paused = false;
    gameOver = false;
    
    actualScoreEl.textContent = actualScore;
    notifEl.className = "";
    notifEl.textContent = "";

    generateFood();
    printFood();
    nextTick();
};

// Function handles timer, which calls functions needed for printing food, snake and its movement 
function nextTick() {
    if(running && !paused){
        gameTimer = setTimeout(()=>{
            directionChanged = false;
            clearBoard();
            printFood();
            moveSnake();
            printSnake();
            checkGameOver();
            if(!gameOver) {
                nextTick();
            } else {
                displayGameOver();
            }
        }, tickSpeed);
    }
};

// Function clears the canvas 
function clearBoard() {
    context.fillStyle = boardColor;
    context.fillRect(0, 0, boardWidth, boardHeight);
};

// Function generates random coordinates for snake's food 
function generateFood() {
    function randomFood(max){
        const randomNumber = Math.round((Math.random() * max) / fieldSize) * fieldSize;
        return randomNumber;
    }
    foodX = randomFood(boardWidth - fieldSize);
    foodY = randomFood(boardHeight - fieldSize);
};

// Function prints the food on the canvas 
function printFood() {
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, fieldSize, fieldSize);
};

// Function updates snake's position, handles food consumption, and increments speed everytime the snake eats the food
function moveSnake() {
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    snake.unshift(head);
    if(snake[0].x == foodX && snake[0].y == foodY) {
        actualScore++;
        actualScoreEl.textContent = actualScore;
        generateFood();
        tickSpeed = tickSpeed * 0.99;
    } else {
        snake.pop();
    }
};

// Function prints the snake on the canvas
function printSnake() {
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, fieldSize, fieldSize);
        context.strokeRect(snakePart.x, snakePart.y, fieldSize, fieldSize);
    })
};

// Function handles snake's movement according player's interaction (keyboard arrows)
function changeDirection(event) {
    // prevent to change direction more than once in one tick (snake would eat itself)
    if (directionChanged) {
        return;
    }

    const keyPressed = event.keyCode;
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;

    const goingLeft = (xVelocity == -fieldSize);
    const goingRight = (xVelocity == fieldSize);
    const goingUp = (yVelocity == -fieldSize);
    const goingDown = (yVelocity == fieldSize);

    // prevent the default action (scrolling) for arrow keys
    if ([leftKey, rightKey, upKey, downKey].includes(keyPressed)) {
        event.preventDefault();
    }

    // change direction control
    switch(true) {
        case(keyPressed == leftKey && !goingRight):
            xVelocity = -fieldSize;
            yVelocity = 0;
            directionChanged = true;
            break;
        case(keyPressed == rightKey && !goingLeft):
            xVelocity = fieldSize;
            yVelocity = 0;
            directionChanged = true;
            break;
        case(keyPressed == upKey && !goingDown):
            xVelocity = 0;
            yVelocity = -fieldSize;
            directionChanged = true;
            break;
        case(keyPressed == downKey && !goingUp):
            xVelocity = 0;
            yVelocity = fieldSize;
            directionChanged = true;
            break;
    }
};

// Function checks if the game is over
function checkGameOver() {
    // check if the snake did not exceed the game board
    switch(true) {
        case (snake[0].x < 0):
            running = false;
            gameOver = true;
            break;
        case (snake[0].x >= boardWidth):
            running = false;
            gameOver = true;
            break;    
        case (snake[0].y < 0):
            running = false;
            gameOver = true;
            break;
        case (snake[0].y >= boardHeight):
            running = false;
            gameOver = true;
            break;   
    }

    // check if the snake does not eat itself
    for(let i = 1; i < snake.length; i++) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            let bodyPartsRemoved = snake.length - i;
            actualScore = actualScore - bodyPartsRemoved;
            actualScoreEl.textContent = actualScore;
            snake = snake.slice(0, i);
            biteSound.play();
            break;
        }
    }
};

// Function displays game ove notification
function displayGameOver() {
    running = false;
    gameOver = true;

    notifEl.classList.add('title-M', 'notif-lost');
    notifEl.textContent = "GAME OVER";

    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";

    if(actualScore > highestScore) {
        highestScore = actualScore;
        updateHighestScore(highestScore);
        updateRecordScore(highestScore);
        fetchHighestScore();
    }
};

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
    xVelocity = fieldSize;
    yVelocity = 0;
    tickSpeed = 80;
    snake = [
        {x:fieldSize * 4, y:240},
        {x:fieldSize * 3, y:240},
        {x:fieldSize * 2, y:240},
        {x:fieldSize, y:240},
        {x:0, y:240}
    ]

    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";

    clearTimeout(gameTimer);
    gameStart();
};
