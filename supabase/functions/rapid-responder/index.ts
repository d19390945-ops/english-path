// Telegram-бот Your Road to the USA (Supabase Edge Function).
// Тексты и кнопки НЕ здесь, а в site/bot.json на GitHub Pages: правим его и делаем git push — бот подхватит сам.
// Этот код в Supabase меняем, только когда нужны новые умения бота.
// Секреты (Supabase → Edge Functions → Secrets): TG_BOT_TOKEN, TG_WEBHOOK_SECRET, (необязательно) TG_CHANNEL — ник канала без @.
// Verify JWT для функции — ВЫКЛЮЧЕН (Telegram не умеет его слать; защищаемся секретом вебхука).

const TOKEN = Deno.env.get('TG_BOT_TOKEN') ?? '';
const SECRET = Deno.env.get('TG_WEBHOOK_SECRET') ?? '';
const CHANNEL = (Deno.env.get('TG_CHANNEL') ?? '').replace(/^@/, '');
const OWNER = Deno.env.get('TG_OWNER_ID') ?? ''; // куда присылать идеи (узнать: написать боту /myid)
const SITE = 'https://d19390945-ops.github.io/english-path/site/';
const CONFIG_URL = SITE + 'bot.json';
const API = `https://api.telegram.org/bot${TOKEN}`;

type Btn = { text: string; open?: boolean; page?: string; url?: string; channel?: boolean; idea?: boolean };
type Screen = { text: string; buttons?: Btn[][] };
type Config = {
  menu: Screen;
  pages: Record<string, Screen>;
  commands: Record<string, string>;
  lesson?: Screen;
  fallback?: Screen;
  back?: string;
  idea?: { prompt: string; placeholder?: string; thanks: string; empty?: string };
};

const IDEA_DEFAULT = {
  prompt: 'Напиши свою идею одним сообщением — она придёт автору сайта.',
  placeholder: 'Моя идея…',
  thanks: 'Спасибо! Идея отправлена автору 🙌',
  empty: 'Пока не получилось отправить — попробуй позже.',
};

// запасной вариант, если bot.json не скачался
const DEFAULT: Config = {
  menu: { text: 'Привет, {name}! Это <b>Your Road to the USA</b> 🇺🇸\nАнглийский с нуля до C1 — бесплатно.', buttons: [[{ text: '🇺🇸 Начать урок', open: true }]] },
  pages: {},
  commands: { '/start': 'menu', '/menu': 'menu', '/lesson': 'lesson' },
  lesson: { text: 'Открываю уроки 👇', buttons: [[{ text: '🇺🇸 Начать урок', open: true }]] },
  fallback: { text: 'Меню — /start', buttons: [[{ text: '🇺🇸 Начать урок', open: true }]] },
  back: '← Назад',
};

let cache: { at: number; cfg: Config } | null = null;
async function config(): Promise<Config> {
  if (cache && Date.now() - cache.at < 30_000) return cache.cfg;
  try {
    // меняем адрес раз в минуту, чтобы кэш GitHub Pages не держал старую версию
    const r = await fetch(`${CONFIG_URL}?t=${Math.floor(Date.now() / 60_000)}`);
    if (!r.ok) throw new Error('bot.json ' + r.status);
    const cfg = { ...DEFAULT, ...(await r.json()) } as Config;
    cache = { at: Date.now(), cfg };
    return cfg;
  } catch (e) {
    console.error(e);
    return cache?.cfg ?? DEFAULT;
  }
}

async function tg(method: string, body: Record<string, unknown>) {
  const r = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) console.error(method, r.status, await r.text());
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function keyboard(rows: Btn[][]) {
  return rows
    .map((row) =>
      row
        .map((b) => {
          if (b.open) return { text: b.text, web_app: { url: SITE } };
          if (b.page) return { text: b.text, callback_data: 'p:' + b.page };
          if (b.idea) return { text: b.text, callback_data: 'idea' };
          if (b.channel) return CHANNEL ? { text: b.text, url: `https://t.me/${CHANNEL}` } : null;
          if (b.url) return { text: b.text, url: b.url };
          if (b.text && /назад|back/i.test(b.text)) return { text: b.text, callback_data: 'p:menu' };
          return null;
        })
        .filter(Boolean),
    )
    .filter((row) => row.length);
}

// экран по имени: menu, lesson, fallback или страница из pages
function screen(cfg: Config, id: string, name?: string): { text: string; reply_markup: unknown } {
  const own = id === 'menu' ? cfg.menu : id === 'lesson' ? cfg.lesson : id === 'fallback' ? cfg.fallback : cfg.pages[id];
  const s = own ?? cfg.menu;
  const isPage = !!cfg.pages[id];
  const rows: Btn[][] = s.buttons ?? (isPage ? [[{ text: '🇺🇸 Начать урок', open: true }], [{ text: cfg.back ?? '← Назад', page: 'menu' }]] : []);
  return {
    text: s.text.replace(/\{name\}/g, name ? esc(name) : 'друг'),
    reply_markup: { inline_keyboard: keyboard(rows) },
  };
}

// просим написать идею: ответ на это сообщение и будет идеей
async function askIdea(cfg: Config, chat: number) {
  const t = { ...IDEA_DEFAULT, ...cfg.idea };
  await tg('sendMessage', {
    chat_id: chat,
    text: t.prompt,
    reply_markup: { force_reply: true, input_field_placeholder: t.placeholder },
  });
}

const isIdeaReply = (cfg: Config, m: any) => {
  const p = ({ ...IDEA_DEFAULT, ...cfg.idea }).prompt;
  const r = m.reply_to_message;
  return !!(r?.from?.is_bot && typeof r.text === 'string' && r.text.startsWith(p.slice(0, 20)));
};

async function sendIdea(cfg: Config, m: any) {
  const t = { ...IDEA_DEFAULT, ...cfg.idea };
  const f = m.from ?? {};
  const who = `<a href="tg://user?id=${f.id}">${esc([f.first_name, f.last_name].filter(Boolean).join(' ') || 'без имени')}</a>` +
    (f.username ? ` (@${esc(f.username)})` : '');
  if (!OWNER) {
    console.log('IDEA (TG_OWNER_ID не задан):', f.id, m.text);
    await tg('sendMessage', { chat_id: m.chat.id, text: t.empty });
    return;
  }
  await tg('sendMessage', { chat_id: OWNER, parse_mode: 'HTML', text: `💡 <b>Новая идея</b>\nОт: ${who}` });
  await tg('copyMessage', { chat_id: OWNER, from_chat_id: m.chat.id, message_id: m.message_id });
  await tg('sendMessage', { chat_id: m.chat.id, text: t.thanks, reply_markup: { inline_keyboard: keyboard([[{ text: '← В меню', page: 'menu' }]]) } });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST' || !SECRET || req.headers.get('x-telegram-bot-api-secret-token') !== SECRET) {
    return new Response('forbidden', { status: 403 });
  }
  const u = await req.json().catch(() => ({}));

  try {
    const cfg = await config();
    if (u.message) {
      const m = u.message;
      if (m.chat?.type !== 'private') return new Response('ok');
      const text = String(m.text ?? '').trim();
      const cmd = (text.match(/^\/[a-z_]+/i)?.[0] ?? '').toLowerCase();
      if (isIdeaReply(cfg, m) && !cmd) {
        await sendIdea(cfg, m);
      } else if (cmd === '/myid') {
        await tg('sendMessage', { chat_id: m.chat.id, parse_mode: 'HTML', text: `Твой id: <code>${m.chat.id}</code>` });
      } else if (cmd === '/idea' || cfg.commands[cmd] === 'idea') {
        await askIdea(cfg, m.chat.id);
      } else {
        const id = cfg.commands[cmd] ?? 'fallback';
        await tg('sendMessage', { chat_id: m.chat.id, parse_mode: 'HTML', ...screen(cfg, id, m.from?.first_name) });
      }
    } else if (u.callback_query) {
      const q = u.callback_query;
      await tg('answerCallbackQuery', { callback_query_id: q.id });
      if (q.data === 'idea') {
        if (q.message) await askIdea(cfg, q.message.chat.id);
        return new Response('ok');
      }
      const id = String(q.data ?? '').replace(/^p:/, '');
      if (q.message) {
        await tg('editMessageText', {
          chat_id: q.message.chat.id,
          message_id: q.message.message_id,
          parse_mode: 'HTML',
          ...screen(cfg, id, q.from?.first_name),
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
  return new Response('ok');
});
