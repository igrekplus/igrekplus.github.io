'use strict';

import { experiences, modelScenes, siteMedia } from './experiences.js';
import {
  escapeHTML,
  formatYearMarket,
  getCarOfficialUrl,
  getExteriorAttribution,
  normalizeAttribution,
  normalizeInteriorViews,
  safeExternalUrl
} from './photo-meta.js';

const $ = (selector, root = document) => root.querySelector(selector);

let allCars = [];

function renderAttributionRow(label, src, alt, rawAttribution, options = {}) {
  const attr = normalizeAttribution(rawAttribution);
  const ym = formatYearMarket(attr);
  const officialUrl = safeExternalUrl(options.officialUrl || '');
  const isAvailable = Boolean(src);
  const sharedLabel = options.sameAsNote || '';

  const thumb = isAvailable
    ? `<img src="${escapeHTML(src)}" alt="${escapeHTML(alt || label)}" loading="lazy"/>`
    : `<div class="credits-thumb-fallback"><span>公式案内</span></div>`;

  const licenseCell = attr.license
    ? (attr.licenseUrl
        ? `<a href="${escapeHTML(attr.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(attr.license)}</a>`
        : escapeHTML(attr.license))
    : (isAvailable ? '掲載元の利用条件を参照' : '写真未掲載（公式リンク案内）');

  const sourceLink = attr.sourcePageUrl
    ? `<a href="${escapeHTML(attr.sourcePageUrl)}" target="_blank" rel="noopener noreferrer">掲載元ページを開く</a>`
    : (officialUrl
        ? `<a href="${escapeHTML(officialUrl)}" target="_blank" rel="noopener noreferrer">公式ギャラリーを開く</a>`
        : '—');

  const saNote = attr.shareAlike
    ? `<p class="credits-sa-note">${attr.isAdapted ? 'この切り抜き・加工画像には原写真と同一のライセンス' : 'この写真には上記ライセンス'}（${escapeHTML(attr.license || 'CC BY-SA')}）が適用されます。サイト全体の文章や他の写真とは区別されます。</p>`
    : '';

  return `<article class="credits-photo-item${isAvailable ? '' : ' is-link-only'}"${options.id ? ` id="${escapeHTML(options.id)}"` : ''}>
    <div class="credits-thumb">${thumb}</div>
    <div class="credits-photo-body">
      <div class="credits-photo-head">
        <h4>${escapeHTML(label)}</h4>
        ${sharedLabel ? `<span class="photo-meta-pill">${escapeHTML(sharedLabel)}</span>` : ''}
      </div>
      <dl class="credits-dl">
        <div><dt>撮影・提供元</dt><dd>${escapeHTML(attr.credit || (isAvailable ? '掲載元ページを参照' : '—'))}</dd></div>
        <div><dt>掲載元</dt><dd>${sourceLink}</dd></div>
        <div><dt>ライセンス</dt><dd>${licenseCell}</dd></div>
        <div><dt>年式・市場</dt><dd>${escapeHTML(ym || '各写真の注記・公式ページ参照')}</dd></div>
        <div><dt>画像の加工</dt><dd>${escapeHTML(attr.modification || (isAvailable ? 'Web表示用の参考画像（詳細は掲載元参照）' : '画像未掲載のため該当なし'))}</dd></div>
      </dl>
      ${attr.note ? `<p class="credits-note">${escapeHTML(attr.note)}</p>` : ''}
      ${saNote}
    </div>
  </article>`;
}

function renderSiteMediaSection() {
  const container = $('#site-media-list');
  if (!container) return;

  const items = [];

  for (const [key, exp] of Object.entries(experiences)) {
    items.push(renderAttributionRow(
      `入口（${exp.label}：${exp.name}）`,
      exp.image,
      exp.alt || exp.photo,
      normalizeAttribution(exp.attribution, {
        sourcePageUrl: exp.photoSourceUrl || '',
        note: exp.photo || ''
      }),
      { id: `slot-hero-${key}` }
    ));
  }

  for (const slot of siteMedia) {
    items.push(renderAttributionRow(
      `${slot.section}（${slot.title}）`,
      slot.src,
      slot.alt || slot.caption,
      normalizeAttribution(slot.attribution, {
        note: slot.caption || ''
      }),
      { id: `slot-${slot.slot}` }
    ));
  }

  container.innerHTML = items.join('');
}

function carSearchText(car) {
  const extAttr = getExteriorAttribution(car);
  const views = normalizeInteriorViews(car);
  const scene = modelScenes[car.id];
  const parts = [
    car.name,
    car.brand,
    extAttr.credit,
    extAttr.license,
    extAttr.year,
    extAttr.market,
    extAttr.note,
    scene?.imageAttribution?.credit,
    scene?.imageAttribution?.license
  ];
  for (const v of views) {
    parts.push(v.label, v.attribution.credit, v.attribution.license, v.attribution.year, v.attribution.market, v.attribution.modification, v.note);
  }
  return parts.filter(Boolean).join(' ').toLowerCase().normalize('NFKC');
}

function renderCarMediaSection() {
  const container = $('#car-media-list');
  const countEl = $('#credits-count');
  if (!container) return;

  const query = ($('#credits-filter')?.value || '').trim().toLowerCase().normalize('NFKC');
  const filtered = query ? allCars.filter(car => carSearchText(car).includes(query)) : allCars;

  if (countEl) {
    countEl.textContent = `${filtered.length} / ${allCars.length} 車種を表示`;
  }

  if (!filtered.length) {
    container.innerHTML = '<div class="no-results"><h3>該当する写真情報が見つかりませんでした。</h3><p>車種名やメーカー名、ライセンス名などの条件を変えてお試しください。</p></div>';
    return;
  }

  container.innerHTML = filtered.map(car => {
    const officialUrl = getCarOfficialUrl(car);
    const extAttr = getExteriorAttribution(car);
    const views = normalizeInteriorViews(car);
    const scene = modelScenes[car.id] || null;
    const rows = [];

    if (scene?.image) {
      rows.push(renderAttributionRow(
        '世界観カット',
        scene.image,
        scene.imageAlt || `${car.name}の世界観参考写真`,
        normalizeAttribution(scene.imageAttribution, {
          sourcePageUrl: officialUrl,
          note: `${car.name}の世界観参考写真`
        }),
        { officialUrl }
      ));
    }

    rows.push(renderAttributionRow(
      '外観',
      car.image || '',
      car.imageAlt || `${car.name}の外観参考写真`,
      extAttr,
      { officialUrl }
    ));

    for (const view of views) {
      const sameAsNote = view.sameAs === 'cockpit' ? '運転席全景と同一写真' : '';
      rows.push(renderAttributionRow(
        view.label,
        view.available ? view.src : '',
        view.alt,
        view.attribution,
        { officialUrl: view.officialUrl || officialUrl, sameAsNote }
      ));
    }

    return `<section class="credits-car-group" id="car-${escapeHTML(car.id)}" aria-labelledby="car-heading-${escapeHTML(car.id)}">
      <header class="credits-car-header">
        <div>
          <p class="car-brand">${escapeHTML(car.brand)}</p>
          <h3 id="car-heading-${escapeHTML(car.id)}">${escapeHTML(car.name)}</h3>
        </div>
        ${officialUrl ? `<a class="text-button" href="${escapeHTML(officialUrl)}" target="_blank" rel="noopener noreferrer">メーカー公式ページ</a>` : ''}
      </header>
      <div class="credits-list">${rows.join('')}</div>
    </section>`;
  }).join('');
}

async function loadUpdatedTimestamp() {
  const el = $('#credits-updated');
  if (!el) return;
  try {
    const res = await fetch('content-meta.json');
    if (!res.ok) return;
    const meta = await res.json();
    if (meta?.contentUpdatedAt) el.setAttribute('datetime', meta.contentUpdatedAt);
    if (meta?.label) el.textContent = meta.label;
  } catch {
    el.textContent = '—';
  }
}

async function init() {
  renderSiteMediaSection();
  loadUpdatedTimestamp();

  try {
    const res = await fetch('cars.json');
    if (!res.ok) throw new Error('load failed');
    allCars = await res.json();
    const order = ['def', '250', '300', 'rx', 'q5', 'x3', 'g', 'gx', 'sport', 'gle', 'x5', 'y', 'ix3', 'harrier', 'crown', 'fj'];
    allCars.sort((a, b) => (order.includes(a.id) ? order.indexOf(a.id) : 100) - (order.includes(b.id) ? order.indexOf(b.id) : 100));
    renderCarMediaSection();

    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'auto' });
    }
  } catch {
    const container = $('#car-media-list');
    if (container) {
      container.innerHTML = '<div class="no-results"><h3>写真情報の読み込みに失敗しました。</h3><p>ページを再読み込みしてください。</p></div>';
    }
  }

  $('#credits-filter')?.addEventListener('input', renderCarMediaSection);
}

init();
