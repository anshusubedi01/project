<?php
include 'dbconnect.php';

echo "<h2>Database Connection Test</h2>";

if ($conn) {
    echo "<p style='color: green;'>✓ Database connection successful!</p>";
    
    // Test if events table exists
    $result = $conn->query("SHOW TABLES LIKE 'events'");
    if ($result && $result->num_rows > 0) {
        echo "<p style='color: green;'>✓ Events table exists!</p>";
        
        // Count events
        $count_result = $conn->query("SELECT COUNT(*) as count FROM events");
        if ($count_result) {
            $count = $count_result->fetch_assoc()['count'];
            echo "<p>Number of events in database: <strong>$count</strong></p>";
        }
        
        // Show sample events
        $events_result = $conn->query("SELECT id, title, event_date FROM events LIMIT 5");
        if ($events_result && $events_result->num_rows > 0) {
            echo "<h3>Sample Events:</h3>";
            echo "<ul>";
            while ($event = $events_result->fetch_assoc()) {
                echo "<li>ID: {$event['id']} - {$event['title']} (Date: {$event['event_date']})</li>";
            }
            echo "</ul>";
        } else {
            echo "<p style='color: orange;'>⚠ No events found in database</p>";
        }
    } else {
        echo "<p style='color: red;'>✗ Events table does not exist!</p>";
    }
    
    // Test if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result && $result->num_rows > 0) {
        echo "<p style='color: green;'>✓ Users table exists!</p>";
    } else {
        echo "<p style='color: red;'>✗ Users table does not exist!</p>";
    }
    
    // Test if event_registrations table exists
    $result = $conn->query("SHOW TABLES LIKE 'event_registrations'");
    if ($result && $result->num_rows > 0) {
        echo "<p style='color: green;'>✓ Event registrations table exists!</p>";
    } else {
        echo "<p style='color: red;'>✗ Event registrations table does not exist!</p>";
    }
    
} else {
    echo "<p style='color: red;'>✗ Database connection failed!</p>";
}

echo "<hr>";
echo "<p><a href='events.php'>Go to Events Page</a></p>";
?> 