// Initialize Lucide icons when page loads
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
});

// Smooth scrolling to sections
function scrollTo(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
        });
    }
}





// Modal functionality
function showLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showSignup() {
    const modal = document.getElementById('signupModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideSignup() {
    const modal = document.getElementById('signupModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    console.log('Login attempt');
    alert('Login functionality would be implemented here!');
    hideLogin();
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log('Signup attempt:', data);
    
    // Basic validation
    if (data.password !== data.confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    alert('Signup functionality would be implemented here!');
    hideSignup();
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (e.target === loginModal) {
        hideLogin();
    }
    
    if (e.target === signupModal) {
        hideSignup();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideLogin();
        hideSignup();
    }
});

// Reinitialize icons after any dynamic content changes
function refreshIcons() {
    lucide.createIcons();
}

// Smooth scroll behavior for better user experience
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading state for buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

// Enhanced form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Initialize tooltips and other interactive elements
function initializeInteractivity() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.event-card, .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Call initialization function when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeInteractivity();
    refreshIcons();
});

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-up, .slide-left, .slide-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Error handling for missing elements
function safeElementOperation(elementId, operation) {
    const element = document.getElementById(elementId);
    if (element) {
        operation(element);
    } else {
        console.warn (`Element with ID '${elementId}' not found`);

    }
}

// Performance optimization: debounce scroll events
function debounce(func, wait) { 
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-related functionality here
    console.log('Scroll event handled');
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);