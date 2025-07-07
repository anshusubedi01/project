const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const USERS_FILE = './backend/users.json';
const REGS_FILE = './backend/registrations.json';

// Helper to read/write JSON
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Signup
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  let users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });
  users.push({ username, email, password });
  writeJSON(USERS_FILE, users);
  res.json({ success: true });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  let users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user: { username: user.username, email: user.email } });
});

// Register for event
app.post('/api/register', (req, res) => {
  const { eventId, email } = req.body;
  let regs = readJSON(REGS_FILE);
  if (regs.find(r => r.eventId === eventId && r.email === email)) return res.status(400).json({ error: 'Already registered' });
  regs.push({ eventId, email });
  writeJSON(REGS_FILE, regs);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));