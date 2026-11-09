/* Английский путь — 5 класс (ускоренный курс, уровень A1 → A2).
   Темы и грамматика идут в порядке школьной программы 5 класса,
   все объяснения, слова и примеры составлены заново (не из учебников).

   Формат урока:
   t  — название
   th — правило: обычная строка = абзац, "> en = ru" = пример с озвучкой, "! текст" = подсказка
   w  — слова "en=ru; en=ru"
   s  — предложения "en | ru"
   g  — пропуски "I {am|is|are} Kate." (первый вариант в скобках — верный), можно " | перевод"
*/
window.COURSE = window.COURSE || {};
window.COURSE[5] = {
  id: 5,
  title: '5 класс',
  level: 'A1 → A2',
  units: [
  {
    id: 'u0', title: 'Старт', sub: 'Привет, числа, цвета, a/an', color: '#2E5BFF',
    lessons: [
      { t: 'Привет!', th: `В английском нельзя пропускать «быть». Не «I Tom», а **I am Tom** — «Я (есть) Том».
Коротко: I am = **I'm**.
> I am Tom. = Я Том.
> My name is Anna. = Меня зовут Анна.
> Hello! I'm Max. = Привет! Я Макс.
! «Меня зовут» — это My name is…, дословно «моё имя — это…».`,
        w: 'hello=привет; hi=привет (по-дружески); goodbye=до свидания; I=я; my=мой; name=имя; yes=да; no=нет',
        s: ['Hello, I am Tom. | Привет, я Том.', 'My name is Anna. | Меня зовут Анна.', 'Goodbye, Anna! | До свидания, Анна!', 'Yes, I am Tom. | Да, я Том.', 'Hi, my name is Max. | Привет, меня зовут Макс.'],
        g: ['I {am|is|are} Kate.', 'My name {is|am|are} Max.', '{I|My} am Ben.', 'Hello! My {name|names|I} is Lily.'] },
      { t: 'Числа 1–10', th: `Возраст говорим через **am / is / are**, а не через «иметь»:
> I am ten. = Мне десять лет.
> How old are you? = Сколько тебе лет?
! По-русски «мне 10 лет», по-английски «я есть 10».`,
        w: 'one=один; two=два; three=три; four=четыре; five=пять; six=шесть; seven=семь; eight=восемь; nine=девять; ten=десять',
        s: ['I am ten. | Мне десять лет.', 'How old are you? | Сколько тебе лет?', 'I am nine. | Мне девять лет.', 'Two and three is five. | Два плюс три — пять.', 'I am eight, not nine. | Мне восемь, а не девять.'],
        g: ['I {am|is|have} eight.', 'How old {are|is|am} you?', 'Five and five is {ten|nine|six}.', 'Three and four is {seven|eight|five}.'] },
      { t: 'Цвета', th: `Цвет стоит **перед** предметом и не меняется: a red bag, red bags.
**It is** (коротко **it's**) — «это / он / она» о предмете или животном.
> It's red. = Он красный.
> My bag is blue. = Мой рюкзак синий.
> The cat is black. = Кошка чёрная.`,
        w: 'red=красный; blue=синий; green=зелёный; yellow=жёлтый; white=белый; black=чёрный; cat=кошка; bag=сумка, рюкзак',
        s: ['The cat is black. | Кошка чёрная.', 'My bag is blue. | Мой рюкзак синий.', 'It is green. | Он зелёный.', 'My cat is white. | Моя кошка белая.', 'It is a red bag. | Это красная сумка.'],
        g: ['It {is|am|are} yellow.', 'My cat {is|are|am} white.', 'My bag {is|am} red.', 'It is a {green bag|bag green}.'] },
      { t: 'a или an', th: `Перед одним предметом ставим **a** или **an**.
**a** — если слово начинается с согласного звука: a pen, a book.
**an** — если с гласного звука: an apple, an egg.
> It's a pen. = Это ручка.
> It's an apple. = Это яблоко.
> an orange pencil = оранжевый карандаш
! Смотрим на слово сразу после артикля: a **red** apple, но an **orange** pen.`,
        w: 'pen=ручка; pencil=карандаш; book=книга; ruler=линейка; rubber=ластик; desk=парта; apple=яблоко; orange=оранжевый, апельсин',
        s: ['It is a pen. | Это ручка.', "It's an apple. | Это яблоко.", 'My book is red. | Моя книга красная.', 'It is a blue ruler. | Это синяя линейка.', "It's an orange pencil. | Это оранжевый карандаш."],
        g: ['It is {an|a} apple.', 'It is {a|an} desk.', "It's {an|a} orange.", 'It is {a|an} rubber.', 'It is {a|an} red apple.'] },
      { t: 'Что это?', th: `**this** — это (рядом), **that** — то (далеко).
В вопросе **is** встаёт вперёд:
> What is this? = Что это?
> Is it a pen? = Это ручка?
> Yes, it is. = Да.
> No, it isn't. = Нет.
! isn't = is not.`,
        w: 'this=это (рядом); that=то (там); what=что; is not=не является; isn\'t=не (коротко)',
        s: ['What is this? | Что это?', 'This is my desk. | Это моя парта.', 'That is a green book. | То — зелёная книга.', 'Is it a pen? | Это ручка?', "No, it isn't. | Нет."],
        g: ['What {is|are|am} this?', '{Is|Am|Are} it an apple?', "No, it {isn't|aren't|not}.", 'Yes, it {is|isn\'t|am}.'] },
    ]
  },
  {
    id: 'u1', title: 'Школа', sub: 'to be, команды, дни недели', color: '#00A3A3',
    lessons: [
      { t: 'Школьные предметы', th: `Названия предметов пишем с большой буквы: **English, Maths, Art**.
> My favourite subject is English. = Мой любимый предмет — английский.
> It's an English lesson. = Это урок английского.
! favourite — британское написание, favorite — американское. Оба правильные.`,
        w: 'English=английский язык; Maths=математика; Art=рисование; Music=музыка; PE=физкультура; Science=естествознание; lesson=урок; favourite=любимый',
        s: ['My favourite subject is English. | Мой любимый предмет — английский.', 'It is an English lesson. | Это урок английского.', 'Is Music your favourite subject? | Музыка — твой любимый предмет?', 'Art is my favourite lesson. | Рисование — мой любимый урок.', 'It is a Maths lesson. | Это урок математики.'],
        g: ['My favourite {subject|subjects} is Art.', 'It is {an|a} English lesson.', 'It is {a|an} Maths lesson.', '{Is|Are} Music your favourite subject?'] },
      { t: 'Глагол to be', th: `«Быть» меняется по лицам:
**I am** · **you are** · **he / she / it is** · **we / you / they are**
Коротко: I'm, you're, he's, she's, it's, we're, they're.
> She is my teacher. = Она моя учительница.
> We are friends. = Мы друзья.
> They're pupils. = Они ученики.`,
        w: 'he=он; she=она; we=мы; they=они; you=ты, вы; teacher=учитель; pupil=ученик; friend=друг',
        s: ['She is my teacher. | Она моя учительница.', 'He is a pupil. | Он ученик.', 'We are friends. | Мы друзья.', 'They are pupils. | Они ученики.', 'You are my friend. | Ты мой друг.'],
        g: ['She {is|are|am} a teacher.', 'We {are|is|am} friends.', 'They {are|is} pupils.', 'He {is|are|am} my friend.', 'I {am|is|are} a pupil.'] },
      { t: 'Не и вопросы с to be', th: `Отрицание: после am / is / are ставим **not**.
I am not = I'm not · is not = **isn't** · are not = **aren't**
Вопрос: am / is / are выходит вперёд.
> Are you ready? = Ты готов?
> Yes, I am. / No, I'm not. = Да. / Нет.
> He isn't here. = Его здесь нет.`,
        w: 'late=опоздавший; ready=готовый; here=здесь; new=новый; school=школа; class=класс; not=не',
        s: ['I am not late. | Я не опаздываю.', "He isn't here. | Его здесь нет.", 'Are you ready? | Ты готов?', "We aren't in class. | Мы не в классе.", 'Is she new? | Она новенькая?'],
        g: ["He {isn't|aren't|am not} here.", "We {aren't|isn't} late.", '{Are|Is|Am} you ready?', '{Is|Are} she a new pupil?', "No, I {am not|isn't|aren't}."] },
      { t: 'Команды в классе', th: `Просьба или команда начинается сразу с глагола:
> Open your books! = Откройте книги!
Запрет — **Don't** + глагол:
> Don't write! = Не пишите!
Вежливо — добавь **please**.`,
        w: 'open=открывать; close=закрывать; read=читать; write=писать; listen=слушать; sit down=садиться; stand up=вставать; please=пожалуйста',
        s: ['Open your books, please. | Откройте книги, пожалуйста.', 'Sit down, please. | Садитесь, пожалуйста.', "Don't write! | Не пишите!", 'Listen and read. | Слушайте и читайте.', 'Close your book. | Закрой книгу.'],
        g: ['{Open|Opens|Opening} your books.', "{Don't|Not|Isn't} write in the book.", '{Sit|Sits} down, please.', "Don't {close|closes} the book."] },
      { t: 'Дни недели', th: `Дни недели — всегда с большой буквы.
«В понедельник» — **on** Monday.
> Today is Friday. = Сегодня пятница.
> I have English on Tuesday. = У меня английский во вторник.`,
        w: 'Monday=понедельник; Tuesday=вторник; Wednesday=среда; Thursday=четверг; Friday=пятница; Saturday=суббота; Sunday=воскресенье; today=сегодня',
        s: ['Today is Monday. | Сегодня понедельник.', 'I have English on Tuesday. | У меня английский во вторник.', 'Is it Sunday today? | Сегодня воскресенье?', "No, it's Saturday. | Нет, суббота.", 'We have Music on Friday. | У нас музыка в пятницу.'],
        g: ['I have Music {on|in|at} Wednesday.', 'Today {is|are} Thursday.', 'My birthday is on {Monday|monday}.', 'The day after Saturday is {Sunday|Friday|Monday}.'] },
    ]
  },
  {
    id: 'u2', title: 'Это я', sub: 'страны, have got, множественное число', color: '#7A4DFF',
    lessons: [
      { t: 'Страны', th: `Страны и национальности — с большой буквы.
> Where are you from? = Откуда ты?
> I'm from Russia. I'm Russian. = Я из России. Я русский.
! Страна: Italy. Национальность / язык: Italian.`,
        w: 'Russia=Россия; Russian=русский; Britain=Британия; British=британский; Italy=Италия; Italian=итальянский; Spain=Испания; Spanish=испанский; where=где; from=из',
        s: ['Where are you from? | Откуда ты?', 'I am from Russia. | Я из России.', 'She is British. | Она британка.', 'Is he from Italy? | Он из Италии?', "They aren't Spanish. | Они не испанцы."],
        g: ['Where {are|is} you from?', 'He is {from|of|in} Spain.', "I'm Russian. I'm from {Russia|Russian}.", 'Is she {Italian|Italy}? Yes, she is from Rome.'] },
      { t: 'have got — у меня есть', th: `«У меня есть» = **I have got** (I've got).
С he / she / it — **has got** (he's got).
Не = **haven't got / hasn't got**.
> Have you got a dog? = У тебя есть собака?
> Yes, I have. / No, I haven't.
> She has got a phone. = У неё есть телефон.`,
        w: 'bike=велосипед; computer=компьютер; phone=телефон; ball=мяч; dog=собака; camera=фотоаппарат; have got=иметь; has got=имеет (он, она)',
        s: ['I have got a bike. | У меня есть велосипед.', 'She has got a phone. | У неё есть телефон.', "We haven't got a computer. | У нас нет компьютера.", 'Have you got a dog? | У тебя есть собака?', "He hasn't got a ball. | У него нет мяча."],
        g: ['She {has|have} got a camera.', 'They {have|has} got a dog.', '{Have|Has} you got a bike?', "He {hasn't|haven't} got a phone.", "I {haven't|hasn't} got a ball."] },
      { t: 'Много предметов', th: `Обычно добавляем **-s**: book → books.
После s, x, sh, ch, o — **-es**: box → boxes, watch → watches.
Согласная + y → **-ies**: baby → babies.
Исключения запомнить:
> man → men = мужчина → мужчины
> woman → women = женщина → женщины
> child → children = ребёнок → дети
> foot → feet, tooth → teeth, mouse → mice = ступни, зубы, мыши`,
        w: 'box=коробка; watch=часы (наручные); child=ребёнок; children=дети; man=мужчина; men=мужчины; woman=женщина; mice=мыши',
        s: ['I have got three boxes. | У меня три коробки.', 'The children are at school. | Дети в школе.', 'She has got two watches. | У неё двое часов.', 'The mice are small. | Мыши маленькие.', 'Two men and two women are here. | Здесь двое мужчин и две женщины.'],
        g: ['two {boxes|boxs|box}', 'three {children|childs|childrens}', 'two {watches|watchs}', 'five {men|mans|mens}', 'four {babies|babys}', 'two {teeth|tooths}'] },
      { t: 'this / these, that / those', th: `Рядом: **this** (один) — **these** (много).
Далеко: **that** (один) — **those** (много).
> This is a coin. = Это монета.
> These are coins. = Это монеты.
> Those are my keys. = Вон те — мои ключи.`,
        w: 'these=эти; those=те; key=ключ; card=открытка, карточка; sticker=наклейка; coin=монета; collection=коллекция; old=старый',
        s: ['These are my stickers. | Это мои наклейки.', 'Those are old coins. | Те — старые монеты.', 'This is my collection. | Это моя коллекция.', 'Are those your keys? | Вон то — твои ключи?', 'That is a nice card. | Вон то — красивая открытка.'],
        g: ['{These|This} are my cards.', '{That|Those} is my key.', '{Those|That} are old coins.', '{This|These} is a sticker.', '{Are|Is} these your keys?'] },
      { t: 'Мой, его, её', th: `Чьё? Запомни пары:
I → **my** · you → **your** · he → **his** · she → **her** · it → **its** · we → **our** · they → **their**
> His name is Tom. = Его зовут Том.
> Their dog is black. = Их собака чёрная.
! **its** — «его» (о предмете, животном). **it's** = it is. Не путай!`,
        w: 'your=твой, ваш; his=его; her=её; its=его, её (о предмете); our=наш; their=их; big=большой; small=маленький',
        s: ['His name is Tom. | Его зовут Том.', 'Her bag is pink. | Её сумка розовая.', 'Our school is big. | Наша школа большая.', 'Their dog is black. | Их собака чёрная.', "What's your name? | Как тебя зовут?"],
        g: ['She is Kate. {Her|His|She} bag is red.', 'He is Tom. {His|Her} name is Tom.', 'We are pupils. {Our|Their} school is big.', 'They have got a dog. {Their|There} dog is white.', "The dog has got a ball. {Its|It's} ball is red."] },
    ]
  },
  {
    id: 'u3', title: 'Мой дом', sub: 'комнаты, there is / are, предлоги', color: '#E8590C',
    lessons: [
      { t: 'Комнаты', th: `**in** — «в»: in the kitchen — на кухне, in my bedroom — в моей спальне.
> Mum is in the kitchen. = Мама на кухне.
> We have got a house with a garden. = У нас дом с садом.
! flat — квартира (Британия), apartment — (Америка).`,
        w: 'house=дом; flat=квартира; bedroom=спальня; kitchen=кухня; bathroom=ванная; living room=гостиная; garden=сад; hall=прихожая',
        s: ['Mum is in the kitchen. | Мама на кухне.', 'My bedroom is small. | Моя спальня маленькая.', 'Is Dad in the garden? | Папа в саду?', 'We have got a house with a garden. | У нас дом с садом.', 'The bathroom is big. | Ванная большая.'],
        g: ['Mum is {in|on} the kitchen.', 'It is {a|an} big house.', 'My house {has|have} got a garden.', 'We {have|has} got a flat.'] },
      { t: 'There is / There are', th: `Говорим, что **где-то что-то есть**.
**There is** — один предмет, **There are** — много.
Переводим с конца:
> There is a sofa in the room. = В комнате есть диван.
> There are two beds. = Там две кровати.
Вопрос: **Is there…? / Are there…?** Нет: **There isn't / There aren't any…**`,
        w: 'sofa=диван; armchair=кресло; bed=кровать; table=стол; chair=стул; wardrobe=шкаф; lamp=лампа; carpet=ковёр',
        s: ['There is a sofa in the living room. | В гостиной есть диван.', 'There are two beds in my bedroom. | В моей спальне две кровати.', 'Is there a lamp on the table? | На столе есть лампа?', "There isn't a carpet. | Ковра нет.", 'Are there any chairs? | Там есть стулья?'],
        g: ['There {is|are} a wardrobe.', 'There {are|is} three chairs.', '{Is|Are} there a bed in the room?', "There {aren't|isn't} any lamps.", '{Are|Is} there two armchairs?'] },
      { t: 'Где? Предлоги', th: `> in = в
> on = на
> under = под
> behind = за, позади
> next to = рядом с
> in front of = перед
> between = между
> near = около`,
        w: 'in=в; on=на; under=под; behind=за, позади; next to=рядом с; in front of=перед; between=между; near=около',
        s: ['The cat is under the bed. | Кошка под кроватью.', 'The lamp is on the table. | Лампа на столе.', 'The chair is next to the desk. | Стул рядом с партой.', 'My bag is behind the door. | Мой рюкзак за дверью.', 'The sofa is between the armchairs. | Диван между креслами.'],
        g: ['The book is {on|in|under} the table. | Книга на столе.', 'The ball is {under|on|behind} the bed. | Мяч под кроватью.', 'The car is {in front of|behind|between} the house. | Машина перед домом.', 'The lamp is {between|next to|near} the two beds. | Лампа между двумя кроватями.', 'The dog is {behind|in front of|on} the door. | Собака за дверью.'] },
      { t: 'Первый, второй, третий', th: `**1st first · 2nd second · 3rd third**, дальше + th: fourth, sixth, seventh…
Исключения в написании: **fifth** (5), **ninth** (9), **twelfth** (12).
> I live on the third floor. = Я живу на третьем этаже.
! В Британии ground floor — первый этаж, а first floor — уже второй.`,
        w: 'first=первый; second=второй; third=третий; fourth=четвёртый; fifth=пятый; floor=этаж; live=жить; ground floor=первый этаж (в Британии)',
        s: ['I live on the third floor. | Я живу на третьем этаже.', 'My flat is on the fifth floor. | Моя квартира на пятом этаже.', "It's my first lesson. | Это мой первый урок.", 'Is the kitchen on the ground floor? | Кухня на первом этаже?', 'We live on the second floor. | Мы живём на втором этаже.'],
        g: ['the {first|one} floor', 'on the {third|three} floor', 'the {fifth|fiveth} day', 'the {ninth|nineth} lesson', 'I live {on|in} the fourth floor.'] },
      { t: 'Опиши свой дом', th: `Прилагательное стоит **перед** словом и **не меняется**: a big room, big rooms.
Если их два: сначала мнение, потом размер, потом возраст и цвет.
> a nice big room = красивая большая комната
> a cosy old house = уютный старый дом`,
        w: 'nice=красивый, милый; cosy=уютный; modern=современный; window=окно; door=дверь; but=но; room=комната; old=старый',
        s: ['My room is small but cosy. | Моя комната маленькая, но уютная.', 'There is a big window in the kitchen. | На кухне большое окно.', 'Our house is old. | Наш дом старый.', 'They have got a modern flat. | У них современная квартира.', 'The door is next to the window. | Дверь рядом с окном.'],
        g: ['two {big|bigs} windows', 'There {is|are} a cosy armchair.', 'It is {an|a} old house.', 'a {nice big|big nice} room'] },
    ]
  },
  {
    id: 'u4', title: 'Семья', sub: "родные, 's, внешность, can", color: '#D6336C',
    lessons: [
      { t: 'Моя семья', th: `О семье говорим через **have got** и **this is**:
> I have got a sister. = У меня есть сестра.
> This is my grandma. = Это моя бабушка.
! parents — родители (не «родственники»). Родственники — relatives.`,
        w: 'mum=мама; dad=папа; sister=сестра; brother=брат; parents=родители; grandma=бабушка; grandpa=дедушка; cousin=двоюродный брат, сестра',
        s: ['I have got a sister. | У меня есть сестра.', 'My parents are teachers. | Мои родители — учителя.', 'This is my grandma. | Это моя бабушка.', 'Have you got any cousins? | У тебя есть двоюродные братья или сёстры?', 'My brother has got a bike. | У моего брата есть велосипед.'],
        g: ['My brother {has|have} got a bike.', 'My parents {are|is} at home.', 'I {have|has} got two cousins.', '{Have|Has} you got a sister?'] },
      { t: "Чьё? 's", th: `«Чей» показываем через **'s**:
> Kate's bag = сумка Кейт
> Tom's sister = сестра Тома
Если слово уже кончается на -s (много людей) — только апостроф:
> my parents' room = комната моих родителей
! Но the children's room — children без -s, поэтому 's.`,
        w: 'son=сын; daughter=дочь; husband=муж; wife=жена; family=семья; baby=малыш; twins=близнецы; aunt=тётя',
        s: ["This is Kate's bag. | Это сумка Кейт.", "Tom's sister is ten. | Сестре Тома десять лет.", "My parents' car is red. | Машина моих родителей красная.", "Is that your mum's phone? | Это телефон твоей мамы?", "Anna is my aunt's daughter. | Анна — дочь моей тёти."],
        g: ["This is {Kate's|Kates|Kate} room.", "my {parents'|parent's|parents} house", "{Tom's|Toms} dog", "the {children's|childrens'} toys"] },
      { t: 'Внешность', th: `Рост и фигура — через **is**: She is tall.
Волосы и глаза — через **has got**: She has got blue eyes.
**hair** — без -s: long hair (не hairs!).
> She has got long dark hair. = У неё длинные тёмные волосы.
! Сначала длина, потом цвет: long dark hair.`,
        w: 'tall=высокий; short=невысокий, короткий; slim=стройный; hair=волосы; eyes=глаза; long=длинный; curly=кудрявый; fair=светлый (о волосах)',
        s: ['My sister is tall and slim. | Моя сестра высокая и стройная.', 'He has got short fair hair. | У него короткие светлые волосы.', 'She has got blue eyes. | У неё голубые глаза.', 'My dad has got curly hair. | У моего папы кудрявые волосы.', 'Is your brother tall? | Твой брат высокий?'],
        g: ['She has got long {hair|hairs}.', 'He {is|has got} tall.', 'He {has got|is} blue eyes.', 'She has got {long dark|dark long} hair.'] },
      { t: 'can — умею', th: `**can** + глагол = умею, могу. Одинаково для всех, без -s:
> I can swim. She can swim. = Я умею плавать. Она умеет плавать.
Нет: **can't** (= cannot). Вопрос: **Can you…?**
> Can you ride a bike? = Ты умеешь кататься на велосипеде?
> Yes, I can. / No, I can't.`,
        w: 'can=уметь, мочь; swim=плавать; ride=кататься, ездить; sing=петь; dance=танцевать; cook=готовить; draw=рисовать; well=хорошо',
        s: ['I can swim. | Я умею плавать.', "She can't sing. | Она не умеет петь.", 'Can you ride a bike? | Ты умеешь кататься на велосипеде?', 'My grandma can cook well. | Моя бабушка хорошо готовит.', 'We can dance. | Мы умеем танцевать.'],
        g: ['She can {swim|swims|to swim}.', '{Can|Does} you draw?', "He {can't|cans't|don't can} cook.", "No, I {can't|don't|am not}."] },
      { t: 'Характер', th: `Какой человек по характеру — **What is he like?**
Как выглядит — **What does he look like?**
> What is your brother like? — He's kind. = Какой твой брат? — Добрый.
> What does she look like? — She's tall. = Как она выглядит? — Высокая.`,
        w: 'kind=добрый; funny=весёлый, смешной; clever=умный; friendly=дружелюбный; lazy=ленивый; brave=смелый; shy=застенчивый; best friend=лучший друг',
        s: ['My best friend is funny and clever. | Мой лучший друг весёлый и умный.', 'What is your brother like? | Какой твой брат (по характеру)?', 'He is kind but a bit shy. | Он добрый, но немного застенчивый.', 'My cat is lazy. | Мой кот ленивый.', 'They are very friendly. | Они очень дружелюбные.'],
        g: ["What {is|does} he like? — He's kind.", "What {does|is} she look like? — She's tall.", 'My sister is very {clever|cleverly}.', 'They {are|is} friendly.'] },
    ]
  },
  {
    id: 'u5', title: 'Животные', sub: 'Present Simple, части тела', color: '#2B8A3E',
    lessons: [
      { t: 'Дикие животные', th: `**Present Simple** — то, что бывает всегда или обычно.
I / you / we / they + глагол как в словаре:
> Lions eat meat. = Львы едят мясо.
> Monkeys live in trees. = Обезьяны живут на деревьях.
> I like horses. = Мне нравятся лошади.`,
        w: 'lion=лев; elephant=слон; monkey=обезьяна; horse=лошадь; rabbit=кролик; bird=птица; fish=рыба; snake=змея',
        s: ['Lions eat meat. | Львы едят мясо.', 'Monkeys live in trees. | Обезьяны живут на деревьях.', 'Birds fly. | Птицы летают.', 'I like horses. | Мне нравятся лошади.', 'Fish swim in water. | Рыбы плавают в воде.'],
        g: ['Elephants {eat|eats} grass.', 'I {like|likes} rabbits.', 'Birds {fly|flies}.', 'They {live|lives} in Africa.', 'It is {an|a} elephant.'] },
      { t: 'Он / она + s', th: `С **he / she / it** к глаголу добавляем **-s**:
> A cat sleeps a lot. = Кошка много спит.
После s, sh, ch, x, o — **-es**: watches, goes, does.
Согласная + y → **-ies**: fly → flies.
! have → **has**.`,
        w: 'eat=есть; drink=пить; sleep=спать; run=бегать; climb=лазать; hunt=охотиться; catch=ловить; at night=ночью',
        s: ['A cat sleeps a lot. | Кошка много спит.', 'The monkey climbs trees. | Обезьяна лазает по деревьям.', 'My dog drinks water. | Моя собака пьёт воду.', 'A lion hunts at night. | Лев охотится ночью.', 'The bird flies high. | Птица летает высоко.'],
        g: ['A tiger {hunts|hunt}.', 'She {watches|watchs} TV.', 'It {flies|flys}.', 'He {goes|gos} to school.', 'The cat {has|haves} a ball.', 'My dog {catches|catchs} the ball.'] },
      { t: 'Вопросы: do / does', th: `Вопрос: **Do** you…? / **Does** he…?
Отрицание: **don't / doesn't** + глагол.
> Does a rabbit eat grass? = Кролик ест траву?
> It doesn't eat meat. = Он не ест мясо.
! После **does / doesn't** глагол уже **без -s**: Does she like…? (не likes)`,
        w: "do=(вопрос) делать; does=(вопрос с он, она); don't=не (я, ты, мы, они); doesn't=не (он, она); meat=мясо; grass=трава; water=вода; insects=насекомые",
        s: ['Do you like snakes? | Тебе нравятся змеи?', 'Does a rabbit eat grass? | Кролик ест траву?', "An elephant doesn't eat meat. | Слон не ест мясо.", "I don't like insects. | Я не люблю насекомых.", 'Yes, it does. | Да (ест).'],
        g: ['{Does|Do} a horse eat grass?', '{Do|Does} they live in Asia?', "It doesn't {eat|eats} meat.", "I {don't|doesn't} like snakes.", 'Does she {like|likes} cats?'] },
      { t: 'Части тела', th: `Описываем животное через **has got / have got**:
> A giraffe has got a long neck. = У жирафа длинная шея.
> A snake hasn't got legs. = У змеи нет ног.`,
        w: 'head=голова; leg=нога; tail=хвост; wing=крыло; ear=ухо; nose=нос; neck=шея; fur=мех',
        s: ['A giraffe has got a long neck. | У жирафа длинная шея.', 'Birds have got wings. | У птиц есть крылья.', 'My dog has got big ears. | У моей собаки большие уши.', "A snake hasn't got legs. | У змеи нет ног.", 'Elephants have got long noses. | У слонов длинные носы.'],
        g: ['A giraffe {has|have} got a long neck.', 'Birds {have|has} got wings.', "A snake {hasn't|haven't} got legs.", 'a cat with a long {tail|tails}'] },
      { t: 'Мой питомец', th: `Слова-подсказки Present Simple: **every day, usually, on Sundays**.
> I walk my dog every day. = Я выгуливаю собаку каждый день.
> My sister looks after the hamster. = Сестра ухаживает за хомяком.`,
        w: 'pet=питомец; feed=кормить; walk=выгуливать, гулять; every day=каждый день; cage=клетка; parrot=попугай; hamster=хомяк; look after=ухаживать',
        s: ['I walk my dog every day. | Я выгуливаю собаку каждый день.', 'My sister looks after the hamster. | Сестра ухаживает за хомяком.', 'Our parrot lives in a cage. | Наш попугай живёт в клетке.', 'Do you feed your cat? | Ты кормишь свою кошку?', "He doesn't walk his dog. | Он не выгуливает свою собаку."],
        g: ['My brother {feeds|feed} the fish every day.', '{Do|Does} you have a pet?', "She {doesn't|don't} have a parrot.", 'The hamster {lives|live} in a cage.'] },
    ]
  },
  {
    id: 'u6', title: 'Мой день', sub: 'время, распорядок, как часто', color: '#1971C2',
    lessons: [
      { t: 'Который час?', th: `> It's seven o'clock. = Семь часов (7:00).
> It's half past seven. = Половина восьмого (7:30).
> It's quarter past seven. = Четверть восьмого (7:15).
> It's quarter to eight. = Без четверти восемь (7:45).
! **past** — после часа, **to** — до следующего часа.`,
        w: "o'clock=ровно (о часах); half=половина; quarter=четверть; past=после; to=до; time=время; hour=час; minute=минута",
        s: ['What time is it? | Который час?', "It's eight o'clock. | Восемь часов.", "It's half past two. | Половина третьего.", "It's quarter to nine. | Без четверти девять.", "It's quarter past five. | Четверть шестого."],
        g: ["7:30 — It's {half past|half to} seven.", "8:45 — It's quarter {to|past} nine.", "6:15 — It's quarter {past|to} six.", "3:00 — It's three {o'clock|hours}."] },
      { t: 'Мой распорядок', th: `Время: **at** seven o'clock — в семь часов.
Части дня: **in** the morning, **in** the afternoon, **in** the evening, но **at** night.
> I get up at seven. = Я встаю в семь.
> She has breakfast in the morning. = Она завтракает утром.`,
        w: 'get up=вставать; have breakfast=завтракать; have lunch=обедать; have dinner=ужинать; do homework=делать уроки; go to bed=ложиться спать; have a shower=принимать душ; morning=утро',
        s: ['I get up at seven. | Я встаю в семь.', 'She has breakfast at half past seven. | Она завтракает в половине восьмого.', 'We go to school in the morning. | Мы ходим в школу утром.', 'He does his homework in the evening. | Он делает уроки вечером.', 'I go to bed at ten. | Я ложусь спать в десять.'],
        g: ["I get up {at|in|on} 7 o'clock.", 'I read {in|at} the morning.', 'Owls hunt {at|in} night.', 'She {has|have} lunch at two.', 'He {does|do} his homework.'] },
      { t: 'Как часто?', th: `> always = всегда
> usually = обычно
> often = часто
> sometimes = иногда
> never = никогда
Ставим **перед** глаголом: I **always** get up early.
Но **после** am / is / are: He is **never** late.`,
        w: 'always=всегда; usually=обычно; often=часто; sometimes=иногда; never=никогда; early=рано; football=футбол; watch TV=смотреть телевизор',
        s: ['I always have breakfast. | Я всегда завтракаю.', 'She is never late. | Она никогда не опаздывает.', 'We often play football. | Мы часто играем в футбол.', 'He sometimes watches TV. | Он иногда смотрит телевизор.', 'They usually get up early. | Они обычно встают рано.'],
        g: ['I {always get|get always} up early.', 'She {is never|never is} late.', 'He {often plays|plays often} football.', 'We {usually have|have usually} lunch at one.'] },
      { t: 'Профессии', th: `Профессия всегда с **a / an**:
> She is a doctor. = Она врач.
> He is an engineer. = Он инженер.
Где работает: **works in** a hospital, **on** a farm.`,
        w: 'doctor=врач; vet=ветеринар; pilot=пилот; driver=водитель; nurse=медсестра; police officer=полицейский; farmer=фермер; work=работать',
        s: ['My mum is a doctor. | Моя мама — врач.', 'He works in a hospital. | Он работает в больнице.', 'A vet helps animals. | Ветеринар помогает животным.', 'My dad is a driver. | Мой папа — водитель.', 'Is your uncle a pilot? | Твой дядя — пилот?'],
        g: ['He is {a|an} pilot.', 'She is {an|a} engineer.', 'My dad {works|work} on a farm.', '{Does|Do} your mum work in a hospital?'] },
      { t: 'Выходные', th: `Вопрос с вопросительным словом:
**вопрос. слово + do / does + кто + глагол**
> What do you do at the weekend? = Что ты делаешь на выходных?
> When does he get up? = Когда он встаёт?
> Where does your dad work? = Где работает твой папа?`,
        w: 'weekend=выходные; at the weekend=на выходных; meet=встречать; visit=навещать, посещать; go shopping=ходить по магазинам; relax=отдыхать; free time=свободное время; when=когда',
        s: ['What do you do at the weekend? | Что ты делаешь на выходных?', 'I meet my friends. | Я встречаюсь с друзьями.', 'When does he get up? | Когда он встаёт?', "She doesn't watch TV. | Она не смотрит телевизор.", 'We visit our grandma on Sundays. | Мы навещаем бабушку по воскресеньям.'],
        g: ['What {do|does} you do at the weekend?', 'When {does|do} she go shopping?', "He doesn't {play|plays} football.", 'Where {does|do} your dad work?'] },
    ]
  },
  {
    id: 'u7', title: 'Погода и одежда', sub: 'Present Continuous', color: '#0C8599',
    lessons: [
      { t: 'Погода', th: `Погоду описываем через **It's**:
> What's the weather like? = Какая погода?
> It's sunny and hot. = Солнечно и жарко.
> It's cold and windy. = Холодно и ветрено.`,
        w: 'weather=погода; sunny=солнечно; rainy=дождливо; cloudy=облачно; windy=ветрено; hot=жарко; cold=холодно; warm=тепло',
        s: ["What's the weather like today? | Какая сегодня погода?", "It's sunny and hot. | Солнечно и жарко.", "It's cold and windy. | Холодно и ветрено.", 'Is it rainy in London? | В Лондоне дождливо?', "It's warm today. | Сегодня тепло."],
        g: ["{It's|It} sunny.", "What's the weather {like|likes}?", "It's very {cold|colds} today.", '{Is|Does} it windy?'] },
      { t: 'Времена года', th: `Времена года и месяцы — с предлогом **in**:
> in winter = зимой
> in July = в июле
Месяцы — с большой буквы.`,
        w: 'spring=весна; summer=лето; autumn=осень; winter=зима; season=время года; month=месяц; year=год; birthday=день рождения',
        s: ["It's cold in winter. | Зимой холодно.", 'My birthday is in May. | Мой день рождения в мае.', 'Summer is my favourite season. | Лето — моё любимое время года.', 'It often rains in autumn. | Осенью часто идёт дождь.', 'There are twelve months in a year. | В году двенадцать месяцев.'],
        g: ['{in|on|at} winter', 'My birthday is {in|on} July.', 'It is cold in {December|december}.', 'There {are|is} four seasons.'] },
      { t: 'Одежда', th: `**wear** — носить (одежду). **put on** — надевать.
jeans, shorts, trousers — всегда во множественном:
> My jeans are new. = Мои джинсы новые.
> Put on your hat! = Надень шапку!`,
        w: 'coat=пальто; jacket=куртка; hat=шапка; scarf=шарф; gloves=перчатки; boots=ботинки, сапоги; T-shirt=футболка; wear=носить',
        s: ['I wear a coat in winter. | Зимой я ношу пальто.', 'Put on your hat! | Надень шапку!', 'My jeans are new. | Мои джинсы новые.', 'She wears shorts in summer. | Летом она носит шорты.', 'Where are my gloves? | Где мои перчатки?'],
        g: ['My shorts {are|is} white.', 'Put {on|in} your scarf.', 'He {wears|wear} a jacket.', '{Where are|Where is} my boots?'] },
      { t: 'Что происходит сейчас', th: `**Present Continuous** — то, что идёт прямо **сейчас**.
**am / is / are + глагол-ing**
> It is raining now. = Сейчас идёт дождь.
> I'm wearing a hat. = На мне шапка.
Подсказки: now, at the moment, Look!, Listen!
! write → writ**ing** (e уходит), swim → swi**mm**ing (удваиваем).`,
        w: 'now=сейчас; at the moment=в данный момент; rain=идти (о дожде); snow=идти (о снеге); look=смотреть; wait=ждать; bus=автобус; play=играть',
        s: ['It is raining now. | Сейчас идёт дождь.', "I'm wearing a hat. | На мне шапка.", "Look! It's snowing! | Смотри! Идёт снег!", 'They are waiting for the bus. | Они ждут автобус.', 'She is reading at the moment. | Она сейчас читает.'],
        g: ['It {is raining|rains} now.', 'I {am|is} wearing a coat.', 'Look! The children {are|is} playing.', 'She is {writing|writeing}.', 'He is {swimming|swiming}.'] },
      { t: 'Обычно или сейчас?', th: `**Обычно** — Present Simple. **Сейчас** — Present Continuous.
> I usually wear jeans. = Обычно я ношу джинсы.
> Today I'm wearing a dress. = Сегодня я в платье.
Вопрос: **Are you wearing…?** Нет: **I'm not wearing…**`,
        w: 'umbrella=зонт; sunglasses=солнечные очки; raincoat=плащ; cap=кепка; take=брать; dress=платье; usually=обычно; right now=прямо сейчас',
        s: ["Today I'm wearing a cap. | Сегодня я в кепке.", 'Are you taking an umbrella? | Ты берёшь зонт?', "He isn't wearing sunglasses. | Он не в солнечных очках.", 'She usually walks to school. | Она обычно ходит в школу пешком.', "It doesn't often snow here. | Здесь нечасто идёт снег."],
        g: ['She usually {walks|is walking} to school.', 'Look! She {is running|runs}.', 'Every day I {get up|am getting up} at seven.', 'Right now we {are having|have} lunch.', '{Are|Do} you wearing a raincoat?'] },
    ]
  },
  {
    id: 'u8', title: 'Еда и праздники', sub: 'some / any, much / many', color: '#C2255C',
    lessons: [
      { t: 'Еда', th: `**Исчисляемые** — можно посчитать: an apple, two eggs.
**Неисчисляемые** — нельзя: milk, bread, cheese, water, rice. С ними нет a и нет -s.
> a glass of milk = стакан молока
> a piece of cheese = кусочек сыра`,
        w: 'bread=хлеб; cheese=сыр; milk=молоко; juice=сок; chicken=курица; rice=рис; soup=суп; cake=торт',
        s: ['I like cheese. | Я люблю сыр.', 'Can I have a glass of milk? | Можно стакан молока?', 'We have soup for lunch. | На обед у нас суп.', 'There is some bread on the table. | На столе есть хлеб.', 'Two apples, please. | Два яблока, пожалуйста.'],
        g: ['a glass of {milk|milks}', 'two {apples|apple}', 'I have got {an|a} egg.', "I'd like some {bread|breads}."] },
      { t: 'some и any', th: `**some** — в утверждениях: There is some milk.
**any** — в вопросах и отрицаниях: Is there any milk? There isn't any milk.
В просьбах — **some**:
> Can I have some juice? = Можно мне сока?`,
        w: 'some=немного, несколько; any=сколько-нибудь; sugar=сахар; butter=масло; tomato=помидор; potato=картофель; fridge=холодильник; buy=покупать',
        s: ['There is some butter in the fridge. | В холодильнике есть масло.', 'Are there any tomatoes? | Есть помидоры?', "We haven't got any sugar. | У нас нет сахара.", 'Can I have some juice, please? | Можно мне сока, пожалуйста?', "Let's buy some potatoes. | Давай купим картошки."],
        g: ['There is {some|any} cheese.', 'Are there {any|some} eggs?', "We haven't got {any|some} milk.", 'Can I have {some|any} water, please?', 'two {tomatoes|tomatos}'] },
      { t: 'Сколько?', th: `**many** — с исчисляемыми: many apples. **How many?**
**much** — с неисчисляемыми: much milk. **How much?**
**a lot of** — с любыми.
> How much is it? = Сколько это стоит?`,
        w: 'how many=сколько (штук); how much=сколько (чего-то), сколько стоит; a lot of=много; many=много (штук); much=много (чего-то); bottle=бутылка; need=нуждаться, нужно; sweets=конфеты',
        s: ['How many eggs do we need? | Сколько яиц нам нужно?', 'How much milk is there? | Сколько там молока?', "There aren't many apples. | Яблок немного.", 'We have got a lot of sweets. | У нас много конфет.', 'How much is it? | Сколько это стоит?'],
        g: ['How {many|much} apples?', 'How {much|many} juice?', "There isn't {much|many} rice.", 'There are {a lot of|much} eggs.', "There aren't {many|much} cakes."] },
      { t: 'Праздники', th: `Даты — с **on**: on 31st December, on my birthday.
> Happy birthday! = С днём рождения!
> Happy New Year! = С Новым годом!
> Thank you for the present! = Спасибо за подарок!`,
        w: 'party=вечеринка, праздник; present=подарок; celebrate=праздновать; candles=свечи; invite=приглашать; guests=гости; holiday=праздник, каникулы; New Year=Новый год',
        s: ['Happy birthday! | С днём рождения!', 'We celebrate New Year at home. | Мы празднуем Новый год дома.', 'I invite my friends to my party. | Я приглашаю друзей на праздник.', 'There are ten candles on the cake. | На торте десять свечей.', 'Thank you for the present! | Спасибо за подарок!'],
        g: ['{on|in} my birthday', '{on|in} 31st December', 'Thank you {for|on} the present.', 'We {celebrate|celebrates} New Year at home.'] },
      { t: 'В кафе', th: `Вежливо: **I'd like** (= I would like) — я бы хотел.
> I'd like a pizza, please. = Я бы хотел пиццу.
> Would you like some tea? — Yes, please. / No, thank you.
! I'd like звучит вежливее, чем I want.`,
        w: "I'd like=я бы хотел; menu=меню; salad=салат; ice cream=мороженое; pizza=пицца; dessert=десерт; bill=счёт; tea=чай",
        s: ["I'd like a pizza, please. | Я бы хотел пиццу, пожалуйста.", 'Would you like some salad? | Хочешь салата?', 'Can I have the menu, please? | Можно меню, пожалуйста?', 'Yes, please. | Да, пожалуйста.', 'Can we have the bill, please? | Можно счёт, пожалуйста?'],
        g: ["I'd {like|likes} an ice cream.", '{Would|Do} you like some tea? — Yes, please.', 'Can I {have|has} the menu?', 'I {would|will} like a salad.'] },
    ]
  },
  {
    id: 'u9', title: 'Город и вчера', sub: 'места, was / were, Past Simple', color: '#5F3DC4',
    lessons: [
      { t: 'Места в городе', th: `Как пройти:
> Where is the library? = Где библиотека?
> Go straight on. = Идите прямо.
> Turn left / right. = Поверните налево / направо.
> It's next to the bank. = Она рядом с банком.`,
        w: 'cinema=кинотеатр; library=библиотека; museum=музей; park=парк; hospital=больница; supermarket=супермаркет; bank=банк; street=улица',
        s: ['Where is the museum? | Где музей?', 'The library is next to the park. | Библиотека рядом с парком.', 'Go straight on and turn left. | Идите прямо и поверните налево.', 'Is there a cinema near here? | Здесь рядом есть кинотеатр?', 'The bank is in this street. | Банк на этой улице.'],
        g: ['Turn {left|leave}.', 'Go straight {on|in}.', 'Is there {a|an} supermarket?', "{Where's|Where} the bank?"] },
      { t: 'was / were', th: `Прошлое от «быть»: am / is → **was**, are → **were**.
> I was at home yesterday. = Вчера я был дома.
> They were tired. = Они устали.
Нет: **wasn't / weren't**. Вопрос: **Were you…? — Yes, I was.**`,
        w: 'yesterday=вчера; last week=на прошлой неделе; ago=назад; was=был (я, он, она); were=были (ты, мы, они); tired=уставший; at home=дома; zoo=зоопарк',
        s: ['I was at the cinema yesterday. | Вчера я был в кинотеатре.', 'We were in the park. | Мы были в парке.', "She wasn't at school last week. | На прошлой неделе её не было в школе.", 'Were you tired? | Ты устал?', 'It was cold two days ago. | Два дня назад было холодно.'],
        g: ['I {was|were} at home.', 'They {were|was} at the museum.', '{Were|Was} you at school yesterday?', "It {wasn't|weren't} hot.", 'He {was|were} tired.'] },
      { t: 'Вчера: -ed', th: `Прошедшее действие: глагол + **-ed**: play → played, watch → watched.
На -e → + d: dance → danced.
Согласная + y → -ied: study → studied.
Короткие слова удваивают букву: stop → stopped.
Для всех лиц одинаково. Подсказки: yesterday, last week, ago.`,
        w: 'played=играл; visited=посетил; watched=смотрел; started=начался; finished=закончил; helped=помог; stayed=остался; studied=учил',
        s: ['I played football yesterday. | Вчера я играл в футбол.', 'We visited the museum last week. | На прошлой неделе мы ходили в музей.', 'She watched a film. | Она посмотрела фильм.', 'The lesson started at nine. | Урок начался в девять.', 'He helped his mum. | Он помог маме.'],
        g: ['Yesterday I {played|play} tennis.', 'She {studied|studyed} English.', 'We {stopped|stoped} the car.', 'They {danced|danceed}.', 'He {watched|watches} TV last night.'] },
      { t: 'Покупки', th: `> How much is this T-shirt? = Сколько стоит эта футболка?
> How much are these jeans? = Сколько стоят эти джинсы?
> Can I try it on? = Можно примерить?
> It's too expensive. = Слишком дорого.
! money — неисчисляемое: much money.`,
        w: 'shop=магазин; cheap=дешёвый; expensive=дорогой; money=деньги; price=цена; pay=платить; size=размер; try on=примерять',
        s: ['How much is this jacket? | Сколько стоит эта куртка?', "It's too expensive. | Слишком дорого.", 'Can I try it on? | Можно примерить?', "I haven't got much money. | У меня немного денег.", 'These boots are cheap. | Эти ботинки дешёвые.'],
        g: ['How much {is|are} this hat?', 'How much {are|is} these jeans?', "I haven't got {much|many} money.", 'Can I try it {on|in}?'] },
      { t: 'Вопросы в прошлом', th: `Вопрос: **Did** you…? Нет: **didn't** + глагол.
После did / didn't глагол — **без -ed**:
> Did you watch the film? = Ты смотрел фильм?
> I didn't call him. = Я ему не звонил.
> Yes, I did. / No, I didn't.`,
        w: "did=(вопрос в прошлом); didn't=не (в прошлом); last night=вчера вечером; enjoy=получать удовольствие; call=звонить; clean=убирать; film=фильм; room=комната",
        s: ['Did you enjoy the film? | Тебе понравился фильм?', "I didn't call him. | Я ему не звонил.", 'Did she clean her room? | Она убрала свою комнату?', "We didn't watch TV last night. | Вчера вечером мы не смотрели телевизор.", 'Yes, I did. | Да.'],
        g: ['Did you {watch|watched} TV?', "I didn't {play|played} football.", '{Did|Do} they visit you yesterday?', "She {didn't|doesn't} call me last night."] },
    ]
  },
  {
    id: 'u10', title: 'Каникулы', sub: 'неправильные глаголы, планы, must', color: '#F08C00',
    lessons: [
      { t: 'Неправильные глаголы', th: `Некоторые глаголы не берут -ed — их форму запоминаем:
> go → went = идти → пошёл
> see → saw = видеть → видел
> have → had = иметь → имел
> buy → bought = покупать → купил
> eat → ate = есть → ел
! В вопросах и с didn't — снова обычная форма: Did you go? I didn't see.`,
        w: 'went=пошёл, поехал; saw=видел; had=имел, было; bought=купил; ate=ел; made=сделал; sea=море; great=отличный',
        s: ['We went to the sea last summer. | Прошлым летом мы ездили на море.', 'I saw a dolphin! | Я видел дельфина!', 'We had a great time. | Мы отлично провели время.', 'She bought a present. | Она купила подарок.', "They didn't go to the beach. | Они не ходили на пляж."],
        g: ['Yesterday we {went|goed} to the park.', 'I {saw|seed} a film.', 'She {bought|buyed} a hat.', 'Did you {see|saw} the sea?', 'We {had|haved} pizza.'] },
      { t: 'Путешествия', th: `Как едем: **by** plane, **by** train, **by** car, но **on foot** — пешком.
Ещё неправильные:
> come → came = приходить → пришёл
> fly → flew = лететь → летел
> swim → swam = плавать → плавал
> take → took = брать → взял`,
        w: 'plane=самолёт; train=поезд; beach=пляж; travel=путешествовать; came=пришёл, приехал; flew=летел; swam=плавал; took=взял',
        s: ['We travelled by train. | Мы путешествовали на поезде.', 'They flew to Spain. | Они полетели в Испанию.', 'I swam in the sea every day. | Я каждый день плавал в море.', 'He came home late. | Он пришёл домой поздно.', 'She took a lot of photos. | Она сделала много фото.'],
        g: ['We went there {by|on} plane.', 'I came {on|by} foot.', 'We {flew|flied} to Italy.', 'He {took|taked} his camera.', 'They {swam|swimmed} in the sea.'] },
      { t: 'Планы: going to', th: `Планы: **am / is / are + going to + глагол**.
> I'm going to visit my grandma. = Я собираюсь навестить бабушку.
> Are you going to swim? = Ты будешь плавать?
Подсказки: tomorrow, next week, next summer.`,
        w: 'going to=собираться; tomorrow=завтра; next week=на следующей неделе; plan=план; ticket=билет; holidays=каникулы; go camping=пойти в поход; next summer=следующим летом',
        s: ["I'm going to visit my grandma. | Я собираюсь навестить бабушку.", 'We are going to buy tickets tomorrow. | Завтра мы купим билеты.', 'Are you going to go camping? | Ты пойдёшь в поход?', "She isn't going to travel next summer. | Следующим летом она не поедет путешествовать.", 'What are you going to do? | Что ты собираешься делать?'],
        g: ['I {am|is} going to swim.', 'They are going {to|for} visit Spain.', '{Is|Are} he going to buy a ticket?', "We're going to {travel|travelling} next week."] },
      { t: 'Будущее: will', th: `**will** + глагол — предсказание или решение прямо сейчас:
> I think it will rain. = Думаю, пойдёт дождь.
> I'll help you! = Я помогу тебе!
**won't** = will not. Для всех лиц одинаково.`,
        w: "will=будет (будущее); won't=не будет; maybe=может быть; I think=я думаю; probably=вероятно; later=позже; help=помогать; future=будущее",
        s: ['I think it will be sunny tomorrow. | Думаю, завтра будет солнечно.', "I'll help you! | Я тебе помогу!", 'Maybe we will go to the sea. | Может, мы поедем на море.', "She won't be late. | Она не опоздает.", 'Will you call me? | Ты мне позвонишь?'],
        g: ['It will {be|is} cold.', "She {won't|willn't} come.", '{Will|Do} you help me?', 'I think he {will|wills} win.'] },
      { t: 'Правила: must', th: `**must** + глагол — должен, обязательно.
**mustn't** — нельзя.
> You must be careful. = Ты должен быть осторожен.
> You mustn't swim here. = Здесь нельзя плавать.
! Как и can — без -s и без to: He must go.`,
        w: "must=должен; mustn't=нельзя; rule=правило; sign=знак, табличка; careful=осторожный; touch=трогать; passport=паспорт; quiet=тихий",
        s: ['You must be careful. | Ты должен быть осторожен.', "You mustn't swim here. | Здесь нельзя плавать.", 'We must take our passports. | Мы должны взять паспорта.', "You mustn't touch the animals. | Нельзя трогать животных.", 'Read the sign, please. | Прочитай табличку, пожалуйста.'],
        g: ['He {must|musts} go now.', "You {mustn't|don't must} feed the animals.", 'We must {take|to take} our tickets.', "You {mustn't|must} touch it! It's hot."] },
    ]
  },
  ]
};
// какая тема справочника грамматики показывается в уроке (модуль.урок → тема)
window.COURSE[5].gr = {
  'u0.l0': 'be', 'u0.l1': 'be', 'u0.l2': 'be', 'u0.l3': 'articles', 'u0.l4': 'demonstratives',
  'u1.l0': 'be', 'u1.l1': 'be', 'u1.l2': 'be', 'u1.l3': 'imperative', 'u1.l4': 'prepositions',
  'u2.l0': 'be', 'u2.l1': 'have-got', 'u2.l2': 'plurals', 'u2.l3': 'demonstratives', 'u2.l4': 'possessive',
  'u3.l0': 'prepositions', 'u3.l1': 'there-is', 'u3.l2': 'prepositions',
  'u4.l0': 'have-got', 'u4.l1': 'possessive', 'u4.l2': 'have-got', 'u4.l3': 'can', 'u4.l4': 'questions',
  'u5.l0': 'present-simple', 'u5.l1': 'present-simple', 'u5.l2': 'present-simple', 'u5.l3': 'have-got', 'u5.l4': 'present-simple',
  'u6.l1': 'prepositions', 'u6.l2': 'frequency', 'u6.l3': 'articles', 'u6.l4': 'questions',
  'u7.l0': 'be', 'u7.l1': 'prepositions', 'u7.l3': 'present-continuous', 'u7.l4': 'ps-pc',
  'u8.l0': 'countable', 'u8.l1': 'countable', 'u8.l2': 'countable', 'u8.l3': 'prepositions',
  'u9.l0': 'imperative', 'u9.l1': 'past-be', 'u9.l2': 'past-simple', 'u9.l3': 'countable', 'u9.l4': 'past-simple',
  'u10.l0': 'past-simple', 'u10.l1': 'past-simple', 'u10.l2': 'going-to', 'u10.l3': 'will', 'u10.l4': 'must-have-to',
};
