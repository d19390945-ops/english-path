// Собирает русские строки из объяснений справочника (без упражнений g/f)
const fs = require('fs');
global.window = {};
eval(fs.readFileSync(process.argv[2], 'utf8'));
const CYR = /[А-Яа-яЁё]/;
const out = new Map();
const add = (s, id) => { if (typeof s === 'string' && CYR.test(s) && !out.has(s)) out.set(s, id); };
const walk = (v, id) => { if (typeof v === 'string') add(v, id); else if (Array.isArray(v)) v.forEach(x => walk(x, id)); else if (v && typeof v === 'object') for (const k of Object.keys(v)) if (k !== 'k') walk(v[k], id); };
for (const t of window.GRAMMAR) {
  add(t.t, t.id);
  for (const b of t.b) {
    if (b.k === 'ex') { b.items.forEach(x => { const i = x.indexOf(' = '); if (i < 0) add(x, t.id); }); continue; }
    walk(b, t.id);
  }
}
const arr = [...out.keys()];
fs.writeFileSync(process.argv[3], JSON.stringify(arr, null, 0));
console.log(arr.length, 'strings,', arr.reduce((a, s) => a + s.length, 0), 'chars');
