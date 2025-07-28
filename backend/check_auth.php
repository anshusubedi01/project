<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        'logged_in' => true,
        'user_id' => $_SESSION['user_id'],
        'email' => $_SESSION['user_email'],
        'username' => $_SESSION['username'],
        'is_admin' => $_SESSION['is_admin']
    ]);
} else {
    echo json_encode([
        'logged_in' => false
    ]);
}
?> 