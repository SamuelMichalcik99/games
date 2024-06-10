
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/styles/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <title>Snake</title>
</head>
<body>
    <div id="web-wrapper">
        <div id="game-wrapper">
            <canvas id="game-board" width="500" height="500">
            </canvas>
            <div id="score-wrapper">
                <div class="inside-row-wrapper">
                    <h2>Your actual score: </h2>
                    <span id="actual-score" class="title-M">0</span>
                </div>
                <div class="inside-row-wrapper">
                    <h3>Highest score: </h3>
                    <span id="highest-score" class="title-S">0</span>
                </div>
                <div class="inside-row-wrapper">
                    <button id="reset-btn">Reset</button>
                    <button id="pause-btn">
                        <span id="play-icon"><i class="fas fa-play"></i></span>
                        <span id="pause-icon"><i class="fas fa-pause"></i></span>
                    </button>
                </div>
            </div> 
        </div>
    </div>
    <audio id="bite-sound" src="bite.mp3"></audio>
    <script src="js/index.js"></script>
</body>
</html>