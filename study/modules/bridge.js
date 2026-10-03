'use strict';
const STUDY_CONTEXT = window.parent!==window && window.parent.studyModuleContext?.(window);
if(!STUDY_CONTEXT){location.replace('../../index.html');throw new Error('افتحي التدريب من ملفك في دراستنا');}
const StudyStore={
 getItem(key){return localStorage.getItem('girls_module_'+STUDY_CONTEXT.pid+'_'+key)},
 setItem(key,value){localStorage.setItem('girls_module_'+STUDY_CONTEXT.pid+'_'+key,value)},
 removeItem(key){localStorage.removeItem('girls_module_'+STUDY_CONTEXT.pid+'_'+key)}
};
function studyRecord(row){window.parent.studyModuleRecord(window,row)}
function studyHome(){window.parent.accountHome()}
function studyScope(){window.parent.entryGate(STUDY_CONTEXT.pid)}
