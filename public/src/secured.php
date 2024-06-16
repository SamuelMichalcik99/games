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
    <title>Secured</title>
</head>
<body>
    <header>
        <div id="player-panel">
            <p id="player-info" class="title-M">Welcome <span id="player-name"><?php echo htmlspecialchars($nickname); ?></span>!</p>
            <form id="logout-form" action="../lib/user/logout.php" method="post">
                <button type="submit" id="logout-btn">Logout</button>
            </form>
        </div>
    </header>
    <div id="web-wrapper">
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
                <div id="game-battleship" class="game">
                    <p><a href="battleship.php">BATTLESHIP</a></p>
                    <p id="battleship-record-player" class="title-S">Best player</p>
                    <p id="battleship-record-score" class="title-S">Record score</p>
                </div>
                <div id="game-tic-tac-toe" class="game">
                    <p><a href="tic_tac_toe.php">TIC-TAC-TOE</a></p>
                    <p id="tic-tac-toe-record-player" class="title-S">Best player</p>
                    <p id="tic-tac-toe-record-score" class="title-S">Record score</p>
                </div>
            </div>
        </div>
    </div>
    <script src="../assets/js/get_record.js"></script>
</body>
</html>