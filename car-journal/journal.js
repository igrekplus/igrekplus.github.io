'use strict';
// Article content and the entire lineup remain readable without JavaScript.
const stamp = document.querySelector('time[data-content-updated]');
if (stamp) fetch(new URL('content-meta.json', document.currentScript.src), { cache: 'no-store' })
  .then(r => { if (!r.ok) throw new Error('Content date unavailable'); return r.json(); })
  .then(meta => { stamp.textContent = meta.label; stamp.dateTime = meta.contentUpdatedAt; })
  .catch(() => {});

const search = document.getElementById('editorial-search');
const category = document.getElementById('editorial-category');
if (search && category) {
  const cards = [...document.querySelectorAll('.ed-searchable')];
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase('ja');
  const apply = () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const matchesText = terms.every(term => {
        const numberQuery = term.match(/^(?:no\.?|#)?0*(\d+)$/);
        return numberQuery
          ? Number(numberQuery[1]) === Number(card.dataset.number)
          : normalize(card.dataset.search).includes(term);
      });
      const matchesCategory = !category.value || card.dataset.category === category.value;
      card.hidden = !(matchesText && matchesCategory);
      if (!card.hidden) visible++;
    }
    for (const section of document.querySelectorAll('.ed-series-section')) {
      section.hidden = ![...section.querySelectorAll('.ed-searchable')].some(c => !c.hidden);
    }
    // Keep a search result close to its field instead of behind the full schedule.
    document.querySelector('.ed-lineup').hidden = terms.length > 0 || Boolean(category.value);
    document.getElementById('editorial-count').textContent = `${visible}件の企画`;
    document.getElementById('editorial-empty').hidden = visible > 0;
  };
  document.querySelector('.ed-filters').hidden = false;
  search.addEventListener('input', apply);
  category.addEventListener('change', apply);
  apply();
}
