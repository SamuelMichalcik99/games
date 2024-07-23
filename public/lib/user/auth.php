<?php
session_start();

// Check if user is logged in, if not, redirect to index.php containing login form
if (!isset($_SESSION['nickname'])) {
    header("Location: /index.php");
    exit();
}
?>