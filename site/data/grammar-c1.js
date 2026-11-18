/* Справочник грамматики — уровень C1 (продвинутый: свободное общение, работа и учёба за границей).
   Формат тот же, что в grammar.js. Подключается после grammar.js и добавляет темы в window.GRAMMAR. */
window.GRAMMAR = window.GRAMMAR || [];
window.GRAMMAR.push(

{ id: 'c1-cleft', t: 'Выделение: It was… that / What I need is…', lvl: 'C1', v: 'cleft sentences it was that what I need is объяснение на русском',
  b: [
    { k: 'lead', t: 'Чтобы выделить главное, фразу делят на две части: It is / was X that… или What… is X.' },
    { k: 'table', head: ['Обычно', 'С выделением'], rows: [['Tom broke the vase.', 'It was Tom who broke the vase.'], ['I need a break.', 'What I need is a break.'], ['She left because she was tired.', 'It was because she was tired that she left.'], ['I like his honesty.', 'The thing I like is his honesty.']] },
    { k: 'ex', items: ['It was in Boston that we first met. = Именно в Бостоне мы впервые встретились.', 'What surprised me was the price. = Удивила меня именно цена.', 'All I want is some peace and quiet. = Всё, чего я хочу, — немного тишины.'] },
    { k: 'tip', t: 'О людях — It was Tom who…, обо всём остальном — It was … that…' },
  ],
  g: ['It was my brother {who|which} told me.', '{What|That} I really need is a holiday.', 'It was in 2019 {that|when it} we moved to Texas.', 'All I want {is|are} a quiet evening.', 'It was the noise {that|what} kept me awake.'],
  f: ['It (be:was) Sarah who called you yesterday. | Тебе вчера звонила именно Сара.', 'What I love (be:is) the people here. | Что я люблю — так это здешних людей.', 'It (be:is) the noise that bothers me. | Мне мешает именно шум.'] },

{ id: 'c1-participle', t: 'Причастные обороты', lvl: 'C1', v: 'participle clauses having done объяснение на русском',
  b: [
    { k: 'lead', t: 'Вместо придаточного с союзом — короткий оборот с -ing, V3 или having + V3. У обеих частей одно подлежащее.' },
    { k: 'table', head: ['Оборот', 'Значит', 'Пример'], rows: [['V-ing', 'одновременно / потому что', 'Walking home, I met Anna.'], ['Having + V3', 'сначала одно, потом другое', 'Having finished the report, she went home.'], ['V3', 'с ним что-то сделали', 'Built in 1900, the house needs repairs.'], ['Not + V-ing', 'отрицание', 'Not knowing the way, we took a taxi.']] },
    { k: 'compare', a: ['Правильно', 'Walking down the street, I saw a bear.'], b: ['Ошибка', 'Walking down the street, a bear appeared. (медведь по улице не шёл)'] },
    { k: 'tip', t: 'Проверь: кто выполняет действие оборота? Это должно быть подлежащее главной части.' },
  ],
  g: ['{Having finished|Finished} my homework, I went out.', '{Written|Writing} in 1925, the novel is still popular.', '{Not knowing|Not knew} what to say, he smiled.', '{Feeling|Felt} tired, she went to bed early.'],
  f: ['(finish:Having finished) the test, we left the room. | Закончив тест, мы вышли из аудитории.', '(build:Built) in 1886, the statue welcomes millions of visitors. | Построенная в 1886 году, статуя встречает миллионы туристов.', '(not know:Not knowing) anyone in New York, I felt lonely. | Никого не зная в Нью-Йорке, я чувствовал себя одиноко.'] },

{ id: 'c1-inv-cond', t: 'Условные без if: Had I known, Should you…', lvl: 'C1', v: 'inverted conditionals had I known should you объяснение на русском',
  b: [
    { k: 'lead', t: 'В деловой и официальной речи if убирают, а вспомогательный глагол ставят в начало.' },
    { k: 'table', head: ['Обычно', 'Без if'], rows: [['If I had known…', 'Had I known, I would have come.'], ['If you need help…', 'Should you need help, call me.'], ['If I were you…', 'Were I you, I would accept.'], ['If it were not for your help…', 'But for your help, I would have failed.']] },
    { k: 'table', head: ['Союз', 'Значение'], rows: [['unless', 'если не'], ['provided / providing (that)', 'при условии, что'], ['as long as', 'если только, пока'], ['otherwise', 'иначе'], ['in case', 'на случай, если']] },
    { k: 'tip', t: 'In case — «на всякий случай», заранее: Take an umbrella in case it rains. Это не «если».' },
  ],
  g: ['{Had I|I had} known, I would have helped.', '{Should|Would} you have any questions, let us know.', 'You can go {provided|unless} you are back by ten.', 'Take a map {in case|if} you get lost.'],
  f: ['(be:Were) I in your position, I would apply. | Будь я на твоём месте, я бы подал заявку.', '(have:Had) we left earlier, we would have caught the train. | Если бы мы вышли раньше, мы бы успели на поезд.', 'We will go hiking (if not:unless) it rains. | Пойдём в поход, если не будет дождя.'] },

{ id: 'c1-subjunctive', t: 'Сослагательное: I suggest he go, It is vital that…', lvl: 'C1', v: 'subjunctive I suggest that he go it is vital that объяснение на русском',
  b: [
    { k: 'lead', t: 'После «предлагаю, требую, важно, чтобы…» в официальной речи глагол стоит в начальной форме — без -s и без времени.' },
    { k: 'formula', rows: [['+', 'suggest / insist / demand / recommend', 'that', 'S', '~V'], ['+', "it's essential / vital / important", 'that', 'S', '~V']] },
    { k: 'ex', items: ['I suggest that he take a break. = Предлагаю ему сделать перерыв.', 'It is vital that she be on time. = Очень важно, чтобы она пришла вовремя.', 'They insisted that he leave. = Они настояли, чтобы он ушёл.'] },
    { k: 'tip', t: 'В британской речи часто should: I suggest that he should take a break. Оба варианта верны.' },
  ],
  g: ['The doctor recommended that he {rest|rests} for a week.', 'It is essential that every student {be|is} present.', 'She insisted that I {stay|stayed} for dinner.', 'They demanded that the manager {resign|resigns}.'],
  f: ['I suggest that she (apply:apply) for the scholarship. | Предлагаю ей подать заявку на стипендию.', 'It is important that he (not be:not be) late. | Важно, чтобы он не опоздал.', 'The teacher demanded that we (hand in:hand in) the essays today. | Учитель потребовал, чтобы мы сдали эссе сегодня.'] },

{ id: 'c1-reporting', t: 'Говорят, что…: He is said to, It is believed', lvl: 'C1', v: 'he is said to be it is believed that reporting verbs объяснение на русском',
  b: [
    { k: 'lead', t: 'Когда источник неважен или неизвестен: It is said that… или He is said to…' },
    { k: 'table', head: ['Конструкция', 'Пример'], rows: [['It is said / believed / reported that…', 'It is believed that he lives abroad.'], ['S + is said to + V', 'He is said to be very rich.'], ['S + is said to have + V3 (о прошлом)', 'She is believed to have left the country.'], ['S + is thought to be + V-ing (сейчас)', 'They are thought to be negotiating.']] },
    { k: 'table', head: ['Глагол', 'Модель', 'Пример'], rows: [['deny / admit', '+ V-ing', 'He denied stealing the money.'], ['urge / warn / persuade', '+ sb + to V', 'She urged me to apply.'], ['accuse sb', '+ of + V-ing', 'They accused him of lying.'], ['apologise', '+ for + V-ing', 'I apologised for being late.']] },
  ],
  g: ['He is said {to be|being} the best surgeon in the city.', 'She is believed {to have left|to leave} yesterday.', 'He denied {taking|to take} the keys.', 'They accused her {of cheating|for cheating}.'],
  f: ['It (report:is reported) that the company will close. | Сообщается, что компания закроется.', 'The suspect is thought (escape:to have escaped) last night. | Считается, что подозреваемый сбежал прошлой ночью.', 'My friend persuaded me (join:to join) the club. | Друг уговорил меня вступить в клуб.'] },

{ id: 'c1-future-past', t: 'Будущее в прошедшем: was going to, would', lvl: 'C1', v: 'future in the past was going to would was about to объяснение на русском',
  b: [
    { k: 'lead', t: 'Рассказывая о прошлом, говорим о «будущем» с той точки зрения: was going to, would, was about to.' },
    { k: 'table', head: ['Форма', 'Смысл', 'Пример'], rows: [['was / were going to', 'собирался (часто не вышло)', 'I was going to call you, but I forgot.'], ['would', 'знал, что так будет', 'I knew she would win.'], ['was about to', 'вот-вот собирался', 'We were about to leave when it started raining.'], ['was to have + V3', 'планировалось, но не случилось', 'The meeting was to have taken place on Monday.']] },
    { k: 'ex', items: ['I was going to tell you, honestly! = Я собирался тебе сказать, честно!', 'Little did they know they would become famous. = Они и не подозревали, что станут знаменитыми.'] },
  ],
  g: ['I {was going to|am going to} text you, but my phone died.', 'She promised she {would|will} help.', 'We were {about to|going} leave when he arrived.'],
  f: ['I knew the exam (be:would be) hard. | Я знал, что экзамен будет трудным.', 'They (go:were going to) move to Canada, but changed their minds. | Они собирались переехать в Канаду, но передумали.', 'He was (leave:about to leave) when the phone rang. | Он уже собирался уходить, когда зазвонил телефон.'] },

{ id: 'c1-ellipsis', t: 'Без повторов: so, not, one, do', lvl: 'C1', v: 'ellipsis substitution I think so I hope not one ones объяснение на русском',
  b: [
    { k: 'lead', t: 'Носители не повторяют слова: заменяют их на so, not, do, one или просто опускают.' },
    { k: 'table', head: ['Замена', 'Пример'], rows: [['so / not', 'I think so. I hope not.'], ['so / neither + aux + S', 'She speaks French, and so do I.'], ['one / ones', 'I lost my pen, so I bought a new one.'], ['to (без глагола)', "I didn't want to go, but I had to."]] },
    { k: 'ex', items: ['Is it going to rain? — I hope not. = Будет дождь? — Надеюсь, нет.', 'I wanted to call, but I forgot to. = Я хотел позвонить, но забыл.', 'These shoes are nice, but I prefer the black ones. = Эти туфли хорошие, но мне больше нравятся чёрные.'] },
    { k: 'tip', t: 'Не «I think yes», а I think so. Не «I hope no», а I hope not.' },
  ],
  g: ['Will you pass? — I think {so|yes}.', "I don't like horror films. — {Neither do I|So do I}.", 'This laptop is slow. I need a faster {one|it}.', 'Is he coming? — I hope {not|no}.'],
  f: ['She has visited Chicago, and so (have:have) I. | Она была в Чикаго, и я тоже.', "I didn't want to go, but I had (to:to). | Я не хотел идти, но пришлось.", "He can't drive. — Neither (can:can) I. | Он не умеет водить. — Я тоже."] },

{ id: 'c1-unreal-past', t: "Нереальное прошедшее: It's time, I'd rather, as if", lvl: 'C1', v: "it's time we left I'd rather you as if объяснение на русском",
  b: [
    { k: 'lead', t: 'Прошедшая форма иногда говорит о настоящем — когда что-то нереально или очень желательно.' },
    { k: 'table', head: ['Конструкция', 'Пример', 'Смысл'], rows: [["It's (high) time + S + V2", "It's time we left.", 'давно пора'], ['would rather + S + V2', "I'd rather you didn't smoke.", 'я бы предпочёл, чтобы…'], ['would rather + V (о себе)', "I'd rather stay home.", 'я бы лучше…'], ['as if / as though + V2', 'He talks as if he knew everything.', 'как будто (на самом деле нет)'], ['if only + V2 / had V3', 'If only I had more time!', 'если бы только…']] },
  ],
  g: ["It's high time you {got|get} a job.", "I'd rather you {didn't|don't} tell anyone.", 'She acts as if she {owned|owns} the place.', 'If only I {had studied|studied} harder last year!'],
  f: ["It's time we (go:went) home. | Пора нам идти домой.", "I'd rather (stay:stay) in tonight. | Я бы лучше остался дома сегодня.", 'He looks as if he (see:had seen) a ghost. | Он выглядит так, будто увидел привидение.'] },

{ id: 'c1-discourse', t: 'Связки и смягчение: however, albeit, tend to', lvl: 'C1', v: 'linking words however albeit hedging tend to объяснение на русском',
  b: [
    { k: 'lead', t: 'На C1 важно связывать мысли и говорить мягко — без лишней категоричности.' },
    { k: 'table', head: ['Задача', 'Связки'], rows: [['противопоставить', 'however, nevertheless, whereas, albeit, on the other hand'], ['добавить', 'moreover, furthermore, in addition, not to mention'], ['причина и следствие', 'consequently, therefore, as a result, owing to'], ['уступка', 'although, even though, despite / in spite of + V-ing или сущ.']] },
    { k: 'table', head: ['Смягчить', 'Пример'], rows: [['tend to', 'Teenagers tend to sleep late.'], ['it seems / appears that', 'It appears that the plan has failed.'], ['might / could', 'This could be a problem.'], ['to some extent', 'I agree to some extent.']] },
    { k: 'tip', t: 'despite + существительное или -ing: despite the rain, despite being tired. Не «despite of».' },
  ],
  g: ['{Despite|Although} the rain, we went out.', 'He was tired; {nevertheless|despite}, he kept working.', 'The plan worked, {albeit|despite} slowly.', 'Prices rose; {consequently|whereas}, sales fell.'],
  f: ['(despite:Despite) feeling ill, she went to work. | Несмотря на плохое самочувствие, она пошла на работу.', 'Students (tend:tend to) underestimate deadlines. | Студенты склонны недооценивать сроки.', 'It (appear:appears) that we have a problem. | Похоже, у нас проблема.'] },

);
