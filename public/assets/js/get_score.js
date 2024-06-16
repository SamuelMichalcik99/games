document.addEventListener("DOMContentLoaded", async function() {
    await fetchHighestScore();
    gameStart();
});

async function fetchHighestScore() {
    try {
        const response = await fetch('../../lib/get_score.php');
        const data = await response.json();
        highestScore = data.highest_score;
        highestScoreEl.textContent = highestScore;
    } catch (error) {
        console.error('Error fetching highest score:', error);
    }
}
