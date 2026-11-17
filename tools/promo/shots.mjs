// Скриншоты сайта для продвижения: безголовый Chrome (из Remotion) + протокол DevTools.
// Демо-профиль живёт только в этом браузере (?nocloud), в облако не попадает.
// Запуск: node tools/promo/shots.mjs   (нужен локальный сервер сайта на http://localhost:5176)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'продвижение', 'материалы', 'скриншоты');
const CHROME = path.resolve(ROOT, '..', 'shorts', 'node_modules', '.remotion', 'chrome-headless-shell', 'win64', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const BASE = 'http://localhost:5176/index.html';
const PORT = 9333;
const sleep = ms => new Promise(r => setTimeout(r, ms));

fs.mkdirSync(path.join(OUT, 'телефон'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'компьютер'), { recursive: true });
const udd = 'C:\\ClaudeTools\\temp\\cdp-ep';
fs.rmSync(udd, { recursive: true, force: true });
const proc = spawn(CHROME, ['--headless', `--remote-debugging-port=${PORT}`, `--user-data-dir=${udd}`, '--hide-scrollbars', '--no-first-run', '--autoplay-policy=no-user-gesture-required', '--lang=ru', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0; const pending = new Map();
async function connect() {
  for (let i = 0; i < 40; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); const t = (await r.json()).find(x => x.type === 'page'); if (t) return t.webSocketDebuggerUrl; } catch { /* */ } await sleep(250); }
  throw new Error('chrome не запустился');
}
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
async function js(expr) {
  const r = await send('Runtime.evaluate', { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
let device = 'телефон';
async function view(kind) {
  device = kind;
  if (kind === 'телефон') await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: false });
  else await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
}
let nav = 0; // новый адрес каждый раз — страница полностью перезагружается, окна закрываются
async function go(hash = '', q = 'nocloud&debug') { await send('Page.navigate', { url: `${BASE}?${q}&n=${++nav}${hash}` }); await sleep(2200); await js(`document.querySelector('#cloudcard')?.remove();`).catch(() => {}); }
async function shot(name) { await sleep(500); const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, device, name + '.png'), Buffer.from(r.data, 'base64')); console.log('✓', device, name); }

// демо-профиль: прогресс, серия, доллары, аватар-орёл в шляпе, обложка с флагом
async function makeDemo(lang = 'ru') {
  await go(); await js(`localStorage.clear(); localStorage.setItem('englishpath.lang', '${lang}');`); await go();
  await js(`
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let b = [...document.querySelectorAll('button')].find(b => /Новый ученик|New student/.test(b.textContent)); if (b) { b.click(); await sleep(300); }
    const f = document.querySelector('#onb'); f.nick.value = 'Alex';
    for (let i = 0; i < 4; i++) { const g = document.querySelector('#onb'); if (!g) break; g.requestSubmit(); await sleep(500); }
    const E = window.__ep, P = E.P(), L = [...E.LESSONS.values()], t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    L.filter(l => l.unit.grade === 5).slice(0, 23).forEach((l, i) => { P.lessons[l.key] = { at: t - (23 - i), acc: [100, 95, 88, 100, 92][i % 5], n: 1 }; l.words.forEach(w => { P.words[w.en] = { s: 1 + (i % 4), due: t + 1 + (i % 5) }; }); });
    ['5.u0', '5.u1', '5.u2', '5.u3'].forEach(k => { P.units[k] = { best: 95, passed: true, at: t - 3 }; });
    for (let d = t - 20; d <= t; d++) { const m = d === t - 6 ? 0 : 18 + ((d * 7) % 25); if (m) P.days[d] = { min: m, xp: m * 3, dev: {}, log: [] }; }
    P.streak = { n: 6, last: t, best: 14 }; P.xp = 1240;
    Object.assign(P.stats, { lessons: 23, perfect: 7, tests: 4, ace: 2, reviews: 9, goalDays: 15, practice: 6, bestAcc: 100, combo: 14 });
    ['first', 'acc70', 'acc80', 'perfect5', 'combo10', 'grammar', 's3', 's7', 'goal', 'unit', 'ace', 'review5', 'usd100'].forEach(a => { P.ach[a] = t - 2; });
    P.usdEarn = { demo: 310 }; P.usdSpent = { demo: 95 };
    P.usdLog = [{ t: Date.now() - 3600e3, n: 15, w: 'Урок «Present Simple» · идеально' }, { t: Date.now() - 7200e3, n: 10, w: 'Достижение «Десять подряд»' }, { t: Date.now() - 9e6, n: -40, w: 'Аксессуар «Ковбойская шляпа»' }, { t: Date.now() - 1e8, n: 15, w: 'Тест модуля «Семья»' }, { t: Date.now() - 1.5e8, n: -5, w: 'Подсказка' }];
    P.owned = { cowboy: true, glasses: true, bowtie: true }; P.avatar = { type: 'animal', id: 'eagle', bg: '#3C3B6E', acc: { head: 'cowboy', eyes: 'glasses' } };
    P.cover = { id: 'img005-2', y: 45, fit: 'cover' }; P.settings.sound = false; P.settings.lang = '${lang}';
    const DB = JSON.parse(localStorage.getItem('englishpath.v1')); DB.profiles[P.nick] = P; DB.current = P.nick; localStorage.setItem('englishpath.v1', JSON.stringify(DB));
  `);
}

async function lessonShots(prefix) {
  await go('#/path');
  await js(`window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 300)); document.querySelector('[data-act=next]').click(); await new Promise(r => setTimeout(r, 900)); window.scrollTo(0, 0);`);
  await shot(prefix + '06-урок-теория');
  await js(`const s = ms => new Promise(r => setTimeout(r, ms)); for (let i = 0; i < 3; i++) { if (document.querySelector('#stage .opt, #stage .tile, #stage .type-in, #stage .form-in')) break; document.querySelector('#go').click(); await s(700); }`);
  await js(`window.__ep.S().combo = 4;`);
  await shot(prefix + '07-задание');
  await js(`const b = document.querySelector('.hint-btn'); if (b) b.click(); await new Promise(r => setTimeout(r, 500));`);
  await shot(prefix + '08-подсказка');
  await js(`const s = ms => new Promise(r => setTimeout(r, ms)); const ex = window.__ep.cur().ex; const o = [...document.querySelectorAll('#stage .opt')].find(o => o.dataset.v === ex.answer && !o.disabled); if (o) { o.click(); await s(150); document.querySelector('#go').click(); await s(700); }`);
  await shot(prefix + '09-верно-серия');
  await js(`const s = ms => new Promise(r => setTimeout(r, ms)); const S = window.__ep.S(); S.i = S.queue.length - 1; S.queue.length = S.total; S.correct = S.total; S.wrongs = []; document.querySelector('#go').click(); await s(1600);`);
  await shot(prefix + '10-итог-медаль');
  await sleep(900);
  await shot(prefix + '11-достижение-плашка');
}

try {
  ws = new WebSocket(await connect());
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); const p = pending.get(m.id); if (p) { pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await send('Page.enable'); await send('Runtime.enable');

  for (const kind of ['телефон', 'компьютер']) {
    await view(kind);
    // вход (без профиля): RU и EN
    await go(); await js(`localStorage.clear();`); await go(); await shot('01-вход-RU');
    await js(`localStorage.setItem('englishpath.lang', 'en');`); await go(); await shot('02-вход-EN');
    await makeDemo('ru');
    await go('#/path'); await shot('03-путь');
    await js(`window.scrollTo(0, 620);`); await shot('04-карта-модулей');
    await go('#/grammar'); await shot('12-грамматика');
    await go('#/grammar/present-simple'); await js(`window.scrollTo(0, 380);`); await shot('13-тема-схема');
    await go('#/review'); await shot('14-повторение');
    await go('#/me'); await shot('15-профиль');
    await js(`document.querySelector('.ach-grid').scrollIntoView({ block: 'start' }); window.scrollBy(0, -80);`); await shot('16-достижения');
    await go('#/me'); await js(`document.querySelector('[data-act=wallet]').click(); await new Promise(r => setTimeout(r, 600));`); await shot('17-кошелёк');
    await go('#/me'); await js(`document.querySelector('[data-me-ava]').click(); await new Promise(r => setTimeout(r, 500)); document.querySelector('[data-tab=acc]').click(); await new Promise(r => setTimeout(r, 400));`); await shot('18-магазин-аватара');
    await lessonShots('');
    // английский интерфейс
    await makeDemo('en');
    await go('#/path'); await shot('19-путь-EN');
    await go('#/grammar/present-simple'); await js(`window.scrollTo(0, 380);`); await shot('20-тема-EN');
  }
} catch (e) { console.error('ОШИБКА', e.message); process.exitCode = 1; }
finally { try { ws && ws.close(); } catch { /* */ } proc.kill(); }
