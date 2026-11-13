/* Английский путь — приложение (без сборки, прогресс хранится в браузере). */
'use strict';
(() => {

/* ================= утилиты ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const rnd = a => a[Math.random() * a.length | 0];
const uniq = a => [...new Set(a)];
const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
const dayToDate = n => new Date(n * 86400000 + new Date().getTimezoneOffset() * 60000);
const fmtDate = n => { const d = dayToDate(n); return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', ...(d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}) }).replace(/\s?г\.$/, ''); };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
const pad2 = n => String(n).padStart(2, '0');

function norm(s) {
  s = String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,!?;:"«»()]/g, ' ').replace(/\s[—–-]\s/g, ' ');
  s = s.replace(/\bcan't\b/g, 'can not').replace(/\bcannot\b/g, 'can not').replace(/\bwon't\b/g, 'will not')
    .replace(/\b(\w+)n't\b/g, '$1 not')
    .replace(/\bi'm\b/g, 'i am').replace(/\b(\w+)'re\b/g, '$1 are').replace(/\b(\w+)'ve\b/g, '$1 have')
    .replace(/\b(\w+)'ll\b/g, '$1 will').replace(/\b(\w+)'d\b/g, '$1 would')
    .replace(/\b(it|he|she|that|what|where|there|who|here|how)'s\b/g, '$1 is').replace(/\blet's\b/g, 'let us');
  return s.replace(/\s+/g, ' ').trim();
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
const tokens = en => en.split(/\s+/).map(t => t.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}'%]+$/gu, '')).filter(Boolean);

/* ================= иконки ================= */
const I = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  flag: '<path d="M6 21V4"/><path d="M6 4h11l-2 4 2 4H6"/>',
  sound: '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  slow: '<path d="M3 15c0-4 3.5-7 8-7s7 3 7 6v1H3z"/><path d="M18 13h2.5a1.5 1.5 0 0 0 0-3H19"/><path d="M6 15v3M14 15v3"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.4 2.4-5.4 3.6-7.9.5 1.8 1.6 2.8 2.6 3.3C12 7.4 13.2 5 15.3 3c.3 3.4 3.2 5.8 3.2 10.4 0 4.6-2.8 7.6-6.5 7.6z"/>',
  bolt: '<path d="M13 3L5 13.5h6L10 21l9-11h-6.5z"/>',
  path: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H14a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7h5.5"/>',
  repeat: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15"/><path d="M4 20v-5h5"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8.5 20h7M10 17h4"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  door: '<path d="M14 4H6v16h8"/><path d="M10 12h10M17 9l3 3-3 3"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5l5-3v9l-5-3z"/>',
  scheme: '<path d="M4 6h6v5H4zM14 13h6v5h-6z"/><path d="M10 8.5h2a2 2 0 0 1 2 2v5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4.5 4"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  cloud: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.3 9.6 4.5 4.5 0 0 0 7 18.5z"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n] || ''}</svg>`;

/* ================= данные ================= */
const COURSE = window.COURSE;
const GRADES = Object.keys(COURSE).map(Number).sort((a, b) => a - b);
const ALL_GRADES = [5, 6, 7, 8, 9, 10, 11];
const LEVELS = { A1: 'Начальный', A2: 'Базовый', B1: 'Средний', B2: 'Выше среднего' };
const RU_INDEX = new Map();

function parseGap(str) {
  const [main, ru] = str.split(' | ');
  const m = main.match(/^(.*)\{([^}]*)\}(.*)$/);
  const opts = m[2].split('|');
  return { kind: 'gap', text: main, before: m[1], after: m[3], answer: opts[0], opts, ru: (ru || '').trim() };
}
function parseForm(str) {
  const [main, ru] = str.split(' | ');
  const m = main.match(/^(.*?)\(([^()]*?):([^()]*)\)(.*)$/);
  const answers = m[3].split('|').map(s => s.trim());
  return { kind: 'form', text: main, before: m[1], hint: m[2].trim(), answers, after: m[4], ru: (ru || '').trim(), en: m[1] + answers[0] + m[4] };
}
const GR = new Map();
for (const t of window.GRAMMAR) {
  t.gaps = (t.g || []).map(parseGap);
  t.forms = (t.f || []).map(parseForm);
  t.exs = t.b.filter(b => b.k === 'ex').flatMap(b => b.items).map(x => { const i = x.indexOf(' = '); return { en: x.slice(0, i), ru: x.slice(i + 3) }; });
  GR.set(t.id, t);
}
for (const g of Object.values(COURSE)) {
  g.units.forEach((u, ui) => {
    u.grade = g.id; u.index = ui; u.key = `${g.id}.${u.id}`;
    u.lessons.forEach((l, li) => {
      l.key = `${u.key}.l${li}`; l.index = li; l.unit = u;
      l.topic = GR.get(l.gr || (g.gr || {})[`${u.id}.l${li}`]) || null;
      l.words = l.w.split(';').map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf('='); return { en: x.slice(0, i).trim(), ru: x.slice(i + 1).trim() }; });
      l.sents = l.s.map(x => { const [en, ru] = x.split(' | '); return { en: en.trim(), ru: (ru || '').trim() }; });
      l.ownGaps = (l.g || []).map(parseGap);
      l.ownForms = (l.f || []).map(parseForm);
      for (const w of l.words) { const k = norm(w.ru); RU_INDEX.set(k, uniq([...(RU_INDEX.get(k) || []), w.en])); }
    });
  });
}
const LESSONS = new Map(); const UNITS = new Map();
for (const g of Object.values(COURSE)) for (const u of g.units) { UNITS.set(u.key, u); for (const l of u.lessons) LESSONS.set(l.key, l); }
const allWords = g => COURSE[g].units.flatMap(u => u.lessons.flatMap(l => l.words));
const wordByEn = (() => { const m = new Map(); for (const l of LESSONS.values()) for (const w of l.words) if (!m.has(w.en)) m.set(w.en, w); return en => m.get(en); })();
const itemByText = (() => {
  const m = new Map();
  for (const t of GR.values()) for (const x of [...t.gaps, ...t.forms]) m.set(x.text, x);
  for (const l of LESSONS.values()) for (const x of [...l.ownGaps, ...l.ownForms]) m.set(x.text, x);
  return t => m.get(t);
})();

/* ================= хранилище ================= */
const LS_KEY = 'englishpath.v1';
let DB = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || { profiles: {}, current: null }; } catch { return { profiles: {}, current: null }; } })();
let P = null;
function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(DB)); } catch { /* приватный режим */ } if (P && P.cloud) cloudPush(); }

/* ================= облако (Supabase) ================= */
// Публичный ключ: его можно держать в коде, данные защищены правилами доступа в базе (каждый видит только свою строку).
const CLOUD = { url: 'https://nuglrrzqvzjgpkojlktd.supabase.co', key: 'sb_publishable_Xi_HssgWTngscyqcmI1tAg_rGz1E1JJ' };
let sb = null;
try { if (window.supabase && !/[?&]nocloud\b/.test(location.search)) sb = window.supabase.createClient(CLOUD.url, CLOUD.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'englishpath.auth' } }); } catch { sb = null; }
const DEVICE = (() => { try { let d = localStorage.getItem('englishpath.device'); if (!d) { d = Math.random().toString(36).slice(2, 10); localStorage.setItem('englishpath.device', d); } return d; } catch { return 'dev'; } })();
let cloudState = 'off'; // off | sync | ok | err
function setCloud(s) {
  cloudState = s;
  const el = $('#cloudchip'); if (el) el.outerHTML = cloudChip();
}
function cloudChip() {
  if (!P || !P.cloud) return '<span id="cloudchip"></span>';
  const t = { sync: 'Сохраняю в облако…', ok: 'Сохранено в облаке', err: 'Нет связи с облаком — сохранено на устройстве', off: 'Облако' }[cloudState];
  return `<span id="cloudchip" class="chip cloud-${cloudState}" title="${t}">${icon('cloud')}<span class="cloud-t">${cloudState === 'ok' ? 'в облаке' : cloudState === 'sync' ? 'сохраняю' : cloudState === 'err' ? 'офлайн' : ''}</span></span>`;
}
async function loginEmail(nick) {
  try { const { data } = await sb.rpc('login_email', { p_nick: nick.trim() }); return data || null; } catch { return null; }
}
async function makeEmail(nick) {
  const h = await hashPass('cloud', nick.trim().toLowerCase());
  return `u${h.slice(0, 32)}@englishpath.app`;
}
async function cloudUid() { try { const { data } = await sb.auth.getSession(); return data.session ? data.session.user.id : null; } catch { return null; } }
const cloudErr = e => {
  const m = String((e && e.message) || e || '');
  if (/invalid login/i.test(m)) return 'Неверный ник или пароль.';
  if (/at least 6|password should/i.test(m)) return 'Пароль — минимум 6 символов.';
  if (/fetch|network|failed/i.test(m)) return 'Нет связи с облаком. Проверь интернет.';
  return 'Облако ответило ошибкой: ' + m;
};
// новый облачный аккаунт для профиля P
async function cloudRegister(nick, pass) {
  if (!sb) return 'Облако недоступно (нет интернета).';
  if (pass.length < 6) return 'Пароль — минимум 6 символов.';
  if (await loginEmail(nick)) return 'Такой ник уже занят в облаке. Выбери другой.';
  const { data, error } = await sb.auth.signUp({ email: await makeEmail(nick), password: pass });
  if (error) return cloudErr(error);
  if (!data.session) return 'Облако требует подтверждение почты — сообщи репетитору.';
  P.cloud = { uid: data.user.id }; cloudReady = true;
  const r = await pushNow();
  return r;
}
async function cloudLogin(nick, pass) {
  if (!sb) return { error: 'Облако недоступно (нет интернета).' };
  const email = (await loginEmail(nick)) || await makeEmail(nick);
  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) return { error: cloudErr(error) };
  const { data: row, error: e2 } = await sb.from('progress').select('*').eq('user_id', data.user.id).maybeSingle();
  if (e2) return { error: cloudErr(e2) };
  return { uid: data.user.id, row };
}
let pushT = null, cloudReady = false; // отправляем только после того, как скачали свежую версию
function cloudPush() {
  if (!sb || !P || !P.cloud || !cloudReady) return;
  clearTimeout(pushT); setCloud('sync');
  pushT = setTimeout(() => pushNow(), 1200);
}
async function pushNow() {
  if (!sb || !P || !P.cloud) return null;
  clearTimeout(pushT);
  const me = P;
  try {
    if (await cloudUid() !== me.cloud.uid) { setCloud('err'); return 'Нужно войти заново, чтобы сохранять в облако.'; }
    const { error } = await sb.from('progress').upsert({ user_id: me.cloud.uid, nick: me.nick, data: me, updated_at: new Date().toISOString() });
    if (error) { setCloud('err'); return /duplicate|unique/i.test(error.message) ? 'Такой ник уже занят в облаке.' : cloudErr(error); }
    setCloud('ok'); return null;
  } catch (e) { setCloud('err'); return cloudErr(e); }
}
async function cloudPull() {
  if (!sb || !P || !P.cloud || S) return;
  try {
    if (await cloudUid() !== P.cloud.uid) { setCloud('err'); return; }
    const { data: row, error } = await sb.from('progress').select('*').eq('user_id', P.cloud.uid).maybeSingle();
    if (error) { setCloud('err'); return; }
    cloudReady = true;
    if (!row || !row.data) return pushNow();
    const before = JSON.stringify(P);
    const merged = mergeP(P, row.data);
    if (row.nick && row.nick !== merged.nick) { delete DB.profiles[merged.nick]; merged.nick = row.nick; DB.current = row.nick; }
    Object.keys(P).forEach(k => delete P[k]); Object.assign(P, merged); DB.profiles[P.nick] = P;
    try { localStorage.setItem(LS_KEY, JSON.stringify(DB)); } catch { /* */ }
    if (JSON.stringify(P) !== before) { render(); }
    if (JSON.stringify(P) !== JSON.stringify(row.data)) await pushNow(); else setCloud('ok');
  } catch { setCloud('err'); }
}
// объединение прогресса с двух устройств: ничего не теряется
function mergeP(a, b) {
  const out = JSON.parse(JSON.stringify(a)); b = migrate(JSON.parse(JSON.stringify(b)));
  const mo = (x = {}, y = {}, f) => { const r = { ...x }; for (const k in y) r[k] = k in r ? f(r[k], y[k]) : y[k]; return r; };
  const mx = (p, q) => Math.max(p || 0, q || 0);
  out.lessons = mo(out.lessons, b.lessons, (x, y) => ({ at: mx(x.at, y.at), acc: mx(x.acc, y.acc), n: mx(x.n, y.n) }));
  const pass = (x, y) => ({ best: mx(x.best, y.best), passed: !!(x.passed || y.passed), at: mx(x.at, y.at) });
  out.units = mo(out.units, b.units, pass); out.grades = mo(out.grades, b.grades, pass);
  out.words = mo(out.words, b.words, (x, y) => (x.s !== y.s ? (x.s > y.s ? x : y) : (x.due >= y.due ? x : y)));
  out.items = mo(out.items, b.items, (x, y) => (x.due >= y.due ? x : y));
  out.ach = mo(out.ach, b.ach, (x, y) => Math.min(x, y));
  out.topics = mo(out.topics, b.topics, mx);
  out.stats = mo(out.stats, b.stats, mx);
  out.xpDev = mo(out.xpDev, b.xpDev, mx);
  out.days = mo(out.days, b.days, (x, y) => {
    const dev = mo(x.dev, y.dev, (p, q) => ({ min: mx(p.min, q.min), xp: mx(p.xp, q.xp) }));
    const r = { dev, log: uniq([...(x.log || []), ...(y.log || [])]) };
    const ds = Object.values(dev);
    r.min = ds.length ? ds.reduce((s, v) => s + v.min, 0) : mx(x.min, y.min);
    r.xp = ds.length ? ds.reduce((s, v) => s + v.xp, 0) : mx(x.xp, y.xp);
    return r;
  });
  const keys = uniq([...Object.keys(out.notes || {}), ...Object.keys(b.notes || {})]);
  const notes = {}, notesAt = {};
  for (const k of keys) {
    const ta = (a.notesAt || {})[k] || 0, tb = (b.notesAt || {})[k] || 0;
    const pick = tb > ta ? b : a;
    notes[k] = (pick.notes || {})[k] ?? (a.notes || {})[k] ?? (b.notes || {})[k] ?? ''; notesAt[k] = Math.max(ta, tb);
  }
  out.notes = notes; out.notesAt = notesAt;
  const sa = a.streak || {}, sbk = b.streak || {};
  out.streak = { ...(mx(sa.last, 0) >= mx(sbk.last, 0) ? sa : sbk), best: mx(sa.best, sbk.best) };
  if ((b.goalAt || 0) > (a.goalAt || 0)) { out.goal = b.goal; out.goalAt = b.goalAt; }
  out.xp = Object.values(out.xpDev || {}).reduce((s, v) => s + v, 0);
  out.cloud = a.cloud || b.cloud;
  out.cards = uniq([...(a.cards || []), ...(b.cards || [])]);
  out.favs = (b.favsAt || 0) > (a.favsAt || 0) ? (b.favs || []) : (a.favs || []);
  out.favsAt = Math.max(a.favsAt || 0, b.favsAt || 0);
  return out;
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') cloudPull(); });
async function hashPass(nick, pass) {
  const data = new TextEncoder().encode('ep:' + nick.toLowerCase() + ':' + pass);
  try { const buf = await crypto.subtle.digest('SHA-256', data); return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''); }
  catch { let h = 5381; for (const b of data) h = ((h << 5) + h + b) >>> 0; return 'd' + h.toString(16); }
}
function newProfile(nick, pass, grade, goal) {
  return {
    nick, pass, grade, goal: { ...goal, start: today() }, created: Date.now(),
    xp: 0, streak: { n: 0, last: -1, best: 0 }, days: {}, lessons: {}, units: {}, grades: {}, words: {}, items: {}, ach: {}, topics: {}, notes: {}, notesAt: {}, xpDev: {},
    stats: { lessons: 0, perfect: 0, tests: 0, ace: 0, extern: 0, reviews: 0, goalDays: 0, practice: 0 },
    settings: { sound: true, voice: '' },
  };
}
function migrate(p) { // профили из первой версии
  p.items = p.items || {}; p.topics = p.topics || {}; p.notes = p.notes || {}; p.notesAt = p.notesAt || {};
  if (!p.xpDev) p.xpDev = { old: p.xp || 0 };
  for (const d of Object.values(p.days || {})) if (!d.dev) d.dev = { old: { min: d.min || 0, xp: d.xp || 0 } };
  if (p.gaps) { for (const t of Object.keys(p.gaps)) p.items[t] = p.gaps[t]; delete p.gaps; }
  if (p.goal && p.goal.target === 'g5') p.goal.target = 'grade';
  p.stats.practice = p.stats.practice || 0;
  return p;
}

/* ================= голос и звук ================= */
const TTS = { ok: false, voice: null, list: [] };
function chooseVoice() {
  const pref = P && P.settings.voice, L = TTS.list;
  TTS.voice = L.find(v => v.name === pref) || L.find(v => /en-GB/i.test(v.lang) && /natural|online|neural/i.test(v.name))
    || L.find(v => /en-GB/i.test(v.lang)) || L.find(v => /natural|online|neural/i.test(v.name)) || L[0] || null;
}
function initVoices() {
  if (!('speechSynthesis' in window)) return;
  const load = () => { TTS.list = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)); TTS.ok = TTS.list.length > 0; chooseVoice(); };
  load(); speechSynthesis.onvoiceschanged = load;
}
function say(text, slow) {
  if (!TTS.ok) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).replace(/→/g, ', ').replace(/\//g, ', '));
  if (TTS.voice) { u.voice = TTS.voice; u.lang = TTS.voice.lang; } else u.lang = 'en-GB';
  u.rate = slow ? 0.62 : 0.92;
  speechSynthesis.speak(u);
}
let AC = null;
function tone(seq) {
  if (!P || !P.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    let t = AC.currentTime;
    for (const [f, d, type = 'sine', v = 0.1] of seq) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + 0.03); t += d * 0.75;
    }
  } catch { /* без звука */ }
}
const sfx = {
  ok: () => tone([[587, 0.09], [880, 0.18]]),
  bad: () => tone([[185, 0.24, 'triangle', 0.13]]),
  done: () => tone([[440, 0.1], [554, 0.1], [659, 0.1], [880, 0.34]]),
};

/* ================= прогресс ================= */
const gradePassed = g => !!(P.grades[g] && P.grades[g].passed);
const gradeOpen = g => g === 5 || gradePassed(g) || gradePassed(g - 1);
const gradeExists = g => !!COURSE[g];
const unitPassed = u => !!(P.units[u.key] && P.units[u.key].passed) || gradePassed(u.grade);
const lessonDone = l => !!P.lessons[l.key] || unitPassed(l.unit);
const unitOpen = u => gradeOpen(u.grade) && (u.index === 0 || unitPassed(u) || unitPassed(COURSE[u.grade].units[u.index - 1]));
const lessonOpen = l => unitOpen(l.unit) && (l.index === 0 || lessonDone(l) || lessonDone(l.unit.lessons[l.index - 1]));
const unitLessonsDone = u => u.lessons.filter(lessonDone).length;
function nextStep() {
  for (const g of GRADES) {
    if (!gradeOpen(g)) return null;
    if (gradePassed(g)) continue;
    for (const u of COURSE[g].units) {
      if (unitPassed(u) || !unitOpen(u)) continue;
      const l = u.lessons.find(x => !lessonDone(x));
      return l ? { kind: 'lesson', l } : { kind: 'test', u };
    }
    return { kind: 'final', g };
  }
  return null;
}
function gradeProgress(g) {
  if (gradePassed(g)) return 1;
  let total = 0, done = 0;
  for (const u of COURSE[g].units) { total += u.lessons.length + 1; done += unitLessonsDone(u) + (unitPassed(u) ? 1 : 0); }
  return done / (total + 1);
}
const dayRec = (d = today()) => (P.days[d] = P.days[d] || { min: 0, xp: 0 });
const todayMin = () => Math.round((P.days[today()] || {}).min || 0);
const totalMin = () => Object.values(P.days).reduce((a, d) => a + (d.min || 0), 0);
const dueWords = () => Object.entries(P.words).filter(([, w]) => w.due <= today()).map(([en]) => en);
const dueItems = () => Object.entries(P.items).filter(([, g]) => g.due <= today()).map(([t]) => t);
const IV = [0, 1, 2, 4, 7, 15, 30];
function updWord(en, ok) {
  const w = P.words[en] || (P.words[en] = { s: 0, due: today() });
  if (ok) { w.s = Math.min(w.s + 1, 6); w.due = today() + IV[w.s]; } else { w.s = 0; w.due = today(); }
}
function updItem(text, ok) {
  if (ok) { const it = P.items[text]; if (it) { it.s = (it.s || 0) + 1; if (it.s >= 2) delete P.items[text]; else it.due = today() + 3; } }
  else P.items[text] = { s: 0, due: today() + 1 };
}

/* ---- план ---- */
const LESSON_MIN = g => g === 5 ? 9 : 14;
const TARGETS = { grade: 'Программа своего класса', A2: 'Уровень A2 (7 класс)', B1: 'Уровень B1 (9 класс)', B2: 'Уровень B2 (11 класс)' };
const DEADLINES = [[4, '1 месяц'], [8, '2 месяца'], [13, '3 месяца'], [26, 'полгода'], [52, 'год']];
const MINUTES = [15, 20, 30, 45, 60];
const targetGrade = () => ({ grade: Math.min(11, Math.max(5, P.grade)), A2: 7, B1: 9, B2: 11 }[P.goal.target] || 11);
function planInfo() {
  const tg = targetGrade(); let total = 0;
  for (const g of GRADES) {
    if (g > tg || gradePassed(g)) continue;
    for (const u of COURSE[g].units) { if (unitPassed(u)) continue; total += 15; for (const l of u.lessons) if (!lessonDone(l)) total += LESSON_MIN(g); }
    total += 30;
  }
  total = Math.round(total * 1.15); // повторение
  const perDay = P.goal.minutes, days = Math.max(1, Math.ceil(total / perDay));
  const left = Math.max(1, P.goal.weeks * 7 - (today() - P.goal.start)), need = Math.ceil(total / left);
  return { total, days, left, need, ok: need <= perDay, finish: today() + days, tg };
}
function planText(pi = planInfo()) {
  if (!pi.total) return 'Цель выполнена. Можно поставить следующую в профиле.';
  const h = Math.round(pi.total / 60);
  const hrs = pi.total < 90 ? `${pi.total} мин` : `${h} ${plural(h, 'час', 'часа', 'часов')}`;
  let s = `До ${pi.tg} класса осталось около ${hrs} занятий. При ${P.goal.minutes} мин в день — ${pi.days} ${plural(pi.days, 'день', 'дня', 'дней')}, до ${fmtDate(pi.finish)}.`;
  if (!pi.ok) s += ` К сроку не успеть: нужно около ${pi.need} мин в день.`;
  return s;
}

/* ---- достижения ---- */
const ACH = [
  { id: 'first', t: 'Первый шаг', d: 'Пройди первый урок', i: 'path', ok: () => P.stats.lessons >= 1 },
  { id: 'clean', t: 'Чисто', d: 'Урок без единой ошибки', i: 'check', ok: () => P.stats.perfect >= 1 },
  { id: 'grammar', t: 'Теоретик', d: 'Потренируй 5 тем в справочнике', i: 'scheme', ok: () => P.stats.practice >= 5 },
  { id: 's3', t: 'Три дня подряд', d: 'Занимайся 3 дня без пропусков', i: 'flame', ok: () => P.streak.best >= 3 },
  { id: 'goal', t: 'Норма дня', d: 'Выполни дневную норму минут', i: 'target', ok: () => P.stats.goalDays >= 1 },
  { id: 'unit', t: 'Модуль закрыт', d: 'Сдай тест модуля', i: 'flag', ok: () => Object.values(P.units).some(u => u.passed) },
  { id: 'extern', t: 'Экстерн', d: 'Сдай модуль тестом без уроков', i: 'bolt', ok: () => P.stats.extern >= 1 },
  { id: 'ace', t: 'Отличник', d: 'Тест без ошибок', i: 'star', ok: () => P.stats.ace >= 1 },
  { id: 's7', t: 'Неделя', d: '7 дней подряд', i: 'flame', ok: () => P.streak.best >= 7 },
  { id: 'review5', t: 'Память', d: 'Сделай 5 повторений', i: 'repeat', ok: () => P.stats.reviews >= 5 },
  { id: 'w300', t: '300 слов', d: 'Собери 300 слов в копилку', i: 'book', ok: () => Object.keys(P.words).length >= 300 },
  { id: 'g5', t: '5 класс', d: 'Сдай итоговую за 5 класс', i: 'trophy', ok: () => gradePassed(5) },
  { id: 'g7', t: 'Уровень A2', d: 'Сдай итоговую за 7 класс', i: 'trophy', ok: () => gradePassed(7) },
  { id: 'g9', t: 'Уровень B1', d: 'Сдай итоговую за 9 класс', i: 'trophy', ok: () => gradePassed(9) },
  { id: 'g11', t: 'Уровень B2', d: 'Сдай итоговую за 11 класс', i: 'trophy', ok: () => gradePassed(11) },
  { id: 's30', t: 'Месяц', d: '30 дней подряд', i: 'flame', ok: () => P.streak.best >= 30 },
  { id: 'cards25', t: 'Мечтатель', d: 'Открой 25 карточек мечты', i: 'image', ok: () => (P.cards || []).length >= 25 },
  { id: 'cards100', t: 'Коллекционер', d: 'Открой 100 карточек мечты', i: 'image', ok: () => (P.cards || []).length >= 100 },
];
/* ================= фото мечты ================= */
const PHOTOS = window.PHOTOS || [];
const QUOTES = window.QUOTES || [];
const PH = new Map(PHOTOS.map((p, i) => [p.id, { ...p, i }]));
const strHash = s => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const photoSrc = (p, thumb) => `photos/${thumb ? 't/' : ''}${p.id}.webp`;
const quoteFor = p => (p.q || !QUOTES.length) ? null : QUOTES[strHash(p.id) % QUOTES.length];
const START_CARDS = 3;
const SHOW_PHOTO_OF_DAY = false;   // фото дня на главной — выключено (может вернём)
const SHOW_RESULT_CARD = false;    // большая карточка на экране итогов — выключено
const SHOW_DREAM = false;          // раздел «Мечты» и «Моя доска» — спрятаны (фото теперь на карте)
const PLAYER_PHOTO_EVERY = 4;      // в уроке фото меняется каждые N заданий
function cardsInit() { if (!P.cards || !P.cards.length) P.cards = PHOTOS.slice(0, START_CARDS).map(p => p.id); if (!P.favs) P.favs = []; }
function unlockCards(n) {
  cardsInit(); const got = [];
  for (const p of PHOTOS) { if (got.length >= n) break; if (!P.cards.includes(p.id)) { P.cards.push(p.id); got.push(p); } }
  return got;
}
// у каждого модуля своё фото: модули идут подряд по всем классам, фото — по перемешанному списку
const UNIT_ORD = new Map(); { let k = 0; for (const g of Object.keys(COURSE).map(Number).sort((a, b) => a - b)) for (const u of COURSE[g].units) UNIT_ORD.set(`${g}.${u.id}`, k++); }
const unitPhoto = u => PHOTOS.length ? PHOTOS[UNIT_ORD.get(u.key) % PHOTOS.length] : null;
const photoOfDay = () => PHOTOS.length ? PHOTOS[strHash('day' + today()) % PHOTOS.length] : null;
const quoteHTML = q => q ? `<blockquote class="ph-q"><p>${esc(q.t)}</p>${q.a ? `<cite>${esc(q.a)}</cite>` : ''}</blockquote>` : '';
const favBtn = id => { const on = (P.favs || []).includes(id); return `<button class="fav-btn ${on ? 'on' : ''}" data-fav="${id}" aria-pressed="${on}">${icon('heart')}<span>${on ? 'На моей доске' : 'На мою доску'}</span></button>`; };
function toggleFav(id) {
  cardsInit();
  P.favs = P.favs.includes(id) ? P.favs.filter(x => x !== id) : [...P.favs, id];
  P.favsAt = Date.now(); save();
  $$(`[data-fav="${id}"]`).forEach(b => { b.outerHTML = favBtn(id); });
}

function checkAch() { const fresh = []; for (const a of ACH) if (!P.ach[a.id] && a.ok()) { P.ach[a.id] = today(); fresh.push(a); } return fresh; }

/* ================= схемы грамматики ================= */
const TL = { w: 640, h: 150, x0: 36, x1: 604, y: 92 };
const tlx = p => (TL.x0 + TL.x1) / 2 + p * ((TL.x1 - TL.x0) / 2 - 18);
function timelineSVG(b) {
  let marks = '', i = 0;
  const d = () => `style="--d:${(i++) * 0.22 + 0.25}s"`;
  for (const m of b.m) {
    if (m.p != null) marks += `<circle class="tl-dot" ${d()} cx="${tlx(m.p)}" cy="${TL.y}" r="8"/>`;
    if (m.r) marks += `<rect class="tl-bar ${m.open ? 'open' : ''}" ${d()} x="${tlx(m.r[0])}" y="${TL.y - 7}" width="${tlx(m.r[1]) - tlx(m.r[0])}" height="14" rx="7"/>`;
    if (m.rep) { const n = 7; for (let k = 0; k < n; k++) { const x = tlx(m.rep[0] + (m.rep[1] - m.rep[0]) * k / (n - 1)); marks += `<line class="tl-tick" ${d()} x1="${x}" x2="${x}" y1="${TL.y - 11}" y2="${TL.y + 11}"/>`; } }
    if (m.arc) { const a = tlx(m.arc[0]), c = tlx(m.arc[1]), top = TL.y - 62; marks += `<path class="tl-arc" ${d()} pathLength="1" d="M${a} ${TL.y - 10} C ${a} ${top}, ${c} ${top}, ${c} ${TL.y - 12}" marker-end="url(#tlhead)"/>`; }
    if (m.l) marks += `<text class="tl-lbl" ${d()} x="${tlx(m.at)}" y="${TL.y + 36}">${esc(m.l)}</text>`;
  }
  return `<svg class="g-tl" viewBox="0 0 ${TL.w} ${TL.h}" role="img" aria-label="Линия времени">
    <defs><marker id="tlhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="tl-head"/></marker>
    <marker id="axhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" class="tl-axhead"/></marker></defs>
    <line class="tl-axis" x1="${TL.x0}" x2="${TL.x1}" y1="${TL.y}" y2="${TL.y}" marker-end="url(#axhead)"/>
    <line class="tl-now" x1="${tlx(0)}" x2="${tlx(0)}" y1="${TL.y - 70}" y2="${TL.y + 18}"/>
    <text class="tl-cap" x="${tlx(0)}" y="${TL.y - 76}">сейчас</text>
    <text class="tl-side" x="${TL.x0}" y="${TL.y + 36}" text-anchor="start">прошлое</text>
    <text class="tl-side" x="${TL.x1}" y="${TL.y + 36}" text-anchor="end">будущее</text>
    ${marks}
  </svg>`;
}
function chip(part) {
  if (part.startsWith('*')) return `<span class="ch ch-aux">${esc(part.slice(1))}</span>`;
  if (part.startsWith('~')) return `<span class="ch ch-verb">${esc(part.slice(1))}</span>`;
  return `<span class="ch">${esc(part)}</span>`;
}
function moveRow(sentence, w) {
  let used = false;
  return sentence.split(/\s+/).map(t => {
    const hit = !used && t.replace(/[^\w']/g, '').toLowerCase() === w.toLowerCase();
    if (hit) used = true;
    return `<span class="mv ${hit ? 'hl' : ''}">${esc(t)}</span>`;
  }).join(' ');
}
function blockHTML(b, i) {
  const st = `style="--bi:${i}"`;
  switch (b.k) {
    case 'lead': return `<p class="g-lead" ${st}>${esc(b.t)}</p>`;
    case 'formula': return `<div class="g-formula" ${st}>${b.rows.map((r, k) => `<div class="f-row" style="--r:${k}"><span class="f-sign">${esc(r[0])}</span><span class="f-parts">${r.slice(1).map(chip).join('<i class="f-plus">+</i>')}</span></div>`).join('')}
      <p class="f-legend"><span class="ch ch-aux">вспом.</span> вспомогательный глагол <span class="ch ch-verb">V</span> смысловой глагол</p></div>`;
    case 'timeline': return `<figure class="g-fig" ${st}>${timelineSVG(b)}${b.cap ? `<figcaption>${esc(b.cap)}</figcaption>` : ''}</figure>`;
    case 'move': return `<figure class="g-move" ${st}><div class="mv-row mv-a">${moveRow(b.a, b.w)}</div><svg class="mv-svg" aria-hidden="true"></svg><div class="mv-row mv-b">${moveRow(b.b, b.w)}</div>
      <button class="say mini" data-say="${esc(b.b)}" aria-label="Послушать">${icon('sound')}</button></figure>`;
    case 'shift': return `<div class="g-shift" ${st}>${b.t ? `<h4>${esc(b.t)}</h4>` : ''}${b.pairs.map(([a, c], k) => `<div class="sh-row" style="--r:${k}"><span class="sh-a">${esc(a)}</span><svg class="sh-arr" viewBox="0 0 40 12" aria-hidden="true"><path d="M2 6h32M28 1l6 5-6 5"/></svg><span class="sh-b">${esc(c)}</span></div>`).join('')}</div>`;
    case 'table': return `<div class="g-tablewrap" ${st}><table class="g-table"><thead><tr>${b.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'compare': return `<div class="g-compare" ${st}>${[b.a, b.b].map(c => `<div class="cmp"><h4>${esc(c[0])}</h4><ul>${c.slice(1).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('<span class="cmp-vs">или</span>')}</div>`;
    case 'ex': return `<div class="g-ex" ${st}>${b.items.map(x => { const k = x.indexOf(' = '); const en = x.slice(0, k), ru = x.slice(k + 3); return `<div class="exm"><button class="say" data-say="${esc(en)}" aria-label="Послушать">${icon('sound')}</button><span class="en">${esc(en)}</span><span class="ru">${esc(ru)}</span></div>`; }).join('')}</div>`;
    case 'markers': return `<div class="g-markers" ${st}><span class="mk-t">Слова-подсказки</span>${b.t.split(',').map(x => `<span class="mk">${esc(x.trim())}</span>`).join('')}</div>`;
    case 'tip': return `<p class="tip" ${st}>${esc(b.t)}</p>`;
  }
  return '';
}
const videoURL = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
function topicHTML(t, { practice = true } = {}) {
  const n = t.gaps.length + t.forms.length;
  return `<div class="g-topic">
    ${t.b.map(blockHTML).join('')}
    <div class="g-foot">
      <a class="btn btn-ghost btn-sm" href="${videoURL(t.v || t.t)}" target="_blank" rel="noopener">${icon('video')}Видеоуроки на YouTube</a>
      ${practice && n ? `<button class="btn btn-sm" data-practice="${t.id}">${icon('repeat')}Потренировать тему</button>` : ''}
    </div>
  </div>`;
}
function drawMoves(root = document) {
  $$('.g-move', root).forEach(fig => {
    const a = $('.mv-a .hl', fig), b = $('.mv-b .hl', fig), svg = $('.mv-svg', fig);
    if (!a || !b || !svg) return;
    const fr = fig.getBoundingClientRect(), ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    if (!fr.width) return;
    const x1 = ra.left + ra.width / 2 - fr.left, y1 = ra.bottom - fr.top + 2, x2 = rb.left + rb.width / 2 - fr.left, y2 = rb.top - fr.top - 4;
    const my = (y1 + y2) / 2;
    svg.setAttribute('width', fr.width); svg.setAttribute('height', fr.height);
    svg.innerHTML = `<defs><marker id="mvh${fig.dataset.n || ''}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mv-head"/></marker></defs>
      <path class="mv-path" pathLength="1" d="M${x1} ${y1} C ${x1} ${my + 6}, ${x2} ${my - 6}, ${x2} ${y2}" marker-end="url(#mvh${fig.dataset.n || ''})"/>`;
  });
}
let mvN = 0;
function afterTopicRender(root) { $$('.g-move', root).forEach(f => { f.dataset.n = ++mvN; }); requestAnimationFrame(() => drawMoves(root)); setTimeout(() => drawMoves(root), 400); }
window.addEventListener('resize', () => { clearTimeout(window.__mvT); window.__mvT = setTimeout(() => drawMoves(), 120); });

/* ================= генерация заданий ================= */
const unitWords = u => u.lessons.flatMap(l => l.words);
function others(pool, w, field, n) { return shuffle(uniq(pool.filter(x => x.en !== w.en && x.ru !== w.ru).map(x => x[field]))).filter(v => v !== w[field]).slice(0, n); }
const exPick = (w, pool, dir) => dir === 'en'
  ? { type: 'pick', dir, q: w.en, answer: w.ru, opts: shuffle([w.ru, ...others(pool, w, 'ru', 3)]), words: [w.en], en: w.en, ru: w.ru }
  : { type: 'pick', dir, q: w.ru, answer: w.en, opts: shuffle([w.en, ...others(pool, w, 'en', 3)]), words: [w.en], en: w.en, ru: w.ru };
const exListen = (w, pool) => TTS.ok ? { type: 'listen', answer: w.en, opts: shuffle([w.en, ...others(pool, w, 'en', 3)]), words: [w.en], en: w.en, ru: w.ru } : exPick(w, pool, 'en');
const exMatch = ws => { ws = ws.filter((w, i) => ws.findIndex(x => x.ru === w.ru || x.en === w.en) === i).slice(0, 5); return { type: 'match', pairs: ws, words: ws.map(w => w.en) }; };
const exGap = g => ({ type: 'gap', g, opts: shuffle(g.opts), answer: g.answer, item: g.text, en: g.before + g.answer + g.after, ru: g.ru });
const exForm = f => ({ type: 'form', f, answer: f.answers[0], alts: f.answers, item: f.text, en: f.en, ru: f.ru });
function exBuild(s, pool, listen, nd = 2) {
  const toks = tokens(s.en), low = toks.map(t => t.toLowerCase());
  const extra = shuffle(uniq(pool.map(w => w.en).filter(e => !/\s/.test(e) && !low.includes(e.toLowerCase())))).slice(0, nd);
  return { type: 'build', listen: listen && TTS.ok, ru: s.ru, answer: s.en, en: s.en, tiles: shuffle([...toks, ...extra]) };
}
const exType = w => ({ type: 'type', ru: w.ru, answer: w.en, alts: RU_INDEX.get(norm(w.ru)) || [w.en], words: [w.en], en: w.en });
const exTypeSent = s => ({ type: 'type', ru: s.ru, answer: s.en, alts: [s.en], en: s.en, sentence: true });
const exListenType = w => TTS.ok ? { type: 'type', listen: true, ru: w.ru, answer: w.en, alts: [w.en], words: [w.en], en: w.en } : exType(w);

function lessonGaps(l) { return uniq([...l.ownGaps, ...(l.topic ? l.topic.gaps : [])]); }
function lessonForms(l) { return uniq([...l.ownForms, ...(l.topic ? l.topic.forms : [])]); }
function buildLesson(l) {
  const pool = unitWords(l.unit).concat(allWords(l.unit.grade).slice(0, 80));
  const W = shuffle(l.words), S = shuffle(l.sents), w = i => W[i % W.length], s = i => S[i % S.length];
  const big = l.unit.grade >= 6;
  const G = shuffle(lessonGaps(l)).slice(0, big ? 5 : 4);
  const F = [...shuffle(l.ownForms), ...shuffle(l.topic ? l.topic.forms : [])].filter((x, i, a) => a.indexOf(x) === i).slice(0, big ? 5 : 2);
  const g = i => G[i] && exGap(G[i]), f = i => F[i] && exForm(F[i]);
  const ex = [
    exPick(w(0), pool, 'en'), exPick(w(1), pool, 'ru'),
    g(0), f(0),
    exBuild(s(0), pool, false),
    exMatch(sample(l.words, Math.min(5, l.words.length))),
    g(1), exListen(w(2), pool),
    f(1), exBuild(s(1), pool, false),
    g(2), exPick(w(3), pool, 'ru'),
    f(2), exBuild(s(2), pool, true),
    g(3), exPick(w(5), pool, 'en'),
    f(3), exBuild(s(3), pool, false),
    g(4), exType(w(4)),
    f(4), big ? exBuild(s(4), pool, false) : null,
  ];
  return ex.filter(Boolean);
}
function buildTest(units, sz) {
  const words = units.flatMap(unitWords), sents = units.flatMap(u => u.lessons.flatMap(l => l.sents));
  const gaps = uniq(units.flatMap(u => u.lessons.flatMap(lessonGaps))), forms = uniq(units.flatMap(u => u.lessons.flatMap(lessonForms)));
  const short = sents.filter(s => tokens(s.en).length <= 6);
  const ws = sample(words, sz.pick + sz.type + sz.listen + sz.ltype); let k = 0;
  const ex = [];
  sample(gaps, sz.gap).forEach(g => ex.push(exGap(g)));
  sample(sents, sz.build).forEach((s, i) => ex.push(exBuild(s, words, i < sz.lbuild, 3)));
  for (let i = 0; i < sz.pick; i++) ex.push(exPick(ws[k++], words, i % 2 ? 'ru' : 'en'));
  for (let i = 0; i < sz.listen; i++) ex.push(exListen(ws[k++], words));
  const easy = shuffle(ex.filter(Boolean));
  const hard = [];
  sample(forms, sz.form).forEach(f => hard.push(exForm(f)));
  for (let i = 0; i < sz.type; i++) hard.push(exType(ws[k++]));
  for (let i = 0; i < sz.ltype; i++) hard.push(exListenType(ws[k++]));
  sample(short, sz.tsent).forEach(s => hard.push(exTypeSent(s)));
  return [...easy, ...shuffle(hard.filter(Boolean))];
}
const buildUnitTest = u => buildTest([u], { gap: 5, form: 5, build: 3, lbuild: 1, pick: 2, type: 2, listen: 1, ltype: 1, tsent: 1 });
const buildFinal = g => buildTest(COURSE[g].units, { gap: 10, form: 10, build: 6, lbuild: 2, pick: 3, type: 4, listen: 2, ltype: 2, tsent: 3 });
function buildPractice(t) {
  const ex = [...t.gaps.map(exGap), ...t.forms.map(exForm)];
  const pool = [...LESSONS.values()].slice(0, 40).flatMap(l => l.words);
  t.exs.slice(0, 3).forEach(s => ex.push(exBuild(s, pool, false, 2)));
  return shuffle(ex).slice(0, 16);
}
function buildReview() {
  let ws = dueWords().map(wordByEn).filter(Boolean);
  if (ws.length < 6) {
    const known = Object.entries(P.words).sort((a, b) => a[1].s - b[1].s).map(([en]) => wordByEn(en)).filter(Boolean);
    ws = uniq([...ws, ...known]).slice(0, 8);
  }
  ws = sample(ws, Math.min(10, ws.length));
  const pool = [...LESSONS.values()].flatMap(l => l.words);
  const ex = ws.map((w, i) => [exPick(w, pool, 'en'), exPick(w, pool, 'ru'), exListen(w, pool), exType(w)][i % 4]);
  if (ws.length >= 4) ex.splice(2, 0, exMatch(sample(ws, Math.min(5, ws.length))));
  dueItems().slice(0, 8).map(itemByText).filter(Boolean).forEach(x => ex.push(x.kind === 'gap' ? exGap(x) : exForm(x)));
  return shuffle(ex);
}

/* ================= оболочка ================= */
const app = $('#app');
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
const routeParts = () => (location.hash.replace(/^#\/?/, '') || 'path').split('/');

function render() {
  closePop();
  if (!P) return renderAuth();
  const [r, arg] = routeParts();
  cardsInit();
  const views = { path: viewPath, review: viewReview, grammar: viewGrammar, dream: viewDream, me: viewMe };
  const view = views[r] || viewPath, cur = views[r] ? r : 'path';
  const nav = [['path', 'Путь', 'path'], ['grammar', 'Грамматика', 'scheme'], ['review', 'Повторение', 'repeat'], ['me', 'Профиль', 'user']];
  const due = dueWords().length + dueItems().length;
  const navHTML = nav.map(([k, t, ic]) => `<a href="#/${k}" class="${cur === k ? 'on' : ''}">${icon(ic)}<span>${t}</span>${k === 'review' && due ? `<b class="badge">${due}</b>` : ''}</a>`).join('');
  app.innerHTML = `
  <div class="shell">
    <header class="top">
      <a class="brand" href="#/path">${logo()}<span>Английский путь</span></a>
      <nav class="nav">${navHTML}</nav>
      <div class="top-stats">
        ${cloudChip()}
        <span class="chip" title="Дней подряд">${icon('flame')}${P.streak.last >= today() - 1 ? P.streak.n : 0}</span>
        <span class="chip" title="Опыт">${icon('bolt')}${P.xp}</span>
      </div>
    </header>
    <main class="main" id="main">${view(arg)}</main>
    <nav class="tabbar">${navHTML}</nav>
  </div>`;
  (after[cur] || (() => {}))(arg);
}
const after = {
  path() {
    drawTracks();
    const c = $('.st.is-current');
    if (c && !render.scrolled) { render.scrolled = true; setTimeout(() => c.scrollIntoView({ block: 'center' }), 50); }
  },
  grammar(arg) { if (arg) afterTopicRender($('#main')); else bindGrammarSearch(); },
  dream() { bindDream(); },
  me() { bindMe(); },
};
const logo = () => `<svg class="logo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="20" class="logo-bg"/><path d="M12 28c0-9 16-7 16-16" class="logo-line"/><circle cx="12" cy="28" r="3.6" class="logo-dot"/><circle cx="28" cy="12" r="3.6" class="logo-dot"/></svg>`;

function ring(val, max, size = 60) {
  const r = size / 2 - 5, c = 2 * Math.PI * r, p = Math.min(1, max ? val / max : 0);
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
}
function stepLabel(st) {
  if (!st) return { t: 'Весь курс пройден' };
  if (st.kind === 'lesson') return { t: st.l.t, s: `${st.l.unit.grade} класс, ${st.l.unit.title}` };
  if (st.kind === 'test') return { t: 'Тест модуля', s: `${st.u.grade} класс, ${st.u.title}` };
  return { t: 'Итоговая контрольная', s: `${st.g} класс` };
}
function todayPanel() {
  const st = nextStep(), lb = stepLabel(st), m = todayMin(), due = dueWords().length + dueItems().length;
  return `
  <section class="today">
    <div class="ring-wrap">${ring(m, P.goal.minutes)}<span>${m}</span></div>
    <div class="today-t">
      <h3>Сегодня</h3>
      <p class="muted">${m >= P.goal.minutes ? 'Норма выполнена' : `${m} из ${P.goal.minutes} минут`}</p>
    </div>
    <div class="today-act">
      ${st ? `<button class="btn" data-act="next"><span class="btn-col"><span>Продолжить</span><small>${esc(lb.t)}</small></span></button>` : ''}
      ${due ? `<button class="btn btn-ghost" data-act="review">${icon('repeat')}Повторить ${due}</button>` : ''}
    </div>
  </section>`;
}

/* ================= вход ================= */
let onb = null;
const freshOnb = () => ({ step: 0, nick: '', pass: '', grade: 5, target: 'grade', minutes: 30, weeks: 13 });
function authFrame(inner) {
  const bg = PHOTOS.length ? PHOTOS[strHash('auth' + Math.floor(Date.now() / 3600000)) % PHOTOS.length] : null;
  return `${bg ? `<div class="auth-bg" aria-hidden="true"><img src="${photoSrc(bg)}" alt=""></div>` : ''}<div class="auth">
    <div class="auth-art">
      <span class="ghost-num" aria-hidden="true">5–11</span>
      <h1>Английский<br>путь</h1>
      <p>Школьная программа с 5 по 11 класс. Грамматика в схемах, практика по-настоящему, уровень до B2.</p>
    </div>
    ${inner}
  </div>`;
}
function renderAuth() {
  const names = Object.keys(DB.profiles);
  if (!onb && (names.length || sb)) return renderPicker(names);
  onb = onb || freshOnb();
  const steps = [stepNick, stepGrade, stepGoal, stepPlan];
  const card = `<form class="auth-card" id="onb" novalidate><div class="dots">${steps.map((_, i) => `<i class="${i <= onb.step ? 'on' : ''}"></i>`).join('')}</div>${steps[onb.step]()}</form>`;
  const old = $('#onb');
  if (old) old.outerHTML = card; else app.innerHTML = authFrame(card);
  bindOnb();
}
function heroArt() {
  return `<svg class="hero-art" viewBox="0 0 360 120" aria-hidden="true">
    <path class="hero-line" d="M14 100 C 70 100, 70 64, 120 64 S 190 36, 240 36 S 320 20, 346 16"/>
    ${[[14, 100, '5'], [120, 64, '7'], [240, 36, '9'], [346, 16, '11']].map(([x, y, t], i) => `<g class="hero-st" style="--d:${i * 0.22}s"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 4}">${t}</text></g>`).join('')}
  </svg>`;
}
const stepNick = () => `
  <h2>Как тебя зовут?</h2>
  <p class="muted">${sb ? 'Придумай ник и пароль. С ними ты войдёшь с телефона, планшета или другого компьютера — прогресс подтянется сам.' : 'Придумай ник. Пароль — по желанию.'}</p>
  <label class="field"><span>Ник</span><input name="nick" maxlength="20" autocomplete="username" value="${esc(onb.nick)}" placeholder="например, sasha_8a" required></label>
  <label class="field"><span>${sb ? 'Пароль (минимум 6 символов)' : 'Пароль (необязательно)'}</span><input name="pass" type="password" maxlength="40" value="${esc(onb.pass)}" autocomplete="new-password"></label>
  <p class="err" id="err"></p>
  <div class="row-end">${Object.keys(DB.profiles).length || sb ? '<button type="button" class="btn btn-ghost" data-act="cancel">Назад</button>' : ''}<button class="btn">Дальше</button></div>`;
const stepGrade = () => `
  <h2>В каком ты классе?</h2>
  <p class="muted">Путь всё равно начинается с 5-го. Знаешь программу — сдай итоговую контрольную класса и переходи к следующему.</p>
  <div class="pick-grid">${ALL_GRADES.map(g => `<button type="button" class="opt opt-sq ${onb.grade === g ? 'sel' : ''}" data-grade="${g}">${g}</button>`).join('')}<button type="button" class="opt opt-sq wide ${onb.grade === 12 ? 'sel' : ''}" data-grade="12">Уже не в школе</button></div>
  <div class="row-end"><button type="button" class="btn btn-ghost" data-act="back">Назад</button><button class="btn">Дальше</button></div>`;
const stepGoal = () => `
  <h2>Какая цель?</h2>
  <div class="seg col">${Object.entries(TARGETS).map(([k, t]) => `<button type="button" class="opt ${onb.target === k ? 'sel' : ''}" data-target="${k}">${t}</button>`).join('')}</div>
  <h3 class="h-sub">Минут в день</h3>
  <div class="seg">${MINUTES.map(m => `<button type="button" class="opt ${onb.minutes === m ? 'sel' : ''}" data-min="${m}">${m}</button>`).join('')}</div>
  <h3 class="h-sub">Срок</h3>
  <div class="seg">${DEADLINES.map(([w, t]) => `<button type="button" class="opt ${onb.weeks === w ? 'sel' : ''}" data-weeks="${w}">${t}</button>`).join('')}</div>
  <div class="row-end"><button type="button" class="btn btn-ghost" data-act="back">Назад</button><button class="btn">Посчитать план</button></div>`;
function stepPlan() {
  const prev = P;
  P = newProfile(onb.nick, null, onb.grade, { target: onb.target, minutes: onb.minutes, weeks: onb.weeks });
  const pi = planInfo(), txt = planText(pi); P = prev;
  const lessonsDay = Math.max(1, Math.round(onb.minutes / 12));
  return `
  <h2>Твой план</h2>
  <div class="plan-box ${pi.ok ? '' : 'warn'}">
    <p><b>Каждый день:</b> ${lessonsDay} ${plural(lessonsDay, 'урок', 'урока', 'уроков')} и повторение, около ${onb.minutes} минут.</p>
    <p>${esc(txt)}</p>
    ${onb.grade > 5 ? `<p><b>Не с нуля?</b> На карте у каждого класса есть итоговая контрольная — сдай её на 80%, и класс засчитан.</p>` : ''}
  </div>
  <p class="muted small">Это программа сайта: грамматика, слова, перевод, аудирование. Для настоящего B2 добавь чтение книг и разговорную практику.</p>
  <div class="row-end"><button type="button" class="btn btn-ghost" data-act="back">Назад</button><button class="btn">Начать</button></div>`;
}
function bindOnb() {
  const f = $('#onb');
  f.addEventListener('click', e => {
    const b = e.target.closest('button[type=button]'); if (!b) return;
    if (b.dataset.act === 'back') { onb.step--; return renderAuth(); }
    if (b.dataset.act === 'cancel') { onb = null; app.innerHTML = ''; return renderAuth(); }
    for (const k of ['grade', 'target', 'min', 'weeks']) if (b.dataset[k] != null) {
      onb[k === 'min' ? 'minutes' : k] = k === 'target' ? b.dataset[k] : +b.dataset[k];
      $$(`[data-${k}]`, f).forEach(x => x.classList.toggle('sel', x === b));
    }
  });
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (onb.step === 0) {
      const nick = f.nick.value.trim();
      if (nick.length < 2) return showErr('Ник — минимум 2 символа.');
      if (DB.profiles[nick]) return showErr('Такой ник уже есть на этом устройстве.');
      if (sb) {
        if (f.pass.value.length < 6) return showErr('Пароль — минимум 6 символов: с ним ты войдёшь с других устройств.');
        showErr('Проверяю ник…');
        if (await loginEmail(nick)) return showErr('Такой ник уже занят. Если это ты — вернись назад и нажми «Войти».');
        showErr('');
      }
      onb.nick = nick; onb.pass = f.pass.value;
    }
    if (onb.step === 3) {
      const btn = f.querySelector('button:not([type])'); btn.disabled = true; btn.textContent = 'Создаю…';
      const prof = newProfile(onb.nick, onb.pass ? await hashPass(onb.nick, onb.pass) : null, onb.grade, { target: onb.target, minutes: onb.minutes, weeks: onb.weeks });
      DB.profiles[prof.nick] = prof; DB.current = prof.nick; P = prof; save();
      const pass = onb.pass; onb = null; chooseVoice();
      if (sb && pass) { const err = await cloudRegister(prof.nick, pass); if (err) toast(err + ' Пока прогресс сохраняется на этом устройстве; подключить облако можно в профиле.'); }
      render.scrolled = false; app.innerHTML = ''; location.hash = '#/path'; render(); return;
    }
    onb.step++; renderAuth();
    const first = $('#onb input'); if (first) first.focus();
  });
  const first = $('#onb input'); if (first && !first.value) first.focus();
}
function showErr(t) { const e = $('#err'); if (e) e.textContent = t; }
function renderPicker(names) {
  app.innerHTML = authFrame(`
    <div class="auth-card">
      ${names.length ? `<h2>Кто занимается?</h2>
      <div class="who">${names.map(n => { const p = DB.profiles[n]; return `<button class="who-btn" data-nick="${esc(n)}"><span class="ava">${esc(n[0].toUpperCase())}</span><span><b>${esc(n)}</b><small>${p.grade < 12 ? p.grade + ' класс' : 'не в школе'}, ${p.xp} XP${p.cloud ? ', в облаке' : ''}</small></span>${p.cloud ? icon('cloud', 'muted') : p.pass ? icon('lock', 'muted') : ''}</button>`; }).join('')}</div>
      <form id="pw" class="hidden" novalidate><label class="field"><span>Пароль</span><input type="password" name="pass" autocomplete="current-password"></label><p class="err" id="err"></p><div class="row-end"><button class="btn">Войти</button></div></form>` : '<h2>Добро пожаловать</h2><p class="muted">Начни с нуля или войди, если уже занимаешься на другом устройстве.</p>'}
      <button class="btn btn-wide" data-act="new">Новый ученик</button>
      ${sb ? `<button class="btn btn-ghost btn-wide" data-act="cloud">${icon('cloud')}Уже занимаюсь — войти по нику</button>
      <form id="cl" class="hidden" novalidate>
        <label class="field"><span>Ник</span><input name="nick" maxlength="20" autocomplete="username"></label>
        <label class="field"><span>Пароль</span><input name="pass" type="password" autocomplete="current-password"></label>
        <p class="err" id="err2"></p><div class="row-end"><button class="btn">Войти</button></div>
      </form>` : ''}
    </div>`);
  let chosen = null;
  $('.auth-card').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act === 'new') { onb = freshOnb(); app.innerHTML = ''; return renderAuth(); }
    if (b.dataset.act === 'cloud') { $('#cl').classList.toggle('hidden'); $('#cl input').focus(); return; }
    if (b.dataset.nick) {
      chosen = b.dataset.nick;
      $$('.who-btn').forEach(x => x.classList.toggle('sel', x === b));
      if (!DB.profiles[chosen].pass) return login(chosen);
      $('#pw').classList.remove('hidden'); $('#pw input').value = ''; $('#pw input').focus();
    }
  });
  const pw = $('#pw');
  pw && pw.addEventListener('submit', async e => {
    e.preventDefault();
    const pass = e.target.pass.value, p = DB.profiles[chosen];
    const okLocal = await hashPass(chosen, pass) === p.pass;
    if (p.cloud && sb) {
      showErr('Вхожу…');
      if (okLocal && await cloudUid() === p.cloud.uid) return login(chosen);
      const r = await cloudLogin(chosen, pass);
      if (r.error) { if (okLocal) { toast('Облако недоступно — открываю данные с этого устройства.'); return login(chosen); } return showErr(r.error); }
      return finishCloudLogin(r, pass);
    }
    if (!okLocal) return showErr('Пароль не подходит.');
    login(chosen);
  });
  const cl = $('#cl');
  cl && cl.addEventListener('submit', async e => {
    e.preventDefault();
    const nick = cl.nick.value.trim(), pass = cl.pass.value, err = t => { $('#err2').textContent = t; };
    if (!nick || !pass) return err('Введи ник и пароль.');
    err('Вхожу…');
    const r = await cloudLogin(nick, pass);
    if (r.error) return err(r.error);
    if (!r.row) return err('Аккаунт найден, но прогресса в облаке нет. Создай профиль заново.');
    finishCloudLogin(r, pass);
  });
}
async function finishCloudLogin(r, pass) {
  const nick = r.row.nick;
  const local = Object.values(DB.profiles).find(p => p.cloud && p.cloud.uid === r.uid) || DB.profiles[nick];
  let prof = local ? mergeP(migrate(local), r.row.data) : migrate(r.row.data);
  if (local && local.nick !== nick) delete DB.profiles[local.nick];
  prof.nick = nick; prof.cloud = { uid: r.uid }; prof.pass = await hashPass(nick, pass);
  DB.profiles[nick] = prof; login(nick);
  toast('Прогресс загружен из облака');
}
function login(nick) {
  cloudReady = false;
  P = migrate(DB.profiles[nick]); DB.current = nick; save(); chooseVoice(); render.scrolled = false; viewGrade = null; cal = null;
  location.hash = '#/path'; render();
  if (P.cloud) cloudPull();
}

/* ================= карта ================= */
const ST_GAP = 96, ST_W = 300;
const stPos = (i, ui) => ({ x: ST_W / 2 + 78 * Math.sin(i * 1.15 + ui * 0.9), y: 70 + i * ST_GAP });
let viewGrade = null;
function currentGrade() { const s = nextStep(); return s ? (s.l ? s.l.unit.grade : s.u ? s.u.grade : s.g) : 11; }
function viewPath(arg) {
  const g = arg && gradeExists(+arg) ? +arg : (viewGrade || currentGrade());
  viewGrade = g;
  const G = COURSE[g], open = gradeOpen(g), gp = gradeProgress(g);
  const plaques = ALL_GRADES.map(n => {
    const o = gradeOpen(n), pass = gradePassed(n);
    return `<a class="grade ${n === g ? 'on' : ''} ${o ? '' : 'locked'} ${pass ? 'passed' : ''}" href="#/path/${n}" aria-label="${n} класс"><b>${n}</b>${pass ? icon('check') : o ? `<span>${Math.round(gradeProgress(n) * 100)}%</span>` : icon('lock')}</a>`;
  }).join('');
  const pd = SHOW_PHOTO_OF_DAY ? photoOfDay() : null, pq = pd && quoteFor(pd);
  return `
  <section class="hero ${pd ? 'hero-ph' : ''}">
    <span class="ghost-num" aria-hidden="true">${pad2(g)}</span>
    <div class="hero-t">
      <p class="hero-lvl">${G.level}</p>
      <h1>${G.title}</h1>
      <div class="hero-bar"><i style="transform:scaleX(${gp})"></i></div>
      <p class="muted">${gradePassed(g) ? `Сдан на ${P.grades[g].best}%` : `${Math.round(gp * 100)}% пройдено, ${G.units.length} модулей, ${G.units.reduce((a, u) => a + u.lessons.length, 0)} уроков`}</p>
      <nav class="grades" aria-label="Классы">${plaques}</nav>
    </div>
    ${pd ? `<figure class="hero-photo" data-ph="${pd.id}" data-any="1">
      <img src="${photoSrc(pd)}" alt="" fetchpriority="high">
      <figcaption><span class="ph-k">Фото дня</span>${quoteHTML(pq)}</figcaption>
    </figure>` : ''}
  </section>
  ${todayPanel()}
  ${!open ? `<div class="banner">${icon('lock')}<div><b>${g} класс пока закрыт.</b> Сдай итоговую контрольную ${g - 1} класса — или пройди его модули.</div><a class="btn btn-sm" href="#/path/${g - 1}">К ${g - 1} классу</a></div>` : ''}
  ${open && g === 5 && P.grade > 5 && !gradePassed(5) ? `<div class="banner">${icon('bolt')}<div><b>Ты в ${P.grade < 12 ? P.grade + ' классе' : 'старше школы'}.</b> Проходи классы контрольными: 40 заданий, 80% — и класс засчитан.</div><button class="btn btn-sm" data-final="5">Контрольная 5 класса</button></div>` : ''}
  <div class="route ${open ? '' : 'route-locked'}">
    ${G.units.map(unitHTML).join('')}
    ${finalHTML(g)}
  </div>`;
}
function unitHTML(u) {
  const open = unitOpen(u), passed = unitPassed(u), done = unitLessonsDone(u), n = u.lessons.length + 1;
  const best = P.units[u.key] && P.units[u.key].best;
  const nx = nextStep();
  const sts = u.lessons.map((l, i) => {
    const d = lessonDone(l), o = lessonOpen(l), cur = !d && o && nx && nx.l === l, p = stPos(i, u.index);
    return `<button class="st ${d ? 'is-done' : cur ? 'is-current' : o ? 'is-open' : 'is-locked'} ${p.x >= ST_W / 2 ? 'name-left' : ''}" style="left:${p.x}px;top:${p.y}px;--i:${i}" data-st="lesson" data-key="${l.key}" aria-label="Урок ${i + 1}: ${esc(l.t)}">
      ${d ? icon('check') : o ? `<span>${i + 1}</span>` : icon('lock')}${cur ? '<em class="st-tag">Начать</em>' : ''}
      <span class="st-name">${esc(l.t)}</span></button>`;
  });
  const p = stPos(u.lessons.length, u.index), curT = !passed && open && done === u.lessons.length;
  sts.push(`<button class="st st-test ${passed ? 'is-done' : curT ? 'is-current' : open ? 'is-open' : 'is-locked'} ${p.x >= ST_W / 2 ? 'name-left' : ''}" style="left:${p.x}px;top:${p.y}px;--i:${u.lessons.length}" data-st="test" data-key="${u.key}" aria-label="Тест модуля">${passed ? icon('trophy') : icon('flag')}${curT ? '<em class="st-tag">Тест</em>' : ''}<span class="st-name">Тест модуля</span></button>`);
  const h = stPos(n - 1, 0).y + 60;
  return `
  <section class="unit ${open ? '' : 'unit-locked'} ${passed ? 'unit-passed' : ''}" id="${u.key}">
    <header class="unit-head">
      <span class="unit-ghost" aria-hidden="true">${pad2(u.index + (u.grade === 5 ? 0 : 1))}</span>
      <p class="unit-k">Модуль ${u.index + (u.grade === 5 ? 0 : 1)}</p>
      <h2>${esc(u.title)}</h2>
      <p class="unit-sub">${esc(u.sub)}</p>
      <span class="unit-meta">${passed ? `${icon('check')}${best ? best + '%' : 'сдан'}` : `${done} из ${u.lessons.length}`}</span>
    </header>
    ${(() => {
      const ph = unitPhoto(u), flip = UNIT_ORD.get(u.key) % 2 === 1, q = ph && quoteFor(ph);
      return `<div class="unit-body ${ph ? 'with-ph' : ''} ${flip ? 'flip names-left' : 'names-right'}">
      ${ph ? `<figure class="unit-photo ${open ? '' : 'dim'}" style="--ar:${ph.w}/${ph.h}"><img src="${photoSrc(ph)}" alt="" loading="lazy" decoding="async">${q ? `<figcaption>${quoteHTML(q)}</figcaption>` : ''}</figure>` : ''}
      <div class="stations-col"><div class="stations" style="height:${h}px" data-unit="${u.key}" data-n="${n}">
        <svg class="track" width="${ST_W}" height="${h}" aria-hidden="true"></svg>
        ${sts.join('')}
      </div></div>
    </div>`; })()}
    ${!passed && gradeOpen(u.grade) && done < u.lessons.length ? `<button class="extern" data-st="test" data-key="${u.key}">${icon('bolt')}Знаю эту тему — сдать модуль тестом</button>` : ''}
  </section>`;
}
function finalHTML(g) {
  const all = COURSE[g].units.every(unitPassed), rec = P.grades[g], open = gradeOpen(g);
  return `
  <section class="final ${gradePassed(g) ? 'final-done' : ''}">
    <span class="ghost-num sm" aria-hidden="true">${pad2(g)}</span>
    ${icon('trophy', 'final-ic')}
    <h2>Итоговая контрольная</h2>
    <p>${gradePassed(g) ? `Сдана на ${rec.best}%. ${g < 11 ? `Открыт ${g + 1} класс.` : 'Курс завершён.'}` : all ? '40 заданий по всему классу. Нужно 80%.' : 'Знаешь программу класса? Сдай на 80% — и весь класс засчитан, откроется следующий.'}</p>
    ${open ? `<button class="btn ${all || gradePassed(g) ? '' : 'btn-ghost'}" data-final="${g}">${gradePassed(g) ? 'Пересдать' : all ? 'Начать контрольную' : 'Сдать экстерном'}</button>` : ''}
  </section>`;
}
function drawTracks() {
  $$('.stations').forEach(box => {
    const u = UNITS.get(box.dataset.unit), n = +box.dataset.n;
    const pts = Array.from({ length: n }, (_, i) => stPos(i, u.index));
    let base = '', done = '';
    for (let i = 0; i < n - 1; i++) {
      const a = pts[i], b = pts[i + 1], seg = `M${a.x} ${a.y} C${a.x} ${a.y + 48} ${b.x} ${b.y - 48} ${b.x} ${b.y}`;
      base += seg;
      if (i < u.lessons.length && lessonDone(u.lessons[i]) && (i + 1 >= u.lessons.length ? unitLessonsDone(u) === u.lessons.length : lessonDone(u.lessons[i + 1]) || lessonOpen(u.lessons[i + 1]))) done += seg;
    }
    $('svg', box).innerHTML = `<path class="track-base" d="${base}"/><path class="track-done" d="${done}"/>`;
  });
}
let popEl = null;
function closePop() { if (popEl) { popEl.remove(); popEl = null; } }
function openPop(btn) {
  closePop();
  const kind = btn.dataset.st, key = btn.dataset.key;
  let t, s, act = null, label = '', extra = '';
  if (kind === 'lesson') {
    const l = LESSONS.get(key), d = lessonDone(l), o = lessonOpen(l);
    t = l.t; s = `Урок ${l.index + 1} из ${l.unit.lessons.length}. ` + (d ? 'Пройден — можно повторить.' : o ? `Схема правила, слова и около ${buildLesson(l).length} заданий. ${LESSON_MIN(l.unit.grade) - 2}–${LESSON_MIN(l.unit.grade) + 2} минут.` : 'Сначала пройди предыдущий урок.');
    if (l.topic) extra = `<a class="pop-topic" href="#/grammar/${l.topic.id}">${icon('scheme')}${esc(l.topic.t)}</a>`;
    if (o) { act = `lesson:${key}`; label = d ? 'Повторить' : 'Начать'; }
  } else {
    const u = UNITS.get(key), passed = unitPassed(u), all = unitLessonsDone(u) === u.lessons.length, rec = P.units[key];
    t = `Тест: ${u.title}`;
    s = passed ? `Сдан${rec && rec.best ? ` на ${rec.best}%` : ''}. Можно пересдать.` : all ? '20 заданий по модулю. Нужно 80%.' : 'Сдай на 80% — и модуль засчитан без уроков. 20 заданий.';
    if (gradeOpen(u.grade)) { act = `test:${key}`; label = passed ? 'Пересдать' : all ? 'Начать тест' : 'Сдать экстерном'; }
  }
  popEl = document.createElement('div'); popEl.className = 'pop';
  popEl.innerHTML = `<h3>${esc(t)}</h3><p>${esc(s)}</p>${extra}${act ? `<button class="btn btn-wide btn-inv" data-go="${act}">${label}</button>` : ''}`;
  const box = btn.closest('.stations') || btn.closest('.unit');
  box.appendChild(popEl);
  if (btn.classList.contains('st')) {
    const x = parseFloat(btn.style.left), y = parseFloat(btn.style.top), cx = Math.max(130, Math.min(ST_W - 130, x));
    popEl.style.left = cx + 'px'; popEl.style.top = (y + 44) + 'px'; popEl.style.setProperty('--ax', (x - cx + 140) + 'px');
  } else popEl.classList.add('pop-static');
  requestAnimationFrame(() => popEl && popEl.classList.add('in'));
}

/* ================= грамматика ================= */
function viewGrammar(arg) {
  const t = arg && GR.get(arg);
  if (t) {
    const lessons = [...LESSONS.values()].filter(l => l.topic === t);
    const grades = uniq(lessons.map(l => l.unit.grade));
    return `
    <article class="page topic-page">
      <a class="back" href="#/grammar">${icon('back')}Все темы</a>
      <p class="hero-lvl">${t.lvl}, ${LEVELS[t.lvl]}${grades.length ? `. Встречается: ${grades.join(', ')} класс` : ''}</p>
      <h1 class="page-h">${esc(t.t)}</h1>
      ${topicHTML(t)}
    </article>`;
  }
  const by = ['A1', 'A2', 'B1', 'B2'].map(lv => [lv, window.GRAMMAR.filter(x => x.lvl === lv)]);
  return `
  <div class="page">
    <section class="hero hero-plain">
      <span class="ghost-num" aria-hidden="true">${window.GRAMMAR.length}</span>
      <div class="hero-t"><p class="hero-lvl">Справочник</p><h1>Грамматика</h1><p class="muted">Все темы с 5 по 11 класс: схемы, линии времени, стрелки, примеры с озвучкой и тренировка по каждой теме.</p></div>
    </section>
    <label class="search">${icon('search')}<input id="gq" placeholder="Найти тему: Present Perfect, пассив, артикли…" autocomplete="off"></label>
    ${by.map(([lv, list]) => `
      <section class="lvl-group" data-lvl="${lv}">
        <h2 class="lvl-h"><span>${lv}</span>${LEVELS[lv]}</h2>
        <div class="topic-grid">${list.map(x => `<a class="topic-card" href="#/grammar/${x.id}" data-q="${esc((x.t + ' ' + x.id + ' ' + x.b.map(b => b.t || '').join(' ')).toLowerCase())}">
          <b>${esc(x.t)}</b><span>${x.gaps.length + x.forms.length} заданий${P.topics[x.id] ? `, лучший результат ${P.topics[x.id]}%` : ''}</span></a>`).join('')}</div>
      </section>`).join('')}
  </div>`;
}
function bindGrammarSearch() {
  $('#gq').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $$('.topic-card').forEach(c => { c.hidden = !!q && !c.dataset.q.includes(q); });
    $$('.lvl-group').forEach(s => { s.hidden = !$$('.topic-card', s).some(c => !c.hidden); });
  });
}

/* ================= повторение / профиль ================= */
/* ================= мечты ================= */
let dreamFilter = 'all';
function viewDream() {
  cardsInit();
  const n = P.cards.length, total = PHOTOS.length, open = new Set(P.cards), favs = new Set(P.favs);
  const opened = [...P.cards].reverse().map(id => PH.get(id)).filter(Boolean); // свежие открытые — первыми
  const list = dreamFilter === 'favs' ? opened.filter(p => favs.has(p.id)) : dreamFilter === 'open' ? opened : [...opened, ...PHOTOS.filter(p => !open.has(p.id))];
  return `
  <div class="page page-wide">
    <section class="hero hero-plain">
      <span class="ghost-num" aria-hidden="true">${n}</span>
      <div class="hero-t">
        <p class="hero-lvl">Коллекция</p>
        <h1>Мечты</h1>
        <div class="hero-bar"><i style="transform:scaleX(${total ? n / total : 0})"></i></div>
        <p class="muted">Открыто ${n} из ${total}. Каждый урок открывает новую карточку, тест модуля — две, итоговая — три.</p>
      </div>
    </section>
    <div class="seg dream-seg">
      ${[['all', 'Все'], ['open', 'Открытые'], ['favs', `Моя доска${favs.size ? ' · ' + favs.size : ''}`]].map(([k, t]) => `<button class="opt ${dreamFilter === k ? 'sel' : ''}" data-df="${k}">${t}</button>`).join('')}
    </div>
    ${list.length ? `<div class="masonry">${list.map(p => {
      const o = open.has(p.id);
      return `<button class="ph-tile ${o ? '' : 'locked'} ${favs.has(p.id) ? 'fav' : ''}" data-ph="${p.id}" style="aspect-ratio:${p.w}/${p.h}" aria-label="${o ? 'Открыть фото' : 'Закрытая карточка'}">
        <img src="${photoSrc(p, true)}" alt="" loading="lazy" decoding="async">
        ${o ? (favs.has(p.id) ? `<span class="ph-heart">${icon('heart')}</span>` : '') : `<span class="ph-lock">${icon('lock')}</span>`}
      </button>`;
    }).join('')}</div>` : `<p class="empty">${dreamFilter === 'favs' ? 'Отмечай сердечком карточки, которые вдохновляют больше всего, — они соберутся здесь.' : 'Пока пусто.'}</p>`}
  </div>`;
}
function bindDream() {
  $('.dream-seg').addEventListener('click', e => { const b = e.target.closest('[data-df]'); if (!b) return; dreamFilter = b.dataset.df; render(); });
}
// просмотр фото на весь экран
let lb = null;
function openLightbox(id, any) {
  cardsInit();
  const openIds = PHOTOS.filter(p => P.cards.includes(p.id)).map(p => p.id);
  const ids = any && !openIds.includes(id) ? [id, ...openIds] : openIds; // фото дня видно всем, остальные — только открытые
  if (!any && !P.cards.includes(id)) { const left = PHOTOS.length - P.cards.length; return toast(`Карточка закрыта. Пройди урок — откроется следующая (осталось ${left}).`); }
  lb = { ids: ids.includes(id) ? ids : [id], i: Math.max(0, ids.indexOf(id)) };
  const el = document.createElement('div'); el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Фото');
  document.body.appendChild(el); document.body.classList.add('noscroll');
  lbShow(); requestAnimationFrame(() => el.classList.add('in'));
  el.addEventListener('click', e => {
    const fv = e.target.closest('[data-fav]'); if (fv) return toggleFav(fv.dataset.fav);
    const a = e.target.closest('[data-lb]');
    if (a) { const d = a.dataset.lb; if (d === 'close') return closeLightbox(); lb.i = (lb.i + (d === 'next' ? 1 : -1) + lb.ids.length) % lb.ids.length; return lbShow(); }
    if (e.target === el || e.target.classList.contains('lb-stage')) closeLightbox();
  });
}
function lbShow() {
  const p = PH.get(lb.ids[lb.i]), q = quoteFor(p), el = $('.lb');
  const opened = P.cards.includes(p.id);
  el.innerHTML = `
    <button class="icon-btn lb-x" data-lb="close" aria-label="Закрыть">${icon('x')}</button>
    <div class="lb-stage">
      ${lb.ids.length > 1 ? `<button class="lb-nav prev" data-lb="prev" aria-label="Предыдущее">${icon('back')}</button>` : ''}
      <figure class="lb-fig"><img src="${photoSrc(p)}" alt="" style="aspect-ratio:${p.w}/${p.h}">
        <figcaption>${quoteHTML(q)}<div class="lb-act">${opened ? favBtn(p.id) : ''}<span class="muted small">${lb.i + 1} / ${lb.ids.length}</span></div></figcaption>
      </figure>
      ${lb.ids.length > 1 ? `<button class="lb-nav next" data-lb="next" aria-label="Следующее">${icon('next')}</button>` : ''}
    </div>`;
}
function closeLightbox() { const el = $('.lb'); if (el) el.remove(); lb = null; if (!S) document.body.classList.remove('noscroll'); if (route() === 'dream') render(); }
const route = () => routeParts()[0];
document.addEventListener('keydown', e => {
  if (!lb) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') $('.lb [data-lb="next"]') && $('.lb [data-lb="next"]').click();
  if (e.key === 'ArrowLeft') $('.lb [data-lb="prev"]') && $('.lb [data-lb="prev"]').click();
});

function viewReview() {
  const due = dueWords(), di = dueItems(), known = Object.keys(P.words).length;
  const weak = Object.entries(P.words).sort((a, b) => a[1].s - b[1].s).slice(0, 12).map(([en]) => wordByEn(en)).filter(Boolean);
  return `
  <div class="page">
    <h1 class="page-h">Повторение</h1>
    <p class="lead">Слова возвращаются через 1, 2, 4, 7, 15 и 30 дней. Грамматика, где была ошибка, — завтра и ещё раз через 3 дня.</p>
    <div class="stat-row">
      <div class="stat"><b>${due.length}</b><span>слов ждут</span></div>
      <div class="stat"><b>${di.length}</b><span>правил ждут</span></div>
      <div class="stat"><b>${known}</b><span>слов в копилке</span></div>
      <div class="stat"><b>${Object.values(P.words).filter(w => w.s >= 4).length}</b><span>выучено прочно</span></div>
    </div>
    ${known ? `<div><button class="btn" data-act="review">${icon('repeat')}${due.length + di.length ? 'Повторить сейчас' : 'Потренировать слабые слова'}</button></div>` : '<p class="empty">Пройди первый урок — слова появятся здесь.</p>'}
    ${weak.length ? `<h2 class="h-sub">Слабые места</h2><ul class="wordlist">${weak.map(w => `<li><button class="say" data-say="${esc(w.en)}" aria-label="Послушать">${icon('sound')}</button><b>${esc(w.en)}</b><span>${esc(w.ru)}</span><i class="lvl" style="--l:${P.words[w.en].s}"></i></li>`).join('')}</ul>` : ''}
  </div>`;
}
function viewMe() {
  const lessons = Object.keys(P.lessons).length, pi = planInfo();
  return `
  <div class="page">
    <div class="me-head" id="mehead">${meHeadHTML()}</div>
    <section class="cloud-card" id="cloudcard">${cloudCardHTML()}</section>
    <div class="stat-row">
      <div class="stat"><b>${P.xp}</b><span>опыт</span></div>
      <div class="stat"><b>${P.streak.best}</b><span>лучшая серия</span></div>
      <div class="stat"><b>${lessons}</b><span>${plural(lessons, 'урок', 'урока', 'уроков')}</span></div>
      <div class="stat"><b>${Math.round(totalMin())}</b><span>минут всего</span></div>
    </div>
    ${!SHOW_DREAM ? '' : (() => { cardsInit(); const f = P.favs.map(id => PH.get(id)).filter(Boolean); return `
    <h2 class="h-sub">Моя доска мечты <span class="muted">${f.length ? f.length + ' фото' : ''}</span></h2>
    ${f.length ? `<div class="fav-strip">${f.slice(0, 12).map(p => `<button class="ph-tile" data-ph="${p.id}" style="aspect-ratio:${p.w}/${p.h}"><img src="${photoSrc(p, true)}" alt="" loading="lazy"></button>`).join('')}</div>`
      : `<p class="empty">Открой фото в разделе <a href="#/dream">Мечты</a> и нажми «На мою доску» — оно появится здесь.</p>`}`; })()}
    <h2 class="h-sub">Календарь занятий</h2>
    <section class="cal" id="cal">${calHTML()}</section>
    <h2 class="h-sub">Классы</h2>
    <div class="grade-list">${ALL_GRADES.map(g => `<div class="gl-row"><b>${g}</b><div class="gl-bar"><i style="transform:scaleX(${gradeProgress(g)})"></i></div><span>${gradePassed(g) ? `сдан, ${P.grades[g].best}%` : gradeOpen(g) ? Math.round(gradeProgress(g) * 100) + '%' : 'закрыт'}</span></div>`).join('')}</div>
    <h2 class="h-sub">Цель</h2>
    <div class="goal-form">
      <div class="seg">${Object.entries(TARGETS).map(([k, t]) => `<button class="opt ${P.goal.target === k ? 'sel' : ''}" data-target="${k}">${t}</button>`).join('')}</div>
      <div class="seg">${MINUTES.map(m => `<button class="opt ${P.goal.minutes === m ? 'sel' : ''}" data-min="${m}">${m} мин</button>`).join('')}</div>
      <div class="seg">${DEADLINES.map(([w, t]) => `<button class="opt ${P.goal.weeks === w ? 'sel' : ''}" data-weeks="${w}">${t}</button>`).join('')}</div>
      <p class="plan-box ${pi.ok ? '' : 'warn'}">${esc(planText(pi))}</p>
    </div>
    <h2 class="h-sub">Достижения <span class="muted">${Object.keys(P.ach).length} из ${ACH.length}</span></h2>
    <div class="ach-grid">${ACH.map(a => `<div class="ach ${P.ach[a.id] ? 'got' : ''}">${icon(a.i)}<b>${a.t}</b><span>${a.d}</span></div>`).join('')}</div>
    <h2 class="h-sub">Настройки</h2>
    <div class="settings">
      <label class="field"><span>Голос</span>
        <span class="row"><select id="voice">${TTS.list.length ? TTS.list.map(v => `<option value="${esc(v.name)}" ${TTS.voice && TTS.voice.name === v.name ? 'selected' : ''}>${esc(v.name)} (${v.lang})</option>`).join('') : '<option>Английских голосов нет</option>'}</select>
        <button class="btn btn-ghost btn-sm" data-say="Hello! My name is Anna. I'm from London.">${icon('play')}Проверить</button></span></label>
      <label class="switch"><input type="checkbox" id="snd" ${P.settings.sound ? 'checked' : ''}><span>Звуки ответов</span></label>
      <div class="row">
        <button class="btn btn-ghost btn-sm" data-act="export">Сохранить прогресс в файл</button>
        <label class="btn btn-ghost btn-sm file-btn">Загрузить из файла<input type="file" id="imp" accept=".json,application/json"></label>
      </div>
      <p class="muted small">${P.cloud ? 'Файл — запасная копия на всякий случай.' : 'Без облака прогресс хранится только в этом браузере. Файл — запасная копия.'}</p>
    </div>
  </div>`;
}
/* ---- имя ---- */
function meHeadHTML(edit = false) {
  const sub = `${P.grade < 12 ? P.grade + ' класс' : 'Не в школе'}, с ${new Date(P.created).toLocaleDateString('ru-RU')}`;
  if (!edit) return `<span class="ava big">${esc(P.nick[0].toUpperCase())}</span>
    <div class="me-name"><h1 class="page-h">${esc(P.nick)}</h1><p class="muted">${sub}</p></div>
    <div class="me-btns"><button class="btn btn-ghost btn-sm" data-me="rename">${icon('pencil')}Изменить имя</button><button class="btn btn-ghost btn-sm" data-act="logout">${icon('door')}Выйти</button></div>`;
  return `<span class="ava big">${esc(P.nick[0].toUpperCase())}</span>
    <form class="rename" id="rename" novalidate>
      <label class="field"><span>Новое имя</span><input name="nick" maxlength="20" autocomplete="off" value="${esc(P.nick)}"></label>
      ${P.pass ? '<label class="field"><span>Текущий пароль — для подтверждения</span><input name="pass" type="password" autocomplete="current-password"></label>' : ''}
      <p class="err" id="err"></p>
      <div class="row"><button class="btn btn-sm">Сохранить</button><button type="button" class="btn btn-ghost btn-sm" data-me="cancel">Отмена</button></div>
    </form>`;
}
async function renameTo(nick, pass) {
  nick = nick.trim();
  if (nick.length < 2) return 'Имя — минимум 2 символа.';
  if (nick === P.nick) return null;
  if (DB.profiles[nick]) return 'Такое имя уже есть на этом устройстве.';
  if (P.pass && await hashPass(P.nick, pass || '') !== P.pass) return 'Пароль не подходит.';
  if (P.cloud) {
    if (!sb) return 'Нет связи с облаком — имя можно сменить, когда появится интернет.';
    const owner = await loginEmail(nick);
    if (owner) return 'Такое имя уже занято в облаке.';
  }
  const oldNick = P.nick, oldPass = P.pass;
  if (P.pass) P.pass = await hashPass(nick, pass); // пароль привязан к имени — пересчитываем
  delete DB.profiles[oldNick]; P.nick = nick; DB.profiles[nick] = P; DB.current = nick;
  try { localStorage.setItem(LS_KEY, JSON.stringify(DB)); } catch { /* */ }
  if (P.cloud) {
    const err = await pushNow();
    if (err) { delete DB.profiles[nick]; P.nick = oldNick; P.pass = oldPass; DB.profiles[oldNick] = P; DB.current = oldNick; save(); return err; }
  }
  return null;
}

/* ---- облако в профиле ---- */
function cloudCardHTML() {
  if (!sb) return `<div class="cc-row">${icon('cloud')}<div><b>Облако недоступно</b><p class="muted small">Нет связи с сервером — прогресс сохраняется только на этом устройстве.</p></div></div>`;
  if (P.cloud) return `<div class="cc-row">${icon('cloud')}<div><b>Прогресс сохраняется в облаке</b>
    <p class="muted small">На другом устройстве открой сайт → «Уже занимаюсь — войти по нику» → ник <b>${esc(P.nick)}</b> и твой пароль. Уроки, календарь и заметки подтянутся сами.</p></div>
    <button class="btn btn-ghost btn-sm" data-cc="sync">${icon('repeat')}Обновить</button></div>`;
  return `<div class="cc-row">${icon('cloud')}<div><b>Облако не подключено</b>
    <p class="muted small">Сейчас прогресс живёт только в этом браузере. Подключи облако — и занимайся с телефона, планшета и других компьютеров.</p></div></div>
    <form class="cc-form" id="ccform" novalidate>
      <label class="field"><span>Придумай пароль для входа (минимум 6 символов)</span><input name="pass" type="password" autocomplete="new-password"></label>
      ${P.pass ? '<label class="field"><span>Текущий пароль профиля</span><input name="old" type="password" autocomplete="current-password"></label>' : ''}
      <p class="err" id="ccerr"></p>
      <div class="row"><button class="btn btn-sm">${icon('cloud')}Подключить облако</button></div>
    </form>`;
}
function bindCloudCard() {
  const box = $('#cloudcard'); if (!box) return;
  box.addEventListener('click', async e => {
    const b = e.target.closest('[data-cc]'); if (!b) return;
    b.disabled = true; await cloudPull(); b.disabled = false; toast(cloudState === 'ok' ? 'Всё синхронизировано' : 'Нет связи с облаком');
  });
  const f = $('#ccform', box); if (!f) return;
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const err = t => { $('#ccerr', box).textContent = t; };
    if (P.pass && await hashPass(P.nick, f.old.value) !== P.pass) return err('Текущий пароль не подходит.');
    if (f.pass.value.length < 6) return err('Пароль — минимум 6 символов.');
    err('Подключаю…');
    const r = await cloudRegister(P.nick, f.pass.value);
    if (r && !P.cloud) return err(r); // аккаунт не создан
    P.pass = await hashPass(P.nick, f.pass.value); save();
    toast(r ? 'Облако подключено. Первое сохранение не прошло — повторю автоматически.' : 'Облако подключено'); render();
  });
}

/* ---- календарь и заметки ---- */
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const dayNumOf = (y, m, d) => Math.floor(Date.UTC(y, m, d) / 86400000);
let cal = null;
function calInit() { if (!cal) { const n = new Date(); cal = { y: n.getFullYear(), m: n.getMonth(), sel: today() }; } }
const dayMin = d => Math.round((P.days[d] && P.days[d].min) || 0);
function dayLevel(d) { const m = dayMin(d), g = P.goal.minutes; return !m ? 0 : m < g ? 1 : m < g * 1.5 ? 2 : 3; }
const LEVEL_TXT = ['Занятий не было', 'Мало', 'Норма', 'Больше нормы'];
function dayLog(d) {
  const r = P.days[d];
  if (r && r.log && r.log.length) return r.log;
  return [...LESSONS.values()].filter(l => P.lessons[l.key] && P.lessons[l.key].at === d).map(l => `Урок «${l.t}»`);
}
function calHTML() {
  calInit();
  const { y, m } = cal, first = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate(), t = today();
  let cells = '';
  for (let i = 0; i < first; i++) cells += '<span class="cd-empty"></span>';
  let active = 0, mins = 0, norm = 0;
  for (let d = 1; d <= n; d++) {
    const dn = dayNumOf(y, m, d), lv = dayLevel(dn), mm = dayMin(dn), note = !!(P.notes[dn] || '').trim();
    if (mm) { active++; mins += mm; if (lv >= 2) norm++; }
    cells += `<button class="cd lv${lv} ${dn === t ? 'today' : ''} ${dn === cal.sel ? 'sel' : ''} ${dn > t ? 'future' : ''} ${note ? 'has-note' : ''}" data-day="${dn}" aria-label="${d} ${MONTHS[m].toLowerCase()}: ${LEVEL_TXT[lv]}${mm ? ', ' + mm + ' мин' : ''}${note ? ', есть заметка' : ''}">
      <span class="cd-n">${d}</span>${mm ? `<small>${mm}′</small>` : ''}${note ? '<i class="cd-note"></i>' : ''}</button>`;
  }
  const isNow = y === new Date().getFullYear() && m === new Date().getMonth();
  return `
  <div class="cal-grid-wrap">
    <div class="cal-head">
      <button class="icon-btn" data-cal="prev" aria-label="Предыдущий месяц">${icon('back')}</button>
      <h3>${MONTHS[m]} ${y}</h3>
      <button class="icon-btn flip" data-cal="next" aria-label="Следующий месяц">${icon('back')}</button>
      ${isNow ? '' : '<button class="btn btn-ghost btn-sm" data-cal="today">Сегодня</button>'}
    </div>
    <p class="cal-sum">${active ? `${active} ${plural(active, 'день', 'дня', 'дней')} занятий, ${mins} мин, норма — ${norm} ${plural(norm, 'раз', 'раза', 'раз')}` : 'В этом месяце занятий пока нет'}</p>
    <div class="cal-grid">${WEEKDAYS.map(w => `<span class="cd-w">${w}</span>`).join('')}${cells}</div>
    <div class="cal-legend">
      <span><i class="lg lv0"></i>не занимался</span><span><i class="lg lv1"></i>мало</span><span><i class="lg lv2"></i>норма</span><span><i class="lg lv3"></i>больше нормы</span><span><i class="lg-note"></i>заметка</span>
    </div>
  </div>
  <div class="cal-day" id="calday">${calDayHTML()}</div>`;
}
function calDayHTML() {
  const d = cal.sel, dt = dayToDate(d), t = today(), lv = dayLevel(d), mm = dayMin(d), log = dayLog(d), xp = (P.days[d] && P.days[d].xp) || 0;
  const wd = dt.toLocaleDateString('ru-RU', { weekday: 'long' });
  const status = d > t ? 'Этот день ещё впереди' : lv === 0 ? 'Занятий не было' : `${LEVEL_TXT[lv]}: ${mm} из ${P.goal.minutes} мин`;
  return `
    <p class="cd-date">${fmtDate(d)}, ${wd}${d === t ? ' — сегодня' : ''}</p>
    <p class="cd-status"><i class="lg lv${lv}"></i>${status}${xp ? `<span class="muted">+${xp} опыта</span>` : ''}</p>
    ${log.length ? `<ul class="cd-log">${log.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    <label class="cd-notes"><span>Заметка${d > t ? ' (план)' : ''}</span>
      <textarea id="note" rows="5" placeholder="${d > t ? 'Что хочешь сделать в этот день…' : 'Что получилось, что было трудно, что повторить…'}">${esc(P.notes[d] || '')}</textarea></label>
    <p class="cd-saved muted small" id="saved">${P.notes[d] ? 'Сохранено' : 'Сохраняется само, пока пишешь'}</p>`;
}
function bindCal() {
  const box = $('#cal'); if (!box) return;
  box.addEventListener('click', e => {
    const nav = e.target.closest('[data-cal]');
    if (nav) {
      const a = nav.dataset.cal;
      if (a === 'today') { const n = new Date(); cal.y = n.getFullYear(); cal.m = n.getMonth(); cal.sel = today(); }
      else { cal.m += a === 'next' ? 1 : -1; if (cal.m < 0) { cal.m = 11; cal.y--; } if (cal.m > 11) { cal.m = 0; cal.y++; } }
      box.innerHTML = calHTML(); return;
    }
    const day = e.target.closest('[data-day]');
    if (day) {
      cal.sel = +day.dataset.day;
      $$('.cd', box).forEach(x => x.classList.toggle('sel', x === day));
      $('#calday').innerHTML = calDayHTML();
    }
  });
  let tm = null;
  box.addEventListener('input', e => {
    if (e.target.id !== 'note') return;
    const d = cal.sel, v = e.target.value;
    $('#saved').textContent = 'Сохраняю…';
    clearTimeout(tm);
    tm = setTimeout(() => {
      P.notes[d] = v.trim() ? v : ''; P.notesAt = P.notesAt || {}; P.notesAt[d] = Date.now();
      save();
      $('#saved').textContent = 'Сохранено';
      const cell = $(`.cd[data-day="${d}"]`, box);
      if (cell) {
        const has = !!v.trim(), mark = $('.cd-note', cell);
        cell.classList.toggle('has-note', has);
        if (has && !mark) cell.insertAdjacentHTML('beforeend', '<i class="cd-note"></i>');
        if (!has && mark) mark.remove();
      }
    }, 350);
  });
}

function bindMe() {
  bindCal(); bindCloudCard();
  const head = $('#mehead');
  head.addEventListener('click', e => {
    const b = e.target.closest('[data-me]'); if (!b) return;
    head.innerHTML = meHeadHTML(b.dataset.me === 'rename');
    const f = $('#rename', head);
    if (f) {
      f.nick.focus(); f.nick.select();
      f.addEventListener('submit', async ev => {
        ev.preventDefault();
        const err = await renameTo(f.nick.value, f.pass && f.pass.value);
        if (err) { $('#err', head).textContent = err; return; }
        toast(`Имя изменено: ${P.nick}`); render();
      });
    }
  });
  const v = $('#voice');
  v && v.addEventListener('change', () => { P.settings.voice = v.value; chooseVoice(); save(); });
  $('#snd').addEventListener('change', e => { P.settings.sound = e.target.checked; save(); });
  $('#imp').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    f.text().then(t => {
      const data = JSON.parse(t);
      if (!data || !data.nick || !data.lessons) throw new Error('bad');
      DB.profiles[data.nick] = migrate(data); DB.current = data.nick; P = data; save(); toast(`Прогресс «${data.nick}» загружен`); render();
    }).catch(() => toast('Не тот файл: нужен файл из кнопки «Сохранить прогресс»'));
  });
  $('.goal-form').addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b) return;
    if (b.dataset.target) P.goal.target = b.dataset.target;
    if (b.dataset.min) P.goal.minutes = +b.dataset.min;
    if (b.dataset.weeks) { P.goal.weeks = +b.dataset.weeks; P.goal.start = today(); }
    P.goalAt = Date.now();
    save(); render();
  });
}

/* ================= клики ================= */
document.addEventListener('click', e => {
  const sayB = e.target.closest('[data-say]');
  if (sayB) { say(sayB.dataset.say, sayB.dataset.slow === '1'); if (!sayB.closest('.player')) return; }
  if (!P || S) return;
  if (e.target.closest('.lb')) return; // у просмотра фото свои обработчики
  const ph = e.target.closest('[data-ph]'); if (ph) return openLightbox(ph.dataset.ph, ph.dataset.any === '1');
  const fv = e.target.closest('[data-fav]'); if (fv) return toggleFav(fv.dataset.fav);
  const pr = e.target.closest('[data-practice]'); if (pr) return startPractice(GR.get(pr.dataset.practice));
  const fin = e.target.closest('[data-final]'); if (fin) return startFinal(+fin.dataset.final);
  const stB = e.target.closest('[data-st]');
  if (stB) { const id = stB.dataset.key + stB.className; if (popEl && popEl.dataset.for === id) return closePop(); openPop(stB); popEl.dataset.for = id; return; }
  const goB = e.target.closest('[data-go]');
  if (goB) { const [k, key] = goB.dataset.go.split(':'); closePop(); return k === 'lesson' ? startLesson(LESSONS.get(key)) : startTest(UNITS.get(key)); }
  if (popEl && !e.target.closest('.pop')) closePop();
  const a = e.target.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act === 'next') { const s = nextStep(); if (!s) return; if (s.kind === 'lesson') startLesson(s.l); else if (s.kind === 'test') startTest(s.u); else startFinal(s.g); }
  if (act === 'review') startReview();
  if (act === 'logout') {
    if (P.cloud && sb) { const t = cloudReady ? pushNow() : Promise.resolve(); t.finally(() => sb.auth.signOut({ scope: 'local' }).catch(() => {})); }
    cloudReady = false; P = null; DB.current = null; save(); onb = null; viewGrade = null; cal = null; app.innerHTML = ''; location.hash = ''; render(); }
  if (act === 'export') {
    const blob = new Blob([JSON.stringify(P, null, 1)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `английский-путь-${P.nick}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  }
});
function toast(t) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = t;
  $('#toasts').appendChild(el); requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 300); }, 2800);
}
function confirmBox(text, yes, no) {
  return new Promise(res => {
    const d = document.createElement('div'); d.className = 'modal';
    d.innerHTML = `<div class="modal-card"><p>${esc(text)}</p><div class="row-end"><button class="btn btn-ghost" data-r="0">${no}</button><button class="btn" data-r="1">${yes}</button></div></div>`;
    document.body.appendChild(d); requestAnimationFrame(() => d.classList.add('in'));
    d.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b && e.target !== d) return; d.remove(); res(b ? b.dataset.r === '1' : false); });
  });
}

/* ================= плеер ================= */
let S = null;
function startLesson(l) { S = { mode: 'lesson', title: l.t, l, queue: buildLesson(l), intro: ['theory', 'words'] }; openPlayer(); }
function startTest(u) { S = { mode: 'test', title: `Тест: ${u.title}`, u, queue: buildUnitTest(u), intro: ['testinfo'] }; openPlayer(); }
function startFinal(g) { S = { mode: 'final', g, title: `Итоговая контрольная, ${g} класс`, queue: buildFinal(g), intro: ['testinfo'] }; openPlayer(); }
function startPractice(t) { S = { mode: 'practice', topic: t, title: t.t, queue: buildPractice(t), intro: [] }; openPlayer(); }
function startReview() {
  if (!Object.keys(P.words).length) return toast('Сначала пройди хотя бы один урок.');
  S = { mode: 'review', title: 'Повторение', queue: buildReview(), intro: [] }; openPlayer();
}
const isTest = () => S.mode === 'test' || S.mode === 'final';
function openPlayer() {
  Object.assign(S, { i: 0, total: S.queue.length, done: 0, correct: 0, wrongs: [], start: Date.now(), screens: 0, phStart: Math.floor(Math.random() * Math.max(1, PHOTOS.length)), phN: 0 });
  const el = document.createElement('div'); el.className = 'player' + (PHOTOS.length ? ' has-photo' : '');
  el.innerHTML = `
    ${PHOTOS.length ? `<div class="p-photo" aria-hidden="true"><img class="pp" alt=""><img class="pp" alt=""><div class="pp-cap"></div></div>` : ''}
    <div class="p-top">
      <button class="icon-btn" data-p="quit" aria-label="Выйти">${icon('x')}</button>
      <div class="bar"><i></i></div>
      <span class="p-count"></span>
    </div>
    <div class="p-stage"><div class="p-inner" id="stage"></div></div>
    <div class="p-foot" id="foot"><div class="foot-inner"><div class="fb" id="fb"></div><button class="btn" id="go" disabled>Проверить</button></div></div>`;
  document.body.appendChild(el); document.body.classList.add('noscroll');
  requestAnimationFrame(() => el.classList.add('in'));
  el.addEventListener('click', onPlayerClick);
  document.addEventListener('keydown', onKey);
  nextScreen();
}
function closePlayer() {
  const el = $('.player'); document.removeEventListener('keydown', onKey);
  if (el) el.remove(); document.body.classList.remove('noscroll');
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  S = null; render();
}
async function onPlayerClick(e) {
  const fv = e.target.closest('[data-fav]'); if (fv) return toggleFav(fv.dataset.fav);
  const b = e.target.closest('[data-p]'); if (!b) return;
  if (b.dataset.p === 'dream') { closePlayer(); location.hash = '#/dream'; return; }
  if (b.dataset.p === 'quit' && (S.phase === 'result' || await confirmBox(isTest() ? 'Выйти из теста? Результат не засчитается.' : 'Выйти? Прогресс этого урока не сохранится.', 'Выйти', 'Остаться'))) closePlayer();
}
function onKey(e) {
  if (!S || document.querySelector('.modal')) return;
  const inInput = e.target.tagName === 'INPUT';
  if (e.key === 'Enter') { const g = $('#go'); if (g && !g.disabled) { e.preventDefault(); g.click(); } return; }
  if (inInput) return;
  if (/^[1-9]$/.test(e.key)) { const t = $$('#stage .opt:not([disabled]), #stage .bank .tile:not(.used)')[+e.key - 1]; if (t) t.click(); }
  if (e.key === 'Backspace') { const last = $$('#stage .ans .tile').pop(); if (last) last.click(); }
}
function setBar() {
  const p = isTest() ? S.i / S.total : S.done / S.total;
  $('.player .bar i').style.transform = `scaleX(${Math.max(0.02, Math.min(1, p))})`;
  $('.player .p-count').textContent = isTest() ? `${Math.min(S.i + 1, S.total)} / ${S.total}` : `${Math.min(S.done, S.total)} / ${S.total}`;
}
function footReset(label = 'Проверить', enabled = false) {
  $('#foot').className = 'p-foot'; $('#fb').innerHTML = '';
  const g = $('#go'); g.textContent = label; g.disabled = !enabled; g.className = 'btn'; g.onclick = null;
  return g;
}
function swapStage(html) {
  const old = $('#stage'), st = document.createElement('div');
  st.id = 'stage'; st.className = 'p-inner enter'; st.innerHTML = html;
  old.replaceWith(st); $('.p-stage').scrollTop = 0;
  return st;
}
// большое фото в уроке: плавная смена каждые PLAYER_PHOTO_EVERY экранов
function playerPhoto() {
  const box = $('.player .p-photo'); if (!box || !PHOTOS.length) return;
  const p = PHOTOS[(S.phStart + S.phN++) % PHOTOS.length];
  const imgs = $$('img.pp', box), next = imgs.find(x => !x.classList.contains('on')) || imgs[0], cur = imgs.find(x => x.classList.contains('on'));
  const q = quoteFor(p), cap = $('.pp-cap', box);
  const show = () => {
    next.classList.add('on'); if (cur && cur !== next) cur.classList.remove('on');
    cap.classList.remove('on');
    setTimeout(() => { cap.innerHTML = q ? quoteHTML(q) : ''; cap.classList.toggle('on', !!q); }, 350);
  };
  next.onload = show; next.onerror = show; next.src = photoSrc(p);
  // заранее подгружаем следующее
  const after = PHOTOS[(S.phStart + S.phN) % PHOTOS.length]; if (after) { const pre = new Image(); pre.src = photoSrc(after); }
}
function nextScreen() {
  S.phase = 'ex'; setBar();
  if (S.screens++ % PLAYER_PHOTO_EVERY === 0) playerPhoto();
  if (S.intro.length) return showIntro(S.intro.shift());
  if (S.i >= S.queue.length) return finish();
  showExercise(S.queue[S.i]);
}
function showIntro(kind) {
  let html = '';
  if (kind === 'theory') {
    const l = S.l, t = l.topic;
    html = `<p class="ex-kicker">${l.unit.grade} класс. ${esc(l.unit.title)}, урок ${l.index + 1}</p><h2 class="ex-title">${esc(l.t)}</h2>
      ${t ? `<section class="g-card"><p class="g-card-k">${icon('scheme')}Грамматика: ${esc(t.t)}</p>${topicHTML(t, { practice: false })}</section>` : ''}
      ${l.th ? `<section class="theory card"><p class="g-card-k">В этом уроке</p>${theoryHTML(l.th)}</section>` : ''}`;
  }
  if (kind === 'words') html = `<h2 class="ex-title">Слова урока</h2><p class="muted">Нажми на слово, чтобы послушать.</p><ul class="wordlist big">${S.l.words.map(w => `<li data-say="${esc(w.en)}"><span class="say">${icon('sound')}</span><b>${esc(w.en)}</b><span>${esc(w.ru)}</span></li>`).join('')}</ul>`;
  if (kind === 'testinfo') {
    const allowed = Math.floor(S.total * 0.2);
    html = `<h2 class="ex-title">${esc(S.title)}</h2>
      <div class="card info">
        <p>${S.total} заданий. Чтобы сдать, нужно <b>80%</b> — не больше ${allowed} ${plural(allowed, 'ошибки', 'ошибок', 'ошибок')}.</p>
        <p>Подсказок и повторов нет. Половина — на ввод: раскрыть скобки, перевести, записать на слух${TTS.ok ? '' : ' (на этом устройстве нет английского голоса — аудио заменено)'}.</p>
        <p>${S.mode === 'final' ? `Сдашь — ${S.g} класс засчитан${S.g < 11 ? `, откроется ${S.g + 1}-й` : ''}.` : 'Сдашь — модуль закрыт, даже если уроки не пройдены.'}</p>
      </div>`;
  }
  const st = swapStage(html);
  if (kind === 'theory') afterTopicRender(st);
  const g = footReset(kind === 'testinfo' ? 'Начать' : kind === 'theory' ? 'Понятно, дальше' : 'К заданиям', true);
  g.onclick = () => nextScreen();
}
function theoryHTML(th) {
  return th.split('\n').map(line => {
    line = line.trim(); if (!line) return '';
    const b = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    if (line.startsWith('> ')) {
      const body = line.slice(2), i = body.indexOf(' = ');
      const en = i > -1 ? body.slice(0, i) : body, ru = i > -1 ? body.slice(i + 3) : '';
      return `<div class="exm"><button class="say" data-say="${esc(en)}" aria-label="Послушать">${icon('sound')}</button><span class="en">${b(en)}</span>${ru ? `<span class="ru">${b(ru)}</span>` : ''}</div>`;
    }
    if (line.startsWith('! ')) return `<p class="tip">${b(line.slice(2))}</p>`;
    return `<p>${b(line)}</p>`;
  }).join('');
}

/* --- задания --- */
let cur = null;
const TITLES = { pick: d => d === 'en' ? 'Как это по-русски?' : 'Как это по-английски?', listen: () => 'Что ты слышишь?', gap: () => 'Выбери верный вариант', form: () => 'Раскрой скобки', match: () => 'Найди пары' };
function showExercise(ex) {
  cur = { ex, value: null };
  const sp = (t, big) => TTS.ok ? `<button class="say ${big ? 'say-big' : ''}" data-say="${esc(t)}" aria-label="Послушать">${icon('sound')}</button>` : '';
  const slow = t => TTS.ok ? `<button class="say say-slow" data-say="${esc(t)}" data-slow="1" aria-label="Медленно">${icon('slow')}</button>` : '';
  const opts = (list, cls = '') => `<div class="opts ${cls}">${list.map((o, i) => `<button class="opt" data-v="${esc(o)}"><kbd>${i + 1}</kbd>${esc(o)}</button>`).join('')}</div>`;
  let html = '';
  if (ex.type === 'pick') html = `<h2 class="ex-title">${TITLES.pick(ex.dir)}</h2><div class="prompt">${ex.dir === 'en' ? sp(ex.en) : ''}<span class="q-word">${esc(ex.q)}</span></div>${opts(ex.opts)}`;
  if (ex.type === 'listen') html = `<h2 class="ex-title">${TITLES.listen()}</h2><div class="prompt center">${sp(ex.answer, true)}${slow(ex.answer)}</div>${opts(ex.opts)}`;
  if (ex.type === 'gap') html = `<h2 class="ex-title">${TITLES.gap()}</h2><p class="gap-s">${esc(ex.g.before)}<span class="slot">&nbsp;</span>${esc(ex.g.after)}</p>${ex.ru ? `<p class="muted">${esc(ex.ru)}</p>` : ''}${opts(ex.opts, 'opts-row')}`;
  if (ex.type === 'form') {
    html = `<h2 class="ex-title">${TITLES.form()}</h2>
      <p class="form-s">${esc(ex.f.before)}<span class="form-hint">(${esc(ex.f.hint)})</span><input class="form-in" id="tin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Ответ" size="${Math.max(6, ex.answer.length + 2)}">${esc(ex.f.after)}</p>
      ${ex.ru ? `<p class="muted">${esc(ex.ru)}</p>` : ''}
      <p class="small muted">Поставь слово в скобках в нужную форму. Отрицание и вопрос — целиком, как в переводе.</p>`;
  }
  if (ex.type === 'build') html = `<h2 class="ex-title">${ex.listen ? 'Собери, что слышишь' : 'Переведи'}</h2><div class="prompt">${ex.listen ? sp(ex.answer, true) + slow(ex.answer) : `<span class="q-sent">${esc(ex.ru)}</span>`}</div><div class="ans" aria-label="Твой ответ"></div><div class="bank">${ex.tiles.map((t, i) => `<button class="tile" data-ti="${i}">${esc(t)}</button>`).join('')}</div>`;
  if (ex.type === 'type') html = `<h2 class="ex-title">${ex.listen ? 'Напиши, что слышишь' : 'Напиши по-английски'}</h2><div class="prompt">${ex.listen ? sp(ex.answer, true) + slow(ex.answer) : `<span class="q-sent">${esc(ex.ru)}</span>`}</div><input class="type-in" id="tin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Пиши здесь">`;
  if (ex.type === 'match') {
    const L = shuffle(ex.pairs), R = shuffle(ex.pairs);
    html = `<h2 class="ex-title">${TITLES.match()}</h2><div class="match"><div>${L.map(w => `<button class="opt m-l" data-en="${esc(w.en)}">${esc(w.en)}</button>`).join('')}</div><div>${R.map(w => `<button class="opt m-r" data-en="${esc(w.en)}">${esc(w.ru)}</button>`).join('')}</div></div>`;
  }
  if (ex.type === 'build') cur.value = [];
  if (ex.type === 'match') cur.value = { left: null, right: null, matched: 0, miss: new Set() };
  swapStage(html); footReset(); bindExercise(ex);
  if ((ex.type === 'listen' || ex.listen) && TTS.ok) setTimeout(() => say(ex.answer), 250);
}
function bindExercise(ex) {
  const st = $('#stage'), go = $('#go');
  go.onclick = () => check();
  if (['pick', 'listen', 'gap'].includes(ex.type)) st.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || S.phase !== 'ex') return;
    $$('.opt', st).forEach(x => x.classList.toggle('sel', x === b));
    cur.value = b.dataset.v; go.disabled = false;
    if (ex.type === 'gap') { const s = $('.slot', st); s.textContent = cur.value; s.classList.add('filled'); }
    if (ex.type === 'pick' && ex.dir === 'ru') say(cur.value);
  });
  if (ex.type === 'build') {
    const ans = $('.ans', st);
    st.addEventListener('click', e => {
      if (S.phase !== 'ex') return;
      const t = e.target.closest('.tile'); if (!t) return;
      const i = +t.dataset.ti;
      if (t.closest('.bank')) { if (t.classList.contains('used')) return; t.classList.add('used'); cur.value.push(i); }
      else { cur.value = cur.value.filter(x => x !== i); $(`.bank .tile[data-ti="${i}"]`, st).classList.remove('used'); }
      ans.innerHTML = cur.value.map(k => `<button class="tile pop-in" data-ti="${k}">${esc(ex.tiles[k])}</button>`).join('');
      go.disabled = !cur.value.length;
    });
  }
  if (ex.type === 'type' || ex.type === 'form') {
    const inp = $('#tin', st); setTimeout(() => inp.focus(), 60);
    inp.addEventListener('input', () => { cur.value = inp.value; go.disabled = !inp.value.trim(); });
  }
  if (ex.type === 'match') st.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || b.disabled) return;
    const v = cur.value, side = b.classList.contains('m-l') ? 'left' : 'right';
    if (side === 'left') say(b.dataset.en);
    $$(`.m-${side[0]}`, st).forEach(x => x.classList.toggle('sel', x === b && v[side] !== b));
    v[side] = v[side] === b ? null : b;
    if (v.left && v.right) {
      const L = v.left, R = v.right; v.left = v.right = null;
      if (L.dataset.en === R.dataset.en) {
        [L, R].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
        if (++v.matched === ex.pairs.length) setTimeout(() => check(), 250);
      } else {
        v.miss.add(L.dataset.en); v.miss.add(R.dataset.en); sfx.bad();
        [L, R].forEach(x => { x.classList.remove('sel'); x.classList.add('bad'); setTimeout(() => x.classList.remove('bad'), 450); });
      }
    }
  });
}
function textMatch(v, answers) {
  const a = norm(v), targets = uniq(answers).map(norm);
  if (targets.includes(a)) return { ok: true };
  const best = Math.min(...targets.map(t => lev(a, t))), tl = targets[0].length;
  if ((tl >= 5 && best <= 1) || (tl >= 14 && best <= 2)) return { ok: true, almost: true };
  return { ok: false };
}
function evaluate(ex) {
  const v = cur.value;
  if (['pick', 'listen', 'gap'].includes(ex.type)) return { ok: v === ex.answer };
  if (ex.type === 'build') return { ok: norm(v.map(i => ex.tiles[i]).join(' ')) === norm(ex.answer) };
  if (ex.type === 'match') return { ok: v.miss.size === 0 };
  if (ex.type === 'type') return textMatch(v, [ex.answer, ...(ex.alts || [])]);
  if (ex.type === 'form') {
    // в «раскрой скобки» опечатка в окончании = ошибка, поэтому без «почти»
    const a = norm(v), ok = ex.alts.map(norm).includes(a);
    return { ok };
  }
  return { ok: false };
}
function check() {
  if (S.phase !== 'ex') return;
  const ex = cur.ex, r = evaluate(ex);
  S.phase = 'fb';
  if (ex.type === 'match') ex.pairs.forEach(w => updWord(w.en, !cur.value.miss.has(w.en)));
  else if (ex.words) ex.words.forEach(en => updWord(en, r.ok));
  if (ex.item) updItem(ex.item, r.ok);
  if (!ex.retry) { if (r.ok) S.correct++; else S.wrongs.push(ex); }
  if (r.ok || ex.type === 'match') S.done++;
  if (!r.ok && !isTest() && ex.type !== 'match' && !ex.retry) S.queue.push({ ...ex, retry: true, opts: ex.opts && shuffle(ex.opts), tiles: ex.tiles && shuffle(ex.tiles) });
  $$('#stage input').forEach(x => { x.readOnly = true; });
  if (['pick', 'listen', 'gap'].includes(ex.type)) $$('#stage .opt').forEach(x => { x.disabled = true; if (x.dataset.v === ex.answer) x.classList.add('ok'); else if (x.classList.contains('sel')) x.classList.add('bad'); });
  if (ex.type === 'form') { const i = $('#tin'); i.classList.add(r.ok ? 'ok' : 'bad'); }
  const showAns = ex.type === 'pick' ? (ex.dir === 'en' ? ex.ru : ex.en) : ex.en || ex.answer;
  const f = $('#foot'), fb = $('#fb');
  if (ex.type === 'match') { f.className = 'p-foot ok show'; fb.innerHTML = `<b>${r.ok ? 'Все пары без ошибок' : 'Все пары найдены'}</b>`; if (r.ok) sfx.ok(); }
  else if (r.ok) {
    f.className = 'p-foot ok show'; sfx.ok();
    const showEn = r.almost || ['build', 'gap', 'form'].includes(ex.type);
    fb.innerHTML = `<b>${r.almost ? 'Почти. Проверь написание' : rnd(['Верно', 'Отлично', 'Точно', 'Так и есть'])}</b>${showEn ? `<span class="fb-a">${esc(ex.en || ex.answer)}</span>` : ''}${ex.ru && (ex.listen || ex.type === 'listen') ? `<span class="fb-r">${esc(ex.ru)}</span>` : ''}`;
    if (TTS.ok && ['build', 'gap', 'form'].includes(ex.type) && !ex.listen) say(ex.en);
  } else {
    f.className = 'p-foot bad show'; sfx.bad();
    if (!reduced()) { const st = $('#stage'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake'); }
    fb.innerHTML = `<b>Правильно:</b><span class="fb-a">${esc(showAns)}</span>${ex.ru && ex.type !== 'pick' ? `<span class="fb-r">${esc(ex.ru)}</span>` : ''}`;
  }
  const g = $('#go'); g.textContent = 'Дальше'; g.disabled = false;
  g.className = 'btn ' + (r.ok || ex.type === 'match' ? 'btn-ok' : 'btn-bad');
  g.onclick = () => { S.i++; nextScreen(); };
  setBar(); g.focus({ preventScroll: true });
}

/* --- итог --- */
function finish() {
  S.phase = 'result';
  const min = Math.min(45, Math.max(0.5, (Date.now() - S.start) / 60000));
  const acc = Math.round(S.correct / S.total * 100), perfect = S.wrongs.length === 0;
  const d = dayRec(), before = d.min; d.min += min;
  d.dev = d.dev || {}; const dv = (d.dev[DEVICE] = d.dev[DEVICE] || { min: 0, xp: 0 }); dv.min += min;
  if (before < P.goal.minutes && d.min >= P.goal.minutes) P.stats.goalDays++;
  const t = today();
  if (P.streak.last !== t) { P.streak.n = P.streak.last === t - 1 ? P.streak.n + 1 : 1; P.streak.last = t; P.streak.best = Math.max(P.streak.best, P.streak.n); }
  let xp = 0, title = '', sub = '', passed = true;
  if (S.mode === 'lesson') {
    const prev = P.lessons[S.l.key];
    P.lessons[S.l.key] = { at: t, acc: Math.max(acc, prev ? prev.acc : 0), n: (prev ? prev.n : 0) + 1 };
    S.l.words.forEach(w => { if (!P.words[w.en]) P.words[w.en] = { s: 1, due: t + 1 }; });
    P.stats.lessons++; if (perfect) P.stats.perfect++;
    xp = prev ? 5 : 15 + (perfect ? 5 : 0);
    title = perfect ? 'Урок без ошибок' : 'Урок пройден';
    sub = `${S.l.t.replace(/[.!?]$/, '')}. Слова и правила добавлены в повторение.`;
  } else if (S.mode === 'review') { P.stats.reviews++; xp = 5; title = 'Повторение готово'; sub = 'То, где были ошибки, вернётся завтра.'; }
  else if (S.mode === 'practice') {
    P.stats.practice++; P.topics[S.topic.id] = Math.max(P.topics[S.topic.id] || 0, acc); xp = 5;
    title = acc >= 80 ? 'Тема закреплена' : 'Тему стоит повторить'; sub = `${S.topic.t}: ${acc}% верно.`;
  } else {
    passed = acc >= 80; P.stats.tests++; if (acc === 100) P.stats.ace++;
    if (S.mode === 'test') {
      const rec = P.units[S.u.key] || {}, wasExtern = unitLessonsDone(S.u) < S.u.lessons.length && !unitPassed(S.u);
      P.units[S.u.key] = { best: Math.max(rec.best || 0, acc), passed: rec.passed || passed, at: t };
      if (passed && wasExtern) P.stats.extern++;
      title = passed ? (wasExtern ? 'Модуль сдан экстерном' : 'Модуль закрыт') : 'Пока не сдан';
    } else {
      const rec = P.grades[S.g] || {};
      P.grades[S.g] = { best: Math.max(rec.best || 0, acc), passed: rec.passed || passed, at: t };
      title = passed ? `${S.g} класс сдан` : 'Контрольная пока не сдана';
      if (passed) viewGrade = Math.min(11, S.g + 1);
    }
    xp = passed ? (S.mode === 'final' ? 60 : 25) : 5;
    sub = passed ? `Результат ${acc}%.` : `Результат ${acc}%, нужно 80%. Разбери ошибки и попробуй снова — или пройди уроки.`;
  }
  P.xp += xp; d.xp += xp; dv.xp += xp;
  P.xpDev = P.xpDev || {}; P.xpDev[DEVICE] = (P.xpDev[DEVICE] || 0) + xp;
  // дневник для календаря
  const logLine = S.mode === 'lesson' ? `Урок «${S.l.t}» — ${acc}%`
    : S.mode === 'test' ? `Тест модуля «${S.u.title}» — ${acc}%${passed ? ', сдан' : ''}`
    : S.mode === 'final' ? `Итоговая ${S.g} класса — ${acc}%${passed ? ', сдана' : ''}`
    : S.mode === 'practice' ? `Тема «${S.topic.t}» — ${acc}%` : 'Повторение';
  (d.log = d.log || []).push(logLine);
  const newCards = passed && S.mode !== 'review' ? unlockCards(S.mode === 'final' ? 3 : S.mode === 'test' ? 2 : 1) : [];
  const fresh = checkAch(); save();
  const st = nextStep();
  const nc = newCards[0], ncq = nc && quoteFor(nc);
  swapStage(`
    <div class="result ${passed ? 'win' : 'lose'} ${nc ? 'has-card' : ''}">
      ${nc && SHOW_RESULT_CARD ? `<div class="reveal">
        <div class="reveal-card" style="--ar:${nc.w}/${nc.h}"><img src="${photoSrc(nc)}" alt=""></div>
        <p class="reveal-k">${newCards.length > 1 ? `+${newCards.length} карточки мечты` : 'Новая карточка мечты'} · ${P.cards.length} из ${PHOTOS.length}</p>
        ${quoteHTML(ncq)}
        <div class="reveal-act">${favBtn(nc.id)}<button class="btn btn-ghost btn-sm" data-p="dream">${icon('image')}Вся коллекция</button></div>
      </div>` : `<div class="res-ic">${icon(passed ? (isTest() ? 'trophy' : 'star') : 'repeat')}</div>`}
      <h2 class="res-t">${title}</h2>
      <p class="muted">${esc(sub)}</p>
      <div class="stat-row">
        <div class="stat"><b>${acc}%</b><span>точность</span></div>
        <div class="stat"><b>${Math.max(1, Math.round(min))}</b><span>мин</span></div>
        <div class="stat"><b>+${xp}</b><span>опыт</span></div>
      </div>
      ${nc && !SHOW_RESULT_CARD && SHOW_DREAM ? `<button class="card-note" data-p="dream">${icon('image')}<span>+${newCards.length} ${plural(newCards.length, 'карточка', 'карточки', 'карточек')} в «Мечтах» · ${P.cards.length} из ${PHOTOS.length}</span></button>` : ''}
      ${fresh.length ? `<h3 class="h-sub">${fresh.length > 1 ? 'Новые достижения' : 'Новое достижение'}</h3><div class="new-ach">${fresh.map(a => `<div class="ach got">${icon(a.i)}<b>${a.t}</b><span>${a.d}</span></div>`).join('')}</div>` : ''}
      ${S.wrongs.length ? `<h3 class="h-sub">Разбор ошибок</h3><ul class="mist">${S.wrongs.map(w => `<li><b>${esc(w.type === 'pick' ? (w.dir === 'en' ? w.en + ' — ' + w.ru : w.ru + ' — ' + w.en) : w.type === 'match' ? 'Пары слов' : (w.en || w.answer))}</b>${w.ru && w.type !== 'pick' ? `<span>${esc(w.ru)}</span>` : ''}</li>`).join('')}</ul>` : ''}
    </div>`);
  $('#foot').className = 'p-foot'; $('#fb').innerHTML = '';
  const g = $('#go'); g.className = 'btn'; g.disabled = false;
  const canNext = passed && st && ['lesson', 'test', 'final'].includes(S.mode);
  g.textContent = canNext ? (st.kind === 'lesson' ? 'Следующий урок' : st.kind === 'test' ? 'К тесту модуля' : 'К контрольной') : 'На карту';
  g.onclick = () => { closePlayer(); if (canNext) { if (st.kind === 'lesson') startLesson(st.l); else if (st.kind === 'test') startTest(st.u); else startFinal(st.g); } };
  $('.player .bar i').style.transform = 'scaleX(1)';
  if (passed && S.mode !== 'review') { sfx.done(); if (isTest() || perfect) confetti(); }
}
function confetti() {
  if (reduced()) return;
  const c = document.createElement('canvas'); c.className = 'confetti';
  const W = c.width = innerWidth, H = c.height = innerHeight; document.body.appendChild(c);
  const ctx = c.getContext('2d'), dark = matchMedia('(prefers-color-scheme: dark)').matches;
  const cols = dark ? ['#EDEDED', '#9A9A9A', '#5F5F5F', '#C9A44C'] : ['#121212', '#6E6E6E', '#C9C9C6', '#A07A1E'];
  const ps = Array.from({ length: 80 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 140, y: H * 0.32, vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 11 - 4, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, w: 5 + Math.random() * 6, c: rnd(cols) }));
  const t0 = performance.now();
  (function f(t) {
    const k = (t - t0) / 1600; ctx.clearRect(0, 0, W, H);
    for (const p of ps) { p.x += p.vx; p.y += p.vy; p.vy += 0.32; p.vx *= 0.99; p.r += p.vr; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); ctx.restore(); }
    if (k < 1) requestAnimationFrame(f); else c.remove();
  })(t0);
}

/* ================= старт ================= */
initVoices();
if (/[?&]debug\b/.test(location.search)) window.__ep = { cur: () => cur, S: () => S, P: () => P, norm, buildLesson, buildUnitTest, buildFinal, buildPractice, COURSE, GR, LESSONS };
if (DB.current && DB.profiles[DB.current] && !DB.profiles[DB.current].pass) P = migrate(DB.profiles[DB.current]);
// облачный профиль: если сессия на этом устройстве ещё жива — входим без пароля
if (!P && sb && DB.current && DB.profiles[DB.current] && DB.profiles[DB.current].cloud) {
  cloudUid().then(uid => { if (uid && uid === DB.profiles[DB.current].cloud.uid && !P) login(DB.current); });
}
render();
})();
