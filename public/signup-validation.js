// Signup Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signupBtn');
    const signupMsg = document.getElementById('signupMsg');

    // Error message elements
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Validation patterns
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Real-time validation functions
    function validateUsername() {
        const value = username.value.trim();
        if (!value) {
            usernameError.textContent = 'Username is required';
            usernameError.style.color = 'red';
            return false;
        } else if (value.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters long';
            usernameError.style.color = 'red';
            return false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            usernameError.textContent = 'Username can only contain letters, numbers, and underscores';
            usernameError.style.color = 'red';
            return false;
        } else {
            usernameError.textContent = '';
            return true;
        }
    }

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
        } else if (value.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters long';
            passwordError.style.color = 'red';
            return false;
        } else if (!passwordRegex.test(value)) {
            passwordError.textContent = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
            passwordError.style.color = 'red';
            return false;
        } else {
            passwordError.textContent = '';
            return true;
        }
    }

    function validateConfirmPassword() {
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;
        
        if (!confirmValue) {
            confirmPasswordError.textContent = 'Please confirm your password';
            confirmPasswordError.style.color = 'red';
            return false;
        } else if (passwordValue !== confirmValue) {
            confirmPasswordError.textContent = 'Passwords do not match';
            confirmPasswordError.style.color = 'red';
            return false;
        } else {
            confirmPasswordError.textContent = '';
            return true;
        }
    }

    // Add event listeners for real-time validation
    username.addEventListener('input', validateUsername);
    username.addEventListener('blur', validateUsername);
    
    email.addEventListener('input', validateEmail);
    email.addEventListener('blur', validateEmail);
    
    password.addEventListener('input', validatePassword);
    password.addEventListener('blur', validatePassword);
    
    confirmPassword.addEventListener('input', validateConfirmPassword);
    confirmPassword.addEventListener('blur', validateConfirmPassword);

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        signupMsg.textContent = '';
        signupMsg.style.color = '';
        
        // Validate all fields
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            signupMsg.textContent = 'Please fix the errors above before submitting';
            signupMsg.style.color = 'red';
            return;
        }
        
        // Disable button and show loading
        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating Account...';
        
        // Prepare form data
        const formData = new FormData();
        formData.append('username', username.value.trim());
        formData.append('email', email.value.trim());
        formData.append('password', password.value);
        formData.append('confirmPassword', confirmPassword.value);
        formData.append('full_name', username.value.trim());
        
        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            formData.append('csrf_token', csrfToken);
        }
        
        // Debug: Log what we're sending
        console.log('Sending form data:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + (key.includes('password') ? '[HIDDEN]' : value));
        }
        
        // Send to backend
        fetch('../backend/register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.success) {
                signupMsg.textContent = data.message + ' Redirecting to login...';
                signupMsg.style.color = 'green';
                
                // Clear form
                signupForm.reset();
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.php';
                }, 2000);
            } else {
                signupMsg.textContent = data.error || 'Registration failed. Please try again.';
                signupMsg.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            signupMsg.textContent = 'An error occurred. Please try again.';
            signupMsg.style.color = 'red';
        })
        .finally(() => {
            signupBtn.disabled = false;
            signupBtn.textContent = 'Sign Up';
        });
    });
}); 