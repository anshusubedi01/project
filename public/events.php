<?php
// Set session path to ensure consistency
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
session_start();
include 'dbconnect.php';

// Debug: Check session status
error_log("Session ID: " . session_id());
error_log("Session user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'not set'));
error_log("Session logged_in: " . (isset($_SESSION['logged_in']) ? $_SESSION['logged_in'] : 'not set'));
error_log("Session user_email: " . (isset($_SESSION['user_email']) ? $_SESSION['user_email'] : 'not set'));
error_log("Full session data: " . print_r($_SESSION, true));

// Fetch events from database
$events = [];
try {
    $query = "SELECT * FROM events ORDER BY event_date ASC";
    $result = $conn->query($query);
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            // Get current participants count for each event
            $event_id = $row['id'];
            $participants_query = "SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?";
            $stmt = $conn->prepare($participants_query);
            $stmt->bind_param("i", $event_id);
            $stmt->execute();
            $participants_result = $stmt->get_result();
            $participants_row = $participants_result->fetch_assoc();
            $row['current_participants'] = $participants_row['count'];
            $stmt->close();
            
            $events[] = $row;
        }
    }
    
    // Debug: Check if events were found
    if (empty($events)) {
        error_log("No events found in database");
    } else {
        error_log("Found " . count($events) . " events");
    }
    
} catch (Exception $e) {
    // Handle error silently for now
    error_log("Error fetching events: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events - Pranshu Social Event Management</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .events-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .event-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(56, 142, 60, 0.15);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
        }
        .event-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(56, 142, 60, 0.25);
        }
        .event-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .event-content {
            padding: 1.5rem;
        }
        .event-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #2e7d32;
            margin-bottom: 0.5rem;
        }
        .event-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        .event-meta span {
            background: #e8f5e9;
            color: #2e7d32;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        .event-description {
            color: #555;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        .event-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        .register-btn {
            background: #388e3c;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .register-btn:hover {
            background: #2e7d32;
        }
        .register-btn:disabled {
            background: #9e9e9e;
            cursor: not-allowed;
        }
        .participants-info {
            font-size: 0.9rem;
            color: #666;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: white;
            margin: 2% auto;
            padding: 2rem;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .close {
            position: absolute;
            right: 1rem;
            top: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        .close:hover {
            color: #000;
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
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #388e3c;
        }
        .error-message {
            color: #d32f2f;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        .success-message {
            color: #388e3c;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        .page-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .page-header h1 {
            color: #2e7d32;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        .page-header p {
            color: #666;
            font-size: 1.1rem;
        }
        
        /* Responsive modal for mobile devices */
        @media (max-width: 768px) {
            .modal-content {
                margin: 5% auto;
                width: 95%;
                max-height: 85vh;
                padding: 1.5rem;
            }
            
            .form-group textarea {
                min-height: 80px;
            }
        }
        
        /* Ensure submit button is always visible */
        .modal-content form {
            padding-bottom: 1rem;
        }
        
        .modal-content .register-btn {
            position: sticky;
            bottom: 0;
            background: #388e3c;
            margin-top: 1rem;
            z-index: 10;
        }
        
        /* Ensure form content is properly spaced */
        .modal-content form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        /* Make textarea resizable but not too large */
        .form-group textarea {
            resize: vertical;
            min-height: 80px;
            max-height: 150px;
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
          <span class="brand-name">Pranshu Events</span>
        </a>
      </div>
      <ul class="nav-links">
        <li><a href="index.html" class="nav-item">Home</a></li>
        <li><a href="about.html" class="nav-item">About</a></li>
        <li><a href="events.php" class="nav-item active">Events</a></li>
        <li><a href="signup.php" class="nav-item">Sign Up</a></li>
        <li><a href="contact.html" class="nav-item">Contact</a></li>
      </ul>
    </nav>
  </header>

    <main>
        <div class="events-container">
            <div class="page-header">
                <h1>Upcoming Events</h1>
                <p>Join our community events and make a difference</p>
            </div>

            <div class="events-grid">
                <?php if (!empty($events)): ?>
                    <?php foreach ($events as $event): ?>
                    <div class="event-card">
                        <img src="<?php echo htmlspecialchars($event['image_url']); ?>" alt="<?php echo htmlspecialchars($event['title']); ?>" class="event-image">
                        <div class="event-content">
                            <h3 class="event-title"><?php echo htmlspecialchars($event['title']); ?></h3>
                            <div class="event-meta">
                                <span><?php echo date('M d, Y', strtotime($event['event_date'])); ?></span>
                                <span><?php echo date('g:i A', strtotime($event['event_time'])); ?></span>
                                <span><?php echo htmlspecialchars($event['event_type']); ?></span>
                            </div>
                            <p class="event-description"><?php echo htmlspecialchars($event['description']); ?></p>
                            <div class="event-meta">
                                <span><strong>Location:</strong> <?php echo htmlspecialchars($event['location']); ?></span>
                            </div>
                            <div class="participants-info">
                                <?php if ($event['max_participants'] > 0): ?>
                                    <span><?php echo $event['current_participants']; ?>/<?php echo $event['max_participants']; ?> participants</span>
                                <?php endif; ?>
                            </div>
                            <div class="event-actions">
                                <button class="register-btn" onclick="openRegistrationModal(<?php echo $event['id']; ?>, '<?php echo htmlspecialchars($event['title']); ?>')">
                                    Register for Event
                                </button>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <h3 style="color: #666;">No events available at the moment.</h3>
                        <p style="color: #999;">Check back later for upcoming events!</p>
                        <!-- Debug info -->
                        <p style="color: #999; font-size: 0.8rem;">Debug: Events array is empty</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </main>

    <!-- Registration Modal -->
    <div id="registrationModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeRegistrationModal()">&times;</span>
            <h2 id="modalEventTitle">Register for Event</h2>
            <form id="registrationForm">
                <input type="hidden" id="eventId" name="eventId">
                <input type="hidden" id="eventTitle" name="eventTitle">
                
                <div class="form-group">
                    <label for="regEmail">Email *</label>
                    <input type="email" id="regEmail" name="email" required>
                    <div id="emailError" class="error-message"></div>
                </div>
                
                <div class="form-group">
                    <input type="hidden" id="userEmail" name="userEmail" value="<?php echo isset($_SESSION['user_email']) ? htmlspecialchars($_SESSION['user_email']) : ''; ?>">
                </div>
                
                <div class="form-group">
                    <label for="regContact">Contact Number *</label>
                    <input type="tel" id="regContact" name="contact" required>
                    <div id="contactError" class="error-message"></div>
                </div>
                
                <div class="form-group">
                    <label for="regAddress">Address *</label>
                    <textarea id="regAddress" name="address" rows="3" required></textarea>
                    <div id="addressError" class="error-message"></div>
                </div>
                
                <button type="submit" class="register-btn" style="width: 100%;">Submit Registration</button>
                <div id="registrationMsg"></div>
            </form>
        </div>
    </div>
  <footer>
    <div class="footer-contact">
      <div>
        <b>Contact:</b> info@socialeventsystem.org | +977 9812345678
      </div>
      <div class="footer-social" style="justify-content:center;">
        <a href="https://instagram.com/yourcommunity" target="_blank" title="Instagram">
         <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="28">
        </a>
        <a href="mailto:info@socialeventsystem.org" target="_blank" title="Gmail">
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
        
        <b>Address:</b> Kathmandu, Nepal
      </div>
    </div>
    <p>&copy; 2025 Social Event Management System</p>
  </footer>
    <script src="events.js"></script>
</body>
</html>