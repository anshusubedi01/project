# Pranshu Social Event Management System
A complete social event management system with user registration, event management, and admin panel. Built with PHP, MySQL, and JavaScript with a beautiful greenish design theme.

## 🚀 Features

### **User Features:**
- **Secure User Registration**: Email validation, password strength requirements, confirm password
- **User Login**: Session management with cookies
- **Event Browsing**: View all upcoming events with details
- **Event Registration**: Register for events with email, contact, and address
- **Real-time Validation**: Client-side and server-side form validation
- **Responsive Design**: Works on all devices

### **Admin Features:**
- **Admin Authentication**: Secure admin login system
- **Event Management**: Add, edit, delete events
- **Registration Management**: View all event registrations
- **Dashboard Statistics**: Overview of events and registrations
- **User Management**: View registered users

### **Technical Features:**
- **Database Integration**: MySQL database with proper relationships
- **Session Management**: Secure PHP sessions
- **Cookie Support**: Remember login status
- **Form Validation**: Comprehensive validation with error messages
- **Security**: Password hashing, SQL injection prevention
- **Modern UI**: Greenish theme with smooth animations

## 🔧 Setup Instructions

### **Prerequisites:**
- XAMPP (Apache + MySQL + PHP)
- PHP 7.4 or higher
- MySQL 5.7 or higher

### **Installation Steps:**

1. **Download/Clone the project**
   ```bash
   # Place in XAMPP htdocs folder
   # Example: C:\xampp\htdocs\project\
   ```

2. **Start XAMPP Services**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

3. **Create Database**
   ```bash
   # Open phpMyAdmin: http://localhost/phpmyadmin
   # Import the database schema:
   # File: backend/database.sql
   ```

4. **Configure Database Connection**
   - Edit `public/dbconnect.php` if needed:
   ```php
   $host = "localhost";
   $user = "root";
   $pass = "";
   $db = "eventdb";
   ```

5. **Access the Application**
   ```
   Main Site: http://localhost/project/public/
   Admin Panel: http://localhost/project/public/admin-login.php
   ```

## 📁 Project Structure

```
project/
├── backend/
│   ├── database.sql           # Database schema
│   ├── add-event.php          # Add events (admin)
│   ├── delete-event.php       # Delete events (admin)
│   ├── login.php              # User login handler
│   ├── register.php           # User registration handler
│   ├── check_auth.php         # Authentication checker
│   └── logout.php             # Logout handler
├── public/
│   ├── index.html             # Home page
│   ├── signup.php             # User registration page
│   ├── login.php              # User login page
│   ├── events.php             # Events listing page
│   ├── admin.php              # Admin dashboard
│   ├── admin-login.php        # Admin login page
│   ├── admin-logout.php       # Admin logout
│   ├── style.css              # Main stylesheet
│   ├── script.js              # Main JavaScript
│   ├── signup-validation.js   # Signup validation
│   ├── login-validation.js    # Login validation
│   ├── events.js              # Events functionality
│   ├── admin.js               # Admin panel JavaScript
│   ├── dbconnect.php          # Database connection
│   └── images/                # Event images
└── README.md
```

## 🔐 Default Credentials

### **Admin Account:**
- **Username**: admin
- **Email**: admin@pranshu.com
- **Password**: admin123

### **Test User Account:**
- Create a new account through the signup page

## 📋 Validation Rules

### **Email Validation:**
- Must be valid email format
- Regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`

### **Password Validation:**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

### **Username Validation:**
- 3-20 characters
- Letters, numbers, and underscores only

### **Event Registration:**
- Email validation
- Contact number validation
- Address (minimum 10 characters)

## 🎨 Design Features

### **Color Scheme:**
- Primary Green: #388e3c
- Light Green: #e8f5e9
- Dark Green: #2e7d32
- Background: Linear gradient with green tones

### **UI Elements:**
- Modern card-based design
- Smooth hover animations
- Responsive grid layouts
- Professional typography
- Consistent spacing and shadows

## 🔄 User Flow

### **Registration Flow:**
1. User visits signup page
2. Fills form with validation feedback
3. Account created and stored
4. Redirected to login page

### **Login Flow:**
1. User enters credentials
2. Validation checks
3. Session created with cookies
4. Redirected to home page

### **Event Registration Flow:**
1. User browses events
2. Clicks "Register for Event"
3. Fills registration form
4. Registration confirmed
5. Email confirmation sent

### **Admin Flow:**
1. Admin logs in
2. Accesses dashboard
3. Manages events and registrations
4. Views statistics

## 🛠️ Database Schema

### **Tables:**
- **admins**: Admin user accounts
- **users**: Regular user accounts
- **events**: Event information
- **event_registrations**: User event registrations

### **Relationships:**
- Events belong to admins (created_by)
- Registrations link users to events
- Cascade deletes for data integrity

## 🚨 Security Features

- **Password Hashing**: All passwords hashed with PHP password_hash()
- **Session Security**: Secure session management
- **SQL Injection Prevention**: Prepared statements
- **Input Validation**: Server-side validation
- **CSRF Protection**: Token-based protection
- **Cookie Security**: Secure cookie settings

## 📝 API Endpoints

### **User Endpoints:**
- `POST /backend/register.php` - User registration
- `POST /backend/login.php` - User login
- `GET /backend/check_auth.php` - Check authentication
- `GET /backend/logout.php` - User logout

### **Admin Endpoints:**
- `POST /backend/add-event.php` - Add new event
- `POST /backend/delete-event.php` - Delete event
- `GET /admin-login.php` - Admin login page
- `GET /admin-logout.php` - Admin logout

## 📞 Support

For support, email: info@socialeventsystem.org

---