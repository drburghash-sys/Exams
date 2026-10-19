"use strict";
(function(){
const $=id=>document.getElementById(id);
const app=$("root"), WORDS=window.TRAINER_DATA, TOPICS=window.APT_LESSONS||[];
const storeKey="aptitude_redesign_v12";
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function safeLoad(){try{return JSON.parse(StudyStore.getItem(storeKey)||"{}")}catch(e){return {}}}
const persist=safeLoad();persist.groups=persist.groups||{ar:0,en:0};persist.recent=persist.recent||{};
function save(){try{StudyStore.setItem(storeKey,JSON.stringify(persist))}catch(e){}}
const data={view:"words",lang:"ar",course:"quant",topic:null,quiz:null,puzzle:null,clue:0,wordGroup:0};
const banks={ar:WORDS.arabicWords.filter(w=>w.word&&w.synonym&&w.antonym),en:WORDS.englishWords.filter(w=>w.word&&w.synonym&&w.antonym)};
const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const normalize=(s,lang)=>String(s||"").normalize("NFKC").toLowerCase().replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(lang==="ar"?/[^ء-ي]/g:/[^a-z]/g,"");
function words(){return banks[data.lang].slice(data.wordGroup*5,data.wordGroup*5+5);}
function countGroups(){return Math.floor(banks[data.lang].length/5);}
function sharedNav(){return '<div class="bar"><button class="'+(data.view==="words"||data.view==="cross"?"purple":"light")+'" onclick="aptWords()">المفردات والمتقاطعة</button><button class="'+(["courses","topic","quiz","results"].includes(data.view)?"":"light")+'" onclick="aptCourses()">الدروس والاختبارات</button></div>';}
function setView(view){data.view=view;document.body.classList.toggle("dark",!["words","cross"].includes(view));window.scrollTo(0,0);}
function renderWords(){
setView("words");const a=words(),groupCount=countGroups();
const cards=a.map((w,i)=>'<div class="word" dir="'+(data.lang==="en"?"ltr":"rtl")+'"><div><b>'+esc(w.word)+'</b><small>'+esc(w.meaning)+'</small></div><div><span class="tag">'+(data.lang==="en"?"Synonym":"المرادف")+'</span><b>'+esc(w.synonym)+'</b></div><div><span class="tag">'+(data.lang==="en"?"Antonym":"الضد")+'</span><b>'+esc(w.antonym)+'</b></div></div>').join("");
app.innerHTML=sharedNav()+'<header class="hero"><h1>المفردات والكلمات المتقاطعة</h1><p>اختاري لغة واحدة ثم ادرسي مجموعة من خمس كلمات. المتقاطعة لا تستخدم إلا كلمات المجموعة المحددة ومرادفاتها وأضدادها.</p><div class="bar"><button class="'+(data.lang==="ar"?"purple":"light")+'" onclick="aptLang(\'ar\')">العربية</button><button class="'+(data.lang==="en"?"purple":"light")+'" onclick="aptLang(\'en\')">English</button></div></header><section class="card"><h2>المجموعة '+(data.wordGroup+1)+' من '+groupCount+'</h2><div class="rail">'+Array.from({length:groupCount},(_,i)=>'<button class="'+(data.wordGroup===i?"purple":"light")+'" onclick="aptGroup('+i+')">'+(i+1)+'</button>').join("")+'</div><p class="muted">٥ كلمات + ٥ مرادفات + ٥ أضداد • الحفظ بالمراجعة ثم التطبيق</p>'+cards+'<div class="actions" style="margin-top:16px"><button class="purple" onclick="aptCross()">حل كلمات هذه المجموعة</button><button class="light" onclick="aptNextGroup()">المجموعة التالية ←</button></div></section><section class="card"><h2>بعد المفردات</h2><p>اختاري مسارًا واحدًا للشرح واختبار كل موضوع مستقلًا.</p><button onclick="aptCourses()">الانتقال إلى الدروس: كمي • لفظي • STEP</button></section>';
}
function letters(w){return normalize(w,data.lang).toUpperCase();}
function puzzleEntries(){
const out=[];
words().forEach((w,i)=>{
out.push({value:letters(w.word),clue:data.lang==="en"?"Which word means: "+w.meaning+"?":"ما الكلمة التي تعني: «"+w.meaning+"»؟",source:w.word,kind:"meaning"});
const option=i%2===0?"synonym":"antonym",answer=w[option];
out.push({value:letters(answer),clue:data.lang==="en"?(option==="synonym"?"Synonym of ":"Antonym of ")+w.word:""+(option==="synonym"?"مرادف":"ضد")+" «"+w.word+"»",source:w.word,kind:option});
});
return shuffle(out.filter(x=>x.value.length>=2&&x.value.length<=18)).filter((x,i,a)=>a.findIndex(v=>v.value===x.value)===i).sort((a,b)=>b.value.length-a.value.length);
}
function makePuzzle(){
const N=25,board=Array.from({length:N},()=>Array(N).fill("")),placed=[];
function check(word,r,c,dir){
const dr=dir==="v"?1:0,dc=dir==="h"?1:0;
const endr=r+dr*(word.length-1),endc=c+dc*(word.length-1);
if(r<0||c<0||endr>=N||endc>=N)return -1;
const br=r-dr,bc=c-dc,ar=endr+dr,ac=endc+dc;
if(br>=0&&bc>=0&&board[br][bc])return -1;
if(ar<N&&ac<N&&board[ar][ac])return -1;
let hits=0;
for(let i=0;i<word.length;i++){
const y=r+dr*i,x=c+dc*i,v=board[y][x];
if(v&&v!==word[i])return -1;
if(v){hits++;continue}
if(dir==="h"){if(y>0&&board[y-1][x])return -1;if(y+1<N&&board[y+1][x])return -1}
else{if(x>0&&board[y][x-1])return -1;if(x+1<N&&board[y][x+1])return -1}
}
return hits;
}
function place(e,r,c,dir){for(let i=0;i<e.value.length;i++)board[r+(dir==="v"?i:0)][c+(dir==="h"?i:0)]=e.value[i];placed.push({...e,r,c,dir,solved:false});}
for(const e of puzzleEntries()){
if(!placed.length){place(e,12,Math.floor((N-e.value.length)/2),"h");continue}
let best=null;
for(let i=0;i<e.value.length;i++)for(let y=0;y<N;y++)for(let x=0;x<N;x++){
if(board[y][x]!==e.value[i])continue;
for(const dir of ["h","v"]){const r=y-(dir==="v"?i:0),c=x-(dir==="h"?i:0),hits=check(e.value,r,c,dir);
if(hits>0&&(!best||hits>best.hits))best={r,c,dir,hits};
}}
if(best)place(e,best.r,best.c,best.dir);
}
if(!placed.length)return null;
let y0=N,x0=N,y1=0,x1=0;
placed.forEach(p=>{y0=Math.min(y0,p.r);x0=Math.min(x0,p.c);y1=Math.max(y1,p.r+(p.dir==="v"?p.value.length-1:0));x1=Math.max(x1,p.c+(p.dir==="h"?p.value.length-1:0));});
const nums=new Map();let num=0;
placed.forEach(p=>{const key=p.r+","+p.c;if(!nums.has(key))nums.set(key,++num);p.number=nums.get(key);});
return {board,placed,y0,x0,y1,x1,nums};
}
function crossCell(p,y,x){return y>=p.r&&x>=p.c&&(p.dir==="h"?y===p.r&&x<p.c+p.value.length:x===p.c&&y<p.r+p.value.length)}
function renderCross(){
setView("cross");
if(!data.puzzle)data.puzzle=makePuzzle();
const p=data.puzzle;if(!p){app.innerHTML='<p>تعذر إعداد هذه المتقاطعة.</p><button onclick="aptWords()">عودة</button>';return}
const active=p.placed[data.clue]||p.placed[0],completed=p.placed.filter(v=>v.solved).length;
let cells='';
for(let y=p.y0;y<=p.y1;y++)for(let x=p.x0;x<=p.x1;x++){
const char=p.board[y][x],num=p.nums.get(y+","+x),filled=p.placed.some(v=>v.solved&&crossCell(v,y,x));
const focus=active&&crossCell(active,y,x);
cells+='<div class="cell '+(!char?"off":filled?"solved":focus?"highlight":"")+'">'+(char?(num?'<span class="num">'+num+'</span>':'')+(filled?esc(char):""):"")+'</div>';
}
const clues=p.placed.map((v,i)=>'<button class="clue '+(v.solved?"solved":data.clue===i?"active":"")+'" onclick="aptClue('+i+')">'+v.number+' '+(v.dir==="h"?"أفقي":"رأسي")+' • '+esc(v.clue)+' ('+v.value.length+') '+(v.solved?"✓":"")+'</button>').join("");
app.innerHTML=sharedNav()+'<div class="hero"><h1>متقاطعة المجموعة '+(data.wordGroup+1)+'</h1><p>المحتوى من الكلمات الخمس التي درستِها ومرادفاتها وأضدادها فقط. اكتبي الكلمة دون مسافات.</p><div class="bar"><button class="light" onclick="aptWords()">عودة للكلمات</button><button class="purple" onclick="aptCross(true)">متقاطعة جديدة من المجموعة</button></div></div><div class="card"><b>تم حل '+completed+' من '+p.placed.length+'</b><div class="board-wrap"><div class="board" style="grid-template-columns:repeat('+(p.x1-p.x0+1)+',clamp(22px,6vw,34px))">'+cells+'</div></div></div><div class="card"><h2>الأسئلة الأفقية والرأسية</h2>'+clues+(completed===p.placed.length?'<div class="notice good">أحسنتِ! اكتملت المتقاطعة. يمكنك مراجعة مجموعة أخرى.</div>':'<div class="answer-line"><input id="crossInput" dir="auto" autocomplete="off" placeholder="أدخلي جواب السؤال المختار" aria-label="جواب المتقاطعة"><button onclick="aptCheckCross()">تحقق</button></div><div id="crossMessage" role="status" aria-live="polite"></div>')+'</div>';
}
window.aptWords=function(){data.puzzle=null;renderWords()};
window.aptLang=function(lang){if(!banks[lang])return;data.lang=lang;data.wordGroup=Math.min(persist.groups[lang]||0,Math.ceil(banks[lang].length/5)-1);data.puzzle=null;renderWords()};
window.aptGroup=function(i){data.wordGroup=Math.max(0,Math.min(countGroups()-1,i));persist.groups[data.lang]=data.wordGroup;save();data.puzzle=null;renderWords()};
window.aptNextGroup=function(){window.aptGroup((data.wordGroup+1)%countGroups())};
window.aptCross=function(reset){if(reset||!data.puzzle)data.puzzle=makePuzzle();data.clue=0;renderCross()};
window.aptClue=function(i){data.clue=i;renderCross();const input=$("crossInput");if(input)input.focus()};
window.aptCheckCross=function(){
const p=data.puzzle,v=p?.placed[data.clue],el=$("crossInput");if(!v||v.solved||!el)return;
const raw=el.value,correct=letters(raw)===v.value;
if(correct){v.solved=true;studyRecord({module:"crossword",track:data.lang==="ar"?"verbal":"step",skill:"مترادفات وأضداد",subject:data.lang==="ar"?"العربية":"English",text:v.clue,selected:raw,correctText:v.value,correct:true,explanation:"من المجموعة "+(data.wordGroup+1)});renderCross()}
else $("crossMessage").innerHTML='<div class="notice warning">ليست الإجابة المطلوبة. راجعي كلمة المجموعة وحاولي مجددًا.</div>';
};
const TITLES={quant:"الكمي",verbal:"اللفظي",step:"STEP"};
function courseButtons(){return '<div class="bar">'+["quant","verbal","step"].map(t=>'<button class="'+(data.course===t?"":"light")+'" onclick="aptCourse(\''+t+'\')">'+TITLES[t]+'</button>').join("")+'</div>';}
function renderCourses(){
setView("courses");const list=TOPICS.filter(t=>t.track===data.course);
app.innerHTML=sharedNav()+'<header class="hero"><h1>اشرحي ثم تدربي: '+TITLES[data.course]+'</h1><p class="muted">لا توجد أسئلة مختلطة: افتحي الموضوع، راجعي الحالات المختلفة، ثم اختبري نفسك في ٢٠ سؤالًا جديد الترتيب.</p>'+courseButtons()+'</header><div class="topic-grid">'+list.map(t=>'<button onclick="aptTopic(\''+t.id+'\')"><strong>'+esc(t.title)+'</strong><small>شرح • صور السؤال المختلفة • اختبار ٢٠ سؤالًا</small></button>').join("")+'</div><div class="card" style="margin-top:12px"><p>البنك العام يحتوي أكثر من ١٠٠٠ سؤال محفوظ مع إضافة مسائل مولّدة بقيم وحالات متغيرة. في المسائل الحسابية تتبدل المعطيات، وليس ترتيب الخيارات فقط.</p><button class="light" onclick="aptErrors()">مراجعة أخطائي ونتائجي</button></div>';
}
window.aptCourses=function(){renderCourses()};
window.aptErrors=function(){window.parent.profileErrors()};
window.aptCourse=function(t){data.course=t;renderCourses()};
window.aptTopic=function(id){const t=TOPICS.find(t=>t.id===id&&t.track===data.course);if(!t)return;data.topic=t;renderTopic()};
function renderTopic(){
setView("topic");const t=data.topic;
app.innerHTML=sharedNav()+'<div class="bar"><button class="light" onclick="aptCourses()">← قائمة '+TITLES[t.track]+'</button></div><header class="hero"><h1>'+esc(t.title)+'</h1><p>الهدف: فهم القانون وطريقة تغيّر السؤال، لا حفظ مثال واحد.</p></header><section class="card"><h2>١. الشرح الأساسي</h2><p class="lesson-step">'+esc(t.rule)+'</p></section><section class="card"><h2>٢. كيف تتغير صيغة السؤال؟</h2>'+t.cases.map((c,i)=>'<div class="lesson-step"><b>الحالة '+(i+1)+':</b> '+esc(c)+'</div>').join("")+'</section><section class="card"><h2>٣. مثال محلول</h2><p class="notice">'+esc(t.example)+'</p><h3>خطأ شائع</h3><p class="notice warning">'+esc(t.trap)+'</p></section><div class="card"><h2>٤. اختبري الموضوع وحده</h2><p>٢٠ سؤالًا باختيارات وتصحيح فوري مع شرح سبب الإجابة.</p><button onclick="aptStartQuiz()">ابدئي اختبار '+esc(t.title)+'</button></div>';
}
function allPool(t){
let base=STUDY_CONTEXT.bank.filter(q=>q.track===t.track&&t.skills.includes(q.skill)&&Array.isArray(q.options)&&q.options.length===4&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4&&typeof q.text==="string");
if(["square","rectangle","triangle","order","logic","context"].includes(t.id))base=base.filter(q=>t.track==="verbal");
const generated=[];
for(let i=0;i<620;i++){const q=window.APT_GENERATE(t,i);if(q&&Array.isArray(q.options)&&q.options.length===4)generated.push(q)}
const seen=new Set();return shuffle(base.concat(generated)).filter(q=>{
const sig=q.text.trim().replace(/\s+/g," ")+"|"+q.options[q.answer];
if(seen.has(sig)||new Set(q.options.map(String)).size!==4)return false;seen.add(sig);return true;
});
}
function chooseQuiz(t){
const all=allPool(t),rec=new Set(persist.recent[t.id]||[]),signature=q=>q.text.trim().replace(/\s+/g," ")+"|"+q.options[q.answer];
const unseen=all.filter(q=>!rec.has(signature(q))),repeat=all.filter(q=>rec.has(signature(q)));
const selected=shuffle(unseen).concat(shuffle(repeat)).slice(0,20);
if(selected.length<20)return {error:"لم يكتمل لهذا الموضوع إلا "+selected.length+" سؤالًا غير مكرر. لن أكرر السؤال لأعرض اختبارًا وهميًا من ٢٠ سؤالًا."};
persist.recent[t.id]=selected.map(signature);save();
return {questions:selected,at:0,correct:0,answered:false,answers:[]};
}
window.aptStartQuiz=function(){if(!data.topic)return;data.quiz=chooseQuiz(data.topic);renderQuiz()};
function renderQuiz(){
setView("quiz");const t=data.topic,s=data.quiz;
if(s.error){app.innerHTML='<div class="card"><p class="notice warning">'+esc(s.error)+'</p><button onclick="aptTopic(\''+t.id+'\')">عودة للشرح</button></div>';return;}
const q=s.questions[s.at],selected=s.answers[s.at],hasAnswer=!!selected;
const opts=q.options.map((o,i)=>'<button class="option '+(hasAnswer?(i===q.answer?"correct":i===selected.idx?"wrong":""):"")+'" '+(hasAnswer?"disabled":"")+' onclick="aptAnswer('+i+')">'+esc(o)+'</button>').join("");
app.innerHTML='<header class="hero"><div class="bar"><button class="light" onclick="aptTopic(\''+t.id+'\')">← الشرح</button><b>'+esc(t.title)+'</b></div><h1>السؤال '+(s.at+1)+' من ٢٠</h1><div class="progress"><span style="width:'+((s.at+1)/20*100)+'%"></span></div><span class="muted">صحيح حتى الآن: '+s.correct+'</span></header><section class="card"><h2 dir="auto">'+esc(q.text)+'</h2><div class="options">'+opts+'</div>'+(hasAnswer?'<div class="notice '+(selected.ok?"good":"warning")+'"><b>'+(selected.ok?"إجابة صحيحة ✓":"الإجابة الصحيحة: "+esc(q.options[q.answer]))+'</b><p>'+esc(q.explanation||"راجعي قاعدة هذا الدرس.")+'</p></div><button onclick="aptNext()"> '+(s.at===19?"عرض النتيجة":"السؤال التالي ←")+'</button>':'<p class="muted">اختاري إجابة واحدة ليظهر الشرح مباشرة.</p>')+'</section>';
}
window.aptAnswer=function(i){const s=data.quiz;if(!s||s.error||s.answers[s.at])return;const q=s.questions[s.at],ok=i===q.answer;s.correct+=ok?1:0;s.answers[s.at]={idx:i,ok};
studyRecord({module:"aptitude-topic",track:data.topic.track,subject:TITLES[data.topic.track],skill:data.topic.title,text:q.text,selected:q.options[i],correctText:q.options[q.answer],correct:ok,explanation:q.explanation,question:{id:q.id,track:q.track,skill:data.topic.title,text:q.text,options:q.options,answer:q.answer,explanation:q.explanation}});renderQuiz()};
window.aptNext=function(){const s=data.quiz;if(!s||!s.answers[s.at])return;if(s.at<19){s.at++;renderQuiz()}else{setView("results");app.innerHTML='<header class="hero"><h1>نتيجة اختبار '+esc(data.topic.title)+'</h1><div class="kpi">'+s.correct+' / ٢٠</div><p>النسبة '+Math.round(s.correct*5)+'٪ — سُجلت الإجابات للمراجعة في الملف.</p></header><div class="card"><p>'+ (s.correct>=17?"أداء قوي. جرّبي اختبارًا آخر للتأكد من ثبات الفهم.":"راجعي الحالات التي أخطأتِ فيها ثم أعيدي الاختبار بأسئلة مختلفة.") +'</p><div class="actions"><button onclick="aptTopic(\''+data.topic.id+'\')">مراجعة الشرح</button><button onclick="aptStartQuiz()">اختبار جديد</button><button class="light" onclick="aptCourses()">موضوع آخر</button></div></div>';}};
data.wordGroup=Math.max(0,Math.min(persist.groups.ar||0,countGroups()-1));
renderWords();
})();