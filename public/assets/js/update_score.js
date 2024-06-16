function updateHighestScore(newScore) {
    fetch('../../lib/update_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `new_score=${newScore}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.highest_score !== undefined) {
            highestScoreEl.textContent = data.highest_score;
        }
    })
    .catch(error => console.error('Error:', error));
}

