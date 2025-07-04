// Social Event Management System
// Enhanced JavaScript with full functionality

// Global variables
let currentUser = null;
let currentEventForRegistration = null;
let events = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadEventsFromStorage();
    displayEvents();
    checkUserLogin();
    initializeInteractivity();
});

// Initialize sample events if none exist
function initializeApp() {
    const storedEvents = localStorage.getItem('socialEvents');
    if (!storedEvents) {
        // Create sample events
        events = [
            {
                id: 1,
                title: "Community Garden Cleanup",
                description: "Join us for a community garden cleanup and help make our neighborhood beautiful.",
                category: "volunteering",
                date: "2024-01-15",
                time: "09:00",
                location: "Central Community Garden",
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop",
                spotsAvailable: 25,
                registeredUsers: [],
                organizer: "Green Community Initiative",
                requirements: "Bring gardening gloves and water bottle"
            },
            {
                id: 2,
                title: "Children's Education Fundraiser",
                description: "Help us raise funds to provide educational materials for underprivileged children.",
                category: "fundraising",
                date: "2024-01-20",
                time: "18:00",
                location: "Community Center Hall",
                image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=200&fit=crop",
                spotsAvailable: 100,
                registeredUsers: [],
                organizer: "Education For All",
                requirements: "Formal attire recommended"
            },
            {
                id: 3,
                title: "Food Bank Volunteer Day",
                description: "Help sort and distribute food packages to families in need.",
                category: "volunteering",
                date: "2024-01-18",
                time: "10:00",
                location: "City Food Bank",
                image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop",
                spotsAvailable: 30,
                registeredUsers: [],
                organizer: "City Food Bank",
                requirements: "Must be 16+ years old"
            },
            {
                id: 4,
                title: "Digital Donation Drive",
                description: "Support our cause through secure digital donations. Every contribution makes a difference.",
                category: "donation",
                date: "2024-01-25",
                time: "All Day",
                location: "Online",
                image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
                spotsAvailable: 999,
                registeredUsers: [],
                organizer: "Pranshu Foundation",
                requirements: "Secure payment methods available"
            },
            {
                id: 5,
                title: "Senior Care Center Visit",
                description: "Spend time with elderly residents and bring joy to their day.",
                category: "volunteering",
                date: "2024-01-22",
                time: "14:00",
                location: "Sunshine Senior Care",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop",
                spotsAvailable: 15,
                registeredUsers: [],
                organizer: "Care Volunteers",
                requirements: "Background check required"
            },
            {
                id: 6,
                title: "Environmental Awareness Gala",
                description: "Join our fundraising gala to support environmental conservation projects.",
                category: "fundraising",
                date: "2024-01-30",
                time: "19:00",
                location: "Grand Ballroom Hotel",
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop",
                spotsAvailable: 200,
                registeredUsers: [],
                organizer: "Green Earth Foundation",
                requirements: "Tickets: $75 per person"
            }
        ];
        saveEventsToStorage();
    }
}

// Storage functions
function saveEventsToStorage() {
    localStorage.setItem('socialEvents', JSON.stringify(events));
}

function loadEventsFromStorage() {
    const storedEvents = localStorage.getItem('socialEvents');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    }
}

function saveUserToStorage(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function loadUserFromStorage() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        return JSON.parse(storedUser);
    }
    return null;
}

// User authentication functions
function checkUserLogin() {
    const user = loadUserFromStorage();
    if (user) {
        currentUser = user;
        showUserMenu();
    }
}

function showUserMenu() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (authButtons && userMenu && userName) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userName.textContent = `Welcome, ${currentUser.fullName}!`;
    }
}

function hideUserMenu() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (authButtons && userMenu) {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideUserMenu();
    displayEvents(); // Refresh events display
    showNotification('Logged out successfully!', 'success');
}

// Modal functions
function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function showSignup() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideSignup() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function showEventRegistration(eventId) {
    if (!currentUser) {
        showNotification('Please login first to register for events!', 'error');
        showLogin();
        return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Check if user is already registered
    if (event.registeredUsers.some(user => user.email === currentUser.email)) {
        showNotification('You are already registered for this event!', 'warning');
        return;
    }
    
    currentEventForRegistration = event;
    const modal = document.getElementById('eventRegistrationModal');
    const eventTitle = document.getElementById('event-title');
    
    if (modal && eventTitle) {
        eventTitle.textContent = event.title;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideEventRegistration() {
    const modal = document.getElementById('eventRegistrationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    currentEventForRegistration = null;
}

function showDonation() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideDonation() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Reset donation form
        document.getElementById('donation-amount').value = '';
        document.getElementById('qr-container').classList.add('hidden');
        document.getElementById('custom-amount-div').classList.add('hidden');
    }
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Simple validation - in real app, this would be server-side
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        saveUserToStorage(user);
        showUserMenu();
        hideLogin();
        showNotification('Welcome back!', 'success');
        displayEvents(); // Refresh events to show registration status
    } else {
        showNotification('Invalid email or password!', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        joinDate: new Date().toISOString()
    };
    
    // Validation
    if (userData.password !== userData.confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (userData.password.length < 6) {
        showNotification('Password must be at least 6 characters!', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.some(u => u.email === userData.email)) {
        showNotification('User with this email already exists!', 'error');
        return;
    }
    
    // Save user
    delete userData.confirmPassword;
    users.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Auto login
    currentUser = userData;
    saveUserToStorage(userData);
    showUserMenu();
    hideSignup();
    showNotification('Account created successfully! Welcome!', 'success');
    displayEvents();
}

function handleEventRegistration(event) {
    event.preventDefault();
    if (!currentEventForRegistration || !currentUser) return;
    
    const formData = new FormData(event.target);
    const registrationData = {
        userId: currentUser.email,
        userName: currentUser.fullName,
        userPhone: currentUser.phone,
        motivation: formData.get('motivation'),
        emergencyContact: formData.get('emergencyContact'),
        registrationDate: new Date().toISOString()
    };
    
    // Add user to event
    const eventIndex = events.findIndex(e => e.id === currentEventForRegistration.id);
    if (eventIndex !== -1) {
        events[eventIndex].registeredUsers.push(registrationData);
        events[eventIndex].spotsAvailable -= 1;
        saveEventsToStorage();
        
        hideEventRegistration();
        showNotification('Successfully registered for the event!', 'success');
        displayEvents(); // Refresh display
    }
}

// QR Code generation
function generateQR() {
    const amountSelect = document.getElementById('donation-amount');
    const customAmountDiv = document.getElementById('custom-amount-div');
    const customAmountInput = document.getElementById('custom-amount');
    const qrContainer = document.getElementById('qr-container');
    const qrCodeDiv = document.getElementById('qr-code');
    const qrAmountSpan = document.getElementById('qr-amount');
    
    let amount = amountSelect.value;
    
    if (amount === 'custom') {
        customAmountDiv.classList.remove('hidden');
        qrContainer.classList.add('hidden');
        customAmountInput.addEventListener('input', function() {
            if (this.value) {
                generateQRForAmount(this.value, qrCodeDiv, qrAmountSpan, qrContainer);
            }
        });
        return;
    } else {
        customAmountDiv.classList.add('hidden');
    }
    
    if (amount) {
        generateQRForAmount(amount, qrCodeDiv, qrAmountSpan, qrContainer);
    }
}

function generateQRForAmount(amount, qrCodeDiv, qrAmountSpan, qrContainer) {
    // Clear previous QR code
    qrCodeDiv.innerHTML = '';
    
    // Generate payment URL (in real app, this would be actual payment gateway)
    const paymentData = {
        amount: amount,
        currency: 'USD',
        recipient: 'Pranshu Foundation',
        purpose: 'Social Event Donation',
        timestamp: new Date().toISOString()
    };
    
    const paymentUrl = `https://donate.pranshu.org/pay?amount=${amount}&purpose=donation&id=${Date.now()}`;
    
    // Generate QR code
    QRCode.toCanvas(qrCodeDiv, paymentUrl, {
        width: 200,
        height: 200,
        colorDark: '#059669',
        colorLight: '#ffffff'
    }, function (error) {
        if (error) {
            console.error(error);
            showNotification('Error generating QR code', 'error');
        } else {
            qrAmountSpan.textContent = `$${amount}`;
            qrContainer.classList.remove('hidden');
        }
    });
}

// Event display functions
function displayEvents() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card animate-fade-in-up';
    
    const isUserRegistered = currentUser && event.registeredUsers.some(user => user.userId === currentUser.email);
    const categoryIcon = getCategoryIcon(event.category);
    const categoryColor = getCategoryColor(event.category);
    
    card.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="w-full h-48 object-cover">
        <div class="event-card-content">
            <div class="flex items-center justify-between mb-2">
                <span class="px-3 py-1 text-xs font-medium rounded-full ${categoryColor}">
                    <i class="${categoryIcon} mr-1"></i>${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
                <span class="text-sm text-gray-500">${event.spotsAvailable} spots left</span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-2">${event.title}</h3>
            <p class="text-gray-600 mb-4">${event.description}</p>
            
            <div class="event-meta mb-4">
                <div class="flex items-center mb-2">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    <span>${formatDate(event.date)} at ${event.time}</span>
                </div>
                <div class="flex items-center mb-2">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    <span>${event.location}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-user mr-2"></i>
                    <span>${event.organizer}</span>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <p class="text-sm text-gray-600 mb-3"><strong>Requirements:</strong> ${event.requirements}</p>
                ${isUserRegistered ? 
                    `<div class="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        <span class="text-green-700 font-medium">You're registered!</span>
                    </div>` :
                    event.category === 'donation' ?
                    `<button onclick="showDonation()" class="btn-primary w-full">
                        <i class="fas fa-donate mr-2"></i>Donate Now
                    </button>` :
                    `<button onclick="showEventRegistration(${event.id})" class="btn-primary w-full">
                        <i class="fas fa-user-plus mr-2"></i>Register Now
                    </button>`
                }
            </div>
        </div>
    `;
    
    return card;
}

function getCategoryIcon(category) {
    switch(category) {
        case 'volunteering': return 'fas fa-hands-helping';
        case 'fundraising': return 'fas fa-coins';
        case 'donation': return 'fas fa-donate';
        default: return 'fas fa-calendar';
    }
}

function getCategoryColor(category) {
    switch(category) {
        case 'volunteering': return 'bg-blue-100 text-blue-800';
        case 'fundraising': return 'bg-purple-100 text-purple-800';
        case 'donation': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Utility functions
function scrollTo(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg text-white max-w-sm transform transition-all duration-300 translate-x-full`;
    
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-600');
            break;
        case 'error':
            notification.classList.add('bg-red-600');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-600');
            break;
        default:
            notification.classList.add('bg-blue-600');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Event listeners
document.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const eventRegistrationModal = document.getElementById('eventRegistrationModal');
    const donationModal = document.getElementById('donationModal');
    
    if (e.target === loginModal) hideLogin();
    if (e.target === signupModal) hideSignup();
    if (e.target === eventRegistrationModal) hideEventRegistration();
    if (e.target === donationModal) hideDonation();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideLogin();
        hideSignup();
        hideEventRegistration();
        hideDonation();
    }
});

// Initialize interactive elements
function initializeInteractivity() {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.animate-fade-in-up, .animate-slide-in-left, .animate-slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Add some sample registered users for demo
function initializeSampleUsers() {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existingUsers.length === 0) {
        const sampleUsers = [
            {
                fullName: "John Doe",
                email: "john@example.com",
                phone: "+1234567890",
                password: "password123",
                joinDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('registeredUsers', JSON.stringify(sampleUsers));
    }
}

// Initialize sample users
initializeSampleUsers();