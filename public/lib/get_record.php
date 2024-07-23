<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once('../../config/db_connect.php');

// Query to get the best player and score for each game to fill data at secured player's panel
$sql = "SELECT g.title, g.highest_score, p.nickname
        FROM games g
        JOIN players p ON g.best_player_id = p.player_id";
$stmt = $db->prepare($sql);
$stmt->execute();
$records = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($records);
?>