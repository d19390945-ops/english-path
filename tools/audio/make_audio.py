"""Озвучивает фразы курса нейроголосом Microsoft (edge-tts) в site/audio/<ключ>.mp3 и пишет список готовых ключей
в site/audio/keys.js. Уже готовые файлы пропускает — можно запускать повторно.
Запуск: node tools/audio/phrases.js > tools/audio/phrases.json && python tools/audio/make_audio.py"""
import asyncio, json, os, sys, time
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'site', 'audio')
VOICE = os.environ.get('VOICE', 'en-US-AvaNeural')
os.makedirs(OUT, exist_ok=True)
items = json.load(open(os.path.join(ROOT, 'tools', 'audio', 'phrases.json'), encoding='utf-8'))

def spoken(t):
    return t.replace('**', '').replace('→', ', ').replace('/', ', ').strip()

done = fail = 0
async def one(sem, it):
    global done, fail
    path = os.path.join(OUT, it['k'] + '.mp3')
    if os.path.exists(path) and os.path.getsize(path) > 500:
        done += 1; return
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(spoken(it['t']), VOICE).save(path + '.part')
                os.replace(path + '.part', path); done += 1
                if done % 100 == 0: print(f'{done}/{len(items)}', flush=True)
                return
            except Exception as e:
                await asyncio.sleep(2 + attempt * 3)
        fail += 1; print('FAIL', it['t'][:60], flush=True)

async def main():
    sem = asyncio.Semaphore(int(os.environ.get('PAR', '5')))
    await asyncio.gather(*(one(sem, it) for it in items))

t0 = time.time()
asyncio.run(main())
keys = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith('.mp3'))
with open(os.path.join(OUT, 'keys.js'), 'w', encoding='utf-8') as f:
    f.write('/* Готовые записи фраз (нейроголос). Собирает tools/audio/make_audio.py. */\nwindow.AUDIO_KEYS = "' + ' '.join(keys) + '";\n')
print(f'done={done} fail={fail} files={len(keys)} time={time.time()-t0:.0f}s', flush=True)
