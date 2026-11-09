/* Английский путь — справочник грамматики A1 → B2.
   Каждая тема — набор наглядных блоков + своя база упражнений.

   Блоки:
   {k:'lead', t}                         — главная мысль одной фразой
   {k:'formula', rows:[[знак, части…]]}   — формула: '*часть' = вспомогательный глагол (чёрная плашка), '~часть' = смысловой глагол (обводка)
   {k:'timeline', m:[…], cap}            — линия времени. m: {p:x} точка, {r:[a,b]} отрезок, {rep:[a,b]} повторы, {arc:[a,b]} дуга-связь, {l:'подпись', at:x}. Сейчас = 0, прошлое < 0, будущее > 0
   {k:'move', a, b, w}                   — слово w переезжает: из фразы a во фразу b (рисуется стрелка)
   {k:'shift', t, pairs:[[a,b]…]}        — превращения: a → b
   {k:'table', head:[…], rows:[[…]…]}
   {k:'compare', a:[заголовок, …пункты], b:[заголовок, …пункты]}
   {k:'ex', items:['en = ru', …]}         — примеры с озвучкой
   {k:'markers', t:'слова-подсказки через запятую'}
   {k:'tip', t}
   Упражнения: g — выбор "I {am|is} …", f — ввод "She (go:goes) … | перевод" (варианты ответа через |)
   v — запрос для поиска видеоурока на YouTube
*/
window.GRAMMAR = [
/* ======================= A1 ======================= */
{ id: 'be', t: 'Глагол to be: am, is, are', lvl: 'A1', v: 'глагол to be объяснение для начинающих',
  b: [
    { k: 'lead', t: 'В английском в каждом предложении есть глагол. Если действия нет — ставим «быть»: am, is, are.' },
    { k: 'table', head: ['Кто', 'Форма', 'Коротко'], rows: [['I', 'am', "I'm"], ['he / she / it', 'is', "he's, she's, it's"], ['we / you / they', 'are', "we're, you're, they're"]] },
    { k: 'formula', rows: [['+', 'S', '*am / is / are', '…'], ['−', 'S', '*am / is / are + not', '…'], ['?', '*Am / Is / Are', 'S', '…?']] },
    { k: 'move', a: 'She is at home.', b: 'Is she at home?', w: 'is' },
    { k: 'ex', items: ['I am twelve. = Мне двенадцать.', "He isn't here. = Его здесь нет.", 'Are they friends? = Они друзья?'] },
    { k: 'tip', t: 'Не «I twelve», а I am twelve. Возраст, профессия, место, настроение — всегда через to be.' },
  ],
  g: ['They {are|is|am} at school.', 'I {am|is|are} not tired.', '{Is|Are|Am} your sister a doctor?', "We {aren't|isn't|am not} late.", 'My cat {is|are} black.'],
  f: ['I (be:am) eleven. | Мне одиннадцать.', 'She (be:is) my best friend. | Она моя лучшая подруга.', 'You (not be:are not|aren\'t) late. | Ты не опоздал.', '(be:Are) they from Spain? | Они из Испании?', 'It (not be:is not|isn\'t) cold today. | Сегодня не холодно.', 'We (be:are) in the same class. | Мы в одном классе.'] },

{ id: 'have-got', t: 'have got / has got', lvl: 'A1', v: 'have got has got объяснение',
  b: [
    { k: 'lead', t: '«У меня есть» по-английски — «я имею»: I have got.' },
    { k: 'formula', rows: [['+', 'I / you / we / they', '*have got', '…'], ['+', 'he / she / it', '*has got', '…'], ['−', 'S', "*haven't / hasn't got", '…'], ['?', '*Have / Has', 'S', 'got …?']] },
    { k: 'move', a: 'You have got a dog.', b: 'Have you got a dog?', w: 'have' },
    { k: 'ex', items: ["I've got a brother. = У меня есть брат.", "She hasn't got a bike. = У неё нет велосипеда.", 'Have you got a pen? — Yes, I have. = У тебя есть ручка? — Да.'] },
    { k: 'tip', t: 'В американском варианте чаще просто have: Do you have a pen? Оба варианта правильные.' },
  ],
  g: ['She {has|have} got green eyes.', '{Have|Has} they got a car?', "He {hasn't|haven't} got a phone.", 'We {have|has} got a new teacher.', 'Has it got a long tail? — Yes, it {has|have|is}.'],
  f: ['My brother (have got:has got) a laptop. | У моего брата есть ноутбук.', 'I (not have got:haven\'t got|have not got) any pets. | У меня нет питомцев.', '(have:Have) you got a ruler? | У тебя есть линейка?', 'They (have got:have got) two cats. | У них две кошки.', 'The house (have got:has got) a big garden. | У дома большой сад.'] },

{ id: 'articles', t: 'Артикли a / an / the', lvl: 'A1', v: 'артикли a an the объяснение',
  b: [
    { k: 'lead', t: 'a / an — «какой-то, один из». the — «тот самый, понятно какой».' },
    { k: 'compare', a: ['a / an', 'впервые упоминаем', 'один из многих', 'профессия: She is a nurse.', 'an — перед гласным звуком: an apple, an hour'], b: ['the', 'уже говорили об этом', 'единственный: the sun, the Moon', 'понятно из ситуации: Close the door.', 'с превосходной степенью: the best'] },
    { k: 'ex', items: ['I saw a cat. The cat was black. = Я видел кошку. Та кошка была чёрной.', 'She is an engineer. = Она инженер.', 'The sun is hot. = Солнце горячее.'] },
    { k: 'tip', t: 'Без артикля: имена, города, страны (Moscow, Russia), еда и вещества в общем смысле (I like milk), множественное в общем (Dogs are clever).' },
  ],
  g: ['I have got {an|a|the} umbrella.', '{The|A} Moon goes round the Earth.', 'She is {a|an|the} teacher.', 'I like {—|the|a} music.', 'I bought a book. {The|A} book is great.'],
  f: [] },

{ id: 'plurals', t: 'Множественное число', lvl: 'A1', v: 'множественное число существительных английский',
  b: [
    { k: 'lead', t: 'Обычно + s. Но есть правила для окончаний и короткий список исключений.' },
    { k: 'shift', t: 'Правила', pairs: [['book', 'books'], ['box, watch, bus', 'boxes, watches, buses'], ['baby', 'babies'], ['leaf, knife', 'leaves, knives'], ['potato, tomato', 'potatoes, tomatoes']] },
    { k: 'shift', t: 'Исключения — выучить', pairs: [['man / woman', 'men / women'], ['child', 'children'], ['foot / tooth', 'feet / teeth'], ['mouse', 'mice'], ['sheep / fish', 'sheep / fish']] },
  ],
  g: ['three {boxes|boxs}', 'two {children|childs}', 'five {knives|knifes}', 'many {babies|babys}', 'a lot of {sheep|sheeps}'],
  f: ['two (tooth:teeth) | два зуба', 'three (story:stories) | три истории', 'four (woman:women) | четыре женщины', 'two (dish:dishes) | две тарелки', 'six (leaf:leaves) | шесть листьев'] },

{ id: 'demonstratives', t: 'this / that / these / those', lvl: 'A1', v: 'this that these those',
  b: [
    { k: 'table', head: ['', 'Один', 'Много'], rows: [['Рядом', 'this', 'these'], ['Далеко', 'that', 'those']] },
    { k: 'ex', items: ['This is my book. = Это моя книга.', 'These are my books. = Это мои книги.', 'Look at those birds! = Посмотри на тех птиц!'] },
    { k: 'tip', t: 'После these / those — всегда are и множественное: These are…, Those are…' },
  ],
  g: ['{These|This} are my friends.', '{That|Those} is my house over there.', '{Those|That} shoes are expensive.', 'Is {this|these} your pen?'],
  f: [] },

{ id: 'possessive', t: "Чьё? my, his… и 's", lvl: 'A1', v: 'притяжательные местоимения и притяжательный падеж',
  b: [
    { k: 'shift', t: 'Кто → чей', pairs: [['I', 'my'], ['you', 'your'], ['he', 'his'], ['she', 'her'], ['it', 'its'], ['we', 'our'], ['they', 'their']] },
    { k: 'compare', a: ["'s", 'один владелец', "Tom's bike — велосипед Тома", "the children's room (children без -s)"], b: ["s'", 'много владельцев на -s', "my parents' car — машина родителей", "the girls' bags"] },
    { k: 'tip', t: "its — «его» о предмете. it's = it is. Не путай!" },
  ],
  g: ["This is {Ann's|Anns|Ann} bag.", 'They love {their|there|they} dog.', 'My {parents\'|parent\'s} room is big.', "The dog is eating {its|it's} dinner.", 'Is that {your|you} phone?'],
  f: ['This is (Mark:Mark\'s) room. | Это комната Марка.', 'We like (we:our) school. | Нам нравится наша школа.', 'She lost (she:her) keys. | Она потеряла свои ключи.', 'The (boys:boys\') bikes are new. | Велосипеды мальчиков новые.'] },

{ id: 'there-is', t: 'There is / There are', lvl: 'A1', v: 'there is there are объяснение',
  b: [
    { k: 'lead', t: 'Сообщаем, что где-то что-то есть. Переводим с конца предложения.' },
    { k: 'formula', rows: [['+', 'There', '*is', 'a / one …'], ['+', 'There', '*are', 'some / many …'], ['−', 'There', "*isn't / aren't", 'any …'], ['?', '*Is / Are', 'there', 'any …?']] },
    { k: 'move', a: 'There is a park near here.', b: 'Is there a park near here?', w: 'is' },
    { k: 'ex', items: ['There is a lamp on the desk. = На столе есть лампа.', "There aren't any shops here. = Здесь нет магазинов.", 'Are there any questions? = Есть вопросы?'] },
  ],
  g: ['There {is|are} a sofa in the room.', 'There {are|is} twenty pupils in our class.', '{Is|Are} there any milk?', "There {aren't|isn't} any chairs.", 'There {was|were} a storm last night.'],
  f: ['There (be:is) a cinema in our street. | На нашей улице есть кинотеатр.', 'There (be:are) three bedrooms in the flat. | В квартире три спальни.', '(be:Is) there a bank near here? | Здесь рядом есть банк?', 'There (not be:aren\'t|are not) any eggs in the fridge. | В холодильнике нет яиц.'] },

{ id: 'can', t: 'can / can\'t', lvl: 'A1', v: 'модальный глагол can объяснение',
  b: [
    { k: 'lead', t: 'can = умею, могу, можно. Одна форма для всех, без -s и без to.' },
    { k: 'formula', rows: [['+', 'S', '*can', '~V'], ['−', 'S', "*can't (cannot)", '~V'], ['?', '*Can', 'S', '~V …?']] },
    { k: 'move', a: 'You can swim.', b: 'Can you swim?', w: 'can' },
    { k: 'ex', items: ['She can speak French. = Она говорит по-французски.', "I can't find my keys. = Не могу найти ключи.", 'Can I open the window? = Можно открыть окно?'] },
    { k: 'tip', t: 'Ошибка: He cans, can to swim. Правильно: He can swim.' },
  ],
  g: ['He can {play|plays|to play} chess.', '{Can|Do} you ride a horse?', "Penguins {can't|don't can} fly.", 'Can I {borrow|borrowing} your pen?'],
  f: ['My dad (can/cook:can cook) very well. | Мой папа отлично готовит.', 'I (can\'t/swim:can\'t swim|cannot swim) yet. | Я пока не умею плавать.', '(can/you/help:Can you help) me? | Ты можешь мне помочь?'] },

{ id: 'imperative', t: 'Повелительное наклонение', lvl: 'A1', v: 'повелительное наклонение английский',
  b: [
    { k: 'formula', rows: [['+', '~V', '…!'], ['−', "*Don't", '~V', '…!'], ['мы', "*Let's", '~V', '…!']] },
    { k: 'ex', items: ['Open the window, please. = Откройте окно, пожалуйста.', "Don't run! = Не бегай!", "Let's go to the park! = Пойдём в парк!"] },
  ],
  g: ["{Don't|Not} touch it!", '{Be|Are} quiet, please.', "Let's {play|to play|playing} football.", "{Don't|Doesn't} be late!"],
  f: [] },

{ id: 'present-simple', t: 'Present Simple', lvl: 'A1', v: 'Present Simple объяснение просто',
  b: [
    { k: 'lead', t: 'То, что происходит обычно, регулярно, всегда. Факты и привычки.' },
    { k: 'timeline', m: [{ rep: [-0.9, 0.9] }, { l: 'каждый день', at: 0 }], cap: 'Действие повторяется — в прошлом, сейчас и дальше.' },
    { k: 'formula', rows: [['+', 'I / you / we / they', '~V'], ['+', 'he / she / it', '~V + s'], ['−', 'S', "*don't / doesn't", '~V'], ['?', '*Do / Does', 'S', '~V …?']] },
    { k: 'move', a: 'She plays tennis.', b: 'Does she play tennis?', w: 'does' },
    { k: 'shift', t: 'Окончание с he / she / it', pairs: [['work', 'works'], ['watch, go, do', 'watches, goes, does'], ['study', 'studies'], ['have', 'has']] },
    { k: 'markers', t: 'always, usually, often, sometimes, never, every day, on Mondays, at the weekend' },
    { k: 'tip', t: 'После does / doesn\'t глагол без -s: Does she play? She doesn\'t play.' },
  ],
  g: ['My mum {works|work} in a bank.', '{Does|Do} he like pizza?', "They {don't|doesn't} live here.", 'She {watches|watchs} TV every evening.', 'Does your brother {play|plays} the guitar?', 'Water {boils|is boiling} at 100 degrees.'],
  f: ['He (get up:gets up) at seven. | Он встаёт в семь.', 'We (not/go:don\'t go|do not go) to school on Sundays. | Мы не ходим в школу по воскресеньям.', '(do:Does) your sister speak English? | Твоя сестра говорит по-английски?', 'The shop (open:opens) at 9 a.m. | Магазин открывается в 9 утра.', 'My cat (not/like:doesn\'t like|does not like) water. | Мой кот не любит воду.', 'She (study:studies) Maths every day. | Она занимается математикой каждый день.', 'What time (do:do) you usually have lunch? | Во сколько ты обычно обедаешь?'] },

{ id: 'frequency', t: 'Наречия частоты', lvl: 'A1', v: 'adverbs of frequency always usually often',
  b: [
    { k: 'table', head: ['Как часто', 'Слово'], rows: [['100%', 'always'], ['~80%', 'usually'], ['~60%', 'often'], ['~40%', 'sometimes'], ['~10%', 'rarely / seldom'], ['0%', 'never']] },
    { k: 'compare', a: ['Перед глаголом', 'I always get up early.', 'She never eats meat.'], b: ['После am / is / are', 'He is always late.', 'They are often tired.'] },
  ],
  g: ['I {often go|go often} to the cinema.', 'She {is never|never is} late.', 'We {usually have|have usually} lunch at one.', 'He {sometimes plays|plays sometimes} chess.'],
  f: [] },

{ id: 'present-continuous', t: 'Present Continuous', lvl: 'A1', v: 'Present Continuous объяснение',
  b: [
    { k: 'lead', t: 'То, что происходит прямо сейчас, в этот момент — или в этот период.' },
    { k: 'timeline', m: [{ r: [-0.18, 0.18] }, { l: 'сейчас', at: 0 }], cap: 'Действие в процессе: началось и ещё не закончилось.' },
    { k: 'formula', rows: [['+', 'S', '*am / is / are', '~V-ing'], ['−', 'S', '*am / is / are + not', '~V-ing'], ['?', '*Am / Is / Are', 'S', '~V-ing …?']] },
    { k: 'move', a: 'They are playing football.', b: 'Are they playing football?', w: 'are' },
    { k: 'shift', t: 'Как добавить -ing', pairs: [['read', 'reading'], ['write (e уходит)', 'writing'], ['swim, run, sit (удвоение)', 'swimming, running, sitting'], ['lie, die', 'lying, dying']] },
    { k: 'markers', t: 'now, right now, at the moment, Look!, Listen!, today, these days' },
  ],
  g: ['Look! It {is snowing|snows}.', 'I {am reading|read} a book now.', '{Are|Do} you listening to me?', 'She {is writing|is writeing} a letter.', "They {aren't|don't} sleeping."],
  f: ['Be quiet! The baby (sleep:is sleeping). | Тише! Ребёнок спит.', 'What (you/do:are you doing) now? | Что ты сейчас делаешь?', 'We (not/watch:aren\'t watching|are not watching) TV at the moment. | Мы сейчас не смотрим телевизор.', 'Listen! Somebody (sing:is singing). | Послушай! Кто-то поёт.', 'I (sit:am sitting) on the bus right now. | Я сейчас сижу в автобусе.'] },

{ id: 'ps-pc', t: 'Present Simple или Continuous?', lvl: 'A1', v: 'Present Simple vs Present Continuous разница',
  b: [
    { k: 'compare', a: ['Present Simple — обычно', 'привычки, расписания, факты', 'I usually walk to school.', 'every day, usually, often'], b: ['Present Continuous — сейчас', 'процесс в момент речи', "Today I'm going by bus.", 'now, at the moment, Look!'] },
    { k: 'timeline', m: [{ rep: [-0.9, 0.9] }, { r: [-0.15, 0.15] }], cap: 'Точки — то, что бывает обычно. Отрезок — то, что идёт сейчас.' },
    { k: 'tip', t: 'Глаголы чувств и мыслей обычно не ставим в -ing: I like, I know, I want, I understand (не I am knowing).' },
  ],
  g: ['She usually {walks|is walking} to school.', 'Look! The bus {is coming|comes}.', 'I {know|am knowing} the answer.', 'Every summer we {go|are going} to the sea.', 'Shh! I {am talking|talk} on the phone.'],
  f: ['He usually (drink:drinks) tea, but today he (drink:is drinking) coffee. | Обычно он пьёт чай, но сегодня — кофе.', 'Water (boil:boils) at 100 degrees. | Вода кипит при 100 градусах.', 'Where is Kate? — She (have:is having) a shower. | Где Кейт? — Она в душе.', 'I (not/understand:don\'t understand|do not understand) this word. | Я не понимаю это слово.'] },

{ id: 'countable', t: 'some / any, much / many', lvl: 'A1', v: 'some any much many countable uncountable',
  b: [
    { k: 'compare', a: ['Исчисляемые', 'apple → apples', 'many apples', 'How many?', 'a few apples'], b: ['Неисчисляемые', 'milk, water, bread, money, advice', 'much milk', 'How much?', 'a little milk'] },
    { k: 'table', head: ['', 'Утверждение', 'Вопрос / отрицание'], rows: [['some / any', 'There is some milk.', 'Is there any milk? There isn\'t any.'], ['a lot of', 'a lot of apples / milk', 'не только в утверждении'], ['просьба', 'Can I have some tea?', '(тут some, хоть и вопрос)']] },
  ],
  g: ['How {much|many} sugar do you need?', 'How {many|much} people are there?', 'There isn\'t {any|some} juice.', 'Would you like {some|any} cake?', 'I have {a few|a little} friends here.', 'We have {a little|a few} time.'],
  f: [] },

{ id: 'prepositions', t: 'Предлоги места и времени', lvl: 'A1', v: 'предлоги in on at время место',
  b: [
    { k: 'table', head: ['', 'at', 'on', 'in'], rows: [['Время', "at 5 o'clock, at night, at the weekend", 'on Monday, on 5th May, on my birthday', 'in May, in 2010, in summer, in the morning'], ['Место', 'at school, at home, at the bus stop', 'on the table, on the wall, on the first floor', 'in the room, in London, in the box']] },
    { k: 'tip', t: 'Точное время и точка — at. День и поверхность — on. Период и пространство внутри — in.' },
    { k: 'ex', items: ['I get up at seven. = Я встаю в семь.', 'See you on Friday! = Увидимся в пятницу!', 'He was born in 2012. = Он родился в 2012 году.'] },
  ],
  g: ["The lesson starts {at|in|on} 9 o'clock.", 'My birthday is {in|on|at} June.', 'We meet {on|in|at} Saturdays.', 'She is {at|in|on} home.', 'The picture is {on|in|at} the wall.', 'I read {in|at|on} the evening.'],
  f: [] },

{ id: 'past-be', t: 'was / were', lvl: 'A1', v: 'was were прошедшее время to be',
  b: [
    { k: 'shift', t: 'Прошлое от to be', pairs: [['am, is', 'was'], ['are', 'were']] },
    { k: 'formula', rows: [['+', 'I / he / she / it', '*was'], ['+', 'we / you / they', '*were'], ['−', 'S', "*wasn't / weren't"], ['?', '*Was / Were', 'S', '…?']] },
    { k: 'move', a: 'You were at home.', b: 'Were you at home?', w: 'were' },
  ],
  g: ['I {was|were} ill yesterday.', 'They {were|was} at the cinema.', '{Was|Were} it cold last night?', "We {weren't|wasn't} tired."],
  f: ['The film (be:was) boring. | Фильм был скучным.', 'Where (be:were) you last night? | Где ты был вчера вечером?', 'My parents (not be:weren\'t|were not) at home. | Родителей не было дома.'] },

{ id: 'past-simple', t: 'Past Simple', lvl: 'A1', v: 'Past Simple объяснение правильные неправильные глаголы',
  b: [
    { k: 'lead', t: 'Действие произошло и закончилось в прошлом. Важно, когда: yesterday, last year, in 2015.' },
    { k: 'timeline', m: [{ p: -0.6 }, { l: 'вчера', at: -0.6 }], cap: 'Одна законченная точка в прошлом.' },
    { k: 'formula', rows: [['+', 'S', '~V-ed / 2-я форма'], ['−', 'S', "*didn't", '~V'], ['?', '*Did', 'S', '~V …?']] },
    { k: 'move', a: 'You played football.', b: 'Did you play football?', w: 'did' },
    { k: 'shift', t: 'Правильные и неправильные', pairs: [['play, watch', 'played, watched'], ['stop, plan', 'stopped, planned'], ['study, try', 'studied, tried'], ['go, see, buy', 'went, saw, bought'], ['have, make, take', 'had, made, took']] },
    { k: 'markers', t: 'yesterday, last week, last year, ago, in 2010, when I was a child' },
    { k: 'tip', t: 'После did / didn\'t — начальная форма: Did you go? (не went). I didn\'t see (не saw).' },
  ],
  g: ['We {visited|visit} Paris last summer.', 'Did you {see|saw} the film?', 'She {didn\'t|doesn\'t} call me yesterday.', 'I {bought|buyed} new shoes.', '{Did|Was} they win the match?', 'He {stopped|stoped} the car.'],
  f: ['Yesterday I (go:went) to the museum. | Вчера я ходил в музей.', 'She (not/like:didn\'t like|did not like) the film. | Ей не понравился фильм.', '(you/see:Did you see) Tom yesterday? | Ты видел Тома вчера?', 'We (have:had) a great time. | Мы отлично провели время.', 'They (move:moved) to Moscow in 2019. | Они переехали в Москву в 2019.', 'I (write:wrote) a letter to my grandma. | Я написал письмо бабушке.', 'He (try:tried) to open the door. | Он попытался открыть дверь.'] },

{ id: 'going-to', t: 'be going to', lvl: 'A1', v: 'be going to будущее время',
  b: [
    { k: 'lead', t: 'Планы и намерения: уже решил, что сделаешь. А ещё — то, что вот-вот случится (видно по признакам).' },
    { k: 'timeline', m: [{ arc: [0, 0.6] }, { p: 0.6 }, { l: 'план', at: 0.6 }], cap: 'Решение уже есть сейчас, действие — в будущем.' },
    { k: 'formula', rows: [['+', 'S', '*am / is / are', 'going to', '~V'], ['−', 'S', "*am not / isn't / aren't", 'going to', '~V'], ['?', '*Am / Is / Are', 'S', 'going to', '~V …?']] },
    { k: 'ex', items: ["I'm going to learn Spanish. = Я собираюсь учить испанский.", "Look at the clouds! It's going to rain. = Посмотри на тучи! Сейчас пойдёт дождь."] },
  ],
  g: ['She {is|are} going to buy a dress.', 'We are going {to visit|visit} Grandma.', '{Are|Do} you going to play?', 'Look out! You {are going to|will} fall!'],
  f: ['I (be going to/watch:am going to watch) a film tonight. | Сегодня вечером я буду смотреть фильм.', 'They (not/be going to/travel:aren\'t going to travel|are not going to travel) this summer. | Этим летом они не поедут путешествовать.', 'What (you/be going to/do:are you going to do) at the weekend? | Что ты собираешься делать на выходных?'] },

{ id: 'will', t: 'Future Simple: will', lvl: 'A1', v: 'will Future Simple объяснение',
  b: [
    { k: 'lead', t: 'will — решение прямо сейчас, обещание, предсказание «я думаю».' },
    { k: 'timeline', m: [{ p: 0.55 }, { l: 'завтра', at: 0.55 }], cap: 'Точка в будущем.' },
    { k: 'formula', rows: [['+', 'S', '*will (\'ll)', '~V'], ['−', 'S', "*won't", '~V'], ['?', '*Will', 'S', '~V …?']] },
    { k: 'compare', a: ['will', 'решил только что: I\'ll help you!', 'мнение: I think it will rain.', 'обещание: I\'ll call you.'], b: ['going to', 'план заранее: I\'m going to visit Rome.', 'видно по признакам: Look, it\'s going to rain!'] },
    { k: 'markers', t: 'tomorrow, next week, in 2030, I think, probably, maybe' },
  ],
  g: ["The phone is ringing. — I {'ll|am going to} answer it.", 'I think it {will be|is} sunny tomorrow.', 'She {won\'t|willn\'t} come.', '{Will|Do} you help me?'],
  f: ['I promise I (call:will call|\'ll call) you tomorrow. | Обещаю, позвоню тебе завтра.', 'I think people (live:will live) on Mars one day. | Думаю, однажды люди будут жить на Марсе.', 'Don\'t worry, it (not/hurt:won\'t hurt|will not hurt). | Не бойся, больно не будет.'] },

{ id: 'must-have-to', t: 'must, have to, mustn\'t', lvl: 'A1', v: 'must have to разница',
  b: [
    { k: 'compare', a: ['must', 'я сам считаю нужным', 'I must study harder.', "mustn't — нельзя: You mustn't smoke here."], b: ['have to', 'так требуют обстоятельства', 'I have to wear a uniform.', "don't have to — не обязательно: You don't have to come."] },
    { k: 'tip', t: "Главная ловушка: mustn't = нельзя, а don't have to = можно не делать." },
    { k: 'formula', rows: [['+', 'S', '*must', '~V'], ['+', 'S', '*have to / has to', '~V'], ['?', '*Do / Does', 'S', 'have to', '~V …?']] },
  ],
  g: ["You {mustn't|don't have to} run in the corridor. It's dangerous.", "It's Sunday, so I {don't have to|mustn't} get up early.", 'She {has to|have to} wear glasses.', 'Do you {have to|must} walk the dog?'],
  f: ['We (have to/wear:have to wear) a uniform at school. | В школе мы должны носить форму.', 'You (must not/use:mustn\'t use|must not use) phones in the exam. | На экзамене нельзя пользоваться телефонами.', 'He (not have to/cook:doesn\'t have to cook|does not have to cook) today. | Ему сегодня не нужно готовить.'] },

{ id: 'comparison', t: 'Степени сравнения', lvl: 'A1', v: 'степени сравнения прилагательных',
  b: [
    { k: 'shift', t: 'Короткие слова', pairs: [['tall', 'taller → the tallest'], ['big (удвоение)', 'bigger → the biggest'], ['happy (y → i)', 'happier → the happiest']] },
    { k: 'shift', t: 'Длинные слова', pairs: [['interesting', 'more interesting → the most interesting'], ['beautiful', 'more beautiful → the most beautiful']] },
    { k: 'shift', t: 'Исключения', pairs: [['good', 'better → the best'], ['bad', 'worse → the worst'], ['far', 'further → the furthest'], ['little / much', 'less / more']] },
    { k: 'ex', items: ['My brother is taller than me. = Мой брат выше меня.', 'It is the best day of my life! = Это лучший день в моей жизни!', 'This book is as interesting as that one. = Эта книга такая же интересная, как та.'] },
  ],
  g: ['My bag is {heavier|more heavy} than yours.', 'This is {the most|the more} beautiful city.', 'He is {better|gooder} at Maths than me.', 'Today is {hotter|hoter} than yesterday.', 'It was {the worst|the baddest} film ever.'],
  f: ['A cheetah is (fast:faster) than a lion. | Гепард быстрее льва.', 'Moscow is (big:the biggest) city in Russia. | Москва — самый большой город России.', 'English is (easy:easier) than Chinese. | Английский легче китайского.', 'This is (expensive:the most expensive) phone in the shop. | Это самый дорогой телефон в магазине.', 'My marks are (bad:worse) than last year. | Мои оценки хуже, чем в прошлом году.'] },

{ id: 'questions', t: 'Вопросы и вопросительные слова', lvl: 'A1', v: 'вопросительные предложения в английском порядок слов',
  b: [
    { k: 'formula', rows: [['?', 'Wh-слово', '*вспом. глагол', 'S', '~V', '…?']] },
    { k: 'move', a: 'You live in Moscow.', b: 'Where do you live?', w: 'do' },
    { k: 'table', head: ['Слово', 'Значение'], rows: [['What', 'что, какой'], ['Where', 'где, куда'], ['When', 'когда'], ['Why', 'почему'], ['Who', 'кто'], ['How', 'как'], ['How many / much', 'сколько'], ['Which', 'который (из)']] },
    { k: 'tip', t: 'Если спрашиваем о подлежащем (кто сделал?) — вспомогательный не нужен: Who broke the window? (не Who did break).' },
  ],
  g: ['Where {do|does} you live?', 'What {is|does} your name?', '{Why|Who} are you late?', 'Who {called|did call} you?', 'How {many|much} brothers have you got?'],
  f: ['Where (you/go:did you go) last summer? | Куда ты ездил прошлым летом?', 'What time (the film/start:does the film start)? | Во сколько начинается фильм?', 'Why (she/cry:is she crying)? | Почему она плачет?'] },

/* ======================= A2 ======================= */
{ id: 'past-continuous', t: 'Past Continuous', lvl: 'A2', v: 'Past Continuous объяснение',
  b: [
    { k: 'lead', t: 'Действие было в процессе в какой-то момент прошлого. Часто — фон, когда что-то произошло.' },
    { k: 'timeline', m: [{ r: [-0.85, -0.25] }, { p: -0.5 }, { l: 'when he called', at: -0.5 }], cap: 'Длинное действие (отрезок) прервано коротким (точка).' },
    { k: 'formula', rows: [['+', 'S', '*was / were', '~V-ing'], ['−', 'S', "*wasn't / weren't", '~V-ing'], ['?', '*Was / Were', 'S', '~V-ing …?']] },
    { k: 'compare', a: ['Past Continuous — фон', 'I was reading', 'while — пока'], b: ['Past Simple — событие', 'when the phone rang.', 'when — когда'] },
    { k: 'ex', items: ['At 8 p.m. yesterday I was doing my homework. = Вчера в 8 вечера я делал уроки.', 'While we were walking, it started to rain. = Пока мы гуляли, начался дождь.'] },
  ],
  g: ['I {was sleeping|slept} when you called.', 'They {were playing|was playing} football at 5 p.m.', 'While she {was cooking|cooked}, he set the table.', 'What {were|did} you doing at ten last night?', 'He {fell|was falling} when he was running.'],
  f: ['At 7 o\'clock I (have:was having) dinner. | В 7 часов я ужинал.', 'We (walk:were walking) in the park when it started to rain. | Мы гуляли в парке, когда начался дождь.', 'What (you/do:were you doing) at midnight? | Что ты делал в полночь?', 'She (not/listen:wasn\'t listening|was not listening) to the teacher. | Она не слушала учителя.', 'The sun (shine:was shining) and the birds were singing. | Светило солнце, пели птицы.'] },

{ id: 'present-perfect', t: 'Present Perfect', lvl: 'A2', v: 'Present Perfect объяснение просто',
  b: [
    { k: 'lead', t: 'Прошлое, которое важно сейчас: есть результат или опыт. Когда именно — не важно.' },
    { k: 'timeline', m: [{ p: -0.5 }, { arc: [-0.5, 0] }, { l: 'результат сейчас', at: 0 }], cap: 'Дуга связывает действие в прошлом с настоящим.' },
    { k: 'formula', rows: [['+', 'I / you / we / they', '*have', '~V3'], ['+', 'he / she / it', '*has', '~V3'], ['−', 'S', "*haven't / hasn't", '~V3'], ['?', '*Have / Has', 'S', '~V3 …?']] },
    { k: 'move', a: 'You have finished.', b: 'Have you finished?', w: 'have' },
    { k: 'shift', t: 'Третья форма (V3)', pairs: [['play', 'played'], ['go', 'gone'], ['see', 'seen'], ['do', 'done'], ['write', 'written'], ['be', 'been']] },
    { k: 'markers', t: 'already, just, yet, ever, never, so far, recently, this week, for, since' },
    { k: 'ex', items: ["I've lost my keys. = Я потерял ключи (и сейчас их нет).", 'Have you ever been to London? = Ты когда-нибудь был в Лондоне?', "She hasn't finished yet. = Она ещё не закончила."] },
  ],
  g: ['I {have|has} already done my homework.', 'She {has|have} just left.', 'Have you ever {seen|saw} a whale?', "We haven't eaten {yet|already}.", 'He has {been|gone} to Paris twice.'],
  f: ['I (just/finish:have just finished|\'ve just finished) my project. | Я только что закончил проект.', 'She (never/be:has never been) to Italy. | Она никогда не была в Италии.', '(you/ever/try:Have you ever tried) sushi? | Ты когда-нибудь пробовал суши?', 'They (not/arrive:haven\'t arrived|have not arrived) yet. | Они ещё не приехали.', 'Oh no! I (break:have broken|\'ve broken) my phone. | О нет! Я разбил телефон.', 'We (know:have known|\'ve known) each other for five years. | Мы знакомы пять лет.'] },

{ id: 'pp-past', t: 'Present Perfect или Past Simple?', lvl: 'A2', v: 'Present Perfect vs Past Simple разница',
  b: [
    { k: 'compare', a: ['Present Perfect', 'когда — не важно, важен результат', "I've lost my phone.", 'ever, never, just, already, yet, this week'], b: ['Past Simple', 'есть конкретное время в прошлом', 'I lost my phone yesterday.', 'yesterday, last week, ago, in 2020, when'] },
    { k: 'timeline', m: [{ p: -0.55 }, { arc: [-0.55, 0] }, { p: -0.3 }], cap: 'Дуга — связь с «сейчас» (Present Perfect). Просто точка — закрытое прошлое (Past Simple).' },
    { k: 'tip', t: 'Как только в предложении появляется «когда» (yesterday, in 2019, ago) — только Past Simple.' },
  ],
  g: ['I {saw|have seen} him yesterday.', 'I {have never been|never was} to Spain.', 'She {has lived|lived} here since 2015.', 'When {did you buy|have you bought} it?', 'We {went|have gone} to the zoo last Sunday.'],
  f: ['I (lose:lost) my key yesterday, but I (find:have found|\'ve found) it now. | Вчера я потерял ключ, но сейчас нашёл.', '(you/finish:Have you finished) your essay yet? | Ты уже закончил сочинение?', 'Mozart (write:wrote) more than 600 pieces of music. | Моцарт написал больше 600 произведений.', 'I (see:have seen|\'ve seen) this film three times. | Я смотрел этот фильм три раза.'] },

{ id: 'used-to', t: 'used to', lvl: 'A2', v: 'used to объяснение',
  b: [
    { k: 'lead', t: 'Привычка или состояние в прошлом, которых теперь нет.' },
    { k: 'timeline', m: [{ rep: [-0.95, -0.35] }, { l: 'раньше', at: -0.65 }, { l: 'теперь — нет', at: 0.2 }], cap: 'Раньше повторялось, сейчас закончилось.' },
    { k: 'formula', rows: [['+', 'S', 'used to', '~V'], ['−', 'S', "*didn't", 'use to', '~V'], ['?', '*Did', 'S', 'use to', '~V …?']] },
    { k: 'ex', items: ['I used to play the piano. = Раньше я играл на пианино.', "There didn't use to be a park here. = Раньше здесь не было парка."] },
  ],
  g: ['I {used to|use to} have long hair.', 'Did you {use to|used to} live here?', "He {didn't use to|didn't used to} like fish."],
  f: ['My grandma (used to/work:used to work) as a teacher. | Бабушка раньше работала учителем.', 'We (not/use to/have:didn\'t use to have|did not use to have) a car. | Раньше у нас не было машины.'] },

{ id: 'future-forms', t: 'Будущее: will, going to, Continuous', lvl: 'A2', v: 'способы выражения будущего времени will going to present continuous',
  b: [
    { k: 'table', head: ['Форма', 'Когда', 'Пример'], rows: [['will', 'решение сейчас, прогноз, обещание', "I'll open the door."], ['be going to', 'план, намерение; видно по признакам', "I'm going to study law."], ['Present Continuous', 'договорённость, есть время и место', "I'm meeting Kate at 5."], ['Present Simple', 'расписание', 'The train leaves at 6.']] },
    { k: 'tip', t: 'После when, if, before, after, as soon as будущее выражаем через Present Simple: When I get home, I\'ll call you.' },
  ],
  g: ["I {'m seeing|will see} the dentist at 4 tomorrow. It's in my diary.", 'The train {leaves|is leaving} at 7.15 every day.', "When I {get|will get} home, I'll call you.", "I'm thirsty. — I {'ll|am going to} get you some water."],
  f: ['We (fly:are flying) to Sochi on Friday — we\'ve got the tickets. | В пятницу мы летим в Сочи — билеты уже есть.', 'As soon as she (arrive:arrives), we\'ll start. | Как только она приедет, начнём.', 'The concert (start:starts) at 8 p.m. | Концерт начинается в 8 вечера.'] },

{ id: 'cond-01', t: 'Условные: нулевой и первый тип', lvl: 'A2', v: 'conditionals zero first conditional объяснение',
  b: [
    { k: 'table', head: ['Тип', 'If-часть', 'Главная часть', 'Смысл'], rows: [['0', 'If + Present Simple', 'Present Simple', 'всегда так (факты)'], ['1', 'If + Present Simple', 'will + V', 'реально в будущем']] },
    { k: 'ex', items: ['If you heat ice, it melts. = Если нагреть лёд, он тает.', "If it rains tomorrow, we'll stay at home. = Если завтра будет дождь, мы останемся дома.", "Unless you hurry, you'll miss the bus. = Если не поторопишься, опоздаешь на автобус."] },
    { k: 'tip', t: 'Главная ошибка: will в части с if. Не If it will rain, а If it rains.' },
  ],
  g: ["If it {rains|will rain}, we'll take a taxi.", 'If you mix red and white, you {get|got} pink.', "If she studies, she {'ll pass|passes} the test.", "{Unless|If} you leave now, you'll be late."],
  f: ['If you (not/hurry:don\'t hurry|do not hurry), you\'ll miss the train. | Если не поторопишься, опоздаешь на поезд.', 'If I (see:see) him, I\'ll tell him. | Если увижу его, скажу.', 'If water (reach:reaches) 0 °C, it freezes. | Если вода достигает 0 °C, она замерзает.', 'We (go:will go|\'ll go) to the beach if it\'s sunny. | Мы пойдём на пляж, если будет солнечно.'] },

{ id: 'should-might', t: 'should, may, might, could', lvl: 'A2', v: 'should might may could модальные глаголы',
  b: [
    { k: 'table', head: ['Глагол', 'Значение', 'Пример'], rows: [['should', 'совет: стоит, следует', 'You should see a doctor.'], ['may / might', 'возможно (might — менее уверенно)', 'It might rain later.'], ['could', 'умел в прошлом; вежливая просьба', 'Could you help me?'], ['may', 'вежливое разрешение', 'May I come in?']] },
    { k: 'formula', rows: [['+', 'S', '*модальный', '~V'], ['−', 'S', '*модальный + not', '~V']] },
  ],
  g: ["You look tired. You {should|might} go to bed.", "Take an umbrella. It {might|should} rain.", '{Could|Should} you open the window, please?', "You {shouldn't|mightn't} eat so many sweets."],
  f: [] },

{ id: 'relative', t: 'Относительные: who, which, that, where', lvl: 'A2', v: 'relative clauses who which that whose',
  b: [
    { k: 'table', head: ['Слово', 'О ком / о чём', 'Пример'], rows: [['who', 'люди', 'The girl who lives next door…'], ['which', 'предметы, животные', 'The book which I bought…'], ['that', 'люди и предметы (не после запятой)', 'The film that we saw…'], ['whose', 'чей', 'The boy whose dog is lost…'], ['where', 'место', 'The town where I was born…']] },
    { k: 'tip', t: 'Если who / which / that — дополнение, его можно убрать: The book (that) I read was great.' },
  ],
  g: ['The man {who|which} called you is my uncle.', 'This is the house {where|which} I grew up.', 'I have a friend {whose|who\'s} father is a pilot.', 'The phone {which|who} I bought is broken.'],
  f: [] },

{ id: 'ger-inf', t: 'Герундий или инфинитив', lvl: 'A2', v: 'gerund or infinitive глаголы после которых ing to',
  b: [
    { k: 'compare', a: ['+ -ing', 'enjoy, like, love, hate', 'finish, stop, mind, avoid', 'go swimming / shopping', 'после предлогов: good at drawing'], b: ['+ to V', 'want, decide, hope, plan', 'learn, agree, promise, need', 'would like to', 'прилагательное + to: easy to learn'] },
    { k: 'tip', t: 'stop smoking — бросить курить; stop to smoke — остановиться, чтобы покурить. Смысл меняется!' },
  ],
  g: ['I enjoy {reading|to read} detective stories.', 'She decided {to study|studying} medicine.', 'He is good at {drawing|draw}.', 'We hope {to see|seeing} you soon.', 'Have you finished {writing|to write}?'],
  f: ['I want (become:to become) a programmer. | Я хочу стать программистом.', 'Do you mind (wait:waiting) a minute? | Не против подождать минутку?', 'They agreed (help:to help) us. | Они согласились помочь нам.'] },

{ id: 'too-enough', t: 'too и enough', lvl: 'A2', v: 'too enough разница',
  b: [
    { k: 'formula', rows: [['слишком', 'too', '~прилагательное'], ['достаточно', '~прилагательное', 'enough'], ['достаточно', 'enough', 'существительное']] },
    { k: 'ex', items: ["It's too cold to swim. = Слишком холодно, чтобы купаться.", "He isn't old enough to drive. = Он недостаточно взрослый, чтобы водить.", "We haven't got enough time. = У нас недостаточно времени."] },
  ],
  g: ["I'm not {tall enough|enough tall} to reach it.", 'This coffee is {too|enough} hot to drink.', "We don't have {enough money|money enough}."],
  f: [] },

{ id: 'ed-ing', t: 'Прилагательные на -ed и -ing', lvl: 'A2', v: 'adjectives ed ing bored boring',
  b: [
    { k: 'compare', a: ['-ed — что я чувствую', "I'm bored.", "She's interested in art.", 'We were tired.'], b: ['-ing — что вызывает чувство', 'The lesson is boring.', 'Art is interesting.', 'It was a tiring day.'] },
  ],
  g: ['I was very {bored|boring} at the lesson.', 'The film was {exciting|excited}.', 'Are you {interested|interesting} in history?', 'That was an {amazing|amazed} trip.'],
  f: [] },

/* ======================= B1 ======================= */
{ id: 'ppc', t: 'Present Perfect Continuous', lvl: 'B1', v: 'Present Perfect Continuous объяснение',
  b: [
    { k: 'lead', t: 'Действие началось в прошлом и длится до сих пор (или только что закончилось, и видны следы). Важен процесс и длительность.' },
    { k: 'timeline', m: [{ r: [-0.75, 0], open: true }, { l: 'for two hours', at: -0.38 }], cap: 'Отрезок тянется из прошлого прямо в «сейчас».' },
    { k: 'formula', rows: [['+', 'S', '*have / has been', '~V-ing'], ['−', 'S', "*haven't / hasn't been", '~V-ing'], ['?', '*Have / Has', 'S', 'been ~V-ing …?']] },
    { k: 'compare', a: ['Perfect Continuous — процесс', "I've been reading for two hours.", 'Сколько времени?'], b: ['Present Perfect — результат', "I've read 50 pages.", 'Сколько сделано?'] },
    { k: 'markers', t: 'for (2 hours), since (Monday), how long, all day, lately, recently' },
  ],
  g: ["I {'ve been waiting|'m waiting} for you for an hour!", 'How long {have you been|are you} learning English?', 'She has been working here {since|for} 2020.', "Your eyes are red. {Have you been crying|Did you cry}?", "I've {written|been writing} three letters today."],
  f: ['We (wait:have been waiting|\'ve been waiting) for the bus for 20 minutes. | Мы ждём автобус уже 20 минут.', 'How long (you/learn:have you been learning) French? | Сколько ты уже учишь французский?', 'It (rain:has been raining) since morning. | Дождь идёт с самого утра.', 'She is tired because she (run:has been running|\'s been running). | Она устала, потому что бегала.'] },

{ id: 'past-perfect', t: 'Past Perfect', lvl: 'B1', v: 'Past Perfect объяснение',
  b: [
    { k: 'lead', t: '«Предпрошедшее»: действие случилось раньше другого момента в прошлом.' },
    { k: 'timeline', m: [{ p: -0.75 }, { l: '1. had left', at: -0.75 }, { p: -0.35 }, { l: '2. arrived', at: -0.35 }], cap: 'Сначала одно (Past Perfect), потом другое (Past Simple).' },
    { k: 'formula', rows: [['+', 'S', '*had', '~V3'], ['−', 'S', "*hadn't", '~V3'], ['?', '*Had', 'S', '~V3 …?']] },
    { k: 'ex', items: ['When we arrived, the film had already started. = Когда мы пришли, фильм уже начался.', "She was sad because she had lost her bag. = Ей было грустно, потому что она потеряла сумку."] },
    { k: 'markers', t: 'already, by the time, before, after, when, by 5 o\'clock' },
  ],
  g: ['When I got to the station, the train {had left|left}.', 'She {had never seen|never saw} snow before she moved to Canada.', 'By 10 p.m. we {had finished|have finished} the project.', 'He told me he {had lost|has lost} his phone.'],
  f: ['When I came home, my parents (already/have:had already had) dinner. | Когда я пришёл, родители уже поужинали.', 'I (never/fly:had never flown) before that trip. | До той поездки я ни разу не летал.', 'By the time the police arrived, the thieves (escape:had escaped). | К приезду полиции воры уже сбежали.', 'She couldn\'t pay because she (forget:had forgotten) her wallet. | Она не могла заплатить, потому что забыла кошелёк.'] },

{ id: 'passive', t: 'Пассивный залог', lvl: 'B1', v: 'пассивный залог passive voice объяснение',
  b: [
    { k: 'lead', t: 'Важно не кто сделал, а что сделали с предметом. Предмет становится подлежащим.' },
    { k: 'move', a: 'Shakespeare wrote Hamlet.', b: 'Hamlet was written by Shakespeare.', w: 'Hamlet' },
    { k: 'formula', rows: [['формула', 'S', '*be (в нужном времени)', '~V3', '(by …)']] },
    { k: 'table', head: ['Время', 'Пассив', 'Пример'], rows: [['Present Simple', 'am / is / are + V3', 'English is spoken here.'], ['Past Simple', 'was / were + V3', 'The house was built in 1900.'], ['Future', 'will be + V3', 'It will be done tomorrow.'], ['Present Perfect', 'have / has been + V3', 'The window has been broken.'], ['модальные', 'can / must be + V3', 'It must be finished today.']] },
  ],
  g: ['This bridge {was built|built} in 1890.', 'English {is spoken|speaks} all over the world.', 'The letters {will be sent|will send} tomorrow.', 'My bike {has been stolen|has stolen}!', 'The book was written {by|from} Tolstoy.'],
  f: ['Paper (invent:was invented) in China. | Бумагу изобрели в Китае.', 'The room (clean:is cleaned) every day. | Комнату убирают каждый день.', 'The results (announce:will be announced) next week. | Результаты объявят на следующей неделе.', 'My car (repair:has been repaired). | Мою машину починили.', 'Phones must (switch off:be switched off) during the exam. | Телефоны нужно выключать на экзамене.'] },

{ id: 'reported', t: 'Косвенная речь', lvl: 'B1', v: 'косвенная речь reported speech объяснение',
  b: [
    { k: 'lead', t: 'Пересказываем чужие слова. Если «сказал» в прошлом — время сдвигается на шаг назад.' },
    { k: 'move', a: '"I am tired," she said.', b: 'She said that she was tired.', w: 'am' },
    { k: 'shift', t: 'Сдвиг времён', pairs: [['am / is / are', 'was / were'], ['Present Simple', 'Past Simple'], ['Present Continuous', 'Past Continuous'], ['Past Simple / Present Perfect', 'Past Perfect'], ['will', 'would'], ['can', 'could'], ['must', 'had to']] },
    { k: 'shift', t: 'Меняются и слова', pairs: [['today', 'that day'], ['yesterday', 'the day before'], ['tomorrow', 'the next day'], ['here', 'there'], ['now', 'then'], ['this', 'that']] },
    { k: 'compare', a: ['Вопросы', 'He asked where I lived.', 'She asked if (whether) I was ready.', 'порядок слов — как в утверждении!'], b: ['Просьбы и приказы', 'She asked me to close the door.', 'He told me not to be late.', 'tell / ask + to V'] },
  ],
  g: ['He said he {was|is} hungry.', 'She asked me where I {lived|did I live}.', 'Mum told me {not to|don\'t} be late.', 'He said he {would|will} call the next day.', 'They asked {if|that} I was ready.'],
  f: ['"I like pizza." → He said that he (like:liked) pizza. | Он сказал, что любит пиццу.', '"I will help you." → She said she (help:would help) me. | Она сказала, что поможет мне.', '"I can swim." → Tom said he (can/swim:could swim). | Том сказал, что умеет плавать.', '"Where do you live?" → She asked me where I (live:lived). | Она спросила, где я живу.', '"I have lost my key." → He said he (lose:had lost) his key. | Он сказал, что потерял ключ.'] },

{ id: 'cond-2', t: 'Второй тип условных', lvl: 'B1', v: 'second conditional второй тип условных',
  b: [
    { k: 'lead', t: 'Нереальное или маловероятное сейчас и в будущем: «если бы…, то…».' },
    { k: 'formula', rows: [['if', 'If', 'S', '~Past Simple', ','], ['то', 'S', '*would', '~V']] },
    { k: 'compare', a: ['1-й тип — реально', "If I have time, I'll help you.", '(время, скорее всего, будет)'], b: ['2-й тип — нереально', 'If I had time, I would help you.', '(но времени нет)'] },
    { k: 'tip', t: 'С to be можно were для всех: If I were you, I would… — «на твоём месте я бы…».' },
  ],
  g: ['If I {had|have} a million, I would travel.', 'If I were you, I {would|will} apologise.', 'What would you do if you {saw|see} a ghost?', 'She {would|will} be happier if she lived by the sea.'],
  f: ['If I (know:knew) his number, I would call him. | Если бы я знал его номер, я бы позвонил.', 'If I were rich, I (buy:would buy) a castle. | Будь я богат, купил бы замок.', 'If you (be:were) me, what would you do? | Что бы ты сделал на моём месте?', 'We (not/go:wouldn\'t go|would not go) out if it rained. | Мы бы не пошли гулять, если бы шёл дождь.'] },

{ id: 'wish', t: 'I wish / If only', lvl: 'B1', v: 'I wish конструкция объяснение',
  b: [
    { k: 'table', head: ['Сожаление о…', 'Форма', 'Пример'], rows: [['настоящем', 'wish + Past Simple', 'I wish I had a dog. = Жаль, что у меня нет собаки.'], ['прошлом', 'wish + Past Perfect', 'I wish I had studied. = Жаль, что я не учился.'], ['раздражении, чужом поведении', 'wish + would', 'I wish you would stop! = Хоть бы ты перестал!']] },
    { k: 'tip', t: 'Русское «жаль, что НЕ…» → английское без not, и наоборот: Жаль, что я не высокий → I wish I were tall.' },
  ],
  g: ['I wish I {were|am} taller.', 'I wish I {had listened|listened} to you yesterday.', 'I wish you {would|will} stop talking!', 'If only I {knew|know} the answer!'],
  f: ['I wish I (can/speak:could speak) Chinese. | Жаль, что я не говорю по-китайски.', 'I wish I (not/eat:hadn\'t eaten|had not eaten) so much. | Зря я столько съел.', 'She wishes she (live:lived) in the city. | Ей жаль, что она не живёт в городе.'] },

{ id: 'stative', t: 'Глаголы состояния', lvl: 'B1', v: 'stative verbs глаголы состояния',
  b: [
    { k: 'lead', t: 'Эти глаголы описывают состояние, а не действие, поэтому обычно не бывают в -ing.' },
    { k: 'table', head: ['Группа', 'Глаголы'], rows: [['чувства', 'like, love, hate, want, prefer'], ['мысли', 'know, believe, understand, remember, think (= считать)'], ['владение', 'have (= иметь), own, belong'], ['восприятие', 'see, hear, smell, taste, seem']] },
    { k: 'compare', a: ['состояние', 'I think it\'s good. (считаю)', 'She has a car. (имеет)'], b: ['действие — можно -ing', "I'm thinking about it. (обдумываю)", "She's having lunch. (обедает)"] },
  ],
  g: ['I {know|am knowing} him well.', 'This soup {tastes|is tasting} great.', "Quiet! I {'m thinking|think} about the problem.", 'This bag {belongs|is belonging} to me.'],
  f: [] },

{ id: 'question-tags', t: 'Разделительные вопросы', lvl: 'B1', v: 'question tags разделительные вопросы',
  b: [
    { k: 'lead', t: '«…, не так ли?» Плюс в предложении → минус в хвостике, и наоборот.' },
    { k: 'compare', a: ['+ → −', "You are tired, aren't you?", "She likes tea, doesn't she?", "They went home, didn't they?"], b: ['− → +', "He isn't here, is he?", "You can't swim, can you?", "We haven't met, have we?"] },
    { k: 'tip', t: "Особые: I am → aren't I? Let's → shall we? Повелительное → will you?" },
  ],
  g: ["You're from Kazan, {aren't|isn't|don't} you?", "She can drive, {can't|doesn't} she?", "They didn't call, {did|didn't} they?", "I'm right, {aren't|am not} I?", "Let's go, {shall|will} we?"],
  f: [] },

/* ======================= B2 ======================= */
{ id: 'ppfc', t: 'Past Perfect Continuous', lvl: 'B2', v: 'Past Perfect Continuous объяснение',
  b: [
    { k: 'lead', t: 'Процесс длился до определённого момента в прошлом.' },
    { k: 'timeline', m: [{ r: [-0.9, -0.35] }, { p: -0.35 }, { l: 'when she arrived', at: -0.35 }], cap: 'Отрезок упирается в точку прошлого.' },
    { k: 'formula', rows: [['+', 'S', '*had been', '~V-ing']] },
    { k: 'ex', items: ['I had been waiting for an hour when she finally came. = Я ждал уже час, когда она наконец пришла.', 'His clothes were wet — he had been walking in the rain. = Его одежда промокла — он гулял под дождём.'] },
  ],
  g: ['They {had been playing|have been playing} for two hours when it started to rain.', 'She was tired because she {had been working|has been working} all day.'],
  f: ['We (walk:had been walking) for hours before we found a café. | Мы шли несколько часов, прежде чем нашли кафе.', 'His eyes were red: he (cry:had been crying). | Глаза у него были красные: он плакал.'] },

{ id: 'future-adv', t: 'Future Continuous и Future Perfect', lvl: 'B2', v: 'Future Continuous Future Perfect',
  b: [
    { k: 'timeline', m: [{ r: [0.3, 0.7] }, { p: 0.5 }, { l: 'this time tomorrow', at: 0.5 }], cap: 'Future Continuous: в момент будущего действие будет в процессе.' },
    { k: 'timeline', m: [{ p: 0.4 }, { p: 0.75 }, { arc: [0.4, 0.75] }, { l: 'by Friday', at: 0.75 }], cap: 'Future Perfect: к моменту будущего действие уже завершится.' },
    { k: 'formula', rows: [['Cont.', 'S', '*will be', '~V-ing'], ['Perf.', 'S', '*will have', '~V3']] },
    { k: 'ex', items: ['This time tomorrow I will be flying to Paris. = Завтра в это время я буду лететь в Париж.', "By 2030 I will have finished university. = К 2030 году я окончу университет."] },
  ],
  g: ['At 9 tomorrow I {will be sitting|will sit} an exam.', 'By June they {will have built|will build} the bridge.', "Don't call at 8 — we {'ll be having|'ll have} dinner."],
  f: ['By the end of the year I (read:will have read) 30 books. | К концу года я прочитаю 30 книг.', 'This time next week we (lie:will be lying) on the beach. | Через неделю в это время мы будем лежать на пляже.'] },

{ id: 'passive-adv', t: 'Пассив сложнее и have something done', lvl: 'B2', v: 'causative have something done passive advanced',
  b: [
    { k: 'table', head: ['Время', 'Пассив'], rows: [['Present Continuous', 'is being built'], ['Past Continuous', 'was being repaired'], ['Past Perfect', 'had been sold'], ['Future Perfect', 'will have been finished'], ['Infinitive', 'to be done / to have been done']] },
    { k: 'move', a: 'A hairdresser cuts my hair.', b: 'I have my hair cut.', w: 'cut' },
    { k: 'formula', rows: [['каузатив', 'S', '*have / get', 'object', '~V3']] },
    { k: 'ex', items: ['The road is being repaired. = Дорогу сейчас ремонтируют.', 'We had our flat painted. = Нам покрасили квартиру (мы заказали).', 'He is said to be a genius. = Говорят, он гений.'] },
  ],
  g: ['A new school {is being built|is building} in our street.', 'I {had my car washed|washed my car by someone}.', 'When we came, the room {was being cleaned|was cleaning}.'],
  f: ['The museum (rebuild:is being rebuilt) at the moment. | Музей сейчас перестраивают.', 'She (have/her nails/do:had her nails done) yesterday. | Вчера ей сделали маникюр.', 'By the time we arrived, all the tickets (sell:had been sold). | К нашему приходу все билеты были проданы.'] },

{ id: 'cond-3', t: 'Третий тип и смешанные условные', lvl: 'B2', v: 'third conditional mixed conditionals',
  b: [
    { k: 'lead', t: 'Третий тип — о прошлом, которое уже не изменить: «если бы тогда…, то…».' },
    { k: 'formula', rows: [['3', 'If', 'S', '*had', '~V3', ',', 'S', '*would have', '~V3']] },
    { k: 'table', head: ['Тип', 'If-часть', 'Главная', 'Пример'], rows: [['3', 'Past Perfect', 'would have + V3', 'If I had known, I would have come.'], ['смеш. (прошлое → сейчас)', 'Past Perfect', 'would + V', 'If I had studied, I would be a doctor now.'], ['смеш. (сейчас → прошлое)', 'Past Simple', 'would have + V3', "If I were brave, I would have said it."]] },
  ],
  g: ['If I {had known|knew} about the party, I would have come.', 'If she had taken the taxi, she {would have arrived|would arrive} on time.', 'If I had saved money, I {would be|would have been} rich now.'],
  f: ['If we (leave:had left) earlier, we wouldn\'t have missed the train. | Если бы мы вышли раньше, не опоздали бы на поезд.', 'If you had asked me, I (help:would have helped) you. | Если бы ты попросил, я бы помог.', 'If he (not/break:hadn\'t broken|had not broken) his leg, he would be playing today. | Если бы он не сломал ногу, сегодня бы играл.'] },

{ id: 'deduction', t: 'Модальные глаголы предположения', lvl: 'B2', v: 'modal verbs of deduction must have can\'t have',
  b: [
    { k: 'table', head: ['Уверенность', 'Сейчас', 'О прошлом'], rows: [['почти 100% да', 'must be', 'must have been'], ['возможно', 'may / might / could be', 'may / might / could have been'], ['почти 100% нет', "can't be", "can't / couldn't have been"]] },
    { k: 'ex', items: ["She isn't answering. She must be asleep. = Не отвечает. Наверняка спит.", "He can't have seen us — it was dark. = Он не мог нас видеть — было темно.", 'They might have missed the bus. = Возможно, они опоздали на автобус.'] },
    { k: 'tip', t: 'Противоположность must be в этом значении — can\'t be, а не mustn\'t be.' },
  ],
  g: ["The lights are off. They {must|can't} be out.", "That {can't|mustn't} be Tom — he's in London.", 'She looks happy. She {must have passed|must pass} the exam.', 'I {might have left|might leave} my keys at school yesterday.'],
  f: ['He knows everything about cars. He (must/be:must be) a mechanic. | Он всё знает о машинах. Наверняка механик.', 'She (can\'t/forget:can\'t have forgotten) — I reminded her twice. | Она не могла забыть — я дважды напомнил.'] },

{ id: 'inversion', t: 'Инверсия для усиления', lvl: 'B2', v: 'inversion in English never have I',
  b: [
    { k: 'lead', t: 'Отрицательное слово в начале — вспомогательный глагол встаёт перед подлежащим, как в вопросе.' },
    { k: 'move', a: 'I have never seen such a thing.', b: 'Never have I seen such a thing.', w: 'have' },
    { k: 'table', head: ['Начало', 'Пример'], rows: [['Never / Rarely / Seldom', 'Rarely do we see such talent.'], ['Not only … but also', 'Not only did he win, but he also broke the record.'], ['Hardly … when / No sooner … than', 'No sooner had I arrived than it began to rain.'], ['Only then / Only after', 'Only then did I understand.']] },
  ],
  g: ['Never {have I|I have} heard such nonsense.', 'Not only {did she|she} sing, but she also danced.', 'No sooner {had we|we had} sat down than the phone rang.'],
  f: [] },

{ id: 'word-formation', t: 'Словообразование', lvl: 'B2', v: 'словообразование в английском ЕГЭ суффиксы приставки',
  b: [
    { k: 'lead', t: 'Из одного корня — разные части речи. Это целое задание в ОГЭ и ЕГЭ.' },
    { k: 'table', head: ['Получаем', 'Суффиксы', 'Примеры'], rows: [['человека', '-er, -or, -ist, -ian', 'teacher, actor, scientist, musician'], ['существительное', '-tion, -ment, -ness, -ity, -ance', 'education, development, kindness, ability, importance'], ['прилагательное', '-ful, -less, -ous, -al, -able, -ive', 'useful, careless, famous, national, comfortable, creative'], ['наречие', '-ly', 'quickly, happily'], ['глагол', '-en, -ise / -ize', 'widen, organise']] },
    { k: 'table', head: ['Приставки «не-»', 'Примеры'], rows: [['un-', 'unhappy, unusual'], ['in- / im- / il- / ir-', 'independent, impossible, illegal, irregular'], ['dis-', 'disagree, dislike'], ['mis-', 'misunderstand']] },
  ],
  g: ['She is a famous {scientist|science}.', 'It was a very {useful|useless} tip — thank you!', 'It is {impossible|unpossible} to do it in a day.', 'He spoke {quickly|quick}.'],
  f: ['He is a well-known (ACT:actor). | Он известный актёр.', 'Thank you for your (KIND:kindness). | Спасибо за доброту.', 'This chair is very (COMFORT:comfortable). | Этот стул очень удобный.', 'The test was (SUCCESS:successful). | Тест прошёл успешно.', 'It\'s (LEGAL:illegal) to park here. | Здесь парковаться запрещено.', 'She smiled (HAPPY:happily). | Она счастливо улыбнулась.', 'Good (EDUCATE:education) is important. | Хорошее образование важно.', 'I (AGREE:disagree) with you. | Я с тобой не согласен.'] },
];
