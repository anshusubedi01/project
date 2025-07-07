const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Data files
const USERS_FILE = path.join(__dirname, 'users.json');
const EVENTS_FILE = path.join(__dirname, 'events.json');
const REGISTRATIONS_FILE = path.join(__dirname, 'registrations.json');
const NOTIFICATIONS_FILE = path.join(__dirname, 'notifications.json');

// Initialize data files if they don't exist
function initializeDataFiles() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(EVENTS_FILE)) {
        const sampleEvents = [
            {
                id: 1,
                title: "Summer Music Festival",
                description: "A three-day music festival featuring top artists from around the world. Experience amazing performances, food trucks, and great vibes!",
                category: "Concert",
                date: "2024-07-15",
                time: "18:00",
                location: "Central Park, New York",
                organizer: "Music Events Inc.",
                capacity: 5000,
                currentRegistrations: 1200,
                price: 89.99,
                image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
                status: "Published",
                tags: ["music", "festival", "summer"],
                createdAt: "2024-01-15T10:00:00Z"
            },
            {
                id: 2,
                title: "Tech Conference 2024",
                description: "Join us for the biggest tech conference of the year. Learn from industry experts, network with professionals, and discover the latest trends.",
                category: "Conference",
                date: "2024-06-20",
                time: "09:00",
                location: "Convention Center, San Francisco",
                organizer: "Tech Events Pro",
                capacity: 2000,
                currentRegistrations: 1800,
                price: 299.99,
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
                status: "Published",
                tags: ["technology", "conference", "networking"],
                createdAt: "2024-01-10T14:30:00Z"
            },
            {
                id: 3,
                title: "Wedding Celebration",
                description: "Join us for a beautiful wedding celebration. An evening of love, joy, and unforgettable memories.",
                category: "Wedding",
                date: "2024-08-10",
                time: "16:00",
                location: "Grand Hotel, Los Angeles",
                organizer: "Sarah & Michael",
                capacity: 200,
                currentRegistrations: 150,
                price: 0,
                image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400",
                status: "Published",
                tags: ["wedding", "celebration", "love"],
                createdAt: "2024-01-20T09:15:00Z"
            },
            {
                id: 4,
                title: "Birthday Party",
                description: "Come celebrate my 25th birthday! Food, drinks, music, and lots of fun guaranteed.",
                category: "Party",
                date: "2024-05-25",
                time: "19:00",
                location: "My House, Brooklyn",
                organizer: "Alex Johnson",
                capacity: 50,
                currentRegistrations: 25,
                price: 15.00,
                image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400",
                status: "Published",
                tags: ["birthday", "party", "celebration"],
                createdAt: "2024-01-25T16:45:00Z"
            },
            {
                id: 5,
                title: "Football Match",
                description: "Local football league match. Come support your favorite team and enjoy the game!",
                category: "Sports",
                date: "2024-04-15",
                time: "15:00",
                location: "City Stadium, Chicago",
                organizer: "City Sports League",
                capacity: 10000,
                currentRegistrations: 8500,
                price: 25.00,
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                status: "Published",
                tags: ["football", "sports", "match"],
                createdAt: "2024-01-30T11:20:00Z"
            },
            {
                id: 6,
                title: "Art Exhibition",
                description: "Contemporary art exhibition featuring works from local and international artists. Free admission.",
                category: "Cultural",
                date: "2024-09-05",
                time: "10:00",
                location: "Modern Art Museum, Miami",
                organizer: "Miami Art Society",
                capacity: 1000,
                currentRegistrations: 300,
                price: 0,
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
                status: "Published",
                tags: ["art", "exhibition", "culture"],
                createdAt: "2024-02-01T13:10:00Z"
            }
        ];
        fs.writeFileSync(EVENTS_FILE, JSON.stringify(sampleEvents, null, 2));
    }
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
        fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify({}, null, 2));
    }
    if (!fs.existsSync(NOTIFICATIONS_FILE)) {
        fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify({}, null, 2));
    }
}

// Helper functions
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        return false;
    }
}

// Initialize data files
initializeDataFiles();

// Routes

// Get all events
app.get('/api/events', (req, res) => {
    const events = readJsonFile(EVENTS_FILE);
    res.json(events);
});

// Get events by category
app.get('/api/events/category/:category', (req, res) => {
    const events = readJsonFile(EVENTS_FILE);
    const category = req.params.category;
    const filteredEvents = events.filter(event => 
        event.category.toLowerCase() === category.toLowerCase()
    );
    res.json(filteredEvents);
});

// Search events
app.get('/api/events/search', (req, res) => {
    const events = readJsonFile(EVENTS_FILE);
    const query = req.query.q.toLowerCase();
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
    );
    res.json(filteredEvents);
});

// Get single event
app.get('/api/events/:eventId', (req, res) => {
    const events = readJsonFile(EVENTS_FILE);
    const eventId = parseInt(req.params.eventId);
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
});

// Create new event
app.post('/api/events', (req, res) => {
    try {
        const {
            title,
            description,
            category,
            date,
            time,
            location,
            organizer,
            capacity,
            price,
            image,
            tags
        } = req.body;

        if (!title || !description || !category || !date || !location || !organizer) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const events = readJsonFile(EVENTS_FILE);
        const newEvent = {
            id: Date.now(),
            title,
            description,
            category,
            date,
            time: time || "18:00",
            location,
            organizer,
            capacity: capacity || 100,
            currentRegistrations: 0,
            price: price || 0,
            image: image || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400",
            status: "Published",
            tags: tags || [],
            createdAt: new Date().toISOString()
        };

        events.push(newEvent);
        writeJsonFile(EVENTS_FILE, events);

        res.status(201).json({ 
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        console.error('Event creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update event
app.put('/api/events/:eventId', (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const events = readJsonFile(EVENTS_FILE);
        const eventIndex = events.findIndex(e => e.id === eventId);
        
        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const updatedEvent = { ...events[eventIndex], ...req.body };
        events[eventIndex] = updatedEvent;
        writeJsonFile(EVENTS_FILE, events);

        res.json({ 
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (error) {
        console.error('Event update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete event
app.delete('/api/events/:eventId', (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const events = readJsonFile(EVENTS_FILE);
        const filteredEvents = events.filter(e => e.id !== eventId);
        
        if (filteredEvents.length === events.length) {
            return res.status(404).json({ error: 'Event not found' });
        }

        writeJsonFile(EVENTS_FILE, filteredEvents);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Event deletion error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register for event
app.post('/api/events/:eventId/register', (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const { userId, ticketType = 'Regular' } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const events = readJsonFile(EVENTS_FILE);
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.currentRegistrations >= event.capacity) {
            return res.status(400).json({ error: 'Event is full' });
        }

        // Update event registrations
        event.currentRegistrations++;
        const eventIndex = events.findIndex(e => e.id === eventId);
        events[eventIndex] = event;
        writeJsonFile(EVENTS_FILE, events);

        // Store registration
        const registrations = readJsonFile(REGISTRATIONS_FILE);
        if (!registrations[eventId]) {
            registrations[eventId] = [];
        }
        
        const registration = {
            id: Date.now(),
            userId: parseInt(userId),
            eventId,
            ticketType,
            registeredAt: new Date().toISOString()
        };
        
        registrations[eventId].push(registration);
        writeJsonFile(REGISTRATIONS_FILE, registrations);

        res.status(201).json({ 
            message: 'Registration successful',
            registration
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get event registrations
app.get('/api/events/:eventId/registrations', (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const registrations = readJsonFile(REGISTRATIONS_FILE);
        const eventRegistrations = registrations[eventId] || [];
        res.json(eventRegistrations);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Cancel registration
app.delete('/api/events/:eventId/register', (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const registrations = readJsonFile(REGISTRATIONS_FILE);
        if (!registrations[eventId]) {
            return res.status(404).json({ error: 'No registrations found for this event' });
        }

        const registrationIndex = registrations[eventId].findIndex(r => r.userId === parseInt(userId));
        if (registrationIndex === -1) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Remove registration
        registrations[eventId].splice(registrationIndex, 1);
        writeJsonFile(REGISTRATIONS_FILE, registrations);

        // Update event registrations count
        const events = readJsonFile(EVENTS_FILE);
        const event = events.find(e => e.id === eventId);
        if (event) {
            event.currentRegistrations = Math.max(0, event.currentRegistrations - 1);
            const eventIndex = events.findIndex(e => e.id === eventId);
            events[eventIndex] = event;
            writeJsonFile(EVENTS_FILE, events);
        }

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const users = readJsonFile(USERS_FILE);
        
        // Check if user already exists
        const existingUser = users.find(user => 
            user.email === email || user.username === username
        );
        
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
            bio: "",
            interests: [],
            profileImage: "",
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeJsonFile(USERS_FILE, users);

        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: newUser.id, username, email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const users = readJsonFile(USERS_FILE);
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ 
            message: 'Login successful',
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                bio: user.bio,
                interests: user.interests,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/profile/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const users = readJsonFile(USERS_FILE);
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's event registrations
        const registrations = readJsonFile(REGISTRATIONS_FILE);
        const userRegistrations = [];
        
        Object.keys(registrations).forEach(eventId => {
            const eventRegistrations = registrations[eventId].filter(r => r.userId === userId);
            userRegistrations.push(...eventRegistrations);
        });

        const userProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            interests: user.interests,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            registrations: userRegistrations
        };

        res.json(userProfile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/profile/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { bio, interests, profileImage } = req.body;
        
        const users = readJsonFile(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        users[userIndex] = {
            ...users[userIndex],
            bio: bio || users[userIndex].bio,
            interests: interests || users[userIndex].interests,
            profileImage: profileImage || users[userIndex].profileImage
        };

        writeJsonFile(USERS_FILE, users);

        res.json({ 
            message: 'Profile updated successfully',
            user: users[userIndex]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get notifications for user
app.get('/api/notifications/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const notifications = readJsonFile(NOTIFICATIONS_FILE);
        const userNotifications = notifications[userId] || [];
        res.json(userNotifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send notification
app.post('/api/notifications', (req, res) => {
    try {
        const { userId, title, message, type = 'info' } = req.body;
        
        if (!userId || !title || !message) {
            return res.status(400).json({ error: 'User ID, title, and message are required' });
        }

        const notifications = readJsonFile(NOTIFICATIONS_FILE);
        if (!notifications[userId]) {
            notifications[userId] = [];
        }

        const notification = {
            id: Date.now(),
            userId: parseInt(userId),
            title,
            message,
            type,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        notifications[userId].push(notification);
        writeJsonFile(NOTIFICATIONS_FILE, notifications);

        res.status(201).json({ 
            message: 'Notification sent successfully',
            notification
        });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark notification as read
app.put('/api/notifications/:notificationId/read', (req, res) => {
    try {
        const notificationId = parseInt(req.params.notificationId);
        const notifications = readJsonFile(NOTIFICATIONS_FILE);
        
        let found = false;
        Object.keys(notifications).forEach(userId => {
            const userNotifications = notifications[userId];
            const notificationIndex = userNotifications.findIndex(n => n.id === notificationId);
            if (notificationIndex !== -1) {
                userNotifications[notificationIndex].isRead = true;
                found = true;
            }
        });

        if (!found) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        writeJsonFile(NOTIFICATIONS_FILE, notifications);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});