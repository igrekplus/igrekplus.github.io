'use strict';

import { experiences, modelScenes, siteMedia } from './experiences.js';
import { createJournalStore } from './journal-store.js';
import { setupAuthUI } from './auth-ui.js';
import { openConfirmDialog, openNoticeDialog } from './confirm-ui.js';
import {
  buildHeroCaptionText,
  getCarOfficialUrl,
  getExteriorAttribution,
  normalizeAttribution,
  normalizeInteriorViews,
  renderPhotoMetaHTML,
  safeExternalUrl
} from './photo-meta.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const store = createJournalStore();
let saved = store.getState();
const state = { cars: [], category: 'all', expanded: false, compare: Array.isArray(saved.compare) ? saved.compare : [], detail: null };
const fuels = { gas:'ガソリン', diesel:'ディーゼル', hev:'HEV', phev:'PHEV', ev:'EV' };
const categories = { adventure:'重厚・冒険', comfort:'上質・快適', digital:'デジタル体験', practical:'家族・暮らし' };
const byId = id => state.cars.find(car => car.id === id);
const selectionFor = car => saved.decisions?.[car.id] || car.selection || {status:'active',note:''};
const isActive = car => !!car && selectionFor(car).status !== 'excluded';
let toastTimer;

const SYNC_MESSAGES = {
  'local-only': { status: 'この端末に保存しています', note: 'この端末に保存します' },
  'local-only-unconfigured': { status: 'この端末に保存しています（端末間同期は準備中です）', note: 'この端末に保存します（端末間同期は準備中）' },
  'signed-out': { status: 'この端末に保存しています', note: 'この端末に保存します' },
  syncing: { status: '同期中…', note: '変更を同期中です' },
  synced: { status: '同期済み', note: '同期済みです' },
  offline: { status: '同期できていない変更があります。時間をおいて再試行してください', note: '変更はこの端末に保持しています。同期は未完了です。' },
  'auth-expired': { status: '再ログインが必要です。変更はこの端末に保持しています', note: '同期を再開するには再ログインが必要です' },
  'auth-error': { status: '再ログインが必要です。変更はこの端末に保持しています', note: '同期を再開するには再ログインが必要です' },
  'sync-error': { status: '同期できませんでした。入力内容を確認するか、バックアップを書き出してください', note: '同期は未完了です。バックアップ（JSON）の書き出しをおすすめします' },
  'validation-error': { status: '保存内容を確認してください。同期は未完了です', note: '同期は未完了です。入力内容を確認してください' },
  error: { status: '同期できませんでした。時間をおいて再試行してください', note: '変更はこの端末に保持しています。同期は未完了です。' },
  'storage-error': { status: 'この端末に保存できません。メモやバックアップを書き出してください', note: 'ブラウザへの保存ができません。メモやバックアップを書き出してください。' }
};
const ERROR_SYNC_MODES = new Set(['offline', 'auth-expired', 'auth-error', 'sync-error', 'validation-error', 'error', 'storage-error']);
const RETRYABLE_SYNC_MODES = new Set(['offline', 'sync-error', 'error']);
const DEFAULT_COST_YEARS = '5';
const VALID_COST_YEARS = new Set(['5', '7', '10']);

function normalizedCostValue(key, costObj) {
  const raw = costObj?.[key];
  if (key === 'years') {
    const str = raw == null ? '' : String(raw).trim();
    return VALID_COST_YEARS.has(str) ? str : DEFAULT_COST_YEARS;
  }
  return raw == null ? '' : String(raw);
}
function updateStorageGuidance() {
  const configured = store.isCloudConfigured();
  const notebookNote = $('#notebook-sync-note');
  if (notebookNote) {
    notebookNote.textContent = configured
      ? '試乗で気づいたことを記録します。同期を設定すると、別の端末からも続けられます。'
      : '試乗で気づいたことをこの端末に保存します。端末間同期は準備中です。別端末へ移す場合は下のバックアップ（JSON）をご利用ください。';
  }
  const guideNote = $('#storage-guide-note');
  if (guideNote) {
    guideNote.textContent = configured
      ? '候補外・比較候補・理由のメモ・試乗メモ・費用入力は、まずこの端末に保存します。メールでの同期を設定すると、別の端末からも続けられます。保存できなかった変更はブラウザに保持し、未保存の表示から再試行できます。以前のChatGPT Sites版のメモは自動では引き継がれないため、試乗メモはコピーして貼り付け、候補や費用はあらためて入力してください。右上の内容更新日時は、車種情報やページ構成を反映した日本時間です。'
      : '候補外・比較候補・理由のメモ・試乗メモ・費用入力は、この端末に保存します（端末間同期は準備中です）。このサイトのバックアップ（JSON）を使うと、同じサイトの別ブラウザへ内容を保存・復元できます。以前のChatGPT Sites版のメモは自動では引き継がれないため、試乗メモはコピーして貼り付け、候補や費用はあらためて入力してください。右上の内容更新日時は、車種情報やページ構成を反映した日本時間です。';
  }
}
function renderSyncStatus(status = {}) {
  const configured = store.isCloudConfigured();
  const mode = status.mode || 'local-only';
  const messageKey = mode === 'local-only' && !configured ? 'local-only-unconfigured' : mode;
  const info = SYNC_MESSAGES[messageKey] || (configured ? SYNC_MESSAGES.error : SYNC_MESSAGES['local-only-unconfigured']);
  const statusEl = $('#sync-status');
  if (statusEl) {
    statusEl.textContent = info.status;
    statusEl.classList.toggle('save-error', ERROR_SYNC_MODES.has(mode));
  }
  const retry = $('#retry-save');
  if (retry) retry.hidden = !configured || !RETRYABLE_SYNC_MODES.has(mode);
  const noteStatus = $('#note-status');
  if (noteStatus) noteStatus.textContent = info.note;
}
function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 3500);
}
function refreshUIFromStore(meta = {}) {
  const isAccountSwitch = meta?.source === 'account-switch';
  saved = store.getState();
  state.compare = Array.isArray(saved.compare)
    ? [...new Set(saved.compare)].filter(id => byId(id) && isActive(byId(id))).slice(0, 3)
    : [];
  renderExclusions(isAccountSwitch); renderCars(); renderDock();
  if ($('#detail-dialog')?.open && state.detail) openDetail(state.detail);
  const notesInput = $('#drive-notes');
  if (notesInput && (isAccountSwitch || document.activeElement !== notesInput)) {
    notesInput.value = typeof saved.notes === 'string' ? saved.notes : '';
  }
  $$('[data-check]').forEach(input => {
    if (isAccountSwitch || document.activeElement !== input) {
      input.checked = Boolean(saved.checks?.[input.dataset.check]);
    }
  });
  costFields.forEach(key => {
    const input = $('#cost-' + key);
    if (input && (isAccountSwitch || document.activeElement !== input)) {
      input.value = normalizedCostValue(key, saved.cost);
    }
  });
  calculateCost();
}

function screenBadge(car) {
  if (car.screenStatus === 'below') return '12型未満・交換要確認';
  if (car.screenStatus === 'unknown') return '中央画面の仕様要確認';
  return '12型以上の対応仕様あり';
}
function priceShort(car) {
  if (car.id === 'fj') return '450万100円';
  if (!car.priceMin) return '公式見積りで確認';
  return car.priceMin.toLocaleString('ja-JP') + '万円〜';
}
function imageMarkup(car, extra = '') {
  return car?.image
    ? `<img src="${escapeHTML(car.image)}" alt="${escapeHTML(car.imageAlt || `${car.name}の参考写真`)}" loading="lazy" ${extra}>`
    : `<div class="image-placeholder">${escapeHTML(car?.name || '')}<small>写真はメーカー公式ギャラリーへ</small></div>`;
}
function fuelTags(car) {
  return `<div class="fuel-row">${car.fuel.map(f => `<span>${fuels[f] || escapeHTML(f)}</span>`).join('')}</div>`;
}
function compareButton(car) {
  const selected = state.compare.includes(car.id);
  return `<button class="add-compare ${selected?'selected':''}" data-toggle-compare="${car.id}" aria-pressed="${selected}" aria-label="${escapeHTML(car.name)}を${selected?'比較から外す':'比較に追加'}">${selected?'✓':'+'}</button>`;
}
function renderCard(car) {
  const scene=modelScenes[car.id];
  return `<article class="car-card" data-experience="${car.category}"><div class="car-photo"><button class="car-image-link" data-detail="${car.id}" aria-label="${escapeHTML(car.name)}の世界を見る">${imageMarkup(car)}</button><span class="photo-badge ${car.screenStatus==='below'?'below':''}">${screenBadge(car)}</span>${compareButton(car)}</div><div class="car-body"><p class="car-brand">${escapeHTML(car.brand)} / ${categories[car.category]}</p><h3>${escapeHTML(car.name)}</h3><p class="car-tagline">${scene?scene.headline.replace(/<br>/g,''):escapeHTML(car.tagline)}</p><div class="car-facts"><div><small>${car.id==='fj'?'発売時・税込':'新車本体・参考'}</small><strong>${priceShort(car)}</strong></div><div><small>中央画面・対応仕様</small><strong>${car.screenSize ? car.screenSize + 'インチ' : '要確認'}</strong></div></div>${fuelTags(car)}<p class="cargo-rating">積載目安 <strong>${escapeHTML(car.cargo?.rating||'要確認')}</strong><small>4人乗車・3列シート車は3列目格納</small></p><div class="card-bottom"><span>${car.id==='fj'?'公式情報を再確認':'原資料の参考値を含みます'}</span><div class="card-actions"><button class="detail-button" data-detail="${car.id}">この車の世界へ</button><button class="exclude-button" data-decision="${car.id}" data-status="excluded">候補から外す</button></div></div></div></article>`;
}
function filteredCars() {
  const query = $('#search').value.trim().toLowerCase().normalize('NFKC');
  const screen = $('#screen-filter').value;
  const fuel = $('#fuel-filter').value;
  const price = $('#price-filter').value;
  return state.cars.filter(car => {
    if (!isActive(car)) return false;
    if (state.category !== 'all' && state.category !== car.category) return false;
    const haystack = `${car.name} ${car.brand} ${car.tagline}`.toLowerCase().normalize('NFKC');
    if (query && !haystack.includes(query)) return false;
    if (screen === 'fit' && !(car.screenSize >= 12)) return false;
    if (screen === 'below' && car.screenStatus !== 'below') return false;
    if (screen === 'unknown' && car.screenStatus !== 'unknown') return false;
    if (fuel !== 'all' && !car.fuel.includes(fuel)) return false;
    if (price !== 'all') {
      if (car.priceMin == null) return false;
      if (price === 'over' ? car.priceMin <= 1000 : car.priceMin > Number(price)) return false;
    }
    return true;
  });
}
function renderCars() {
  const cars = filteredCars();
  $('#result-count').textContent = cars.length;
  const visible = state.expanded ? cars : cars.slice(0,6);
  $('#car-grid').innerHTML = visible.length ? visible.map(renderCard).join('') : '<div class="no-results"><h3>この条件の候補は見つかりませんでした。</h3><p>画面・動力方式・価格の条件を広げてみてください。</p><button class="button outline" data-reset>条件をリセット</button></div>';
  $('#load-more').hidden = state.expanded || cars.length <= 6;
  $('#load-more').textContent = `残り${Math.max(0,cars.length-6)}台の候補を見る`;
  $$('[data-category]').forEach(button => { const active = button.dataset.category === state.category; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); });
  const excludedMatch=excludedMatches();
  $('#excluded-query-note').hidden=!excludedMatch.length;
  $('#excluded-query-note').textContent=excludedMatch.length?excludedMatch.map(c=>c.name).join('・')+'は「候補から外した車」に記録しています。':'';
}
function excludedMatches() {
  const query=$('#search').value.trim().toLowerCase().normalize('NFKC');
  return query?state.cars.filter(c=>!isActive(c)&&`${c.name} ${c.brand}`.toLowerCase().normalize('NFKC').includes(query)):[];
}
function renderExclusions(forceRebuild = false) {
  const excluded=state.cars.filter(c=>!isActive(c));const active=state.cars.filter(isActive);
  $('[data-category="all"] span').textContent=active.length;
  $('#selection-active-count').textContent=active.length;$('#selection-excluded-count').textContent=excluded.length;
  $('#excluded-count').textContent=excluded.length;$('#excluded-history').hidden=!excluded.length;
  const recordsEl=$('#excluded-records');
  const activeNoteInput=document.activeElement?.matches?.('[data-decision-note]')?document.activeElement:null;
  const existingIds=$$('[data-decision-note]',recordsEl).map(el=>el.dataset.decisionNote);
  const nextIds=excluded.map(c=>c.id);
  const sameList=existingIds.length===nextIds.length&&existingIds.every((id,i)=>id===nextIds[i]);
  if(!forceRebuild&&activeNoteInput&&sameList){
    $$('[data-decision-note]',recordsEl).forEach(input=>{
      if(input!==activeNoteInput){
        const car=byId(input.dataset.decisionNote);
        if(car)input.value=selectionFor(car).note||'';
      }
    });
    return;
  }
  recordsEl.innerHTML=excluded.map(c=>{const decision=selectionFor(c);const thumb=c.image?`<img src="${escapeHTML(c.image)}" alt="${escapeHTML(c.imageAlt||`${c.name}の参考写真`)}" loading="lazy">`:`<div class="excluded-image-fallback">${escapeHTML(c.name)}</div>`;return `<article class="excluded-record">${thumb}<div><p class="excluded-record-brand">${escapeHTML(c.brand)} <span class="excluded-badge">候補外</span></p><h3>${escapeHTML(c.name)}</h3><time datetime="${escapeHTML(decision.date||'')}">${escapeHTML((decision.date||'').replaceAll('-','/'))} に候補から外しました</time><label class="exclusion-reason-label">理由のメモ（任意）<input data-decision-note="${c.id}" maxlength="500" value="${escapeHTML(decision.note||'')}" placeholder="例：実車の雰囲気が好みと違った"></label></div><div class="excluded-actions"><button class="text-button" data-detail="${c.id}">写真と情報を見る</button><button class="restore-button" data-decision="${c.id}" data-status="active">再検討に戻す</button></div></article>`;}).join('');
}
function resetFilters() {
  state.category = 'all'; state.expanded = false;
  $('#search').value=''; $('#screen-filter').value='all'; $('#fuel-filter').value='all'; $('#price-filter').value='all';
  renderCars();
}
function renderDock() {
  $$('.compare-count').forEach(el => { el.textContent = state.compare.length; });
  $('#compare-dock').hidden = !state.compare.length;
  $('#dock-cars').innerHTML = state.compare.map(byId).filter(Boolean).map(car => `<div class="dock-chip"><span>${escapeHTML(car.name)}</span><button data-toggle-compare="${car.id}" aria-label="${escapeHTML(car.name)}を比較から外す">×</button></div>`).join('');
  $$('[data-toggle-compare].add-compare').forEach(button => {
    const car=byId(button.dataset.toggleCompare);if(!car)return;
    const selected=state.compare.includes(car.id);
    button.classList.toggle('selected',selected);button.textContent=selected?'✓':'+';button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',car.name+'を'+(selected?'比較から外す':'比較に追加'));
  });
  if ($('#detail-dialog')?.open) updateDetailButton();
  if ($('#compare-dialog')?.open) renderComparison();
}
function persistCompare() {
  saved = { ...saved, compare: state.compare };
  store.patch({ compare: state.compare });
}
function toggleCompare(id) {
  if (!byId(id)) return;
  if(!isActive(byId(id))){toast('この車は候補外として記録しています。');return;}
  if (state.compare.includes(id)) state.compare = state.compare.filter(key => key !== id);
  else {
    if (state.compare.length >= 3) { toast('比較は3台までです。1台外してから追加してください。'); return; }
    state.compare.push(id);
  }
  persistCompare();renderDock();
}
function setDecision(id,status){
  const car=byId(id);if(!car)return;
  const prior=selectionFor(car);
  const decision={status,note:prior.note||'',date:new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Tokyo'})};
  saved={...saved,decisions:{...saved.decisions,[id]:decision}};
  if(status==='excluded')state.compare=state.compare.filter(key=>key!==id);
  saved={...saved,compare:state.compare};
  store.patch({decisions:{[id]:decision},compare:state.compare});
  renderExclusions();renderCars();renderDock();
  if($('#detail-dialog').open)openDetail(id);
  toast(car.name+'を'+(status==='excluded'?'候補外にしました。後で戻せます。':'再検討の候補に戻しました。'));
}
function updateDetailButton() {
  const button = $('#detail-select');
  if(button&&!isActive(byId(state.detail))){button.textContent='候補外として記録済み';button.disabled=true;button.setAttribute('aria-pressed','false');return;}
  if (button) { button.textContent = state.compare.includes(state.detail) ? '比較から外す' : '比較に追加する'; button.setAttribute('aria-pressed',String(state.compare.includes(state.detail))); }
}
function detailPhotos(car) {
  const scene=modelScenes[car.id]||{};
  const photos=[];
  const officialUrl=getCarOfficialUrl(car);
  if(scene.image){
    const sceneAttr=normalizeAttribution(scene.imageAttribution,{
      sourcePageUrl:officialUrl,
      note:`${car.name}の世界観参考写真`
    });
    photos.push({
      key:'scene',
      label:car.id==='q5'?'コックピット':'この車のある時間',
      src:scene.image,
      alt:scene.imageAlt||`${car.name}の参考写真`,
      source:sceneAttr.sourcePageUrl||officialUrl,
      note:sceneAttr.note||'年式・仕様・オプションが購入個体と異なる参考写真',
      attribution:sceneAttr,
      product:false
    });
  }
  if(car.image){
    const extAttr=getExteriorAttribution(car);
    photos.push({
      key:'exterior',
      label:'外観',
      src:car.image,
      alt:car.imageAlt||`${car.name}の外観参考写真`,
      source:extAttr.sourcePageUrl||safeExternalUrl(car.imageCredit||car.source||''),
      note:extAttr.note||car.photoNote||'年式・仕様・オプションが購入個体と異なる参考写真',
      attribution:extAttr,
      product:true
    });
  }
  const hasStructuredViews=Array.isArray(car.interiorViews)&&car.interiorViews.length>0;
  if(hasStructuredViews){
    const views=normalizeInteriorViews(car);
    const cockpitView=views.find(v=>v.key==='cockpit'&&v.available);
    const sharedMonitor=views.find(v=>v.key==='monitor'&&v.available&&v.sameAs==='cockpit'&&cockpitView&&v.src===cockpitView.src);
    views.forEach(view=>{
      if(!view.available||!view.src)return;
      if(sharedMonitor&&view.key==='monitor')return;
      const isSharedCockpit=Boolean(sharedMonitor&&view.key==='cockpit');
      photos.push({
        key:view.key,
        aliases:isSharedCockpit?['monitor','cockpit']:[view.key],
        label:isSharedCockpit?'運転席・モニター':view.label,
        src:view.src,
        alt:view.alt,
        source:view.source,
        note:view.note,
        attribution:view.attribution,
        sameAsNote:isSharedCockpit?'運転席全景で画面も確認できます':'',
        product:true
      });
    });
  }else if(scene.interior||car.interior){
    const src=scene.interior||car.interior;
    if(!photos.some(p=>p.src===src)){
      const intAttr=normalizeAttribution(scene.interiorAttribution,{
        sourcePageUrl:safeExternalUrl(car.interiorCredit||car.source||''),
        note:car.photoNote||'年式・仕様・オプションが購入個体と異なる参考写真'
      });
      photos.push({
        key:'interior',
        label:'室内・画面',
        src,
        alt:scene.interiorAlt||`${car.name}の室内の参考写真`,
        source:intAttr.sourcePageUrl,
        note:intAttr.note,
        attribution:intAttr,
        product:false
      });
    }
  }
  return photos;
}
function renderInteriorGallery(car) {
  const views=normalizeInteriorViews(car);
  if(!views.length)return '';
  const hasAnyPhoto=views.some(v=>v.available);
  const creditsHref=`photo-credits.html#car-${car.id}`;
  return `<section class="interior-review" aria-labelledby="interior-review-title"><div class="interior-review-heading"><div><p class="eyebrow">THREE VIEWS OF THE INTERIOR</p><h3 id="interior-review-title">内装を、3つの視点で。</h3></div><p>${hasAnyPhoto?'写真を選ぶと、大きく表示します。未掲載の視点は公式ギャラリーで確認できます。':'各視点はメーカー公式ギャラリーでご確認いただけます。'}</p></div><div class="interior-view-grid">${views.map(view=>{
    if(view.available){
      const targetKey=view.sameAs==='cockpit'?'cockpit':view.key;
      const sameAsNote=view.sameAs==='cockpit'?'運転席全景と同一写真':'';
      return `<figure class="interior-view"><button data-gallery="${escapeHTML(targetKey)}" aria-label="${escapeHTML(car.name)}の${escapeHTML(view.label)}を大きく見る"><img src="${escapeHTML(view.src)}" alt="${escapeHTML(view.alt)}" loading="lazy"><span>拡大して見る</span></button><figcaption><strong>${escapeHTML(view.label)}</strong><p>${escapeHTML(view.note)}</p>${renderPhotoMetaHTML(view.attribution,{creditsHref,compact:true,sameAsNote})}</figcaption></figure>`;
    }
    return `<article class="interior-view interior-view--link-only"><div class="interior-link-card"><p class="interior-link-eyebrow">${escapeHTML(view.eyebrow)}</p><h4>${escapeHTML(view.linkCardTitle)}</h4><p>${escapeHTML(view.linkCardNote)}</p>${view.officialUrl?`<a class="interior-official-link" href="${escapeHTML(view.officialUrl)}" target="_blank" rel="noopener noreferrer">公式ギャラリーを開く</a>`:''}</div><figcaption><strong>${escapeHTML(view.label)}</strong><p>この視点の写真は未掲載のため、公式ページで最新の仕様をご確認いただけます。</p><div class="photo-meta photo-meta--compact"><div class="photo-meta-links"><a href="${escapeHTML(creditsHref)}">写真の出典・利用条件</a></div></div></figcaption></article>`;
  }).join('')}</div></section>`;
}
function switchDetailPhoto(key) {
  const car=byId(state.detail);if(!car)return;
  const photo=detailPhotos(car).find(p=>p.key===key||p.aliases?.includes(key));if(!photo)return;
  const img=$('#vehicle-photo');if(!img)return;
  img.src=photo.src;img.alt=photo.alt||`${car.name} / ${photo.label}の参考写真`;img.classList.toggle('is-product',Boolean(photo.product));
  $('#vehicle-caption').textContent=buildHeroCaptionText(photo);
  const credit=$('#vehicle-photo-credit');
  if(credit){
    const srcUrl=photo.attribution?.sourcePageUrl||photo.source;
    credit.hidden=!srcUrl;
    if(srcUrl)credit.href=srcUrl;
  }
  const metaEl=$('#vehicle-photo-meta');
  if(metaEl){
    metaEl.innerHTML=renderPhotoMetaHTML(photo.attribution,{
      creditsHref:`photo-credits.html#car-${car.id}`,
      sameAsNote:photo.sameAsNote||''
    });
  }
  $$('[data-gallery]').forEach(button=>{
    const matched=button.dataset.gallery===photo.key||photo.aliases?.includes(button.dataset.gallery);
    button.setAttribute('aria-pressed',String(Boolean(matched)));
  });
  $('#detail-dialog').scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function syncHeroMedia(category) {
  const experience=experiences[category];if(!experience)return;
  const img=$('#experience-image');
  if(img){img.src=experience.image;img.alt=experience.alt||experience.photo;}
  const photoEl=$('#experience-photo');
  if(photoEl){
    const credit=experience.attribution?.credit;
    photoEl.textContent=credit&&!experience.photo.includes(credit)?`${experience.photo}（${credit}）`:experience.photo;
  }
  const creditLink=$('#experience-credit-link');
  if(creditLink)creditLink.href=`photo-credits.html#slot-hero-${category}`;
}
function hydrateSiteMedia() {
  syncHeroMedia($('.experience-hero')?.dataset.experience||'comfort');
  siteMedia.forEach(slot=>{
    const container=document.querySelector(`[data-media-slot="${slot.slot}"]`);
    if(!container)return;
    const img=container.querySelector('img');
    if(img){
      if(slot.src)img.src=slot.src;
      if(slot.alt)img.alt=slot.alt;
    }
    const captionEl=container.querySelector('[data-media-caption]');
    if(captionEl){
      const credit=slot.attribution?.credit;
      const base=slot.caption||'';
      captionEl.textContent=credit&&!base.includes(credit)&&slot.attribution?.license?`${base} / ${credit}`:base;
    }
    const linkEl=container.querySelector('[data-media-credit-link]');
    if(linkEl){
      linkEl.href=`photo-credits.html#slot-${slot.slot}`;
    }
  });
}
function selectExperience(category) {
  const experience=experiences[category];if(!experience)return;
  const hero=$('.experience-hero');hero.dataset.experience=category;hero.style.setProperty('--experience-accent',experience.color);
  syncHeroMedia(category);
  $('#hero-title').innerHTML=experience.title;$('#experience-copy').innerHTML=experience.copy;
  $('#experience-label').textContent=experience.label+' / '+experience.name;
  $('#experience-link').href='#'+experience.anchor;
  $$('[data-experience-select]').forEach(button=>{const active=button.dataset.experienceSelect===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  $('#experience-status').textContent=experience.name+' の写真と見せ方に切り替えました。';
  hero.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function openDetail(id) {
  const car = byId(id);if(!car)return;
  state.detail = id;
  const checks = car.checks.length ? `<ul>${car.checks.map(s=>`<li><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.label)}</a>（${escapeHTML(s.date)}）</li>`).join('')}</ul>` : '<p>この車の数値は元資料から引き継いだ参考情報です。今回、最新価格・全装備の再検証はしていません。</p>';
  const scene=modelScenes[id]||{english:car.name,headline:escapeHTML(car.tagline),scene:car.why,facets:[],accent:'#c4b38b'};
  const photos=detailPhotos(car);const first=photos[0]||null;
  const officialUrl=getCarOfficialUrl(car);
  const creditsHref=`photo-credits.html#car-${car.id}`;
  const neighbours=state.cars.filter(c=>isActive(c)&&c.category===car.category&&c.id!==car.id).slice(0,3);
  const heroFigureHTML=first
    ? `<figure class="vehicle-photo"><img id="vehicle-photo" src="${escapeHTML(first.src)}" class="${first.product?'is-product':''}" alt="${escapeHTML(first.alt||`${car.name} / ${first.label}の参考写真`)}"><figcaption id="vehicle-caption">${escapeHTML(buildHeroCaptionText(first))}</figcaption><a id="vehicle-photo-credit" class="vehicle-photo-credit" href="${escapeHTML(first.attribution?.sourcePageUrl||first.source||officialUrl)}" target="_blank" rel="noopener noreferrer" ${(first.attribution?.sourcePageUrl||first.source)?'':'hidden'}>写真の掲載元</a></figure>`
    : `<div class="vehicle-photo vehicle-photo--empty"><div class="vehicle-photo-empty"><p class="interior-link-eyebrow">OFFICIAL GALLERY</p><h3>${escapeHTML(car.name)}の写真を公式ページで見る</h3><p>掲載写真がないため、メーカー公式ギャラリーで最新の外観・内装をご確認いただけます。</p>${officialUrl?`<a class="interior-official-link" href="${escapeHTML(officialUrl)}" target="_blank" rel="noopener noreferrer">メーカー公式ギャラリーを開く</a>`:''}</div></div>`;
  const galleryBarHTML=photos.length
    ? `<div class="vehicle-gallery"><div class="gallery-choices" role="group" aria-label="${escapeHTML(car.name)}の写真を切り替える">${photos.map((photo,index)=>`<button data-gallery="${escapeHTML(photo.key)}" aria-pressed="${index===0}">${escapeHTML(photo.label)}</button>`).join('')}</div><p>PHOTO JOURNAL / ${photos.length} VIEWS</p></div><div class="vehicle-photo-meta" id="vehicle-photo-meta">${renderPhotoMetaHTML(first.attribution,{creditsHref,sameAsNote:first.sameAsNote||''})}</div>`
    : `<div class="vehicle-photo-meta" id="vehicle-photo-meta"><div class="photo-meta"><div class="photo-meta-links"><a href="${escapeHTML(creditsHref)}">写真の出典・利用条件</a></div></div></div>`;
  $('#detail-content').innerHTML = `<div class="vehicle-scene" data-experience="${car.category}" style="--vehicle-accent:${scene.accent}"><div class="vehicle-scene-text"><p class="world-kicker">${experiences[car.category].label}</p><span>${escapeHTML(scene.english)}</span><h2 id="detail-title">${scene.headline}</h2><p class="vehicle-prologue">${escapeHTML(scene.scene)}</p></div>${heroFigureHTML}</div>${galleryBarHTML}<div class="detail-copy">${renderInteriorGallery(car)}<div class="vehicle-facets">${scene.facets.map(f=>`<span>${escapeHTML(f)}</span>`).join('')}</div><div class="vehicle-title-row"><div><h3>${escapeHTML(car.name)}${!isActive(car)?' <span class="excluded-badge">候補外</span>':''}</h3>${!isActive(car)?`<p class="excluded-detail-note">${escapeHTML(selectionFor(car).note||'候補外として記録しています。')}（${escapeHTML(selectionFor(car).date||'')}）</p>`:''}<p class="vehicle-interpretation">過ごし方や魅力の記述は、編集上の解釈・提案です。</p></div><div class="detail-decision-actions"><button class="button accent" id="detail-select" data-toggle-compare="${car.id}"></button><button class="button outline" data-decision="${car.id}" data-status="${isActive(car)?'excluded':'active'}">${isActive(car)?'候補から外す':'再検討に戻す'}</button></div></div>${fuelTags(car)}<div class="detail-facts"><div><span>${car.id==='fj'?'発売時のメーカー希望小売価格':'新車本体価格・原資料の参考値'}</span><strong>${escapeHTML(car.price)}</strong><small>${car.id==='fj'?'2026.05.14の国内VX・諸費用等は別':'2026.11.22版の目安／中古の価格ではありません'}</small></div><div><span>中央のナビ・操作画面</span><strong>${escapeHTML(car.screen)}</strong><small>${screenBadge(car)}／購入個体の年式・装備を確認</small></div></div><div class="cargo-detail"><div><span>積載目安</span><strong>${escapeHTML(car.cargo?.rating||'要確認')}</strong><small>4人乗車・3列シート車は3列目格納</small></div><p>${escapeHTML(car.cargo?.note||'')}<small>荷室構成と車格から整理した編集上の目安です。容量の実測値ではありません。</small><a href="${escapeHTML(car.cargo?.source||car.source)}" target="_blank" rel="noopener noreferrer">メーカーの車両情報を確認</a></p></div><div class="detail-why"><div><h3>この条件で比較したい理由 <small>編集上の解釈</small></h3><p>${escapeHTML(car.why)}</p></div><div class="risk"><h3>購入前に確かめること</h3><p>${escapeHTML(car.risk)}</p></div></div><div class="detail-source"><div class="source-actions">${officialUrl?`<a href="${escapeHTML(officialUrl)}" target="_blank" rel="noopener noreferrer">メーカー公式</a>`:''}${car.imageCredit?`<a href="${escapeHTML(car.imageCredit)}" target="_blank" rel="noopener noreferrer">外観写真の掲載元</a>`:''}${car.interiorCredit?`<a href="${escapeHTML(car.interiorCredit)}" target="_blank" rel="noopener noreferrer">室内写真の掲載元</a>`:''}<a href="${escapeHTML(creditsHref)}">写真の出典・利用条件</a><a href="#sources" data-detail-sources>情報の出典一覧</a></div><p>${escapeHTML(car.photoNote)}</p><p style="margin-top:12px"><strong>今回の再確認範囲</strong></p>${checks}<p>動力方式の補足：${escapeHTML(car.fuelNote)}。MHEVは電動補助付きのガソリン／ディーゼルで、HEV・PHEVとは区別しています。</p></div><div class="vehicle-neighbours"><span>こちらの世界も</span>${neighbours.map(c=>`<button data-detail="${c.id}">${escapeHTML(c.name)}</button>`).join('')}</div></div>`;
  updateDetailButton();
  $('#detail-dialog').setAttribute('aria-labelledby','detail-title');
  if(!$('#detail-dialog').open)$('#detail-dialog').showModal();
  $('#detail-dialog').scrollTop = 0;
}
function renderComparison() {
  const cars = state.compare.map(byId).filter(Boolean);
  if(!cars.length){$('#compare-content').innerHTML='<div class="compare-empty"><h3>気になる車を追加してください。</h3><p>車種カードの「＋」から、最大3台を並べられます。</p><button class="button outline" data-close-compare style="margin-top:22px">候補に戻る</button></div>';return;}
  const rows = [
    ['新車本体・参考', car => escapeHTML(car.price) + '<br><small>'+(car.id==='fj'?'発売時の公式価格':'原資料 2026.11.22')+'</small>'],
    ['積載目安', car => `<strong>${escapeHTML(car.cargo?.rating||'要確認')}</strong><br><small>4人乗車・3列シート車は3列目格納</small><p>${escapeHTML(car.cargo?.note||'')}</p>`],
    ['中央画面', car => escapeHTML(car.screen) + '<br><small>' + screenBadge(car) + '</small>'],
    ['動力方式', car => car.fuel.map(f=>fuels[f]).join(' / ')+'<br><small>'+escapeHTML(car.fuelNote)+'</small>'],
    ['比較したい理由', car => escapeHTML(car.why)],
    ['確認したい点', car => escapeHTML(car.risk)],
    ['今回の再確認', car => car.checks.length ? car.checks.map(s=>`<a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.label)}</a>`).join('<br>') : '元資料から引継ぎ。最新価格・装備は要確認です。'],
    ['公式情報', car => car.source ? `<a href="${escapeHTML(car.source)}" target="_blank" rel="noopener noreferrer">メーカー公式で確認</a>` : '要確認']
  ];
  $('#compare-content').innerHTML = `<div class="comparison-scroll"><table class="comparison"><thead><tr><th scope="col">比較する候補</th>${cars.map(car=>`<th scope="col">${imageMarkup(car)}<span>${escapeHTML(car.brand)}</span><h3>${escapeHTML(car.name)}</h3><button class="remove-one" data-toggle-compare="${car.id}">比較から外す</button></th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn])=>`<tr><th scope="row">${label}</th>${cars.map(car=>`<td>${fn(car)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="compare-help">横にスクロールできます。価格は中古の支払総額ではありません。画面は年式・グレード・装着オプションで変わります。魅力の記述は購入条件に合わせた編集上の解釈です。</p>`;
}
function renderFocus() {
  const focus = {
    '250':{label:'LAND CRUISER 250',heading:'道具らしさと、実用を軸に。',description:'250の四角い外観や使い方に惹かれるなら、まず実車で乗り心地を確かめます。',points:[['中央画面','対応仕様12.3型を公式確認'],['試すこと','いつもの道での扱いやすさ'],['比べること','300との差に追加で払いたいか']]},
    '300':{label:'LAND CRUISER 300',heading:'余裕に、価格差を感じるか。',description:'大きさだけで選ばず、加速の余裕と室内の居心地を250と同じ条件で比べます。',points:[['改良情報','2026年10月発売でHEV追加'],['中央画面','12.3型の装着有無を確認'],['試すこと','乗り心地・後席・エンジンの余裕']]},
    'fj':{label:'LAND CRUISER FJ',heading:'小さく使う、別の答え。',description:'最新のFJシリーズも比較に追加。旧FJクルーザーとの違いに注意して見ます。',points:[['発売時価格','450万100円／国内VX・税込'],['中央画面','国内VXは12.3型'],['試すこと','4人乗車時の荷室と取り回し']]}
  };
  $('#focus-grid').innerHTML = Object.entries(focus).map(([id,f])=>{const car=byId(id);return `<article class="focus-car"><div class="focus-photo">${imageMarkup(car)}</div><div class="focus-body"><p class="eyebrow">${f.label}</p><h3>${f.heading}</h3><p>${f.description}</p><dl>${f.points.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><button data-detail="${id}">仕様と確認点を見る</button></div></article>`;}).join('');
}

const costFields = ['buy','sale','annual','parking','years','repairs'];
function costValues() {
  const values={};for(const key of costFields){const input=$('#cost-'+key);values[key]=Math.max(0,Number(input.value)||0);}return values;
}
function calculateCost() {
  const v=costValues();
  if($('#cost-buy').value === ''){$('#cost-total').innerHTML='—<small>万円</small>';$('#cost-monthly').textContent='購入支払総額を入力すると計算します。';return null;}
  if (costFields.some(key=>!$('#cost-'+key).validity.valid)) { $('#cost-total').innerHTML='—<small>万円</small>';$('#cost-monthly').textContent='0以上の金額を入力してください。';return null; }
  const total=v.buy-v.sale+(v.annual+v.parking*12)*v.years+v.repairs;
  if(total<0){$('#cost-total').innerHTML='—<small>万円</small>';$('#cost-monthly').textContent='想定売却額が費用合計を上回っています。入力を確認してください。';return null;}
  $('#cost-total').innerHTML=total.toLocaleString('ja-JP',{maximumFractionDigits:1})+'<small>万円</small>';
  $('#cost-monthly').textContent=`${v.years}年間の合計 ／ 月あたり約${(total/v.years/12).toLocaleString('ja-JP',{maximumFractionDigits:2})}万円`;
  return {...v,total};
}
function setupNotes() {
  $('#drive-notes').value=typeof saved.notes==='string'?saved.notes:'';
  $('#drive-notes').maxLength=12000;
  $$('[data-check]').forEach(input=>{
    input.checked=Boolean(saved.checks?.[input.dataset.check]);
    input.onchange=()=>{
      saved={...saved,checks:{...saved.checks,[input.dataset.check]:input.checked}};
      store.patch({checks:{[input.dataset.check]:input.checked}});
    };
  });
  $('#drive-notes').oninput=()=>{
    saved={...saved,notes:$('#drive-notes').value};
    store.patch({notes:$('#drive-notes').value});
  };
  costFields.forEach(key=>{
    const input=$('#cost-'+key);
    input.value=normalizedCostValue(key, saved.cost);
    input.oninput=()=>{
      const value=$('#cost-'+key).value;
      saved={...saved,cost:{...saved.cost,[key]:value}};
      store.patch({cost:{[key]:value}});
      calculateCost();
    };
  });
  calculateCost();
}
function exportNotes() {
  const cost=calculateCost();
  const lines=['DRIVE THE POSSIBILITY / 車選びメモ',new Date().toLocaleString('ja-JP',{timeZone:'Asia/Tokyo'}),'', '比較候補',...state.compare.map(byId).filter(Boolean).map(car=>'・'+car.name),'','候補外の記録',...state.cars.filter(car=>!isActive(car)).map(car=>'・'+car.name+' / '+(selectionFor(car).date||'')+' / '+(selectionFor(car).note||'理由のメモなし')),'','試乗チェック',...$$('[data-check]').map(input=>(input.checked?'[済] ':'[ ] ')+input.nextElementSibling.textContent),'','試乗メモ',$('#drive-notes').value,'','費用入力（万円）',...costFields.map(key=>`${$('#cost-'+key).parentElement.firstChild.textContent.trim()}: ${$('#cost-'+key).value||'未入力'}`),cost?`実質負担: ${cost.total.toFixed(1)}万円`:'費用計算: 未入力または要確認','','価格・装備は参考値を含みます。最新の見積書・公式仕様を確認してください。'];
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='車選びメモ.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('車選びメモを書き出しました。');
}
function exportBackup() {
  const json = store.exportJSON();
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='car-journal-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('バックアップ（JSON）を書き出しました。');
}
let importingBackup = false;
async function importBackup(file) {
  if (importingBackup) return;
  importingBackup = true;
  try {
    const confirmed = await openConfirmDialog({
      eyebrow: 'RESTORE BACKUP',
      title: 'バックアップ（JSON）を読み込む',
      message: `選択したファイル「${file.name}」の内容を、現在の車選びメモへ取り込みます。`,
      points: [
        '対象：試乗メモ・比較候補・候補外設定・試乗チェック・費用メモ',
        '取り込み方針：ファイルに含まれる項目は現在の内容へ上書きで反映されます（このサイトで書き出したJSONバックアップ専用です）',
        'キャンセルすると、現在のメモや候補状態は変更されません'
      ],
      confirmLabel: '読み込む',
      cancelLabel: 'キャンセル',
      returnFocusTo: $('#export-backup')
    });
    if (!confirmed) return;
    let text;
    try {
      text = await file.text();
    } catch {
      await openNoticeDialog({
        eyebrow: 'IMPORT FAILED',
        title: 'バックアップを読み込めませんでした',
        message: 'ファイルを読み取れませんでした。もう一度ファイルを選び直してください。',
        returnFocusTo: $('#export-backup')
      });
      return;
    }
    const result = store.importJSON(text);
    if (result?.ok) {
      const syncMode = store.getSyncStatus()?.mode;
      if (syncMode === 'storage-error') {
        toast('バックアップを画面へ反映しましたが、この端末に保存できませんでした。');
      } else if (syncMode === 'auth-expired') {
        toast('バックアップを取り込みました。同期するには再ログインが必要です。');
      } else {
        toast('バックアップを取り込みました。');
      }
    } else {
      const details = Array.isArray(result?.errors) && result.errors.length
        ? result.errors
        : ['バックアップファイルの内容を確認してください。'];
      await openNoticeDialog({
        eyebrow: 'IMPORT FAILED',
        title: 'バックアップを読み込めませんでした',
        message: 'ファイルの内容を確認のうえ、このサイトで書き出したJSONバックアップを選んでください。',
        points: details,
        returnFocusTo: $('#export-backup')
      });
    }
  } finally {
    importingBackup = false;
  }
}

document.addEventListener('click',event=>{
  if(event.target.closest('[data-detail-sources]'))$('#detail-dialog').close();
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.experienceSelect)selectExperience(button.dataset.experienceSelect);
  if(button.dataset.explore){resetFilters();state.category=button.dataset.explore;renderCars();$('#garage').scrollIntoView({behavior:'smooth'});}
  if(button.dataset.gallery)switchDetailPhoto(button.dataset.gallery);
  if(button.dataset.decision)setDecision(button.dataset.decision,button.dataset.status);
  if(button.dataset.category){state.category=button.dataset.category;state.expanded=false;renderCars();}
  if(button.dataset.detail)openDetail(button.dataset.detail);
  if(button.dataset.toggleCompare)toggleCompare(button.dataset.toggleCompare);
  if(button.hasAttribute('data-open-compare')){renderComparison();$('#compare-dialog').showModal();}
  if(button.classList.contains('close-dialog'))button.closest('dialog').close();
  if(button.hasAttribute('data-close-compare'))$('#compare-dialog').close();
  if(button.hasAttribute('data-reset'))resetFilters();
});
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}}));
$('#reset-filters').addEventListener('click',resetFilters);
['search','screen-filter','fuel-filter','price-filter'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',()=>{state.expanded=false;renderCars();}));
$('#load-more').addEventListener('click',()=>{state.expanded=true;renderCars();});
$('#clear-compare').addEventListener('click',()=>{state.compare=[];persistCompare();renderDock();});
$('#compare-landcruiser').addEventListener('click',()=>{state.compare=['250','300','fj'].filter(id=>isActive(byId(id)));persistCompare();renderDock();renderComparison();$('#compare-dialog').showModal();});
$('#find-large-screen').addEventListener('click',()=>{resetFilters();$('#screen-filter').value='fit';renderCars();$('#garage').scrollIntoView({behavior:'smooth'});});
$('#export-notes').addEventListener('click',exportNotes);
$('#export-backup')?.addEventListener('click',exportBackup);
$('#import-backup-input')?.addEventListener('change',event=>{
  const file=event.target.files?.[0];event.target.value='';
  if(file)importBackup(file);
});
let wasExpanded;
window.addEventListener('beforeprint',()=>{wasExpanded=state.expanded;state.expanded=true;renderCars();});
window.addEventListener('afterprint',()=>{state.expanded=wasExpanded??false;renderCars();});
$('#print-page').addEventListener('click',()=>window.print());

document.addEventListener('input',event=>{
  const input=event.target.closest('[data-decision-note]');if(!input)return;
  const car=byId(input.dataset.decisionNote);if(!car)return;
  const decision={...selectionFor(car),note:input.value};
  saved={...saved,decisions:{...saved.decisions,[car.id]:decision}};
  store.patch({decisions:{[car.id]:decision}});
});
$('#retry-save').addEventListener('click',()=>store.retry());

async function init() {
  try {
    const response=await fetch('cars.json');if(!response.ok)throw new Error('load');
    state.cars=await response.json();
    store.subscribe((_newState, meta) => { if (meta?.source !== 'local-patch') refreshUIFromStore(meta); });
    store.onSyncStatusChange(renderSyncStatus);
    updateStorageGuidance();
    await store.init();
    saved = store.getState();
    renderSyncStatus(store.getSyncStatus());
    state.compare=Array.isArray(saved.compare)?saved.compare:[];
    const order=['def','250','300','rx','q5','x3','g','gx','sport','gle','x5','y','ix3','harrier','crown','fj'];
    state.cars.sort((a,b)=>(order.includes(a.id)?order.indexOf(a.id):100)-(order.includes(b.id)?order.indexOf(b.id):100));
    state.compare=[...new Set(state.compare)].filter(id=>byId(id)&&isActive(byId(id))).slice(0,3);
    renderExclusions();
    renderCars();renderFocus();renderDock();setupNotes();
    hydrateSiteMedia();
    setupAuthUI(store, {
      toggleButton: $('#storage-signin'),
      dialog: $('#auth-dialog'),
      form: $('#auth-form'),
      emailInput: $('#auth-email'),
      formStatus: $('#auth-form-status'),
      signedInBox: $('#auth-signed-in'),
      currentEmail: $('#auth-current-email'),
      importAnonButton: $('#auth-import-anon'),
      signOutButton: $('#auth-sign-out'),
      closeButtons: $$('#auth-dialog .close-dialog')
    });
  } catch {
    $('#car-grid').innerHTML='<div class="no-results"><h3>候補の読み込みに失敗しました。</h3><p>通信環境を確認し、ページを再読み込みしてください。</p><button class="button outline" id="retry-load">もう一度読み込む</button></div>';
    $('#load-more').hidden=true;$('#retry-load').addEventListener('click',init);
  }
}
init();
window.addEventListener('online',()=>store.retry());
window.addEventListener('pagehide',()=>store.retry());
