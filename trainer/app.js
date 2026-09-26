(() => {
  'use strict';

  const DATA = window.TRAINER_DATA;
  const $ = (id) => document.getElementById(id);
  const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };

  const STORE = 'aptitude_step_trainer_v1';
  const defaultState = {
    score:0, correct:0, wrong:0, streak:0, bestStreak:0,
    stats:{}, mistakes:[], seenWords:{}, daily:{date:'',done:0,total:20},
    wordStudy:{currentEn:[],currentAr:[],mastered:{},batches:0},
    settings:{dailyTotal:20}
  };
  let state = loadState();
  let session = {mode:'daily', category:'all', skill:'all', n:1, total:20, current:null, answered:false};

  function loadState(){
    try {
      const saved=JSON.parse(localStorage.getItem(STORE)||'null');
      return saved ? Object.assign({},defaultState,saved,{stats:saved.stats||{},mistakes:saved.mistakes||[],seenWords:saved.seenWords||{},daily:saved.daily||{date:'',done:0,total:20},wordStudy:saved.wordStudy||{currentEn:[],currentAr:[],mastered:{},batches:0},settings:saved.settings||{dailyTotal:20}}) : JSON.parse(JSON.stringify(defaultState));
    } catch(e){ return JSON.parse(JSON.stringify(defaultState)); }
  }
  function saveState(){ localStorage.setItem(STORE,JSON.stringify(state)); }
  function todayKey(){
    const d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function ensureDaily(){
    const t=todayKey();
    if(state.daily.date!==t) state.daily={date:t,done:0,total:state.settings.dailyTotal||20};
  }
  function ensureStat(skill){
    if(!state.stats[skill]) state.stats[skill]={c:0,w:0,last:0};
    return state.stats[skill];
  }
  function accuracy(){
    const n=state.correct+state.wrong;
    return n?Math.round(state.correct/n*100):0;
  }
  function skillAccuracy(skill){
    const s=ensureStat(skill), n=s.c+s.w;
    return n?s.c/n:0.5;
  }
  function weakWeight(skill){
    const s=ensureStat(skill), n=s.c+s.w;
    if(!n) return 3;
    const acc=s.c/n;
    return Math.max(1,Math.round((1.2-acc)*6));
  }

  const quantSkills=['التناسب','النسبة المئوية','الخصم','الربح والخسارة','المتوسط','الوسيط','المنوال','المعادلات','الكسور','السرعة والزمن','النسبة','الاحتمال'];
  const verbalSkills=['معاني إنجليزي','مرادفات إنجليزي','أضداد إنجليزي','معاني عربي','مرادفات عربي','أضداد عربي'];
  const grammarSkills=['since / for','اختيار الزمن','المبني للمجهول'];

  function generateVocab(skill){
    const isEn=skill.includes('إنجليزي');
    const bank=isEn?DATA.englishWords:DATA.arabicWords;
    const row=pick(bank);
    state.seenWords[row.id]=(state.seenWords[row.id]||0)+1;

    let field, prompt;
    if(skill.includes('مرادفات')) { field='synonym'; prompt=isEn?'Choose the closest synonym of “'+row.word+'”.':'ما أقرب مرادف لكلمة «'+row.word+'»؟'; }
    else if(skill.includes('أضداد')) { field='antonym'; prompt=isEn?'Choose the opposite of “'+row.word+'”.':'ما ضد كلمة «'+row.word+'»؟'; }
    else { field='meaning'; prompt=isEn?'ما معنى كلمة “'+row.word+'”؟':'ما معنى كلمة «'+row.word+'»؟'; }

    const correct=row[field];
    let distractors=shuffle(bank.filter(x=>x.id!==row.id).map(x=>x[field]).filter((v,i,a)=>v&&a.indexOf(v)===i&&v!==correct)).slice(0,3);
    const options=shuffle([correct].concat(distractors));
    return {
      category:'verbal', skill, q:prompt, options, answer:options.indexOf(correct),
      explanation:isEn
        ? row.word+' = '+row.meaning+' | synonym: '+row.synonym+' | antonym: '+row.antonym
        : '«'+row.word+'»: '+row.meaning+' | المرادف: '+row.synonym+' | الضد: '+row.antonym,
      wordId:row.id
    };
  }

  function generateGrammar(skill){
    let candidates=DATA.grammar;
    if(skill==='since / for') candidates=DATA.grammar.filter(x=>x.skill==='since-for');
    else if(skill==='المبني للمجهول') candidates=DATA.grammar.filter(x=>x.skill.indexOf('passive')===0);
    else if(skill==='اختيار الزمن') candidates=DATA.grammar.filter(x=>x.skill.indexOf('passive')!==0 && x.skill!=='since-for');
    const g=pick(candidates);
    return {category:'step',skill, q:g.q, options:g.o, answer:g.a, explanation:g.rule};
  }

  function percentQuestion(){
    const base=pick([100,120,150,160,200,240,250,300,400,500,600,800]);
    const p=pick([5,10,15,20,25,30,40,50]);
    const val=base*p/100;
    const correct=Number.isInteger(val)?String(val):val.toFixed(1);
    const options=makeNumericOptions(Number(correct),Math.max(1,Math.round(base*.05)));
    return {category:'quant',skill:'النسبة المئوية',q:'كم يساوي '+p+'٪ من '+base+'؟',options,answer:options.indexOf(correct),explanation:p+'٪ = '+p+'/100، إذن '+base+' × '+p+'/100 = '+correct+'.'};
  }
  function discountQuestion(){
    const price=pick([100,120,150,200,240,250,300,400,500]);
    const p=pick([10,15,20,25,30,40]);
    const final=price*(100-p)/100;
    const c=fmt(final), options=makeNumericOptions(final,Math.max(5,price*.05));
    return {category:'quant',skill:'الخصم',q:'سعر سلعة '+price+' ريالًا وعليها خصم '+p+'٪. كم السعر بعد الخصم؟',options,answer:options.indexOf(c),explanation:'الخصم = '+fmt(price*p/100)+'، والسعر بعد الخصم = '+c+' ريالًا.'};
  }
  function profitQuestion(){
    const cost=pick([80,100,120,150,200,240,300]);
    const p=pick([10,20,25,30,40,50]);
    const sell=cost*(100+p)/100;
    const c=p+'٪', options=shuffle([c,(p+5)+'٪',Math.max(5,p-5)+'٪',(p+10)+'٪'].filter((v,i,a)=>a.indexOf(v)===i));
    return {category:'quant',skill:'الربح والخسارة',q:'اشترى تاجر سلعة بـ '+cost+' ريالًا وباعها بـ '+fmt(sell)+' ريالًا. ما نسبة الربح من سعر الشراء؟',options,answer:options.indexOf(c),explanation:'الربح = '+fmt(sell-cost)+'، ونسبة الربح = الربح ÷ سعر الشراء × 100 = '+p+'٪.'};
  }
  function proportionQuestion(){
    const unit=rand(2,12), a=pick([2,3,4,5,6]), b=pick([7,8,9,10,12]);
    const first=unit*a, ans=unit*b, c=String(ans), options=makeNumericOptions(ans,unit);
    return {category:'quant',skill:'التناسب',q:'إذا كان ثمن '+a+' قطع = '+first+' ريالًا، فكم ثمن '+b+' قطع بالسعر نفسه؟',options,answer:options.indexOf(c),explanation:'قيمة القطعة الواحدة = '+first+' ÷ '+a+' = '+unit+'، ثم '+unit+' × '+b+' = '+ans+'.'};
  }
  function meanQuestion(){
    const a=rand(4,20), b=rand(4,20), c=rand(4,20);
    const sum=a+b+c; const mean=sum/3;
    if(!Number.isInteger(mean)) return meanQuestion();
    const cc=String(mean), options=makeNumericOptions(mean,2);
    return {category:'quant',skill:'المتوسط',q:'ما متوسط الأعداد '+a+'، '+b+'، '+c+'؟',options,answer:options.indexOf(cc),explanation:'المتوسط = ('+a+' + '+b+' + '+c+') ÷ 3 = '+mean+'.'};
  }
  function medianQuestion(){
    const nums=shuffle([rand(1,9),rand(10,19),rand(20,29),rand(30,39),rand(40,49)]).sort((a,b)=>a-b);
    const med=nums[2], options=makeNumericOptions(med,3);
    return {category:'quant',skill:'الوسيط',q:'ما الوسيط للأعداد: '+nums.join('، ')+'؟',options,answer:options.indexOf(String(med)),explanation:'بعد ترتيب القيم، القيمة الوسطى الثالثة هي '+med+'.'};
  }
  function modeQuestion(){
    const m=rand(2,12); let others=shuffle([m+1,m+2,m+3,m+4,m+5]).slice(0,4);
    const nums=shuffle([m,m,m].concat(others));
    const options=shuffle([String(m),String(others[0]),String(others[1]),String(others[2])]);
    return {category:'quant',skill:'المنوال',q:'ما المنوال للأعداد: '+nums.join('، ')+'؟',options,answer:options.indexOf(String(m)),explanation:'المنوال هو الأكثر تكرارًا، وهو '+m+'.'};
  }
  function equationQuestion(){
    const x=rand(2,12), a=rand(2,6), b=rand(1,12), total=a*x+b;
    const options=makeNumericOptions(x,2);
    return {category:'quant',skill:'المعادلات',q:'إذا كان '+a+'س + '+b+' = '+total+'، فما قيمة س؟',options,answer:options.indexOf(String(x)),explanation:a+'س = '+(total-b)+'، ثم س = '+(total-b)+' ÷ '+a+' = '+x+'.'};
  }
  function fractionQuestion(){
    const den=pick([2,4,5,8,10]), num=rand(1,den-1), mult=rand(2,12), total=den*mult, ans=num*mult;
    const options=makeNumericOptions(ans,Math.max(1,mult));
    return {category:'quant',skill:'الكسور',q:'ما قيمة '+num+'/'+den+' من '+total+'؟',options,answer:options.indexOf(String(ans)),explanation:total+' × '+num+' ÷ '+den+' = '+ans+'.'};
  }
  function speedQuestion(){
    const speed=pick([40,50,60,70,80,90,100,120]), hrs=pick([2,3,4,5]), dist=speed*hrs;
    const options=shuffle([String(hrs),String(Math.max(1,hrs-1)),String(hrs+1),String(hrs+2)]);
    return {category:'quant',skill:'السرعة والزمن',q:'سيارة سرعتها '+speed+' كم/س. كم ساعة تحتاج لقطع '+dist+' كم؟',options,answer:options.indexOf(String(hrs)),explanation:'الزمن = المسافة ÷ السرعة = '+dist+' ÷ '+speed+' = '+hrs+' ساعات.'};
  }
  function ratioQuestion(){
    const a=pick([2,3,4,5]), b=pick([2,3,4]), k=rand(3,8), first=a*k, second=b*k;
    const options=makeNumericOptions(second,k);
    return {category:'quant',skill:'النسبة',q:'نسبة أ إلى ب هي '+a+':'+b+'. إذا كانت أ = '+first+'، فما قيمة ب؟',options,answer:options.indexOf(String(second)),explanation:a+' أجزاء = '+first+'، إذن الجزء = '+k+'، وب = '+b+' × '+k+' = '+second+'.'};
  }
  function probabilityQuestion(){
    const r=rand(2,7), b=rand(2,7), total=r+b, c=r+'/'+total;
    const options=shuffle([c,b+'/'+total,'1/'+total,total+'/'+r].filter((v,i,a)=>a.indexOf(v)===i));
    return {category:'quant',skill:'الاحتمال',q:'صندوق فيه '+r+' كرات حمراء و'+b+' زرقاء. ما احتمال سحب كرة حمراء؟',options,answer:options.indexOf(c),explanation:'الاحتمال = الحالات المطلوبة ÷ جميع الحالات = '+r+'/'+total+'.'};
  }
  function fmt(n){return Number.isInteger(n)?String(n):Number(n.toFixed(1)).toString();}
  function makeNumericOptions(correct,step){
    const c=fmt(correct), vals=[correct,correct+step,Math.max(0,correct-step),correct+2*step].map(fmt);
    return shuffle(vals.filter((v,i,a)=>a.indexOf(v)===i)).slice(0,4);
  }
  function generateQuant(skill){
    const map={
      'التناسب':proportionQuestion,'النسبة المئوية':percentQuestion,'الخصم':discountQuestion,
      'الربح والخسارة':profitQuestion,'المتوسط':meanQuestion,'الوسيط':medianQuestion,
      'المنوال':modeQuestion,'المعادلات':equationQuestion,'الكسور':fractionQuestion,
      'السرعة والزمن':speedQuestion,'النسبة':ratioQuestion,'الاحتمال':probabilityQuestion
    };
    return (map[skill]||percentQuestion)();
  }

  function chooseWeighted(skills){
    const bag=[];
    skills.forEach(s=>{ for(let i=0;i<weakWeight(s);i++) bag.push(s); });
    return pick(bag);
  }

  function nextQuestion(){
    session.answered=false;
    $('nextBtn').disabled=true;
    $('ruleBtn').disabled=true;
    $('feedback').innerHTML='';

    let q;
    if(session.mode==='daily'){
      const category=chooseWeighted(['STEP','لفظي','كمي']);
      if(category==='STEP') q=generateGrammar(chooseWeighted(grammarSkills));
      else if(category==='لفظي') q=generateVocab(chooseWeighted(verbalSkills));
      else q=generateQuant(chooseWeighted(quantSkills));
    } else if(session.mode==='step') {
      q=generateGrammar(session.skill==='all'?chooseWeighted(grammarSkills):session.skill);
    } else if(session.mode==='verbal') {
      q=generateVocab(session.skill==='all'?chooseWeighted(verbalSkills):session.skill);
    } else {
      q=generateQuant(session.skill==='all'?chooseWeighted(quantSkills):session.skill);
    }
    session.current=q;
    renderQuestion();
  }

  function renderQuestion(){
    const q=session.current;
    $('questionCategory').textContent=q.category==='step'?'STEP':q.category==='verbal'?'اللفظي':'الكمي';
    $('questionSkill').textContent=q.skill;
    $('questionText').textContent=q.q;
    $('progressText').textContent=session.n+' / '+session.total;
    $('progressBar').style.width=Math.min(100,(session.n/session.total)*100)+'%';
    const box=$('answers');
    box.innerHTML='';
    q.options.forEach((opt,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='answer-btn';
      b.textContent=opt;
      b.addEventListener('click',()=>answer(i,b));
      box.appendChild(b);
    });
  }

  function answer(i,button){
    if(session.answered)return;
    session.answered=true;
    const q=session.current;
    const ok=i===q.answer;
    const skillKey=q.skill;
    const categoryKey=q.category==='step'?'STEP':q.category==='verbal'?'لفظي':'كمي';
    const st=ensureStat(skillKey);
    const cat=ensureStat(categoryKey);
    st.last=Date.now();
    cat.last=Date.now();

    const buttons=[...document.querySelectorAll('.answer-btn')];
    buttons.forEach((b,idx)=>{
      b.disabled=true;
      if(idx===q.answer)b.classList.add('correct');
    });

    if(ok){
      state.correct++; state.score+=10+Math.min(state.streak*2,20); state.streak++; st.c++; cat.c++;
      state.bestStreak=Math.max(state.bestStreak,state.streak);
      $('feedback').innerHTML='<div class="feedback-good"><b>✓ صحيح</b><br>'+escapeHtml(q.explanation)+'</div>';
    } else {
      state.wrong++; state.streak=0; st.w++; cat.w++;
      button.classList.add('wrong');
      state.mistakes.unshift({time:Date.now(),skill:categoryKey+': '+skillKey,q:q.q,answer:q.options[q.answer],explanation:q.explanation});
      state.mistakes=state.mistakes.slice(0,100);
      $('feedback').innerHTML='<div class="feedback-bad"><b>✗ الإجابة الصحيحة: '+escapeHtml(q.options[q.answer])+'</b><br>'+escapeHtml(q.explanation)+'</div>';
    }

    if(session.mode==='daily'){ ensureDaily(); state.daily.done=Math.min(state.daily.total,state.daily.done+1); }
    saveState(); updateHeader(); renderWeakness();
    $('nextBtn').disabled=false; $('ruleBtn').disabled=false;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }

  function updateHeader(){
    ensureDaily();
    $('scoreValue').textContent=state.score;
    $('streakValue').textContent=state.streak;
    $('accuracyValue').textContent=accuracy()+'٪';
    $('dailyValue').textContent=state.daily.done+' / '+state.daily.total;
    $('wordCount').textContent=(DATA.englishWords.length+DATA.arabicWords.length).toLocaleString('ar-SA');
    $('seenWords').textContent=Object.keys(state.seenWords).length.toLocaleString('ar-SA');
  }

  function modeSkills(){
    if(session.mode==='step')return grammarSkills;
    if(session.mode==='verbal')return verbalSkills;
    if(session.mode==='quant')return quantSkills;
    return [];
  }
  function renderSkillButtons(){
    const box=$('skillButtons'); box.innerHTML='';
    if(session.mode==='daily'){
      const p=document.createElement('div');
      p.className='hint';
      p.textContent='التوزيع تلقائي حسب نقاط الضعف: STEP + لفظي + كمي.';
      box.appendChild(p); return;
    }
    ['all'].concat(modeSkills()).forEach(s=>{
      const b=document.createElement('button'); b.type='button'; b.className='chip'+(session.skill===s?' active':'');
      b.textContent=s==='all'?'الكل':s;
      b.addEventListener('click',()=>{session.skill=s;session.n=1;renderSkillButtons();nextQuestion();});
      box.appendChild(b);
    });
  }

  function renderWeakness(){
    const box=$('weakList'); box.innerHTML='';
    const rows=Object.entries(state.stats).map(([name,v])=>{
      const n=v.c+v.w; return {name,c:v.c,w:v.w,n,acc:n?Math.round(v.c/n*100):0};
    }).filter(x=>x.n>0).sort((a,b)=>a.acc-b.acc||b.n-a.n).slice(0,8);

    if(!rows.length){box.innerHTML='<div class="empty">بعد حل عدة أسئلة ستظهر هنا المهارات التي تحتاج مراجعة.</div>';return;}
    rows.forEach(r=>{
      const d=document.createElement('div'); d.className='weak-row';
      d.innerHTML='<div class="weak-line"><span>'+escapeHtml(r.name)+'</span><b>'+r.acc+'٪</b></div><div class="meter"><span style="width:'+r.acc+'%"></span></div><div class="weak-meta">'+r.c+' صحيح · '+r.w+' خطأ</div>';
      box.appendChild(d);
    });
  }

  function renderMistakes(){
    const box=$('mistakeList');box.innerHTML='';
    if(!state.mistakes.length){box.innerHTML='<div class="empty">لا توجد أخطاء محفوظة حتى الآن.</div>';return;}
    state.mistakes.slice(0,30).forEach(m=>{
      const d=document.createElement('article');d.className='mistake-card';
      d.innerHTML='<div class="mini-label">'+escapeHtml(m.skill)+'</div><b>'+escapeHtml(m.q)+'</b><div>الإجابة: '+escapeHtml(m.answer)+'</div><small>'+escapeHtml(m.explanation)+'</small>';
      box.appendChild(d);
    });
  }

  function getWordById(id){
    return DATA.englishWords.concat(DATA.arabicWords).find(x=>x.id===id);
  }

  function chooseStudyWords(bank,count){
    const mastered=state.wordStudy.mastered||{};
    let pool=bank.filter(x=>!mastered[x.id]);
    if(pool.length<count){
      state.wordStudy.mastered={};
      pool=bank.slice();
    }
    return shuffle(pool).slice(0,count);
  }

  function ensureStudyBatch(){
    if(!state.wordStudy) state.wordStudy={currentEn:[],currentAr:[],mastered:{},batches:0};
    const enValid=(state.wordStudy.currentEn||[]).map(getWordById).filter(Boolean);
    const arValid=(state.wordStudy.currentAr||[]).map(getWordById).filter(Boolean);
    if(enValid.length!==3 || arValid.length!==3){
      state.wordStudy.currentEn=chooseStudyWords(DATA.englishWords,3).map(x=>x.id);
      state.wordStudy.currentAr=chooseStudyWords(DATA.arabicWords,3).map(x=>x.id);
      saveState();
    }
  }

  function wordStudyCard(x){
    const en=x.lang==='en';
    return '<article class="study-card">'
      +'<div class="word '+(en?'ltr':'')+'">'+escapeHtml(x.word)+'</div>'
      +'<div class="meaning">'+escapeHtml(x.meaning)+'</div>'
      +'<div class="meta">'+(en?'Synonym: ':'المرادف: ')+escapeHtml(x.synonym)+'<br>'+(en?'Antonym: ':'الضد: ')+escapeHtml(x.antonym)+'</div>'
      +'</article>';
  }

  function renderStudy(){
    ensureStudyBatch();
    const en=(state.wordStudy.currentEn||[]).map(getWordById).filter(Boolean);
    const ar=(state.wordStudy.currentAr||[]).map(getWordById).filter(Boolean);
    $('studyEnglish').innerHTML=en.map(wordStudyCard).join('');
    $('studyArabic').innerHTML=ar.map(wordStudyCard).join('');
    $('masteredBatchCount').textContent=String(state.wordStudy.batches||0);
  }

  function masterCurrentWords(){
    ensureStudyBatch();
    const all=(state.wordStudy.currentEn||[]).concat(state.wordStudy.currentAr||[]);
    all.forEach(id=>state.wordStudy.mastered[id]=true);
    state.wordStudy.batches=(state.wordStudy.batches||0)+1;
    state.wordStudy.currentEn=chooseStudyWords(DATA.englishWords,3).map(x=>x.id);
    state.wordStudy.currentAr=chooseStudyWords(DATA.arabicWords,3).map(x=>x.id);
    saveState();
    renderStudy();
  }

  let activeRuleGroup='english';

  function renderRules(){
    const source=(window.TRAINER_RULES&&window.TRAINER_RULES[activeRuleGroup])||[];
    $('englishRulesTab').classList.toggle('active',activeRuleGroup==='english');
    $('quantRulesTab').classList.toggle('active',activeRuleGroup==='quant');
    const box=$('rulesList');
    box.innerHTML='';
    source.forEach((r,idx)=>{
      const item=document.createElement('article');
      item.className='rule-item';
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='rule-toggle';
      btn.setAttribute('aria-expanded','false');
      btn.innerHTML='<span>'+escapeHtml(r.title)+'</span><span>＋</span>';
      const body=document.createElement('div');
      body.className='rule-body';
      body.hidden=true;
      let html='<div class="rule-summary">'+escapeHtml(r.summary||'')+'</div>';
      if(r.formula) html+='<div class="formula">'+escapeHtml(r.formula)+'</div>';
      if(r.details&&r.details.length) html+='<ul>'+r.details.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
      html+='<b>3 أمثلة:</b><div class="examples">'+(r.examples||[]).slice(0,3).map((x,i)=>'<div class="example"><b>مثال '+(i+1)+':</b> '+escapeHtml(x)+'</div>').join('')+'</div>';
      body.innerHTML=html;
      btn.addEventListener('click',()=>{
        const open=body.hidden;
        body.hidden=!open;
        btn.setAttribute('aria-expanded',open?'true':'false');
        btn.lastElementChild.textContent=open?'−':'＋';
      });
      item.appendChild(btn); item.appendChild(body); box.appendChild(item);
    });
  }

  function renderWordBank(){
    const q=$('wordSearch').value.trim().toLowerCase();
    const lang=$('wordLang').value;
    let rows=(lang==='en'?DATA.englishWords:lang==='ar'?DATA.arabicWords:DATA.englishWords.concat(DATA.arabicWords));
    if(q) rows=rows.filter(x=>(x.word+' '+x.meaning+' '+x.synonym+' '+x.antonym).toLowerCase().includes(q));
    $('bankCount').textContent=rows.length.toLocaleString('ar-SA')+' كلمة';
    const box=$('wordRows');box.innerHTML='';
    rows.slice(0,200).forEach(x=>{
      const tr=document.createElement('tr');
      tr.innerHTML='<td class="'+(x.lang==='en'?'ltr':'')+'"><b>'+escapeHtml(x.word)+'</b></td><td>'+escapeHtml(x.meaning)+'</td><td class="'+(x.lang==='en'?'ltr':'')+'">'+escapeHtml(x.synonym)+'</td><td class="'+(x.lang==='en'?'ltr':'')+'">'+escapeHtml(x.antonym)+'</td>';
      box.appendChild(tr);
    });
    $('bankLimitNote').textContent=rows.length>200?'يُعرض أول 200 نتيجة؛ استخدمي البحث للوصول إلى بقية الكلمات.':'';
  }

  function showView(name){
    document.querySelectorAll('.view').forEach(v=>v.hidden=true);
    $(name+'View').hidden=false;
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    if(name==='words')renderWordBank();
    if(name==='study')renderStudy();
    if(name==='rules')renderRules();
    if(name==='mistakes')renderMistakes();
    if(name==='home')renderWeakness();
  }

  function startMode(mode){
    session.mode=mode; session.skill='all'; session.n=1; session.total=mode==='daily'?(state.settings.dailyTotal||20):20;
    showView('quiz'); renderSkillButtons(); nextQuestion();
    document.querySelectorAll('.mode-card').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  }

  $('nextBtn').addEventListener('click',()=>{
    if(session.n>=session.total){
      $('feedback').innerHTML='<div class="finish"><b>انتهت الجولة.</b> دقتك العامة '+accuracy()+'٪. الجولة التالية ستعطي وزنًا أكبر للمهارات الأضعف.</div>';
      session.n=1;
    } else session.n++;
    nextQuestion();
  });
  $('ruleBtn').addEventListener('click',()=>{
    const q=session.current;if(!q)return;
    $('feedback').innerHTML+='<div class="rule-box"><b>قاعدة سريعة:</b> '+escapeHtml(q.explanation)+'</div>';
  });

  document.querySelectorAll('.mode-card').forEach(b=>b.addEventListener('click',()=>startMode(b.dataset.mode)));
  document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  $('wordSearch').addEventListener('input',renderWordBank);
  $('wordLang').addEventListener('change',renderWordBank);
  $('masterWordsBtn').addEventListener('click',masterCurrentWords);
  $('englishRulesTab').addEventListener('click',()=>{activeRuleGroup='english';renderRules();});
  $('quantRulesTab').addEventListener('click',()=>{activeRuleGroup='quant';renderRules();});
  $('resetBtn').addEventListener('click',()=>{
    if(confirm('سيتم حذف سجل النقاط والأخطاء ونقاط الضعف من هذا الجهاز فقط. هل تريد المتابعة؟')){
      state=JSON.parse(JSON.stringify(defaultState));ensureDaily();saveState();updateHeader();renderWeakness();renderMistakes();
    }
  });

  ensureDaily(); ensureStudyBatch(); saveState(); updateHeader(); renderWeakness(); renderWordBank(); renderStudy(); showView('home');
  if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{})); }
})();
