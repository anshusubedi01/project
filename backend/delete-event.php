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
    $input = json_decode(file_get_contents('php://input'), true);
    $eventId = intval($input['eventId'] ?? 0);
    
    if ($eventId <= 0) {
        echo json_encode(['error' => 'Invalid event ID']);
        exit;
    }
    
    try {
        // Check if event exists
        $stmt = $conn->prepare("SELECT id FROM events WHERE id = ?");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['error' => 'Event not found']);
            $stmt->close();
            exit;
        }
        $stmt->close();
        
        // Delete event (cascade will handle registrations)
        $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
        $stmt->bind_param("i", $eventId);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Event deleted successfully']);
        } else {
            echo json_encode(['error' => 'Failed to delete event']);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Delete event error: " . $e->getMessage());
        echo json_encode(['error' => 'An error occurred. Please try again.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?> 