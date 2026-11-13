"""Английский путь — подготовка мотивационных фото для сайта.

Что делает:
  1. Берёт .jpg из папки-источника (по умолчанию «Загрузки/Telegram Desktop»).
  2. Сжимает в WebP: большое фото (ширина 720) и миниатюру (ширина 300) → site/photos/.
  3. Перемешивает так, чтобы фото одной темы не шли подряд.
  4. Пишет список в site/data/photos.js.

Темы фото — в tools/photo-tags.json (имя файла → тема). Новые фото без темы получают тему «mix».
Темы: emma, business, study, city, nature, america, travel, life; exclude — не публиковать.
Флаг "q": на фото уже есть текст-цитата (поверх такого фото свою цитату не кладём).

Запуск:  python tools/photos.py ["папка с фото"]
"""
import json, os, re, sys, random, glob
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser('~'), 'Downloads', 'Telegram Desktop')
OUT = os.path.join(ROOT, 'site', 'photos')
TAGS = os.path.join(ROOT, 'tools', 'photo-tags.json')

tags = json.load(open(TAGS, encoding='utf-8'))
os.makedirs(os.path.join(OUT, 't'), exist_ok=True)

def slug(name):
    base = os.path.splitext(name)[0].lower()
    return re.sub(r'[^a-z0-9]+', '-', base).strip('-')

items = []
for path in sorted(glob.glob(os.path.join(SRC, '*.jpg')) + glob.glob(os.path.join(SRC, '*.jpeg')) + glob.glob(os.path.join(SRC, '*.png'))):
    name = os.path.basename(path)
    t = tags.get(name, {'c': 'mix'})
    if t.get('c') == 'exclude':
        continue
    pid = slug(name)
    big, small = os.path.join(OUT, pid + '.webp'), os.path.join(OUT, 't', pid + '.webp')
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    w, h = im.size
    if not os.path.exists(big):
        b = im.copy(); b.thumbnail((720, 1400)); b.save(big, 'WEBP', quality=74, method=6)
    if not os.path.exists(small):
        s = im.copy(); s.thumbnail((300, 600)); s.save(small, 'WEBP', quality=62, method=6)
    bw, bh = Image.open(big).size
    it = {'id': pid, 'c': t.get('c', 'mix'), 'w': bw, 'h': bh}
    if t.get('q'): it['q'] = 1
    items.append(it)

# перемешивание: каждый раз берём тему, которой осталось больше всего, но не ту же, что в двух последних
rng = random.Random(2026)
pools = {}
for it in items: pools.setdefault(it['c'], []).append(it)
for p in pools.values(): rng.shuffle(p)
order, last = [], []
while any(pools.values()):
    cands = [c for c, p in pools.items() if p and c not in last[-2:]] or [c for c, p in pools.items() if p and c != (last[-1] if last else None)] or [c for c, p in pools.items() if p]
    cands.sort(key=lambda c: (-len(pools[c]), rng.random()))
    c = cands[0] if rng.random() < 0.75 or len(cands) == 1 else cands[1]
    order.append(pools[c].pop()); last.append(c)

with open(os.path.join(ROOT, 'site', 'data', 'photos.js'), 'w', encoding='utf-8') as f:
    f.write('/* Мотивационные фото (сгенерировано tools/photos.py — руками не править). Порядок уже перемешан по темам. */\n')
    f.write('window.PHOTOS = ' + json.dumps(order, ensure_ascii=False, separators=(',', ':')) + ';\n')

size = sum(os.path.getsize(os.path.join(dp, fn)) for dp, _, fns in os.walk(OUT) for fn in fns)
print(f'фото: {len(order)}, темы: { {c: sum(1 for i in order if i["c"] == c) for c in pools} }, вес: {size / 1048576:.1f} МБ')
print('первые 20 тем по порядку:', ' '.join(i['c'] for i in order[:20]))
