# 🌟 Pranshu - Social Event Management System

A comprehensive web-based social event management system built with HTML, CSS, and JavaScript. This platform enables users to discover, register for, and support various social events including volunteering opportunities, fundraising events, and donation drives.

## ✨ Features

### 🔐 User Management
- **User Registration & Login**: Complete authentication system using localStorage
- **User Profile Management**: Store user information and track event participation
- **Session Management**: Persistent login state across browser sessions

### 📅 Event Management
- **Multiple Event Types**: 
  - 🤝 Volunteering events
  - 💰 Fundraising campaigns  
  - 💖 Donation drives
- **Event Information**: Comprehensive details including date, time, location, requirements, and organizer info
- **Event Registration**: Users can register for events with motivation and emergency contact
- **Registration Status**: Visual indicators showing registration status and availability

### 💳 Donation System
- **QR Code Generation**: Dynamic QR codes for secure donations
- **Multiple Donation Amounts**: Pre-set amounts ($25, $50, $100, $250, $500) or custom amounts
- **Payment Integration Ready**: QR codes link to payment gateways

### 🎨 User Interface
- **Modern Design**: Professional, responsive design with smooth animations
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Interactive Elements**: Hover effects, smooth scrolling, and dynamic content
- **Toast Notifications**: Real-time feedback for user actions

### 📱 Technical Features
- **Client-side Storage**: All data persisted in localStorage
- **No Backend Required**: Fully functional frontend-only application
- **External Libraries**: 
  - Tailwind CSS for styling
  - Font Awesome for icons
  - QRCode.js for QR generation
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required!

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start exploring the platform!

### Demo Credentials
For testing purposes, you can use:
- **Email**: john@example.com
- **Password**: password123

Or create a new account using the "Join Us" button.

## 📋 Sample Events

The system comes pre-loaded with diverse events:

1. **Community Garden Cleanup** (Volunteering)
   - Help beautify the neighborhood
   - 25 spots available

2. **Children's Education Fundraiser** (Fundraising)
   - Support educational materials for children
   - 100 spots available

3. **Food Bank Volunteer Day** (Volunteering)
   - Help distribute food to families in need
   - 30 spots available

4. **Digital Donation Drive** (Donation)
   - Support causes through QR code donations
   - Unlimited participation

5. **Senior Care Center Visit** (Volunteering)
   - Spend time with elderly residents
   - 15 spots available

6. **Environmental Awareness Gala** (Fundraising)
   - Support conservation projects
   - 200 spots available

## 🛠️ How to Use

### For Users
1. **Browse Events**: Scroll through the events section to discover opportunities
2. **Sign Up**: Create an account using the "Join Us" button
3. **Register for Events**: Click "Register Now" on events that interest you
4. **Make Donations**: Use the "Donate Now" feature to support causes via QR codes
5. **Track Participation**: See your registration status on event cards

### For Developers
- **Adding Events**: Modify the `initializeApp()` function in `script.js`
- **Customizing Styles**: Edit `style.css` for visual changes
- **Adding Features**: Extend the JavaScript functionality as needed

## 📁 Project Structure

```
├── index.html          # Main HTML file with all page content and modals
├── style.css           # Comprehensive CSS with animations and responsive design
├── script.js           # Complete JavaScript functionality
└── README.md           # This documentation file
```

## 🎨 Key Components

### HTML Structure
- **Header**: Navigation with authentication buttons
- **Hero Section**: Call-to-action for volunteering and donations
- **Events Section**: Dynamic display of all available events
- **About Section**: Information about the platform's mission
- **Footer**: Contact information and social links
- **Modals**: Login, signup, event registration, and donation forms

### CSS Features
- **Custom Color Palette**: Professional green-themed design
- **Animations**: Fade-in, slide effects, and smooth transitions
- **Responsive Grid**: Mobile-first responsive layout
- **Modern Cards**: Glass-morphism inspired event cards
- **Interactive Buttons**: Hover effects and loading states

### JavaScript Functionality
- **Event Management**: CRUD operations for events
- **User Authentication**: Registration and login system
- **Data Persistence**: localStorage for client-side data
- **QR Code Generation**: Dynamic payment QR codes
- **Form Handling**: Comprehensive form validation
- **Notification System**: Toast notifications for user feedback

## 🔧 Customization

### Adding New Event Categories
```javascript
// In getCategoryIcon() function
case 'your-category': return 'fas fa-your-icon';

// In getCategoryColor() function  
case 'your-category': return 'bg-your-color text-your-text-color';
```

### Modifying Event Data
Events are stored in the `events` array in `script.js`. Each event should have:
```javascript
{
    id: unique_number,
    title: "Event Title",
    description: "Event description",
    category: "volunteering|fundraising|donation", 
    date: "YYYY-MM-DD",
    time: "HH:MM",
    location: "Event location",
    image: "image_url",
    spotsAvailable: number,
    registeredUsers: [],
    organizer: "Organizer name",
    requirements: "Special requirements"
}
```

## 🌐 Browser Support
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 📱 Mobile Features
- Touch-friendly interface
- Responsive design
- Mobile-optimized modals
- Swipe-friendly navigation

## 🚀 Future Enhancements
- Real payment gateway integration
- Email notifications
- Calendar sync
- Social media sharing
- Advanced user profiles
- Event search and filtering
- Admin dashboard
- Real-time chat
- Event reviews and ratings

## 💡 Contributing
This is a demonstration project, but feel free to:
1. Fork the repository
2. Add new features
3. Improve the design
4. Submit pull requests

## 📞 Support
For questions or issues, please refer to the contact information in the footer of the website.

## 📄 License
This project is open source and available under the MIT License.

---

**Built with ❤️ for social good by the Pranshu community**