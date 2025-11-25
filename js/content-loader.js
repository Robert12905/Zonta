(function(){
  // Try several relative paths so the loader works both when served from root or from the html-files subfolder
  const candidates = [
    '/content/homepage.json',
    'content/homepage.json',
    '../content/homepage.json'
  ];

  function fetchFirst(urls) {
    return urls.reduce((chain, url) => chain.catch(() => fetch(url).then(r => {
      if (!r.ok) throw new Error('not ok');
      return r.json();
    })), Promise.reject());
  }

  function applyData(data){
    if (!data || typeof data !== 'object') return;
    const title = document.getElementById('hero-title');
    const paragraph = document.getElementById('main-paragraph');
    const img = document.getElementById('hero-img');

    if (title && data.heroTitle) title.textContent = data.heroTitle;
    if (paragraph && data.mainParagraph) paragraph.textContent = data.mainParagraph;
    if (img && data.heroImage) img.src = data.heroImage;

    // optional event area (if present in page)
    if (data.eventPreview && Array.isArray(data.eventPreview)){
      const container = document.querySelector('#event-preview-container');
      if (container) {
        container.innerHTML = '';
        data.eventPreview.forEach(ev => {
          const card = document.createElement('div');
          card.className = 'event-card';
          card.innerHTML = `
            ${ev.image ? `<img src="${ev.image}" alt="${(ev.title||'')}">` : ''}
            <h3>${ev.title||''}</h3>
            <p>${ev.shortText||''}</p>
          `;
          container.appendChild(card);
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    fetchFirst(candidates)
      .then(data => applyData(data))
      .catch(() => {
        // If fetch failed, keep the HTML defaults and do nothing
        // Console output for debugging
        // console.warn('Could not load homepage content JSON from any candidate path');
      });
  });
})();
