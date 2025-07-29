<?php
// Set session path to ensure consistency
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
session_start();
// Generate CSRF token if not exists
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="<?php echo $_SESSION['csrf_token']; ?>">
  <title>Login - Pranshu Social Event Management</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="green-bg">
 <header>
    <nav class="navbar">
      <div class="nav-logo">
        <a href="index.html" class="logo-link">
          <img src="logopic.jpg" alt="logo"height="70px" weidth="70px">
          <span class="brand-name">Pranshu Social Events Management</span>
        </a>
      </div>
      <ul class="nav-links">
        <li><a href="index.html" class="nav-item">Home</a></li>
        <li><a href="about.html" class="nav-item">About</a></li>
        <li><a href="events.php" class="nav-item">Events</a></li>
        <li><a href="signup.php" class="nav-item">Sign Up</a></li>
        <li><a href="contact.html" class="nav-item">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <form id="loginForm">
      <h2>Login</h2><br>
      
      <input type="email" id="loginEmail" name="email" placeholder="Email" required><br>
      <div id="emailError" class="error-message"></div>
      
      <input type="password" id="loginPassword" name="password" placeholder="Password" required><br>
      <div id="passwordError" class="error-message"></div>
      
      <button type="submit" id="loginBtn">Login</button>
      <p>Don't have an account? <a href="signup.php">Sign Up</a></p>
      <div id="loginMsg"></div>
    </form>
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
  <script src="login-validation.js"></script>
</body>
</html>