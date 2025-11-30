// cleanup-events.js
// Remove past events from content/events.json

const fs = require('fs');
const path = require('path');

// Path to events file relative to repo root
const EVENTS_PATH = path.join(__dirname, 'content', 'events.json');

// Read and parse JSON
const data = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf8'));
const events = data.events_list || [];

function toDate(dateStr, timeStr) {
  if (!dateStr) return null;
  if (!timeStr) return new Date(dateStr);

  // Handle "10:00 am" style times
  const date = new Date(dateStr + ' ' + timeStr);

  return date;
}

function isPast(event) {
  const now = new Date();

  // Determine cutoff time
  // If end_date & end_time exist -> use them
  // If only end_date exists -> midnight next day
  // If no end_ date -> use start_date rule (delete next day)
  let cutoff = null;

  if (event.end_date) {
    cutoff = toDate(event.end_date, event.end_time || "23:59");
  } else {
    // no end_date → use start_date and optional start_time
    cutoff = toDate(event.start_date, event.start_time || "23:59");
  }

  if (!cutoff) return false;
  return cutoff < now;
}

// Filter events
const filteredEvents = events.filter(event => !isPast(event));

const changed = JSON.stringify(events) !== JSON.stringify(filteredEvents);

if (changed) {
  data.events_list = filteredEvents;
  fs.writeFileSync(EVENTS_PATH, JSON.stringify(data, null, 2));
  console.log("Expired events removed.");
} else {
  console.log("No changes — no expired events.");
}

process.exit(0);
