/**
 * Café Hikbert – Express backend server
 * Handles reservation requests and serves static files.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const RESERVATIONS_FILE = path.join(__dirname, 'data', 'reservations.json');

// Rate limiter: max 10 requests per 15 minutes per IP for the API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(RESERVATIONS_FILE)) {
  fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify([], null, 2));
}

// Simple write queue to prevent race conditions when concurrent requests
// read/write the JSON file simultaneously.
let writeQueue = Promise.resolve();

function appendReservation(reservation) {
  writeQueue = writeQueue.then(() => {
    const reservations = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));
    reservations.push(reservation);
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
  });
  return writeQueue;
}

// POST /api/reservations – Create a new reservation
app.post('/api/reservations', apiLimiter, async (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body;

  if (!name || !email || !date || !time || !guests) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  // Basic date validation – must not be in the past
  const reservationDate = new Date(`${date}T${time}`);
  if (reservationDate < new Date()) {
    return res.status(400).json({ error: 'Please choose a future date and time.' });
  }

  const reservation = {
    id: Date.now().toString(),
    name,
    email,
    phone: phone || '',
    date,
    time,
    guests: parseInt(guests, 10),
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  try {
    await appendReservation(reservation);
  } catch {
    return res.status(500).json({ error: 'Could not save reservation. Please try again.' });
  }

  res.status(201).json({ message: 'Reservation confirmed! We look forward to seeing you.', id: reservation.id });
});

// GET /api/reservations – List all reservations (admin use)
app.get('/api/reservations', apiLimiter, (req, res) => {
  const reservations = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));
  res.json(reservations);
});

// Pre-read index.html once at startup to avoid per-request file I/O
const indexHtml = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

// Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
  res.type('html').send(indexHtml);
});

app.listen(PORT, () => {
  console.log(`Café Hikbert server running at http://localhost:${PORT}`);
});
