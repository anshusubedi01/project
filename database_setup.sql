-- Create database
CREATE DATABASE IF NOT EXISTS eventdb;
USE eventdb;

-- Admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    max_participants INT DEFAULT 0,
    current_participants INT DEFAULT 0,
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id)
);

-- Insert default admin account
INSERT INTO admins (username, email, password, full_name) VALUES 
('admin', 'admin@pranshu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, event_type, image_url, max_participants) VALUES 
('Community Volunteering Drive', 'Join hands with your neighbors to clean up local parks, paint community centers, and help beautify our city. All ages welcome!', '2025-08-05', '09:00:00', 'Central Park, Kathmandu', 'Volunteering', 'event1.jpg', 50),
('Blood Donation Camp', 'Donate blood and save lives! Organized in partnership with City Hospital. Free health checkup for all donors.', '2025-08-12', '10:00:00', 'City Hospital, Kathmandu', 'Donation', 'event2.jpg', 100),
('Food Donation Drive', 'Help us collect and distribute food to families in need. Non-perishable food items preferred.', '2025-08-18', '14:00:00', 'Community Center, Kathmandu', 'Donation', 'event3.jpg', 75),
('Mental Health Awareness Workshop', 'Attend our workshop to learn about mental health, stress management, and local support resources. Open to all.', '2025-08-22', '15:00:00', 'Mental Health Center, Kathmandu', 'Awareness', 'event4.jpg', 30),
('Digital Literacy for Seniors', 'A hands-on session to help seniors learn to use smartphones, email, and the internet safely. Volunteers needed as digital buddies!', '2025-08-28', '11:00:00', 'Senior Center, Kathmandu', 'Education', 'event5.jpg', 25); 