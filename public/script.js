// Global variables
let currentUser = null;
let books = [];
let cart = [];
let currentCategory = 'all';

// API Base URL
const API_BASE = 'http://localhost:3000/api';

// DOM Elements
const booksGrid = document.getElementById('booksGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// Modal elements
const cartModal = document.getElementById('cartModal');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const checkoutModal = document.getElementById('checkoutModal');
const successModal = document.getElementById('successModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize the application
async function initializeApp() {
    showLoading();
    try {
        await loadBooks();
        await checkAuthStatus();
        updateUI();
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error loading application', 'error');
    } finally {
        hideLoading();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Search
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Auth buttons
    loginBtn.addEventListener('click', () => showModal(loginModal));
    signupBtn.addEventListener('click', () => showModal(signupModal));
    logoutBtn.addEventListener('click', handleLogout);

    // Cart
    cartBtn.addEventListener('click', () => showModal(cartModal));

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal);
        });
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);

    // Auth switches
    document.getElementById('switchToSignup').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(signupModal);
    });

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(signupModal);
        showModal(loginModal);
    });

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        hideModal(cartModal);
        showModal(checkoutModal);
    });
}

// Load books from API
async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        if (!response.ok) throw new Error('Failed to load books');
        books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        showNotification('Error loading books', 'error');
    }
}

// Display books in the grid
function displayBooks(booksToShow) {
    booksGrid.innerHTML = '';
    
    if (booksToShow.length === 0) {
        booksGrid.innerHTML = '<p class="no-books">No books found</p>';
        return;
    }

    booksToShow.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });
}

// Create a book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-price">$${book.price.toFixed(2)}</p>
            <div class="book-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${book.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="buy-now-btn" onclick="buyNow(${book.id})">
                    Buy Now
                </button>
            </div>
        </div>
    `;
    return card;
}

// Handle category filtering
function handleCategoryFilter(e) {
    const category = e.target.dataset.category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    currentCategory = category;
    
    if (category === 'all') {
        displayBooks(books);
    } else {
        const filteredBooks = books.filter(book => 
            book.category.toLowerCase() === category.toLowerCase()
        );
        displayBooks(filteredBooks);
    }
}

// Handle search
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        displayBooks(books);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/books/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const searchResults = await response.json();
        displayBooks(searchResults);
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Search failed', 'error');
    }
}

// Add to cart functionality
async function addToCart(bookId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.id,
                bookId: bookId,
                quantity: 1
            })
        });

        if (!response.ok) throw new Error('Failed to add to cart');
        
        const result = await response.json();
        cart = result.cart;
        updateCartUI();
        showNotification('Added to cart!', 'success');
    } catch (error) {
        console.error('Add to cart error:', error);
        showNotification('Failed to add to cart', 'error');
    }
}

// Buy now functionality
async function buyNow(bookId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    // Add to cart first, then proceed to checkout
    await addToCart(bookId);
    hideModal(cartModal);
    showModal(checkoutModal);
}

// Load cart from API
async function loadCart() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/cart/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to load cart');
        cart = await response.json();
        updateCartUI();
    } catch (error) {
        console.error('Load cart error:', error);
    }
}

// Update cart UI
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const total = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
    
    // Update cart count
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.book.image}" alt="${item.book.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.book.title}</h4>
                    <p class="cart-item-author">by ${item.book.author}</p>
                    <p class="cart-item-price">$${item.book.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.bookId}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.bookId}, ${item.quantity + 1})">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.bookId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Update total
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Update item quantity
async function updateQuantity(bookId, newQuantity) {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/cart/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.id,
                bookId: bookId,
                quantity: newQuantity
            })
        });

        if (!response.ok) throw new Error('Failed to update quantity');
        
        const result = await response.json();
        cart = result.cart;
        updateCartUI();
    } catch (error) {
        console.error('Update quantity error:', error);
        showNotification('Failed to update quantity', 'error');
    }
}

// Remove item from cart
async function removeFromCart(bookId) {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/cart/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.id,
                bookId: bookId
            })
        });

        if (!response.ok) throw new Error('Failed to remove item');
        
        const result = await response.json();
        cart = result.cart;
        updateCartUI();
        showNotification('Item removed from cart', 'success');
    } catch (error) {
        console.error('Remove from cart error:', error);
        showNotification('Failed to remove item', 'error');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        hideModal(loginModal);
        await loadCart();
        updateUI();
        showNotification('Login successful!', 'success');
        
        // Clear form
        document.getElementById('loginForm').reset();
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message, 'error');
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        hideModal(signupModal);
        showNotification('Registration successful! Please login.', 'success');
        
        // Clear form and switch to login
        document.getElementById('signupForm').reset();
        showModal(loginModal);
    } catch (error) {
        console.error('Signup error:', error);
        showNotification(error.message, 'error');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    cart = [];
    localStorage.removeItem('currentUser');
    updateUI();
    showNotification('Logged out successfully', 'success');
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();
    
    if (!currentUser || cart.length === 0) {
        showNotification('Please login and add items to cart', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const shippingAddress = {
        name: formData.get('checkoutName') || document.getElementById('checkoutName').value,
        email: formData.get('checkoutEmail') || document.getElementById('checkoutEmail').value,
        address: formData.get('checkoutAddress') || document.getElementById('checkoutAddress').value,
        phone: formData.get('checkoutPhone') || document.getElementById('checkoutPhone').value
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

    try {
        const response = await fetch(`${API_BASE}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.id,
                items: cart,
                totalAmount: totalAmount,
                shippingAddress: shippingAddress
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Purchase failed');
        }

        // Clear cart
        cart = [];
        updateCartUI();
        
        // Show success modal
        document.getElementById('orderId').textContent = data.orderId;
        hideModal(checkoutModal);
        showModal(successModal);
        
        // Clear checkout form
        document.getElementById('checkoutForm').reset();
        
        showNotification('Purchase successful!', 'success');
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification(error.message, 'error');
    }
}

// Check authentication status
async function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        await loadCart();
    }
}

// Update UI based on authentication status
function updateUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        cart = [];
        updateCartUI();
    }
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href').substring(1);
    document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
}

// Scroll to books section
function scrollToBooks() {
    document.getElementById('books').scrollIntoView({ behavior: 'smooth' });
}

// Close success modal
function closeSuccessModal() {
    hideModal(successModal);
}

// Show modal
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide modal
function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show loading spinner
function showLoading() {
    loadingSpinner.style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 4000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.backgroundColor = '#667eea';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add some CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(notificationStyles);