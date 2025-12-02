/* Short, readable content loader for the homepage
   - Attempts a small list of candidate paths and applies the first JSON it finds
   - Minimal, uses async/await and a tiny mapping table to populate elements
*/
(async function() {
  const CANONICAL = 'content/homepage.json';
  const CACHE_KEY = 'homepage-json';
  const FETCH_TIMEOUT_MS = 2500;

  async function loadJson(url, ms = FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      return await res.json();
    } catch (err) {
      clearTimeout(id);
      console.warn('Failed to load homepage JSON:', url, err);
      return null;
    }
  }

  function apply(data) {
    if (!data || typeof data !== 'object') return;

    // small map: jsonKey => elementId
    const map = [
      ['heroTitle', 'hero-title'],
      ['mainParagraph', 'main-paragraph'],
      ['heroImage', 'hero-img']
    ];

    map.forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (!el || data[key] == null) return;
      if (el.tagName === 'IMG') el.src = data[key];
      else el.textContent = data[key];
    });
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    // 1) Apply cached content immediately if present (fast UI)
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Basic check to ensure cache isn't empty/corrupt
        if (parsed && Object.keys(parsed).length > 0) {
            apply(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse cached homepage JSON', e);
        localStorage.removeItem(CACHE_KEY);
      }
    }

    // 2) Fetch the canonical JSON and update cache (fresh copy)
    const data = await loadJson(CANONICAL);
    if (data) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        // Private mode could cause setItem to fail — ignore
      }
      apply(data);
    }
  });
})();
