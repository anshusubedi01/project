<?php
session_start();
include '../public/dbconnect.php';
header('Content-Type: application/json');

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $event_date = $_POST['event_date'] ?? '';
    $event_time = $_POST['event_time'] ?? '';
    $location = trim($_POST['location'] ?? '');
    $event_type = $_POST['event_type'] ?? '';
    $max_participants = intval($_POST['max_participants'] ?? 0);
    $image_url = trim($_POST['image_url'] ?? '');
    
    // Validate required fields
    if (empty($title) || empty($description) || empty($event_date) || empty($event_time) || empty($location) || empty($event_type)) {
        echo json_encode(['error' => 'All required fields must be filled']);
        exit;
    }
    
    // Validate date
    if (strtotime($event_date) < strtotime(date('Y-m-d'))) {
        echo json_encode(['error' => 'Event date cannot be in the past']);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("INSERT INTO events (title, description, event_date, event_time, location, event_type, image_url, max_participants, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssiis", $title, $description, $event_date, $event_time, $location, $event_type, $image_url, $max_participants, $_SESSION['admin_id']);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Event added successfully']);
        } else {
            echo json_encode(['error' => 'Failed to add event']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Add event error: " . $e->getMessage());
        echo json_encode(['error' => 'An error occurred. Please try again.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?> 