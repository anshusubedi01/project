# Social Event Management System

A comprehensive social event management platform built with HTML, CSS, JavaScript (frontend) and Node.js/Express (backend).

## Features

- **User Authentication**: Secure sign up and login functionality with password hashing
- **Event Management**: Create, edit, and manage events with detailed information
- **Event Discovery**: Browse events by category, date, location with search functionality
- **Event Registration**: Register for events with different ticket types
- **Social Features**: User profiles, friend system, event sharing, and reviews
- **Notifications**: Email and push notifications for event updates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Project Structure

```
project/
├── backend/
│   ├── server.js          # Express server with all API endpoints
│   ├── package.json       # Node.js dependencies
│   ├── users.json         # User data storage
│   ├── events.json        # Event data storage
│   ├── registrations.json # Event registration data
│   └── notifications.json # Notification data
├── public/
│   ├── index.html         # Main application page
│   ├── style.css          # Modern CSS styling
│   ├── script.js          # Frontend JavaScript functionality
│   ├── events.html        # Events page
│   ├── profile.html       # User profile page
│   └── create-event.html  # Event creation page
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project files**

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`

4. **Open the application**
   - Open `public/index.html` in your web browser
   - Or navigate to `http://localhost:3000` if the server is running

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile/:userId` - Get user profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/category/:category` - Get events by category
- `GET /api/events/search?q=query` - Search events
- `POST /api/events` - Create new event
- `PUT /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event

### Event Registration
- `POST /api/events/:eventId/register` - Register for event
- `GET /api/events/:eventId/registrations` - Get event registrations
- `DELETE /api/events/:eventId/register` - Cancel registration

### Social Features
- `GET /api/users/:userId/friends` - Get user's friends
- `POST /api/users/:userId/friends` - Add friend
- `POST /api/events/:eventId/share` - Share event
- `POST /api/events/:eventId/reviews` - Add event review

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `POST /api/notifications` - Send notification
- `PUT /api/notifications/:notificationId/read` - Mark notification as read

## Features in Detail

### 1. User Authentication & Profiles
- Secure password hashing using bcrypt
- User registration with username, email, and password
- User profiles with bio, interests, and event history
- Profile picture upload functionality

### 2. Event Management
- Create events with title, description, date, time, location
- Event categories (Concert, Conference, Wedding, Party, Sports, etc.)
- Event status management (Draft, Published, Cancelled, Completed)
- Event capacity and ticket pricing
- Event image upload

### 3. Event Discovery
- Browse events by category, date, location
- Search functionality by event title, description, or location
- Featured events section
- Upcoming events timeline
- Event recommendations based on user interests

### 4. Event Registration & Ticketing
- Multiple ticket types (VIP, Regular, Student, Early Bird)
- Payment integration (Stripe/PayPal)
- QR code generation for tickets
- Waitlist management for sold-out events
- Group booking functionality

### 5. Social Features
- User friend/follow system
- Event sharing on social media
- Event reviews and ratings
- Photo galleries for events
- Event comments and discussions

### 6. Notifications & Communication
- Email notifications for event updates
- Push notifications for mobile users
- Event reminders
- Event announcements and updates
- Friend activity notifications

### 7. Advanced Features
- Event analytics and reporting
- Calendar integration (Google Calendar, Outlook)
- Mobile app support
- Multi-language support
- Event templates for quick creation

## Sample Data

The application comes with sample events:
- Summer Music Festival (Concert)
- Tech Conference 2024 (Conference)
- Wedding Celebration (Wedding)
- Birthday Party (Party)
- Football Match (Sports)
- Art Exhibition (Cultural)

## Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, flexbox, and grid
- **JavaScript (ES6+)**: Async/await, fetch API, DOM manipulation
- **Font Awesome**: Icons

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Multer**: File upload handling

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

To run in development mode with auto-restart:
```bash
cd backend
npm run dev
```

## Security Features

- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Error handling
- Rate limiting
- JWT token authentication

## Future Enhancements

- Real-time chat for event attendees
- Live streaming integration
- Advanced analytics dashboard
- AI-powered event recommendations
- Virtual event support
- Advanced payment processing
- Multi-tenant architecture
- API rate limiting
- WebSocket support for real-time features

## Troubleshooting

1. **Server not starting**: Make sure Node.js is installed and port 3000 is available
2. **Events not loading**: Check if the backend server is running
3. **Authentication issues**: Clear browser localStorage and try again
4. **CORS errors**: Ensure the backend server is running on localhost:3000
5. **File upload issues**: Check if upload directory exists and has proper permissions

## License

This project is for educational purposes. Free to modify and use as needed.