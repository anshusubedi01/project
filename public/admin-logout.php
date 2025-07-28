<?php
session_start();

// Clear admin session variables
unset($_SESSION['admin_id']);
unset($_SESSION['admin_username']);
unset($_SESSION['admin_name']);

// Destroy the session
session_destroy();

// Clear admin cookie
setcookie('adminLoggedIn', '', time() - 3600, '/');

// Redirect to admin login
header('Location: admin-login.php');
exit;
?> 