/* Игротека лидера — общие промты и разбор ответов.
   Один файл для страницы (браузер) и для сервера-посредника (Node.js). */
(function (root) {
"use strict";

const OPTS = {
  age: ["11–13 лет","14–16 лет","17+","Смешанная группа"],
  size: ["5–10 человек","15–30 человек","30–80+ человек"],
  time: ["3–5 минут на игру","10–15 минут на игру","Блок 20–30 минут"],
  novelty: ["Классика","Свежий поворот","Совсем новое"]
};
const DEFAULTS = {novelty:"Свежий поворот"};
const MAX_TOTAL = 8;

const KINDS = [
  {cls:"k1", label:"Ледокол", need:"быстрый ледокол 3–5 минут, без реквизита или только стулья; цель — разговорить и растопить неловкость за 2 минуты"},
  {cls:"k2", label:"Командный драйв", need:"командный драйв и смех 7–12 минут, баттл команд; реквизит — стаканчики, бумага, скотч или шарики; цель — сбросить школьную усталость"},
  {cls:"k3", label:"Блеф и интуиция", need:"социальная игра на блеф, вычисление «шпиона», чтение эмоций или необычные факты друг о друге, 10–15 минут, сидя"},
  {cls:"k4", label:"Со смартфонами", need:"интерактив со смартфонами ребят или экраном 5–10 минут: фото-охота по залу, битва стикеров, музыка наоборот, поиск по эмодзи"},
  {cls:"k5", label:"Игра-метафора", need:"игра-метафора 10–15 минут, которая телом и действием показывает духовную истину темы и даёт спикеру завязку для проповеди; если темы нет — игра на единство и поддержку в команде"}
];

const NOVELTY = {
  "Классика": "Бери проверенные игры молодёжных лагерей, скаутов и тимбилдингов, но не самые затёртые: из большого запаса классики выбирай то, во что подростки вряд ли играли сто раз.",
  "Свежий поворот": "Не выдавай затёртую классику как есть. Бери рабочую механику и делай с ней что-то новое: соедини две механики, поменяй цель, добавь роли или неожиданный финальный раунд. Игра должна звучать свежо, но правила обязаны сработать в реальном зале с первого раза.",
  "Совсем новое": "Придумай оригинальные игры со своей механикой, которых нет в стандартных сборниках. Мысленно прогони каждую на этой группе: объясняется ли за 45 секунд, нет ли хаоса, не будет ли кому-то неловко. Оригинально, но играбельно."
};
const OVERUSED = "Шпион, Мафия, Крокодил, Минное поле (ведение вслепую голосом), Две правды и одна ложь, Пересядь если / Ветер дует для тех, кто…, Испорченный телефон, Подмигивающий убийца, Снежный ком с именами, Вопрос-ответ «Я никогда не…», Крестики-нолики людьми, Переверни стакан, Фото-охота по списку, Башня из спагетти и зефира, Падение на руки команды";
const SEEDS = [
  ["молча выстроиться в линию по признаку (день рождения, сколько минут ехал сюда) без слов, только жестами","занять сторону зала: «шаурма или пицца», а потом вопросы с подвохом","счёт до 20 всей группой по одному голосу: двое сказали одновременно — заново","история по одному слову от каждого по кругу","за 60 секунд найти тройку, у которой три общих факта","камень-ножницы-бумага, где проигравший становится болельщиком победителя, и финал идёт под рёв двух толп","угадать, сколько человек в зале поднимет руку на вопрос, и встать ближе к своему числу","ответы только вопросами: кто ответил утверждением — выбывает","ведущий называет предмет, все за 3 секунды показывают позой, как его используют, совпадения дают очки"],
  ["башня из листов А4 без скотча и клея: выше всех за 5 минут","бумажные самолётики в мишень из скотча на полу, каждый раунд новое правило броска","пирамида из стаканчиков, которую строят резинкой с нитками, не касаясь стаканов руками","N шариков в воздухе всей командой, каждые 30 секунд +1 шарик","мост из одного листа бумаги, который держит больше всех телефонов","один видит картинку и описывает, команда рисует не глядя, сравнение с оригиналом","бумажные снежки: два поля, за минуту перекинуть всё на сторону соперника","передать стаканчик через всю команду, каждый раунд команда сама придумывает способ быстрее","скотч-лабиринт на полу: пройти командой, держась за одну общую бумажную ленту, чтобы не порвать"],
  ["анонимные необычные факты на бумажках, угадать автора, очки за обманутых","редкое настоящее слово: все пишут фейковые определения, голосуем за верное","невидимый лидер задаёт движения, водящий в центре ищет, за кем повторяют","двое объясняют термин, один реально знает, другой блефует — зал голосует","предметы из карманов в общий пакет, угадать владельца по одному предмету","каждый получает тайную мини-миссию на всю встречу (заставить кого-то сказать слово «носок»), в конце разоблачения","все пишут ассоциацию на слово, цель — совпасть с большинством","цепочка рисунок → описание → рисунок по листу, смотрим, во что превратилось","угадать, кто в группе ответил «да» на анонимный вопрос, по лицам"],
  ["ведущий показывает песню эмодзи на экране, команды угадывают","макро-фото: снять предмет в зале сверхкрупно, остальные угадывают что это","за 60 секунд снять 5 предметов одного оттенка","общий чат: тема, каждый кидает стикер, голосуем реакциями","10-секундное видео без слов — трейлер известной библейской истории, зал угадывает","записать звук предмета в зале на диктофон, остальные угадывают на слух","воссоздать командой известную картину или мем на фото","опрос в чате в реальном времени: угадать проценты до того, как их покажут","таймер на телефоне: остановить ровно на 10.00 секундах вслепую"],
  ["пазл: у каждого по куску, картинку не видел никто, собрать молча","«лёгкая палка»: длинная палка лежит на пальцах всей команды, опустить на пол, не потеряв контакт","фонарик телефона в тёмной комнате: найти предметы, когда свет есть только у одного","рюкзак, который за каждое «а что если…» тяжелеет книгами","паутина из скотча или нитки между людьми: кто держит связи, что будет, если отпустить","нарисовать фигуру, глядя только в отражение в экране телефона","ценник: команды назначают цену странным предметам, потом — история каждого предмета","пирамида стаканов, у которой убирают нижний — что держит всё","построить фигуру без лидера, потом с одним, кто видит план"]
];
const TWISTS = ["правило меняется в каждом раунде","у одного игрока тайная роль со своей целью","выигрывает самый точный, а не самый быстрый","все вместе играют против ведущего, а не друг против друга","ограничение: молча / одной рукой / только вопросами","в последнем раунде неожиданный поворот, который меняет смысл всей игры","очки можно отдавать другой команде","проигравшие не выбывают, а становятся помехой или помощниками"];

function plural(n, one, few, many){ const a=n%10, b=n%100; return (a===1&&b!==11)?one:(a>=2&&a<=4&&(b<12||b>14))?few:many; }
function slotsFrom(c){ const s=[]; c.forEach((n,k)=>{ for(let j=0;j<n;j++) s.push(k); }); return s; }
function pick(arr, n){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a.slice(0,n); }

const SEED_INTRO = " Для вдохновения (возьми одну идею и переосмысли или придумай своё): ";
function seedLine(k){ return SEED_INTRO + pick(SEEDS[k],3).join("; ") + "."; }
function seedsFor(slots){
  const pools = SEEDS.map(a=>pick(a,a.length)), pos = [0,0,0,0,0];
  return slots.map(k=>{ const out=[]; for(let j=0;j<3;j++){ out.push(pools[k][pos[k] % pools[k].length]); pos[k]++; } return SEED_INTRO + out.join("; ") + "."; });
}
function variety(b, hist, one){
  const nov = b.novelty || DEFAULTS.novelty, parts = [];
  if(nov !== "Классика") parts.push("Не используй эти затёртые игры и их копии под другим названием: " + OVERUSED + ".");
  const h = (hist||[]).slice(-40);
  if(h.length) parts.push("Эти игры лидер уже получал — не повторяй ни их, ни их механику под новым названием: " + h.join("; ") + ".");
  if(nov !== "Классика" && !one) parts.push("Хотя бы в двух играх используй такие повороты: " + pick(TWISTS,2).join("; ") + ".");
  if(!one) parts.push("Все игры подборки должны быть на разных механиках, даже если они одного типа: не делай вариации одной и той же игры.");
  return parts.join("\n");
}

function skill(b){
  return `Ты — опытный координатор молодёжных программ и лагерный ведущий с 15-летним стажем, знаешь подростковую психологию изнутри. Подбираешь игры для подросткового служения в церкви.

Законы:
- Никакого «кринжа» и детского сада: подростки панически боятся выглядеть глупо перед сверстниками. Никаких «похлопайте как зайчики», неловких объятий, унизительных конкурсов.
- ${NOVELTY[b.novelty] || NOVELTY[DEFAULTS.novelty]}
- Никаких игр с кучей редких предметов или запутанными правилами, которые хороши только на бумаге.
- Минимальный подручный реквизит: пластиковые стаканчики, скотч, бумага А4, маркеры, стулья, смартфоны ребят или вообще ничего.
- Учитывай возраст, число людей, время и помещение: правила должны реально работать в таком зале с таким количеством ребят.
- Если упоминаешь Библию — только то, что действительно есть в каноническом тексте. Не выдумывай цитат; ссылку на стих давай, только если уверен.
- Пиши по-русски, живым простым языком, без канцелярита.`;
}
function briefText(b){
  return `Вводные:
- Возраст: ${b.age}
- Сколько человек: ${b.size}
- Время: ${b.time}
- Насколько необычно: ${b.novelty || DEFAULTS.novelty}
- Тема проповеди: ${b.theme || "не указана — делаем сплочение и драйв"}
- Помещение: ${b.room || "не указано"}
- Пожелания лидера: ${b.wish || "нет"}`;
}
const GAME_SHAPE = `{"slot":1,"title":"Название","time":"3–5 минут | все вместе | стоя в кругу","props":"Реквизит одной строкой","rules":["шаг 1","шаг 2","шаг 3"],"secret":"Почему подросткам не стыдно участвовать и что снимает барьер, 1–2 предложения","bridge":"Реплика ведущего на ~30 секунд для перехода к теме проповеди"}`;

function promptAll(b, slots, hist){
  const n = slots.length, seeds = seedsFor(slots);
  return skill(b) + "\n\n" + briefText(b) + `

Подбери ровно ${n} ${plural(n,"игру","игры","игр")}, по одной на каждый слот, в этом порядке:
` + slots.map((k,i)=>`${i+1}. ${KINDS[k].label}: ${KINDS[k].need}.` + seeds[i]).join("\n") + `

` + variety(b, hist) + `

rules — 3–6 коротких понятных шагов. bridge — живая реплика ведущего; если темы нет, мостик к мысли о единстве и поддержке друг друга.

Ответь строками JSON, ровно ${n} шт. Каждая строка — один JSON-объект вида
${GAME_SHAPE}
slot от 1 до ${n} по порядку. Никакого markdown, никаких пояснений, только ${n} строк JSON.`;
}
function promptOne(b, kind, slotNo, current, others, hist){
  return skill(b) + "\n\n" + briefText(b) + `

Нужна одна игра для слота ${slotNo} — ${KINDS[kind].label}: ${KINDS[kind].need}.${seedLine(kind)}
${variety(b, hist, true)}
${current ? "Предложи другую, не «" + current + "»." : ""}${others && others.length ? " В подборке уже есть: " + others.join(", ") + " — не повторяй их." : ""}
rules — 3–6 коротких шагов.
Ответь только одним JSON-объектом вида
${GAME_SHAPE.replace('"slot":1','"slot":'+slotNo)}`;
}
function promptDetail(b, kind, g){
  return skill(b) + "\n\n" + briefText(b) + `

Лидер выбрал игру (${KINDS[kind].label}):
Название: ${g.title}
Формат: ${g.time}
Реквизит: ${g.props}
Правила: ${g.rules.join(" / ")}
Мостик: ${g.bridge || "—"}

Распиши её для проведения. Ответь только JSON-объектом:
{"checklist":["точный список реквизита с количеством"],"setup":"как подготовить зал, 1–3 предложения","script":"дословные слова ведущего в микрофон: объяснение правил за 45 секунд, без занудства","timeline":[{"t":"0:00–0:45","what":"что происходит"}],"safety":["как избежать травм и обид"],"punchline":"яркая финальная реплика и связка со следующим блоком программы"}`;
}

// ---------- викторина ----------
const QUIZ_SOURCES = ["Тема","Книга или история","Конспект"];
const QUIZ_COUNT = 10;
function quizLevel(n){ return n<=2 ? "Разминка" : n<=7 ? "Сюжет и факты" : n<=9 ? "Логика и суть" : "Босс-уровень"; }
const QUIZ_LEVEL_NEED = {
  "Разминка": "простой вопрос, чтобы включить зал и дать каждому почувствовать успех",
  "Сюжет и факты": "основная проверка знания истории или ключевых мыслей",
  "Логика и суть": "вопрос не на память, а на понимание: почему герой так поступил, в чём скрытая причина",
  "Босс-уровень": "самый каверзный вопрос с неожиданным поворотом, который вызовет спор в зале и заставит ахнуть при правильном ответе"
};
function quizSkill(){
  return `Ты — креативный квиз-мастер и ведущий с отличным чувством юмора. Делаешь библейскую викторину для подросткового служения в церкви: ребята должны смеяться, спорить, удивляться и прочно запоминать истину, а не сдавать унылый школьный тест.

Законы:
- Сложность растёт строго: вопросы 1–2 — разминка, 3–7 — сюжет и факты, 8–9 — логика и «почему?», 10 — босс-уровень с подвохом.
- Ровно 4 варианта ответа, верный ровно один. Неверные варианты правдоподобные и остроумные: проверяют частые заблуждения или вызывают добрую улыбку, но не бредовые.
- После каждого вопроса — комментарий ведущего на 1–2 предложения для микрофона: разряжает обстановку, добавляет любопытную деталь или параллель с жизнью подростка. В комментарии не называй букву ответа.
- Язык под возраст: 11–13 — живо, без занудства и сложных терминов; 14–16 — тонкий юмор, ирония, без кринжа; 17+ — глубже в смыслы, исторические детали, этические развилки.
- Библейские факты — только из канонического текста Библии (66 книг), без апокрифов и преданий. Сверяйся с Синодальным переводом и не выдумывай деталей, которых нет в тексте. В поле ref укажи, где это написано (например «Ион 1:17»); если вопрос не про конкретное место — оставь ref пустым.
- Пиши по-русски.`;
}
function quizBasis(q){
  if(q.source === "Конспект") return `Основа — конспект проповеди лидера ниже. Вопросы составляй ИСКЛЮЧИТЕЛЬНО по фактам, примерам, цитатам и иллюстрациям из конспекта: это проверка, слушали ли ребята проповедника. Не добавляй того, чего в конспекте нет.

Конспект:
"""
${q.notes}
"""`;
  if(q.source === "Книга или история") return `Основа — книга Библии или история: «${q.topic}». Вопросы по её тексту.`;
  return `Основа — библейская тема: «${q.topic}». Бери истории и места Писания, которые действительно раскрывают эту тему.`;
}
function quizBrief(q){ return `Вводные:\n- Возраст: ${q.age}\n- Пожелания лидера: ${q.wish || "нет"}`; }
const QUESTION_SHAPE = `{"n":1,"q":"Текст вопроса","options":["вариант","вариант","вариант","вариант"],"correct":0,"comment":"Реплика ведущего","ref":"Ион 1:17"}`;
function promptQuiz(q){
  return quizSkill() + "\n\n" + quizBasis(q) + "\n\n" + quizBrief(q) + `

Составь викторину из ${QUIZ_COUNT} вопросов:
` + Array.from({length:QUIZ_COUNT}, (_,i)=>`${i+1}. ${quizLevel(i+1)} — ${QUIZ_LEVEL_NEED[quizLevel(i+1)]}.`).join("\n") + `

Ответь ровно ${QUIZ_COUNT} строками JSON, каждая — один объект вида
${QUESTION_SHAPE}
correct — номер верного варианта от 0 до 3, n от 1 до ${QUIZ_COUNT} по порядку. Никакого markdown и пояснений, только строки JSON.`;
}
function promptQuizOne(q, n, current, wish, others){
  const lv = quizLevel(n);
  return quizSkill() + "\n\n" + quizBasis(q) + "\n\n" + quizBrief(q) + `

Перепиши вопрос №${n} (${lv} — ${QUIZ_LEVEL_NEED[lv]}).
Сейчас он такой: «${current || "—"}».
${wish ? "Пожелание лидера к этому вопросу: " + wish + "." : "Сделай другой вопрос того же уровня."}${others && others.length ? "\nНе повторяй другие вопросы викторины: " + others.join(" | ") : ""}

Ответь только одним JSON-объектом вида
${QUESTION_SHAPE.replace('"n":1','"n":'+n)}`;
}
function normQuestion(o, n){
  if(!o || typeof o!=="object") return null;
  const s = v => (v==null ? "" : String(v)).trim();
  const options = Array.isArray(o.options) ? o.options.map(x=>s(x).replace(/^[A-DА-Г][).:]\s*/i,"")).filter(Boolean) : [];
  if(options.length !== 4) return null;
  let c = o.correct;
  if(typeof c === "string"){
    const t = c.trim().toUpperCase();
    const li = ["A","B","C","D"].indexOf(t[0]); const ci = ["А","Б","В","Г"].indexOf(t[0]);
    c = li >= 0 ? li : ci >= 0 ? ci : Number(t);
  }
  c = Math.floor(Number(c));
  if(!(c>=0 && c<4)) return null;
  const q = s(o.q || o.question);
  if(!q) return null;
  return {n, level:quizLevel(n), q, options, correct:c, comment:s(o.comment), ref:s(o.ref)};
}
/** Перемешивает варианты, чтобы верный ответ не стоял всегда под одной буквой. */
function shuffleQuestion(x){
  if(!x) return x;
  const order = pick([0,1,2,3], 4);
  return {...x, options:order.map(i=>x.options[i]), correct:order.indexOf(x.correct)};
}
function parseQuestions(text, count){
  count = count || QUIZ_COUNT;
  const out = new Array(count).fill(null);
  const place = o => {
    if(!o || typeof o!=="object") return;
    let idx = Number(o.n) - 1;
    if(!(idx >= 0 && idx < count) || out[idx]) idx = out.findIndex(x=>!x);
    if(idx < 0) return;
    const qn = normQuestion(o, idx+1); if(qn) out[idx] = qn;
  };
  const t = stripFences(text);
  t.split("\n").forEach(l=>{ const o = parseLine(l); if(o) place(o); });
  if(!out.some(Boolean)){
    const all = parseJsonLoose(t);
    if(Array.isArray(all)) all.forEach(place);
    else if(all && Array.isArray(all.questions)) all.questions.forEach(place);
  }
  return out;
}
function cleanQuiz(q){
  q = q && typeof q === "object" ? q : {};
  return {source: QUIZ_SOURCES.includes(q.source) ? q.source : QUIZ_SOURCES[0],
    topic: cleanStr(q.topic, 200), notes: String(q.notes==null ? "" : q.notes).replace(/\u0000/g,"").trim().slice(0, 8000),
    age: OPTS.age.includes(q.age) ? q.age : OPTS.age[0], wish: cleanStr(q.wish, 200)};
}

// ---------- разбор ответов ----------
function normGame(o){
  if(!o || typeof o!=="object") return null;
  const s = v => (v==null ? "" : String(v)).trim();
  const rules = Array.isArray(o.rules) ? o.rules.map(s).filter(Boolean) : s(o.rules).split(/\n+/).filter(Boolean);
  const g = {title:s(o.title), time:s(o.time), props:s(o.props), rules, secret:s(o.secret), bridge:s(o.bridge)};
  return g.title && rules.length ? g : null;
}
function normDetail(o){
  if(!o || typeof o!=="object") return null;
  const arr = v => Array.isArray(v) ? v.map(x=>String(x)).filter(Boolean) : [];
  const d = {checklist:arr(o.checklist), setup:String(o.setup||""), script:String(o.script||""),
    timeline:Array.isArray(o.timeline) ? o.timeline.map(x=>({t:String(x&&x.t||""), what:String(x&&x.what||"")})).filter(x=>x.what) : [],
    safety:arr(o.safety), punchline:String(o.punchline||"")};
  return (d.script || d.checklist.length || d.timeline.length) ? d : null;
}
function parseLine(line){
  const t = String(line).trim().replace(/,$/,"");
  if(!t.startsWith("{")) return null;
  try{ return JSON.parse(t); }catch(e){ return null; }
}
function stripFences(text){ return String(text||"").replace(/```(?:json)?/gi, "").trim(); }
/** Один JSON-объект или массив из ответа, даже если вокруг пара слов или ```json. */
function parseJsonLoose(text){
  const t = stripFences(text);
  try{ return JSON.parse(t); }catch(e){}
  const a = t.search(/[\[{]/), z = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if(a >= 0 && z > a){ try{ return JSON.parse(t.slice(a, z+1)); }catch(e){} }
  return null;
}
/** Разбирает n игр: строки JSON, либо JSON-массив. Возвращает массив длины n (null — не пришло). */
function parseGames(text, n){
  const out = new Array(n).fill(null);
  const place = o => {
    const g = normGame(o); if(!g) return;
    let idx = Number(o.slot) - 1;
    if(!(idx >= 0 && idx < n) || out[idx]) idx = out.findIndex(x=>!x);
    if(idx >= 0) out[idx] = g;
  };
  const t = stripFences(text);
  t.split("\n").forEach(l=>{ const o = parseLine(l); if(o) place(o); });
  if(!out.some(Boolean)){
    const all = parseJsonLoose(t);
    if(Array.isArray(all)) all.forEach(place);
    else if(all && Array.isArray(all.games)) all.games.forEach(place);
    else if(all) place(all);
  }
  return out;
}

// ---------- очистка входа на сервере ----------
function cleanStr(v, max){ return String(v==null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max); }
function cleanBrief(b){
  b = b && typeof b === "object" ? b : {};
  const one = (n) => OPTS[n].includes(b[n]) ? b[n] : (DEFAULTS[n] || OPTS[n][0]);
  let counts = Array.isArray(b.counts) && b.counts.length === 5 ? b.counts.map(x=>Math.max(0, Math.min(MAX_TOTAL, Math.floor(Number(x)||0)))) : [1,1,1,1,1];
  let total = 0; counts = counts.map(c=>{ const take = Math.max(0, Math.min(c, MAX_TOTAL - total)); total += take; return take; });
  return {age:one("age"), size:one("size"), time:one("time"), novelty:one("novelty"), counts,
    theme:cleanStr(b.theme, 120), room:cleanStr(b.room, 120), wish:cleanStr(b.wish, 200)};
}
function cleanTitles(arr, max){ return (Array.isArray(arr) ? arr : []).map(x=>cleanStr(x, 80)).filter(Boolean).slice(-max); }
function cleanGame(g){
  const n = normGame(g); if(!n) return null;
  return {title:cleanStr(n.title,120), time:cleanStr(n.time,160), props:cleanStr(n.props,240),
    rules:n.rules.slice(0,8).map(r=>cleanStr(r,400)), secret:cleanStr(n.secret,400), bridge:cleanStr(n.bridge,600)};
}

const api = {OPTS, DEFAULTS, MAX_TOTAL, KINDS, plural, slotsFrom, promptAll, promptOne, promptDetail,
  normGame, normDetail, parseLine, parseJsonLoose, parseGames, cleanBrief, cleanTitles, cleanGame, cleanStr,
  QUIZ_SOURCES, QUIZ_COUNT, quizLevel, promptQuiz, promptQuizOne, normQuestion, shuffleQuestion, parseQuestions, cleanQuiz};
if (typeof module === "object" && module.exports) module.exports = api;
else root.IgrotekaCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
