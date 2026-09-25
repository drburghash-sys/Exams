// Training data for Aptitude + STEP Trainer
// Original educational bank; not copied from any test booklet.
window.TRAINER_DATA = (() => {
  const enTSV = `
abandon|يتخلى عن|leave|retain
abundant|وفير|plentiful|scarce
accurate|دقيق|correct|inaccurate
adapt|يتكيف|adjust|resist
adequate|كافٍ|sufficient|insufficient
admire|يعجب بـ|respect|despise
advantage|ميزة|benefit|disadvantage
adverse|سلبي|unfavorable|favorable
aggressive|عدواني|hostile|gentle
alter|يغيّر|change|preserve
ambiguous|غامض|unclear|clear
ancient|قديم جدًا|old|modern
apparent|واضح|obvious|hidden
approve|يوافق|accept|reject
approximate|تقريبي|estimated|exact
arise|ينشأ|emerge|disappear
artificial|صناعي|synthetic|natural
assist|يساعد|help|hinder
assume|يفترض|suppose|verify
attain|يحقق|achieve|fail
aware|مدرك|conscious|unaware
beneficial|مفيد|helpful|harmful
brief|موجز|short|lengthy
broad|واسع|wide|narrow
calm|هادئ|peaceful|agitated
capable|قادر|able|incapable
cautious|حذر|careful|reckless
cease|يتوقف|stop|continue
certain|مؤكد|sure|uncertain
complex|معقد|complicated|simple
comprehend|يفهم|understand|misunderstand
conclude|يستنتج|infer|begin
conserve|يحافظ على|preserve|waste
considerable|كبير/ملحوظ|substantial|minor
constant|ثابت|steady|variable
construct|يبني|build|destroy
consume|يستهلك|use|save
contemporary|معاصر|modern|ancient
contradict|يناقض|oppose|confirm
crucial|حاسم|essential|trivial
decline|يتناقص|decrease|increase
deficient|ناقص|lacking|adequate
deliberate|متعمد|intentional|accidental
dense|كثيف|thick|sparse
derive|يستمد|obtain|lose
deteriorate|يتدهور|worsen|improve
diminish|يتناقص|decrease|expand
distinct|متميز/واضح|different|similar
diverse|متنوع|varied|uniform
domestic|محلي|local|foreign
durable|متين|long-lasting|fragile
eager|متحمس|keen|reluctant
eliminate|يزيل|remove|retain
emerge|يظهر|appear|vanish
emphasize|يؤكد|stress|downplay
enormous|هائل|huge|tiny
essential|ضروري|necessary|optional
evident|واضح|obvious|unclear
exceed|يتجاوز|surpass|fall short
expand|يتوسع|enlarge|shrink
explicit|صريح|clear|implicit
external|خارجي|outer|internal
feasible|قابل للتنفيذ|possible|impossible
flexible|مرن|adaptable|rigid
fragile|هش|delicate|strong
frequent|متكرر|common|rare
fundamental|أساسي|basic|secondary
generous|كريم|giving|stingy
genuine|أصيل/حقيقي|authentic|fake
gradual|تدريجي|progressive|sudden
hostile|عدائي|unfriendly|friendly
identical|مطابق|same|different
ignore|يتجاهل|neglect|notice
illustrate|يوضح|demonstrate|confuse
immense|ضخم|vast|tiny
imply|يلمح إلى|suggest|state
improve|يحسن|enhance|worsen
inevitable|حتمي|unavoidable|avoidable
infer|يستنتج|deduce|misinterpret
initial|أولي|first|final
innovative|مبتكر|creative|conventional
internal|داخلي|inner|external
maintain|يحافظ|preserve|abandon
major|رئيسي|important|minor
mandatory|إلزامي|required|optional
modify|يعدّل|change|preserve
mutual|متبادل|reciprocal|one-sided
negligible|ضئيل جدًا|insignificant|substantial
obtain|يحصل على|acquire|lose
obvious|واضح|clear|obscure
occur|يحدث|happen|cease
omit|يحذف|exclude|include
opponent|خصم|rival|ally
optimistic|متفائل|hopeful|pessimistic
ordinary|عادي|normal|exceptional
permanent|دائم|lasting|temporary
permit|يسمح|allow|forbid
precise|دقيق|exact|vague
predict|يتنبأ|forecast|review
prevent|يمنع|stop|allow
primary|أساسي|main|secondary
prohibit|يحظر|forbid|permit
prominent|بارز|notable|obscure
purchase|يشتري|buy|sell
rapid|سريع|quick|slow
rare|نادر|uncommon|common
reduce|يقلل|decrease|increase
reject|يرفض|refuse|accept
reliable|موثوق|dependable|unreliable
reluctant|متردد|unwilling|eager
relevant|ذو صلة|related|irrelevant
remote|بعيد|distant|nearby
require|يتطلب|need|dispense
retain|يحتفظ|keep|discard
rigid|جامد|inflexible|flexible
scarce|شحيح/نادر|limited|abundant
significant|مهم|important|trivial
similar|مشابه|alike|different
stable|مستقر|steady|unstable
sufficient|كافٍ|adequate|insufficient
temporary|مؤقت|short-term|permanent
terminate|ينهي|end|begin
transform|يحوّل|change|preserve
transparent|شفاف/واضح|clear|opaque
typical|نموذجي|usual|unusual
unique|فريد|distinctive|common
urgent|عاجل|pressing|nonurgent
vacant|شاغر/فارغ|empty|occupied
valid|صحيح/ساري|sound|invalid
vary|يتنوع|differ|remain
vast|شاسع|immense|tiny
verify|يتحقق|confirm|doubt
vital|حيوي|essential|unimportant
voluntary|طوعي|optional|compulsory
vulnerable|عرضة للخطر|exposed|protected
withdraw|ينسحب|retreat|advance
withstand|يتحمل|resist|yield
abrupt|مفاجئ|sudden|gradual
absurd|غير منطقي|ridiculous|reasonable
acquire|يكتسب|obtain|lose
adjacent|مجاور|neighboring|distant
allocate|يخصص|assign|withhold
anticipate|يتوقع|expect|overlook
arbitrary|اعتباطي|random|reasoned
coherent|مترابط|logical|incoherent
compel|يجبر|force|deter
consecutive|متتالٍ|successive|interrupted
credible|موثوق|believable|doubtful
decrease|ينخفض|decline|increase
detect|يكتشف|identify|miss
discrete|منفصل|separate|continuous
distort|يشوه|misrepresent|clarify
efficient|كفؤ|effective|inefficient
enhance|يعزز|improve|diminish
exceptional|استثنائي|outstanding|ordinary
excessive|مفرط|extreme|moderate
fluctuate|يتذبذب|vary|stabilize
formulate|يصوغ|devise|abandon
impartial|محايد|unbiased|biased
inherent|متأصل|intrinsic|acquired
integrate|يدمج|combine|separate
justify|يبرر|explain|condemn
minimal|ضئيل|least|maximal
notable|ملحوظ|remarkable|insignificant
persistent|مستمر|continuing|temporary
potential|محتمل|possible|impossible
predominant|سائد|dominant|minor
preserve|يحافظ على|protect|destroy
profound|عميق|deep|superficial
random|عشوائي|arbitrary|systematic
resilient|مرن/قادر على التعافي|robust|fragile
restrict|يقيد|limit|expand
subsequent|لاحق|following|previous
substantial|كبير|considerable|minor
sustain|يدعم/يحافظ|maintain|weaken
tentative|مبدئي|provisional|definite
undergo|يخضع لـ|experience|avoid
widespread|واسع الانتشار|common|limited
`;

  const arTSV = `
أناة|تمهل|تروٍ|عجلة
إباء|امتناع بعزة|عزة|خضوع
إجلال|تعظيم|تعظيم|احتقار
إحجام|امتناع|تردد|إقدام
إذعان|خضوع|استسلام|مقاومة
أفول|غروب|غياب|شروق
ألفة|مودة واعتياد|مودة|نفور
بائس|شديد الفقر أو الحزن|تعيس|سعيد
بديهي|واضح دون برهان|واضح|معقد
بذخ|إسراف|ترف|اقتصاد
بليغ|فصيح مؤثر|فصيح|ركيك
تؤدة|تمهل|أناة|عجلة
تبجيل|تعظيم|احترام|ازدراء
تبديد|تفريق وإضاعة|إهدار|حفظ
تجلد|تصبر|صبر|جزع
تحري|طلب الدقة|تدقيق|إهمال
تريث|تمهل|انتظار|استعجال
ثبات|استقرار|رسوخ|تذبذب
جلي|واضح|بيّن|غامض
جمود|ثبات بلا حركة|سكون|مرونة
جموح|اندفاع شديد|اندفاع|هدوء
حاذق|ماهر|بارع|غافل
حثيث|سريع متواصل|سريع|بطيء
حفاوة|ترحيب واهتمام|ترحيب|جفاء
حصيف|عاقل محكم الرأي|حكيم|أحمق
خامل|قليل النشاط|كسول|نشيط
دأب|واظب|استمر|انقطع
دحض|أبطل بالحجة|فنّد|أثبت
راسخ|ثابت قوي|ثابت|متزعزع
رصين|متين ومحكم|متين|هش
رغد|سعة ونعيم|رفاه|ضيق
زاهد|قليل الرغبة|مترفع|طامع
زهو|فخر وإعجاب|فخر|تواضع
ساطع|شديد اللمعان|لامع|خافت
سخي|كريم|جواد|بخيل
سديد|صائب|صحيح|خاطئ
شحيح|شديد البخل|بخيل|كريم
شغف|شدة الحب|ولع|نفور
شموخ|علو وعزة|رفعة|ذلة
ضئيل|قليل|يسير|كثير
ضجر|ملل|سأم|نشاط
طائش|متهور|متهور|رزين
طموح|تطلع لمرتبة أعلى|تطلع|قناعة
عابر|مؤقت|زائل|دائم
عتيق|قديم|قديم|حديث
عسير|صعب|شاق|يسير
غزير|كثير|وفير|نزر
فادح|شديد وجسيم|جسيم|هين
فسيح|واسع|رحب|ضيق
فطن|ذكي سريع الفهم|نبيه|غافل
فتور|ضعف النشاط|خمول|حماس
فج|غير ناضج أو غليظ|فظ|ناضج
قفر|خالٍ|خالي|عامر
قنوع|راضٍ بالقليل|راضٍ|طامع
كدر|ضيق وصفاء ناقص|هم|صفاء
لبق|حسن التصرف والكلام|ماهر|أخرق
متين|قوي محكم|قوي|هش
مبهم|غير واضح|غامض|جلي
مجدب|قليل الخير والمطر|قاحل|خصب
محنك|خبير|خبير|غر
مقتضب|مختصر|موجز|مطول
مكابرة|رفض الحق عنادًا|عناد|إذعان
ملحاح|شديد الإلحاح|لحوح|متسامح
مهيب|ذو هيبة|جليل|حقير
نزر|قليل|ضئيل|غزير
نضب|نفد|نفد|فاض
نفور|ابتعاد وكراهية|جفاء|ألفة
نهم|شديد الرغبة|شره|قنوع
وجل|خوف|خشية|طمأنينة
وهن|ضعف|ضعف|قوة
وقور|رزين ذو هيبة|رزين|طائش
يسير|سهل أو قليل|سهل|عسير
يزدهر|ينمو ويتقدم|ينمو|يتراجع
يذعن|يخضع|يستسلم|يقاوم
يستفيض|يطيل ويتوسع|يطيل|يقتضب
مواظب|مستمر على العمل|مثابر|منقطع
نادر|قليل الوجود|شحيح|شائع
شائع|واسع الانتشار|منتشر|نادر
وفير|كثير|غزير|قليل
موجز|مختصر|مقتضب|مطول
فصيح|حسن البيان|بليغ|ركيك
ركيك|ضعيف الأسلوب|ضعيف|بليغ
صارم|شديد حازم|حازم|متساهل
متردد|غير حاسم|متحير|حازم
دؤوب|كثير المواظبة|مثابر|كسول
مثابر|مستمر رغم الصعوبة|مواظب|منقطع
مزدهر|نامٍ ومتقدم|نامٍ|متراجع
قاحل|يابس قليل النبات|مجدب|خصب
خصب|كثير النماء|وفير|قاحل
عميق|بعيد الغور|غائر|سطحي
سطحي|غير عميق|ضحل|عميق
متواضع|غير متكبر|بسيط|متكبر
متكبر|متعاظم|مغرور|متواضع
حازم|ثابت في القرار|صارم|متردد
هش|سريع الكسر|ضعيف|متين
مرن|قابل للتكيف|لين|جامد
جامد|غير مرن|صلب|مرن
مؤقت|لفترة محدودة|عابر|دائم
دائم|مستمر|باقٍ|مؤقت
محدود|قليل النطاق|محصور|واسع
شامل|واسع جامع|عام|جزئي
جزئي|غير كامل|بعضي|شامل
متواتر|متكرر|متتابع|نادر
طارئ|حادث مفاجئ|عارض|معتاد
معتاد|مألوف|طبيعي|طارئ
صريح|واضح مباشر|واضح|مبهم
ضمني|غير مصرح به|مفهوم|صريح
ملموس|يمكن إدراكه|محسوس|مجرد
مجرد|غير مادي|ذهني|ملموس
منصف|عادل|عادل|جائر
جائر|ظالم|ظالم|منصف
مقتدر|قادر|متمكن|عاجز
عاجز|غير قادر|ضعيف|مقتدر
متين الحجة|قوي البرهان|مقنع|واهي
واهي|ضعيف|هش|متين
رصانة|وقار وإحكام|وقار|طيش
حنكة|خبرة وحسن تصرف|خبرة|غرارة
غر|قليل الخبرة|ساذج|محنك
فادح الخسارة|شديد الضرر|جسيم|طفيف
طفيف|قليل|يسير|فادح
متباين|مختلف|متفاوت|متشابه
متشابه|متقارب الصفات|مماثل|متباين
متنامٍ|آخذ في الزيادة|متزايد|متناقص
متناقص|آخذ في النقص|متراجع|متنامٍ
محكم|متقن|متين|مضطرب
مضطرب|غير مستقر|متذبذب|مستقر
مستقر|ثابت|راسخ|مضطرب
جوهري|أساسي|رئيسي|ثانوي
هامشي|ثانوي قليل الأهمية|ثانوي|جوهري
قاطع|حاسم|جازم|محتمل
محتمل|غير مؤكد|ممكن|قاطع
متجرد|محايد عن الهوى|محايد|منحاز
منحاز|مائل لطرف|متعصب|متجرد
`;

  const parse = (txt, lang) => txt.trim().split(/\n+/).map((line, i) => {
    const [word, meaning, synonym, antonym] = line.split('|');
    return { id: lang + '-' + (i + 1), lang, word, meaning, synonym, antonym };
  });

  const englishWords = parse(enTSV, 'en');
  const arabicWords = parse(arTSV, 'ar');

  const grammar = [
    {skill:'since-for',q:'I have lived here ____ 2022.',o:['for','since','ago','during'],a:1,rule:'Since + نقطة بداية زمنية. For + مدة.'},
    {skill:'since-for',q:'She has studied English ____ three years.',o:['since','for','ago','from'],a:1,rule:'For تستخدم مع مدة زمنية.'},
    {skill:'present-perfect',q:'I ____ my homework already.',o:['finish','finished','have finished','am finishing'],a:2,rule:'Already غالبًا تأتي مع Present Perfect.'},
    {skill:'past-simple',q:'We ____ the museum yesterday.',o:['visit','visited','have visited','are visiting'],a:1,rule:'Yesterday وقت منتهٍ في الماضي → Past Simple.'},
    {skill:'past-continuous',q:'When I called, he ____ dinner.',o:['eats','was eating','has eaten','is eating'],a:1,rule:'حدث مستمر قطعه حدث آخر في الماضي → Past Continuous.'},
    {skill:'past-perfect',q:'By the time we arrived, the train ____.',o:['left','has left','had left','leaves'],a:2,rule:'حدث وقع قبل حدث ماضٍ آخر → Past Perfect.'},
    {skill:'present-simple',q:'He usually ____ coffee in the morning.',o:['drink','drinks','is drinking','drank'],a:1,rule:'Usually تشير إلى عادة → Present Simple.'},
    {skill:'present-continuous',q:'Look! The children ____.',o:['play','played','are playing','have played'],a:2,rule:'حدث يجري الآن → Present Continuous.'},
    {skill:'future',q:'I think it ____ tomorrow.',o:['rains','rained','will rain','has rained'],a:2,rule:'توقع عن المستقبل → will + base verb.'},
    {skill:'passive-present',q:'English ____ in many countries.',o:['speaks','is spoken','spoke','is speaking'],a:1,rule:'Present Passive = am/is/are + V3.'},
    {skill:'passive-past',q:'The bridge ____ in 2010.',o:['built','was built','is building','has build'],a:1,rule:'Past Passive = was/were + V3.'},
    {skill:'passive-future',q:'The results will ____ tomorrow.',o:['announce','be announced','announced','be announce'],a:1,rule:'Future Passive = will be + V3.'},
    {skill:'passive-perfect',q:'The letters have ____.',o:['send','sent','been sent','be sent'],a:2,rule:'Present Perfect Passive = have/has been + V3.'},
    {skill:'passive-continuous',q:'The room ____ when I arrived.',o:['was being cleaned','was cleaned','is cleaning','has cleaned'],a:0,rule:'Past Continuous Passive = was/were being + V3.'},
    {skill:'tense-choice',q:'I ____ him three times this week.',o:['saw','have seen','see','am seeing'],a:1,rule:'فترة زمنية لم تنتهِ بعد → غالبًا Present Perfect.'},
    {skill:'tense-choice',q:'At 8 p.m. yesterday, we ____ TV.',o:['watch','watched','were watching','have watched'],a:2,rule:'وقت محدد أثناء الماضي → Past Continuous.'},
    {skill:'tense-choice',q:'She ____ before the bus arrived.',o:['left','had left','has left','leaves'],a:1,rule:'الحدث الأسبق في الماضي → Past Perfect.'},
    {skill:'tense-choice',q:'They ____ to Riyadh last week.',o:['go','went','have gone','are going'],a:1,rule:'Last week → Past Simple.'},
    {skill:'passive-present',q:'The rooms ____ every morning.',o:['clean','are cleaned','cleaned','are cleaning'],a:1,rule:'Present Passive = are + V3.'},
    {skill:'passive-modal',q:'Seat belts must ____ at all times.',o:['wear','be worn','wore','be wearing'],a:1,rule:'Modal Passive = modal + be + V3.'}
  ];

  return { englishWords, arabicWords, grammar };
})();
