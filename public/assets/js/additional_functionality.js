const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", goBack);

function goBack() {
    window.location.href = 'https://www.games.samuelmichalcik.sk/src/secured.php';
}