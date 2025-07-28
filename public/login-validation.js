// Login Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginMsg = document.getElementById('loginMsg');

    // Error message elements
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Validation patterns
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Real-time validation functions
    function validateEmail() {
        const value = email.value.trim();
        if (!value) {
            emailError.textContent = 'Email is required';
            emailError.style.color = 'red';
            return false;
        } else if (!emailRegex.test(value)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.color = 'red';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }

    function validatePassword() {
        const value = password.value;
        if (!value) {
            passwordError.textContent = 'Password is required';
            passwordError.style.color = 'red';
            return false;
        } else {
            passwordError.textContent = '';
            return true;
        }
    }

    // Add event listeners for real-time validation
    email.addEventListener('input', validateEmail);
    email.addEventListener('blur', validateEmail);
    
    password.addEventListener('input', validatePassword);
    password.addEventListener('blur', validatePassword);

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        loginMsg.textContent = '';
        loginMsg.style.color = '';
        
        // Validate all fields
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            loginMsg.textContent = 'Please fix the errors above before submitting';
            loginMsg.style.color = 'red';
            return;
        }
        
        // Disable button and show loading
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        
        // Prepare form data
        const formData = new FormData();
        formData.append('email', email.value.trim());
        formData.append('password', password.value);
        
        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            formData.append('csrf_token', csrfToken);
        }
        
        // Send to backend
        fetch('../backend/login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginMsg.textContent = data.message + ' Redirecting to home page...';
                loginMsg.style.color = 'green';
                
                // Clear form
                loginForm.reset();
                
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                loginMsg.textContent = data.error || 'Login failed. Please try again.';
                loginMsg.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loginMsg.textContent = 'An error occurred. Please try again.';
            loginMsg.style.color = 'red';
        })
        .finally(() => {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        });
    });
}); 