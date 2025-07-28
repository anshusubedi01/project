// Events Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const modal = document.getElementById('registrationModal');
    
    // Validation patterns
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    // Modal functions
    window.openRegistrationModal = function(eventId, eventTitle) {
        // Check if user is logged in (using PHP session)
        // We'll check this on the server side when submitting the form
        
        document.getElementById('eventId').value = eventId;
        document.getElementById('eventTitle').value = eventTitle;
        
        // Pre-fill email with logged-in user's email
        const userEmail = document.getElementById('userEmail').value;
        if (userEmail) {
            document.getElementById('regEmail').value = userEmail;
        }
        
        modal.style.display = 'block';
        
        // Update modal title
        document.getElementById('modalEventTitle').textContent = `Register for: ${eventTitle}`;
    };
    
    window.closeRegistrationModal = function() {
        modal.style.display = 'none';
        registrationForm.reset();
        clearErrors();
    };
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            closeRegistrationModal();
        }
    };
    
    // Validation functions
    function validateEmail() {
        const email = document.getElementById('regEmail').value.trim();
        const emailError = document.getElementById('emailError');
        
        if (!email) {
            emailError.textContent = 'Email is required';
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }
    
    function validateContact() {
        const contact = document.getElementById('regContact').value.trim();
        const contactError = document.getElementById('contactError');
        
        if (!contact) {
            contactError.textContent = 'Contact number is required';
            return false;
        } else if (!phoneRegex.test(contact)) {
            contactError.textContent = 'Please enter a valid contact number';
            return false;
        } else {
            contactError.textContent = '';
            return true;
        }
    }
    
    function validateAddress() {
        const address = document.getElementById('regAddress').value.trim();
        const addressError = document.getElementById('addressError');
        
        if (!address) {
            addressError.textContent = 'Address is required';
            return false;
        } else if (address.length < 10) {
            addressError.textContent = 'Address must be at least 10 characters long';
            return false;
        } else {
            addressError.textContent = '';
            return true;
        }
    }
    
    function clearErrors() {
        document.getElementById('emailError').textContent = '';
        document.getElementById('contactError').textContent = '';
        document.getElementById('addressError').textContent = '';
        document.getElementById('registrationMsg').textContent = '';
    }
    
    // Add event listeners for real-time validation
    document.getElementById('regEmail').addEventListener('input', validateEmail);
    document.getElementById('regEmail').addEventListener('blur', validateEmail);
    
    document.getElementById('regContact').addEventListener('input', validateContact);
    document.getElementById('regContact').addEventListener('blur', validateContact);
    
    document.getElementById('regAddress').addEventListener('input', validateAddress);
    document.getElementById('regAddress').addEventListener('blur', validateAddress);
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        document.getElementById('registrationMsg').textContent = '';
        
        // Validate all fields
        const isEmailValid = validateEmail();
        const isContactValid = validateContact();
        const isAddressValid = validateAddress();
        
        if (!isEmailValid || !isContactValid || !isAddressValid) {
            document.getElementById('registrationMsg').textContent = 'Please fix the errors above before submitting';
            document.getElementById('registrationMsg').style.color = 'red';
            return;
        }
        
        // Get form data
        const formData = new FormData(registrationForm);
        
        // Send to backend
        fetch('../backend/register-event.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('registrationMsg').textContent = data.message;
                document.getElementById('registrationMsg').style.color = 'green';
                registrationForm.reset();
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    closeRegistrationModal();
                    // Reload page to update participant count
                    window.location.reload();
                }, 2000);
            } else {
                document.getElementById('registrationMsg').textContent = data.message;
                document.getElementById('registrationMsg').style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('registrationMsg').textContent = 'An error occurred. Please try again.';
            document.getElementById('registrationMsg').style.color = 'red';
        });
    });
}); 