"""Собирает site/data/ui-en.js из списков русских строк и английских переводов (по номерам)."""
import json, io, os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]

def tsv(name):
    m = {}
    for line in io.open(os.path.join(D, name), encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip(): continue
        k, v = line.split('\t', 1)
        m[int(k)] = v
    return m

segs = json.load(io.open(os.path.join(D, 'segs.json'), encoding='utf-8'))
course = json.load(io.open(os.path.join(D, 'course.json'), encoding='utf-8'))
gram = json.load(io.open(os.path.join(D, 'gram.json'), encoding='utf-8'))
exact, pats = {}, {}
problems = []

def put(ru, en, src):
    if ru in exact and exact[ru] != en and src != 'ui':
        return  # интерфейс важнее
    exact[ru] = en

for i, en in tsv('en_ui.txt').items():
    put(segs['exact'][i], en, 'ui')
for i, ru in enumerate(segs['exact']):
    if i not in tsv('en_ui.txt') and ru not in ('а', 'ая', 'ий'): problems.append('no ui ' + ru)
pt = tsv('en_pat.txt')
for i, en in pt.items():
    ru = segs['pat'][i]
    if ru.count('{') < len(set(re.findall(r'\{\d\}', en))): problems.append('pat placeholders ' + ru)
    pats[ru] = en
cs = tsv('en_course.txt')
if len(cs) != len(course): problems.append(f'course count {len(cs)} vs {len(course)}')
for i, en in cs.items(): put(course[i], en, 'course')
gs = tsv('en_gram.txt')
if len(gs) != len(gram): problems.append(f'gram count {len(gs)} vs {len(gram)}')
for i, en in gs.items():
    ru = gram[i]
    put(ru, en, 'gram')
    if ru[:1] in '*~':
        put(ru[1:], en[1:] if en[:1] in '*~' else en, 'gram')
for line in io.open(os.path.join(D, 'en_extra.txt'), encoding='utf-8'):
    line = line.rstrip('\n')
    if not line: continue
    kind, ru, en = line.split('\t')
    if kind == 'E': exact[ru] = en
    else: pats[ru] = en

# шаблоны, которые начинаются с иконки ({0}…): иконка — не текст, добавим и голую версию
for ru, en in list(pats.items()):
    m = re.match(r'^\{0\}([^{].*)$', ru)
    if m and not en.startswith('{0}') and '{0}' not in en:
        pass

js = '/* Английский интерфейс: русская строка → английская. Собирается скриптом tools/i18n/build_en.py — руками не править. {0},{1} — подстановки. */\n'
js += 'window.UI_EN = ' + json.dumps({'exact': exact, 'pat': [[k, v] for k, v in pats.items()]}, ensure_ascii=False, indent=0) + ';\n'
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(js)
print(len(exact), 'exact,', len(pats), 'patterns')
print('\n'.join(problems) or 'no problems')
