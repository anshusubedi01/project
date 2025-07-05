// --- User Signup ---
if (document.getElementById('signupForm')) {
  document.getElementById('signupForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      document.getElementById('signupMsg').textContent = 'Email already registered!';
      return;
    }
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('signupMsg').textContent = 'Signup successful! You can now login.';
    setTimeout(() => window.location.href = 'login.html', 1200);
  };
}

// --- User Login ---
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      document.getElementById('loginMsg').textContent = 'Login successful! Redirecting...';
      setTimeout(() => window.location.href = 'events.html', 1200);
    } else {
      document.getElementById('loginMsg').textContent = 'Invalid email or password!';
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
if (!localStorage.getItem('events')) {
  localStorage.setItem('events', JSON.stringify(defaultEvents));
}

// --- Load Events (Events Page) ---
if (document.getElementById('eventList')) {
  const events = JSON.parse(localStorage.getItem('events'));
  let html = '';
  events.forEach(ev => {
    html += `<div class="event-card">
      <img src="${ev.img}" alt="${ev.title}">
      <h4>${ev.title}</h4>
      <div class="event-date">${ev.date}</div>
      <div class="event-type">${ev.type}</div>
      <div class="event-desc">${ev.desc}</div>`;
    if (ev.qr) {
      html += `<div class="qr"><img src="${ev.qr}" alt="Donation QR"></div>`;
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
      <img src="${ev.img}" alt="${ev.title}">
      <h4>${ev.title}</h4>
      <div class="event-date">${ev.date}</div>
      <div class="event-type">${ev.type}</div>
      <div class="event-desc">${ev.desc}</div>`;
    if (ev.qr) {
      html += `<div class="qr"><img src="${ev.qr}" alt="Donation QR"></div>`;
    }
    html += `</div>`;
  });
  document.getElementById('homeEvents').innerHTML = html;
}

// --- Register for Event ---
window.registerEvent = function(eventId) {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!user) {
    alert('Please login to register for events.');
    window.location.href = 'login.html';
    return;
  }
  let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
  if (registrations.find(r => r.eventId === eventId && r.email === user.email)) {
    alert('You have already registered for this event!');
    return;
  }
  registrations.push({ eventId, email: user.email });
  localStorage.setItem('registrations', JSON.stringify(registrations));
  alert('Registered successfully for this event!');
};