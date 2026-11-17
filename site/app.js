/* Английский путь — приложение (без сборки, прогресс хранится в браузере). */
'use strict';
(() => {

/* ================= язык интерфейса ================= */
// Английский режим: код и данные остаются русскими, а видимый текст подменяется по словарю data/ui-en.js.
// Точные строки — exact, строки с числами и подстановками — pat ({0}, {1}… переводятся рекурсивно).
const EN = window.UI_LANG === 'en';
const LOC = EN ? 'en-US' : 'ru-RU';
const CYR = /[А-Яа-яЁё]/;
const TR = (() => {
  const D = window.UI_EN || { exact: {}, pat: [] };
  const reEsc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pats = D.pat.map(([ru, en]) => {
    const parts = ru.split(/\{\d\}/), ids = (ru.match(/\{\d\}/g) || []).map(x => +x[1]);
    return { re: new RegExp('^' + parts.map(reEsc).join('([\\s\\S]*?)') + '$'), ids, en, w: parts.join('').length };
  }).sort((a, b) => b.w - a.w);
  return { exact: D.exact, pats };
})();
function trText(str, depth = 0) {
  if (!EN || !str || depth > 4 || !CYR.test(str)) return str;
  const core = str.trim();
  let out = TR.exact[core];
  // шаблон годится, только если всё, что попало в подстановки, тоже переводится (иначе «… класс» съел бы что угодно)
  if (out === undefined) for (const p of TR.pats) {
    const m = core.match(p.re); if (!m) continue;
    const caps = {}; let bad = false;
    p.ids.forEach((id, k) => { const v = trText(m[k + 1] || '', depth + 1); if (CYR.test(v)) bad = true; caps[id] = v; });
    if (bad) continue;
    out = p.en.replace(/\{(\d)\}/g, (_, d) => caps[d] || ''); break;
  }
  if (out === undefined) return str;
  return str.match(/^\s*/)[0] + out + str.match(/\s*$/)[0];
}
// не переводим содержание заданий, слова, ники и заметки
const NOTR = '.notr, #stage .opt, #stage .tile, .match, .q-word, .q-sent, .ru, .fb-a, .fb-r, .gap-s, .form-s, .wordlist, .mist, textarea, script, style, .who-btn b, .me-name h1, .adm-name b';
function trNode(root) {
  if (!EN || !root) return;
  if (root.nodeType === 3) {
    const p = root.parentElement;
    if (p && !p.closest(NOTR)) { const v = trText(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; }
    return;
  }
  if (root.nodeType !== 1) return;
  if (root.closest(NOTR)) { for (const el of root.querySelectorAll('[placeholder],[title],[aria-label]')) for (const a of ['placeholder', 'title', 'aria-label']) { const v = el.getAttribute(a); if (v && CYR.test(v)) el.setAttribute(a, trText(v)); } return; }
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    { acceptNode: n => n.nodeType === 1 ? (n.matches(NOTR) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP) : NodeFilter.FILTER_ACCEPT });
  let n; while ((n = w.nextNode())) { const v = trText(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  for (const el of [root, ...root.querySelectorAll('[placeholder],[title],[aria-label]')]) {
    for (const a of ['placeholder', 'title', 'aria-label']) { const v = el.getAttribute(a); if (v && CYR.test(v)) el.setAttribute(a, trText(v)); }
  }
}
if (EN) {
  new MutationObserver(ms => { for (const m of ms) { if (m.type === 'characterData') trNode(m.target); else m.addedNodes.forEach(trNode); } })
    .observe(document.body, { childList: true, subtree: true, characterData: true });
}
function setLang(l, reload = true) {
  try { localStorage.setItem('englishpath.lang', l); } catch { return; }
  if (reload && l !== window.UI_LANG) location.reload();
}

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
const fmtDate = n => { const d = dayToDate(n); return d.toLocaleDateString(LOC, { day: 'numeric', month: 'long', ...(d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}) }).replace(/\s?г\.$/, ''); };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const plural = (n, a, b, c) => { if (EN) return n === 1 ? a : c; const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
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
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.6 3.6-5.5 6.5-5.5s5.5 1.9 6.5 5.5"/><path d="M15.5 4.6a3.5 3.5 0 0 1 0 6.8M17.5 14.8c2 .6 3.4 2.3 4 5.2"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4.5 4"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  dollar: '<circle cx="12" cy="12" r="9"/><path d="M14.7 9.3c-.5-1-1.5-1.6-2.7-1.6-1.5 0-2.7.9-2.7 2.1 0 2.8 5.6 1.5 5.6 4.3 0 1.3-1.2 2.3-2.9 2.3-1.3 0-2.4-.6-2.9-1.7M12 5.9v1.8M12 16.4v1.8"/>',
  bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
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
let cloudNeedLogin = false; // облачная сессия на устройстве закончилась — нужен пароль
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
// занят ли ник (без раскрытия почты); пока функции nick_taken нет в базе — старый способ
async function nickTaken(nick) {
  try { const { data, error } = await sb.rpc('nick_taken', { p_nick: nick.trim() }); if (!error) return !!data; } catch { /* */ }
  return !!(await loginEmail(nick));
}
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e).trim());
async function makeEmail(nick) {
  const h = await hashPass('cloud', nick.trim().toLowerCase());
  return `u${h.slice(0, 32)}@englishpath.app`;
}
async function cloudUid() { try { const { data } = await sb.auth.getSession(); return data.session ? data.session.user.id : null; } catch { return null; } }
const cloudErr = e => {
  const m = String((e && e.message) || e || '');
  if (/invalid login/i.test(m)) return 'Неверный ник, почта или пароль.';
  if (/already registered|already been registered|already exists/i.test(m)) return 'Эта почта уже зарегистрирована. Войди или восстанови пароль.';
  if (/rate limit|too many|security purposes/i.test(m)) return 'Слишком много попыток. Подожди минуту и попробуй снова.';
  if (/invalid.*email|email.*invalid|unable to validate email/i.test(m)) return 'Почта указана неверно.';
  if (/token has expired|invalid.*token|otp/i.test(m)) return 'Код неверный или устарел. Запроси новый.';
  if (/at least 6|password should/i.test(m)) return 'Пароль — минимум 6 символов.';
  if (/fetch|network|failed/i.test(m)) return 'Нет связи с облаком. Проверь интернет.';
  return 'Облако ответило ошибкой: ' + m;
};
// новый облачный аккаунт для профиля P
async function cloudRegister(nick, email, pass) {
  if (!sb) return 'Облако недоступно (нет интернета).';
  email = (email || '').trim().toLowerCase();
  if (email && !isEmail(email)) return 'Почта указана неверно.';
  if (pass.length < 6) return 'Пароль — минимум 6 символов.';
  if (await nickTaken(nick)) return 'Такой ник уже занят в облаке. Выбери другой.';
  const real = !!email;
  if (!real) email = await makeEmail(nick); // без почты — служебный адрес, вход по нику
  const { data, error } = await sb.auth.signUp({ email, password: pass });
  if (error) return cloudErr(error);
  if (data.user && !data.user.identities?.length) return 'Эта почта уже зарегистрирована. Войди или восстанови пароль.';
  if (!data.session) return 'Облако требует подтверждение почты — сообщи репетитору.';
  P.cloud = { uid: data.user.id, email: real ? email : undefined }; cloudReady = true;
  const r = await pushNow();
  return r;
}
// вход: по почте; старые аккаунты (почта-заглушка) — ещё и по нику
async function cloudLogin(login, pass) {
  if (!sb) return { error: 'Облако недоступно (нет интернета).' };
  login = login.trim();
  const email = isEmail(login) ? login.toLowerCase() : ((await loginEmail(login)) || await makeEmail(login));
  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) return { error: cloudErr(error) };
  return loadRow(data.user, email);
}
async function loadRow(user, email) {
  const { data: row, error } = await sb.from('progress').select('*').eq('user_id', user.id).maybeSingle();
  if (error) return { error: cloudErr(error) };
  return { uid: user.id, email: email || user.email, row };
}
// забыли пароль: код на почту → код + новый пароль
async function sendReset(email) {
  if (!sb) return 'Облако недоступно (нет интернета).';
  if (!isEmail(email)) return 'Почта указана неверно.';
  const { error } = await sb.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: location.origin + location.pathname });
  return error ? cloudErr(error) : null;
}
async function resetWithCode(email, code, pass) {
  if (pass.length < 6) return { error: 'Пароль — минимум 6 символов.' };
  email = email.trim().toLowerCase();
  const { data, error } = await sb.auth.verifyOtp({ email, token: code.replace(/\s/g, ''), type: 'recovery' });
  if (error) return { error: cloudErr(error) };
  const { error: e2 } = await sb.auth.updateUser({ password: pass });
  if (e2) return { error: cloudErr(e2) };
  return loadRow(data.user, email);
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
async function checkAdmin() {
  if (!sb || !P || !P.cloud) return;
  try {
    const { data } = await sb.from('admins').select('user_id').eq('user_id', P.cloud.uid).maybeSingle();
    const was = isAdmin; isAdmin = !!data;
    if (isAdmin !== was && !S) render();
  } catch { /* нет связи */ }
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
  out.usdEarn = mo(out.usdEarn, b.usdEarn, mx); out.usdSpent = mo(out.usdSpent, b.usdSpent, mx);
  out.owned = mo(out.owned, b.owned, (x, y) => x || y);
  if ('unlockAll' in b) out.unlockAll = b.unlockAll; // ставит админ в облаке
  { const seen = new Set(), all = [...(out.usdLog || []), ...(b.usdLog || [])].filter(x => { const k = x.t + '|' + x.n + '|' + x.w; if (seen.has(k)) return false; seen.add(k); return true; }); out.usdLog = all.sort((x, y) => y.t - x.t).slice(0, 80); }
  if (b.settings && b.settings.hideCloud && out.settings) out.settings.hideCloud = true; // «скрыть навсегда» — на всех устройствах
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
    settings: { sound: true, vibe: true, voice: '', lang: window.UI_LANG || 'ru' }, usdEarn: {}, usdSpent: {},
  };
}
function migrate(p) { // профили из первой версии
  p.items = p.items || {}; p.topics = p.topics || {}; p.notes = p.notes || {}; p.notesAt = p.notesAt || {};
  if (!p.xpDev) p.xpDev = { old: p.xp || 0 };
  if (!p.mode) p.mode = (p.grade || 5) >= 12 ? 'general' : 'school';
  if (p.mode === 'general' && p.goal && p.goal.target === 'grade') p.goal.target = 'B1';
  for (const d of Object.values(p.days || {})) if (!d.dev) d.dev = { old: { min: d.min || 0, xp: d.xp || 0 } };
  if (p.gaps) { for (const t of Object.keys(p.gaps)) p.items[t] = p.gaps[t]; delete p.gaps; }
  if (p.goal && p.goal.target === 'g5') p.goal.target = 'grade';
  p.stats.practice = p.stats.practice || 0;
  p.usdEarn = p.usdEarn || {}; p.usdSpent = p.usdSpent || {};
  return p;
}

/* ================= голос и звук ================= */
const TTS = { ok: false, voice: null, list: [] };
// «живые» нейросетевые голоса (Edge: Natural/Online, Chrome: Google, Apple: Premium/Enhanced) — выше простых системных
const voiceScore = v => (/natural|neural|online|premium|enhanced/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 3 : 0)
  + (/^en[-_]US/i.test(v.lang) ? 1 : /^en[-_]GB/i.test(v.lang) ? 0.8 : 0) + (v.localService === false ? 0.5 : 0);
const voiceLabel = v => {
  const reg = { US: 'США', GB: 'Британия', AU: 'Австралия', CA: 'Канада', IE: 'Ирландия', IN: 'Индия', NZ: 'Новая Зеландия', ZA: 'ЮАР' }[(v.lang.split(/[-_]/)[1] || '').toUpperCase()] || v.lang;
  const nm = v.name.replace(/^(Microsoft|Google)\s+/i, '').replace(/\s*Online\s*\(Natural\)/i, '').replace(/\s*-\s*English.*$/i, '').replace(/\s*\(.*?\)\s*/g, ' ').trim();
  return `${nm} · ${reg}${voiceScore(v) >= 3 ? ' · живой' : ''}`;
};
function chooseVoice() {
  const pref = P && P.settings.voice, L = TTS.list;
  TTS.voice = L.find(v => v.name === pref) || L[0] || null;
  TTS.ok = L.length > 0 || AUDIO.size > 0;
}
function initVoices() {
  TTS.ok = AUDIO.size > 0;
  if (!('speechSynthesis' in window)) return;
  const load = () => { TTS.list = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a)); chooseVoice(); };
  load(); speechSynthesis.onvoiceschanged = load;
}
// готовые записи нейроголосом (site/audio, ключ — как в tools/audio/phrases.js); нет записи — голос браузера
const AUDIO = new Set((window.AUDIO_KEYS || '').split(' ').filter(Boolean));
const audioNorm = s => String(s).replace(/\*\*/g, '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const fnv = (s, h) => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const audioKey = s => { const n = audioNorm(s); return n ? fnv(n, 2166136261).toString(36) + fnv(n, 3735928559).toString(36) : ''; };
let curAudio = null;
function say(text, slow) {
  const k = audioKey(text);
  if (AUDIO.has(k) && !(P && P.settings.voice)) {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (curAudio) curAudio.pause();
    const a = curAudio = new Audio(`audio/${k}.mp3`);
    a.playbackRate = slow ? 0.72 : 1; a.preservesPitch = true;
    a.play().catch(() => sayBrowser(text, slow));
    return;
  }
  sayBrowser(text, slow);
}
function sayBrowser(text, slow) {
  if (!TTS.list.length) return;
  if (curAudio) curAudio.pause();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).replace(/→/g, ', ').replace(/\//g, ', '));
  if (TTS.voice) { u.voice = TTS.voice; u.lang = TTS.voice.lang; } else u.lang = 'en-GB';
  u.rate = slow ? 0.62 : 0.92;
  speechSynthesis.speak(u);
}
let AC = null;
// звуки синтезируем сами: мягкий «колокольчик» (основной тон + обертоны) с длинным хвостом
function synth(notes) {
  if (!P || !P.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const t0 = AC.currentTime + 0.01;
    for (const [f, st, d, type = 'sine', v = 0.07] of notes) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t0 + st);
      g.gain.setValueAtTime(0, t0 + st); g.gain.linearRampToValueAtTime(v, t0 + st + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + st + d);
      o.connect(g).connect(AC.destination); o.start(t0 + st); o.stop(t0 + st + d + 0.05);
    }
  } catch { /* без звука */ }
}
function whoosh() {
  if (!P || !P.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + 0.01, len = 0.55, buf = AC.createBuffer(1, Math.floor(AC.sampleRate * len), AC.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const src = AC.createBufferSource(), bp = AC.createBiquadFilter(), g = AC.createGain();
    src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(500, t); bp.frequency.exponentialRampToValueAtTime(3800, t + len);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.13, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(bp).connect(g).connect(AC.destination); src.start(t); src.stop(t + len);
  } catch { /* */ }
}
const semi = (f, n) => f * Math.pow(2, n / 12);
const bell = (f, st, d, v = 0.065) => [[f, st, d, 'sine', v], [f * 2, st, d * 0.55, 'sine', v * 0.32], [f * 3, st, d * 0.28, 'triangle', v * 0.1]];
const vibe = p => { try { if (P && P.settings.vibe !== false && navigator.vibrate) navigator.vibrate(p); } catch { /* */ } };
const sfx = {
  // чем длиннее серия верных ответов подряд, тем выше звук (до +7 полутонов)
  ok: (combo = 1) => { const b = semi(659.25, Math.min(Math.max(combo - 1, 0), 7)); synth([...bell(b, 0, 0.32), ...bell(semi(b, 4), 0.07, 0.4), ...bell(semi(b, 7), 0.14, 1.15, 0.07)]); vibe(28); },
  bad: () => { synth([[233, 0, 0.2, 'triangle', 0.09], [196, 0.11, 0.38, 'triangle', 0.09]]); vibe([45, 55, 45]); },
  done: () => { synth([...bell(523.25, 0, 0.3), ...bell(659.25, 0.12, 0.3), ...bell(783.99, 0.24, 0.3), ...bell(1046.5, 0.36, 1.6, 0.075)]); vibe([30, 60, 30, 60, 90]); },
  coin: () => synth([...bell(1318.5, 0, 0.12, 0.05), ...bell(1760, 0.07, 0.5, 0.05)]),
  ach: () => synth([...bell(880, 0, 0.25), ...bell(1108.7, 0.07, 0.25), ...bell(1318.5, 0.14, 0.25), ...bell(1760, 0.21, 0.9, 0.06)]),
  whoosh,
};

/* ================= доллары ================= */
// баланс = заработано − потрачено, по устройствам (как опыт), чтобы облако правильно объединяло
const USD = { hint: 5, restore: 50, ach: 10 };
const sumV = o => Object.values(o || {}).reduce((a, v) => a + v, 0);
const usd = (p = P) => Math.max(0, sumV(p.usdEarn) - sumV(p.usdSpent));
const updUsd = () => $$('.usd-n').forEach(x => { x.textContent = (x.dataset.pre || '') + usd(); });
function usdNote(n, why) { P.usdLog = P.usdLog || []; P.usdLog.unshift({ t: Date.now(), n, w: why || '' }); if (P.usdLog.length > 80) P.usdLog.length = 80; }
function earnUsd(n, why) { if (!n) return; P.usdEarn = P.usdEarn || {}; P.usdEarn[DEVICE] = (P.usdEarn[DEVICE] || 0) + n; usdNote(n, why); updUsd(); }
function spendUsd(n, why) { if (usd() < n) return false; P.usdSpent = P.usdSpent || {}; P.usdSpent[DEVICE] = (P.usdSpent[DEVICE] || 0) + n; usdNote(-n, why); updUsd(); return true; }
const streakLost = () => P.streak.n >= 2 && P.streak.last < today() - 1 && today() - P.streak.last <= 4;
function restoreStreak() {
  if (!streakLost()) return;
  if (!spendUsd(USD.restore, 'Возврат серии')) return toast(`Нужно $${USD.restore}, у тебя $${usd()}. Доллары даются за уроки и достижения.`);
  P.streak.last = today() - 1; P.stats.restores = (P.stats.restores || 0) + 1;
  const fresh = checkAch(); save(); sfx.coin(); toast(`Серия ${P.streak.n} ${plural(P.streak.n, 'день', 'дня', 'дней')} восстановлена`); render(); popAch(fresh);
}

/* ---- плашка достижения: выезжает снизу и улетает в профиль ---- */
const ACHQ = [];
function popAch(list) { if (!list || !list.length) return; const idle = !ACHQ.length; ACHQ.push(...list); if (idle) setTimeout(nextPop, 350); }
function nextPop() {
  const a = ACHQ[0]; if (!a) return;
  const el = document.createElement('button'); el.type = 'button';
  el.className = `ach-pop c-${a.c || ACH_C[a.i] || 'gold'}`; el.setAttribute('aria-live', 'polite');
  el.innerHTML = `<i class="ach-ic">${icon(a.i)}</i><span class="ap-t"><small>Новое достижение</small><b>${a.t}</b></span><span class="ap-usd">+$${USD.ach}</span>`;
  document.body.appendChild(el); sfx.ach(); vibe([20, 40, 30]);
  void el.offsetWidth; setTimeout(() => el.classList.add('in'), 20);
  const tm = setTimeout(() => flyAway(el), ACHQ.length > 1 ? 1800 : 2600);
  el.onclick = () => { clearTimeout(tm); flyAway(el); };
}
function flyAway(el) {
  if (el.dataset.fly) return; el.dataset.fly = 1;
  const tg = $('.player') ? $('.player .p-usd') : [...$$('.tabbar a[href="#/me"], .nav a[href="#/me"]')].find(x => x.offsetParent);
  const r = el.getBoundingClientRect(), t = tg ? tg.getBoundingClientRect() : { left: innerWidth - 60, top: 10, width: 40, height: 30 };
  const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
  sfx.whoosh();
  const done = () => { el.remove(); if (tg) { tg.classList.remove('bump'); void tg.offsetWidth; tg.classList.add('bump'); } sfx.coin(); ACHQ.shift(); if (ACHQ.length) setTimeout(nextPop, 300); };
  if (reduced() || !el.animate) return done();
  el.animate([{ transform: 'translate(0, 0) scale(1)', opacity: 1 }, { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(.6)`, opacity: 1, offset: 0.55 }, { transform: `translate(${dx}px, ${dy}px) scale(.1)`, opacity: 0.3 }],
    { duration: 820, easing: 'cubic-bezier(.55, 0, .45, 1)', fill: 'forwards' }).onfinish = done;
}

/* ================= прогресс ================= */
const gradePassed = g => !!(P.grades[g] && P.grades[g].passed);
let isAdmin = false; // админ: всё открыто + страница «Ученики»
const fullAccess = () => isAdmin || !!(P && P.unlockAll); // админ или ученик, которому админ открыл все классы
const gradeOpen = g => fullAccess() || g === 5 || gradePassed(g) || gradePassed(g - 1);
const gradeExists = g => !!COURSE[g];
const unitPassed = u => !!(P.units[u.key] && P.units[u.key].passed) || gradePassed(u.grade);
const lessonDone = l => !!P.lessons[l.key] || unitPassed(l.unit);
const unitOpen = u => fullAccess() || gradeOpen(u.grade) && (u.index === 0 || unitPassed(u) || unitPassed(COURSE[u.grade].units[u.index - 1]));
const lessonOpen = l => fullAccess() || unitOpen(l.unit) && (l.index === 0 || lessonDone(l) || lessonDone(l.unit.lessons[l.index - 1]));
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
/* школа — по классам, остальные — по ступеням того же курса */
const STAGES = { 5: 'A1', 6: 'A1+', 7: 'A2', 8: 'A2+', 9: 'B1', 10: 'B1+', 11: 'B2' };
const isGen = (p = P) => !!p && p.mode === 'general';
const gTitle = (g, p = P) => isGen(p) ? `Ступень ${STAGES[g]}` : `${g} класс`;
const gShort = (g, p = P) => isGen(p) ? STAGES[g] : String(g);
const gOf = (g, p = P) => isGen(p) ? `ступени ${STAGES[g]}` : `${g} класса`;
const TARGETS_SCHOOL = { grade: 'Программа своего класса', A2: 'Уровень A2 (7 класс)', B1: 'Уровень B1 (9 класс)', B2: 'Уровень B2 (11 класс)' };
const TARGETS_GEN = { A1: 'Уровень A1 — основа', A2: 'Уровень A2 — уверенный базовый', B1: 'Уровень B1 — свободное общение', B2: 'Уровень B2 — работа и учёба' };
const targetsFor = mode => mode === 'general' ? TARGETS_GEN : TARGETS_SCHOOL;
const PLACES = { school: 'Учусь в школе', uni: 'Учусь в колледже или вузе', work: 'Работаю', other: 'Другое' };
const PURPOSES = { school: 'Школа и экзамены', travel: 'Путешествия', career: 'Работа и карьера', abroad: 'Учёба или жизнь за границей', self: 'Для себя' };
const DEADLINES = [[4, '1 месяц'], [8, '2 месяца'], [13, '3 месяца'], [26, 'полгода'], [52, 'год']];
const MINUTES = [15, 20, 30, 45, 60];
const targetGrade = () => ({ grade: Math.min(11, Math.max(5, P.grade)), A1: 6, A2: 8, B1: 10, B2: 11 }[P.goal.target] || 11);
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
  let s = `До ${isGen() ? 'уровня ' + STAGES[pi.tg].replace(/\.\d$/, '') : pi.tg + ' класса'} осталось около ${hrs} занятий. При ${P.goal.minutes} мин в день — ${pi.days} ${plural(pi.days, 'день', 'дня', 'дней')}, до ${fmtDate(pi.finish)}.`;
  if (!pi.ok) s += ` К сроку не успеть: нужно около ${pi.need} мин в день.`;
  return s;
}

/* ---- достижения ---- */
const ACH = [
  { id: 'first', t: 'Первый шаг', d: 'Пройди первый урок', i: 'path', ok: () => P.stats.lessons >= 1 },
  { id: 'clean', t: 'Чисто', d: 'Урок без единой ошибки', i: 'check', ok: () => P.stats.perfect >= 1 },
  { id: 'acc70', t: 'Хорошист', d: 'Пройди урок на 70% и выше', i: 'target', c: 'teal', ok: () => (P.stats.bestAcc || 0) >= 70 },
  { id: 'acc80', t: 'Уверенно', d: 'Пройди урок на 80% и выше', i: 'target', c: 'blue', ok: () => (P.stats.bestAcc || 0) >= 80 },
  { id: 'acc90', t: 'Почти идеально', d: 'Пройди урок на 90% и выше', i: 'star', c: 'violet', ok: () => (P.stats.bestAcc || 0) >= 90 },
  { id: 'perfect5', t: 'Пять чистых', d: '5 уроков без единой ошибки', i: 'check', c: 'green', ok: () => P.stats.perfect >= 5 },
  { id: 'combo10', t: 'Десять подряд', d: '10 верных ответов подряд', i: 'bolt', c: 'orange', ok: () => (P.stats.combo || 0) >= 10 },
  { id: 'usd100', t: 'Первая сотня', d: 'Заработай $100', i: 'dollar', c: 'green', ok: () => sumV(P.usdEarn) >= 100 },
  { id: 'restore', t: 'Второй шанс', d: 'Верни прерванную серию', i: 'flame', c: 'red', ok: () => (P.stats.restores || 0) >= 1 },
  { id: 'grammar', t: 'Теоретик', d: 'Потренируй 5 тем в справочнике', i: 'scheme', ok: () => P.stats.practice >= 5 },
  { id: 's3', t: 'Три дня подряд', d: 'Занимайся 3 дня без пропусков', i: 'flame', ok: () => P.streak.best >= 3 },
  { id: 'goal', t: 'Норма дня', d: 'Выполни дневную норму минут', i: 'target', ok: () => P.stats.goalDays >= 1 },
  { id: 'unit', t: 'Модуль закрыт', d: 'Сдай тест модуля', i: 'flag', ok: () => Object.values(P.units).some(u => u.passed) },
  { id: 'extern', t: 'Экстерн', d: 'Сдай модуль тестом без уроков', i: 'bolt', ok: () => P.stats.extern >= 1 },
  { id: 'ace', t: 'Отличник', d: 'Тест без ошибок', i: 'star', ok: () => P.stats.ace >= 1 },
  { id: 's7', t: 'Неделя', d: '7 дней подряд', i: 'flame', ok: () => P.streak.best >= 7 },
  { id: 'review5', t: 'Память', d: 'Сделай 5 повторений', i: 'repeat', ok: () => P.stats.reviews >= 5 },
  { id: 'w300', t: '300 слов', d: 'Собери 300 слов в копилку', i: 'book', ok: () => Object.keys(P.words).length >= 300 },
  { id: 'g5', t: 'Первая ступень', d: 'Сдай итоговую за 5 класс (A1)', i: 'trophy', ok: () => gradePassed(5) },
  { id: 'g7', t: 'Уровень A2', d: 'Сдай итоговую за 7 класс (A2)', i: 'trophy', ok: () => gradePassed(7) },
  { id: 'g9', t: 'Уровень B1', d: 'Сдай итоговую за 9 класс (B1)', i: 'trophy', ok: () => gradePassed(9) },
  { id: 'g11', t: 'Уровень B2', d: 'Сдай итоговую за 11 класс (B2)', i: 'trophy', ok: () => gradePassed(11) },
  { id: 's30', t: 'Месяц', d: '30 дней подряд', i: 'flame', ok: () => P.streak.best >= 30 },
  { id: 'cards25', t: 'Мечтатель', d: 'Открой 25 карточек мечты', i: 'image', ok: () => (P.cards || []).length >= 25 },
  { id: 'cards100', t: 'Коллекционер', d: 'Открой 100 карточек мечты', i: 'image', ok: () => (P.cards || []).length >= 100 },
];
const MEDALS = { bronze: 'Бронза · 70%+', silver: 'Серебро · 80%+', gold: 'Золото · 90%+', perfect: 'Идеально · 100%' };
const ACH_C = { path: 'red', check: 'green', scheme: 'blue', flame: 'orange', target: 'pink', flag: 'red', bolt: 'gold', star: 'gold', repeat: 'teal', book: 'green', trophy: 'gold', image: 'violet' };
const lvTag = t => String(t).replace(/([AB][12])(\+?)/g, '<span class="lv lv-$1">$1$2</span>');
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
/* «что даст урок» — цифры */
const LEVEL_OF = g => g <= 6 ? 'A1' : g <= 8 ? 'A2' : g <= 10 ? 'B1' : 'B2';
const LEVEL_GRADES = { A1: [5, 6], A2: [7, 8], B1: [9, 10], B2: [11] };
const gradeItems = g => COURSE[g].units.reduce((a, u) => a + u.lessons.length + 1, 0) + 1; // уроки + тесты + итоговая
const levelItems = lv => LEVEL_GRADES[lv].reduce((a, g) => a + gradeItems(g), 0);
const fmtPct = x => (x >= 10 ? Math.round(x) : Math.round(x * 10) / 10).toString().replace('.', ',');
function goalItems() { const tg = targetGrade(); let n = 0; for (let g = 5; g <= tg; g++) n += gradeItems(g); return n; }
function goalName() { const k = P.goal.target; return k === 'grade' ? `программа ${P.grade} класса` : `уровень ${k}`; }
function learnLine(l) {
  const t = l.topic, lead = t && t.b.find(b => b.k === 'lead');
  const what = t ? (lead ? lead.t.split(/(?<=[.!?])\s/)[0] : t.t) : '';
  const words = l.words.slice(0, 3).map(w => w.en).join(', ');
  return { topic: t ? t.t : '', what, words };
}
function gainHTML(l, compact = false) {
  const lv = LEVEL_OF(l.unit.grade), lvPct = 100 / levelItems(lv), goalPct = 100 / goalItems();
  const ln = learnLine(l), min = LESSON_MIN(l.unit.grade);
  const inGoal = l.unit.grade <= targetGrade();
  return `<div class="gain ${compact ? 'gain-sm' : ''}">
    ${compact ? '' : '<p class="gain-k">Что даст этот урок</p>'}
    <div class="gain-row">
      <span>${icon('clock')}<b>~${min}</b> мин</span>
      <span>${icon('book')}<b>${l.words.length}</b> новых слов</span>
      <span>${icon('bolt')}<b>+${fmtPct(lvPct)}%</b> к уровню ${lv}</span>
    </div>
    ${ln.topic ? `<p class="gain-learn"><b>Научишься:</b> <span>${esc(ln.topic)}</span>${!compact && ln.what ? `<span> — </span><span>${esc(EN ? trText(ln.what) : ln.what.charAt(0).toLowerCase() + ln.what.slice(1))}</span>` : ''}</p>` : ''}
    ${!compact && ln.words ? `<p class="gain-learn"><b>Новые слова:</b> ${esc(ln.words)} и другие.</p>` : ''}
    ${inGoal ? `<p class="gain-goal">Цель «${esc(goalName())}» станет ближе на ${fmtPct(goalPct)}%.</p>` : ''}
  </div>`;
}
const photoOfDay = () => PHOTOS.length ? PHOTOS[strHash('day' + today()) % PHOTOS.length] : null;
const quoteHTML = q => q ? `<blockquote class="ph-q"><p>${esc(q.t)}</p>${q.a ? `<cite>${esc(q.a)}</cite>` : ''}</blockquote>` : '';
const favBtn = id => { const on = (P.favs || []).includes(id); return `<button class="fav-btn ${on ? 'on' : ''}" data-fav="${id}" aria-pressed="${on}">${icon('heart')}<span>${on ? 'На моей доске' : 'На мою доску'}</span></button>`; };
function toggleFav(id) {
  cardsInit();
  P.favs = P.favs.includes(id) ? P.favs.filter(x => x !== id) : [...P.favs, id];
  P.favsAt = Date.now(); save();
  $$(`[data-fav="${id}"]`).forEach(b => { b.outerHTML = favBtn(id); });
}

function checkAch() { const fresh = []; for (const a of ACH) if (!P.ach[a.id] && a.ok()) { P.ach[a.id] = today(); fresh.push(a); earnUsd(USD.ach, `Достижение «${a.t}»`); } return fresh; }

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
      <a class="btn btn-ghost btn-sm" href="${videoURL(EN ? trText(t.t) + ' English grammar explained' : (t.v || t.t))}" target="_blank" rel="noopener">${icon('video')}Видеоуроки на YouTube</a>
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
  if (P) { // язык профиля важнее языка устройства
    if (!P.settings.lang) { P.settings.lang = window.UI_LANG || 'ru'; save(); }
    else if (P.settings.lang !== window.UI_LANG) { let ok = false; try { localStorage.setItem('englishpath.lang', P.settings.lang); ok = localStorage.getItem('englishpath.lang') === P.settings.lang; } catch { /* */ } if (ok) { location.reload(); return; } }
  }
  document.body.dataset.sec = P ? ((routeParts()[0] in { path: 1, review: 1, grammar: 1, me: 1, admin: 1 }) ? routeParts()[0] : 'path') : 'auth';
  closePop();
  if (!P) return renderAuth();
  const [r, arg] = routeParts();
  cardsInit();
  const views = { path: viewPath, review: viewReview, grammar: viewGrammar, dream: viewDream, me: viewMe, admin: isAdmin ? viewAdmin : viewPath };
  const view = views[r] || viewPath, cur = views[r] ? r : 'path';
  const nav = [['path', 'Путь', 'path'], ['grammar', 'Грамматика', 'scheme'], ['review', 'Повторение', 'repeat'], ['me', 'Профиль', 'user'], ...(isAdmin ? [['admin', 'Ученики', 'users']] : [])];
  const due = dueWords().length + dueItems().length;
  const navHTML = nav.map(([k, t, ic]) => `<a href="#/${k}" class="${cur === k ? 'on' : ''}">${icon(ic)}<span>${t}</span>${k === 'review' && due ? `<b class="badge">${due}</b>` : ''}</a>`).join('');
  app.innerHTML = `
  <div class="shell">
    <header class="top">
      <a class="brand" href="#/path">${logo()}<span class="brand-t">Your Road to the USA</span></a>
      <nav class="nav">${navHTML}</nav>
      <div class="top-stats">
        ${cloudChip()}
        <span class="chip" title="Дней подряд">${icon('flame')}${P.streak.last >= today() - 1 ? P.streak.n : 0}</span>
        <span class="chip" title="Опыт">${icon('bolt')}${P.xp}</span>
        <button type="button" class="chip chip-usd" data-act="wallet" title="Доллары">${icon('dollar')}<b class="usd-n">${usd()}</b></button>
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
  admin(arg) { loadAdmin(arg); },
};
const miniFlag = () => logo('logo-mini');
const logo = (cls = 'logo') => `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true"><clipPath id="lc"><circle cx="20" cy="20" r="20"/></clipPath><g clip-path="url(#lc)"><rect width="40" height="40" fill="#B22234"/><path d="M0 3.08h40v3.08H0zM0 9.23h40v3.08H0zM0 15.38h40v3.08H0zM0 21.54h40v3.08H0zM0 27.69h40v3.08H0zM0 33.85h40v3.08H0z" fill="#fff"/><rect width="20" height="21.54" fill="#3C3B6E"/><g fill="#fff"><circle cx="9" cy="6" r=".95"/><circle cx="13.5" cy="6" r=".95"/><circle cx="18" cy="6" r=".95"/><circle cx="6.5" cy="10" r=".95"/><circle cx="11" cy="10" r=".95"/><circle cx="15.5" cy="10" r=".95"/><circle cx="4.5" cy="14" r=".95"/><circle cx="9" cy="14" r=".95"/><circle cx="13.5" cy="14" r=".95"/><circle cx="18" cy="14" r=".95"/><circle cx="6.5" cy="18" r=".95"/><circle cx="11" cy="18" r=".95"/><circle cx="15.5" cy="18" r=".95"/></g></g><circle cx="20" cy="20" r="19.5" fill="none" stroke="#000" stroke-opacity=".18"/></svg>`;

function ring(val, max, size = 60) {
  const r = size / 2 - 5, c = 2 * Math.PI * r, p = Math.min(1, max ? val / max : 0);
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
}
function stepLabel(st) {
  if (!st) return { t: 'Весь курс пройден' };
  if (st.kind === 'lesson') return { t: st.l.t, s: `${gTitle(st.l.unit.grade)}, ${st.l.unit.title}` };
  if (st.kind === 'test') return { t: 'Тест модуля', s: `${gTitle(st.u.grade)}, ${st.u.title}` };
  return { t: 'Итоговая контрольная', s: gTitle(st.g) };
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
  </section>
  ${streakLost() ? `<section class="streak-save">${icon('flame')}<div><b>Серия из ${P.streak.n} ${plural(P.streak.n, 'дня', 'дней', 'дней')} прервалась</b><span>Верни её за $${USD.restore}. У тебя $${usd()}.</span></div>
    <button class="btn btn-sm" data-act="restore" ${usd() < USD.restore ? 'disabled' : ''}>${icon('dollar')}Вернуть за $${USD.restore}</button></section>` : ''}`;
}

/* ================= вход ================= */
let onb = null;
const freshOnb = () => ({ step: 0, nick: '', pass: '', place: 'school', grade: 5, purpose: 'school', target: 'grade', minutes: 30, weeks: 13 });
function onbProfile(passHash) {
  const school = onb.place === 'school';
  const p = newProfile(onb.nick, passHash, school ? onb.grade : 12, { target: onb.target, minutes: onb.minutes, weeks: onb.weeks });
  p.mode = school ? 'school' : 'general'; p.place = onb.place; p.purpose = onb.purpose;
  return p;
}
function authFrame(inner) {
  const bg = PHOTOS.length ? PHOTOS[strHash('auth' + Math.floor(Date.now() / 3600000)) % PHOTOS.length] : null;
  return `${bg ? `<div class="auth-bg" aria-hidden="true"><img src="${photoSrc(bg)}" alt=""></div>` : ''}<div class="auth">
    <div class="auth-art">
      <span class="auth-grades" aria-hidden="true">5–11</span>
      <span class="auth-levels"><b class="lv lv-A1">A1</b><i></i><b class="lv lv-C1">C1</b></span>
      <h1 class="script">Your Road<br>to the USA</h1>
      <p>Английский с нуля до B2 — по школьной программе или в своём темпе. Грамматика в схемах, практика по-настоящему.</p>
    </div>
    <div class="auth-side">
      <div class="lang-sw" role="group" aria-label="Язык интерфейса"><button type="button" data-lang="ru" class="${EN ? '' : 'on'}">RU</button><button type="button" data-lang="en" class="${EN ? 'on' : ''}">EN</button></div>
      ${inner}
    </div>
  </div>`;
}
function renderAuth() {
  document.body.dataset.sec = 'auth';
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
  <p class="muted">${sb ? 'Придумай ник и пароль — с ними войдёшь с телефона, планшета или другого компьютера. Почту можно добавить, чтобы восстановить пароль, если забудешь.' : 'Придумай ник. Пароль — по желанию.'}</p>
  <label class="field"><span>Ник</span><input name="nick" maxlength="20" autocomplete="nickname" value="${esc(onb.nick)}" placeholder="например, sasha_8a" required></label>
  ${sb ? `<label class="field"><span>Почта (по желанию)</span><input name="email" type="email" maxlength="80" autocomplete="email" inputmode="email" value="${esc(onb.email || '')}" placeholder="name@mail.ru"></label>` : ''}
  <label class="field"><span>${sb ? 'Пароль (минимум 6 символов)' : 'Пароль (необязательно)'}</span><input name="pass" type="password" maxlength="40" value="${esc(onb.pass)}" autocomplete="new-password"></label>
  <p class="err" id="err"></p>
  <div class="row-end">${Object.keys(DB.profiles).length || sb ? '<button type="button" class="btn btn-ghost" data-act="cancel">Назад</button>' : ''}<button class="btn">Дальше</button></div>`;
const stepGrade = () => `
  <h2>Где ты учишься?</h2>
  <div class="seg col">${Object.entries(PLACES).map(([k, t]) => `<button type="button" class="opt ${onb.place === k ? 'sel' : ''}" data-place="${k}">${t}</button>`).join('')}</div>
  ${onb.place === 'school' ? `<h3 class="h-sub">В каком классе?</h3>
  <div class="pick-grid">${ALL_GRADES.map(g => `<button type="button" class="opt opt-sq ${onb.grade === g ? 'sel' : ''}" data-grade="${g}">${g}</button>`).join('')}</div>
  <p class="muted small">Пойдёшь по классам. Знаешь программу класса — сдай его итоговую контрольную и переходи к следующему.</p>`
  : `<p class="muted small">Пойдёшь не по классам, а по ступеням: A1 → A2 → B1 → B2. Уже что-то знаешь — сдай контрольную ступени и иди дальше.</p>`}
  <div class="row-end"><button type="button" class="btn btn-ghost" data-act="back">Назад</button><button class="btn">Дальше</button></div>`;
const stepGoal = () => `
  <h2>Зачем тебе английский?</h2>
  <div class="seg">${Object.entries(PURPOSES).map(([k, t]) => `<button type="button" class="opt ${onb.purpose === k ? 'sel' : ''}" data-purpose="${k}">${t}</button>`).join('')}</div>
  <h3 class="h-sub">Какой уровень нужен?</h3>
  <div class="seg col">${Object.entries(targetsFor(onb.place === 'school' ? 'school' : 'general')).map(([k, t]) => `<button type="button" class="opt ${onb.target === k ? 'sel' : ''}" data-target="${k}">${t}</button>`).join('')}</div>
  <h3 class="h-sub">Минут в день</h3>
  <div class="seg">${MINUTES.map(m => `<button type="button" class="opt ${onb.minutes === m ? 'sel' : ''}" data-min="${m}">${m}</button>`).join('')}</div>
  <h3 class="h-sub">Срок</h3>
  <div class="seg">${DEADLINES.map(([w, t]) => `<button type="button" class="opt ${onb.weeks === w ? 'sel' : ''}" data-weeks="${w}">${t}</button>`).join('')}</div>
  <div class="row-end"><button type="button" class="btn btn-ghost" data-act="back">Назад</button><button class="btn">Посчитать план</button></div>`;
function stepPlan() {
  const prev = P;
  P = onbProfile(null);
  const pi = planInfo(), txt = planText(pi); P = prev;
  const lessonsDay = Math.max(1, Math.round(onb.minutes / 12));
  return `
  <h2>Твой план</h2>
  <div class="plan-box ${pi.ok ? '' : 'warn'}">
    <p><b>Каждый день:</b> ${lessonsDay} ${plural(lessonsDay, 'урок', 'урока', 'уроков')} и повторение, около ${onb.minutes} минут.</p>
    <p>${esc(txt)}</p>
    ${onb.place !== 'school' || onb.grade > 5 ? `<p><b>Не с нуля?</b> У каждой ${onb.place === 'school' ? 'программы класса' : 'ступени'} есть итоговая контрольная — сдай её на 80%, и она засчитана.</p>` : ''}
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
    if (b.dataset.place) { onb.place = b.dataset.place; onb.target = onb.place === 'school' ? 'grade' : 'B1'; if (onb.place !== 'school') onb.purpose = onb.purpose === 'school' ? 'self' : onb.purpose; return renderAuth(); }
    for (const k of ['grade', 'target', 'min', 'weeks', 'purpose']) if (b.dataset[k] != null) {
      onb[k === 'min' ? 'minutes' : k] = ['target', 'purpose'].includes(k) ? b.dataset[k] : +b.dataset[k];
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
        if (f.email.value.trim() && !isEmail(f.email.value)) return showErr('Почта указана неверно.');
        if (f.pass.value.length < 6) return showErr('Пароль — минимум 6 символов: с ним ты войдёшь с других устройств.');
        showErr('Проверяю ник…');
        if (await nickTaken(nick)) return showErr('Такой ник уже занят. Если это ты — вернись назад и нажми «Войти».');
        showErr('');
        onb.email = f.email.value.trim();
      }
      onb.nick = nick; onb.pass = f.pass.value;
    }
    if (onb.step === 3) {
      const btn = f.querySelector('button:not([type])'); btn.disabled = true; btn.textContent = 'Создаю…';
      const prof = onbProfile(onb.pass ? await hashPass(onb.nick, onb.pass) : null);
      DB.profiles[prof.nick] = prof; DB.current = prof.nick; P = prof; save();
      const pass = onb.pass, email = onb.email; onb = null; chooseVoice();
      if (sb && pass) { const err = await cloudRegister(prof.nick, email, pass); if (err) toast(err + ' Пока прогресс сохраняется на этом устройстве; подключить облако можно в профиле.'); }
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
      <div class="who">${names.map(n => { const p = DB.profiles[n]; return `<div class="who-item"><button type="button" class="who-x" data-forget="${esc(n)}" aria-label="Убрать с этого устройства" title="Убрать с этого устройства">${icon('x')}</button><button class="who-btn" data-nick="${esc(n)}">${avaHTML(p)}<span><b>${esc(n)}</b><small>${isGen(p) ? 'своя программа' : p.grade + ' класс'}, ${p.xp} XP${p.cloud ? ', в облаке' : ''}</small></span>${p.cloud ? icon('cloud', 'muted') : p.pass ? icon('lock', 'muted') : ''}</button></div>`; }).join('')}</div>
      <form id="pw" class="hidden" novalidate><label class="field"><span>Пароль</span><input type="password" name="pass" autocomplete="current-password"></label><p class="err" id="err"></p><div class="row-end"><button class="btn">Войти</button></div></form>` : '<h2>Добро пожаловать</h2><p class="muted">Начни с нуля или войди, если уже занимаешься на другом устройстве.</p>'}
      <button class="btn btn-wide" data-act="new">Новый ученик</button>
      ${sb ? `<button class="btn btn-ghost btn-wide" data-act="cloud">${icon('cloud')}Уже занимаюсь — войти</button>
      <form id="cl" class="hidden" novalidate>
        <label class="field"><span>Ник или почта</span><input name="nick" maxlength="80" autocomplete="username"></label>
        <label class="field"><span>Пароль</span><input name="pass" type="password" autocomplete="current-password"></label>
        <p class="err" id="err2"></p>
        <div class="row-between"><button type="button" class="link-btn" data-act="forgot">Забыли пароль?</button><button class="btn">Войти</button></div>
      </form>
      <form id="fp" class="hidden" novalidate>
        <h3 class="h-sub">Новый пароль</h3>
        <p class="muted small" id="fp-t">Укажи почту — пришлём на неё код. Если почту при регистрации не указывал — попроси репетитора сбросить пароль.</p>
        <label class="field"><span>Почта</span><input name="email" type="email" maxlength="80" autocomplete="email" inputmode="email"></label>
        <div class="fp-2 hidden">
          <label class="field"><span>Код из письма</span><input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="10"></label>
          <label class="field"><span>Новый пароль (минимум 6 символов)</span><input name="pass" type="password" autocomplete="new-password"></label>
        </div>
        <p class="err" id="err3"></p>
        <div class="row-end"><button class="btn" id="fp-go">Прислать код</button></div>
      </form>` : ''}
    </div>`);
  let chosen = null;
  pruneDeleted();
  $('.auth-card').addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.forget) {
      const n = b.dataset.forget, p = DB.profiles[n];
      if (!await confirmBox(p && p.cloud ? `Убрать «${n}» с этого устройства? Аккаунт в облаке останется — войти можно снова.` : `Убрать «${n}» с этого устройства? Его прогресс здесь удалится.`, 'Убрать', 'Отмена')) return;
      delete DB.profiles[n]; if (DB.current === n) DB.current = null; save(); app.innerHTML = ''; return renderAuth();
    }
    if (b.dataset.act === 'new') { onb = freshOnb(); app.innerHTML = ''; return renderAuth(); }
    if (b.dataset.act === 'cloud') { $('#cl').classList.toggle('hidden'); $('#fp').classList.add('hidden'); $('#cl input').focus(); return; }
    if (b.dataset.act === 'forgot') { const fp = $('#fp'); fp.classList.remove('hidden'); $('#cl').classList.add('hidden'); fp.email.value = isEmail($('#cl').nick.value) ? $('#cl').nick.value.trim() : ''; fp.email.focus(); return; }
    if (b.dataset.nick) {
      chosen = b.dataset.nick;
      $$('.who-btn').forEach(x => x.classList.toggle('sel', x === b));
      const pc = DB.profiles[chosen];
      if (!pc.pass) return login(chosen);
      if (pc.cloud && sb) { cloudUid().then(uid => { if (uid && uid === pc.cloud.uid) login(chosen); }); }
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
      const r = await cloudLogin(p.cloud.email || chosen, pass);
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
    if (!nick || !pass) return err('Введи ник или почту и пароль.');
    err('Вхожу…');
    const r = await cloudLogin(nick, pass);
    if (r.error) return err(r.error);
    if (!r.row) return err('Аккаунт найден, но прогресса в облаке нет. Создай профиль заново.');
    finishCloudLogin(r, pass);
  });
  const fp = $('#fp');
  fp && fp.addEventListener('submit', async e => {
    e.preventDefault();
    const err = t => { $('#err3').textContent = t; }, go = $('#fp-go'), step2 = !$('.fp-2', fp).classList.contains('hidden');
    go.disabled = true;
    if (!step2) {
      err('Отправляю…');
      const r = await sendReset(fp.email.value); go.disabled = false;
      if (r) return err(r);
      err(''); $('.fp-2', fp).classList.remove('hidden'); go.textContent = 'Сменить пароль';
      $('#fp-t').textContent = 'Код отправлен. Проверь почту (и папку «Спам») и введи код и новый пароль.';
      return fp.code.focus();
    }
    err('Проверяю код…');
    const r = await resetWithCode(fp.email.value, fp.code.value, fp.pass.value); go.disabled = false;
    if (r.error) return err(r.error);
    if (!r.row) return err('Пароль сменён, но прогресса в облаке нет. Создай профиль заново.');
    finishCloudLogin(r, fp.pass.value);
  });
}
// профили на устройстве, чьи облачные аккаунты удалены, — убираем с экрана входа
async function pruneDeleted() {
  if (!sb) return;
  let gone = 0;
  for (const [n, p] of Object.entries(DB.profiles)) {
    if (!p.cloud || !p.cloud.uid) continue;
    try { const { data, error } = await sb.rpc('account_exists', { p_uid: p.cloud.uid }); if (!error && data === false) { delete DB.profiles[n]; if (DB.current === n) DB.current = null; gone++; } } catch { /* нет связи — не трогаем */ }
  }
  if (gone && !P) { save(); app.innerHTML = ''; renderAuth(); }
}
// ссылка из письма «сбросить пароль»: Supabase сам открывает сессию — просим новый пароль
function askNewPassword() {
  const d = document.createElement('div'); d.className = 'modal';
  d.innerHTML = `<form class="modal-card" novalidate><h3 class="h-sub">Новый пароль</h3><label class="field"><span>Новый пароль (минимум 6 символов)</span><input name="pass" type="password" autocomplete="new-password"></label><p class="err"></p><div class="row-end"><button class="btn">Сохранить</button></div></form>`;
  document.body.appendChild(d); requestAnimationFrame(() => d.classList.add('in'));
  const f = $('form', d); f.pass.focus();
  f.addEventListener('submit', async e => {
    e.preventDefault(); const er = $('.err', d);
    if (f.pass.value.length < 6) { er.textContent = 'Пароль — минимум 6 символов.'; return; }
    er.textContent = 'Сохраняю…';
    const { data, error } = await sb.auth.updateUser({ password: f.pass.value });
    if (error) { er.textContent = cloudErr(error); return; }
    const r = await loadRow(data.user);
    d.remove(); history.replaceState(null, '', location.pathname + location.search);
    if (r.error || !r.row) { toast(r.error || 'Пароль сменён. Прогресса в облаке нет — создай профиль.'); return; }
    finishCloudLogin(r, f.pass.value);
  });
}
if (sb) sb.auth.onAuthStateChange(ev => { if (ev === 'PASSWORD_RECOVERY') setTimeout(askNewPassword, 300); });
async function finishCloudLogin(r, pass) {
  const nick = r.row.nick;
  const local = Object.values(DB.profiles).find(p => p.cloud && p.cloud.uid === r.uid) || DB.profiles[nick];
  let prof = local ? mergeP(migrate(local), r.row.data) : migrate(r.row.data);
  if (local && local.nick !== nick) delete DB.profiles[local.nick];
  prof.nick = nick; prof.cloud = { uid: r.uid, email: r.email || (local && local.cloud && local.cloud.email) }; prof.pass = await hashPass(nick, pass);
  DB.profiles[nick] = prof; login(nick);
  toast('Прогресс загружен из облака');
}
function login(nick) {
  cloudReady = false;
  P = migrate(DB.profiles[nick]); DB.current = nick; save(); chooseVoice(); render.scrolled = false; viewGrade = null; cal = null;
  location.hash = '#/path'; render();
  isAdmin = false;
  if (P.cloud) cloudPull().then(checkAdmin);
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
    return `<a class="grade lv-${LEVEL_OF(n)} ${n === g ? 'on' : ''} ${o ? '' : 'locked'} ${pass ? 'passed' : ''}" href="#/path/${n}" aria-label="${gTitle(n)}"><b>${gShort(n)}</b>${pass ? icon('check') : o ? `<span>${Math.round(gradeProgress(n) * 100)}%</span>` : icon('lock')}</a>`;
  }).join('');
  const pd = SHOW_PHOTO_OF_DAY ? photoOfDay() : null, pq = pd && quoteFor(pd);
  return `
  <section class="hero ${pd ? 'hero-ph' : ''}">
    <span class="ghost-num" aria-hidden="true">${isGen() ? STAGES[g] : pad2(g)}</span>
    <div class="hero-t">
      <p class="hero-lvl">${lvTag(isGen() ? 'Уровень ' + LEVEL_OF(g) : G.level)}</p>
      <h1>${gTitle(g)}</h1>
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
  ${!open ? `<div class="banner">${icon('lock')}<div><b>${gTitle(g)} пока закрыта${isGen() ? '' : ''}.</b> Сдай итоговую контрольную ${gOf(g - 1)} — или пройди её модули.</div><a class="btn btn-sm" href="#/path/${g - 1}">Назад: ${gTitle(g - 1)}</a></div>` : ''}
  ${open && g === 5 && (P.grade > 5 || isGen()) && !gradePassed(5) ? `<div class="banner">${icon('bolt')}<div><b>${isGen() ? 'Уже знаешь основы?' : `Ты в ${P.grade} классе.`}</b> Проходи ${isGen() ? 'ступени' : 'классы'} контрольными: 40 заданий, 80% — и ${isGen() ? 'ступень засчитана' : 'класс засчитан'}.</div><button class="btn btn-sm" data-final="5">Контрольная ${gOf(5)}</button></div>` : ''}
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
    <p>${gradePassed(g) ? `Сдана на ${rec.best}%. ${g < 11 ? `Открыта следующая: ${gTitle(g + 1)}.` : 'Курс завершён.'}` : all ? `40 заданий по всей ${isGen() ? 'ступени' : 'программе класса'}. Нужно 80%.` : `Уже знаешь эту программу? Сдай на 80% — и ${isGen() ? 'ступень засчитана' : 'класс засчитан'}, откроется следующ${isGen() ? 'ая' : 'ий'}.`}</p>
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
    t = l.t; s = `Урок ${l.index + 1} из ${l.unit.lessons.length}. ` + (d ? 'Пройден — можно повторить.' : o ? '' : 'Сначала пройди предыдущий урок.');
    extra = gainHTML(l, true);
    if (l.topic) extra += `<a class="pop-topic" href="#/grammar/${l.topic.id}">${icon('scheme')}${esc(l.topic.t)}</a>`;
    if (o) { act = `lesson:${key}`; label = d ? 'Повторить' : 'Начать'; }
  } else {
    const u = UNITS.get(key), passed = unitPassed(u), all = unitLessonsDone(u) === u.lessons.length, rec = P.units[key];
    t = `Тест: ${u.title}`;
    s = passed ? `Сдан${rec && rec.best ? ` на ${rec.best}%` : ''}. Можно пересдать.` : all ? '20 заданий по модулю. Нужно 80%.' : 'Сдай на 80% — и модуль засчитан без уроков. 20 заданий.';
    if (gradeOpen(u.grade)) { act = `test:${key}`; label = passed ? 'Пересдать' : all ? 'Начать тест' : 'Сдать экстерном'; }
  }
  popEl = document.createElement('div'); popEl.className = 'pop';
  popEl.innerHTML = `<h3>${esc(t)}</h3>${s ? `<p>${esc(s)}</p>` : ''}${extra}${act ? `<button class="btn btn-wide btn-inv" data-go="${act}">${label}</button>` : ''}`;
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
        <h2 class="lvl-h"><span class="lv lv-${lv}">${lv}</span>${LEVELS[lv]}</h2>
        <div class="topic-grid lv-${lv}">${list.map(x => `<a class="topic-card" href="#/grammar/${x.id}" data-q="${esc((x.t + ' ' + x.id + ' ' + x.b.map(b => b.t || '').join(' ')).toLowerCase())}">
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

/* ================= админ: ученики ================= */
let ADM = null; // кэш строк из облака
function viewAdmin(arg) {
  return `<div class="page page-wide">
    <section class="hero hero-plain">
      <span class="ghost-num" aria-hidden="true">${ADM ? ADM.length : ''}</span>
      <div class="hero-t"><p class="hero-lvl">Кабинет админа</p><h1>${arg ? 'Ученик' : 'Ученики'}</h1>
      <p class="muted">${arg ? '' : 'Прогресс всех, кто занимается в облаке. Заметки учеников не показываются — это их личное.'}</p></div>
    </section>
    <div id="adm"><p class="muted">Загружаю…</p></div>
  </div>`;
}
// временно «становимся» учеником, чтобы посчитать его прогресс теми же функциями
function asStudent(data, fn) {
  const keepP = P, keepA = isAdmin;
  try { P = migrate(JSON.parse(JSON.stringify(data))); isAdmin = false; return fn(); } finally { P = keepP; isAdmin = keepA; }
}
const ago = iso => { const d = Math.floor((Date.now() - new Date(iso)) / 86400000); return d <= 0 ? 'сегодня' : d === 1 ? 'вчера' : `${d} ${plural(d, 'день', 'дня', 'дней')} назад`; };
function studentSummary(row) {
  return asStudent(row.data, () => {
    const t = today(); let week = 0;
    for (let d = t - 6; d <= t; d++) week += (P.days[d] && P.days[d].min) || 0;
    const st = nextStep(), lb = stepLabel(st);
    const curG = st ? (st.l ? st.l.unit.grade : st.u ? st.u.grade : st.g) : 11;
    return {
      nick: row.nick, uid: row.user_id, avatar: P.avatar, mode: P.mode, label: isGen() ? 'своя программа' : `${P.grade} класс`,
      xp: P.xp, lessons: Object.keys(P.lessons).length, units: Object.values(P.units).filter(u => u.passed).length,
      streak: P.streak.last >= t - 1 ? P.streak.n : 0, week: Math.round(week), last: row.updated_at,
      now: st ? `${gTitle(curG)}: ${lb.t}` : 'курс пройден', words: Object.keys(P.words).length,
    };
  });
}
async function loadAdmin(arg) {
  const box = $('#adm'); if (!box) return;
  if (!sb) { box.innerHTML = '<p class="empty">Нет связи с облаком.</p>'; return; }
  try {
    if (!ADM || !arg) { const { data, error } = await sb.from('progress').select('user_id,nick,updated_at,data').order('updated_at', { ascending: false }); if (error) throw error; ADM = data || []; }
  } catch (e) { box.innerHTML = `<p class="empty">Не удалось загрузить: ${esc(cloudErr(e))}</p>`; return; }
  if (route() !== 'admin') return;
  if (arg) return adminDetail(box, ADM.find(r => r.nick === decodeURIComponent(arg)));
  const list = ADM.map(studentSummary);
  box.innerHTML = list.length ? `
    <div class="stat-row">
      <div class="stat c-blue"><i class="stat-ic">${icon('users')}</i><b>${list.length}</b><span>учеников</span></div>
      <div class="stat c-orange"><i class="stat-ic">${icon('flame')}</i><b>${list.filter(s => (Date.now() - new Date(s.last)) < 7 * 86400000).length}</b><span>активны за неделю</span></div>
      <div class="stat c-red"><i class="stat-ic">${miniFlag()}</i><b>${list.reduce((a, s) => a + s.lessons, 0)}</b><span>уроков всего</span></div>
      <div class="stat c-green"><i class="stat-ic">${icon('clock')}</i><b>${Math.round(list.reduce((a, s) => a + s.week, 0) / 60)}</b><span>часов за неделю</span></div>
    </div>
    <div class="adm-table">${list.map(s => `
      <a class="adm-row" href="#/admin/${encodeURIComponent(s.nick)}">
        ${avaHTML({ nick: s.nick, avatar: s.avatar })}
        <span class="adm-name"><b>${esc(s.nick)}</b><small>${esc(s.label)} · сейчас: ${esc(s.now)}</small></span>
        <span class="adm-num"><b>${s.lessons}</b><small>уроков</small></span>
        <span class="adm-num"><b>${s.week}</b><small>мин / 7 дн</small></span>
        <span class="adm-num"><b>${s.streak}</b><small>серия</small></span>
        <span class="adm-num"><b>${s.xp}</b><small>опыт</small></span>
        <span class="adm-last">${ago(s.last)}</span>
      </a>`).join('')}</div>` : '<p class="empty">Пока никто не занимается в облаке.</p>';
}
function adminDetail(box, row) {
  if (!row) { box.innerHTML = '<p class="empty">Ученик не найден.</p>'; return; }
  const html = asStudent(row.data, () => {
    const t = today(), days = [];
    for (let d = t - 13; d <= t; d++) days.push({ d, m: Math.round((P.days[d] && P.days[d].min) || 0) });
    const max = Math.max(P.goal.minutes, ...days.map(x => x.m));
    const logs = [];
    for (let d = t; d > t - 30 && logs.length < 20; d--) for (const l of ((P.days[d] && P.days[d].log) || []).slice().reverse()) logs.push({ d, l });
    const tests = Object.entries(P.units).map(([k, v]) => ({ u: UNITS.get(k), v })).filter(x => x.u);
    return `
      <a class="back" href="#/admin">${icon('back')}Все ученики</a>
      <div class="me-head">${avaHTML(P, 'big')}<div class="me-name"><h2 class="page-h">${esc(P.nick)}</h2>
        <p class="muted">${isGen() ? 'Своя программа' : P.grade + ' класс'}${P.purpose ? ', ' + esc(PURPOSES[P.purpose] || '') : ''} · цель: ${esc(goalName())}, ${P.goal.minutes} мин/день · с ${new Date(P.created).toLocaleDateString(LOC)}</p></div></div>
      <div class="stat-row">
        <div class="stat c-red"><i class="stat-ic">${miniFlag()}</i><b>${Object.keys(P.lessons).length}</b><span>уроков</span></div>
        <div class="stat c-blue"><i class="stat-ic">${icon('clock')}</i><b>${Math.round(totalMin())}</b><span>минут всего</span></div>
        <div class="stat c-orange"><i class="stat-ic">${icon('flame')}</i><b>${P.streak.best}</b><span>лучшая серия</span></div>
        <div class="stat c-green"><i class="stat-ic">${icon('book')}</i><b>${Object.keys(P.words).length}</b><span>слов</span></div>
      </div>
      <h3 class="h-sub">Последние 14 дней</h3>
      <div class="adm-chart">${days.map(x => `<div class="adm-bar ${x.m >= P.goal.minutes ? 'ok' : ''}" title="${fmtDate(x.d)}: ${x.m} мин"><i style="height:${Math.max(2, x.m / max * 100)}%"></i><span>${dayToDate(x.d).getDate()}</span></div>`).join('')}</div>
      <p class="muted small">Высота столбика — минуты за день; яркие — норма выполнена (${P.goal.minutes} мин).</p>
      <h3 class="h-sub">${isGen() ? 'Ступени' : 'Классы'}</h3>
      <div class="grade-list">${ALL_GRADES.map(g => `<div class="gl-row"><b>${gShort(g)}</b><div class="gl-bar"><i style="transform:scaleX(${gradeProgress(g)})"></i></div><span>${gradePassed(g) ? `сдан, ${P.grades[g].best}%` : gradeOpen(g) ? Math.round(gradeProgress(g) * 100) + '%' : 'закрыт'}</span></div>`).join('')}</div>
      ${tests.length ? `<h3 class="h-sub">Тесты модулей</h3><ul class="cd-log">${tests.map(x => `<li>${esc(gTitle(x.u.grade))}, «${esc(x.u.title)}»: лучший ${x.v.best}% ${x.v.passed ? '— сдан' : '— не сдан'}</li>`).join('')}</ul>` : ''}
      <h3 class="h-sub">Что делал</h3>
      ${logs.length ? `<ul class="cd-log">${logs.map(x => `<li><span class="muted">${fmtDate(x.d)}:</span> ${esc(x.l)}</li>`).join('')}</ul>` : '<p class="empty">Пока нет записей.</p>'}`;
  });
  const self = P.cloud && row.user_id === P.cloud.uid;
  box.innerHTML = html + (self ? '' : `<div class="adm-unlock"><div><b>${row.data.unlockAll ? 'Все классы открыты' : 'Классы открываются по порядку'}</b><p class="muted small">${row.data.unlockAll ? 'Ученик может проходить любые уроки и тесты 5–11 класса без контрольных.' : 'Открой всё — и ученик сразу сможет пробовать любой класс и уровень.'}</p></div>
    <button type="button" class="btn btn-sm ${row.data.unlockAll ? 'btn-ghost' : ''}" data-unlock>${icon(row.data.unlockAll ? 'lock' : 'bolt')}${row.data.unlockAll ? 'Закрыть обратно' : 'Открыть все классы'}</button></div>
    <div class="adm-danger"><button type="button" class="btn btn-sm btn-danger" data-del>${icon('x')}Удалить ученика</button><p class="muted small">Аккаунт и весь прогресс удалятся навсегда — вернуть нельзя.</p></div>`);
  const un = $('[data-unlock]', box);
  un && un.addEventListener('click', async () => {
    const on = !row.data.unlockAll; un.disabled = true;
    const { error } = await sb.rpc('admin_set_unlock', { p_uid: row.user_id, p_on: on });
    un.disabled = false;
    if (error) return toast(/function|schema cache|not find/i.test(error.message) ? 'Эта кнопка ещё не включена в базе — попроси Claude дать SQL.' : cloudErr(error));
    row.data.unlockAll = on; toast(on ? `«${row.nick}»: все классы открыты` : `«${row.nick}»: классы снова по порядку`); adminDetail(box, row);
  });
  const del = $('[data-del]', box);
  del && del.addEventListener('click', async () => {
    if (!await confirmBox(`Удалить ученика «${row.nick}»? Аккаунт и весь прогресс удалятся навсегда.`, 'Удалить', 'Отмена')) return;
    del.disabled = true;
    const { error } = await sb.rpc('admin_delete_user', { p_uid: row.user_id });
    if (error) { del.disabled = false; return toast(/function|schema cache|not find/i.test(error.message) ? 'Удаление ещё не включено в базе — попроси Claude запустить SQL.' : cloudErr(error)); }
    ADM = null; toast(`Ученик «${row.nick}» удалён`); location.hash = '#/admin';
  });
}

function viewReview() {
  const due = dueWords(), di = dueItems(), known = Object.keys(P.words).length;
  const weak = Object.entries(P.words).sort((a, b) => a[1].s - b[1].s).slice(0, 12).map(([en]) => wordByEn(en)).filter(Boolean);
  return `
  <div class="page">
    <h1 class="page-h">Повторение</h1>
    <p class="lead">Слова возвращаются через 1, 2, 4, 7, 15 и 30 дней. Грамматика, где была ошибка, — завтра и ещё раз через 3 дня.</p>
    <div class="stat-row">
      <div class="stat c-green"><i class="stat-ic">${icon('book')}</i><b>${due.length}</b><span>слов ждут</span></div>
      <div class="stat c-violet"><i class="stat-ic">${icon('scheme')}</i><b>${di.length}</b><span>правил ждут</span></div>
      <div class="stat c-gold"><i class="stat-ic">${icon('star')}</i><b>${known}</b><span>слов в копилке</span></div>
      <div class="stat c-blue"><i class="stat-ic">${icon('check')}</i><b>${Object.values(P.words).filter(w => w.s >= 4).length}</b><span>выучено прочно</span></div>
    </div>
    ${known ? `<div><button class="btn" data-act="review">${icon('repeat')}${due.length + di.length ? 'Повторить сейчас' : 'Потренировать слабые слова'}</button></div>` : '<p class="empty">Пройди первый урок — слова появятся здесь.</p>'}
    ${weak.length ? `<h2 class="h-sub">Слабые места</h2><ul class="wordlist">${weak.map(w => `<li><button class="say" data-say="${esc(w.en)}" aria-label="Послушать">${icon('sound')}</button><b>${esc(w.en)}</b><span>${esc(w.ru)}</span><i class="lvl" style="--l:${P.words[w.en].s}"></i></li>`).join('')}</ul>` : ''}
  </div>`;
}
function viewMe() {
  const lessons = Object.keys(P.lessons).length, pi = planInfo();
  return `
  <div class="page">
    ${(() => { const cv = coverSrc(); return `
    <section class="me-cover ${cv ? 'has-img' : ''} ${P.cover ? 'own-cover' : ''}">
      ${cv && P.cover && P.cover.fit === 'contain' ? `<img class="me-cover-blur" src="${cv}" alt="">` : ''}
      ${cv ? `<img class="me-cover-img" src="${cv}" alt="" style="${P.cover ? coverStyle() : ''}">` : ''}
      <button type="button" class="cover-btn" data-me-cover>${icon('image')}Обложка</button>
      <div class="me-head" id="mehead">${meHeadHTML()}</div>
    </section>`; })()}
    ${sb && P.cloud && P.settings.hideCloud ? '' : `<section class="cloud-card" id="cloudcard">${cloudCardHTML()}</section>`}
    <div class="stat-row">
      <div class="stat c-gold"><i class="stat-ic">${icon('bolt')}</i><b>${P.xp}</b><span>опыт</span></div>
      <button type="button" class="stat c-green stat-btn" data-act="wallet"><i class="stat-ic">${icon('dollar')}</i><b class="usd-n">${usd()}</b><span>долларов · подробнее</span></button>
      <div class="stat c-orange"><i class="stat-ic">${icon('flame')}</i><b>${P.streak.best}</b><span>лучшая серия</span></div>
      <div class="stat c-red"><i class="stat-ic">${miniFlag()}</i><b>${lessons}</b><span>${plural(lessons, 'урок', 'урока', 'уроков')}</span></div>
      <div class="stat c-blue"><i class="stat-ic">${icon('clock')}</i><b>${Math.round(totalMin())}</b><span>минут всего</span></div>
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
    <div class="goal-form photo-card">${(() => { const gp = PHOTOS.length ? PHOTOS[strHash('goal' + P.nick) % PHOTOS.length] : null; return gp ? `<img class="photo-card-bg" src="${photoSrc(gp)}" alt="" loading="lazy">` : ''; })()}
      <div class="seg">${Object.entries(targetsFor(P.mode)).map(([k, t]) => `<button class="opt ${P.goal.target === k ? 'sel' : ''}" data-target="${k}">${t}</button>`).join('')}</div>
      <div class="seg">${MINUTES.map(m => `<button class="opt ${P.goal.minutes === m ? 'sel' : ''}" data-min="${m}">${m} мин</button>`).join('')}</div>
      <div class="seg">${DEADLINES.map(([w, t]) => `<button class="opt ${P.goal.weeks === w ? 'sel' : ''}" data-weeks="${w}">${t}</button>`).join('')}</div>
      <p class="plan-box ${pi.ok ? '' : 'warn'}">${esc(planText(pi))}</p>
    </div>
    <h2 class="h-sub">Достижения <span class="muted">${Object.keys(P.ach).filter(k => SHOW_DREAM || !k.startsWith('cards')).length} из ${ACH.filter(a => SHOW_DREAM || !a.id.startsWith('cards')).length}</span></h2>
    <div class="ach-grid">${ACH.filter(a => SHOW_DREAM || !a.id.startsWith('cards')).map(a => `<div class="ach c-${a.c || ACH_C[a.i] || 'gold'} ${P.ach[a.id] ? 'got' : ''}"><i class="ach-ic">${icon(a.i)}</i><b>${a.t}</b><span>${a.d}</span>${P.ach[a.id] ? '' : `<em class="ach-lock">${icon('lock')}</em>`}</div>`).join('')}</div>
    <h2 class="h-sub">Настройки</h2>
    <div class="settings">
      <label class="field"><span>Голос</span>
        <span class="row"><select id="voice">${AUDIO.size ? `<option value="" ${P.settings.voice ? '' : 'selected'}>Ava · США · нейроголос (лучший)</option>` : ''}${TTS.list.length ? TTS.list.map(v => `<option value="${esc(v.name)}" ${P.settings.voice && TTS.voice && TTS.voice.name === v.name ? 'selected' : ''}>${esc(voiceLabel(v))}</option>`).join('') : AUDIO.size ? '' : '<option>Английских голосов нет</option>'}</select>
        <button class="btn btn-ghost btn-sm" data-say="Hello! My name is Anna. I'm from London.">${icon('play')}Проверить</button></span></label>
      <p class="muted small">Голоса берутся из браузера. Самые живые — в Microsoft Edge (Natural) и Google Chrome (Google); на телефоне — голоса системы. Голоса с пометкой «живой» звучат лучше всего.</p>
      <label class="field"><span>Язык интерфейса</span>
        <select id="ulang"><option value="ru" ${EN ? '' : 'selected'}>Русский</option><option value="en" ${EN ? 'selected' : ''}>English</option></select></label>
      <label class="switch"><input type="checkbox" id="snd" ${P.settings.sound ? 'checked' : ''}><span>Звуки ответов</span></label>
      <label class="switch"><input type="checkbox" id="vib" ${P.settings.vibe !== false ? 'checked' : ''}><span>Вибрация (на телефоне)</span></label>
      <div class="row">
        <button class="btn btn-ghost btn-sm" data-act="export">Сохранить прогресс в файл</button>
        <label class="btn btn-ghost btn-sm file-btn">Загрузить из файла<input type="file" id="imp" accept=".json,application/json"></label>
      </div>
      <p class="muted small">${P.cloud ? 'Файл — запасная копия на всякий случай.' : 'Без облака прогресс хранится только в этом браузере. Файл — запасная копия.'}</p>
    </div>
  </div>`;
}
/* ================= аватары, обложка, кошелёк ================= */
const ANIMALS = [['eagle', 'Орёл'], ['duck', 'Утёнок'], ['fox', 'Лис'], ['bear', 'Медведь'], ['cat', 'Кот'], ['panda', 'Панда'], ['owl', 'Сова'], ['raccoon', 'Енот']];
const AV_BG = ['#3C3B6E', '#B22234', '#2EC4D6', '#3CCB7F', '#F5B83D', '#A97CFF', '#FF6FA8', '#26272D'];
const ACC = [
  { id: 'bowtie', t: 'Бабочка', slot: 'neck', p: 15 },
  { id: 'glasses', t: 'Тёмные очки', slot: 'eyes', p: 20 },
  { id: 'cap', t: 'Бейсболка USA', slot: 'head', p: 30 },
  { id: 'phones', t: 'Наушники', slot: 'head', p: 35 },
  { id: 'cowboy', t: 'Ковбойская шляпа', slot: 'head', p: 40 },
  { id: 'grad', t: 'Шапочка выпускника', slot: 'head', p: 60 },
  { id: 'liberty', t: 'Корона Свободы', slot: 'head', p: 80 },
  { id: 'crown', t: 'Золотая корона', slot: 'head', p: 100 },
];
// все звери нарисованы вокруг одной головы (центр 50,58, радиус ~30) — поэтому аксессуары садятся на любого
const eyes2 = (x1, x2, y, f) => f(x1, y) + f(x2, y);
const ANIMAL_SVG = {
  eagle: `<path d="M10 100Q14 78 50 80Q86 78 90 100Z" fill="#5B3A1E"/><ellipse cx="50" cy="56" rx="27" ry="29" fill="#FAFAF7"/>`
    + eyes2(40, 60, 54, (x, y) => `<circle cx="${x}" cy="${y}" r="4.3" fill="#F2B231"/><circle cx="${x}" cy="${y}" r="2.3" fill="#1a1a1a"/>`)
    + `<path d="M32 48.5L46 51.5M68 48.5L54 51.5" stroke="#3a3a3a" stroke-width="2.6" stroke-linecap="round"/><path d="M43 60Q50 56 57 60L55 68Q51 78 47 71Q44 66 43 60Z" fill="#F5B300"/><path d="M47 71Q50 74 53.5 68" stroke="#C98600" stroke-width="1.5" fill="none"/>`,
  duck: `<ellipse cx="50" cy="98" rx="32" ry="14" fill="#FFC71F"/><path d="M45 31Q47 19 54 25Q53 21 59 23Q54 30 50 32Z" fill="#FFC71F"/><circle cx="50" cy="57" r="29" fill="#FFD43B"/>`
    + `<circle cx="33" cy="65" r="5" fill="#FF8FA0" opacity=".5"/><circle cx="67" cy="65" r="5" fill="#FF8FA0" opacity=".5"/>`
    + eyes2(40, 60, 53, (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="#1d1d1d"/><circle cx="${x + 1.4}" cy="${y - 1.4}" r="1.3" fill="#fff"/>`)
    + `<ellipse cx="50" cy="66" rx="13" ry="6.5" fill="#FF9F1C"/><path d="M38 66Q50 70 62 66" stroke="#E07B00" stroke-width="1.6" fill="none"/>`,
  fox: `<path d="M24 46L28 15L45 34Z" fill="#E8692A"/><path d="M76 46L72 15L55 34Z" fill="#E8692A"/><path d="M28.5 38L30.5 22L39.5 33Z" fill="#3B2416"/><path d="M71.5 38L69.5 22L60.5 33Z" fill="#3B2416"/>`
    + `<path d="M19 50Q21 29 50 29Q79 29 81 50Q81 72 50 87Q19 72 19 50Z" fill="#F07C2A"/><path d="M27 59Q40 61 50 72Q60 61 73 59Q67 81 50 87Q33 81 27 59Z" fill="#FFF4E6"/>`
    + eyes2(39, 61, 53, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="3.3" ry="4" fill="#1d1d1d"/><circle cx="${x + 1}" cy="${y - 1.4}" r="1" fill="#fff"/>`)
    + `<ellipse cx="50" cy="72" rx="4.2" ry="3.1" fill="#1d1d1d"/>`,
  bear: eyes2(27, 73, 34, (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="#8B5A3C"/><circle cx="${x}" cy="${y}" r="5" fill="#C99A72"/>`)
    + `<circle cx="50" cy="58" r="30" fill="#8B5A3C"/><ellipse cx="50" cy="68" rx="14" ry="11" fill="#D9B38C"/>`
    + eyes2(40, 60, 53, (x, y) => `<circle cx="${x}" cy="${y}" r="3.3" fill="#1d1d1d"/><circle cx="${x + 1}" cy="${y - 1.2}" r="1" fill="#fff"/>`)
    + `<ellipse cx="50" cy="63" rx="5.2" ry="3.7" fill="#3B2416"/><path d="M50 66.5V70.5M45 72Q50 75.5 55 72" stroke="#3B2416" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  cat: `<path d="M23 47L23 17L46 32Z" fill="#9AA3AE"/><path d="M77 47L77 17L54 32Z" fill="#9AA3AE"/><path d="M27.5 40L27.5 25.5L38.5 33Z" fill="#F4A6B8"/><path d="M72.5 40L72.5 25.5L61.5 33Z" fill="#F4A6B8"/>`
    + `<ellipse cx="50" cy="58" rx="30" ry="28" fill="#AEB6C0"/><path d="M50 31V39M44 32V37.5M56 32V37.5" stroke="#8A939E" stroke-width="2.4" stroke-linecap="round"/>`
    + eyes2(40, 60, 55, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="3.8" ry="4.8" fill="#43A047"/><ellipse cx="${x}" cy="${y}" rx="1.3" ry="3.7" fill="#111"/>`)
    + `<path d="M47 64H53L50 67.5Z" fill="#F48FB1"/><path d="M50 67.5Q47 71 44 69M50 67.5Q53 71 56 69" stroke="#555" stroke-width="1.3" fill="none"/><path d="M30 64L17 62M30 68L17 70M70 64L83 62M70 68L83 70" stroke="#F2F2F2" stroke-width="1.2" stroke-linecap="round"/>`,
  panda: eyes2(27, 73, 34, (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="#1E1E1E"/>`)
    + `<circle cx="50" cy="58" r="30" fill="#FAFAFA"/><ellipse cx="39" cy="55" rx="7" ry="9.5" transform="rotate(28 39 55)" fill="#1E1E1E"/><ellipse cx="61" cy="55" rx="7" ry="9.5" transform="rotate(-28 61 55)" fill="#1E1E1E"/>`
    + eyes2(40, 60, 54, (x, y) => `<circle cx="${x}" cy="${y}" r="2.7" fill="#fff"/><circle cx="${x + 0.6}" cy="${y}" r="1.3" fill="#111"/>`)
    + `<ellipse cx="50" cy="66" rx="4.5" ry="3" fill="#1E1E1E"/><path d="M50 69Q47 72 44 70.5M50 69Q53 72 56 70.5" stroke="#1E1E1E" stroke-width="1.4" fill="none"/>`,
  owl: `<path d="M24 41L21 19L39 32Z" fill="#6D4C41"/><path d="M76 41L79 19L61 32Z" fill="#6D4C41"/><ellipse cx="50" cy="60" rx="31" ry="32" fill="#8D6E63"/>`
    + `<path d="M34 84q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0" stroke="#6D4C41" stroke-width="1.6" fill="none"/>`
    + eyes2(38, 62, 54, (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="#F3E5D8"/><circle cx="${x}" cy="${y}" r="5.6" fill="#F5B300"/><circle cx="${x}" cy="${y}" r="3" fill="#111"/><circle cx="${x + 1.2}" cy="${y - 1.4}" r="1" fill="#fff"/>`)
    + `<path d="M46 62H54L50 70Z" fill="#F59E0B"/>`,
  raccoon: `<path d="M24 43L26 17L43 30Z" fill="#7B8189"/><path d="M76 43L74 17L57 30Z" fill="#7B8189"/><path d="M28 37L29 24L37 30Z" fill="#2B2B2B"/><path d="M72 37L71 24L63 30Z" fill="#2B2B2B"/>`
    + `<ellipse cx="50" cy="58" rx="31" ry="28" fill="#9EA4AB"/><path d="M22 62Q36 52 50 66Q64 52 78 62Q70 82 50 85Q30 82 22 62Z" fill="#EDEFF1"/>`
    + `<path d="M21 52Q36 42 50 54Q64 42 79 52Q74 62 62 60Q50 58 50 58Q50 58 38 60Q26 62 21 52Z" fill="#2B2B2B"/><path d="M30 45Q38 41 46 46M54 46Q62 41 70 45" stroke="#EDEFF1" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    + eyes2(39, 61, 53, (x, y) => `<circle cx="${x}" cy="${y}" r="2.9" fill="#fff"/><circle cx="${x}" cy="${y}" r="1.6" fill="#111"/>`)
    + `<ellipse cx="50" cy="68" rx="4.2" ry="3" fill="#2B2B2B"/>`,
};
const libertySpikes = () => [-60, -40, -20, 0, 20, 40, 60].map(a => {
  const r = a * Math.PI / 180, cx = 50, cy = 42, p = (rad, d) => `${(cx + rad * Math.sin(r + d)).toFixed(1)} ${(cy - rad * Math.cos(r + d)).toFixed(1)}`;
  return `<path d="M${p(13, -0.13)}L${p(31, 0)}L${p(13, 0.13)}Z" fill="#3FA796" stroke="#2C7A6C" stroke-width="1"/>`;
}).join('');
const ACC_SVG = {
  bowtie: `<path d="M50 88L36 81V95Z" fill="#D7263D"/><path d="M50 88L64 81V95Z" fill="#D7263D"/><rect x="46.5" y="84.5" width="7" height="7" rx="2" fill="#A61B2E"/>`,
  glasses: `<rect x="29" y="48" width="18" height="12" rx="5" fill="#111"/><rect x="53" y="48" width="18" height="12" rx="5" fill="#111"/><path d="M47 52Q50 50 53 52" stroke="#111" stroke-width="2.4" fill="none"/><path d="M29 52L21 50M71 52L79 50" stroke="#111" stroke-width="2" stroke-linecap="round"/><path d="M32.5 51.5h5M56.5 51.5h5" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`,
  cap: `<path d="M24 37Q24 12 50 12Q76 12 76 37Z" fill="#1F3A93"/><path d="M50 12Q46 24 48 37" stroke="#16296B" stroke-width="1.5" fill="none"/><path d="M22 37Q50 31 88 39Q86 44 76 43Q50 39 24 42Z" fill="#16296B"/><rect x="54" y="20" width="14" height="9" rx="1.5" fill="#B22234"/><path d="M54 23h14M54 26h14" stroke="#fff" stroke-width="1.2"/><rect x="54" y="20" width="6" height="5" fill="#3C3B6E"/><circle cx="50" cy="12.5" r="2" fill="#16296B"/>`,
  phones: `<path d="M20 58Q20 20 50 20Q80 20 80 58" stroke="#2B2D42" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="11" y="47" width="14" height="23" rx="6" fill="#E63946"/><rect x="75" y="47" width="14" height="23" rx="6" fill="#E63946"/><rect x="14" y="51" width="4" height="15" rx="2" fill="#fff" opacity=".35"/>`,
  cowboy: `<ellipse cx="50" cy="32" rx="38" ry="7" fill="#7A4A21"/><path d="M30 32Q30 9 42 12Q50 18 58 12Q70 9 70 32Z" fill="#9C6331"/><path d="M31 26Q50 30 69 26V31Q50 35 31 31Z" fill="#3B2416"/><path d="M12 31Q14 24 21 29M88 31Q86 24 79 29" stroke="#7A4A21" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  grad: `<path d="M32 27Q32 35 50 35Q68 35 68 27V20H32Z" fill="#222"/><path d="M13 18L50 6L87 18L50 30Z" fill="#2E2E2E"/><circle cx="50" cy="18" r="2" fill="#F5C542"/><path d="M50 18Q70 20 76 22V38" stroke="#F5C542" stroke-width="2" fill="none"/><path d="M73 36h6l-1 8h-4z" fill="#F5C542"/>`,
  liberty: () => libertySpikes() + `<path d="M25 37Q50 26 75 37L73 43Q50 33 27 43Z" fill="#3FA796" stroke="#2C7A6C" stroke-width="1"/>`,
  crown: `<path d="M28 35L30 14L40 25L50 10L60 25L70 14L72 35Z" fill="#F5C542" stroke="#D49A1B" stroke-width="1.5" stroke-linejoin="round"/><rect x="28" y="31" width="44" height="6" rx="2" fill="#E0A82E"/><circle cx="50" cy="23" r="2.7" fill="#E63946"/><circle cx="38" cy="28" r="2" fill="#2EC4D6"/><circle cx="62" cy="28" r="2" fill="#2EC4D6"/><circle cx="30" cy="14" r="2" fill="#F5C542"/><circle cx="50" cy="10" r="2" fill="#F5C542"/><circle cx="70" cy="14" r="2" fill="#F5C542"/>`,
};
const accSvg = id => { const a = ACC_SVG[id]; return typeof a === 'function' ? a() : (a || ''); };
function avatarSVG(av) {
  const acc = av.acc || {};
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" fill="${av.bg || AV_BG[0]}"/><g>${ANIMAL_SVG[av.id] || ANIMAL_SVG.eagle}</g>${['neck', 'eyes', 'head'].map(s => accSvg(acc[s])).join('')}</svg>`;
}
// аватар профиля: своё фото → зверёк → первая буква ника
function avaHTML(p, cls = '') {
  const av = p && p.avatar, nick = (p && p.nick) || '?';
  if (av && av.type === 'img' && av.data) return `<span class="ava ava-pic ${cls}"><img src="${av.data}" alt=""></span>`;
  if (av && av.type === 'animal') return `<span class="ava ava-pic ${cls}">${avatarSVG(av)}</span>`;
  return `<span class="ava ${cls}">${esc(nick[0].toUpperCase())}</span>`;
}
// уменьшаем картинку на устройстве — в облако уходит небольшая JPEG-строка
function readImage(file, maxW, maxH, square, q) {
  return new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) return rej(new Error('type'));
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
      if (square) { const m = Math.min(sw, sh); sx = (sw - m) / 2; sy = (sh - m) / 2; sw = sh = m; }
      const k = Math.min(1, maxW / sw, maxH / sh), c = document.createElement('canvas');
      c.width = Math.round(sw * k); c.height = Math.round(sh * k);
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', q));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('load')); };
    img.src = url;
  });
}
// всплывающее окно-лист
function sheet(title, body, onClose) {
  const d = document.createElement('div'); d.className = 'modal sheet-wrap';
  d.innerHTML = `<div class="sheet" role="dialog" aria-label="${esc(title)}"><div class="sheet-h"><h3>${esc(title)}</h3><button type="button" class="icon-btn" data-close aria-label="Закрыть">${icon('x')}</button></div><div class="sheet-b">${body}</div></div>`;
  document.body.appendChild(d); requestAnimationFrame(() => d.classList.add('in'));
  const close = () => { d.remove(); document.removeEventListener('keydown', esc_); if (onClose) onClose(); };
  const esc_ = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', esc_);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) close(); });
  return { el: d, body: $('.sheet-b', d), close };
}

/* ---- кошелёк ---- */
function openWallet() {
  const left = ACH.filter(a => (SHOW_DREAM || !a.id.startsWith('cards')) && !P.ach[a.id]).length;
  const row = (ic, c, t, v) => `<li class="c-${c}"><i class="stat-ic">${icon(ic)}</i><span>${t}</span><b>${v}</b></li>`;
  const log = (P.usdLog || []).slice(0, 40);
  sheet('Доллары', `
    <div class="wal-bal">${icon('dollar')}<b class="usd-n">${usd()}</b><span>на счету</span></div>
    <h4 class="sheet-k">Как заработать</h4>
    <ul class="wal-list">
      ${row('path', 'red', 'Урок (повторный — $2)', '+$5')}
      ${row('trophy', 'gold', 'Медаль за урок: бронза $2 · серебро $4 · золото $6 · «Идеально» $10', 'до +$10')}
      ${row('flag', 'blue', 'Тест модуля', '+$15')}
      ${row('star', 'violet', 'Итоговая контрольная', '+$40')}
      ${row('repeat', 'teal', 'Повторение или тренировка темы', '+$3')}
      ${row('target', 'pink', `Достижение (осталось получить: ${left})`, '+$10')}
    </ul>
    <h4 class="sheet-k">На что потратить</h4>
    <ul class="wal-list">
      ${row('bulb', 'gold', 'Подсказка в задании', `$${USD.hint}`)}
      ${row('flame', 'orange', 'Вернуть прерванную серию', `$${USD.restore}`)}
      ${row('user', 'green', 'Аксессуары для аватара', `от $${Math.min(...ACC.map(a => a.p))}`)}
    </ul>
    <button type="button" class="btn btn-sm" data-shop>${icon('user')}Открыть магазин аватара</button>
    <h4 class="sheet-k">История</h4>
    ${log.length ? `<ul class="wal-log">${log.map(x => `<li><span class="muted">${new Date(x.t).toLocaleDateString(LOC, { day: 'numeric', month: 'short' })}</span><span>${esc(x.w)}</span><b class="${x.n < 0 ? 'neg' : ''}">${x.n < 0 ? '−' : '+'}$${Math.abs(x.n)}</b></li>`).join('')}</ul>`
    : '<p class="empty">Пока пусто. Пройди урок — и здесь появятся первые доллары.</p>'}`);
  const s = $('.sheet-wrap:last-of-type'); $('[data-shop]', s).onclick = () => { s.remove(); openAvatar('acc'); };
}

/* ---- аватар и магазин ---- */
function openAvatar(tab = 'animal') {
  P.owned = P.owned || {};
  const draft = () => (P.avatar && P.avatar.type === 'animal') ? P.avatar : { type: 'animal', id: 'eagle', bg: AV_BG[0], acc: {} };
  const sh = sheet('Аватар', '', () => { if (!S) render(); });
  const paint = () => {
    const d = draft();
    sh.body.innerHTML = `
      <div class="av-top"><div class="av-prev">${avaHTML(P, 'huge')}</div>
        <div class="av-info"><b>${esc(P.nick)}</b><span class="muted small">На счету <b class="usd-n" data-pre="$">$${usd()}</b></span>
        ${P.avatar ? '<button type="button" class="link-btn" data-av-reset>Вернуть букву</button>' : ''}</div></div>
      <div class="seg av-tabs">${[['animal', 'Зверёк'], ['acc', 'Аксессуары'], ['photo', 'Своё фото']].map(([k, t]) => `<button type="button" class="opt ${tab === k ? 'sel' : ''}" data-tab="${k}">${t}</button>`).join('')}</div>
      ${tab === 'animal' ? `
        <div class="av-grid">${ANIMALS.map(([id, t]) => `<button type="button" class="av-tile ${P.avatar && P.avatar.type === 'animal' && P.avatar.id === id ? 'sel' : ''}" data-animal="${id}">${avatarSVG({ ...d, id })}<span>${t}</span></button>`).join('')}</div>
        <p class="sheet-k">Фон</p>
        <div class="av-bgs">${AV_BG.map(c => `<button type="button" class="av-bg ${d.bg === c ? 'sel' : ''}" data-bg="${c}" style="background:${c}" aria-label="Фон"></button>`).join('')}</div>`
      : tab === 'acc' ? `
        <p class="muted small">Аксессуары покупаются за доллары один раз и надеваются на любого зверька. Нажми ещё раз — снимешь.</p>
        <div class="av-grid">${ACC.map(a => {
          const own = !!P.owned[a.id], on = d.acc && d.acc[a.slot] === a.id;
          return `<button type="button" class="av-tile ${on ? 'sel' : ''} ${own ? 'own' : ''}" data-acc="${a.id}">${avatarSVG({ ...d, acc: { [a.slot]: a.id } })}<span>${a.t}</span><em>${on ? 'Надето' : own ? 'Надеть' : `$${a.p}`}</em></button>`;
        }).join('')}</div>`
      : `
        <p class="muted small">Фото обрежется в круг и уменьшится. Его увидишь ты и твой репетитор.</p>
        <label class="btn btn-sm file-btn">${icon('image')}Загрузить фото<input type="file" accept="image/*" data-av-file></label>`}`;
  };
  paint();
  sh.body.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tab) { tab = b.dataset.tab; return paint(); }
    if ('avReset' in b.dataset) { P.avatar = null; save(); return paint(); }
    const d = draft();
    if (b.dataset.animal) { P.avatar = { ...d, type: 'animal', id: b.dataset.animal }; save(); sfx.coin(); return paint(); }
    if (b.dataset.bg) { P.avatar = { ...d, type: 'animal', bg: b.dataset.bg }; save(); return paint(); }
    if (b.dataset.acc) {
      const a = ACC.find(x => x.id === b.dataset.acc);
      if (!P.owned[a.id]) {
        if (usd() < a.p) return toast(`Нужно $${a.p}, у тебя $${usd()}. Доллары даются за уроки и достижения.`);
        spendUsd(a.p, `Аксессуар «${a.t}»`); P.owned[a.id] = true; sfx.ach(); vibe([20, 30, 20]); toast(`Куплено: ${a.t}`);
      }
      const acc = { ...(d.acc || {}) }; acc[a.slot] = acc[a.slot] === a.id && P.avatar && P.avatar.type === 'animal' ? undefined : a.id;
      P.avatar = { ...d, type: 'animal', acc }; save(); return paint();
    }
  });
  sh.body.addEventListener('change', async e => {
    const f = e.target.closest('[data-av-file]'); if (!f || !f.files[0]) return;
    try { P.avatar = { type: 'img', data: await readImage(f.files[0], 240, 240, true, 0.82) }; save(); toast('Фото поставлено'); paint(); }
    catch { toast('Не получилось открыть фото. Попробуй другое (JPG или PNG).'); }
  });
}

/* ---- обложка профиля ---- */
const COVER_PH = () => PHOTOS.filter(p => ['america', 'city', 'travel', 'nature'].includes(p.c));
function coverSrc() {
  const c = P.cover;
  if (c && c.img) return c.img;
  if (c && c.id && PH.get(c.id)) return photoSrc(PH.get(c.id));
  const cv = PHOTOS.length ? PHOTOS[strHash('cover' + P.nick + today()) % PHOTOS.length] : null;
  return cv ? photoSrc(cv) : '';
}
const coverStyle = () => { const c = P.cover || {}; return `object-position:50% ${c.y ?? 35}%;object-fit:${c.fit === 'contain' ? 'contain' : 'cover'}`; };
function openCover() {
  const list = COVER_PH();
  const sh = sheet('Обложка профиля', '', () => { if (!S) render(); });
  const paint = () => {
    const c = P.cover, src = coverSrc();
    sh.body.innerHTML = `
      ${c ? `<div class="cv-prev ${c.fit === 'contain' ? 'whole' : ''}">${c.fit === 'contain' ? `<img class="cv-blur" src="${src}" alt="">` : ''}<img src="${src}" alt="" style="${coverStyle()}"></div>
      <div class="seg cv-fit"><button type="button" class="opt ${c.fit !== 'contain' ? 'sel' : ''}" data-fit="cover">Заполнить</button><button type="button" class="opt ${c.fit === 'contain' ? 'sel' : ''}" data-fit="contain">Фото целиком</button></div>
      ${c.fit !== 'contain' ? `<label class="field cv-y"><span>Какую часть фото показать — двигай ползунок</span><input type="range" min="0" max="100" step="1" value="${c.y ?? 35}" data-y></label>` : ''}` : '<p class="muted small">Сейчас обложка меняется каждый день. Выбери своё фото — и его можно будет настроить.</p>'}
      <div class="row"><label class="btn btn-sm file-btn">${icon('image')}Загрузить своё фото<input type="file" accept="image/*" data-cv-file></label>
      ${c ? `<button type="button" class="btn btn-ghost btn-sm" data-cv="auto">${icon('repeat')}Новая каждый день</button>` : ''}</div>
      <p class="sheet-k">Или выбери из коллекции</p>
      <div class="cv-grid">${list.map(p => `<button type="button" class="cv-tile ${c && c.id === p.id ? 'sel' : ''}" data-cv="${p.id}"><img src="${photoSrc(p, true)}" alt="" loading="lazy"></button>`).join('')}</div>`;
  };
  paint();
  sh.body.addEventListener('click', e => {
    const f = e.target.closest('[data-fit]');
    if (f) { P.cover = { ...P.cover, fit: f.dataset.fit }; save(); return paint(); }
    const b = e.target.closest('[data-cv]'); if (!b) return;
    P.cover = b.dataset.cv === 'auto' ? null : { id: b.dataset.cv, y: 50, fit: 'cover' }; save(); paint();
    $('.sheet', sh.el).scrollTop = 0;
  });
  sh.body.addEventListener('input', e => {
    const r = e.target.closest('[data-y]'); if (!r) return;
    P.cover = { ...P.cover, y: +r.value }; $('.cv-prev img:last-child', sh.body).style.objectPosition = `50% ${r.value}%`;
  });
  sh.body.addEventListener('change', async e => {
    if (e.target.closest('[data-y]')) return save();
    const f = e.target.closest('[data-cv-file]'); if (!f || !f.files[0]) return;
    try { P.cover = { img: await readImage(f.files[0], 1400, 1000, false, 0.72), y: 50, fit: 'cover' }; save(); toast('Обложка обновлена'); paint(); $('.sheet', sh.el).scrollTop = 0; }
    catch { toast('Не получилось открыть фото. Попробуй другое (JPG или PNG).'); }
  });
}

/* ---- имя ---- */
function meHeadHTML(edit = false) {
  const sub = `${isGen() ? 'Своя программа' + (P.purpose ? ', ' + PURPOSES[P.purpose].toLowerCase() : '') : P.grade + ' класс'}, с ${new Date(P.created).toLocaleDateString(LOC)}`;
  if (!edit) return `<button type="button" class="ava-edit" data-me-ava aria-label="Сменить аватар">${avaHTML(P, 'big')}<i>${icon('pencil')}</i></button>
    <div class="me-name"><h1 class="page-h">${esc(P.nick)}</h1><p class="muted">${sub}</p></div>
    <div class="me-btns"><button class="btn btn-ghost btn-sm" data-me="rename">${icon('pencil')}Изменить имя</button><button class="btn btn-ghost btn-sm" data-act="logout">${icon('door')}Выйти</button></div>`;
  return `${avaHTML(P, 'big')}
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
    if (await nickTaken(nick)) return 'Такое имя уже занято в облаке.';
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
  if (P.cloud && cloudState === 'err' && cloudNeedLogin) return `<div class="cc-row">${icon('cloud')}<div><b>Войди снова, чтобы сохранять в облако</b>
    <p class="muted small">Прогресс пока сохраняется на этом устройстве. Введи пароль — и всё отправится в облако.</p></div></div>
    <form class="cc-form" id="ccre" novalidate>
      <label class="field"><span>Почта</span><input name="email" type="email" autocomplete="email" value="${esc(P.cloud.email || '')}"></label>
      <label class="field"><span>Пароль</span><input name="pass" type="password" autocomplete="current-password"></label>
      <p class="err" id="ccerr"></p><div class="row"><button class="btn btn-sm">Войти</button></div>
    </form>`;
  if (P.cloud) return `<div class="cc-row">${icon('cloud')}<div><b>Прогресс сохраняется в облаке</b>
    <p class="muted small">На другом устройстве открой сайт → «Уже занимаюсь — войти» → ${P.cloud.email ? `почта <b>${esc(P.cloud.email)}</b>` : `ник <b>${esc(P.nick)}</b>`} и твой пароль. Уроки, календарь и заметки подтянутся сами.</p></div>
    <button class="btn btn-ghost btn-sm" data-cc="sync">${icon('repeat')}Обновить</button>
    <button class="btn btn-ghost btn-sm cc-x" data-cc="hide" title="Скрыть и больше не показывать" aria-label="Скрыть и больше не показывать">${icon('x')}</button></div>`;
  return `<div class="cc-row">${icon('cloud')}<div><b>Облако не подключено</b>
    <p class="muted small">Сейчас прогресс живёт только в этом браузере. Подключи облако — и занимайся с телефона, планшета и других компьютеров.</p></div></div>
    <form class="cc-form" id="ccform" novalidate>
      <label class="field"><span>Почта (по желанию — чтобы восстановить пароль)</span><input name="email" type="email" maxlength="80" autocomplete="email" inputmode="email"></label>
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
    if (b.dataset.cc === 'hide') { P.settings.hideCloud = true; save(); box.remove(); return; }
    b.disabled = true; await cloudPull(); b.disabled = false; toast(cloudState === 'ok' ? 'Всё синхронизировано' : 'Нет связи с облаком');
  });
  const re = $('#ccre', box);
  re && re.addEventListener('submit', async e => {
    e.preventDefault(); const er = t => { $('#ccerr', box).textContent = t; };
    er('Вхожу…');
    const r = await cloudLogin(re.email.value || P.nick, re.pass.value);
    if (r.error) return er(r.error);
    if (r.uid !== P.cloud.uid) return er('Это другой аккаунт.');
    P.cloud.email = r.email; cloudNeedLogin = false; P.pass = await hashPass(P.nick, re.pass.value); save();
    await cloudPull(); checkAdmin(); toast('Готово, облако снова на связи'); render();
  });
  const f = $('#ccform', box); if (!f) return;
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const err = t => { $('#ccerr', box).textContent = t; };
    if (P.pass && await hashPass(P.nick, f.old.value) !== P.pass) return err('Текущий пароль не подходит.');
    if (f.pass.value.length < 6) return err('Пароль — минимум 6 символов.');
    err('Подключаю…');
    const r = await cloudRegister(P.nick, f.email.value, f.pass.value);
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
  const wd = dt.toLocaleDateString(LOC, { weekday: 'long' });
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
  $('.me-cover').addEventListener('click', e => { if (e.target.closest('[data-me-cover]')) openCover(); if (e.target.closest('[data-me-ava]')) openAvatar(); });
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
  $('#snd').addEventListener('change', e => { P.settings.sound = e.target.checked; save(); if (e.target.checked) sfx.ok(); });
  $('#ulang').addEventListener('change', async e => {
    P.settings.lang = e.target.value; save();
    if (P.cloud && sb) { try { await pushNow(); } catch { /* */ } }
    setLang(e.target.value);
  });
  $('#vib').addEventListener('change', e => { P.settings.vibe = e.target.checked; save(); vibe(40); });
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
  const lg = e.target.closest('[data-lang]'); if (lg && !P) return setLang(lg.dataset.lang);
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
  if (act === 'restore') restoreStreak();
  if (act === 'wallet') openWallet();
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
function startFinal(g) { S = { mode: 'final', g, title: `Итоговая контрольная: ${gTitle(g)}`, queue: buildFinal(g), intro: ['testinfo'] }; openPlayer(); }
function startPractice(t) { S = { mode: 'practice', topic: t, title: t.t, queue: buildPractice(t), intro: [] }; openPlayer(); }
function startReview() {
  if (!Object.keys(P.words).length) return toast('Сначала пройди хотя бы один урок.');
  S = { mode: 'review', title: 'Повторение', queue: buildReview(), intro: [] }; openPlayer();
}
const isTest = () => S.mode === 'test' || S.mode === 'final';
function openPlayer() {
  Object.assign(S, { i: 0, combo: 0, total: S.queue.length, done: 0, correct: 0, wrongs: [], start: Date.now(), screens: 0, phStart: Math.floor(Math.random() * Math.max(1, PHOTOS.length)), phN: 0 });
  const el = document.createElement('div'); el.className = 'player' + (PHOTOS.length ? ' has-photo' : '');
  el.innerHTML = `
    ${PHOTOS.length ? `<div class="p-photo" aria-hidden="true"><img class="pp" alt=""><img class="pp" alt=""><div class="pp-cap"></div></div>` : ''}
    <div class="p-top">
      <button class="icon-btn" data-p="quit" aria-label="Выйти">${icon('x')}</button>
      <div class="bar"><i></i></div>
      <span class="p-count"></span>
      <span class="p-combo" hidden></span>
      <span class="p-usd" title="Доллары">${icon('dollar')}<b class="usd-n">${usd()}</b></span>
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
    html = `<p class="ex-kicker">${gTitle(l.unit.grade)}. ${esc(l.unit.title)}, урок ${l.index + 1}</p><h2 class="ex-title">${esc(l.t)}</h2>
      ${gainHTML(l)}
      ${t ? `<section class="g-card"><p class="g-card-k">${icon('scheme')}Грамматика: ${esc(t.t)}</p>${topicHTML(t, { practice: false })}</section>` : ''}
      ${l.th && !(EN && t) ? `<section class="theory card"><p class="g-card-k">В этом уроке</p>${theoryHTML(l.th)}</section>` : ''}`;
  }
  if (kind === 'words') html = `<h2 class="ex-title">Слова урока</h2><p class="muted">Нажми на слово, чтобы послушать.</p><ul class="wordlist big">${S.l.words.map(w => `<li data-say="${esc(w.en)}"><span class="say">${icon('sound')}</span><b>${esc(w.en)}</b><span>${esc(w.ru)}</span></li>`).join('')}</ul>`;
  if (kind === 'testinfo') {
    const allowed = Math.floor(S.total * 0.2);
    html = `<h2 class="ex-title">${esc(S.title)}</h2>
      <div class="card info">
        <p>${S.total} заданий. Чтобы сдать, нужно <b>80%</b> — не больше ${allowed} ${plural(allowed, 'ошибки', 'ошибок', 'ошибок')}.</p>
        <p>Подсказок и повторов нет. Половина — на ввод: раскрыть скобки, перевести, записать на слух${TTS.ok ? '' : ' (на этом устройстве нет английского голоса — аудио заменено)'}.</p>
        <p>${S.mode === 'final' ? `Сдашь — ${gTitle(S.g)} засчитан${isGen() ? 'а' : ''}${S.g < 11 ? `, откроется ${gTitle(S.g + 1)}` : ''}.` : 'Сдашь — модуль закрыт, даже если уроки не пройдены.'}</p>
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
  if (ex.type === 'gap') html = `<h2 class="ex-title">${TITLES.gap()}</h2><p class="gap-s">${esc(ex.g.before)}<span class="slot">&nbsp;</span>${esc(ex.g.after)}</p>${ex.ru ? `<p class="muted notr">${esc(ex.ru)}</p>` : ''}${opts(ex.opts, 'opts-row')}`;
  if (ex.type === 'form') {
    html = `<h2 class="ex-title">${TITLES.form()}</h2>
      <p class="form-s">${esc(ex.f.before)}<span class="form-hint">(${esc(ex.f.hint)})</span><input class="form-in" id="tin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Ответ" size="${Math.max(6, ex.answer.length + 2)}">${esc(ex.f.after)}</p>
      ${ex.ru ? `<p class="muted notr">${esc(ex.ru)}</p>` : ''}
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
  if (!isTest()) html += `<div class="hint-row"><button type="button" class="hint-btn">${icon('bulb')}Подсказка<span>$${USD.hint}</span></button><p class="hint-out" aria-live="polite"></p></div>`;
  swapStage(html); footReset(); bindExercise(ex);
  const hb = $('#stage .hint-btn'); if (hb) hb.onclick = () => useHint(ex);
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
  S.combo = r.ok ? S.combo + 1 : 0; P.stats.combo = Math.max(P.stats.combo || 0, S.combo);
  const pc = $('.player .p-combo');
  if (pc) { pc.hidden = S.combo < 3; if (S.combo >= 3) { pc.innerHTML = `${icon('flame')}${S.combo} подряд`; pc.classList.remove('pop'); void pc.offsetWidth; pc.classList.add('pop'); } }
  if (r.ok && S.combo === 10) popAch(checkAch());
  if (r.ok || ex.type === 'match') S.done++;
  if (!r.ok && !isTest() && ex.type !== 'match' && !ex.retry) S.queue.push({ ...ex, retry: true, opts: ex.opts && shuffle(ex.opts), tiles: ex.tiles && shuffle(ex.tiles) });
  $$('#stage input').forEach(x => { x.readOnly = true; });
  if (['pick', 'listen', 'gap'].includes(ex.type)) $$('#stage .opt').forEach(x => { x.disabled = true; if (x.dataset.v === ex.answer) x.classList.add('ok'); else if (x.classList.contains('sel')) x.classList.add('bad'); });
  if (ex.type === 'form') { const i = $('#tin'); i.classList.add(r.ok ? 'ok' : 'bad'); }
  const showAns = ex.type === 'pick' ? (ex.dir === 'en' ? ex.ru : ex.en) : ex.en || ex.answer;
  const f = $('#foot'), fb = $('#fb');
  if (ex.type === 'match') { f.className = 'p-foot ok show'; fb.innerHTML = `<b>${r.ok ? 'Все пары без ошибок' : 'Все пары найдены'}</b>`; if (r.ok) sfx.ok(S.combo); }
  else if (r.ok) {
    f.className = 'p-foot ok show'; sfx.ok(S.combo);
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

function useHint(ex) {
  const st = $('#stage'), b = $('.hint-btn', st), out = $('.hint-out', st);
  if (!b || S.phase !== 'ex' || cur.hint) return;
  if (!spendUsd(USD.hint, 'Подсказка')) { toast(`Подсказка стоит $${USD.hint}, у тебя $${usd()}. Доллары даются за уроки.`); return; }
  cur.hint = true; b.disabled = true; sfx.coin(); vibe(15); save();
  const ans = String(ex.answer ?? ex.en ?? '').split('|')[0].trim();
  if (['pick', 'listen', 'gap'].includes(ex.type)) {
    const wrong = shuffle($$('.opt', st).filter(o => o.dataset.v !== ex.answer && !o.disabled));
    wrong.slice(0, Math.max(1, Math.floor(wrong.length / 2))).forEach(o => { o.disabled = true; o.classList.remove('sel'); o.classList.add('gone'); });
    if (cur.value && !$$('.opt.sel', st).length) { cur.value = null; $('#go').disabled = true; }
    out.textContent = 'Убрали часть неверных вариантов.';
  } else if (ex.type === 'match') {
    const l = $('.m-l:not(.ok)', st), r = l && $$('.m-r:not(.ok)', st).find(x => x.dataset.en === l.dataset.en);
    if (l && r) { l.classList.add('hinted'); r.classList.add('hinted'); }
    out.textContent = 'Подсветили одну пару.';
  } else if (ex.type === 'build') {
    const need = ans.split(/\s+/)[cur.value.length] || '';
    const t = $$('.bank .tile:not(.used)', st).find(x => norm(x.textContent) === norm(need));
    if (t) t.classList.add('hinted');
    out.textContent = need ? `Следующее слово начинается на «${need[0]}».` : 'Проверь порядок слов.';
  } else {
    out.textContent = 'Начало ответа: ' + ans.split(' ').map(w => w.replace(/^([^A-Za-z]*[A-Za-z])(.*)$/, (m, a, rest) => a + rest.replace(/[A-Za-z]/g, '·'))).join(' ');
  }
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
    P.stats.lessons++; if (perfect) P.stats.perfect++; P.stats.bestAcc = Math.max(P.stats.bestAcc || 0, acc);
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
      title = passed ? `${gTitle(S.g)} — сдано` : 'Контрольная пока не сдана';
      if (passed) viewGrade = Math.min(11, S.g + 1);
    }
    xp = passed ? (S.mode === 'final' ? 60 : 25) : 5;
    sub = passed ? `Результат ${acc}%.` : `Результат ${acc}%, нужно 80%. Разбери ошибки и попробуй снова — или пройди уроки.`;
  }
  const medal = S.mode === 'lesson' ? (acc >= 100 ? 'perfect' : acc >= 90 ? 'gold' : acc >= 80 ? 'silver' : acc >= 70 ? 'bronze' : null) : null;
  const cash = S.mode === 'lesson' ? (P.lessons[S.l.key].n > 1 ? 2 : 5) + ({ bronze: 2, silver: 4, gold: 6, perfect: 10 }[medal] || 0)
    : S.mode === 'test' ? (passed ? 15 : 0) : S.mode === 'final' ? (passed ? 40 : 0) : 3;
  earnUsd(cash, S.mode === 'lesson' ? `Урок «${S.l.t}»${medal ? ' · ' + MEDALS[medal].split(' · ')[0].toLowerCase() : ''}` : S.mode === 'test' ? `Тест модуля «${S.u.title}»` : S.mode === 'final' ? `Итоговая ${gOf(S.g)}` : S.mode === 'review' ? 'Повторение' : `Тема «${S.topic.t}»`);
  P.xp += xp; d.xp += xp; dv.xp += xp;
  P.xpDev = P.xpDev || {}; P.xpDev[DEVICE] = (P.xpDev[DEVICE] || 0) + xp;
  // дневник для календаря
  const logLine = S.mode === 'lesson' ? `Урок «${S.l.t}» — ${acc}%`
    : S.mode === 'test' ? `Тест модуля «${S.u.title}» — ${acc}%${passed ? ', сдан' : ''}`
    : S.mode === 'final' ? `Итоговая ${gOf(S.g)} — ${acc}%${passed ? ', сдана' : ''}`
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
      ${medal ? `<div class="medal m-${medal}">${icon(medal === 'perfect' ? 'star' : 'trophy')}<span>${MEDALS[medal]}</span></div>` : ''}
      <h2 class="res-t">${title}</h2>
      <p class="muted">${esc(sub)}</p>
      <div class="stat-row">
        <div class="stat c-pink"><i class="stat-ic">${icon('target')}</i><b>${acc}%</b><span>точность</span></div>
        <div class="stat c-blue"><i class="stat-ic">${icon('clock')}</i><b>${Math.max(1, Math.round(min))}</b><span>мин</span></div>
        <div class="stat c-gold"><i class="stat-ic">${icon('bolt')}</i><b>+${xp}</b><span>опыт</span></div>
        <div class="stat c-green"><i class="stat-ic">${icon('dollar')}</i><b>+$${cash}</b><span>доллары</span></div>
      </div>
      ${nc && !SHOW_RESULT_CARD && SHOW_DREAM ? `<button class="card-note" data-p="dream">${icon('image')}<span>+${newCards.length} ${plural(newCards.length, 'карточка', 'карточки', 'карточек')} в «Мечтах» · ${P.cards.length} из ${PHOTOS.length}</span></button>` : ''}
      ${S.wrongs.length ? `<h3 class="h-sub">Разбор ошибок</h3><ul class="mist">${S.wrongs.map(w => `<li><b>${esc(w.type === 'pick' ? (w.dir === 'en' ? w.en + ' — ' + w.ru : w.ru + ' — ' + w.en) : w.type === 'match' ? 'Пары слов' : (w.en || w.answer))}</b>${w.ru && w.type !== 'pick' ? `<span>${esc(w.ru)}</span>` : ''}</li>`).join('')}</ul>` : ''}
    </div>`);
  $('#foot').className = 'p-foot'; $('#fb').innerHTML = '';
  const g = $('#go'); g.className = 'btn'; g.disabled = false;
  const canNext = passed && st && ['lesson', 'test', 'final'].includes(S.mode);
  g.textContent = canNext ? (st.kind === 'lesson' ? 'Следующий урок' : st.kind === 'test' ? 'К тесту модуля' : 'К контрольной') : 'На карту';
  g.onclick = () => { closePlayer(); if (canNext) { if (st.kind === 'lesson') startLesson(st.l); else if (st.kind === 'test') startTest(st.u); else startFinal(st.g); } };
  $('.player .bar i').style.transform = 'scaleX(1)';
  if (passed && S.mode !== 'review') { sfx.done(); if (isTest() || perfect) confetti(); }
  setTimeout(() => popAch(fresh), 1100);
}
function confetti() {
  if (reduced()) return;
  const c = document.createElement('canvas'); c.className = 'confetti';
  const W = c.width = innerWidth, H = c.height = innerHeight; document.body.appendChild(c);
  const ctx = c.getContext('2d'), dark = matchMedia('(prefers-color-scheme: dark)').matches;
  const cols = ['#F0414F', '#FFFFFF', '#4D86FF', '#F5B83D', '#3CCB7F'];
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
// кто вошёл на этом устройстве, остаётся внутри, пока сам не нажмёт «Выйти» — без пароля
if (DB.current && DB.profiles[DB.current]) {
  P = migrate(DB.profiles[DB.current]);
  if (P.cloud && sb) cloudUid().then(uid => {
    if (uid && uid === P.cloud.uid) return cloudPull().then(checkAdmin);
    cloudNeedLogin = true; setCloud('err'); if (!S && routeParts()[0] === 'me') render();
  });
}
render();
})();
