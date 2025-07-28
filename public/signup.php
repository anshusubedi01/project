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
  <title>Sign Up - Pranshu Social Event Management</title>
  <link rel="stylesheet" href="style.css">
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
        <li><a href="events.php" class="nav-item">Events</a></li>
        <li><a href="signup.php" class="nav-item active">Sign Up</a></li>
        <li><a href="contact.html" class="nav-item">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <form id="signupForm">
      <h2>Sign Up</h2><br>
      
      <input type="text" id="username" name="username" placeholder="Username" required><br>
      <div id="usernameError" class="error-message"></div>
      
      <input type="email" id="email" name="email" placeholder="Email" required><br>
      <div id="emailError" class="error-message"></div>
      
      <input type="password" id="password" name="password" placeholder="Password" required><br>
      <div id="passwordError" class="error-message"></div>
      
      <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required><br>
      <div id="confirmPasswordError" class="error-message"></div>
      
      <button type="submit" id="signupBtn">Sign Up</button>
      <p>Already have an account? <a href="login.php">Login</a></p>
      <div id="signupMsg"></div>
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
  <script src="signup-validation.js"></script>
</body>
</html>