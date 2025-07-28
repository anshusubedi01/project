<?php
// Set session path to ensure consistency
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
session_start();
include '../public/dbconnect.php';

// Generate CSRF token if not exists
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debug: Log received data
    error_log("Login POST data: " . print_r($_POST, true));
    
    // Validate CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        echo json_encode(['error' => 'CSRF token validation failed']);
        exit;
    }
    
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    
    // Validate input
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['error' => 'Password must be at least 6 characters']);
        exit;
    }
    
    try {
        // Use prepared statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT id, email, password, username, full_name FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Debug: Log user data
            error_log("User found: " . print_r($user, true));
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Set session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['logged_in'] = true;
                
                // Debug: Log session after setting
                error_log("Session after login: " . print_r($_SESSION, true));
                error_log("Session ID: " . session_id());
                
                // Don't regenerate session ID - this might be causing the issue
                // session_regenerate_id(true);
                
                echo json_encode(['success' => true, 'message' => 'Login successful!']);
            } else {
                error_log("Password verification failed for email: $email");
                echo json_encode(['error' => 'Invalid email or password']);
            }
        } else {
            error_log("No user found for email: $email");
            echo json_encode(['error' => 'Invalid email or password']);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        echo json_encode(['error' => 'An error occurred. Please try again.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?>