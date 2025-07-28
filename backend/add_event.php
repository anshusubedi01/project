<?php
session_start();
include 'dbconnect.php';

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    die("Unauthorized");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST['title'];
    $desc  = $_POST['description'];
    $date  = $_POST['event_date'];
    $loc   = $_POST['location'];

    $stmt = $conn->prepare("INSERT INTO events (title, description, event_date, location) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $title, $desc, $date, $loc);

    if ($stmt->execute()) {
        echo "Event added!";
    } else {
        echo "Error: " . $stmt->error;
    }
}
?>