(async function () {
  const JSON_URL = '/content/events.json';
  const CACHE_KEY = 'events-cache-v1';

  function normalizeEvent(event) {
      const {
        start_date,
        end_date,
        start_time,
        end_time,
        posted_at
      } = event;

      const posted = posted_at ? new Date(posted_at) : new Date(0);

      // Build Start DateTime
      const start = new Date(
      `${start_date} ${start_time ? start_time : "00:00"}`);
      // Build End DateTime (if present)
      let end = null;
      if (end_date) {
        end = new Date(`${end_date} ${end_time ? end_time : "23:59"}`);
    } else {
      // If no end_date, event ends at end of the start date
      end = new Date(`${start_date} ${end_time ? end_time : "23:59"}`);
    }

      return {
        ...event,
        _start: start,
        _end: end,
        _posted: posted
      };
  }

  function isExpired(event) {
    const now = new Date();
    return now > event._end;
  }

  function sortEvents(a, b) {
    // Upcoming first by start date
    if (a._start < b._start) return -1;
    if (a._start > b._start) return 1;
    // Then by posted date (newest first)
    if (a._posted > b._posted) return -1;
    if (a._posted < b._posted) return 1;
    return 0; // final fallback
  }

  function prepareEvents(events) {
    // support both array payloads and CMS-style objects { events_list: [...] }
    const list = Array.isArray(events) ? events : 
    (Array.isArray(events && events.events_list) ? events.events_list : []);

    return list
      .map(normalizeEvent)
      .filter(event => !isExpired(event))
      .sort(sortEvents);
  }

  // Basic cache get/set wrappers
  function getCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function setCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {} // ignore storage limits
  }

  // Safely escape HTML fallback
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Render events using DOM fragments (faster than innerHTML loops)
  function renderEvents(data) {
    function extractEvents(data) {
  if (Array.isArray(data)) return data;                 // direct array
  if (Array.isArray(data.events_list)) return data.events_list; // CMS format
  return [];
  }
    


    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    // ensure we operate on a concrete list (support array or CMS { events_list })
    const list = extractEvents(data);

    list.forEach(event => {
      const row = document.createElement('div');
      row.className = 'row event-row';

      // ---- image section ----
      const imgCol = document.createElement('div');
      imgCol.className = 'event-image-col';

      const img = document.createElement('img');
      img.className = 'contentTaggedListImageThumbnail';
      img.src = event.image || '';
      img.alt = event.title || '';
      img.loading = 'lazy';
      img.style.objectFit = 'cover';

      imgCol.appendChild(img);

      // ---- content section ----
      const contentCol = document.createElement('div');
      contentCol.className = 'event-content';

      const h4 = document.createElement('h4');
      if (event.link) {
        const a = document.createElement('a');
        a.href = event.link;
        a.textContent = event.title || '';
        h4.appendChild(a);
      } else {
        h4.textContent = event.title || '';
      }

      const dateSpan = document.createElement('span');
      dateSpan.className = 'EventDateTime';

      const dateDisplay = event.end_date
        ? `${event.start_date} - ${event.end_date}`
        : event.start_date;

      const timeDisplay = event.end_time
        ? `${event.start_time} - ${event.end_time}`
        : event.start_time;

      dateSpan.innerHTML = `
        <strong>Date:</strong> ${escapeHtml(dateDisplay)}<br>
        <strong>Time:</strong> ${escapeHtml(timeDisplay)}
      `;

      const desc = document.createElement('div');
      desc.className = 'event-description';

      // Markdown → HTML (simple + safe)
      let raw = event.description || '';
      let html;
      
      if (typeof marked !== 'undefined') {
        try {
          html = marked.parse(raw);
        } catch (e) {
          html = escapeHtml(raw).replace(/\n/g, '<br>');
        }
      } else {
        html = escapeHtml(raw).replace(/\n/g, '<br>');
      }

      // Sanitize if DOMPurify is present
      if (typeof DOMPurify !== 'undefined') {
        desc.innerHTML = DOMPurify.sanitize(html);
      } else {
        desc.innerHTML = html;
      }

      contentCol.appendChild(h4);
      contentCol.appendChild(dateSpan);
      contentCol.appendChild(document.createElement('br'));
      contentCol.appendChild(desc);

      // ---- combine ----
      row.appendChild(imgCol);
      row.appendChild(contentCol);
      frag.appendChild(row);
      frag.appendChild(document.createElement('br'));
    });

    container.appendChild(frag);
  }

  // fetch, sort, render
  // 1. Try cached first (instant render)
  const cached = getCache();
  if (cached) {
    const prepared = prepareEvents(cached);
    renderEvents(prepared);
  }
  // 2. Fetch fresh (simple fetch)
  try {
    const res = await fetch(JSON_URL);
    const freshData = await res.json();
    const prepared = prepareEvents(freshData);

    renderEvents(prepared);
    setCache(freshData); 
  } catch (e) {
    console.warn('Could not fetch fresh events, using cache if present.');
  }
})();
