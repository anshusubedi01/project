// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    window.showTab = function(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(tabName).classList.add('active');
        
        // Add active class to clicked button
        event.target.classList.add('active');
    };
    
    // Add event form handling
    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
        addEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(addEventForm);
            const submitBtn = addEventForm.querySelector('button[type="submit"]');
            const msgDiv = document.getElementById('addEventMsg');
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding Event...';
            
            // Validate required fields
            const requiredFields = ['title', 'event_type', 'event_date', 'event_time', 'location', 'description'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const value = formData.get(field);
                if (!value || value.trim() === '') {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                msgDiv.textContent = 'Please fill in all required fields';
                msgDiv.style.color = 'red';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Event';
                return;
            }
            
            // Send to backend
            fetch('backend/add-event.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    msgDiv.textContent = 'Event added successfully!';
                    msgDiv.style.color = 'green';
                    addEventForm.reset();
                    
                    // Reload page after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    msgDiv.textContent = data.error || 'Failed to add event';
                    msgDiv.style.color = 'red';
                }
            })
            .catch(error => {
                msgDiv.textContent = 'An error occurred. Please try again.';
                msgDiv.style.color = 'red';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Event';
            });
        });
    }
    
    // Event actions
    window.editEvent = function(eventId) {
        // For now, just show an alert
        alert('Edit functionality for event ID: ' + eventId + ' will be implemented soon.');
    };
    
    window.deleteEvent = function(eventId) {
        if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            fetch('backend/delete-event.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId: eventId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Event deleted successfully!');
                    window.location.reload();
                } else {
                    alert(data.error || 'Failed to delete event');
                }
            })
            .catch(error => {
                alert('An error occurred. Please try again.');
            });
        }
    };
}); 