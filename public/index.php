<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once('../config/db_connect.php');

// Handle form submission
$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nickname = $_POST['nickname'];
    $password = $_POST['password'];

    // Check if the user exists
    $sql = "SELECT * FROM players WHERE nickname = :nickname";
    $stmt = $db->prepare($sql);
    $stmt->execute([':nickname' => $nickname]);
    $player = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($player) {
        // User exists, verify password
        if (password_verify($password, $player['password'])) {
            // Password is correct, set session and redirect to secured.php
            $_SESSION['nickname'] = $nickname;
            header("Location: /src/secured.php");
            exit();
        } else {
            $message = "Invalid password.";
        }
    } else {
        // User does not exist, create a new user
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $sql = "INSERT INTO players (nickname, password) VALUES (:nickname, :password)";
        $stmt = $db->prepare($sql);

        try {
            $stmt->execute([':nickname' => $nickname, ':password' => $hashedPassword]);
            // Set session and redirect to secured.php
            $_SESSION['nickname'] = $nickname;
            header("Location: /src/secured.php");
            exit();
        } catch (PDOException $e) {
            $message = "Error: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/styles/default.css">
    <title>GAMES</title>
</head>
<body>
    <div id="web-wrapper">
        <div id="login-wrapper">
            <h2>LOGIN TO PLAY</h2>
            <form id="login-form" method="POST" action="">
                <input type="text" name="nickname" placeholder="Nickname" required>
                <input type="password" name="password" placeholder="Password" required>
                <button id="login-btn" type="submit">Login</button>
            </form>
        </div>
    </div>
</body>
</html>