document.addEventListener("DOMContentLoaded", async function() {
    await fetchHighestScore();
    gameStart();
});

async function fetchHighestScore() {
    try {
        const response = await fetch('../../lib/get_score.php');
        const data = await response.json();

        if(data.game_title == "mines" || data.game_title == "sudoku") {
            bestTime = data.highest_score;
            minutes =  Math.floor(bestTime / 60);
            seconds = bestTime % 60;

            highestScoreEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            highestScore = data.highest_score;
            highestScoreEl.textContent = highestScore;
        }
    } catch (error) {
        console.error('Error fetching highest score:', error);
    }
}
