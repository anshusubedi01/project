// --- User Signup ---
if (document.getElementById('signupForm')) {
  document.getElementById('signupForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Client-side validation
    if (!username || !email || !password) {
      document.getElementById('signupMsg').textContent = 'All fields are required!';
      return;
    }
    
    if (password.length < 6) {
      document.getElementById('signupMsg').textContent = 'Password must be at least 6 characters!';
      return;
    }
    
    try {
      const response = await fetch('backend/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
    document.getElementById('signupMsg').textContent = 'Signup successful! You can now login.';
        setTimeout(() => window.location.href = 'login.php', 1200);
      } else {
        document.getElementById('signupMsg').textContent = data.error || 'Signup failed!';
      }
    } catch (error) {
      document.getElementById('signupMsg').textContent = 'Network error. Please try again.';
    }
  };
}

// --- User Login ---
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const loginBtn = document.getElementById('loginBtn');
    const loginMsg = document.getElementById('loginMsg');
    
    // Disable button to prevent double submission
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Client-side validation
    if (!email || !password) {
      loginMsg.textContent = 'Please fill in all fields!';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      return;
    }
    
    // Get CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('csrf_token', csrfToken);
      
      const response = await fetch('backend/login.php', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        loginMsg.textContent = 'Login successful! Redirecting...';
        loginMsg.style.color = 'green';
        setTimeout(() => window.location.href = 'events.php', 1200);
    } else {
        loginMsg.textContent = data.error || 'Login failed!';
        loginMsg.style.color = 'red';
      }
    } catch (error) {
      loginMsg.textContent = 'Network error. Please try again.';
      loginMsg.style.color = 'red';
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  };
}

// --- Event Data ---
const defaultEvents = [
  {
    id: 1,
    type: 'Volunteering',
    title: 'Community Volunteering Drive',
    date: '2025-08-05',
    desc: 'Join hands with your neighbors to clean up local parks, paint community centers, and help beautify our city. All ages welcome!',
    img: 'event1.jpg'
  },
  {
    id: 2,
    type: 'Donation',
    title: 'Blood Donation Camp',
    date: '2025-08-12',
    desc: 'Donate blood and save lives! Organized in partnership with City Hospital. Free health checkup for all donors.',
    img: 'event2.jpg',
    qr: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://blooddonation.org/donate'
  },
  {
    id: 3,
    type: 'Donation',
    title: 'Food Donation Drive',
    date: '2025-08-18',
    desc: 'Help us collect and distribute food to families in need. Non-perishable food items preferred.',
    img: 'event3.jpg',
    qr: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://fooddonation.org/donate'
  },
  {
    id: 4,
    type: 'Awareness',
    title: 'Mental Health Awareness Workshop',
    date: '2025-08-22',
    desc: 'Attend our workshop to learn about mental health, stress management, and local support resources. Open to all.',
    img: 'event4.jpg'
  },
  {
    id: 5,
    type: 'Education',
    title: 'Digital Literacy for Seniors',
    date: '2025-08-28',
    desc: 'A hands-on session to help seniors learn to use smartphones, email, and the internet safely. Volunteers needed as digital buddies!',
    img: 'event5.jpg'
  }
];

// Initialize events in localStorage only if not exists
if (!localStorage.getItem('events')) {
  localStorage.setItem('events', JSON.stringify(defaultEvents));
}

// --- Load Events (Events Page) ---
if (document.getElementById('eventList')) {
  const events = JSON.parse(localStorage.getItem('events'));
  let html = '';
  events.forEach(ev => {
    html += `<div class="event-card">
      <img src="${ev.img}" alt="${ev.title}" loading="lazy">
      <h4>${ev.title}</h4>
      <div class="event-date">${ev.date}</div>
      <div class="event-type">${ev.type}</div>
      <div class="event-desc">${ev.desc}</div>`;
    if (ev.qr) {
      html += `<div class="qr"><img src="${ev.qr}" alt="Donation QR" loading="lazy"></div>`;
    }
    html += `<button onclick="registerEvent(${ev.id})">Register</button></div>`;
  });
  document.getElementById('eventList').innerHTML = html;
}

// --- Load Featured Events (Home Page) ---
if (document.getElementById('homeEvents')) {
  const events = JSON.parse(localStorage.getItem('events'));
  let html = '';
  events.slice(0, 3).forEach(ev => { // Only show the first 3 events
    html += `<div class="event-card">
      <img src="${ev.img}" alt="${ev.title}" loading="lazy">
      <h4>${ev.title}</h4>
      <div class="event-date">${ev.date}</div>
      <div class="event-type">${ev.type}</div>
      <div class="event-desc">${ev.desc}</div>`;
    if (ev.qr) {
      html += `<div class="qr"><img src="${ev.qr}" alt="Donation QR" loading="lazy"></div>`;
    }
    html += `</div>`;
  });
  document.getElementById('homeEvents').innerHTML = html;
}

// --- Register for Event ---
window.registerEvent = async function(eventId) {
  try {
    const response = await fetch('backend/check_auth.php');
    const data = await response.json();
    
    if (!data.logged_in) {
    alert('Please login to register for events.');
      window.location.href = 'login.php';
    return;
  }
    
    // Check if already registered
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    if (registrations.find(r => r.eventId === eventId && r.email === data.email)) {
    alert('You have already registered for this event!');
    return;
  }
    
    // Register for event
    registrations.push({ eventId, email: data.email });
  localStorage.setItem('registrations', JSON.stringify(registrations));
  alert('Registered successfully for this event!');
  } catch (error) {
    alert('Error registering for event. Please try again.');
  }
};


  