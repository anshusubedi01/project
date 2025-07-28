<?php
session_start();
include '../public/dbconnect.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debug: Log received data
    error_log("Received POST data: " . print_r($_POST, true));
    
    // Validate CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        echo json_encode(['error' => 'CSRF token validation failed']);
        exit;
    }
    
    $username = trim($_POST['username'] ?? '');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';
    $full_name = trim($_POST['full_name'] ?? $username);
    
    // Debug: Log processed data
    error_log("Processed data - username: '$username', email: '$email', password: '" . strlen($password) . " chars', confirmPassword: '" . strlen($confirmPassword) . " chars'");
    
    // Validate input
    if (empty($username) || empty($email) || empty($password) || empty($confirmPassword)) {
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }
    
    // Email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }
    
    // Username validation
    if (strlen($username) < 3 || strlen($username) > 20) {
        echo json_encode(['error' => 'Username must be between 3 and 20 characters']);
        exit;
    }
    
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        echo json_encode(['error' => 'Username can only contain letters, numbers, and underscores']);
        exit;
    }
    
    // Password validation
    if (strlen($password) < 8) {
        echo json_encode(['error' => 'Password must be at least 8 characters long']);
        exit;
    }
    
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password)) {
        echo json_encode(['error' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)']);
        exit;
    }
    
    // Confirm password validation
    if ($password !== $confirmPassword) {
        echo json_encode(['error' => 'Passwords do not match']);
        exit;
    }
    
    try {
        // Check if email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(['error' => 'Email already registered']);
            $stmt->close();
            exit;
        }
        $stmt->close();
        
        // Check if username already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(['error' => 'Username already taken']);
            $stmt->close();
            exit;
        }
        $stmt->close();
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $email, $hashed_password, $full_name);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registration successful']);
        } else {
            echo json_encode(['error' => 'Registration failed']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Registration error: " . $e->getMessage());
        echo json_encode(['error' => 'An error occurred. Please try again.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?>