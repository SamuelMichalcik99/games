document.addEventListener("DOMContentLoaded", async function() {
    await fetchGameRecords();
});

async function fetchGameRecords() {
    try {
        const response = await fetch('../../lib/get_record.php');
        const data = await response.json();

        data.forEach(record => {
            const gameTitle = record.title.toLowerCase();
            const playerEl = document.getElementById(`${gameTitle}-record-player`);
            const scoreEl = document.getElementById(`${gameTitle}-record-score`);

            if (playerEl && scoreEl) {
                playerEl.textContent = record.nickname;
                scoreEl.textContent = record.highest_score;
            }
        });
    } catch (error) {
        console.error('Error fetching game records:', error);
    }
}