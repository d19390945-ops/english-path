// Собирает все английские фразы, которые сайт может озвучить: слова, предложения, пропуски, «раскрой скобки»,
// примеры из уроков и справочника. Ключ фразы — как в app.js (audioKey). Запуск: node tools/audio/phrases.js > phrases.json
const fs = require('fs'), path = require('path');
const site = path.join(__dirname, '..', '..', 'site');
global.window = {};
eval(fs.readFileSync(path.join(site, 'data/grammar.js'), 'utf8'));
eval(fs.readFileSync(path.join(site, 'data/grammar-c1.js'), 'utf8'));
for (let g = 5; g <= 12; g++) eval(fs.readFileSync(path.join(site, `data/grade${g}.js`), 'utf8'));

// та же нормализация и хеш, что в app.js
const audioNorm = s => String(s).replace(/\*\*/g, '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const fnv = (s, h) => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const audioKey = s => { const n = audioNorm(s); return n ? fnv(n, 2166136261).toString(36) + fnv(n, 3735928559).toString(36) : ''; };

const gapEn = str => { const main = str.split(' | ')[0]; const m = main.match(/^(.*)\{([^}]*)\}(.*)$/); return m ? m[1] + m[2].split('|')[0] + m[3] : null; };
const formEn = str => { const main = str.split(' | ')[0]; const m = main.match(/^(.*?)\(([^()]*?):([^()]*)\)(.*)$/); return m ? m[1] + m[3].split('|')[0].trim() + m[4] : null; };
const out = new Map();
const add = t => { if (!t) return; t = String(t).trim(); const k = audioKey(t); if (k && !out.has(k)) out.set(k, t); };

add("Hello! My name is Anna. I'm from London.");
for (const t of window.GRAMMAR) {
  (t.g || []).forEach(x => add(gapEn(x)));
  (t.f || []).forEach(x => add(formEn(x)));
  for (const b of t.b) {
    if (b.k === 'ex') b.items.forEach(x => add(x.split(' = ')[0]));
    if (b.k === 'move') { add(b.a); add(b.b); }
  }
}
for (const g of Object.values(window.COURSE)) for (const u of g.units) for (const l of u.lessons) {
  (l.w || '').split(';').forEach(x => { const i = x.indexOf('='); if (i > 0) add(x.slice(0, i)); });
  (l.s || []).forEach(x => add(x.split(' | ')[0]));
  (l.g || []).forEach(x => add(gapEn(x)));
  (l.f || []).forEach(x => add(formEn(x)));
  (l.th || '').split('\n').map(x => x.trim()).filter(x => x.startsWith('> ')).forEach(x => add(x.slice(2).split(' = ')[0]));
}
process.stdout.write(JSON.stringify([...out].map(([k, t]) => ({ k, t }))));
