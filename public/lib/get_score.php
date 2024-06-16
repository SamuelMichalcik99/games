<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../config/db_connect.php');
require_once('user/auth.php');

$game_title = $_SESSION['game_title'];
$nickname = $_SESSION['nickname'];

// Query to get player_id based on the nickname
$sql = "SELECT player_id FROM players WHERE nickname = :nickname";
$stmt = $db->prepare($sql);
$stmt->execute([':nickname' => $nickname]);
$player = $stmt->fetch(PDO::FETCH_ASSOC);

if ($player) {
    $player_id = $player['player_id'];

    // Query to get game_id for Snake
    $sql = "SELECT game_id FROM games WHERE title = :game_title";
    $stmt = $db->prepare($sql);
    $stmt->execute([':game_title' => $game_title]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($game) {
        $game_id = $game['game_id'];

        // Query to get the highest score for the player in Snake
        $sql = "SELECT highest_score FROM scores WHERE player_id = :player_id AND game_id = :game_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':player_id' => $player_id, ':game_id' => $game_id]);
        $score = $stmt->fetch(PDO::FETCH_ASSOC);

        $highest_score = $score ? $score['highest_score'] : 0;
    } else {
        $highest_score = 0;
    }
} else {
    $highest_score = 0;
}
header('Content-Type: application/json');
echo json_encode(['highest_score' => $highest_score]);
?>