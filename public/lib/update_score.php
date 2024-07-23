<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once('../../config/db_connect.php');
require_once('user/auth.php');

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

    // Query to get game_id based on the game_title
    $sql = "SELECT game_id 
            FROM games 
            WHERE title = :game_title";
    $stmt = $db->prepare($sql);
    $stmt->execute([':game_title' => $game_title]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($game) {
        $game_id = $game['game_id'];

        // Query to get player's current highest score in the specific game
        $sql = "SELECT highest_score 
                FROM scores 
                WHERE player_id = :player_id AND game_id = :game_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':player_id' => $player_id, ':game_id' => $game_id]);
        $score = $stmt->fetch(PDO::FETCH_ASSOC);

        // Determine if the score exists and should be updated
        // In case of mines game, upade highest score when new_score is lower than actual (lower elapsed time means better results)
        // In case of other games, update highest score when new_score is higher than actual (more reached points means better results)
        // If the player's highest score does not exist yet (player have not played the game yet), insert new reached score as highest score
        $check_update_flag = false;
        if ($score) {
            if ($game_title == "mines" || $game_title == "sudoku") {
                $check_update_flag = ($new_score < $score['highest_score']);
            } else {
                $check_update_flag = ($new_score > $score['highest_score']);
            }

            if ($check_update_flag) {
                $sql = "UPDATE scores 
                        SET highest_score = :new_score 
                        WHERE player_id = :player_id AND game_id = :game_id";
                $stmt = $db->prepare($sql);
                $stmt->execute([':new_score' => $new_score, ':player_id' => $player_id, ':game_id' => $game_id]);
                echo json_encode(['highest_score' => $new_score]);
            } else {
                echo json_encode(['highest_score' => $score['highest_score']]);
            }
        } else {
            $sql = "INSERT INTO scores (player_id, game_id, highest_score) 
                    VALUES (:player_id, :game_id, :new_score)";
            $stmt = $db->prepare($sql);
            $stmt->execute([':player_id' => $player_id, ':game_id' => $game_id, ':new_score' => $new_score]);
            echo json_encode(['highest_score' => $new_score]);
        }
    } else {
        echo json_encode(['error' => 'Game not found.']);
    }
} else {
    echo json_encode(['error' => 'Player not found.']);
}
?>
