<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../config/db_connect.php');
require_once('../lib/user/auth.php');

$nickname = $_SESSION['nickname'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/styles/default.css">
    <title>Games</title>
</head>
<body>
    <div id="web-wrapper">
        <header>
            <div id="player-panel">
                <p id="player-info" class="title-M">Welcome <span id="player-name"><?php echo htmlspecialchars($nickname); ?></span>!</p>
                <form id="logout-form" action="../lib/user/logout.php" method="post">
                    <button type="submit" id="logout-btn">Logout</button>
                </form>
            </div>
        </header>
        <div id="gamelist-wrapper">
            <div class="games-row-wrapper">
                <div id="game-snake" class="game">
                    <p><a href="snake.php">SNAKE</a></p>
                    <p id="snake-record-player" class="title-S">Best player</p>
                    <p id="snake-record-score" class="title-S">Record score</p>
                </div>
                <div id="game-mines" class="game">
                    <p><a href="mines.php">MINES</a></p>
                    <p id="mines-record-player" class="title-S">Best player</p>
                    <p id="mines-record-score" class="title-S">Record score</p>
                </div>
            </div>
            <div class="games-row-wrapper">
                <div id="game-tetris" class="game">
                    <p><a href="tetris.php">TETRIS</a></p>
                    <p id="tetris-record-player" class="title-S">Best player</p>
                    <p id="tetris-record-score" class="title-S">Record score</p>
                </div>
                <div id="game-sudoku" class="game">
                    <p><a href="sudoku.php">SUDOKU</a></p>
                    <p id="sudoku-record-player" class="title-S">Best player</p>
                    <p id="sudoku-record-score" class="title-S">Record score</p>
                </div>
            </div>
        </div>
    </div>
    <script src="../assets/js/get_record.js"></script>
    <script src="assets/js/ws-client/socket.io.js"></script>
    <script src="../assets/ws-client/ws-client.js"></script>
</body>
</html>