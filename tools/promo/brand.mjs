// Логотип и аватары-звери из кода сайта → SVG + PNG (прозрачный фон) для роликов и соцсетей.
// Запуск: node tools/promo/brand.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'продвижение', 'материалы', 'бренд');
const CHROME = path.resolve(ROOT, '..', 'shorts', 'node_modules', '.remotion', 'chrome-headless-shell', 'win64', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const TMP = 'C:\\ClaudeTools\\temp\\brand';
fs.mkdirSync(path.join(OUT, 'аватары'), { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const app = fs.readFileSync(path.join(ROOT, 'site', 'app.js'), 'utf8');
// кусок с рисунками зверей и аксессуаров
const a = app.indexOf('const ANIMALS = ['), b = app.indexOf('// аватар профиля:');
const lib = new Function(app.slice(a, b) + '; return { ANIMALS, ACC, AV_BG, avatarSVG };')();
// логотип
const logoLine = app.match(/const logo = \(cls = 'logo'\) => `(.*?)`;/s)[1];
const logo = logoLine.replace('class="${cls}" ', '').replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" ');

const files = [['логотип-флаг', logo]];
for (const [id, t] of lib.ANIMALS) files.push([`аватары/${id}`, lib.avatarSVG({ id, bg: lib.AV_BG[0], acc: {} })]);
for (const a2 of lib.ACC) files.push([`аватары/eagle-${a2.id}`, lib.avatarSVG({ id: 'eagle', bg: lib.AV_BG[0], acc: { [a2.slot]: a2.id } })]);
files.push(['аватары/eagle-полный-образ', lib.avatarSVG({ id: 'eagle', bg: '#B22234', acc: { head: 'cowboy', eyes: 'glasses', neck: 'bowtie' } })]);

for (const [name, svg0] of files) {
  const svg = svg0.includes('xmlns') ? svg0 : svg0.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" ').replace(' aria-hidden="true"', '');
  fs.writeFileSync(path.join(OUT, name + '.svg'), svg);
  const html = path.join(TMP, 'x.html'), png = path.join(TMP, 'x.png');
  fs.writeFileSync(html, `<!doctype html><html><body style="margin:0;background:transparent">${svg.replace(/width="1024" height="1024"/, 'width="1024" height="1024" style="display:block"')}</body></html>`);
  execFileSync(CHROME, ['--headless', '--hide-scrollbars', '--default-background-color=00000000', '--window-size=1024,1024', `--screenshot=${png}`, 'file:///' + html.replace(/\\/g, '/')], { stdio: 'ignore' });
  fs.copyFileSync(png, path.join(OUT, name + '.png'));
  console.log('✓', name);
}
