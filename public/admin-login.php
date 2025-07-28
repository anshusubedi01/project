<?php
session_start();
include 'dbconnect.php';

// Check if already logged in
if (isset($_SESSION['admin_id'])) {
    header('Location: admin.php');
    exit;
}

$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Please fill in all fields';
    } else {
        try {
            $stmt = $conn->prepare("SELECT id, username, password, full_name FROM admins WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 1) {
                $admin = $result->fetch_assoc();
                
                if ($password === $admin['password']) {
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    $_SESSION['admin_name'] = $admin['full_name'];
                    
                    // Set cookie for 7 days
                    setcookie('adminLoggedIn', 'true', time() + (7 * 24 * 60 * 60), '/');
                    
                    header('Location: admin.php');
                    exit;
                } else {
                    $error = 'Invalid username or password';
                }
            } else {
                $error = 'Invalid username or password';
            }
            
            $stmt->close();
        } catch (Exception $e) {
            error_log("Admin login error: " . $e->getMessage());
            $error = 'An error occurred. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Pranshu Social Event Management</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-login-container {
            max-width: 400px;
            margin: 4rem auto;
            padding: 2rem;
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(56, 142, 60, 0.15);
        }
        .admin-login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .admin-login-header h1 {
            color: #2e7d32;
            margin-bottom: 0.5rem;
        }
        .admin-login-header p {
            color: #666;
        }
        .error-message {
            background: #ffebee;
            color: #c62828;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }
        .form-group input:focus {
            outline: none;
            border-color: #388e3c;
        }
        .admin-login-btn {
            width: 100%;
            padding: 0.75rem;
            background: #388e3c;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .admin-login-btn:hover {
            background: #2e7d32;
        }
        .back-link {
            text-align: center;
            margin-top: 1rem;
        }
        .back-link a {
            color: #388e3c;
            text-decoration: none;
        }
        .back-link a:hover {
            text-decoration: underline;
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
                <li><a href="index.html">Home</a></li>
                <li><a href="events.php">Events</a></li>
                <li><a href="signup.php">Sign Up</a></li>
                <li><a href="login.php">Login</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="admin-login-container">
            <div class="admin-login-header">
                <h1>Admin Login</h1>
                <p>Access the admin panel</p>
            </div>

            <?php if ($error): ?>
                <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="admin-login-btn">Login to Admin Panel</button>
            </form>

            <div class="back-link">
                <a href="index.html">← Back to Home</a>
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
</body>
</html> 