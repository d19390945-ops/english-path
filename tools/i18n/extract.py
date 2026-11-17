"""Собирает из app.js русские текстовые узлы: статичные строки и шаблоны с подстановками ({0}, {1}...)."""
import re, json, sys
CYR = re.compile('[А-Яа-яЁё]')
src = open(sys.argv[1], encoding='utf-8').read()
n = len(src)
literals = []  # list of parts: str or None (= expression)

def skip_ws_comment(i):
    return i

def read_string(i, q):
    j = i + 1; out = []
    while j < n and src[j] != q:
        if src[j] == '\\': out.append(src[j:j + 2]); j += 2; continue
        out.append(src[j]); j += 1
    return ''.join(out), j + 1

def read_expr(i):
    """i at char after '${'; returns index after matching '}' and records nested literals."""
    depth = 0; j = i
    while j < n:
        c = src[j]
        if c in '\'"':
            s, j = read_string(j, c); literals.append([s]); continue
        if c == '`':
            j = read_template(j); continue
        if c == '{': depth += 1
        elif c == '}':
            if depth == 0: return j + 1
            depth -= 1
        j += 1
    return j

def read_template(i):
    j = i + 1; parts = []; buf = []
    while j < n:
        c = src[j]
        if c == '\\': buf.append(src[j:j + 2]); j += 2; continue
        if c == '`': break
        if c == '$' and j + 1 < n and src[j + 1] == '{':
            parts.append(''.join(buf)); buf = []; parts.append(None)
            j = read_expr(j + 2); continue
        buf.append(c); j += 1
    parts.append(''.join(buf)); literals.append(parts)
    return j + 1

i = 0
prev_sig = ''
while i < n:
    c = src[i]
    if src.startswith('//', i) and (i == 0 or src[i - 1] != ':'):
        j = src.find('\n', i); i = n if j < 0 else j; continue
    if src.startswith('/*', i):
        j = src.find('*/', i + 2); i = n if j < 0 else j + 2; continue
    if c == '/' and prev_sig in '(,=:[!&|?{};+' :
        # regex literal
        j = i + 1; cls = False
        while j < n:
            ch = src[j]
            if ch == '\\': j += 2; continue
            if ch == '[': cls = True
            elif ch == ']': cls = False
            elif ch == '/' and not cls: break
            elif ch == '\n': break
            j += 1
        i = j + 1; prev_sig = 'x'; continue
    if c in '\'"':
        s, i = read_string(i, c); literals.append([s]); prev_sig = 'x'; continue
    if c == '`':
        i = read_template(i); prev_sig = 'x'; continue
    if not c.isspace(): prev_sig = c
    i += 1

exact, pats, attrs = {}, {}, {}
TAG = re.compile(r'<[^<>]*>')
ATTR = re.compile(r'(?:title|placeholder|aria-label)="([^"]*)"')
for parts in literals:
    joined = ''.join('\x00' if p is None else p for p in parts)
    if not CYR.search(joined): continue
    for m in ATTR.finditer(joined):
        v = m.group(1)
        if CYR.search(v) and '\x00' not in v: exact[v.strip()] = 1
    for seg in TAG.split(joined):
        seg = seg.replace('&nbsp;', ' ')
        # a tag may be split across an expression; drop leftovers of tags
        seg = re.sub(r'^[^<]*?>', lambda m: m.group(0) if CYR.search(m.group(0)) and '="' not in m.group(0) else '', seg)
        seg = seg.split('<')[0] if '<' in seg else seg
        t = seg.strip()
        if not CYR.search(t): continue
        if '\x00' in t:
            k = 0
            def ph(_):
                global k
                r = '{%d}' % k; k += 1; return r
            key = re.sub('\x00', ph, t)
            pats[key] = 1
        else:
            exact[t] = 1

json.dump({'exact': sorted(exact), 'pat': sorted(pats)}, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(exact), 'exact', len(pats), 'patterns')
