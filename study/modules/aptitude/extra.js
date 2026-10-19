"use strict";
(function(){
const previous=window.APT_GENERATE;
function mc(track,id,i,question,answer,distractors,explanation){
const options=[answer,...distractors].slice(0,4);
return {id:"extra_"+track+"_"+id+"_"+i,track,skill:id,text:question,options,answer:0,explanation};
}
const pairs=[
["قلم : كتابة :: مقص : ؟","قص","رسم","قراءة","قياس"],
["طبيب : مستشفى :: معلم : ؟","مدرسة","صيدلية","محكمة","مزرعة"],
["عين : إبصار :: أذن : ؟","سمع","تذوق","شم","لمس"],
["مطر : بلل :: نار : ؟","حرارة","برودة","جفاف","صمت"],
["بذرة : شجرة :: بيضة : ؟","فرخ","ورقة","حجر","خشب"],
["فرشاة : رسم :: مطرقة : ؟","طرق","طبخ","قراءة","خياطة"],
["ساعة : وقت :: ميزان : ؟","وزن","طول","حرارة","مسافة"],
["جوع : طعام :: عطش : ؟","ماء","نوم","ظل","ضوء"],
["ليل : ظلام :: نهار : ؟","نور","برد","مطر","سكون"],
["كتاب : صفحات :: شجرة : ؟","أغصان","أقلام","أبواب","مفاتيح"],
["سفينة : بحر :: طائرة : ؟","سماء","طريق","نهر","سكة"],
["مزارع : محراث :: نجار : ؟","منشار","سماعة","قلم","مجهر"],
["قاضٍ : محكمة :: طبيب : ؟","مستشفى","ملعب","مسرح","مصنع"],
["مفتاح : فتح :: فرامل : ؟","إيقاف","إنارة","تسخين","قص"],
["شم : أنف :: تذوق : ؟","لسان","عين","يد","أذن"],
["مكتبة : كتب :: مخزن : ؟","بضائع","أمواج","نجوم","غيوم"],
["رياضة : لياقة :: دراسة : ؟","معرفة","عطش","برد","نعاس"],
["دواء : علاج :: طعام : ؟","تغذية","قياس","قراءة","رسم"],
["طباخ : مطبخ :: سباح : ؟","مسبح","مكتبة","مصنع","مكتب"],
["نحلة : عسل :: بقرة : ؟","حليب","خشب","حرير","صوف"],
["مثلث : ثلاثة أضلاع :: مربع : ؟","أربعة أضلاع","خمسة أضلاع","ستة أضلاع","ضلعان"],
["عصفور : عش :: إنسان : ؟","منزل","موج","غصن","مرعى"],
["شتاء : برد :: صيف : ؟","حر","جليد","ثلج","صقيع"],
["محطة : قطار :: مطار : ؟","طائرة","حافلة","سفينة","دراجة"],
["جذر : نبات :: أساس : ؟","بناء","ماء","هواء","صوت"],
["معلم : تعليم :: ممرض : ؟","رعاية","تجارة","حراثة","حدادة"],
["متر : طول :: لتر : ؟","حجم","زمن","كتلة","سرعة"],
["قلب : ضخ الدم :: رئة : ؟","تنفس","هضم","إبصار","سمع"],
["صحفي : خبر :: شاعر : ؟","قصيدة","وصفة","خريطة","معادلة"],
["صيف : فصل :: الجمعة : ؟","يوم","شهر","سنة","دقيقة"],
["مفتاح : قفل :: كلمة مرور : ؟","حساب","ملعقة","قلم","سيارة"],
["ابتسامة : فرح :: دموع : ؟","حزن","طول","سرعة","حرارة"],
["بوصلة : اتجاه :: ترمومتر : ؟","درجة حرارة","مسافة","وزن","زمن"],
["خياطة : إبرة :: نجارة : ؟","منشار","فرشاة","طباشير","سماعة"]
];
const completions=[
["رغم شدة المطر، ____ الطلاب إلى المدرسة.","ذهب","توقف","رفض","تأخر"],
["إذا اجتهد الطالب في دراسته فإنه ____ غالبًا.","ينجح","يرسب","يتراجع","ينسى"],
["لأن الطريق مزدحم، قرر السائق ____ السرعة.","خفض","زيادة","مضاعفة","رفع"],
["كان الجو باردًا، لذلك ارتدى الطفل ____ سميكًا.","معطفًا","قميصًا خفيفًا","نظارة شمسية","قبعة سباحة"],
["لم تكن المهمة سهلة، لكن الفريق ____ حتى أتمها.","ثابر","استسلم","انسحب","توقف"],
["انقطع التيار الكهربائي، لذا استخدموا ____ للإنارة.","مصباحًا","وسادة","ممحاة","مفتاح ماء"],
["تعلمت الطالبة من أخطائها فأصبح أداؤها ____ بمرور الوقت.","أفضل","أسوأ","أبطأ","أقل"],
["يحفظ الإنسان الماء بإغلاق ____ عند عدم الحاجة.","الصنبور","النافذة","الكتاب","الحقيبة"],
["عندما ينقص النوم قد تقل قدرة الإنسان على ____.","التركيز","التنفس","السمع","المشي"],
["المعلومة الموثوقة تحتاج إلى دليل ____ صحتها.","يثبت","ينفي","يخفي","يجهل"],
["أخذت المريضة الدواء حسب ____ الطبيب.","تعليمات","حديقة","تخمين","مناسبة"],
["زُرعت الأشجار حول المدرسة لتوفير ____ للطلاب.","الظل","الضوضاء","الازدحام","الغبار"],
["لم تُقنع الحجة القارئ لأنها افتقرت إلى ____.","الدليل","الأسئلة","الطول","السرعة"],
["لكي يصل المسافر في الوقت المحدد عليه ____ مبكرًا.","المغادرة","النوم","العودة","التوقف"],
["رغم اختلاف الآراء، حافظ المجتمعون على ____ المتبادل.","الاحترام","الخصام","الاحتقار","الصراخ"],
["إذا ازداد الطلب وبقي العرض ثابتًا فقد ____ السعر.","يرتفع","يتلاشى","ينعدم","يتساوى"],
["بعد قراءة التعليمات أصبح تنفيذ التجربة أكثر ____.","وضوحًا","غموضًا","تعقيدًا","خطأً"],
["احتفظ الباحث بنتائج التجربة حتى يستطيع ____ منها لاحقًا.","الاستفادة","التخلص","الابتعاد","النسيان"],
["استيقظ اللاعب مبكرًا كي ____ التمرين في موعده.","يبدأ","يؤجل","يلغي","يهمل"],
["حين تقل الأمطار قد تنخفض مستويات ____ في السدود.","المياه","الثلوج","الصخور","الكتب"],
["طلب المعلم من الطلاب ____ إجاباتهم قبل التسليم.","مراجعة","تمزيق","إخفاء","إهمال"],
["كلما زادت الممارسة الصحيحة، تحسنت ____ المتعلم.","مهارة","أخطاؤه","صعوباته","عجلته"],
["المريض بحاجة إلى تشخيص دقيق قبل اختيار ____.","العلاج","الرحلة","المهنة","المسكن"],
["القراءة المنتظمة تُسهم في ____ الحصيلة اللغوية.","تنمية","تقليل","إلغاء","حذف"],
["أُغلق الجسر للصيانة حفاظًا على ____ المارة.","سلامة","سرعة","أسماء","أمتعة"],
["استشار المزارع خبيرًا لتحسين جودة ____.","المحصول","المحرك","الطريق","القلم"],
["مع أن الفريق خسر المباراة، فإنه أظهر ____ عالية.","روحًا رياضية","فوضى","غشًا","عداءً"],
["قبل مشاركة الخبر يجب ____ من مصدره.","التحقق","الابتعاد","التهرب","التغافل"],
["تُعد الأمانة من القيم التي تعزز ____ بين الناس.","الثقة","الريبة","النزاع","الخوف"],
["لمنع انتقال العدوى يُنصح بغسل ____ بانتظام.","اليدين","الأحذية","الحقائب","الكتب"],
["كان السؤال غير واضح، فطلبت الطالبة ____ إضافيًا.","توضيحًا","عقوبة","انقطاعًا","تأخيرًا"],
["ساعد التنظيم الجيد على ____ الوقت.","توفير","إهدار","تبديد","إضاعة"]
];
const arReading=[
{p:"تُسهم زراعة الأشجار في خفض حرارة الشوارع وتوفير الظل وتحسين الهواء، لذلك تهتم المدن بتوسيع المساحات الخضراء.",main:"فوائد زراعة الأشجار في المدن",detail:"ما الفائدة المذكورة للأشجار؟",ans:"توفير الظل",inf:"لماذا تُوسع المدن المساحات الخضراء؟",iAns:"لتحسين البيئة الحضرية"},
{p:"ترشيد استهلاك الماء يبدأ بإصلاح التسريبات وإغلاق الصنبور عند تنظيف الأسنان واستخدام أدوات قليلة الاستهلاك.",main:"طرق ترشيد استهلاك الماء",detail:"أي إجراء ورد في الفقرة؟",ans:"إصلاح التسريبات",inf:"ما النتيجة المتوقعة لتطبيق هذه الإجراءات؟",iAns:"تقليل هدر الماء"},
{p:"الرياضة المعتدلة بانتظام تقوّي العضلات وتحسن اللياقة، كما تساعد بعض الأشخاص على النوم بشكل أفضل.",main:"فوائد الرياضة المنتظمة",detail:"ما الذي تقويه الرياضة؟",ans:"العضلات",inf:"ماذا توحي الفقرة بشأن ممارسة الرياضة؟",iAns:"أن الاستمرار أهم من الممارسة العرضية"},
{p:"تسمح المكتبات العامة باستعارة الكتب وتوفر مساحات هادئة للقراءة، كما تقيم أنشطة تشجع الأطفال على التعلم.",main:"دور المكتبات العامة في التعلم",detail:"ما الخدمة التي تقدمها المكتبة؟",ans:"استعارة الكتب",inf:"لماذا تُنظم أنشطة للأطفال؟",iAns:"لتشجيع التعلم والقراءة"},
{p:"يعتمد الباحث على الملاحظة والتجربة وتدوين النتائج قبل إصدار الأحكام، ويعيد التجربة إن كانت النتائج غير واضحة.",main:"خطوات البحث العلمي",detail:"ماذا يفعل الباحث قبل إصدار الحكم؟",ans:"يدون النتائج",inf:"لماذا تُعاد التجربة؟",iAns:"للتأكد من نتائج غير واضحة"},
{p:"يستطيع الطالب تنظيم وقته بوضع أهداف صغيرة وتحديد أولويات المهام وترك فترات مناسبة للراحة.",main:"تنظيم وقت الدراسة",detail:"ما إحدى الوسائل المذكورة؟",ans:"تحديد الأولويات",inf:"ما الفائدة المتوقعة من الخطة؟",iAns:"تحسين إنجاز المهام"},
{p:"تعمل الطاقة الشمسية باستخدام ضوء الشمس لإنتاج الكهرباء، ويقل استخدامها من الحاجة إلى الوقود في بعض التطبيقات.",main:"فائدة الطاقة الشمسية",detail:"ما مصدر طاقة الألواح الشمسية؟",ans:"ضوء الشمس",inf:"ماذا قد يحدث عند التوسع فيها؟",iAns:"تقليل استهلاك بعض أنواع الوقود"},
{p:"تتطلب سلامة الطريق احترام إشارات المرور وربط الحزام وتجنب استخدام الهاتف أثناء القيادة.",main:"ممارسات السلامة المرورية",detail:"ما السلوك الذي يُنصح بتجنبه؟",ans:"استخدام الهاتف أثناء القيادة",inf:"لماذا تُذكر هذه السلوكيات؟",iAns:"لخفض مخاطر الحوادث"},
{p:"تساعد وجبة الإفطار المتوازنة على توفير الطاقة صباحًا، لكن جودة مكوناتها أهم من كثرة الطعام.",main:"أهمية الإفطار المتوازن",detail:"ماذا يوفر الإفطار صباحًا؟",ans:"الطاقة",inf:"ما الذي تؤكد عليه الفقرة؟",iAns:"النوعية أهم من كثرة الطعام"},
{p:"عند إعادة تدوير الورق يُجمع الورق المستعمل ويُفرز ثم يُعالج لصنع منتجات ورقية جديدة، ما يقلل كمية المخلفات.",main:"عملية إعادة تدوير الورق",detail:"ما أول إجراء ورد في الفقرة؟",ans:"جمع الورق المستعمل",inf:"ما أثر التدوير المتوقع؟",iAns:"تقليل المخلفات"},
{p:"تُسهم القراءة اليومية في توسيع المفردات وتحسين فهم النصوص، ولا تتطلب البداية إلا مدة قصيرة منتظمة.",main:"أثر القراءة اليومية",detail:"ما المهارة التي تُحسنها القراءة؟",ans:"فهم النصوص",inf:"كيف يُنصح بالبدء بالقراءة؟",iAns:"بمدة قصيرة منتظمة"},
{p:"عند وقوع الزلازل ينبغي الابتعاد عن النوافذ والاحتماء تحت أثاث متين حتى يتوقف الاهتزاز، ثم اتباع تعليمات السلامة.",main:"إرشادات السلامة وقت الزلازل",detail:"عمّ ينبغي الابتعاد؟",ans:"النوافذ",inf:"ما الغرض من الاحتماء؟",iAns:"تقليل الإصابة أثناء الاهتزاز"}
];
const enReading=[
{p:"Maya takes the bus to school every morning. She leaves home at seven and reaches school before eight.",main:"Maya's daily trip to school",detail:"How does Maya travel to school?",ans:"By bus",inf:"What can we conclude about Maya's arrival?",iAns:"She arrives before eight"},
{p:"Plants need light and water to grow. Without enough light, many plants become weak and develop slowly.",main:"What plants need to grow",detail:"What do plants need besides water?",ans:"Light",inf:"What may happen without light?",iAns:"Plants may grow slowly"},
{p:"The local library opens at nine and closes at six. Members may borrow three books for two weeks.",main:"Library hours and borrowing rules",detail:"How many books may a member borrow?",ans:"Three",inf:"Can a member borrow ten books at once?",iAns:"No"},
{p:"Lina studied vocabulary for fifteen minutes each day. After a month, she understood more words in her reading.",main:"Regular vocabulary practice",detail:"How long did Lina study each day?",ans:"Fifteen minutes",inf:"What likely helped her progress?",iAns:"Daily practice"},
{p:"The school garden has tomatoes, mint, and flowers. Students take turns watering the plants.",main:"The school garden",detail:"What do students do in turns?",ans:"Water the plants",inf:"What is needed to keep the garden healthy?",iAns:"Regular care"},
{p:"A new bike path connects the park and the station. It gives residents another way to travel without using a car.",main:"A new bicycle route",detail:"What does the path connect?",ans:"The park and the station",inf:"What might the path reduce?",iAns:"Some car trips"},
{p:"Omar checked the weather before his trip. He packed a raincoat because the forecast predicted showers.",main:"Preparing for expected rain",detail:"What did Omar pack?",ans:"A raincoat",inf:"What did the forecast predict?",iAns:"Rain showers"},
{p:"The museum offers free entry on Fridays. On other days, visitors must buy a ticket.",main:"Museum entry rules",detail:"When is entry free?",ans:"On Fridays",inf:"What happens on Monday?",iAns:"Visitors need a ticket"},
{p:"Sara saved part of her allowance each week. After several months, she bought a new backpack without borrowing money.",main:"Saving money for a purchase",detail:"What did Sara buy?",ans:"A backpack",inf:"How did Sara pay for it?",iAns:"With her savings"},
{p:"Healthy sleep habits include keeping a regular bedtime and avoiding bright screens just before going to sleep.",main:"Healthy sleeping habits",detail:"What should people avoid before bed?",ans:"Bright screens",inf:"What routine does the text recommend?",iAns:"A regular bedtime"},
{p:"The science club tested two paper airplanes. The second design flew farther in three repeated trials.",main:"Comparing paper airplane designs",detail:"Which design flew farther?",ans:"The second design",inf:"Why were the trials repeated?",iAns:"To check the result"},
{p:"The bakery uses fresh flour every day and closes at five in the afternoon. Customers often visit early for bread.",main:"The bakery's daily routine",detail:"When does the bakery close?",ans:"At five",inf:"Why may customers visit early?",iAns:"To buy bread early"}
];
function reading(track,id,i){
const ar=track==="verbal",passages=ar?arReading:enReading,row=passages[Math.floor(i/3)%passages.length],kind=i%3;
const qprefix=ar?"اقرأ النص ثم أجب: ":"Read and answer: ";
if(kind===0)return mc(track,id,i,qprefix+row.p+" "+(ar?"ما الفكرة الرئيسة؟":"What is the main idea?"),row.main,ar?["وصف مباراة رياضية","مقارنة أسعار المنتجات","تاريخ أحد المخترعين"]:["A history of computers","Rules for football","Cooking at home"],ar?"الفكرة الجامعة للعبارات هي "+row.main:row.main+" is supported by the full passage.");
if(kind===1)return mc(track,id,i,qprefix+row.p+" "+row.detail,row.ans,ar?["شراء هاتف جديد","التنافس الرياضي","السفر بالطائرة"]:["At midnight","With a friend","By airplane"],ar?"الإجابة مذكورة في النص صراحة.":"The detail appears explicitly in the passage.");
return mc(track,id,i,qprefix+row.p+" "+row.inf,row.iAns,ar?["لا يمكن اتخاذ أي خطوة","زيادة الضوضاء","الابتعاد عن القراءة"]:["They never work","Only by guessing","It is impossible"],ar?"الاستنتاج يجب أن تؤيده الفقرة.":"The inference must follow from the passage.");
}
const conditions=[
["it rains","will stay indoors"],["we finish the homework","will go outside"],["Sara studies carefully","will pass the test"],["the bus arrives on time","will reach school early"],["you heat ice","will melt"],["the weather is sunny","will visit the park"],
["he saves enough money","will buy a bicycle"],["I see the teacher","will ask a question"],["the alarm rings","will wake up"],["the students practice","will improve"],
["the shop opens","will buy bread"],["the train is late","will wait"],["you press this button","will start the machine"],["the lights go out","will use a flashlight"],
["the temperature falls","will wear a coat"],["we leave now","will catch the bus"],["the team wins","will celebrate"],["she calls me","will answer"],["they finish early","will help us"],["the ground is wet","will walk carefully"],
["you mix blue and yellow","will get green"],["the computer restarts","will open the file"],["the road is closed","will take another road"],["the baby sleeps","will keep quiet"],["it snows","will make a snowman"],
["we have enough time","will visit the museum"],["the rain stops","will go for a walk"],["he reads the instructions","will understand the task"],["they arrive early","will find seats"],["you water the plant","will grow"]
];
const comparisons=[
["a giraffe","a goat","taller"],["a plane","a bicycle","faster"],["an elephant","a cat","heavier"],["a mountain","a small hill","higher"],["a bus","a bicycle","larger"],["winter","summer","colder"],["a river","a stream","wider"],["the ocean","a pond","deeper"],["a car","a bicycle","more expensive"],["an adult","a small child","older"],["an elephant","a mouse","bigger"],["a skyscraper","a house","taller"],
["a cheetah","a tortoise","faster"],["a dictionary","a short note","longer"],["the desert","a garden","drier"],["a computer","a pencil","more complex"],["a large suitcase","a wallet","heavier"],["a highway","a narrow lane","wider"],["a tree","a blade of grass","taller"],["a blue whale","a dolphin","bigger"],["a full bottle","an empty bottle","heavier"],["an airport","a small bus stop","larger"],["a library","a single book","larger"],["a bicycle","a truck","lighter"],["the sun","the moon","larger"],["ice","warm water","colder"],["a lake","a puddle","deeper"],["a long novel","a short story","longer"],["a mountain road","a flat road","steeper"],["a marathon","a short race","longer"]
];
const requirements=[
["wear a seat belt while driving","must"],["stop at a red traffic light","must"],["show a valid ticket before boarding","must"],["follow the safety rules in this laboratory","must"],["wear protective equipment in this restricted area","must"],["obey the speed limit","must"],["keep the emergency exit clear","must"],["show your passport at border control","must"],["submit the form before the official deadline","must"],["follow the instructions during the examination","must"],
["drink water regularly to stay hydrated","should"],["read every question carefully","should"],["review your notes before a quiz","should"],["sleep enough before an important test","should"],["take short breaks while studying","should"],["check a website source before sharing news","should"],["ask for clarification if a rule is unclear","should"],["organize your study plan","should"],["eat balanced meals","should"],["practice pronunciation every day","should"],
["swim well after years of lessons","can"],["speak three languages fluently","can"],["solve simple equations quickly","can"],["read a short English passage","can"],["ride a bicycle without support","can"],["use a calculator correctly","can"],["write a clear email","can"],["play the piano","can"],["recognize the main idea of a paragraph","can"],["count to one hundred in English","can"]
];
const relatives=[
["student","helped us yesterday","who"],["teacher","explained the lesson","who"],["doctor","treated the patient","who"],["writer","won the award","who"],["boy","lives next door","who"],["girl","called me","who"],["engineer","designed the bridge","who"],["artist","painted the mural","who"],["nurse","works at the hospital","who"],["driver","stopped the bus","who"],["scientist","found the answer","who"],["player","scored the goal","who"],
["book","has a blue cover","which"],["phone","is on the table","which"],["car","needs repair","which"],["camera","belongs to Sara","which"],["lamp","lights this room","which"],["painting","hangs in the hall","which"],["chair","stands by the window","which"],["bag","contains my books","which"],["computer","starts quickly","which"],["window","faces the garden","which"],["clock","shows the time","which"],["key","opens the front door","which"],["door","leads to the kitchen","which"],["road","connects two towns","which"],["machine","prints labels","which"],["apple","is on the plate","which"],["screen","shows the answer","which"],["bicycle","has a red frame","which"]
];
const passives=[
["The hospital","built","in 2004"],["The school","opened","in 2014"],["The bridge","repaired","last year"],["The museum","renovated","in 2018"],["The car","washed","yesterday"],["The classroom","cleaned","this morning"],["The book","published","in 2020"],["The road","completed","in 2011"],["The letter","delivered","yesterday"],["The window","fixed","last week"],["The school wall","painted","last summer"],["The report","written","yesterday"],["The park","opened","last spring"],["The cake","baked","this morning"],["The email","sent","an hour ago"],["The road sign","installed","last month"],["The poster","printed","yesterday"],["The computer","repaired","last Tuesday"],["The room","decorated","in June"],["The match","played","last night"],["The test","marked","last week"],["The package","delivered","last Friday"],["The house","sold","last winter"],["The song","recorded","in 2016"],["The building","designed","in 2019"],["The document","signed","yesterday"],["The tickets","sold","last night"],["The chairs","arranged","this morning"],["The rooms","cleaned","yesterday"],["The cars","washed","last weekend"],["The apples","picked","in autumn"],["The students","invited","last month"]
];
window.APT_GENERATE=function(t,i){
const id=t.id;
if(id==="analogy"){const x=pairs[i%pairs.length];return mc("verbal",id,i,"أكمل العلاقة: "+x[0],x[1],x.slice(2),"نبحث عن العلاقة بين الكلمتين لا عن تشابه شكلي.");}
if(id==="completion"){const x=completions[i%completions.length];return mc("verbal",id,i,"اختر الكلمة الأنسب: "+x[0],x[1],x.slice(2),"الاختيار يحافظ على ترابط المعنى وأداة الربط.");}
if(id==="reading"||id==="readingstep")return reading(t.track,id,i);
if(id==="conditional"){const x=conditions[i%conditions.length],v=x[1];return mc("step",id,i,"If "+x[0]+" tomorrow, we ____ ("+v.replace("will ","")+").",v,["would "+v.replace("will ",""),"have "+v.replace("will ",""),"are "+v.replace("will ","")],"First Conditional: If + present, will + base verb.");}
if(id==="comparison"){const x=comparisons[i%comparisons.length],v=x[2];return mc("step",id,i,"In general, "+x[0]+" is ____ than "+x[1]+".",v,["most "+v,"very "+v,"as "+v],"Use a comparative adjective with than.");}
if(id==="modals"){const x=requirements[i%requirements.length];const pref=x[1]==="must"?"This is an official rule: ":x[1]==="should"?"This is good advice (not a legal requirement): ":"This person has the ability to ";
const end=x[1]==="can"?"They ____ "+x[0]+".":"You ____ "+x[0]+".";
return mc("step",id,i,pref+end,x[1],["might","can","should","must"].filter(y=>y!==x[1]).slice(0,3),"Must = obligation; should = advice; can = ability.");}
if(id==="relative"){const x=relatives[i%relatives.length];return mc("step",id,i,"The "+x[0]+" ____ "+x[1]+" is important in this story.",x[2],["when","where",x[2]==="who"?"which":"who"],"Who refers to a person; which refers to a thing.");}
if(id==="passive"){const x=passives[i%passives.length],plural=x[0].startsWith("The tickets")||x[0].startsWith("The chairs")||x[0].startsWith("The rooms")||x[0].startsWith("The cars")||x[0].startsWith("The apples")||x[0].startsWith("The students");return mc("step",id,i,x[0]+" ____ "+x[2]+".",(plural?"were ":"was ")+x[1],[x[1],"has "+x[1],(plural?"are ":"is ")+x[1]],"Past Passive = was/were + past participle.");}
return previous(t,i);
};
})();