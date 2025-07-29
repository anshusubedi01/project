<?php
// Set session path to ensure consistency
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
session_start();
include '../public/dbconnect.php';

header('Content-Type: application/json');

// Debug: Log session data
error_log("=== REGISTER EVENT DEBUG ===");
error_log("Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));
error_log("POST data: " . print_r($_POST, true));
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_id = intval($_POST['eventId'] ?? 0);
    $email = trim($_POST['email'] ?? '');
    $contact = trim($_POST['contact'] ?? '');
    $address = trim($_POST['address'] ?? '');
    
    // Try to get user_id from session first
    $user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;
    
    // If session user_id is not available, try to get it from database using email
    if (!$user_id && $email) {
        try {
            $user_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $user_stmt->bind_param("s", $email);
            $user_stmt->execute();
            $user_result = $user_stmt->get_result();
            
            if ($user_result->num_rows === 1) {
                $user_row = $user_result->fetch_assoc();
                $user_id = $user_row['id'];
                error_log("Found user_id from database: $user_id for email: $email");
            }
            $user_stmt->close();
        } catch (Exception $e) {
            error_log("Error finding user by email: " . $e->getMessage());
        }
    }

    // Debug: Log processed data
    error_log("Processed data:");
    error_log("- event_id: $event_id");
    error_log("- email: '$email'");
    error_log("- contact: '$contact'");
    error_log("- address: '$address'");
    error_log("- user_id: $user_id");
    error_log("- session user_id: " . ($_SESSION['user_id'] ?? 'NOT SET'));

    // Check if user is logged in or found by email
    if (!$user_id) {
        error_log("ERROR: User not found - user_id is null or empty");
        echo json_encode(['success' => false, 'message' => 'Please login to register for events.']);
        exit;
    }

    // Validate required fields
    if (!$event_id || !$email || !$contact || !$address) {
        error_log("ERROR: Missing required fields");
        error_log("- event_id: $event_id");
        error_log("- email: '$email'");
        error_log("- contact: '$contact'");
        error_log("- address: '$address'");
        echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    try {
        // Check if user has already registered for this event
        $check_stmt = $conn->prepare("SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?");
        $check_stmt->bind_param("ii", $event_id, $user_id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'You have already registered for this event!']);
            $check_stmt->close();
            exit;
        }
        $check_stmt->close();

        // Insert new registration
        $insert_stmt = $conn->prepare("INSERT INTO event_registrations (event_id, user_id, email, contact, address, status) VALUES (?, ?, ?, ?, ?, 'pending')");
        $insert_stmt->bind_param("iisss", $event_id, $user_id, $email, $contact, $address);
        
        if ($insert_stmt->execute()) {
            error_log("SUCCESS: Registration inserted successfully");
            echo json_encode(['success' => true, 'message' => 'Registration successful! You will receive a confirmation email shortly.']);
        } else {
            error_log("ERROR: Database insert failed");
            echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
        }
        $insert_stmt->close();
        
    } catch (Exception $e) {
        error_log("Registration error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>