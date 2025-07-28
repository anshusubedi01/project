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
        <li><a href="login.php" class="active">Login</a></li>
        <li><a href="contact.html">Contact</a></li>
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
        <b>Contact:</b> info@socialeventsystem.org <br>
        <b>+977 9812345678</b> 
      </div>
      <div class="footer-social">
        <a href="https://instagram.com/yourcommunity" target="_blank" title="Instagram"><img src="insta.svg" alt="Instagram" class="footer-icon"></a>
        <a href="mailto:info@socialeventsystem.org" title="Gmail"><img src="gmail.svg" alt="Gmail" class="footer-icon"></a>
        <a href="https://facebook.com/yourcommunity" target="_blank" title="Facebook"><img src="fb.svg" alt="Facebook" class="footer-icon"></a>
      </div>
    </div>
    <p>&copy; 2025 Pranshu Social Event Management System</p>
  </footer>
  <script src="login-validation.js"></script>
</body>
</html>