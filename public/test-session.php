<?php
// Set session path to ensure consistency
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
session_start();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Session Test</title>
</head>
<body>
    <h1>Session Test</h1>
    <p><strong>Session ID:</strong> <?php echo session_id(); ?></p>
    <p><strong>User ID:</strong> <?php echo isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'NOT SET'; ?></p>
    <p><strong>User Email:</strong> <?php echo isset($_SESSION['user_email']) ? $_SESSION['user_email'] : 'NOT SET'; ?></p>
    <p><strong>Logged In:</strong> <?php echo isset($_SESSION['logged_in']) ? $_SESSION['logged_in'] : 'NOT SET'; ?></p>
    
    <h2>Full Session Data:</h2>
    <pre><?php print_r($_SESSION); ?></pre>
    
    <h2>Test Event Registration</h2>
    <form id="testForm">
        <input type="hidden" name="eventId" value="1">
        <input type="email" name="email" placeholder="Email" value="<?php echo isset($_SESSION['user_email']) ? $_SESSION['user_email'] : ''; ?>"><br>
        <input type="text" name="contact" placeholder="Contact" value="1234567890"><br>
        <textarea name="address" placeholder="Address">Test Address</textarea><br>
        <button type="submit">Test Registration</button>
    </form>
    <div id="result"></div>
    
    <script>
        document.getElementById('testForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('../backend/register-event.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            })
            .catch(error => {
                document.getElementById('result').innerHTML = 'Error: ' + error;
            });
        });
    </script>
</body>
</html> 