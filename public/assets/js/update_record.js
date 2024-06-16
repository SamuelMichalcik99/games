function updateRecordScore(newScore) {
    fetch('../../lib/update_record.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `new_score=${newScore}`
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}