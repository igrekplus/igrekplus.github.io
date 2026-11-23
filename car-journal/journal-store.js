'use strict';

// 端末内保存とSupabase任意同期を扱う、独立した小さな保存モジュール。
// UIからはDI可能なcreateJournalStore()経由でのみ利用する。

export const CAR_IDS = [
  'g', 'def', '250', 'gx', 'gle', 'rx', 'x5', 'sport', 'q5', 'y', 'x3', 'ix3',
  'harrier', 'crown', 'noah', 'forester', 'glc', 'gls', '300', 'nx', 'lx',
  'velar', 'cayenne', 'volvo', 'serena', 'zr', 'fj'
];
export const CHECK_KEYS = ['seat', 'screen', 'luggage', 'road', 'quote'];
export const COST_KEYS = ['buy', 'sale', 'annual', 'parking', 'years', 'repairs'];

const PREFIX = 'car-journal-v1';
const WHOLE_KEYS = ['notes', 'compare'];
const ITEM_KEYS = ['decisions', 'checks', 'cost'];
const MAX_NOTE_LENGTH = 12000;
const MAX_REASON_LENGTH = 500;
const MAX_COST_LENGTH = 40;
const MAX_BACKUP_BYTES = 300000;

const CAR_ID_SET = new Set(CAR_IDS);
const CHECK_KEY_SET = new Set(CHECK_KEYS);
const COST_KEY_SET = new Set(COST_KEYS);
const TOP_KEY_SET = new Set([...WHOLE_KEYS, ...ITEM_KEYS]);
const DECISION_KEY_SET = new Set(['status', 'note', 'date']);
const BACKUP_KEY_SET = new Set(['version', 'exportedAt', 'state']);
const COST_NUM_RE = /^(?:\d+(?:\.\d+)?|\.\d+)$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const STORAGE_ERROR_MESSAGE = 'この端末への保存ができません。メモを書き出して保管してください。';
const SAFE_SYNC_MESSAGES = {
  offline: '同期できませんでした。通信環境を確認して再試行してください。',
  'auth-expired': 'ログインの有効期限が切れました。もう一度ログインして同期を再開してください。',
  'invalid-data': '一部の入力内容を確認できないため同期を保留しています。内容を見直すか、メモを書き出して保管してください。',
  'config-error': '現在は同期を利用できません。この端末への保存とメモの書き出しは利用できます。'
};

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isValidCostValue(value) {
  if (typeof value !== 'string' || value.length > MAX_COST_LENGTH) return false;
  if (value === '') return true;
  if (!COST_NUM_RE.test(value)) return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}

function isValidRealIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE_RE.test(value)) return false;
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function dedupeCompare(list) {
  const out = [];
  for (const id of list) {
    if (typeof id === 'string' && CAR_ID_SET.has(id) && !out.includes(id)) {
      out.push(id);
      if (out.length >= 3) break;
    }
  }
  return out;
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

export function emptyState() {
  return { notes: '', compare: [], decisions: {}, checks: {}, cost: {} };
}

function sanitizePartial(raw) {
  if (!isPlainObject(raw)) return {};
  const out = {};
  if (hasOwn(raw, 'notes') && typeof raw.notes === 'string' && raw.notes.length <= MAX_NOTE_LENGTH) {
    out.notes = raw.notes;
  }
  if (hasOwn(raw, 'compare') && Array.isArray(raw.compare)) {
    out.compare = dedupeCompare(raw.compare);
  }
  if (hasOwn(raw, 'decisions') && isPlainObject(raw.decisions)) {
    const decisions = {};
    for (const id of Object.keys(raw.decisions)) {
      if (!CAR_ID_SET.has(id)) continue;
      const d = raw.decisions[id];
      if (!isPlainObject(d) || (d.status !== 'active' && d.status !== 'excluded')) continue;
      const clean = { status: d.status };
      if (hasOwn(d, 'note') && typeof d.note === 'string' && d.note.length <= MAX_REASON_LENGTH) {
        clean.note = d.note;
      }
      if (hasOwn(d, 'date') && isValidRealIsoDate(d.date)) {
        clean.date = d.date;
      }
      decisions[id] = clean;
    }
    out.decisions = decisions;
  }
  if (hasOwn(raw, 'checks') && isPlainObject(raw.checks)) {
    const checks = {};
    for (const key of Object.keys(raw.checks)) {
      if (CHECK_KEY_SET.has(key) && typeof raw.checks[key] === 'boolean') {
        checks[key] = raw.checks[key];
      }
    }
    out.checks = checks;
  }
  if (hasOwn(raw, 'cost') && isPlainObject(raw.cost)) {
    const cost = {};
    for (const key of Object.keys(raw.cost)) {
      if (COST_KEY_SET.has(key) && isValidCostValue(raw.cost[key])) {
        cost[key] = raw.cost[key];
      }
    }
    out.cost = cost;
  }
  return out;
}

export function mergeStates(base, patch) {
  const out = {
    notes: typeof base?.notes === 'string' ? base.notes : '',
    compare: Array.isArray(base?.compare) ? dedupeCompare(base.compare) : [],
    decisions: isPlainObject(base?.decisions) ? cloneValue(base.decisions) : {},
    checks: isPlainObject(base?.checks) ? cloneValue(base.checks) : {},
    cost: isPlainObject(base?.cost) ? cloneValue(base.cost) : {}
  };
  if (!isPlainObject(patch)) return out;
  if (hasOwn(patch, 'notes') && patch.notes !== undefined) out.notes = patch.notes;
  if (hasOwn(patch, 'compare') && Array.isArray(patch.compare)) out.compare = dedupeCompare(patch.compare);
  for (const key of ITEM_KEYS) {
    if (hasOwn(patch, key) && isPlainObject(patch[key])) {
      const next = { ...out[key] };
      for (const itemKey of Object.keys(patch[key])) {
        next[itemKey] = cloneValue(patch[key][itemKey]);
      }
      out[key] = next;
    }
  }
  return out;
}

export function diffPatch(before, after) {
  const patch = {};
  for (const key of WHOLE_KEYS) {
    if (after[key] !== undefined && JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      patch[key] = cloneValue(after[key]);
    }
  }
  for (const key of ITEM_KEYS) {
    for (const [id, value] of Object.entries(after[key] || {})) {
      if (JSON.stringify(before[key]?.[id]) !== JSON.stringify(value)) {
        patch[key] ??= {};
        patch[key][id] = cloneValue(value);
      }
    }
  }
  return patch;
}

export function mergePendingPatch(basePatch, newPatch) {
  const out = isPlainObject(basePatch) ? cloneValue(basePatch) : {};
  if (!isPlainObject(newPatch)) return out;
  for (const key of WHOLE_KEYS) {
    if (hasOwn(newPatch, key) && newPatch[key] !== undefined) out[key] = cloneValue(newPatch[key]);
  }
  for (const key of ITEM_KEYS) {
    if (hasOwn(newPatch, key) && isPlainObject(newPatch[key])) {
      out[key] = { ...(out[key] || {}), ...cloneValue(newPatch[key]) };
    }
  }
  return out;
}

export function removeAppliedFromPending(pending, applied) {
  const out = cloneValue(pending || {});
  for (const [key, value] of Object.entries(applied || {})) {
    if (ITEM_KEYS.includes(key)) {
      const remaining = { ...(out[key] || {}) };
      for (const [id, item] of Object.entries(value || {})) {
        if (JSON.stringify(out[key]?.[id]) === JSON.stringify(item)) delete remaining[id];
      }
      if (Object.keys(remaining).length) out[key] = remaining;
      else delete out[key];
    } else if (JSON.stringify(out[key]) === JSON.stringify(value)) {
      delete out[key];
    }
  }
  return out;
}

export function countPending(pending) {
  let n = 0;
  for (const key of WHOLE_KEYS) if (pending[key] !== undefined) n++;
  for (const key of ITEM_KEYS) n += Object.keys(pending[key] || {}).length;
  return n;
}

export function validateState(state) {
  const errors = [];
  if (!isPlainObject(state)) {
    errors.push('データの内容が見つかりません。');
    return errors;
  }

  for (const key of Object.getOwnPropertyNames(state)) {
    if (!TOP_KEY_SET.has(key)) {
      errors.push(`不明なデータ項目 (${key}) が含まれています。`);
    }
  }

  if (hasOwn(state, 'notes') && state.notes !== undefined) {
    if (typeof state.notes !== 'string' || state.notes.length > MAX_NOTE_LENGTH) {
      errors.push('試乗メモの形式が不正です。');
    }
  }

  if (hasOwn(state, 'compare') && state.compare !== undefined) {
    if (!Array.isArray(state.compare)) {
      errors.push('比較候補の形式が不正です。');
    } else if (state.compare.length > 3) {
      errors.push('比較候補は3台までです。');
    } else if (state.compare.some(id => typeof id !== 'string' || !CAR_ID_SET.has(id))) {
      errors.push('比較候補の車種IDが不正です。');
    }
  }

  if (hasOwn(state, 'decisions') && state.decisions !== undefined) {
    if (!isPlainObject(state.decisions)) {
      errors.push('decisionsの形式が不正です。');
    } else {
      for (const id of Object.getOwnPropertyNames(state.decisions)) {
        if (!CAR_ID_SET.has(id)) {
          errors.push(`不明な車種ID (${id}) が含まれています。`);
          continue;
        }
        const value = state.decisions[id];
        if (!isPlainObject(value)) {
          errors.push(`${id}の候補状態が不正です。`);
          continue;
        }
        for (const field of Object.getOwnPropertyNames(value)) {
          if (!DECISION_KEY_SET.has(field)) {
            errors.push(`${id}に不明な項目 (${field}) が含まれています。`);
          }
        }
        if (!hasOwn(value, 'status') || (value.status !== 'active' && value.status !== 'excluded')) {
          errors.push(`${id}の候補状態が不正です。`);
        }
        if (hasOwn(value, 'note') && value.note !== undefined) {
          if (typeof value.note !== 'string' || value.note.length > MAX_REASON_LENGTH) {
            errors.push(`${id}の理由メモが不正です。`);
          }
        }
        if (hasOwn(value, 'date') && value.date !== undefined) {
          if (!isValidRealIsoDate(value.date)) {
            errors.push(`${id}の日付が不正です。`);
          }
        }
      }
    }
  }

  if (hasOwn(state, 'checks') && state.checks !== undefined) {
    if (!isPlainObject(state.checks)) {
      errors.push('checksの形式が不正です。');
    } else {
      for (const key of Object.getOwnPropertyNames(state.checks)) {
        if (!CHECK_KEY_SET.has(key)) {
          errors.push(`不明なチェック項目 (${key}) が含まれています。`);
        } else if (typeof state.checks[key] !== 'boolean') {
          errors.push(`チェック項目 (${key}) の値が不正です。`);
        }
      }
    }
  }

  if (hasOwn(state, 'cost') && state.cost !== undefined) {
    if (!isPlainObject(state.cost)) {
      errors.push('費用メモの形式が不正です。');
    } else {
      for (const key of Object.getOwnPropertyNames(state.cost)) {
        if (!COST_KEY_SET.has(key)) {
          errors.push(`不明な費用項目 (${key}) が含まれています。`);
        } else if (!isValidCostValue(state.cost[key])) {
          errors.push(`費用項目 (${key}) の値が不正です。`);
        }
      }
    }
  }

  return errors;
}

export function validateBackup(data) {
  const errors = [];
  if (!isPlainObject(data)) {
    errors.push('ファイルの形式が正しくありません。');
    return errors;
  }
  for (const key of Object.getOwnPropertyNames(data)) {
    if (!BACKUP_KEY_SET.has(key)) {
      errors.push(`不明なバックアップ項目 (${key}) が含まれています。`);
    }
  }
  if (data.version !== 1) errors.push('対応していないバックアップの形式です。');
  if (hasOwn(data, 'exportedAt') && data.exportedAt !== undefined) {
    if (typeof data.exportedAt !== 'string' || data.exportedAt.length > 64) {
      errors.push('書き出し日時の形式が不正です。');
    }
  }
  if (!isPlainObject(data.state)) {
    errors.push('データの内容が見つかりません。');
    return errors;
  }
  errors.push(...validateState(data.state));
  return errors;
}

export function defaultStorage(win = typeof window !== 'undefined' ? window : undefined) {
  try {
    if (!win) return null;
    const ls = win.localStorage;
    if (!ls || typeof ls.getItem !== 'function' || typeof ls.setItem !== 'function') return null;
    return ls;
  } catch {
    return null;
  }
}

function createCloudError(error, fallbackKind) {
  const rawMessage = typeof error?.message === 'string' ? error.message : String(error || '');
  const err = new Error(rawMessage || 'cloud error');
  if (error?.code !== undefined) err.code = error.code;
  if (error?.status !== undefined) err.status = error.status;
  if (error?.kind !== undefined) err.kind = error.kind;
  else if (fallbackKind) err.kind = fallbackKind;
  err.rawMessage = rawMessage;
  return err;
}

function classifyCloudError(error) {
  if (error?.kind === 'auth-expired') return 'auth-expired';
  if (error?.kind === 'invalid-data') return 'invalid-data';
  if (error?.kind === 'config-error') return 'config-error';

  const status = Number(error?.status);
  const code = String(error?.code || '');
  const msg = String(error?.rawMessage || error?.message || '');

  if (status === 401 || status === 403 || ['PGRST301', 'PGRST302', 'PGRST303', '42501'].includes(code)) {
    return 'auth-expired';
  }
  if (/authentication required|not authenticated|jwt|token.*expired|session.*expired|invalid claim|unauthorized/i.test(msg)) {
    return 'auth-expired';
  }
  if (status === 400 || status === 422 || code === 'P0001' || /^(22|23)/.test(code)) {
    return 'invalid-data';
  }
  if (/invalid |unsupported |unknown car id|too large|must be a json object|check constraint/i.test(msg)) {
    return 'invalid-data';
  }
  if (status === 404 || ['42P01', '42883', 'PGRST202', 'PGRST205'].includes(code)) {
    return 'config-error';
  }
  return 'offline';
}

export function wrapSupabaseClient(client) {
  return {
    async getSession() {
      const { data, error } = await client.auth.getSession();
      if (error) throw createCloudError(error);
      return data?.session || null;
    },
    onAuthStateChange(callback) {
      const { data } = client.auth.onAuthStateChange((event, session) => callback(session, event));
      return () => data?.subscription?.unsubscribe();
    },
    async signInWithOtp(email, redirectTo) {
      const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      return { error: error ? createCloudError(error) : null };
    },
    async signOut() {
      await client.auth.signOut();
    },
    async loadState() {
      const { data, error } = await client.from('car_journal_state').select('payload,revision,updated_at').maybeSingle();
      if (error) throw createCloudError(error);
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) return null;
      return { payload: row.payload, revision: row.revision, updatedAt: row.updated_at };
    },
    async mergePatch(patch) {
      const { data, error } = await client.rpc('car_journal_merge_patch', { patch });
      if (error) throw createCloudError(error);
      const row = Array.isArray(data) ? data[0] : data;
      if (!isPlainObject(row) || !isPlainObject(row.payload)) {
        throw createCloudError({ message: 'unexpected rpc response' }, 'unexpected');
      }
      return { payload: row.payload, revision: row.revision, updatedAt: row.updated_at };
    }
  };
}

async function defaultCreateCloudClient(config) {
  if (!config?.supabaseUrl || !config?.supabasePublishableKey) return null;
  let mod;
  try {
    mod = await import('./vendor/supabase-client.js');
  } catch {
    return null;
  }
  // メールリンク認証はSDK既定のimplicitフローに委ね、コード交換は自前実装しない。
  const client = mod.createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true }
  });
  return wrapSupabaseClient(client);
}

function wrapStorage(raw) {
  if (!raw) return null;
  return {
    getItem: key => raw.getItem(key),
    setItem: (key, value) => raw.setItem(key, value),
    removeItem: key => raw.removeItem(key)
  };
}

function safeAddWindowListener(eventName, fn) {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return null;
  try {
    window.addEventListener(eventName, fn);
    return () => {
      try { window.removeEventListener(eventName, fn); } catch {}
    };
  } catch {
    return null;
  }
}

export function createJournalStore(options = {}) {
  const storage = options.storage !== undefined ? options.storage : wrapStorage(defaultStorage());
  const now = options.now || (() => new Date());
  const createCloudClient = options.createCloudClient || defaultCreateCloudClient;
  const config = options.config || (typeof window !== 'undefined' && (() => {
    try { return window.CAR_JOURNAL_CONFIG; } catch { return null; }
  })()) || { supabaseUrl: '', supabasePublishableKey: '' };
  const flushDelay = options.flushDelay ?? 400;
  const retryBaseDelay = options.retryBaseDelay ?? 2000;
  const retryMaxDelay = options.retryMaxDelay ?? 60000;
  const maxAutoRetries = options.maxAutoRetries ?? 5;
  const addStorageListener = options.addStorageListener !== undefined
    ? options.addStorageListener
    : (fn => safeAddWindowListener('storage', event => fn(event.key)));
  const addOnlineListener = options.addOnlineListener !== undefined
    ? options.addOnlineListener
    : (fn => safeAddWindowListener('online', () => fn()));

  const configured = Boolean(config?.supabaseUrl && config?.supabasePublishableKey);

  let accountKey = 'anon';
  let state = emptyState();
  let pending = {};
  let cloudClient = null;
  let cloudReady = false;
  let generation = 0;
  let destroyed = false;
  let loadingGeneration = null;
  let flushingGeneration = null;
  let retryAttempt = 0;
  let flushTimer = null;
  let authEventReceived = false;
  let authQueue = [];
  let authDrainTimer = null;
  let unsubscribeAuth = null;
  let unsubscribeStorage = null;
  let unsubscribeOnline = null;
  let session = null;

  const subscribers = new Set();
  const statusSubscribers = new Set();
  let status = { mode: storage ? 'local-only' : 'storage-error', pendingCount: 0, message: storage ? '' : STORAGE_ERROR_MESSAGE };

  function keyFor(part) { return `${PREFIX}:${part}:${accountKey}`; }

  function isCurrent(gen, owner, client) {
    return !destroyed && gen === generation && owner === accountKey && client === cloudClient;
  }

  function storageGet(part) {
    if (!storage) return null;
    try { return storage.getItem(keyFor(part)); } catch { return null; }
  }
  function storageSet(part, value) {
    if (!storage) return false;
    try { storage.setItem(keyFor(part), value); return true; } catch { return false; }
  }

  function readState() {
    const raw = storageGet('local');
    if (!raw) return emptyState();
    try {
      return mergeStates(emptyState(), sanitizePartial(JSON.parse(raw)));
    } catch {
      return emptyState();
    }
  }
  function readPending() {
    const raw = storageGet('pending');
    if (!raw) return {};
    try {
      return sanitizePartial(JSON.parse(raw));
    } catch {
      return {};
    }
  }
  function persistState() { return storageSet('local', JSON.stringify(state)); }
  function persistPending() { return storageSet('pending', JSON.stringify(pending)); }

  function notify(meta = {}) {
    const snapshot = cloneValue(state);
    for (const fn of subscribers) fn(snapshot, meta);
  }
  function setStatus(partial) {
    status = { ...status, ...partial, pendingCount: countPending(pending) };
    for (const fn of statusSubscribers) fn({ ...status });
  }

  function loadLocal() {
    state = readState();
    pending = readPending();
  }

  function refreshFromStorage() {
    if (destroyed) return;
    loadLocal();
    notify({ source: 'storage-event' });
    setStatus({});
  }

  function scheduleFlush(delay = flushDelay) {
    if (destroyed || !configured || !cloudReady || accountKey === 'anon') return;
    clearTimeout(flushTimer);
    const myGen = generation;
    flushTimer = setTimeout(() => {
      if (!destroyed && myGen === generation) flush();
    }, delay);
  }

  function applyCloudErrorStatus(error) {
    const kind = classifyCloudError(error);
    const message = SAFE_SYNC_MESSAGES[kind] || SAFE_SYNC_MESSAGES.offline;
    if (kind === 'auth-expired') {
      cloudReady = false;
      retryAttempt = 0;
      clearTimeout(flushTimer);
      setStatus({ mode: 'auth-expired', message });
      return kind;
    }
    if (kind === 'invalid-data' || kind === 'config-error') {
      retryAttempt = 0;
      clearTimeout(flushTimer);
      setStatus({ mode: 'sync-error', message });
      return kind;
    }
    setStatus({ mode: 'offline', message });
    return 'offline';
  }

  async function flush() {
    const myGen = generation;
    const myOwner = accountKey;
    const myClient = cloudClient;
    if (destroyed || !configured || !cloudReady || !myClient || myOwner === 'anon') return;
    if (flushingGeneration === myGen) return;
    if (!countPending(pending)) {
      if (storage) setStatus({ mode: 'synced', message: '' });
      return;
    }
    flushingGeneration = myGen;
    const sending = cloneValue(pending);
    setStatus({ mode: 'syncing', message: '' });
    try {
      const result = await myClient.mergePatch(sending);
      if (!isCurrent(myGen, myOwner, myClient)) return;
      retryAttempt = 0;
      pending = removeAppliedFromPending(pending, sending);
      const remotePayload = isPlainObject(result?.payload) ? sanitizePartial(result.payload) : {};
      state = mergeStates(mergeStates(emptyState(), remotePayload), pending);
      const saved = persistState();
      persistPending();
      notify({ source: 'remote-merge' });
      if (!saved) {
        setStatus({ mode: 'storage-error', message: STORAGE_ERROR_MESSAGE });
      } else {
        setStatus({ mode: countPending(pending) ? 'syncing' : 'synced', message: '' });
      }
    } catch (error) {
      if (!isCurrent(myGen, myOwner, myClient)) return;
      const kind = applyCloudErrorStatus(error);
      if (kind === 'offline') {
        retryAttempt += 1;
        if (retryAttempt <= maxAutoRetries) {
          const delay = Math.min(retryBaseDelay * (2 ** (retryAttempt - 1)), retryMaxDelay);
          scheduleFlush(delay);
        }
      }
    } finally {
      if (flushingGeneration === myGen) flushingGeneration = null;
      if (isCurrent(myGen, myOwner, myClient) && status.mode === 'syncing' && countPending(pending)) {
        scheduleFlush(flushDelay);
      }
    }
  }

  async function loadCloudState() {
    const myGen = generation;
    const myOwner = accountKey;
    const myClient = cloudClient;
    if (destroyed || !configured || !myClient || myOwner === 'anon') return;
    if (loadingGeneration === myGen) return;
    loadingGeneration = myGen;
    try {
      const result = await myClient.loadState();
      if (!isCurrent(myGen, myOwner, myClient)) return;
      const payload = isPlainObject(result?.payload) ? sanitizePartial(result.payload) : null;
      if (payload && Object.keys(payload).length) {
        state = mergeStates(mergeStates(emptyState(), payload), pending);
      } else if (countPending(pending) === 0) {
        const localDiff = diffPatch(emptyState(), state);
        if (Object.keys(localDiff).length) pending = mergePendingPatch(pending, localDiff);
      }
      retryAttempt = 0;
      cloudReady = true;
      const saved = persistState();
      persistPending();
      notify({ source: 'remote-load' });
      if (!saved) {
        setStatus({ mode: 'storage-error', message: STORAGE_ERROR_MESSAGE });
      } else {
        setStatus({ mode: countPending(pending) ? 'syncing' : 'synced', message: '' });
      }
      if (countPending(pending)) scheduleFlush(flushDelay);
    } catch (error) {
      if (!isCurrent(myGen, myOwner, myClient)) return;
      cloudReady = false;
      applyCloudErrorStatus(error);
    } finally {
      if (loadingGeneration === myGen) loadingGeneration = null;
    }
  }

  function switchAccountState(nextAccountKey) {
    generation += 1;
    clearTimeout(flushTimer);
    retryAttempt = 0;
    accountKey = nextAccountKey;
    cloudReady = false;
    loadLocal();
    notify({ source: 'account-switch' });
    if (!storage) {
      setStatus({ mode: 'storage-error', message: STORAGE_ERROR_MESSAGE });
    } else {
      setStatus({ mode: accountKey === 'anon' ? 'local-only' : 'syncing', message: '' });
    }
  }

  function applySession(nextSession, event = null) {
    if (destroyed) return null;
    const nextAccountKey = nextSession?.user?.id || 'anon';
    session = nextSession || null;
    if (nextAccountKey === accountKey) {
      if (event === 'TOKEN_REFRESHED') {
        if (configured && accountKey !== 'anon' && cloudClient) {
          if (!cloudReady && loadingGeneration !== generation) {
            return loadCloudState();
          }
          if (cloudReady && countPending(pending) && status.mode === 'auth-expired') {
            retryAttempt = 0;
            scheduleFlush(flushDelay);
          }
        }
        return null;
      }
      if (configured && nextAccountKey !== 'anon' && cloudClient && !cloudReady && loadingGeneration !== generation) {
        return loadCloudState();
      }
      return null;
    }
    switchAccountState(nextAccountKey);
    if (configured && accountKey !== 'anon' && cloudClient) {
      return loadCloudState();
    }
    return null;
  }

  function drainAuthQueue() {
    authDrainTimer = null;
    if (destroyed || authQueue.length === 0) return null;
    const items = authQueue;
    authQueue = [];
    let lastLoadPromise = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isLast = i === items.length - 1;
      if (!isLast) {
        const nextKey = item.session?.user?.id || 'anon';
        session = item.session || null;
        if (nextKey !== accountKey) switchAccountState(nextKey);
      } else {
        lastLoadPromise = applySession(item.session, item.event);
      }
    }
    return lastLoadPromise;
  }

  function patch(partial) {
    if (validateState(partial).length > 0) return false;
    const cleanPatch = sanitizePartial(partial);
    const before = cloneValue(state);
    state = mergeStates(state, cleanPatch);
    const diff = diffPatch(before, state);
    let pendingChanged = false;
    if (Object.keys(diff).length) {
      pending = mergePendingPatch(pending, diff);
      pendingChanged = true;
    }
    const saved = persistState();
    if (pendingChanged) persistPending();
    notify({ source: 'local-patch' });
    if (!saved) {
      setStatus({ mode: 'storage-error', message: STORAGE_ERROR_MESSAGE });
    } else if (configured && accountKey !== 'anon') {
      retryAttempt = 0;
      if (cloudReady) {
        setStatus({ mode: 'syncing', message: '' });
        scheduleFlush(flushDelay);
      } else if (status.mode === 'auth-expired') {
        setStatus({ mode: 'auth-expired' });
      } else {
        setStatus({ mode: 'offline' });
      }
    } else {
      setStatus({ mode: 'local-only', message: '' });
    }
    return saved;
  }

  function readSanitizedAnonState() {
    if (!storage) return null;
    let raw = null;
    try { raw = storage.getItem(`${PREFIX}:local:anon`); } catch { return null; }
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!isPlainObject(parsed)) return null;
      return sanitizePartial(parsed);
    } catch {
      return null;
    }
  }

  function hasMeaningfulAnonData(anon) {
    if (!anon) return false;
    if (typeof anon.notes === 'string' && anon.notes.length > 0) return true;
    if (Array.isArray(anon.compare) && anon.compare.length > 0) return true;
    if (anon.decisions && Object.keys(anon.decisions).length > 0) return true;
    if (anon.checks && Object.values(anon.checks).some(v => v === true)) return true;
    if (anon.cost && Object.values(anon.cost).some(v => typeof v === 'string' && v !== '')) return true;
    return false;
  }

  function hasAnonymousData() {
    if (accountKey === 'anon') return false;
    return hasMeaningfulAnonData(readSanitizedAnonState());
  }

  function importAnonymousData() {
    if (accountKey === 'anon') return { ok: false, error: 'already-anonymous' };
    const anon = readSanitizedAnonState();
    if (!hasMeaningfulAnonData(anon)) return { ok: false, error: 'no-anon-data' };

    const merged = cloneValue(state);
    if (typeof anon.notes === 'string' && anon.notes.length > 0) {
      if (!merged.notes) {
        merged.notes = anon.notes;
      } else if (merged.notes !== anon.notes && !merged.notes.includes(anon.notes)) {
        merged.notes = `${merged.notes}\n\n${anon.notes}`.slice(0, MAX_NOTE_LENGTH);
      }
    }
    if (Array.isArray(anon.compare) && anon.compare.length > 0) {
      merged.compare = dedupeCompare([...(merged.compare || []), ...anon.compare]);
    }
    if (anon.decisions) {
      for (const [id, dec] of Object.entries(anon.decisions)) {
        if (!hasOwn(merged.decisions, id)) {
          merged.decisions[id] = cloneValue(dec);
        }
      }
    }
    if (anon.checks) {
      for (const [k, v] of Object.entries(anon.checks)) {
        if (v === true || !hasOwn(merged.checks, k)) {
          merged.checks[k] = v;
        }
      }
    }
    if (anon.cost) {
      for (const [k, v] of Object.entries(anon.cost)) {
        if (v !== '' && (!hasOwn(merged.cost, k) || merged.cost[k] === '')) {
          merged.cost[k] = v;
        }
      }
    }

    const diff = diffPatch(state, merged);
    if (!Object.keys(diff).length) return { ok: false, error: 'no-anon-data' };

    state = merged;
    pending = mergePendingPatch(pending, diff);
    const saved = persistState();
    persistPending();
    notify({ source: 'anon-import' });
    if (!saved) {
      setStatus({ mode: 'storage-error', message: STORAGE_ERROR_MESSAGE });
    } else if (configured && cloudReady) {
      retryAttempt = 0;
      setStatus({ mode: 'syncing', message: '' });
      scheduleFlush(flushDelay);
    } else if (configured) {
      setStatus({ mode: status.mode === 'auth-expired' ? 'auth-expired' : 'offline' });
    }
    return { ok: true };
  }

  function exportJSON() {
    return JSON.stringify({ version: 1, exportedAt: now().toISOString(), state: cloneValue(state) }, null, 2);
  }

  function importJSON(text) {
    let data;
    try {
      if (typeof text !== 'string') throw new Error('not-string');
      const byteLength = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length;
      if (byteLength > MAX_BACKUP_BYTES) throw new Error('too-large');
      data = JSON.parse(text);
    } catch {
      return { ok: false, errors: ['ファイルを読み取れませんでした。JSON形式のバックアップファイルを選んでください。'] };
    }
    const errors = validateBackup(data);
    if (errors.length) return { ok: false, errors };

    const incoming = sanitizePartial(data.state);
    const before = cloneValue(state);
    const merged = mergeStates(before, incoming);
    const diff = diffPatch(before, merged);
    state = merged;
    if (Object.keys(diff).length) {
      pending = mergePendingPatch(pending, diff);
      persistPending();
    }
    const saved = persistState();
    notify({ source: 'json-import' });
    if (!saved) {
      setStatus({ mode: 'storage-error', message: STORAGE_ERROR_MESSAGE });
    } else if (configured && accountKey !== 'anon') {
      retryAttempt = 0;
      if (cloudReady) {
        setStatus({ mode: 'syncing', message: '' });
        scheduleFlush(flushDelay);
      } else {
        setStatus({ mode: status.mode === 'auth-expired' ? 'auth-expired' : 'offline' });
      }
    } else {
      setStatus({ mode: 'local-only', message: '' });
    }
    return { ok: true, errors: [] };
  }

  async function init() {
    if (destroyed) return;
    loadLocal();
    notify({ source: 'init' });
    if (!storage) {
      setStatus({ mode: 'storage-error', message: STORAGE_ERROR_MESSAGE });
    } else {
      setStatus({ mode: 'local-only', message: '' });
    }
    if (addStorageListener) {
      unsubscribeStorage = addStorageListener(key => {
        if (key === keyFor('local')) refreshFromStorage();
      });
    }
    if (addOnlineListener) {
      unsubscribeOnline = addOnlineListener(() => {
        if (!destroyed && configured && accountKey !== 'anon' && status.mode === 'offline') {
          retry();
        }
      });
    }
    if (!configured) return;
    try {
      cloudClient = await createCloudClient(config);
    } catch {
      cloudClient = null;
    }
    if (destroyed) return;
    if (!cloudClient) {
      if (storage) setStatus({ mode: 'local-only', message: '' });
      return;
    }
    unsubscribeAuth = cloudClient.onAuthStateChange((nextSession, event) => {
      authEventReceived = true;
      authQueue.push({ session: nextSession || null, event: event || null });
      if (!authDrainTimer && !destroyed) {
        authDrainTimer = setTimeout(() => { drainAuthQueue(); }, 0);
      }
    });
    let initialSession = null;
    try {
      initialSession = await cloudClient.getSession();
    } catch {
      initialSession = null;
    }
    if (destroyed) return;
    if (authEventReceived) {
      clearTimeout(authDrainTimer);
      authDrainTimer = null;
      const loadPromise = drainAuthQueue();
      if (loadPromise) await loadPromise;
    } else {
      const loadPromise = applySession(initialSession, 'INITIAL_SESSION');
      if (loadPromise) await loadPromise;
    }
  }

  async function signInWithEmail(email, redirectTo) {
    if (!configured || !cloudClient) return { ok: false, error: '同期は設定されていません。この端末に保存します。' };
    try {
      const { error } = await cloudClient.signInWithOtp(email, redirectTo);
      if (!error) return { ok: true };
      const kind = classifyCloudError(error);
      if (kind === 'invalid-data') return { ok: false, error: 'メールアドレスの形式を確認してください。' };
      return { ok: false, error: '認証リンクを送信できませんでした。しばらくしてからもう一度お試しください。' };
    } catch {
      return { ok: false, error: '認証リンクを送信できませんでした。通信環境を確認してください。' };
    }
  }

  async function signOut() {
    applySession(null, 'SIGNED_OUT');
    if (cloudClient) {
      try { await cloudClient.signOut(); } catch { /* セッションは失効済みとして扱う */ }
    }
  }

  function retry() {
    if (destroyed || !configured || accountKey === 'anon' || !cloudClient) return;
    retryAttempt = 0;
    if (!cloudReady) {
      const myGen = generation;
      loadCloudState().then(() => {
        if (!destroyed && myGen === generation && cloudReady && countPending(pending)) {
          flush();
        }
      });
    } else {
      flush();
    }
  }

  function destroy() {
    destroyed = true;
    generation += 1;
    clearTimeout(flushTimer);
    clearTimeout(authDrainTimer);
    if (unsubscribeAuth) unsubscribeAuth();
    if (unsubscribeStorage) unsubscribeStorage();
    if (unsubscribeOnline) unsubscribeOnline();
  }

  return {
    init,
    getState: () => cloneValue(state),
    patch,
    subscribe: fn => { subscribers.add(fn); return () => subscribers.delete(fn); },
    onSyncStatusChange: fn => { statusSubscribers.add(fn); return () => statusSubscribers.delete(fn); },
    getSyncStatus: () => ({ ...status }),
    isCloudConfigured: () => configured,
    getAccountKey: () => accountKey,
    getSession: () => session,
    signInWithEmail,
    signOut,
    hasAnonymousData,
    importAnonymousData,
    exportJSON,
    importJSON,
    retry,
    destroy
  };
}
