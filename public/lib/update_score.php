<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

    // Query to get game_id
    $sql = "SELECT game_id 
            FROM games 
            WHERE title = :game_title";
    $stmt = $db->prepare($sql);
    $stmt->execute([':game_title' => $game_title]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($game) {
        $game_id = $game['game_id'];

        // Check the current highest score
        $sql = "SELECT highest_score 
                FROM scores 
                WHERE player_id = :player_id 
                AND game_id = :game_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':player_id' => $player_id, ':game_id' => $game_id]);
        $score = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($score) {
            // Update the score if the new score is higher
            if ($new_score > $score['highest_score']) {
                $sql = "UPDATE scores 
                        SET highest_score = :new_score 
                        WHERE player_id = :player_id AND game_id = :game_id";
                $stmt = $db->prepare($sql);
                $stmt->execute([':new_score' => $new_score, ':player_id' => $player_id, ':game_id' => $game_id]);
                header('Content-Type: application/json');
                echo json_encode(['highest_score' => $new_score]);
            } else {
                header('Content-Type: application/json');
                echo json_encode(['highest_score' => $score['highest_score']]);
            }
        } else {
            // Insert new score if no score exists
            $sql = "INSERT INTO scores (player_id, game_id, highest_score) 
                    VALUES (:player_id, :game_id, :new_score)";
            $stmt = $db->prepare($sql);
            $stmt->execute([':player_id' => $player_id, ':game_id' => $game_id, ':new_score' => $new_score]);
            header('Content-Type: application/json');
            echo json_encode(['highest_score' => $new_score]);
        }
    }
}
?>