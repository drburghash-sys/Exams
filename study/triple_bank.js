(function(){
'use strict';
const base=Array.isArray(window.ALL_BANK)?window.ALL_BANK.slice():[];
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rotateOptions(q,v){
 if(!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.answer))return {options:q.options,answer:q.answer};
 const n=q.options.length,shift=(hash(q.id)+v)%n;
 const options=q.options.map((_,i)=>q.options[(i+shift)%n]);
 let answer=-1;
 for(let i=0;i<n;i++){if((i+shift)%n===q.answer){answer=i;break}}
 return {options,answer};
}
function rephraseArabic(text,v,q){
 let t=String(text||'').trim();
 if(q?.subject==='الرياضيات'||q?.track==='quant'){
  if(/^حل المعادلة[:：]?s*/.test(t))return t.replace(/^حل المعادلة[:：]?s*/,v===2?'أوجد قيمة المتغير في المعادلة: ':'ما قيمة المتغير التي تحقق المعادلة: ');
  if(/^حل[:：]s*/.test(t))return t.replace(/^حل[:：]s*/,v===2?'أوجد الحل: ':'حددي قيمة المتغير: ');
  if(/^احسب/.test(t))return t.replace(/^احسب/,v===2?'أوجد الناتج لـ':'ما ناتج');
  if(/^أوجد/.test(t))return t.replace(/^أوجد/,v===2?'احسب':'حددي');
  if(/^قدّري/.test(t))return t.replace(/^قدّري/,v===2?'أوجدي تقدير':'اختاري أفضل تقدير لـ');
 }
 const lead=v===2?'اختاري الإجابة الصحيحة:':'حددي الخيار الأنسب:';
 return lead+'\n'+t;
}
function rephraseEnglish(text,v){
 const t=String(text||'').trim();
 return (v===2?'Choose the correct answer:':'Select the best answer:')+'\n'+t;
}
function rephrase(q,v){
 const english=q?.subject==='الإنجليزي'||q?.subject==='Grammar'||q?.subject==='Vocabulary'||q?.subject==='Reading'||q?.track==='step';
 return english?rephraseEnglish(q.text,v):rephraseArabic(q.text,v,q);
}
const out=[];
for(const q0 of base){
 const root=q0.variantOf||q0.id;
 out.push({...q0,variantOf:root,variantNo:1});
 for(const v of [2,3]){
  const ro=rotateOptions(q0,v);
  out.push({...q0,id:String(q0.id)+'__V'+v,variantOf:root,variantNo:v,text:rephrase(q0,v),options:ro.options,answer:ro.answer});
 }
}
window.ALL_BANK=out;
window.TRIPLE_BANK_INFO={baseCount:base.length,totalCount:out.length};
})();
