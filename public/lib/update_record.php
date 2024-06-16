
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../config/db_connect.php');
require_once('user/auth.php');

header('Content-Type: application/json');

$game_title = $_SESSION['game_title'];
$nickname = $_SESSION['nickname'];
$new_score = $_POST['new_score'];

// Query to get player_id based on the nickname
$sql = "SELECT player_id 
        FROM players 
        WHERE nickname = :nickname";
$stmt = $db->prepare($sql);
$stmt->execute([':nickname' => $nickname]);
$player = $stmt->fetch(PDO::FETCH_ASSOC);

if ($player) {
    $player_id = $player['player_id'];

    // Query to get game_id for the specified game
    $sql = "SELECT game_id, highest_score, best_player_id 
            FROM games 
            WHERE title = :game_title";
    $stmt = $db->prepare($sql);
    $stmt->execute([':game_title' => $game_title]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($game) {
        $game_id = $game['game_id'];
        $current_highest_score = $game['highest_score'];
        $current_best_player_id = $game['best_player_id'];

        // If no one has played the game yet, update with the new score and player
        if ($current_highest_score === null || $current_best_player_id === null || $new_score > $current_highest_score) {
            $sql = "UPDATE games 
                    SET highest_score = :new_score, best_player_id = :player_id
                    WHERE game_id = :game_id";
            $stmt = $db->prepare($sql);
            $stmt->execute([':new_score' => $new_score, ':player_id' => $player_id, ':game_id' => $game_id]);
            echo json_encode(['highest_score' => $new_score]);
        } else {
            echo json_encode(['highest_score' => $current_highest_score]);
        }
    } else {
        echo json_encode(['error' => 'Game not found.']);
    }
} else {
    echo json_encode(['error' => 'Player not found.']);
}
?>