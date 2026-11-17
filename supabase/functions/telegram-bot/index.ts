// Telegram-бот Your Road to the USA: отвечает на /start, /help, /lesson и кнопки меню.
// Работает как Supabase Edge Function (бесплатно, свой сервер не нужен).
// Секреты (Supabase → Edge Functions → Secrets): TG_BOT_TOKEN, TG_WEBHOOK_SECRET, (необязательно) TG_CHANNEL — ник канала без @.
// Verify JWT для этой функции — ВЫКЛЮЧИТЬ (Telegram не умеет его слать; защищаемся секретом вебхука).

const TOKEN = Deno.env.get('TG_BOT_TOKEN') ?? '';
const SECRET = Deno.env.get('TG_WEBHOOK_SECRET') ?? '';
const CHANNEL = (Deno.env.get('TG_CHANNEL') ?? '').replace(/^@/, '');
const SITE = 'https://d19390945-ops.github.io/english-path/';
const API = `https://api.telegram.org/bot${TOKEN}`;

type Btn = Record<string, unknown>;

async function tg(method: string, body: Record<string, unknown>) {
  const r = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) console.error(method, r.status, await r.text());
}

const open: Btn = { text: '🇺🇸 Начать урок', web_app: { url: SITE } };
const back: Btn[] = [{ text: '← Назад', callback_data: 'menu' }];

function menuKb(): Btn[][] {
  const kb: Btn[][] = [
    [open],
    [{ text: '📚 Что внутри', callback_data: 'inside' }, { text: '🎮 Игра и доллары', callback_data: 'game' }],
    [{ text: '🧭 С чего начать', callback_data: 'how' }, { text: '👨‍👩‍👧 Родителям', callback_data: 'parents' }],
  ];
  if (CHANNEL) kb.push([{ text: '📣 Наш канал', url: `https://t.me/${CHANNEL}` }]);
  return kb;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function menuText(name?: string) {
  return `${name ? `Привет, ${esc(name)}! ` : 'Привет! '}Это <b>Your Road to the USA</b> 🇺🇸

Английский с нуля до B2 — по школьной программе 5–11 класса или в своём темпе.

• 199 уроков, 48 тем грамматики схемами
• 3 375 фраз живым голосом
• медали, серии и доллары за уроки

<b>Бесплатно, без рекламы и подписки.</b>
Жми «Начать урок» — всё откроется прямо здесь, в Telegram 👇`;
}

const PAGES: Record<string, string> = {
  inside: `<b>Что внутри</b> 📚

• <b>Классы 5–11</b> или <b>ступени A1 → B2</b> — выбираешь сам
• в уроке: правило схемой → новые слова → ~20 заданий (выбор, пары, пропуски, раскрой скобки, собери фразу, на слух)
• <b>справочник грамматики</b>: 48 тем — формулы из плашек, линии времени
• <b>повторение</b>: слова возвращаются через 1, 2, 4, 7, 15, 30 дней
• интерфейс на русском или полностью на английском`,
  game: `<b>Игра и доллары</b> 🎮

• урок — <b>$5</b>, медаль — до <b>+$10</b>, тест модуля — <b>$15</b>, итоговая — <b>$40</b>
• медали: бронза 70% · серебро 80% · золото 90% · «Идеально» 100%
• серия верных ответов — звук становится выше с каждым ответом
• 25+ достижений: «Первый шаг», «Десять подряд», «Почти идеально»…
• доллары тратишь на подсказки и наряды для аватара: от бабочки до <b>золотой короны</b> 👑`,
  how: `<b>С чего начать</b> 🧭

1. Жми «Начать урок»
2. Придумай ник (пароль — по желанию, нужен, чтобы зайти с другого устройства)
3. Выбери свой класс — или ступень A1, если начинаешь с нуля
4. Пройди первый урок — это несколько минут

Совет: 1 урок в день лучше, чем 7 уроков раз в неделю.`,
  parents: `<b>Родителям</b> 👨‍👩‍👧

• программа идёт по темам школьного курса 5–11 класса (Spotlight / Oxford — темы и грамматика; тексты учебников не копируем)
• бесплатно, без рекламы и без подписок
• нет чатов и общения с незнакомцами
• сайт сделал репетитор для своих учеников
• прогресс виден в профиле: уроки, медали, минуты, серия дней`,
};

async function sendMenu(chat: number, name?: string) {
  await tg('sendMessage', { chat_id: chat, text: menuText(name), parse_mode: 'HTML', reply_markup: { inline_keyboard: menuKb() } });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST' || !SECRET || req.headers.get('x-telegram-bot-api-secret-token') !== SECRET) {
    return new Response('forbidden', { status: 403 });
  }
  const u = await req.json().catch(() => ({}));

  try {
    if (u.message) {
      const m = u.message;
      if (m.chat?.type !== 'private') return new Response('ok');
      const chat = m.chat.id as number;
      const text = String(m.text ?? '').trim();
      const name = m.from?.first_name as string | undefined;

      if (/^\/start\b/.test(text) || /^\/menu\b/.test(text)) await sendMenu(chat, name);
      else if (/^\/lesson\b/.test(text)) {
        await tg('sendMessage', { chat_id: chat, text: 'Открываю уроки 👇', reply_markup: { inline_keyboard: [[open]] } });
      } else if (/^\/help\b/.test(text)) {
        await tg('sendMessage', { chat_id: chat, text: PAGES.how, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[open], back] } });
      } else {
        await tg('sendMessage', {
          chat_id: chat,
          text: 'Я пока не умею отвечать на сообщения 🙂 Уроки — по кнопке ниже, меню — /start',
          reply_markup: { inline_keyboard: [[open]] },
        });
      }
    } else if (u.callback_query) {
      const q = u.callback_query;
      const chat = q.message?.chat?.id as number;
      const mid = q.message?.message_id as number;
      await tg('answerCallbackQuery', { callback_query_id: q.id });
      if (q.data === 'menu') {
        await tg('editMessageText', { chat_id: chat, message_id: mid, text: menuText(q.from?.first_name), parse_mode: 'HTML', reply_markup: { inline_keyboard: menuKb() } });
      } else if (PAGES[q.data]) {
        await tg('editMessageText', { chat_id: chat, message_id: mid, text: PAGES[q.data], parse_mode: 'HTML', reply_markup: { inline_keyboard: [[open], back] } });
      }
    }
  } catch (e) {
    console.error(e);
  }
  return new Response('ok');
});
