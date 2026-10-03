"use strict";
(function(){
const KEY="girls_study_v1";
const APP_VERSION="11.2";
const BANK=window.ALL_BANK||[];
const CURRICULUM=window.CURRICULUM_CATALOG||[];
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const T={
 quant:{name:"القدرات - كمي",short:"كمي"},verbal:{name:"القدرات - لفظي",short:"لفظي"},step:{name:"STEP",short:"STEP"},
 m3:{name:"ثالث متوسط - المركزي",short:"ثالث متوسط",subjects:["الرياضيات","الإنجليزي","العلوم","لغتي"],weekly:40},
 g5:{name:"خامس ابتدائي",short:"خامس",subjects:["الرياضيات","الإنجليزي"],weekly:20}
};
let state,session=null,timer=null;
function def(){return {version:10,profiles:[
 {id:"p1",name:"جنى",tracks:["quant","verbal","step"],kind:"aptitude"},
 {id:"p2",name:"جمانة",tracks:["m3"],kind:"school"},
 {id:"p3",name:"حكمة",tracks:["g5"],kind:"school"}
],history:[],currentExam:null,externalQuestions:[],appliedPacks:[],scope:{m3:{},g5:{}},remedialPlans:[],remedialProgress:{}}}
function allBank(){const m=new Map();BANK.forEach(q=>m.set(q.id,q));(state.externalQuestions||[]).forEach(q=>m.set(q.id,q));const seen=new Set();return [...m.values()].filter(q=>{const sig=q.track+"|"+q.subject+"|"+q.text.replace(/\s+/g," ").trim()+"|"+q.options?.[q.answer];if(seen.has(sig))return false;seen.add(sig);return true})}
const SCHOOL_ORDER_MAP={
 m3:{"الرياضيات":{
  "حل المعادلات":[1,1,3],
  "المعادلات المتعددة الخطوات":[1,1,5],
  "المتغير في طرفي المعادلة":[1,1,6],
  "القيمة المطلقة":[1,1,7],
  "مفاهيم المعادلات":[1,1,2],
  "العلاقات والدوال":[1,2,2],
  "معدل التغير والميل":[1,2,5],
  "المتتابعات الحسابية":[1,2,6],
  "صيغة الميل والمقطع":[1,3,1],
  "كتابة معادلة خطية":[1,3,2],
  "المستقيمات المتوازية والمتعامدة":[1,3,4],
  "حل المتباينات":[1,4,4],
  "المتباينات المركبة والقيمة المطلقة":[1,4,7],
  "حل أنظمة المعادلات":[1,5,3],
  "مفاهيم الأنظمة":[1,5,6]
 }},
 g5:{"الرياضيات":{
  "القيمة المنزلية":[1,1,1],
  "مقارنة الأعداد":[1,1,2],
  "الجمع والطرح":[1,2,7],
  "الضرب":[1,3,7],
  "القسمة":[1,4,5],
  "مقارنة الكسور":[1,6,6],
  "جمع الكسور المتشابهة":[2,9,1],
  "الأعداد العشرية":[1,2,5],
  "جمع وطرح الكسور العشرية":[1,2,5],
  "المحيط":[2,12,2],
  "المساحة":[2,12,4],
  "التحويل بين الوحدات":[2,10,2]
 }}
};
function academicOrder(q){
 const ov=SCHOOL_ORDER_MAP?.[q?.track]?.[q?.subject]?.[q?.skill];
 if(ov)return Number(ov[0])*1000000+Number(ov[1])*1000+Number(ov[2]);
 const m=q?.meta||{},term=Number(m.term||m.semester||1),unit=Number(m.unitOrder||1),lesson=Number(m.lessonOrder||m.sectionOrder||1);
 return term*1000000+unit*1000+lesson
}
function catalogOrder(x){return Number(x.term||1)*1000000+Number(x.unitOrder||1)*1000+Number(x.lessonOrder||1)}
function sections(track,subject){const m=new Map();CURRICULUM.filter(x=>x.track===track&&x.subject===subject).forEach(x=>{const a=catalogOrder(x);m.set(a,{order:a,term:Number(x.term||1),unitOrder:Number(x.unitOrder||1),unit:x.unitTitle||"",lessonOrder:Number(x.lessonOrder||1),lesson:x.lesson||("القسم "+a),catalog:true})});allBank().filter(q=>q.track===track&&q.subject===subject).forEach(q=>{const a=academicOrder(q),mm=q.meta||{};if(!m.has(a))m.set(a,{order:a,term:Number(mm.term||mm.semester||1),unitOrder:Number(mm.unitOrder||1),unit:mm.unitTitle||"",lessonOrder:Number(mm.lessonOrder||mm.sectionOrder||1),lesson:mm.lesson||q.skill||("القسم "+a),catalog:false})});return [...m.values()].sort((a,b)=>a.order-b.order)}
function scopeOptions(a,cur){let out='<option value="0">لم يبدأ بعد</option>',last='';for(const x of a){const key=x.term+'|'+x.unitOrder+'|'+x.unit;if(key!==last){if(last)out+='</optgroup>';out+=`<optgroup label="الفصل الدراسي ${x.term} • ${esc(x.unit)}">`;last=key}out+=`<option value="${x.order}" ${x.order===cur?'selected':''}>${esc(x.lesson)}</option>`}if(last)out+='</optgroup>';return out}
function catalogCount(t,s=null){return CURRICULUM.filter(x=>x.track===t&&(!s||x.subject===s)).length}
function normalize(){const d=def(),prevAppVersion=state?.appVersion||"";state={...d,...state};state.profiles=Array.isArray(state.profiles)&&state.profiles.length===3?state.profiles:d.profiles;state.history=Array.isArray(state.history)?state.history:[];state.externalQuestions=Array.isArray(state.externalQuestions)?state.externalQuestions:[];state.appliedPacks=Array.isArray(state.appliedPacks)?state.appliedPacks:[];state.remedialPlans=Array.isArray(state.remedialPlans)?state.remedialPlans:[];state.remedialProgress=state.remedialProgress||{};state.scope={m3:{...(state.scope?.m3||{})},g5:{...(state.scope?.g5||{})}};for(const t of ["m3","g5"]){for(const s of T[t].subjects){const a=sections(t,s);if(a.length&&!(s in state.scope[t]))state.scope[t][s]=0}}
if(prevAppVersion&&prevAppVersion!=="11.2"){
 const staleWhole=q=>q?.track==="g5"&&q?.subject==="الرياضيات"&&q?.skill==="الجمع والطرح"&&!/[.٫]/.test(String(q.text||""));
 if(state.currentExam?.profileId==="p3"&&state.currentExam.questions?.some(staleWhole))state.currentExam=null;
 if(state.pendingExams?.p3?.questions?.some(staleWhole))state.pendingExams.p3=null;
}
state.appVersion=APP_VERSION;state.version=10}
function load(){try{state=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem("adaptive_learning_v9_3_students")||"null")||def();normalize();save();window.STORE_ERR=null}catch(e){state=def();normalize();window.STORE_ERR=e}}
function save(){try{if(activePid){state.pendingExams=state.pendingExams||{};state.pendingExams[activePid]=state.currentExam?.profileId===activePid?state.currentExam:null}localStorage.setItem(KEY,JSON.stringify(state));window.STORE_ERR=null}catch(e){window.STORE_ERR=e}}
function page(h){$("app").innerHTML=h;window.scrollTo(0,0)}
function top(title,back="home()") {return `<div class="top"><div><div class="brand">${esc(title)}</div><div class="sub">دراستنا • تقدم مستقل لكل طالبة</div></div><button class="btn light sm" onclick="${back}">رجوع</button></div>`}
function warn(){return window.STORE_ERR?`<div class="card warning"><b>الحفظ المحلي غير متاح في طريقة الفتح الحالية.</b><div>استخدم رابط GitHub Pages عبر https حتى تُحفظ النتائج.</div></div>`:""}
function name(t){return T[t]?.name||t}
function profile(pid){return state.profiles.find(p=>p.id===pid)}
function eligible(track,subject=null){let a=allBank().filter(q=>q.track===track);if(subject)a=a.filter(q=>q.subject===subject);if(T[track]?.subjects){a=a.filter(q=>academicOrder(q)<=Number(state.scope?.[track]?.[q.subject]||0))}return a}
function currentFocus(track,subject,b=null){
 const pool=b||eligible(track,subject),cur=Number(state.scope?.[track]?.[subject]||0);
 if(!cur||!pool.length)return[];
 const sec=sections(track,subject).find(x=>x.order===cur);

 // خامس رياضيات - الفصل الثاني (الجمع والطرح):
 // ابتداءً من درس جمع الكسور العشرية وطرحها وحتى نهاية الفصل،
 // لا نستخدم أسئلة "الجمع والطرح" القديمة الخاصة بالأعداد الصحيحة.
 // نُبقي التركيز على بنك الأعداد العشرية لأنه المطابق للمنهج الحالي.
 if(track==="g5"&&subject==="الرياضيات"&&sec?.term===1&&sec?.unitOrder===2&&sec?.lessonOrder>=5){
  const decimalPool=pool.filter(q=>q.skill==="الأعداد العشرية");
  if(decimalPool.length)return decimalPool;
 }

 let exact=pool.filter(q=>academicOrder(q)===cur);
 if(exact.length)return exact;
 if(sec){
  const sameUnit=pool.filter(q=>{const o=academicOrder(q);return Math.floor(o/1000000)===sec.term&&Math.floor((o%1000000)/1000)===sec.unitOrder&&o<=cur});
  if(sameUnit.length){
   const latest=Math.max(...sameUnit.map(academicOrder));
   return sameUnit.filter(q=>academicOrder(q)===latest)
  }
 }
 const previous=pool.filter(q=>academicOrder(q)<=cur);
 if(previous.length){const latest=Math.max(...previous.map(academicOrder));return previous.filter(q=>academicOrder(q)===latest)}
 return[]
}
function isG5DecimalStage(){
 const cur=Number(state.scope?.g5?.["الرياضيات"]||0);
 const sec=sections("g5","الرياضيات").find(x=>x.order===cur);
 return !!(sec&&sec.term===1&&sec.unitOrder===2&&sec.lessonOrder>=4&&sec.lessonOrder<=7)
}
function g5DecimalOnly(pool){
 if(!isG5DecimalStage())return pool;
 return pool.filter(q=>{
   if(q.track!=="g5"||q.subject!=="الرياضيات")return true;
   if(q.skill==="الأعداد العشرية")return true;
   const txt=String(q.text||"");
   return /[٫.]/.test(txt);
 });
}
function schoolSubjectSelect(pid,t,s,n,mode){
 let b=eligible(t,s);if(!b.length)return[];
 if(t==="g5"&&s==="الرياضيات"){
  const cur=Number(state.scope?.g5?.["الرياضيات"]||0);
  if(cur>=1002004&&cur<=1002007){
   const exactDecimal=b.filter(q=>q.skill==="تقدير نواتج الجمع والطرح"||q.skill==="جمع وطرح الكسور العشرية");
   const dedicated=exactDecimal.length?exactDecimal:allBank().filter(q=>q.track==="g5"&&q.subject==="الرياضيات"&&q.skill==="جمع وطرح الكسور العشرية");
   if(dedicated.length)return weightedSelect(pid,t,n,mode,dedicated).slice(0,n);
  }
 }
 const focus=currentFocus(t,s,b);
 if(t==="g5"&&s==="الرياضيات"&&focus.length)return weightedSelect(pid,t,n,mode,focus).slice(0,n);
 if(!focus.length||focus.length===b.length)return weightedSelect(pid,t,n,mode,b);
 const focusN=Math.max(1,Math.min(n,Math.round(n*.75))),reviewN=Math.max(0,n-focusN);
 const focused=weightedSelect(pid,t,focusN,mode,focus);
 const focusIds=new Set(focus.map(q=>q.id)),reviewPool=b.filter(q=>!focusIds.has(q.id));
 const review=reviewN?weightedSelect(pid,t,reviewN,mode,reviewPool):[];
 const out=[...focused,...review];
 if(out.length<n){const usedIds=new Set(out.map(q=>q.id));out.push(...weightedSelect(pid,t,n-out.length,mode,b.filter(q=>!usedIds.has(q.id))))}
 return out.slice(0,n)
}
const AR_NUM="٠١٢٣٤٥٦٧٨٩";
function arabicIndic(v){return String(v??"").replace(/[0-9]/g,d=>AR_NUM[Number(d)]).replace(/\.(?=\d)/g,"٫")}
function questionDisplay(q,v){return (q?.track==="m3"||q?.track==="g5")&&q?.subject==="الرياضيات"?arabicIndic(v):String(v??"")}
function stats(pid,track,subject=null){const m={};state.history.filter(h=>h.profileId===pid).forEach(h=>(h.answers||[]).forEach(a=>{if(a.track!==track)return;if(subject&&a.subject!==subject)return;const k=a.skill||"غير مصنف";if(!m[k])m[k]={skill:k,n:0,c:0,csec:0,cn:0,target:0};const x=m[k];x.n++;x.target+=a.targetSec||60;if(a.correct){x.c++;x.cn++;x.csec+=a.sec||0}}));return Object.values(m).map(x=>{const acc=(x.c+2)/(x.n+4),tar=x.target/Math.max(1,x.n),avg=x.cn?x.csec/x.cn:tar*1.4,sp=Math.max(0,Math.min(1,tar/Math.max(1,avg)));return {...x,accuracy:Math.round(acc*100),avgSec:Math.round(avg),mastery:Math.round(100*(.85*acc+.15*sp))}})}
function mastery(pid,t,s){return stats(pid,t).find(x=>x.skill===s)?.mastery??50}
function trackMastery(pid,t,subject=null){const a=stats(pid,t,subject);return a.length?Math.round(a.reduce((z,x)=>z+x.mastery,0)/a.length):50}
function used(pid){const m={};state.history.filter(h=>h.profileId===pid).forEach(h=>(h.answers||[]).forEach(a=>m[a.qid]=(m[a.qid]||0)+1));return m}
function rnd(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function weightedSelect(pid,t,n,mode,b){if(!b.length)return[];const skills=[...new Set(b.map(q=>q.skill))],sm={};skills.forEach(s=>sm[s]=mastery(pid,t,s));if(mode==="speed")b=b.filter(q=>(sm[q.skill]??50)>=80);const u=used(pid),r=rnd((Date.now()+n+b.length)&0xffffffff);let a=b.map(q=>{const m=sm[q.skill]??50;let w=m<65?6:m<82?3.2:1.2;if(!u[q.id])w*=2.8;else w/=1+Math.min(4,u[q.id]*.75);const wanted=m<60?2:m<80?3:4;w*=1/(1+Math.abs((q.difficulty||2)-wanted)*.35);return {q,w,k:Math.pow(r(),1/Math.max(.1,w))}}).sort((x,y)=>y.k-x.k),out=[],fam={};for(const x of a){const f=x.q.family||x.q.skill,cap=Math.max(2,Math.ceil(n*.3));if((fam[f]||0)>=cap)continue;out.push(x.q);fam[f]=(fam[f]||0)+1;if(out.length>=n)break}if(out.length<n)for(const x of a){if(!out.includes(x.q)){out.push(x.q);if(out.length>=n)break}}return out}
function selectSchool(pid,t,n,mode,subject=null){if(subject)return schoolSubjectSelect(pid,t,subject,n,mode);const subs=T[t].subjects,base=Math.floor(n/subs.length),rem=n%subs.length,out=[];subs.forEach((s,i)=>out.push(...schoolSubjectSelect(pid,t,s,base+(i<rem?1:0),mode)));return out.sort(()=>Math.random()-.5)}
function randomizeQuestionOptions(q){
 if(q?.track!=="m3"||!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.answer))return q;
 const pairs=q.options.map((value,index)=>({value,index}));
 for(let i=pairs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]]}
 const answer=pairs.findIndex(x=>x.index===q.answer);
 return {...q,options:pairs.map(x=>x.value),answer};
}
function prepareSessionQuestions(pid,qs){return pid==="p2"?qs.map(randomizeQuestionOptions):qs.slice()}
function countByTrack(){const c={quant:0,verbal:0,step:0,m3:0,g5:0};allBank().forEach(q=>{if(c[q.track]!==undefined)c[q.track]++});return c}
function recentErrors(limit=8){const a=[];state.history.slice().reverse().forEach(h=>(h.answers||[]).slice().reverse().forEach(x=>{if(!x.correct&&a.length<limit)a.push({...x,pid:h.profileId})}));return `<div class="card"><div class="row between"><div class="title">أحدث الأخطاء</div><button class="btn light sm" onclick="errorNotebook()">دفتر الأخطاء</button></div>${a.length?a.map(x=>`<div class="skillrow"><b>${esc(profile(x.pid)?.name||"")} • ${esc(name(x.track))}${x.subject?" • "+esc(x.subject):""}</b><div>${esc(x.skill)}</div><div class="sub">${esc(x.text)}</div></div>`).join(""):"<p class='sub'>لا توجد أخطاء بعد.</p>"}</div>`}
window.parentHome=function(){clearTimer();const c=countByTrack();page(`${top("لوحة ولي الأمر")}<div class="nav"><button class="btn blue sm" onclick="accountHome()">الرئيسية</button><button class="btn orange sm" onclick="scopeCenter('m3')">نطاق ثالث متوسط</button><button class="btn orange sm" onclick="scopeCenter('g5')">نطاق خامس</button><button class="btn light sm" onclick="bankExplorer()">البنك</button><button class="btn violet sm" onclick="updatesCenter()">تحديث بنك</button><button class="btn red sm" onclick="errorNotebook()">دفتر الأخطاء</button><button class="btn green sm" onclick="remedialCenter()">الخطة العلاجية</button><button class="btn light sm" onclick="settings()">الإعدادات</button></div><div class="card"><div class="grid g5"><div class="stat"><span>كمي</span><b>${c.quant}</b></div><div class="stat"><span>لفظي</span><b>${c.verbal}</b></div><div class="stat"><span>STEP</span><b>${c.step}</b></div><div class="stat"><span>ثالث</span><b>${c.m3}</b></div><div class="stat"><span>خامس</span><b>${c.g5}</b></div></div></div><div class="grid g3">${state.profiles.map(profileCard).join("")}</div>${recentErrors()}`)};
function profileCard(p){let body="";if(p.kind==="aptitude")body=`<div class="grid g3">${p.tracks.map(t=>`<div class="stat"><span>${esc(T[t].short)}</span><b>${trackMastery(p.id,t)}%</b></div>`).join("")}</div>`;else{const t=p.tracks[0];body=`<div class="grid ${T[t].subjects.length>2?'g4':'g2'}">${T[t].subjects.map(s=>`<div class="stat"><span>${esc(s)}</span><b>${trackMastery(p.id,t,s)}%</b></div>`).join("")}</div>`}return `<div class="card"><div class="row between"><div class="title">${esc(p.name)}</div><span class="pill">${state.history.filter(h=>h.profileId===p.id).length} جلسة</span></div>${body}<button class="btn light" onclick="analytics('${p.id}')">تحليل المهارات</button></div>`}
function scopeSummary(t){return T[t].subjects.map(s=>{const a=sections(t,s),cur=Number(state.scope[t][s]||0),x=a.find(z=>z.order===cur);return `<span class="pill">${esc(s)}: ${esc(x?.lesson||'لم يبدأ')}</span>`}).join(' ')}
function trackCard(pid,t){const b=eligible(t),m=trackMastery(pid,t),w=stats(pid,t).sort((a,b)=>a.mastery-b.mastery).slice(0,3);return `<div class="card"><div class="row between"><div class="title">${esc(name(t))}</div><span class="pill">${m}%</span></div><div class="sub">المتاح: ${b.length} سؤال</div><div class="progress"><span style="width:${m}%"></span></div><div class="small">${w.length?'الأولوية: '+w.map(x=>`${esc(x.skill)} ${x.mastery}%`).join(' • '):'سيبدأ بتحديد المستوى.'}</div><div class="row"><button class="btn blue" ${b.length?'':'disabled'} onclick="setupExam('${pid}','${t}','weekly','')">اختبار</button><button class="btn light" ${b.length?'':'disabled'} onclick="setupExam('${pid}','${t}','practice','')">تدريب</button><button class="btn orange" ${b.length?'':'disabled'} onclick="setupExam('${pid}','${t}','speed','')">سرعة</button></div></div>`}
function subjectCard(pid,t,s){const b=eligible(t,s),m=trackMastery(pid,t,s),cur=sections(t,s).find(x=>x.order===Number(state.scope[t][s]||0));return `<div class="card"><div class="row between"><div class="title">${esc(s)}</div><span class="pill">إتقان ${m}%</span></div><div class="sub">حتى: ${esc(cur?.lesson||'لم يبدأ')} • ${b.length} سؤال</div><div class="progress"><span style="width:${m}%"></span></div><div class="row"><button class="btn blue" ${b.length?'':'disabled'} onclick="setupExam('${pid}','${t}','weekly','${esc(s)}')">اختبار</button><button class="btn light" ${b.length?'':'disabled'} onclick="setupExam('${pid}','${t}','practice','${esc(s)}')">تدريب</button></div></div>`}
window.startWeekly=function(pid){const p=profile(pid);let qs=[];if(p.kind==='aptitude'){qs.push(...weightedSelect(pid,'quant',20,'weekly',eligible('quant')),...weightedSelect(pid,'verbal',20,'weekly',eligible('verbal')),...weightedSelect(pid,'step',20,'weekly',eligible('step')))}else{const t=p.tracks[0],n=T[t].weekly;qs=selectSchool(pid,t,n,'weekly')}if(!qs.length)return alert('لا توجد أسئلة مناسبة ضمن النطاق الحالي');qs.sort(()=>Math.random()-.5);qs=prepareSessionQuestions(pid,qs);session={id:'WK_'+Date.now(),profileId:pid,track:'weekly',mode:'weekly',questions:qs,index:0,answers:[],startedAt:Date.now(),selected:null};state.currentExam=session;save();renderQ()};
window.setupExam=function(pid,t,mode,subject){const b=T[t]?.subjects?eligible(t,subject||null):eligible(t);const speedOK=mode!=='speed'||[...new Set(b.map(q=>q.skill))].some(s=>mastery(pid,t,s)>=80);page(`${top("إعداد "+(subject?subject:name(t)),`studentHome('${pid}')`)}<div class="card"><div class="field"><label>عدد الأسئلة</label><input id="cnt" type="number" min="5" max="${Math.max(5,b.length)}" value="${Math.min(subject?10:20,Math.max(5,b.length))}"></div><div class="info">يُعطي المحرك أولوية للمهارات الأضعف وللأسئلة غير المستخدمة قدر الإمكان.</div><button class="btn blue" ${!b.length||!speedOK?'disabled':''} onclick="startExam('${pid}','${t}','${mode}','${esc(subject||'')}')">ابدئي</button></div>`) };
window.startExam=function(pid,t,mode,subject){const n=Math.max(5,+$("cnt").value||10);let qs=T[t]?.subjects?selectSchool(pid,t,n,mode,subject||null):weightedSelect(pid,t,n,mode,eligible(t));if(!qs.length)return alert('لا توجد أسئلة مناسبة');qs=prepareSessionQuestions(pid,qs);session={id:'EX_'+Date.now(),profileId:pid,track:t,subject:subject||'',mode,questions:qs,index:0,answers:[],startedAt:Date.now(),selected:null};state.currentExam=session;save();renderQ()};
window.resumeExam=function(){if(!guard()||state.currentExam?.profileId!==activePid)return;session=state.currentExam;if(session){if(session.answerLocked)advance();else renderQ()}};window.discardExam=function(pid){if(confirm('إلغاء الاختبار غير المكتمل؟')){state.currentExam=null;save();studentHome(pid)}};
function renderQ(){session.answerLocked=false;clearTimer();const q=session.questions[session.index],n=session.questions.length;session.qStartedAt=Date.now();state.currentExam=session;save();page(`<div class="card sticky"><div class="row between"><div><b>${session.mode==='remedial'?'تدريب علاجي':session.mode==='weekly'?'اختبار الأسبوع':esc(name(q.track))}</b><div class="sub">سؤال ${questionDisplay(q,session.index+1)}/${questionDisplay(q,n)}${q.subject?' • '+esc(q.subject):''} • ${esc(q.skill)}</div></div><div id="clock" class="clock">00:00</div></div><div class="progress"><span style="width:${100*session.index/n}%"></span></div></div><div class="card"><div class="row"><span class="pill">صعوبة ${questionDisplay(q,q.difficulty||2)}/${questionDisplay(q,5)}</span><span class="pill">هدف ${questionDisplay(q,q.targetSec||60)}ث</span>${q.meta?.lesson?`<span class="pill">${esc(q.meta.lesson)}</span>`:''}</div><div class="qtext">${esc(questionDisplay(q,q.text)).replace(/\n/g,'<br>')}</div><div class="answers">${q.options.map((o,i)=>`<button id="ans${i}" class="answer" onclick="selectAnswer(${i})"><b>${['أ','ب','ج','د'][i]||i+1}</b> — ${esc(questionDisplay(q,o))}</button>`).join('')}</div><div id="feed"></div><div class="row"><button id="next" class="btn blue" disabled onclick="submitAnswer(false)">التالي</button><button class="btn light" onclick="abortExam()">حفظ وخروج</button></div></div>`);startTimer(q)}
window.selectAnswer=function(i){session.selected=i;document.querySelectorAll('.answer').forEach(x=>x.classList.remove('selected'));$('ans'+i).classList.add('selected');$('next').disabled=false};
window.submitAnswer=function(timeout=false){if(session.selected==null&&!timeout)return;if(session.answerLocked)return;session.answerLocked=true;const q=session.questions[session.index],sec=Math.max(1,Math.round((Date.now()-session.qStartedAt)/1000)),sel=timeout?-1:session.selected,correct=sel===q.answer;session.answers.push({qid:q.id,track:q.track,skill:q.skill,subject:q.subject||'',text:q.text,correct,sec,targetSec:q.targetSec||60,selected:sel,options:q.options,answer:q.answer,explanation:q.explanation});recordUnified({module:"exam",track:q.track,subject:q.subject,skill:q.skill,text:q.text,selected:q.options[sel]??"انتهى الوقت",correctText:q.options[q.answer],explanation:q.explanation,correct,question:q,sec});if(['practice','remedial'].includes(session.mode)&&!timeout){document.querySelectorAll('.answer').forEach((x,i)=>{x.disabled=true;if(i===q.answer)x.classList.add('correct');if(i===sel&&!correct)x.classList.add('wrong')});$('feed').innerHTML=`<div class="${correct?'success':'warning'}"><b>${correct?'صحيح':'غير صحيح'}</b><div>${esc(questionDisplay(q,q.explanation||''))}</div></div>`;$('next').textContent=session.index===session.questions.length-1?'إنهاء':'السؤال التالي';$('next').onclick=advance}else advance();state.currentExam=session.index<session.questions.length?session:null;save()};
function advance(){session.answerLocked=false;session.index++;session.selected=null;if(session.index>=session.questions.length)finish();else renderQ()}
function finish(){clearTimer();const c=session.answers.filter(x=>x.correct).length,n=session.answers.length,score=Math.round(100*c/Math.max(1,n)),sec=Math.round((Date.now()-session.startedAt)/1000),pid=session.profileId,weak={};session.answers.filter(x=>!x.correct).forEach(x=>weak[x.skill]=(weak[x.skill]||0)+1);state.history.push({id:session.id,profileId:pid,track:session.track,mode:session.mode,score,totalSec:sec,finishedAt:Date.now(),answers:session.answers});if(session.remedial){const pr=progressFor(session.remedial.packId);pr.attempts[session.remedial.dayNo]=(pr.attempts[session.remedial.dayNo]||0)+1;if(score>=70&&!pr.completedDays.includes(Number(session.remedial.dayNo)))pr.completedDays.push(Number(session.remedial.dayNo))}state.currentExam=null;save();const groups={};session.answers.forEach(a=>{const k=a.subject||T[a.track]?.short||a.track;if(!groups[k])groups[k]={n:0,c:0};groups[k].n++;if(a.correct)groups[k].c++});page(`${top('النتيجة',`studentHome('${pid}')`)}<div class="card"><div class="grid g3"><div class="stat"><span>النتيجة</span><b>${score}%</b></div><div class="stat"><span>صحيح</span><b>${c}/${n}</b></div><div class="stat"><span>الوقت</span><b>${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}</b></div></div></div><div class="card"><div class="title">التفصيل</div><div class="grid g4">${Object.entries(groups).map(([k,v])=>`<div class="stat"><span>${esc(k)}</span><b>${v.c}/${v.n}</b></div>`).join('')}</div></div>${session.remedial?`<div class="card ${score>=70?'success':'warning'}"><b>${score>=70?'تم اجتياز تدريب اليوم':'يحتاج تدريب اليوم إلى إعادة'}</b><div>الهدف 70% على الأقل.</div></div>`:''}<div class="card"><div class="title">الأولوية القادمة</div>${Object.keys(weak).length?Object.entries(weak).map(([s,x])=>`<div class="skillrow"><b>${esc(s)}</b><div class="sub">${x} خطأ: سترتفع أولوية هذه المهارة.</div></div>`).join(''):"<div class='success'>لا أخطاء؛ سيرفع المحرك الصعوبة تدريجيًا.</div>"}</div>`) }
window.abortExam=function(){if(confirm('الخروج؟ الإجابات التي حُلّت محفوظة في سجل الأخطاء.')){const p=session.profileId;state.currentExam=null;save();studentHome(p)}};
function startTimer(q){clearTimer();timer=setInterval(()=>{const c=$('clock');if(!c)return;const s=Math.round((Date.now()-session.qStartedAt)/1000);c.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;if(session.mode==='speed'&&s>=(q.targetSec||60)){clearTimer();submitAnswer(true)}},500)}function clearTimer(){if(timer){clearInterval(timer);timer=null}}
window.bankExplorer=function(){const b=allBank(),tracks=['quant','verbal','step','m3','g5'];page(`${top('بنك الأسئلة','accountHome()')}<div class="card info"><b>فهرس المنهج منفصل عن عدد الأسئلة.</b><div class="sub">الفصلان الأول والثاني موجودان كاملين في فهرس ثالث متوسط وخامس. عدد الأسئلة أدناه هو المحتوى التدريبي الفعلي الحالي، ويمكن زيادته بحزم لاحقة دون تغيير فهرس المنهج.</div></div>${tracks.map(t=>{const q=b.filter(x=>x.track===t);if(!q.length&&!T[t]?.subjects)return'';if(!T[t]?.subjects){const m={};q.forEach(x=>m[x.skill]=(m[x.skill]||0)+1);return `<div class="card"><div class="row between"><div class="title">${esc(name(t))}</div><span class="pill">${q.length}</span></div>${Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,40).map(([s,n])=>`<div class="skillrow row between"><span>${esc(s)}</span><b>${n}</b></div>`).join('')}</div>`}return `<div class="card"><div class="row between"><div class="title">${esc(name(t))}</div><span class="pill">${q.length} سؤال</span></div>${T[t].subjects.map(s=>`<div class="skillrow"><b>${esc(s)}</b><div class="sub">${q.filter(x=>x.subject===s).length} سؤال • ${catalogCount(t,s)} قسم/درس في فهرس الفصلين</div></div>`).join('')}</div>`}).join('')}`) };
function applyPack(d){if(!d||!Array.isArray(d.questions)||!['adaptive-question-update','adaptive-curriculum-pack','adaptive-term-update','adaptive-central-pack'].includes(d.packType))throw new Error('ملف التحديث غير صالح');const m=new Map(state.externalQuestions.map(q=>[q.id,q]));let added=0,updated=0;d.questions.forEach((q,i)=>{const x={...q,id:q.id||`${d.packId||'PACK'}_${i}`,family:q.family||q.skill};if(['m3','g5'].includes(x.track)){x.meta={...(x.meta||{})};x.meta.term=Number(x.meta.term||x.meta.semester||d.term||d.semester||1);x.meta.unitOrder=Number(x.meta.unitOrder||1);x.meta.lessonOrder=Number(x.meta.lessonOrder||x.meta.sectionOrder||1);}if(!x.track||!x.skill||!x.text||!Array.isArray(x.options)||!Number.isInteger(x.answer))return;if(m.has(x.id))updated++;else added++;m.set(x.id,x)});state.externalQuestions=[...m.values()];const id=d.packId||('pack_'+Date.now()),rec={packId:id,count:d.questions.length,date:d.date||new Date().toISOString().slice(0,10)},j=state.appliedPacks.findIndex(p=>p.packId===id);if(j>=0)state.appliedPacks[j]=rec;else state.appliedPacks.push(rec);normalize();save();return{added,updated}}
window.updatesCenter=function(){page(`${top('تحديث البنك','accountHome()')}<div class="card info"><b>لا تحتاج لإضافة وحدات الفصل الثاني لاحقًا؛ فهرس الفصلين 1 و2 محمل مسبقًا.</b><div class="sub">هذه الصفحة أصبحت لإضافة أو تحسين <b>الأسئلة</b> فقط. حزم ثالث متوسط وخامس يمكنها ربط كل سؤال بالفصل والوحدة والقسم بواسطة meta.term وmeta.unitOrder وmeta.lessonOrder وmeta.lesson، ولن تمسح النتائج السابقة.</div></div><div class="card"><div class="field"><label>ملف JSON</label><input id="updateFile" type="file" accept=".json,application/json"></div><button class="btn violet" onclick="applyUpdateFile()">تطبيق تحديث الأسئلة</button></div><div class="card"><div class="title">التحديثات المثبتة</div>${state.appliedPacks.length?state.appliedPacks.slice().reverse().map(p=>`<div class="skillrow"><b>${esc(p.packId)}</b><div class="sub">${p.count} سؤال • ${esc(p.date||'')}</div></div>`).join(''):"<p class='sub'>لا توجد تحديثات خارجية بعد.</p>"}</div>`) };
window.applyUpdateFile=async function(){const f=$('updateFile').files[0];if(!f)return alert('اختر ملفًا');try{const r=applyPack(JSON.parse(await f.text()));alert(`تم: ${r.added} جديد، ${r.updated} تحديث`);updatesCenter()}catch(e){alert(e.message)}};
function questionMap(){return new Map([...BANK,...state.externalQuestions].map(q=>[q.id,q]))}
function errorRows(pid='all',track='all',days='7'){const qm=questionMap(),rows=[],cut=days==='all'?0:Date.now()-Number(days)*864e5;state.history.forEach(h=>{if(pid!=='all'&&h.profileId!==pid)return;if((h.finishedAt||0)<cut)return;(h.answers||[]).forEach(a=>{if(a.correct)return;if(track!=='all'&&a.track!==track)return;const q=qm.get(a.qid),selected=a.selected===-1?'انتهى الوقت':(q?.options?.[a.selected]??'غير معروف'),correct=q?.options?.[q.answer]??'غير معروف';rows.push({date:new Date(h.finishedAt||Date.now()).toISOString(),profileId:h.profileId,profileName:profile(h.profileId)?.name||h.profileId,track:a.track,trackName:name(a.track),subject:a.subject||q?.subject||'',skill:a.skill||q?.skill||'',qid:a.qid,text:a.text||q?.text||'',selectedText:selected,correctText:correct,explanation:q?.explanation||'',seconds:a.sec||0,targetSec:a.targetSec||q?.targetSec||60})})});return rows.sort((a,b)=>b.date.localeCompare(a.date))}
function dl(obj,name){const b=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
window.refreshErrors=function(){const rows=errorRows($('errPid')?.value||'all',$('errTrack')?.value||'all',$('errDays')?.value||'7');$('errView').innerHTML=`<div class="card"><div class="title">${rows.length} خطأ</div>${rows.length?`<div style="overflow:auto"><table><thead><tr><th>الطالبة</th><th>المسار</th><th>المادة</th><th>المهارة</th><th>السؤال</th><th>إجابتها</th><th>الصحيح</th></tr></thead><tbody>${rows.slice(0,250).map(r=>`<tr><td>${esc(r.profileName)}</td><td>${esc(r.trackName)}</td><td>${esc(r.subject)}</td><td>${esc(r.skill)}</td><td>${esc(r.text)}</td><td class="redText">${esc(r.selectedText)}</td><td>${esc(r.correctText)}</td></tr>`).join('')}</tbody></table></div>`:"<p class='sub'>لا توجد أخطاء ضمن الفلتر.</p>"}</div>`};
window.exportErrors=function(){const pid=$('errPid').value,track=$('errTrack').value,days=$('errDays').value,rows=errorRows(pid,track,days);dl({reportType:'adaptive-v10-error-report',generatedAt:new Date().toISOString(),profile:pid,track,days,errors:rows},`Errors_V10_${new Date().toISOString().slice(0,10)}.json`)};
function progressFor(id){if(!state.remedialProgress[id])state.remedialProgress[id]={completedDays:[],attempts:{}};return state.remedialProgress[id]}
function remedialPlanFor(pid){return state.remedialPlans.filter(p=>!p.profileId||p.profileId===pid).sort((a,b)=>String(b.importedAt||'').localeCompare(String(a.importedAt||'')))[0]||null}
function studentRemedialCard(pid){const p=remedialPlanFor(pid);if(!p)return'';const pr=progressFor(p.packId),days=p.days||[],next=days.find(d=>!pr.completedDays.includes(Number(d.day)));if(!next)return `<div class="card success"><b>الخطة العلاجية مكتملة.</b><div>${esc(p.title||'')}</div></div>`;return `<div class="card violetBox"><div class="row between"><div><div class="title">تدريب اليوم</div><div class="sub">${esc(p.title||'خطة علاجية')} • اليوم ${next.day}</div></div><button class="btn violet" onclick="openRemedial('${p.packId}',${Number(next.day)},'${pid}')">ابدئي</button></div><b>${esc(next.title||'مراجعة')}</b></div>`}
window.remedialCenter=function(){page(`${top('الخطة العلاجية','accountHome()')}<div class="card info"><b>استورد خطة علاجية بصيغة adaptive-remedial-pack.</b></div><div class="card"><div class="field"><label>ملف الخطة</label><input id="remFile" type="file" accept=".json,application/json"></div><button class="btn violet" onclick="importRemedialPack()">استيراد</button></div><div class="card"><div class="title">الخطط المثبتة</div>${state.remedialPlans.length?state.remedialPlans.slice().reverse().map(p=>`<div class="skillrow"><b>${esc(p.title||p.packId)}</b><div class="sub">${esc(profile(p.profileId)?.name||'كل الطالبات')} • ${(progressFor(p.packId).completedDays||[]).length}/${(p.days||[]).length} أيام</div></div>`).join(''):"<p class='sub'>لا توجد خطة بعد.</p>"}</div>`) };
window.importRemedialPack=async function(){const f=$('remFile').files[0];if(!f)return alert('اختر ملفًا');try{const d=JSON.parse(await f.text());if(d.packType!=='adaptive-remedial-pack'||!Array.isArray(d.days))throw new Error('ملف خطة غير صالح');d.packId=d.packId||('rem_'+Date.now());d.importedAt=new Date().toISOString();const i=state.remedialPlans.findIndex(x=>x.packId===d.packId);if(i>=0)state.remedialPlans[i]=d;else state.remedialPlans.push(d);save();alert('تم استيراد الخطة');remedialCenter()}catch(e){alert(e.message)}};
window.openRemedial=function(packId,dayNo,pid){const p=state.remedialPlans.find(x=>x.packId===packId),d=p?.days?.find(x=>Number(x.day)===Number(dayNo));if(!d)return;page(`${top('تدريب اليوم',`studentHome('${pid}')`)}<div class="card"><div class="title">${esc(d.title||'مراجعة')}</div><div class="info">${esc(d.explanation||'').replace(/\n/g,'<br>')}</div>${(d.steps||[]).map((x,i)=>`<div class="skillrow"><b>${i+1}.</b> ${esc(x)}</div>`).join('')}<button class="btn violet" onclick="startRemedialExam('${packId}',${dayNo},'${pid}')">ابدئي الأسئلة</button></div>`) };
window.startRemedialExam=function(packId,dayNo,pid){const p=state.remedialPlans.find(x=>x.packId===packId),d=p?.days?.find(x=>Number(x.day)===Number(dayNo)),qs=(d?.questions||[]).map((q,i)=>({...q,id:q.id||`${packId}_D${dayNo}_Q${i+1}`,track:q.track||'remedial',subject:q.subject||'علاجي',skill:q.skill||d.title||'علاج',difficulty:q.difficulty||1,targetSec:q.targetSec||90,family:q.family||q.skill||d.title||'علاج'}));if(!qs.length)return alert('لا توجد أسئلة في هذا اليوم');qs=prepareSessionQuestions(pid,qs);session={id:'RX_'+Date.now(),profileId:pid,track:'remedial',mode:'remedial',questions:qs,index:0,answers:[],startedAt:Date.now(),selected:null,remedial:{packId,dayNo}};state.currentExam=session;save();renderQ()};
window.backup=function(){dl(state,'adaptive_v10_backup.json')};window.restoreData=async function(e){try{const d=JSON.parse(await e.target.files[0].text());if(!d.profiles||!d.history)throw new Error('ملف غير صالح');state=d;normalize();save();alert('تمت الاستعادة');settings()}catch(x){alert(x.message)}};
window.addEventListener('error',e=>{const f=$('fatal');if(f){f.style.display='block';f.textContent='خطأ تشغيل: '+(e.message||'غير معروف')}});

// One profile gate, one curriculum scope and one immutable answer journal.
let activePid=null, confirmed=new Set();
const JOURNAL='girls_study_answers_v1';
let journal=[];
try{journal=JSON.parse(localStorage.getItem(JOURNAL)||'[]');if(!Array.isArray(journal))journal=[]}catch{}
const LABELS={p1:'جنى',p2:'جمانة',p3:'حكمة'};
function persistJournal(){try{const disk=JSON.parse(localStorage.getItem(JOURNAL)||"[]");journal=[...new Map([...disk,...journal].map(x=>[x.id,x])).values()];localStorage.setItem(JOURNAL,JSON.stringify(journal));return true}catch(e){alert('تعذر حفظ السجل. نزّلي نسخة احتياطية قبل إغلاق الصفحة.');return false}}
function recordUnified(a,pid=activePid){if(!LABELS[pid])return;const row={...a,pid,id:a.id||('a_'+Date.now()+'_'+Math.random().toString(36).slice(2)),time:a.time||Date.now()};if(journal.some(x=>x.id===row.id))return;journal.push(row);persistJournal()}
function migrateUnified(){
 state.profiles.forEach(p=>{p.name=LABELS[p.id]||p.name});
 if(!state.unifiedMigrated){
  const qm=questionMap();
  state.history.forEach(h=>(h.answers||[]).forEach((a,i)=>{const q=qm.get(a.qid);journal.push({id:'old_'+h.id+'_'+i,pid:h.profileId,time:h.finishedAt||Date.now(),module:'exam',track:a.track,subject:a.subject,skill:a.skill,text:a.text||q?.text||'',selected:a.options?.[a.selected]??q?.options?.[a.selected]??'الإجابة القديمة غير محفوظة',correctText:a.options?.[a.answer]??q?.options?.[q.answer]??'غير محفوظ',explanation:a.explanation||q?.explanation||'',correct:!!a.correct,sec:a.sec,question:q})}));
  try{const old=JSON.parse(localStorage.getItem('aptitude_step_trainer_v1')||'null');if(old){localStorage.setItem('girls_module_p1_aptitude_step_trainer_v1',JSON.stringify(old));(old.mistakes||[]).forEach((x,i)=>journal.push({id:'old_trainer_'+i+'_'+x.time,pid:'p1',time:x.time||Date.now(),module:'trainer',skill:x.skill,text:x.q,selected:'الإجابة القديمة غير محفوظة',correctText:x.answer,explanation:x.explanation,correct:false}))}}catch{}
  try{const old=localStorage.getItem('grade5_book_only_quiz_v013');if(old)localStorage.setItem('girls_module_p3_grade5_book_only_quiz_v013',old)}catch{}
  journal=[...new Map(journal.map(x=>[x.id,x])).values()];persistJournal();state.unifiedMigrated=true;save();
 }
}
function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Riyadh'})}
window.home=function(){clearTimer();activePid=null;page(`${warn()}<header class="welcome"><span class="eyebrow">مساحة واحدة للتعلّم</span><h1>دراستنا<span>خطوة صغيرة، كل يوم.</span></h1><p>اختاري اسمك، حددي أين وصلتِ، ثم ابدئي.</p></header><div class="profile-grid">${state.profiles.map((p,i)=>`<button class="profile-card tone${i}" onclick="enterProfile('${p.id}')"><span class="avatar">${['ج','ج','ح'][i]}</span><span class="profile-name">${esc(p.name)}</span><span class="profile-description">${['القدرات • STEP • جدول الضرب','ثالث متوسط • الاختبارات المركزية','خامس • رياضيات وإنجليزي • جدول الضرب'][i]}</span><span class="profile-arrow">دخول ←</span></button>`).join('')}</div><div class="footer-note">السجلات محفوظة على هذا الجهاز. لمراجعة الأخطاء افتح ملف الطالبة.</div><div class="row"><button class="btn light sm" onclick="dataCenter()">نسخة احتياطية واستيراد</button></div>`)};
window.enterProfile=function(pid){if(state.currentExam){state.pendingExams=state.pendingExams||{};state.pendingExams[state.currentExam.profileId]=state.currentExam}activePid=pid;state.currentExam=state.pendingExams?.[pid]||null;confirmed.delete(pid);entryGate(pid)};
window.accountHome=function(){if(activePid)studentHome(activePid);else home()};
function gateHead(pid){return `${top('أين وصلتِ يا '+LABELS[pid]+'؟','home()')}<div class="card hero"><div class="title">قبل أن تبدئي</div><p>حددي آخر درس درستِه في كل مادة. في الزيارة التالية يمكنك تأكيد نفس الموضع أو تحديثه.</p><div class="sub">تغيير موضع المنهج لا يمسح نتائجك أو أخطاءك.</div></div>`}
window.entryGate=function(pid){
 activePid=pid;const p=profile(pid);
 if(p.kind==='aptitude'){
  const old=state.aptitudeScope||{};
  page(gateHead(pid)+`<form onsubmit="confirmAptitude(event)"><div class="card"><p>القدرات وSTEP مهارات تدريبية؛ حددي موضعك في المذاكرة لكل مسار.</p>${p.tracks.map(t=>`<div class="field"><label for="apt_${t}">${name(t)}</label><select id="apt_${t}" required><option value="">اختاري آخر مهارة وصلتِ إليها</option><option value="begin" ${old[t]==='begin'?'selected':''}>أبدأ من الأساسيات</option>${[...new Set(allBank().filter(q=>q.track===t).map(q=>q.skill))].map(s=>`<option value="${esc(s)}" ${old[t]===s?'selected':''}>${esc(s)}</option>`).join('')}<option value="review" ${old[t]==='review'?'selected':''}>مراجعة شاملة</option></select></div>`).join('')}<div class="sub">اختيار المهارة يحدد تدريبك المقترح، ويمكنك الانتقال لبقية مهارات القدرات.</div></div><button class="btn blue" type="submit">تأكيد والبدء</button></form>`);return;
 }
 const t=p.tracks[0];page(gateHead(pid)+`<form onsubmit="confirmSchool(event,'${pid}')">${T[t].subjects.map((s,i)=>`<div class="card field"><label for="scope_${i}">${s}</label><select id="scope_${i}" required><option value="">اختاري موضع المنهج</option>${scopeOptions(sections(t,s),state.scope[t][s]).replace('<option value="0">لم يبدأ بعد</option>','<option value="0" '+(state.scope[t][s]===0?'selected':'')+'>لم نبدأ المادة بعد</option>')}</select></div>`).join('')}<button class="btn blue" type="submit">تأكيد المنهج والبدء</button></form>`)
};
window.confirmAptitude=function(e){e.preventDefault();state.aptitudeScope={};for(const t of ['quant','verbal','step']){const v=$('apt_'+t).value;if(!v)return;state.aptitudeScope[t]=v}state.scopeConfirmedAt={...state.scopeConfirmedAt,p1:Date.now()};save();confirmed.add('p1');studentHome('p1')};
window.confirmSchool=function(e,pid){e.preventDefault();const t=profile(pid).tracks[0],next={};for(const [i,s] of T[t].subjects.entries()){const el=$('scope_'+i);if(el.value==='')return;next[s]=Number(el.value)}const changed=JSON.stringify(state.scope[t])!==JSON.stringify(next);state.scope[t]=next;state.scopeConfirmedAt={...state.scopeConfirmedAt,[pid]:Date.now()};if(changed&&state.currentExam?.profileId===pid){state.currentExam=null;session=null}save();confirmed.add(pid);studentHome(pid)};
function guard(pid=activePid){if(!pid||!confirmed.has(pid)){if(pid)entryGate(pid);else home();return false}return true}
function summary(pid){const rows=journal.filter(x=>x.pid===pid),graded=rows.filter(x=>!x.manual),right=graded.filter(x=>x.correct).length,errors=rows.filter(x=>!x.correct).length;return `<div class="grid g3 mini-stats"><div class="stat"><span>إجابات مسجلة</span><b>${rows.length.toLocaleString('ar-SA')}</b></div><div class="stat"><span>دقة الإجابات المصححة آليًا</span><b>${graded.length?Math.round(100*right/graded.length)+'٪':'—'}</b></div><div class="stat"><span>محاولات تحتاج مراجعة</span><b>${errors.toLocaleString('ar-SA')}</b></div></div>`}
function coverage(t,s){const cur=state.scope[t][s],pool=eligible(t,s),exact=pool.filter(q=>academicOrder(q)===cur);return !cur?'لم تبدأ المادة بعد':!pool.length?'لا توجد أسئلة في النطاق المحدد بعد':!exact.length?'لا توجد أسئلة للدرس المحدد في بنك التدريب؛ المتاح مراجعة لما سبق':`${pool.length.toLocaleString('ar-SA')} سؤال في نطاقك • ${exact.length.toLocaleString('ar-SA')} للدرس الحالي`}
window.studentHome=function(pid){
 activePid=pid;if(!guard(pid))return;clearTimer();const p=profile(pid);
 let h=`${top('مرحبًا '+p.name,'home()')}<div class="nav"><button class="btn orange sm" onclick="entryGate('${pid}')">أين وصلتِ؟</button><button class="btn light sm" onclick="profileErrors()">أخطائي ونتائجي</button><button class="btn light sm" onclick="dataCenter()">الحفظ والاستيراد</button></div>${summary(pid)}`;
 if(state.currentExam?.profileId===pid)h+=`<div class="card success"><b>لديك تدريب غير مكتمل</b><button class="btn green" onclick="resumeExam()">متابعة التدريب</button></div>`;
 h+=studentRemedialCard(pid);
 if(pid==='p1'){
  h+=`<div class="grid g3">${p.tracks.map(t=>`<div class="card subject"><span class="pill">${esc(state.aptitudeScope?.[t]||'الأساسيات')}</span><h2>${name(t)}</h2><button class="btn blue" onclick="focusedPractice('${t}')">تدريب اليوم</button><button class="btn light" onclick="startPractice('p1','${t}','practice')">مراجعة متنوعة</button></div>`).join('')}</div><div class="grid g2"><div class="card"><h2>القواعد والمفردات</h2><p>المدرّب: شرح القواعد، الكلمات، المرادفات والأضداد والتدريب المتدرج.</p><button class="btn violet" onclick="openModule('trainer')">افتحي المدرّب</button></div>${multiplyCard()}</div>`;
 }else{
  const t=p.tracks[0];h+=`<div class="grid g2">${T[t].subjects.map(s=>`<div class="card subject"><span class="pill">${esc(sections(t,s).find(x=>x.order===state.scope[t][s])?.lesson||'لم تبدأ بعد')}</span><h2>${s}</h2><p class="small">${coverage(t,s)}</p><button class="btn blue" ${!eligible(t,s).length?'disabled':''} onclick="startPractice('${pid}','${t}','practice','${s}')">تدريب المنهج</button>${pid==='p3'?`<button class="btn light" ${!state.scope[t][s]?'disabled':''} onclick="openModule('book','${s==='الرياضيات'?'math':'english'}')">أسئلة الكتاب بصفحاتها</button>`:''}</div>`).join('')}</div>`;
  if(pid==='p3')h+=`<div class="grid g2">${multiplyCard()}<div class="card"><h2>شرح الرياضيات خطوة بخطوة</h2><p>المنازل، الصيغ، الكسور العشرية والجمع والطرح ذهنيًا، بحسب الدروس التي وصلتِ إليها.</p><button class="btn violet" ${state.scope.g5['الرياضيات']?'':'disabled'} onclick="openModule('math','lessons')">الشرح والألعاب</button></div></div>`;
 }
 h+=`<div class="card weekly"><div><h2>اختبار الأسبوع</h2><p>من مهاراتك ودروسك المحددة، مع تسجيل الأخطاء للمراجعة.</p></div><button class="btn green" onclick="startWeekly('${pid}')">بدء الاختبار</button></div>`;page(h)
};
function multiplyCard(){return `<div class="card"><h2>جدول الضرب</h2><p>تعلّم وتدريب ومراجعة نقاط الضعف، بسجل مستقل لكِ.</p><button class="btn violet" onclick="openModule('math','multiply')">ابدئي جدول الضرب</button></div>`}
window.focusedPractice=function(t){if(!guard())return;let b=eligible(t);const focus=state.aptitudeScope?.[t];if(focus&&!['begin','review'].includes(focus))b=b.filter(q=>q.skill===focus);if(focus==='begin')b=b.filter(q=>(q.difficulty||1)<=2);launchQuestions(weightedSelect(activePid,t,15,'practice',b),t)};
function launchQuestions(qs,t='review'){if(!guard())return;if(!qs.length)return alert('لا توجد أسئلة متاحة لهذا الاختيار.');qs=prepareSessionQuestions(activePid,qs);session={id:'UX_'+Date.now(),profileId:activePid,track:t,mode:'practice',questions:qs,index:0,answers:[],startedAt:Date.now(),selected:null};state.currentExam=session;save();renderQ()}
const originalPractice=window.setupExam, originalWeekly=window.startWeekly;
window.startPractice=function(pid,...args){if(pid!==activePid||!guard(pid))return;originalPractice(pid,...args)};
window.startWeekly=function(pid){if(pid!==activePid||!guard(pid))return;originalWeekly(pid)};
window.scopeCenter=function(){if(activePid)entryGate(activePid);else home()};
window.analytics=function(){profileErrors()};
window.profileErrors=function(){
 if(!guard())return;clearTimer();const rows=journal.filter(x=>x.pid===activePid),errors=rows.filter(x=>!x.correct).slice().reverse();
 page(`${top('سجل '+LABELS[activePid],'accountHome()')}${summary(activePid)}<div class="nav"><button class="btn blue sm" onclick="reviewMistakes()">تدريب على الأخطاء المتاحة</button><button class="btn green sm" onclick="exportProfile()">تنزيل تقرير الأخطاء</button></div><div class="card"><h2>دفتر الأخطاء</h2><p class="small">تبقى المحاولة الخاطئة في السجل حتى بعد الإجابة الصحيحة لاحقًا. بعض تدريبات الكتاب ذاتية التصحيح ويظهر ذلك بجوارها.</p>${errors.length?errors.slice(0,300).map(x=>`<article class="error-card"><div class="row between"><span class="pill">${esc(x.subject||x.skill||x.module)}</span><small>${new Date(x.time).toLocaleString('ar-SA')}</small></div><h3 dir="auto">${esc(x.text)}</h3><p class="redText">إجابتها: <span dir="auto">${esc(x.selected)}</span></p><p>الصحيح: <b dir="auto">${esc(x.correctText)}</b></p>${x.explanation?`<p class="small" dir="auto">${esc(x.explanation)}</p>`:''}${x.manual?'<span class="pill">تقييم ذاتي</span>':''}</article>`).join(''):'<p>لا توجد أخطاء مسجلة حتى الآن.</p>'}${errors.length>300?'<p>تُعرض آخر ٣٠٠ محاولة. التقرير يتضمن السجل كاملًا.</p>':''}</div><div class="card"><h2>آخر النشاطات</h2>${rows.slice(-20).reverse().map(x=>`<div class="skillrow"><b>${x.correct?'✓':'↻'} ${esc(x.skill||x.subject||x.module)}</b><p dir="auto">${esc(x.text)}</p><span class="small">${x.manual?'تقييم ذاتي • ':''}${new Date(x.time).toLocaleString('ar-SA')}</span></div>`).join('')||'<p>ابدئي تدريبك الأول.</p>'}</div>`)
};
window.errorNotebook=window.profileErrors;
window.reviewMistakes=function(){if(!guard())return;const qs=[...new Map(journal.filter(x=>x.pid===activePid&&!x.correct&&x.question?.options).map(x=>[x.question.id||x.text,x.question])).values()].filter(q=>!T[q.track]?.subjects||academicOrder(q)<=Number(state.scope[q.track]?.[q.subject]||0));launchQuestions(qs.sort(()=>Math.random()-.5).slice(0,20))};
window.exportProfile=function(){if(!guard())return;dl({reportType:'girls-study-errors',student:LABELS[activePid],exportedAt:new Date().toISOString(),scope:profile(activePid).kind==='school'?state.scope[profile(activePid).tracks[0]]:state.aptitudeScope,errors:journal.filter(x=>x.pid===activePid&&!x.correct),answerCount:journal.filter(x=>x.pid===activePid).length},'Study_'+activePid+'_errors.json')};
window.openModule=function(kind,mode=''){
 if(!guard())return;if(kind==='trainer'&&activePid!=='p1')return;if(kind==='book'&&activePid!=='p3')return;if(kind==='math'&&!['p1','p3'].includes(activePid))return;
 page(`${top(LABELS[activePid]+' • '+({trainer:'المدرّب',math:mode==='multiply'?'جدول الضرب':'شرح الرياضيات',book:'أسئلة الكتاب'}[kind]),'accountHome()')}<iframe id="moduleFrame" title="مساحة التدريب" src="modules/${kind}/index.html?pid=${activePid}&mode=${encodeURIComponent(mode)}"></iframe>`)
};
window.studyModuleContext=function(win){const f=$('moduleFrame');if(!f||f.contentWindow!==win||!confirmed.has(activePid))return null;return {pid:activePid,scope:profile(activePid).kind==='school'?state.scope[profile(activePid).tracks[0]]:{},catalog:CURRICULUM,order:academicOrder}}
window.studyModuleRecord=function(win,row){if(!studyModuleContext(win))return;recordUnified(row)};
window.dataCenter=function(){page(`${top('الحفظ والاستيراد',activePid?'accountHome()':'home()')}<div class="card"><h2>نسخة لجميع الطالبات</h2><p>تتضمن التقدم والأخطاء وسجلات المدرّب والألعاب. لا توجد مزامنة تلقائية بين الأجهزة.</p><button class="btn green" onclick="exportAll()">تنزيل نسخة احتياطية</button><label class="field">استيراد نسخة سابقة<input type="file" accept=".json" onchange="importAll(event)"></label><p class="small">يمكن استيراد نسخة Exams السابقة أيضًا. الاستيراد يضيف السجلات دون حذف السجل الحالي.</p></div>${activePid?`<div class="card"><h2>إضافة محتوى</h2><div class="row"><button class="btn light" onclick="updatesCenter()">استيراد أسئلة جديدة</button><button class="btn light" onclick="remedialCenter()">استيراد خطة علاجية</button></div></div>`:''}<div class="card"><h2>جدول الضرب القديم</h2><p>إذا استُخدم التطبيق القديم على هذا الجهاز، اختاري صاحبة سجل الضرب القديم لنقله مرة واحدة.</p><button class="btn light" onclick="importOldMath('p1')">السجل لجنى</button> <button class="btn light" onclick="importOldMath('p3')">السجل لحكمة</button></div>`)};
window.settings=window.dataCenter;
window.exportAll=function(){const modules={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('girls_module_'))modules[k]=localStorage.getItem(k)}dl({format:'girls-study-backup-v1',createdAt:new Date().toISOString(),state,journal,modules},'girls-study-backup-'+today()+'.json')};
window.backup=window.exportAll;
window.importAll=async function(e){try{
 const file=e.target.files[0];if(!file)return;const d=JSON.parse(await file.text());
 if(d.format==='girls-study-backup-v1'){
  if(!Array.isArray(d.journal)||!d.state||!Array.isArray(d.state.history))throw Error('بنية النسخة غير صالحة');
  if(d.journal.some(x=>!x.id||!LABELS[x.pid]||typeof x.text!=='string'))throw Error('السجل في النسخة غير صالح');
  localStorage.setItem('girls_study_before_import',JSON.stringify({state,journal}));
  journal=[...new Map([...d.journal,...journal].map(x=>[x.id,x])).values()];persistJournal();
  state.history=[...new Map([...d.state.history,...state.history].map(x=>[x.id,x])).values()];
  state.externalQuestions=[...new Map([...(d.state.externalQuestions||[]),...state.externalQuestions].map(x=>[x.id,x])).values()];
  for(const t of ['m3','g5'])for(const sub of T[t].subjects)if(!state.scope[t][sub])state.scope[t][sub]=Number(d.state.scope?.[t]?.[sub]||0);
  if(!state.aptitudeScope)state.aptitudeScope=d.state.aptitudeScope;state.remedialPlans=[...new Map([...(d.state.remedialPlans||[]),...state.remedialPlans].map(x=>[x.packId,x])).values()];state.remedialProgress={...(d.state.remedialProgress||{}),...state.remedialProgress};
  for(const [k,v] of Object.entries(d.modules||{})){if(/^girls_module_p[123]_/.test(k)&&typeof v==='string'&&!localStorage.getItem(k)){localStorage.setItem(k,v)}}
 }else if(Array.isArray(d.profiles)&&Array.isArray(d.history)){
  const qm=questionMap();d.history.forEach(h=>(h.answers||[]).forEach((a,i)=>{if(!LABELS[h.profileId])return;const q=qm.get(a.qid);recordUnified({id:'old_'+h.id+'_'+i,time:h.finishedAt||Date.now(),module:'exam',text:a.text||q?.text||'',selected:q?.options?.[a.selected]??'غير محفوظ',correctText:q?.options?.[q.answer]??'غير محفوظ',correct:!!a.correct,question:q,skill:a.skill,subject:a.subject,track:a.track},h.profileId)}));state.history=[...new Map([...d.history,...state.history].map(x=>[x.id,x])).values()];
 }else throw Error('اختاري نسخة دراستنا أو نسخة Exams الأصلية');
 normalize();save();confirmed.clear();alert('تم الاستيراد دون حذف السجلات الحالية. أكدي موضع المنهج عند الدخول.');home();
 }catch(x){alert('لم يكتمل الاستيراد: '+x.message)}};
window.importOldMath=function(pid){if(localStorage.getItem('girls_math_migrated'))return alert('نُقل هذا السجل سابقًا.');const keys=['math-stars','math-coins','math-cups','mt-selected','mt-operation','mt-weak'];if(!keys.some(k=>localStorage.getItem(k)))return alert('لم يُعثر على سجل رياضيات قديم على هذا الجهاز.');for(const k of keys){const v=localStorage.getItem(k);if(v!==null&&!localStorage.getItem('girls_module_'+pid+'_'+k))localStorage.setItem('girls_module_'+pid+'_'+k,v)}localStorage.setItem('girls_math_migrated',pid);alert('تم نقل التقدم القديم إلى '+LABELS[pid]+'. التطبيق القديم لم يكن يسجل تفاصيل جميع الإجابات.')};

load();migrateUnified();home();if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js?v='+APP_VERSION,{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
})();
