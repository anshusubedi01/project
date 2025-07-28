<?php
session_start();
include 'dbconnect.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    header('Location: admin-login.php');
    exit;
}

// Fetch events for admin
$events = [];
try {
    $stmt = $conn->prepare("SELECT * FROM events ORDER BY event_date DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    $stmt->close();
} catch (Exception $e) {
    error_log("Error fetching events: " . $e->getMessage());
}

// Fetch registrations
$registrations = [];
try {
    $stmt = $conn->prepare("
        SELECT er.*, e.title as event_title, u.full_name as user_name 
        FROM event_registrations er 
        JOIN events e ON er.event_id = e.id 
        JOIN users u ON er.user_id = u.id 
        ORDER BY er.registration_date DESC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $registrations[] = $row;
    }
    $stmt->close();
} catch (Exception $e) {
    error_log("Error fetching registrations: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Pranshu Social Event Management</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        .admin-header {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(56, 142, 60, 0.15);
            margin-bottom: 2rem;
            text-align: center;
        }
        .admin-header h1 {
            color: #2e7d32;
            margin-bottom: 0.5rem;
        }
        .admin-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(56, 142, 60, 0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #388e3c;
        }
        .stat-label {
            color: #666;
            margin-top: 0.5rem;
        }
        .admin-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            background: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(56, 142, 60, 0.1);
        }
        .tab-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            background: #e8f5e9;
            color: #2e7d32;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .tab-btn.active {
            background: #388e3c;
            color: white;
        }
        .tab-btn:hover {
            background: #2e7d32;
            color: white;
        }
        .tab-content {
            display: none;
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(56, 142, 60, 0.15);
        }
        .tab-content.active {
            display: block;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .data-table th,
        .data-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        .data-table th {
            background: #e8f5e9;
            color: #2e7d32;
            font-weight: 600;
        }
        .data-table tr:hover {
            background: #f5f5f5;
        }
        .action-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-right: 0.5rem;
        }
        .edit-btn {
            background: #2196f3;
            color: white;
        }
        .delete-btn {
            background: #f44336;
            color: white;
        }
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        .status-active {
            background: #e8f5e9;
            color: #2e7d32;
        }
        .status-cancelled {
            background: #ffebee;
            color: #c62828;
        }
        .status-completed {
            background: #e3f2fd;
            color: #1565c0;
        }
        .add-event-form {
            background: #f9f9f9;
            padding: 2rem;
            border-radius: 10px;
            margin-top: 2rem;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #388e3c;
        }
        .logout-btn {
            background: #f44336;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
        }
        .logout-btn:hover {
            background: #d32f2f;
        }
    </style>
</head>
<body class="green-bg">
    <header>
        <nav class="navbar">
            <div class="nav-logo">
                <a href="index.html" class="logo-link">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <circle cx="22" cy="22" r="22" fill="#388e3c"/>
                        <text x="50%" y="55%" text-anchor="middle" fill="#fff" font-size="18" font-family="Segoe UI, Arial" dy=".3em" font-weight="bold">P</text>
                    </svg>
                    <span class="brand-name">Pranshu Events - Admin</span>
                </a>
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="events.php">Events</a></li>
                <li><a href="admin.php" class="active">Admin Panel</a></li>
                <li><a href="admin-logout.php" class="logout-btn">Logout</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="admin-container">
            <div class="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome, <?php echo htmlspecialchars($_SESSION['admin_name'] ?? 'Admin'); ?>!</p>
            </div>

            <div class="admin-stats">
                <div class="stat-card">
                    <div class="stat-number"><?php echo count($events); ?></div>
                    <div class="stat-label">Total Events</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo count($registrations); ?></div>
                    <div class="stat-label">Total Registrations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo count(array_filter($events, function($e) { return $e['status'] === 'active'; })); ?></div>
                    <div class="stat-label">Active Events</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo count(array_filter($registrations, function($r) { return $r['status'] === 'confirmed'; })); ?></div>
                    <div class="stat-label">Confirmed Registrations</div>
                </div>
            </div>

            <div class="admin-tabs">
                <button class="tab-btn active" onclick="showTab('events')">Manage Events</button>
                <button class="tab-btn" onclick="showTab('registrations')">View Registrations</button>
                <button class="tab-btn" onclick="showTab('add-event')">Add New Event</button>
            </div>

            <!-- Events Tab -->
            <div id="events" class="tab-content active">
                <h2>Manage Events</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Participants</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($events as $event): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($event['title']); ?></td>
                            <td>
                                <?php echo date('M d, Y', strtotime($event['event_date'])); ?><br>
                                <small><?php echo date('g:i A', strtotime($event['event_time'])); ?></small>
                            </td>
                            <td><?php echo htmlspecialchars($event['location']); ?></td>
                            <td><?php echo htmlspecialchars($event['event_type']); ?></td>
                            <td>
                                <span class="status-badge status-<?php echo $event['status']; ?>">
                                    <?php echo ucfirst($event['status']); ?>
                                </span>
                            </td>
                            <td>
                                <?php echo $event['current_participants']; ?>/<?php echo $event['max_participants']; ?>
                            </td>
                            <td>
                                <button class="action-btn edit-btn" onclick="editEvent(<?php echo $event['id']; ?>)">Edit</button>
                                <button class="action-btn delete-btn" onclick="deleteEvent(<?php echo $event['id']; ?>)">Delete</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- Registrations Tab -->
            <div id="registrations" class="tab-content">
                <h2>Event Registrations</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Participant</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($registrations as $registration): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($registration['event_title']); ?></td>
                            <td><?php echo htmlspecialchars($registration['user_name']); ?></td>
                            <td><?php echo htmlspecialchars($registration['email']); ?></td>
                            <td><?php echo htmlspecialchars($registration['contact']); ?></td>
                            <td><?php echo date('M d, Y g:i A', strtotime($registration['registration_date'])); ?></td>
                            <td>
                                <span class="status-badge status-<?php echo $registration['status']; ?>">
                                    <?php echo ucfirst($registration['status']); ?>
                                </span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- Add Event Tab -->
            <div id="add-event" class="tab-content">
                <h2>Add New Event</h2>
                <form class="add-event-form" id="addEventForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="title">Event Title *</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="event_type">Event Type *</label>
                            <select id="event_type" name="event_type" required>
                                <option value="">Select Type</option>
                                <option value="Volunteering">Volunteering</option>
                                <option value="Donation">Donation</option>
                                <option value="Awareness">Awareness</option>
                                <option value="Education">Education</option>
                                <option value="Fundraising">Fundraising</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="event_date">Event Date *</label>
                            <input type="date" id="event_date" name="event_date" required>
                        </div>
                        <div class="form-group">
                            <label for="event_time">Event Time *</label>
                            <input type="time" id="event_time" name="event_time" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="location">Location *</label>
                        <input type="text" id="location" name="location" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Description *</label>
                        <textarea id="description" name="description" rows="4" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="max_participants">Max Participants</label>
                            <input type="number" id="max_participants" name="max_participants" min="0">
                        </div>
                        <div class="form-group">
                            <label for="image_url">Image URL</label>
                            <input type="text" id="image_url" name="image_url" placeholder="event1.jpg">
                        </div>
                    </div>
                    <button type="submit" class="register-btn">Add Event</button>
                    <div id="addEventMsg"></div>
                </form>
            </div>
        </div>
    </main>

    <footer>
  <div class="footer-contact">
    <div>
      <b>Contact:</b> info@socialeventsystem.org | +977 9812345678
    </div>
    <div class="footer-social" style="justify-content:center;">
      <a href="https://instagram.com/yourcommunity" target="_blank" title="Instagram">
       <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="28">
      </a>
      <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Gmail" width="28">
    </a>
    <a href="https://facebook.com/yourcommunity" target="_blank" title="Facebook">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="28">
    </a>
    <a href="https://twitter.com/" target="_blank" title="Twitter">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="28">
    </a>
    
  </div>
  <div style="margin-top:0.5rem;">
      <a href="mailto:info@socialeventsystem.org" title="Gmail">
      <b>Address:</b> Kathmandu, Nepal
    </div>
  </div>
  <p>&copy; 2025 Social Event Management System</p>
</footer>

    <script src="admin.js"></script>
</body>
</html> 