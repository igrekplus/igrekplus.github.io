'use strict';

export const INTERIOR_VIEW_ORDER = ['monitor', 'cockpit', 'rear'];

export const VIEW_DEFAULTS = {
  monitor: {
    key: 'monitor',
    label: 'モニター',
    sharedWithCockpitLabel: '運転席全景で画面を確認',
    eyebrow: 'CENTER DISPLAY',
    fallbackTitle: '中央画面の表示を公式ギャラリーで見る',
    fallbackNote: 'この視点の掲載写真がないため、メーカー公式ページで最新の画面や表示をご確認いただけます。'
  },
  cockpit: {
    key: 'cockpit',
    label: '運転席・コックピット',
    eyebrow: 'COCKPIT VIEW',
    fallbackTitle: '運転席まわりを公式ギャラリーで見る',
    fallbackNote: 'この視点の掲載写真がないため、メーカー公式ページで運転席まわりの雰囲気をご確認いただけます。'
  },
  rear: {
    key: 'rear',
    label: '後席・シート空間',
    eyebrow: 'REAR SEATS',
    fallbackTitle: 'この仕様の後席を公式ギャラリーで見る',
    fallbackNote: 'この視点の掲載写真がないため、メーカー公式ページで後席やシート空間をご確認いただけます。'
  }
};

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

export function safeExternalUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '';
  } catch {
    return '';
  }
}

export function isShareAlikeLicense(license = '', licenseUrl = '') {
  return /by-sa|sharealike/i.test(`${license} ${licenseUrl}`);
}

export function normalizeAttribution(raw, fallback = {}) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const license = String(src.license ?? fallback.license ?? '').trim();
  const licenseUrl = safeExternalUrl(src.licenseUrl ?? src.usageTermsUrl ?? fallback.licenseUrl ?? '');
  const shareAlike = typeof src.shareAlike === 'boolean'
    ? src.shareAlike
    : isShareAlikeLicense(license, licenseUrl);
  const modification = String(src.modification ?? src.adaptationNote ?? fallback.modification ?? '').trim();
  const isAdapted = typeof src.isAdapted === 'boolean'
    ? src.isAdapted
    : Boolean(modification && !/^(原本のまま|改変なし|加工なし)/.test(modification));

  return {
    credit: String(src.credit ?? src.providerCredit ?? fallback.credit ?? '').trim(),
    sourcePageUrl: safeExternalUrl(src.sourcePageUrl ?? src.source ?? fallback.sourcePageUrl ?? ''),
    license,
    licenseUrl,
    shareAlike,
    year: String(src.year ?? src.modelYear ?? fallback.year ?? '').trim(),
    market: String(src.market ?? fallback.market ?? '').trim(),
    modification,
    isAdapted,
    note: String(src.note ?? fallback.note ?? '').trim()
  };
}

export function formatYearMarket(attribution) {
  if (!attribution) return '';
  const parts = [];
  if (attribution.year && attribution.year !== '不明') parts.push(attribution.year);
  if (attribution.market && attribution.market !== '不明') parts.push(attribution.market);
  return parts.join(' / ');
}

export function getCarOfficialUrl(car, view = null) {
  return safeExternalUrl(
    view?.officialUrl ||
    view?.fallbackOfficialUrl ||
    view?.source ||
    car?.official_product_url ||
    car?.officialProductUrl ||
    car?.source ||
    ''
  );
}

export function getExteriorAttribution(car) {
  return normalizeAttribution(car?.imageAttribution, {
    sourcePageUrl: car?.imageCredit || car?.source || '',
    note: car?.photoNote || ''
  });
}

export function normalizeInteriorViews(car) {
  const rawViews = Array.isArray(car?.interiorViews) ? car.interiorViews : [];
  const byKey = new Map();
  for (const item of rawViews) {
    if (item && typeof item === 'object' && item.key) {
      byKey.set(item.key, item);
    }
  }

  const orderedKeys = [...INTERIOR_VIEW_ORDER];
  for (const item of rawViews) {
    if (item?.key && !orderedKeys.includes(item.key)) {
      orderedKeys.push(item.key);
    }
  }

  const cockpitRaw = byKey.get('cockpit');
  const cockpitSrc = typeof cockpitRaw?.src === 'string' ? cockpitRaw.src.trim() : '';

  return orderedKeys.map(key => {
    const defaults = VIEW_DEFAULTS[key] || {
      key,
      label: key,
      eyebrow: 'INTERIOR VIEW',
      fallbackTitle: '内装の詳細を公式ギャラリーで見る',
      fallbackNote: 'この視点の掲載写真がないため、メーカー公式ページで最新の内装をご確認いただけます。'
    };
    const raw = byKey.get(key) || { key };
    const src = raw.status === 'link_only' ? '' : String(raw.src ?? '').trim();
    const attribution = normalizeAttribution(raw.attribution, {
      sourcePageUrl: raw.source || car?.source || '',
      note: raw.note || ''
    });

    const isSameAsCockpit = key === 'monitor' && Boolean(
      raw.sameAs === 'cockpit' ||
      raw.sharedWith === 'cockpit' ||
      (src && cockpitSrc && src === cockpitSrc && !attribution.isAdapted)
    );

    const rawLabel = String(raw.label ?? '').trim();
    const label = isSameAsCockpit
      ? (!rawLabel || rawLabel === defaults.label ? defaults.sharedWithCockpitLabel : rawLabel)
      : (rawLabel || defaults.label);

    const available = Boolean(src);
    const officialUrl = getCarOfficialUrl(car, raw);
    const note = available
      ? (attribution.note || raw.note || '年式・仕様・オプションにより購入個体と異なる場合があります。')
      : (String(raw.linkCardNote ?? '').trim() || defaults.fallbackNote);

    const alt = String(raw.alt ?? '').trim() ||
      (car?.name ? `${car.name}の${label}の参考写真` : `${label}の参考写真`);

    return {
      key,
      label,
      eyebrow: defaults.eyebrow,
      src,
      alt,
      available,
      sameAs: isSameAsCockpit ? 'cockpit' : (raw.sameAs || ''),
      source: attribution.sourcePageUrl || safeExternalUrl(raw.source || ''),
      officialUrl,
      linkCardTitle: String(raw.linkCardTitle ?? '').trim() || defaults.fallbackTitle,
      linkCardNote: note,
      note,
      attribution
    };
  });
}

export function buildHeroCaptionText(photo) {
  if (!photo) return '';
  const parts = [photo.label];
  const ym = formatYearMarket(photo.attribution);
  if (ym) parts.push(ym);
  const note = photo.attribution?.note || photo.note || '年式・仕様・オプションが購入個体と異なる参考写真';
  if (note) parts.push(note);
  return parts.filter(Boolean).join(' / ');
}

export function renderPhotoMetaHTML(attribution, {
  creditsHref = 'photo-credits.html',
  compact = false,
  sameAsNote = ''
} = {}) {
  const attr = normalizeAttribution(attribution);
  const items = [];

  if (sameAsNote) {
    items.push(`<span class="photo-meta-pill">${escapeHTML(sameAsNote)}</span>`);
  }

  const ym = formatYearMarket(attr);
  if (ym) {
    items.push(`<span class="photo-meta-item"><span class="photo-meta-key">年式・市場</span>${escapeHTML(ym)}</span>`);
  }

  if (attr.credit) {
    items.push(`<span class="photo-meta-item"><span class="photo-meta-key">提供・撮影</span>${escapeHTML(attr.credit)}</span>`);
  }

  if (attr.license) {
    const licenseDisplay = attr.licenseUrl
      ? `<a href="${escapeHTML(attr.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(attr.license)}</a>`
      : escapeHTML(attr.license);
    items.push(`<span class="photo-meta-item"><span class="photo-meta-key">利用条件</span>${licenseDisplay}</span>`);
  }

  if (attr.modification) {
    items.push(`<span class="photo-meta-item"><span class="photo-meta-key">加工</span>${escapeHTML(attr.modification)}</span>`);
  }

  const shareAlikeNotice = attr.shareAlike
    ? `<p class="photo-meta-sa">${attr.isAdapted ? 'この切り抜き・加工画像には原写真と同一のライセンス' : 'この写真には上記ライセンス'}（${escapeHTML(attr.license || 'CC BY-SA')}）が適用されます（サイト全体の文章・構成とは別扱いです）。</p>`
    : '';

  const links = [];
  if (attr.sourcePageUrl) {
    links.push(`<a href="${escapeHTML(attr.sourcePageUrl)}" target="_blank" rel="noopener noreferrer">写真の掲載元</a>`);
  }
  if (creditsHref) {
    links.push(`<a href="${escapeHTML(creditsHref)}">写真の出典・利用条件</a>`);
  }

  return `<div class="photo-meta${compact ? ' photo-meta--compact' : ''}">` +
    (items.length ? `<div class="photo-meta-list">${items.join('')}</div>` : '') +
    shareAlikeNotice +
    (links.length ? `<div class="photo-meta-links">${links.join('')}</div>` : '') +
    `</div>`;
}
