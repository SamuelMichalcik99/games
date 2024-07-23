<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../config/db_connect.php');
require_once('../lib/user/auth.php');

$_SESSION['game_title'] = 'snake';
$nickname = $_SESSION['nickname'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/styles/default.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <title>Snake</title>
</head>
<body>
    <div id="web-wrapper">
        <header>
            <div id="player-panel">
                <button id="back-btn"><i class="fas fa-arrow-left"></i></button>
                <p id="player-info" class="title-M">Welcome <span id="player-name"><?php echo htmlspecialchars($nickname); ?></span>!</p>
                <form id="logout-form" action="../lib/user/logout.php" method="post">
                    <button type="submit" id="logout-btn">Logout</button>
                </form>
            </div>
        </header>
        <div id="game-wrapper">
            <div class="inside-column-wrapper">
                <canvas id="snake-board" width="350" height="350"></canvas>
                <div class="notif-wrapper">
                    <p id="notif"></p>
                </div>
            </div>
            <div id="score-wrapper">
                <div class="inside-row-wrapper">
                    <h2>Your actual score: </h2>
                    <span id="actual-score" class="title-M">0</span>
                </div>
                <div class="inside-row-wrapper">
                    <h3>Your highest score: </h3>
                    <span id="highest-score" class="title-S">0</span>
                </div>
                <div id="game-control-btns" class="inside-row-wrapper">
                    <button id="reset-btn">Reset</button>
                    <button id="pause-btn">
                        <span id="play-icon"><i class="fas fa-play"></i></span>
                        <span id="pause-icon"><i class="fas fa-pause"></i></span>
                    </button>
                </div>
            </div> 
        </div>
    </div>
    <audio id="bite-sound" src="../media/bite.mp3"></audio>
    <script src="../assets/js/update_score.js"></script>
    <script src="../assets/js/update_record.js"></script>
    <script src="../assets/js/snake.js"></script>
    <script src="../assets/js/get_score.js"></script>
    <script src="../assets/js/additional_functionality.js"></script>
</body>
</html>