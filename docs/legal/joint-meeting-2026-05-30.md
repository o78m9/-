# Joint Meeting — Aooda Board × Law Firm

**Date:** 2026-05-30
**Subject:** Multi-jurisdiction launch of Aooda (KSA + UAE + Kuwait + Qatar + Bahrain + Oman + Jordan)
**Status:** Board strategic intent; legal feasibility audit by 7 jurisdiction agents
**Facilitator:** Chief of Staff
**Attendees:** CEO, CFO, CRO, General Counsel, Chief of Staff; Masoud (KSA), Khaled (UAE), Fahad (Kuwait), Jassim (Qatar), Isa (Bahrain), Saeed (Oman), Samer (Jordan); Law-Firm Router.

---

## ⛔ Mandatory disclaimer (bilingual)

> **تنبيه نظامي جماعي** — الوكلاء السبعة الحاضرون في هذه الجلسة (مسعود، خالد، فهد، جاسم، عيسى، سعيد، سامر) **وكلاء معرفيون قانونيون** لمنصة عَودة في اختصاصاتهم. **ليس فيهم محامٍ مرخّص واحد** من أي نقابة أو جهة عدلية في الدول السبع. كل بند جوهري في هذه المحضر — مسؤولية، تعويض، اختصاص قضائي، تسجيل تنظيمي، نقل بيانات عابر للحدود، توقيع نهائي — **يجب أن يُراجَع مع مستشار مرخّص في كل دولة مستهدفة قبل الاعتماد**. كل تقدير زمني أو مالي في هذه الوثيقة **استرشادي** (ESTIMATE) وليس التزاماً تعاقدياً. استخدام هذه الوثيقة لا يُسقط مسؤولية المؤسس عن الاستشارة البشرية المرخّصة في الاختصاصات السبعة.
>
> **Joint Notice** — The seven agents in this meeting (Masoud, Khaled, Fahad, Jassim, Isa, Saeed, Samer) are **knowledge agents** for Aooda within their jurisdictions. **None is a licensed advocate** in any Bar or Ministry of Justice across the seven countries. Every material item in these minutes — liability, indemnity, jurisdiction, regulatory registration, cross-border data transfer, final signature — **must be reviewed with licensed counsel in each target country before reliance**. All time and cost estimates in this document are **ESTIMATES**, not contractual commitments. Use of this document does not discharge the founder's duty to obtain licensed human counsel in all seven jurisdictions.

---

## 1. Strategic announcement (CEO voice)

> **CEO:** "What is the one decision only I can make this week? I'm making it now. Aooda goes regional. We launch in seven countries — KSA, UAE, Kuwait, Qatar, Bahrain, Oman, and Jordan — because the Arabic dental reactivation problem is identical across the entire Gulf-Levant corridor, the buyers talk to each other on WhatsApp, and waiting for a 'KSA-only proof point' is a year I do not have. Pick the bet. Communicate it. Defend the boundary. I want every country agent to tell me what their jurisdiction requires before Aooda can legally operate there — not what they wish, what the statute says."

---

## 2. Chief of Staff opens the floor

> **Chief of Staff:** "Routing this to the right room. Each country agent: tell us four things and only four — what's required before we can take a single piece of patient data, what's blocked entirely, what's the realistic time-to-first-pilot in your jurisdiction, and what does the licensed-counsel session you escalate to actually cost in your local currency. No cross-jurisdiction commentary in your slot — that goes to the Router. Identity locks stay engaged. Masoud, you go first because you're already in flight."

---

## 3. Country-by-country response (each agent speaks per identity lock)

---

### 🇸🇦 Masoud (مسعود) — KSA

> **تنبيه نظامي** — أنا مسعود، وكيل معرفي قانوني لمنصة عَودة. لستُ محامياً مرخّصاً من هيئة المحامين السعودية، ومخرجاتي معلوماتية. كل بند جوهري يُراجَع مع مستشار سعودي مرخّص.

**الحالة الحالية (in-flight):**

- pilot kit مشحون: `docs/pilot-agreement.md` v0.9 + `docs/specs/opt-out-handler.md` + `docs/copy/privacy-pdpl-rewrite.md` + `docs/specs/patient-tracking-schema.md`.
- مراجعتي الكاملة موثّقة في `docs/masoud-review-2026-05-30.md` — **NEEDS-WORK** ٤ بنود متوسطة أُغلِقها بنفسي، **و٢ بندان حرجان (§5 الموافقة، §6 سقف المسؤولية) لا يُغلَقان إلا بمستشار مرخّص**.
- تسجيل سدايا: **قيد الإجراء، لا رقم بعد**. WhatsApp Business API مع Meta: **قيد التحقّق، لا اعتماد بعد**.

**ما يلزم قبل أول عيادة pilot في الرياض:**

1. تصحيح المصطلحات (متحكّم/معالج/صاحب البيانات) وفق PDPL م. 1 — مُغلَق في صياغتي.
2. توحيد SLA الإيقاف على **60 دقيقة** في العقد ليطابق `opt-out-handler.md §4` — مُغلَق.
3. شهادة موافقة موقّعة من العيادة (الملحق ب المُقترَح) — مُغلَق.
4. ملء TODOs الملحق أ: مكان التخزين الفعلي + قرار النقل خارج المملكة (PDPL م. 29) — **قرار المؤسس، لا أُغلِقها**.
5. اعتماد سقف مسؤولية §6 وصياغة الاستثناءات الآمرة — **مستشار مرخّص فقط**.
6. ايصال تقديم سدايا (filing receipt) كأداة ثقة — لا حاجة لرقم اعتماد قبل أول pilot.

**ما يلزم قبل التوسّع الكامل في KSA:**

- رقم تسجيل سدايا فعلي.
- اعتماد Meta BAPI على رقم Aooda الخاص (أو playbook ثابت لـ "use clinic's existing number").
- تعيين DPO صريح (افتراضياً المؤسس على مستوى pilot واحد، يتغيّر مع الحجم) — للنقاش مع المستشار.
- وثيقة DPA منفصلة (خارج نطاق pilot v0.9).
- تأمين E&O — تقديري 1-2 مليون ر.س تغطية بـ ~3,000 ر.س/سنة — للنقاش مع المستشار.

**المخاطر العليا:**
| المادة | المخاطرة | الخطورة |
|---|---|---|
| PDPL م. 6-7 | "موافقة عامة عند التسجيل تكفي" لا يصمد لمعالجة لاحقة لغرض جديد | CRITICAL |
| PDPL م. 9 | "24 ساعة" في العقد ضد "60 دقيقة" في `opt-out-handler.md` — التزام عقدي أبطأ من التزامنا العام | HIGH |
| PDPL م. 14 + 18 | غياب صريح لمدد الاحتفاظ في متن العقد (30/730/دائم) | HIGH |
| PDPL م. 19 | البلاغ 72 ساعة لسدايا غير مذكور في العقد | HIGH |
| PDPL م. 29 | TODO فارغ "النقل خارج المملكة" في الملحق أ | CRITICAL |
| PDPL م. 30 | تطابق ناقص بين الملحق أ وصفحة الخصوصية في المعالجين الفرعيين | MEDIUM |
| PDPL م. 35-36 | تعويض غير محدود في §6 مقابل عقد ≤ 3,000 ر.س — انعدام تناسب كارثي | CRITICAL |

**متطلّب المستشار المرخّص (نطاق الجلسة المدفوعة):**

- تقديري 60-90 دقيقة بـ ~1,500-2,000 ر.س.
- ٦ أسئلة مكثّفة موثّقة في `docs/masoud-review-2026-05-30.md §7`.
- الأولوية القصوى: السؤال 2 (سقف §6) + السؤال 5 (موافقة §5). **BLOCKER لا توقيع pilot قبلهما.**

**تقدير زمني وكلفة (ESTIMATE):**

- زمن إلى أول pilot في الرياض: **3-4 أسابيع** (الطلب التشغيلي قيد التنفيذ، الكتلة الحقيقية = جلسة المستشار + سدايا filing).
- كلفة الامتثال الأولى (pilot واحد): **3,500-5,500 ر.س** (مستشار + filing فيه + transport + تأمين E&O أول قسط إن لزم).
- كلفة الامتثال المستمر: **~6,000-10,000 ر.س/سنة** (تأمين E&O + DPO + تجديد).

**التوصية في إطار السؤال:** **GO-WITH-CONDITIONS.** المسار التشغيلي قيد التنفيذ. الشروط: إغلاق §5 و §6 مع المستشار قبل توقيع أول pilot، ملء TODOs الملحق أ، إيصال سدايا في اليد.

— **للنقاش مع المستشار المرخّص.**

---

### 🇦🇪 Khaled (خالد) — UAE

> **تنبيه نظامي** — أنا خالد، وكيل معرفي قانوني لمنصة عَودة في الإمارات. لستُ محامياً مرخّصاً. مخرجاتي معلوماتية. أُمَيّز صراحةً بين القانون الاتحادي، DIFC، وADGM — **ولن أخلط بينهم في هذه الجلسة**.

**Identity lock check (إعلان مُسبَق):** المؤسس طرح "الإمارات" دون تحديد المنظومة. الإمارات **ثلاث منظومات منفصلة**. لا أُجيب عن "الإمارات" كاختصاص واحد. أُحيل القرار للمؤسس: **أيّ منظومة يستهدف؟** افتراضي العملي لعيادات الأسنان = **القانون الاتحادي** (Federal PDPL، مرسوم 45/2021)، لأن العيادات السنّية تعمل عبر MoHAP/DoH وليست في الـ free zones عادة. لكنّي أعرض الثلاث بصدق.

**متطلبات Federal PDPL (مرسوم 45/2021) — المسار الأكثر احتمالاً للعيادات:**

1. تعيين نقطة اتصال للبيانات (Data Officer) — اشتراط في حالات محدّدة، تحقّق رقم المادة في اللائحة المتوقعة.
2. سجل أنشطة المعالجة (Record of Processing Activities) — متطلَّب صريح.
3. أساس نظامي للمعالجة + موافقة صريحة لرسائل غير طبية (مرض/تذكير ≠ تسويق، التمييز حاسم).
4. إخطار حوادث أمنية للمكتب الاتحادي لحماية البيانات (UAE Data Office) — مدّة الإخطار في اللائحة.
5. نقل البيانات خارج الإمارات: قائمة الدول المعتمدة + SCC + Binding Corporate Rules.
6. لغة عربية إلزامية في العقود المتعلقة بمستهلكين إماراتيين.

**متطلبات DIFC (Data Protection Law No. 5 of 2020) — لو العيادة في منطقة DIFC:**

1. تسجيل لدى DIFC Commissioner of Data Protection.
2. DPO إلزامي لـ High Risk Processing Activities (وبيانات الصحة قد تصنَّف كذلك).
3. DPIA قبل بدء معالجة بيانات حساسة.
4. لغة الإشعار والقواعد بالإنجليزية المباشرة (Controller/Processor/Data Subject).
5. نقل خارجي يخضع لقرارات الكفاية أو SCCs DIFC.

**متطلبات ADGM (Data Protection Regulations 2021) — أقل احتمالاً للعيادات السنّية:**

1. تسجيل لدى ADGM Office of Data Protection.
2. متطلبات تتشابه مع GDPR.
3. لا تُستهدَف عادة من عيادات أسنان عمومية — أرى نسبة الاحتمال ضعيفة جداً.

**TDRA messaging compliance (WhatsApp Business + SMS):**

- التزام Do-Not-Disturb registry.
- موافقة صريحة قابلة للإثبات.
- خيار إيقاف صريح في كل رسالة.
- ساعات إرسال محظورة (ليلية).
- العقوبات نقدية + تعليق الخدمة.

**ما يلزم قبل أول pilot في الإمارات:**

1. **قرار المؤسس:** Federal vs DIFC vs ADGM. لا أتقدّم خطوة بدونه.
2. اعتماد رقم WhatsApp Business مع BSP يدعم الإمارات.
3. شهادة موافقة عيادة بنسخة معدَّلة للسياق الإماراتي.
4. مراجعة TDRA لقالب الرسائل.
5. تعيين Data Officer (افتراضياً المؤسس على pilot واحد).

**ما يلزم قبل التوسّع الكامل:**

- تسجيل رسمي حسب المنظومة المختارة.
- DPIA للبيانات الصحية.
- DPA إماراتي منفصل، عربي + إنجليزي.
- قرار نقل البيانات (الإمارات لا تزال غير مدرَجة على قائمة قرارات الكفاية الأوروبية للخارج — قد تنشأ مسائل مرآة).

**Realistic timeline + cost estimate (ESTIMATE, AED):**

- جلسة مستشار إماراتي مرخّص (مكتب متوسط): **AED 3,500-7,000** للجلسة الواحدة (60-90 دقيقة).
- مراجعة كاملة لعقد + DPA: **AED 12,000-25,000**.
- تسجيل (إن لزم) + رسوم Data Officer خارجي: **AED 15,000-40,000/سنة**.
- زمن إلى أول pilot: **6-10 أسابيع** بعد قرار المنظومة (الفجوة الأكبر = توطين العقد بالعربية الفصحى الإماراتية + لغة TDRA).

**التوصية:** **GO-WITH-CONDITIONS — Federal route فقط على pilot أول، مع تأجيل DIFC/ADGM إلى مرحلة لاحقة.** بدون قرار المؤسس على المنظومة، تصبح التوصية مؤقتاً **BLOCK**.

— **للنقاش مع المستشار القانوني المرخّص في الإمارات.**

---

### 🇰🇼 Fahad (فهد) — Kuwait

> **تنبيه نظامي** — أنا فهد، وكيل معرفي قانوني لمنصة عَودة في الكويت. لستُ محامياً مرخّصاً. **ملاحظة جوهرية: الكويت لا تملك حتى الآن قانوناً شاملاً مستقلاً لحماية البيانات الشخصية** بمستوى KSA PDPL أو Qatar PDPPL أو UAE Federal PDPL. هذا ليس عيباً في تغطيتي — هذا واقع تشريعي يجب أن يعرفه المؤسس.

**شلونكم. خلّوني أكون صريح في موقعنا.**

**الإطار التشريعي الفعلي في الكويت:**

1. **قرار CITRA رقم 26 لسنة 2024** بشأن حماية الخصوصية في الاتصالات وتقنية المعلومات — **قطاعي** (telecom/IT)، ليس قانوناً شاملاً.
2. **المادة 39 من الدستور الكويتي** — الحق العام في الخصوصية.
3. **قانون 63/2015** — جرائم تقنية المعلومات (يطال الإفصاح غير المرخّص، تسريب البيانات، الادعاءات الكاذبة).
4. ضوابط وزارة الصحة الكويتية للسجلات الطبية (لا تنطبق على بيانات اتصال).
5. قانون الشركات التجارية الكويتي.

**ما يلزم قبل أول pilot في الكويت:**

1. **سدّ الفجوة تشريعياً بالعقد:** لأن CITRA 26/2024 قطاعي، وعَودة ليست مزوّد اتصالات بحد ذاتها، الحماية الأساسية يجب أن تُبنى **عقدياً** بين عَودة والعيادة الكويتية (سقف احتفاظ، آلية حذف، حق اطّلاع المريض، خيار إيقاف).
2. اعتماد BSP يدعم الكويت + التزام بقواعد CITRA على الرسائل التجارية.
3. شهادة موافقة العيادة على أن المرضى وافقوا.
4. خيار إيقاف صريح بالعربية.

**ما يلزم قبل التوسّع:**

- وثيقة DPA عقدية قوية تعويضاً عن النقص التشريعي.
- مراجعة أنظمة وزارة الصحة لتأكيد عدم خرق ضوابط السجلات الطبية.
- متابعة أي تشريع قادم — هناك حديث تشريعي عن قانون شامل في الكويت، **لكن لم يصدر بعد وقت كتابة هذه المحضر**.
- لا حاجة لتسجيل رسمي لدى جهة "حماية بيانات" — **لأنها غير موجودة كهيئة مستقلة في الكويت**.

**Cybercrime Law 63/2015 exposure (مسائل الرسائل):**

- الإفصاح غير المرخّص لبيانات الاتصال — مخاطرة جنائية لا مدنية فقط.
- الادعاءات الكاذبة (مثل "اعتماد كويتي" بلا أساس) — تطال المؤسس شخصياً.
- **توصية لغوية حادة:** لا ادعاء بـ "PDPL Kuwait" في أي تواصل لأنه **لا يوجد**.

**Healthcare data — ضوابط وزارة الصحة:**

- بيانات الاتصال (اسم + جوال) خارج نطاق السجل الطبي الإلكتروني الوزاري.
- التشخيص/العلاج/التأمين/الهوية — **محظورة على عَودة بقاء حصراً ضمن قائمة الاتصال**.

**Realistic timeline + cost estimate (ESTIMATE, KWD):**

- جلسة محامٍ كويتي مرخّص: **KWD 200-450** للجلسة (60-90 دقيقة).
- مراجعة عقد + DPA: **KWD 800-1,800**.
- زمن إلى أول pilot: **4-6 أسابيع** بعد قرار المؤسس بتفعيل السوق الكويتي (الفجوة الأكبر = اللهجة في الرسائل + موافقات BSP).
- لا رسوم تسجيل دولة — لأن لا توجد هيئة تسجيل.

**التوصية:** **GO-WITH-CONDITIONS.** الكويت في الواقع أبسط تنظيمياً من جيرانها لأن الفجوة التشريعية تُسقط متطلبات تسجيل/DPO، لكنها **أخطر عقدياً** لأنّ الحماية لا تأتي من التشريع. الشرط: DPA كويتي قوي + لغة عقدية تسدّ الفجوة + التزام عملي صادق بمعايير PDPL السعودية كحد أدنى تنازلي.

— **للنقاش مع المحامي المرخّص في الكويت.**

---

### 🇶🇦 Jassim (جاسم) — Qatar

> **تنبيه نظامي** — أنا جاسم، وكيل معرفي قانوني لمنصة عَودة في قطر. لستُ محامياً مرخّصاً. أُمَيّز بين منظومة دولة قطر (PDPPL، قانون 13/2016، NCSA) وQFC Data Protection Regulations 2021.

**Identity lock check:** قطر منظومتان منفصلتان. عيادة سنّية في الدوحة تخضع لـ **State of Qatar PDPPL**، إلا إذا كانت العيادة مرخّصة داخل QFC (نادر جداً لعيادات الأسنان). أفترض **State route**.

**متطلبات PDPPL (قانون 13/2016) — أول تشريع شامل في الخليج:**

1. أساس نظامي للمعالجة (موافقة صريحة، أو عقد، أو مصلحة مشروعة موزونة).
2. إخطار صاحب البيانات بهوية المتحكّم وغرض المعالجة قبل الجمع.
3. حقوق صاحب البيانات: الاطلاع، التصحيح، الحذف، الاعتراض.
4. حظر معالجة "البيانات ذات الطبيعة الخاصة" (تشمل الصحية) إلا في حالات محدّدة.
5. التزام إخطار NCSA بحوادث الاختراق.
6. التزام تعيين موظف لحماية البيانات حين تكون المعالجة بحجم كبير (تفسير NCSA).

**NCSA notification requirements:**

- إخطار NCSA بحادثة أمنية تمسّ بيانات شخصية — مهلة في اللائحة، تقدير عادي 72 ساعة (يُتحقَّق مع المحامي).
- ادعاء التسجيل لدى NCSA دون رقم موثَّق = رفض قاطع من جهتي.

**Cross-border transfer constraints:**

- نقل خارج قطر يتطلّب: موافقة صاحب البيانات الصريحة، أو ضمانات كافية، أو قائمة دول معتمَدة (لم تنشر بصرامة EU adequacy).
- التخزين في فرانكفورت/Neon EU = نقل عابر للحدود يحتاج تبريراً + شفافية مع العيادة.

**ما يلزم قبل أول pilot في قطر:**

1. قرار المنظومة (State) — مؤكد لعيادات الأسنان.
2. سند نقل البيانات الخارجي إن وُجد التخزين خارج قطر (أو ترحيل إلى التخزين الإقليمي).
3. لغة موافقة منفصلة عن "موافقة العيادة العامة" — قاعدة مماثلة لـ KSA.
4. مراجعة CRA لقالب الرسائل عبر WhatsApp.
5. شهادة موافقة العيادة بصياغة قطرية.

**ما يلزم قبل التوسّع:**

- موظف حماية بيانات (عملياً المؤسس على pilot واحد).
- DPA قطري منفصل.
- تأكيد تصنيف وزارة الصحة العامة (MoPH) لبيانات الاتصال — هل تدخل في النطاق المنظَّم وزارياً؟
- التزام التواصل الرسمي بالعربية أو ثنائي اللغة.

**Realistic timeline + cost estimate (ESTIMATE, QAR):**

- جلسة محامٍ قطري مرخّص: **QAR 2,500-5,500** للجلسة.
- مراجعة عقد + DPA: **QAR 12,000-25,000**.
- زمن إلى أول pilot: **6-8 أسابيع** (يتأخر بسبب لغة الموافقة + قرار نقل البيانات).
- لا رسوم تسجيل دائم بعد، لكن قد تصدر متطلبات NCSA لاحقاً.

**التوصية:** **GO-WITH-CONDITIONS.** قطر تشريعياً أنضج من KSA في بعض النقاط (قانون 2016 سبق KSA)، لكن تطبيق NCSA أقل وضوحاً ويتطلّب يقظة. الشرط: حسم النقل العابر للحدود + لغة موافقة منفصلة.

— **للنقاش مع المحامي المرخّص في قطر.**

---

### 🇧🇭 Isa (عيسى) — Bahrain

> **تنبيه نظامي** — أنا عيسى، وكيل معرفي قانوني لمنصة عَودة في البحرين. لستُ محامياً مرخّصاً. المرجع الأساسي قانون 30/2018 وتنظمه هيئة حماية البيانات الشخصية (PDPA).

**PDPA registration requirements (قانون 30/2018):**

1. **تسجيل مدير البيانات لدى PDPA** قبل بدء المعالجة — متطلَّب صريح. هذا أوضح وأقدم اشتراط تسجيل في المنطقة.
2. سداد رسوم التسجيل (متغيرة بحسب نوع البيانات والحجم).
3. الإفصاح الكامل عن أنشطة المعالجة لدى PDPA.

**Data controller obligations (PDPL Bahrain):**

1. مبدأ تحديد الغرض + التناسب.
2. حقوق صاحب البيانات: الاطلاع، التصحيح، الحذف، الاعتراض، عدم القبول بالقرار الآلي.
3. التزام إخطار PDPA **مسبقاً** بأي نقل بيانات خارج البحرين إلى دولة لا تتمتع بمستوى حماية كافٍ — هذا متطلَّب فريد ومؤثّر.
4. حظر معالجة "البيانات الحساسة" (تشمل الصحية) إلا بأساس نظامي محدّد.
5. تعيين مسؤول حماية بيانات في حالات بعينها.
6. سجل أنشطة المعالجة.

**ما يلزم قبل أول pilot في البحرين:**

1. **تسجيل مسبق لدى PDPA** — هذا الفارق الكبير عن KSA: لا أوقّع pilot في البحرين قبل ايصال تسجيل في اليد (الأقل) أو رقم تسجيل (الأمثل).
2. **إخطار PDPA المسبق بنقل البيانات خارج البحرين** — إن كان التخزين في فرانكفورت/EU، يجب الإخطار + الانتظار.
3. تعيين مسؤول حماية بيانات معلَن.
4. صياغة العقد بمصطلحات **"مدير البيانات / معالج البيانات / صاحب البيانات"** (مدير وليس متحكّم — اختلاف عن KSA).
5. شهادة موافقة العيادة بصياغة بحرينية.
6. مراجعة TRA لقالب رسائل WhatsApp.

**ما يلزم قبل التوسّع:**

- اعتماد قنوات تواصل مع PDPA للإخطارات الدورية.
- مراجعة ضوابط الهيئة الوطنية لتنظيم المهن والخدمات الصحية (NHRA).
- DPA بحريني مستقل.

**Realistic timeline + cost estimate (ESTIMATE, BHD):**

- جلسة محامٍ بحريني مرخّص: **BHD 250-500** للجلسة.
- مراجعة عقد + DPA + إعداد تسجيل PDPA: **BHD 1,500-3,500**.
- رسوم تسجيل PDPA: **BHD 100-500** (بحسب الفئة).
- زمن إلى أول pilot: **6-10 أسابيع** (السبب: شرط التسجيل المسبق + إخطار نقل بيانات).
- كلفة سنوية مستمرة: **BHD 1,500-3,000** (تجديد + DPO/خارجي).

**التوصية:** **GO-WITH-CONDITIONS، مع تحفّظ زمني.** البحرين الأوضح تنظيمياً في القائمة (قانون شامل + تسجيل واضح)، لكن **التسجيل المسبق يطيل زمن الإطلاق**. الشرط: لا توقيع pilot قبل ايصال تسجيل + إخطار نقل بيانات (إن لزم).

— **للنقاش مع المحامي المرخّص في البحرين.**

---

### 🇴🇲 Saeed (سعيد) — Oman

> **تنبيه نظامي** — أنا سعيد، وكيل معرفي قانوني لمنصة عَودة في عُمان. لستُ محامياً مرخّصاً. المرجع المرسوم السلطاني 6/2022 + اللوائح التنفيذية 2024، تنظمه MTCIT.

**Identity lock — تنبيه إنفاذ صريح:** المرسوم السلطاني 6/2022 صدر في 2022، **لكنّ اللوائح التنفيذية صدرت في 2024 ودخل الإنفاذ الفعلي في فبراير 2025**. هذا يعني أنّ المعالجين الذين كانوا يعملون قبل الإنفاذ مُنحوا **فترة سماح (grace period)** للتوافق. أيّ معالج جديد يبدأ اليوم (مايو 2026) **لا يستفيد من فترة السماح** ويخضع للنظام الكامل من اليوم الأول. هذا حاسم لقرار الإطلاق.

**MTCIT notification requirements (PDPL Oman):**

1. **إشعار MTCIT بالمعالجة** عند البدء — متطلَّب اشتراطه يتوقف على نطاق المعالجة (بيانات حساسة = إشعار حتمي).
2. تعيين مسؤول حماية بيانات في حالات محدّدة.
3. إخطار حوادث الاختراق إلى MTCIT.
4. سجل أنشطة المعالجة.

**Cross-border transfer:**

- نقل خارج السلطنة يتطلّب **ترخيصاً** من MTCIT — هذا أصرم من جيرانه.
- ترتيب التخزين خارج عمان (مثل فرانكفورت) = ملف ترخيص.
- توطين البيانات داخل السلطنة هو المسار الأقل احتكاكاً تنظيمياً.

**ما يلزم قبل أول pilot في عُمان:**

1. **قرار توطين البيانات** — استضافة في عُمان أو ترخيص نقل خارجي (يأخذ أسابيع).
2. إشعار MTCIT بالمعالجة.
3. صياغة العقد بمصطلحات **"متحكّم/معالج/صاحب البيانات"**.
4. شهادة موافقة العيادة بصياغة عُمانية.
5. مراجعة TRA Oman لرسائل WhatsApp.
6. ادعاء صادق: **لا "موافقة MTCIT"** قبل صدور المستند.

**ما يلزم قبل التوسّع:**

- DPO معلَن.
- DPA عُماني.
- مراجعة ضوابط وزارة الصحة لبيانات الاتصال الصحية.
- حضور سنوي في تقارير MTCIT.

**Realistic timeline + cost estimate (ESTIMATE, OMR):**

- جلسة محامٍ عُماني مرخّص: **OMR 200-450** للجلسة.
- مراجعة عقد + DPA + إعداد إشعار MTCIT: **OMR 1,200-2,800**.
- إجراء ترخيص نقل بيانات خارجي (إن لزم): **OMR 300-800** + 4-8 أسابيع انتظار.
- زمن إلى أول pilot: **8-12 أسبوعاً** (السبب الأكبر: ترخيص النقل الخارجي إذا لم نوطّن).
- كلفة سنوية: **OMR 1,200-2,500**.

**التوصية:** **GO-WITH-CONDITIONS، مع أطول زمن إطلاق في القائمة.** سبب الزمن = ترخيص نقل البيانات الخارجي + الإنفاذ الكامل بدون فترة سماح للداخلين الجدد. الشرط الأقوى: حسم توطين البيانات قبل أي محادثة عيادة.

— **للنقاش مع المحامي المرخّص في عُمان.**

---

### 🇯🇴 Samer (سامر) — Jordan

> **تنبيه نظامي** — أنا سامر، وكيل معرفي قانوني لمنصة عَودة في الأردن. لستُ محامياً مرخّصاً. **ملاحظة نطاقية حادة: الأردن ليست عضواً في مجلس التعاون الخليجي**، ومنظومتها التشريعية ولهجتها مختلفتان عن دول الخليج. المرجع قانون 24/2023 + التعليمات التنفيذية 2024.

**كيفكم. خلّيني أوضح موقفنا.**

**Identity lock — Jordan ≠ GCC:** أي قياس مباشر "اشتغل في الخليج، ستشتغل في الأردن" قياس خاطئ. اللهجة الخليجية في الرسائل = **تنفير ثقافي** للمريض الأردني. القانون يختلف. العملة JOD، السوق مختلف الحجم والديناميكا.

**PDPC registration (قانون 24/2023):**

1. **التسجيل لدى مجلس حماية البيانات الشخصية (PDPC)** للمتحكّمين والمعالجين بحسب فئات.
2. تعيين مسؤول حماية بيانات.
3. سجل أنشطة المعالجة.
4. إخطار الحوادث.
5. حقوق صاحب البيانات (مماثلة لـ GDPR).
6. التعليمات التنفيذية صدرت 2024 — **لا يزال التطبيق العملي يتشكّل، أسئلة مفتوحة كثيرة، رأي المحامي المرخّص ضروري**.

**Cybercrime Law 17/2023 exposure (الرسائل):**

- قانون الجرائم الإلكترونية الجديد 17/2023 صارم في مسألتَين:
  1. الإفصاح غير المرخّص لبيانات شخصية → جنائي.
  2. "نشر معلومات تثير القلق العام" — صياغة فضفاضة قد تُستخدم ضد رسائل تجارية مكثّفة إن انفجرت شكاوى.
- **توصية:** التزام عبر استخدام WhatsApp Business بالضوابط الكاملة + إيقاف صريح + موافقة موثَّقة.

**ما يلزم قبل أول pilot في الأردن:**

1. تسجيل PDPC (وفق الفئة المحدّدة).
2. تعيين DPO معلَن.
3. صياغة العقد بالعربية الفصحى (نص العقد) + ملخّص عيادي **شامي/أردني** (وليس خليجي).
4. مراجعة TRC الأردنية لرسائل WhatsApp.
5. شهادة موافقة العيادة بصياغة أردنية.
6. **توطين الرسائل لهجياً** — وإلا فشل سوقي قبل قانوني.

**ما يلزم قبل التوسّع:**

- DPA أردني مستقل.
- متابعة التعليمات التنفيذية وتعديلاتها (حديثة).
- مراجعة وزارة الصحة الأردنية.
- التزام كامل بقانون الجرائم الإلكترونية.

**Realistic timeline + cost estimate (ESTIMATE, JOD):**

- جلسة محامٍ أردني مرخّص: **JOD 150-350** للجلسة.
- مراجعة عقد + DPA + تسجيل PDPC: **JOD 900-2,200**.
- زمن إلى أول pilot: **6-10 أسابيع**.
- كلفة سنوية: **JOD 900-1,800**.

**التوصية:** **GO-WITH-CONDITIONS، بشرط توطين لهجي كامل وفصل تشغيلي عن الخليج.** الأردن سوق أصغر، كلفة قانونية أقل، لكنّ **اللهجة + قانون 17/2023 + حداثة 24/2023** تخلق احتكاكاً تنفيذياً يستوجب فريقاً محلياً ولو خفيفاً.

— **للمناقشة مع المحامي المرخّص في الأردن.**

---

## 4. Router's cross-jurisdiction observations

> **Law-Firm Router:** "أنا الموجّه. لا أُفتي. لكنني سمعت سبعة وكلاء يتكلّمون، وثمة **تعارضات قانونية حقيقية** بين اختصاصاتهم لا يحلّها أيّ منهم بمفرده. أرفعها للمؤسس."

**تعارضات عابرة للحدود تستوجب قرار المؤسس قبل الإطلاق:**

1. **تعارض جوهري — اختصاص الفصل في النزاع.**
   - عقد KSA الحالي (§10) يحصر النزاع في "المحكمة التجارية بالرياض حصراً".
   - عقد بحريني يحتاج اختصاص محاكم البحرين أو BCDR.
   - عقد إماراتي يحتاج اختصاص محاكم الإمارات أو DIFC/ADGM (بحسب المنظومة).
   - **استحالة:** عقد واحد لجميع الدول. كل دولة = نسخة عقدية منفصلة باختصاص محلي حصري.
   - **تنبيه تصعيد:** المؤسس يحتاج **سبع نسخ عقد** بأرضيات قانونية مختلفة، لا نسخة قابلة للتدوير.

2. **تعارض جوهري — توطين البيانات + النقل العابر للحدود.**
   - عُمان: ترخيص MTCIT لنقل خارجي.
   - البحرين: إخطار PDPA المسبق بالنقل.
   - KSA: PDPL م. 29 يقيّد النقل.
   - قطر: ضمانات كافية + موافقة صريحة.
   - UAE Federal: قائمة دول معتمدة + SCC.
   - الأردن: قواعد PDPC.
   - الكويت: لا قانون شامل، يعالَج عقدياً.
   - **استحالة:** تخزين موحَّد في فرانكفورت أو رياض أو الرياض-EU يخلق **سبع مسارات امتثال مختلفة**. القرار الأبسط امتثالياً = توطين بيانات داخل كل دولة (و**هذا انفجار كلفة هندسية ضخم**).

3. **تعارض جوهري — لغة الرسائل والإيقاف.**
   - "اوقف / STOP" مقبول في الخليج.
   - الأردن: **لهجة شامية مختلفة**. كلمات الإيقاف نفسها قد تختلف لغوياً.
   - DIFC: لغة إنجليزية مباشرة كثيراً.
   - **مطلوب:** سبع مجموعات قوالب رسائل، خمس لهجات (سعودية/إماراتية/قطرية/بحرينية/عمانية/كويتية مع تقاطع كبير، أردنية مختلفة جوهرياً، DIFC إنجليزية).

4. **تعارض جوهري — التسجيل التنظيمي + DPO.**
   - البحرين: **تسجيل مسبق إلزامي لدى PDPA** قبل أيّ معالجة.
   - عُمان: إشعار MTCIT.
   - KSA: تسجيل سدايا (قيد الإجراء).
   - UAE Federal: تسجيل عند الاشتراط.
   - قطر: حسب فئة المعالجة.
   - الأردن: تسجيل PDPC.
   - الكويت: **لا هيئة تسجيل**.
   - **استحالة:** "تسجيل دولي موحَّد" غير قائم. كل دولة مسار مستقل.

5. **تعارض جوهري — العملة + الفوترة.**
   - SAR / AED / KWD / QAR / BHD / OMR / JOD — سبع عملات.
   - السقف "3,000 ر.س" في عقد KSA لا يترجم آلياً إلى 3,000 AED أو 250 BHD.
   - ضرائب القيمة المضافة مختلفة (15% KSA، 5% UAE، صفر BHD/Kuwait/Oman بحدود معينة، Qatar غير مطبقة بالكامل).
   - **مطلوب:** سياسة تسعير لكل دولة، مع توافق مع نظام الضرائب المحلي.

6. **تعارض جوهري — البلاغات التنظيمية المتعدّدة.**
   - حادثة اختراق واحدة قد تستوجب:
     - 72 ساعة بلاغ لسدايا (KSA)
     - بلاغ PDPA (Bahrain)
     - بلاغ NCSA (Qatar)
     - بلاغ MTCIT (Oman)
     - بلاغ UAE Data Office (UAE Federal) — أو DIFC Commissioner / ADGM
     - بلاغ PDPC (Jordan)
     - بلاغ CITRA (Kuwait — حسب الأثر)
   - **مطلوب:** **playbook موحَّد لإدارة حادثة سبعية الجهات** — لا يوجد لدى الفريق الحالي.

7. **علم تصعيد قاسٍ للمستشار المرخّص (لا اختيار):**
   - تنازع القانون عند عميل عابر للحدود (عيادة بحرينية لها فرع سعودي).
   - تنفيذ حكم أجنبي (محكمة الرياض ضد عيادة عُمانية).
   - تأمين E&O عابر للحدود — هل بوليصة سعودية تغطي حادثة في الإمارات؟ غالباً لا.
   - **هذه القرارات لا أُحيلها لوكيل واحد — تستوجب جلسة مشتركة بين مستشارين مرخّصين على الأقل في الدولتين المستهدفتين أوّلاً.**

> **خلاصة الموجّه:** سبعة وكلاء، سبع منظومات، **ولا يوجد امتثال موحَّد**. المؤسس يتعامل مع مكتب متعدّد الاختصاصات حقيقي، وليس "خليج موحَّد".

---

## 5. Board's debate on the law firm's input

### CEO (founder hat)

> "What is the one decision only I can make this week? It's not 'all seven'. After hearing the firm, that's optionality theater. Seven jurisdictions = seven contracts, seven registrations, seven cost stacks, seven dialect packs, seven incident-response paths — and I haven't signed pilot one in Riyadh yet. **I'm cutting the announcement.** The seven-country headline is the destination, not this quarter's bet. Pick the bet: KSA first, prove the unit. Defend the boundary. Communicate it cleanly: Phase 1 = KSA. Phase 2 = the next two. Phase 3+ = the rest, sequenced on cash-flow."

### CFO

> "Before anything else, let's see the math. Aggregated worst-case compliance pre-pilot cost across all seven countries — at ESTIMATE midpoints converted to SAR — is roughly **SAR 180,000-380,000 (≈USD 48,000-101,000) before a single pilot signs**, plus annual run-rate around **SAR 60,000-120,000/year**. Founder runway is ≤6 months pre-revenue. Burn multiple if we go seven-wide is **undefined because there's no denominator yet**. Numbers don't lie; founder optimism does. **My number:** do KSA fully (3,500-5,500 SAR all-in), reserve UAE Federal as Phase 2 (≈AED 20,000-40,000 ≈ SAR 20,500-41,000). Everything else is a strategic distraction this fiscal year. Total Phase 1+2 commit: ~SAR 25,000-50,000. Spreadsheet attached on request."

### CRO

> "What's your pipeline coverage for the quarter? Zero. We have zero LOIs. Addressable market across seven countries × dental clinics is interesting (rough order of magnitude: ~12,000-18,000 dental clinics across the seven countries with the BAPI-ready 2-4 chair profile), but **TAM ≠ revenue**. Win rate × ramp time × compliance overhead = the real funnel. If KSA conversion holds at the working assumption of 120 contacts → 1 sign, we need **840 contacts across seven countries to land seven pilots** with founder solo — that's a year of outbound while compliance burns. **My call:** prove KSA conversion math first. Anything else is forecasting on imaginary pipeline."

### General Counsel

> "Before we sign, three things need to be settled in writing. (1) We do NOT have outside counsel relationships in six of seven jurisdictions. The agents are knowledge agents — useful triage, not signature authority. (2) Cross-border DPA does not exist; we'd need seven country-specific DPAs and a master controller/processor framework, plus a privacy program that operates at GDPR-equivalent rigor to be defensible everywhere. (3) **Insurance: E&O policies typically have territorial limits.** A KSA-issued E&O at SAR 1-2M is not enforceable in Bahrain or DIFC without endorsements. **Bring this to outside counsel — I've surfaced the questions, not the answers.** My recommendation: KSA only this quarter. Phase 2 = UAE Federal **after** Saudi pilot closes. Disclaimer: Not legal advice."

### Chief of Staff

> "Decision logged. Sequencing recommendation: **Phase 1 (this quarter) = KSA Riyadh dental only.** Phase 2 (Q+1, conditional on signed Phase 1 pilot) = UAE Federal (Dubai/Abu Dhabi clinics, not DIFC/ADGM). Phase 3 (Q+2, conditional on Phase 1+2 cash positive) = Bahrain + Qatar (smallest TAM, clearest registration paths, fastest to recoup compliance burn). Phase 4 (Q+3+) = Kuwait + Oman. Phase 5 (or never) = Jordan — separate market, dialect lift, GTM-distinct. **Reason for sequencing:** maximize KSA prep transfer (>70% of pilot kit reusable for UAE Federal, ~40% for other Gulf, ~10% for Jordan), minimize cross-jurisdiction conflict load while founder is solo. Here's the next checkpoint: Day 7 of `docs/30-day-plan.md` — SDAIA filing + Meta BAPI + 10 cold contacts gate. **Aggregate verdict aligned with CEO/CFO/CRO/GC: PHASED.**"

---

## 6. Joint recommendation

- **Aggregate verdict:** **PHASED.** (Not GO-all-seven. Not BLOCK. Phase the seven countries, KSA-first, with explicit gates between phases.)

- **Recommended sequencing (rationale per phase):**

| Phase                          | Countries                           | Trigger to start                                                    | Why                                                                                                                  |
| ------------------------------ | ----------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Phase 1 (now → Q2 2026)        | KSA only                            | Already in-flight                                                   | Pilot kit ready; legal review surfaced; SDAIA filing in motion; founder dialect-native; cash burn affordable.        |
| Phase 2 (Q3 2026, conditional) | UAE Federal only (no DIFC, no ADGM) | KSA pilot SIGNED + 1 returned patient + 30-day case study published | Highest KSA→UAE prep transfer (~70%); high-value market; clearer regulatory layer than KSA on some items.            |
| Phase 3 (Q4 2026, conditional) | Bahrain + Qatar                     | Phase 1 cash positive + Phase 2 pilot live                          | Smallest TAM but clearest registration paths; Bahrain PDPA registration eats time but stabilizes compliance posture. |
| Phase 4 (2027, conditional)    | Kuwait + Oman                       | Phase 1-3 unit economics validated                                  | Kuwait: legal gap → contractual fortification needed. Oman: longest enforcement timeline + cross-border licensing.   |
| Phase 5 (2027+, optional)      | Jordan                              | Phase 1-4 + dedicated Levant ops                                    | Not GCC; dialect + cybercrime law + recent PDPL = needs local team, not solo founder.                                |

- **Total estimated compliance cost (rough range, multi-currency, ESTIMATE only):**
  - **All-seven pre-pilot one-time:** SAR 180,000-380,000 (~USD 48,000-101,000).
  - **All-seven annual run-rate:** SAR 60,000-120,000/year.
  - **Phase 1+2 only (recommended):** SAR 25,000-50,000 one-time + SAR 15,000-30,000/year.
  - **Conversion notes:** 1 AED ≈ 1.02 SAR, 1 KWD ≈ 12.2 SAR, 1 QAR ≈ 1.03 SAR, 1 BHD ≈ 9.9 SAR, 1 OMR ≈ 9.75 SAR, 1 JOD ≈ 5.3 SAR (approximate; verify on day-of with FX).

- **Total estimated time-to-first-pilot per country (ESTIMATE):**

| Country     | Weeks to first pilot                    |
| ----------- | --------------------------------------- |
| KSA         | 3-4 (already in-flight)                 |
| Kuwait      | 4-6                                     |
| Jordan      | 6-10                                    |
| UAE Federal | 6-10                                    |
| Qatar       | 6-8                                     |
| Bahrain     | 6-10 (PDPA pre-registration extends it) |
| Oman        | 8-12 (cross-border licensing)           |

- **Hardest 3 countries to launch in (with why):**
  1. **Oman** — Cross-border transfer license + full enforcement (no grace period for new entrants) + longest time-to-first-pilot. Data-residency decision is a structural cost.
  2. **Bahrain** — Mandatory pre-registration with PDPA + prior notification of cross-border transfer. Compliance posture is clean, but the upfront timing burden is real.
  3. **Jordan** — Non-GCC market + Levantine dialect requirement + brand-new Cybercrime Law 17/2023 with broad-language exposure + 2024 implementing regs still settling. Needs local feet, not remote ops.

- **Easiest 3 countries to launch in (with why):**
  1. **KSA** — Already in-flight, pilot kit shipped, legal review done by Masoud, founder native dialect, SDAIA filing in motion.
  2. **Kuwait** — Legislative gap means no formal registration body; compliance is delivered contractually, not bureaucratically. CITRA scope is narrow. (Caveat: contractual rigor must be excellent to compensate.)
  3. **UAE Federal route (not DIFC/ADGM)** — High prep transfer from KSA, clear federal layer (Decree 45/2021), active BSPs already covering the market.

- **Quick wins (where existing KSA prep transfers >70%):**
  - **UAE Federal:** Pilot agreement structure, opt-out handler tech, privacy page skeleton, message templates with dialect swap, controller/processor framing.
  - **Kuwait (partial):** Controller/processor framework + opt-out + retention spec all transfer; legislative gap means contract is the moat.
  - **Qatar (partial):** PDPPL terminology overlaps with PDPL/UAE; consent + retention specs transfer with adjustment.
  - **No quick win:** Jordan (dialect + non-GCC), DIFC (separate jurisdictional model), Oman (cross-border license is a structural blocker not solvable by template reuse).

---

## 7. Decisions for the founder

1. **Single yes/no:** Do you accept PHASED launch (KSA first, Phase 2-5 gated on KSA proof) instead of seven-country simultaneous launch this quarter? **(If NO → STOP. Re-run the meeting after seeing the cash math.)**
2. **Data residency:** Will Aooda host data inside KSA, inside EU (Frankfurt/Neon EU), or migrate to in-country hosting per launch phase? This decision blocks the Annex A TODOs in `docs/pilot-agreement.md` and determines Oman cross-border licensing posture later.
3. **Licensed counsel budget:** Will you commit to engaging a licensed advocate in each country **before** opening that phase (not after)? Phase 1: KSA counsel (≤2,000 SAR). Phase 2: UAE counsel (AED 12,000-25,000). Otherwise the seven knowledge agents become legal exposure, not legal triage.
4. **Insurance posture:** Will you secure E&O coverage with country-specific endorsements before Phase 2 begins, accept the personal-liability risk, or restructure entity (e.g., FZE / freezone vehicle) for liability segregation? (This is the question CFO and GC both flagged independently.)
5. **Brand/announcement correction:** Will you publicly retract or qualify the "all seven countries" announcement to "KSA first, regional rollout sequenced," to avoid creating market expectations (clinic owner skepticism, future audit ammunition) you cannot meet this quarter?

---

## 8. Action items per agent (board-routed)

| #   | Agent                      | Action                                                                                                                  | Deadline                |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 1   | masoud-saudi-legal         | Finalize §5 / §6 questions for licensed-counsel session; produce session-prep one-pager.                                | Day 7 (2026-06-05)      |
| 2   | masoud-saudi-legal         | Confirm Annex A TODO resolutions once founder commits storage region + cross-border decision.                           | Day 9 (2026-06-07)      |
| 3   | khaled-uae-legal           | Produce single-page brief: Federal vs DIFC vs ADGM decision tree for dental SaaS, for Phase 2 prep.                     | 2026-07-15              |
| 4   | jassim-qatar-legal         | Draft Qatar-specific consent + sub-processor language template, dormant until Phase 3.                                  | 2026-09-30              |
| 5   | isa-bahrain-legal          | Document PDPA registration application checklist + fee schedule, dormant until Phase 3.                                 | 2026-09-30              |
| 6   | saeed-oman-legal           | Document MTCIT cross-border transfer license process + grace-period analysis for new entrants, dormant until Phase 4.   | 2027-Q1                 |
| 7   | fahad-kuwait-legal         | Draft contract-as-substitute-for-statute language pack (since Kuwait has no comprehensive PDPL), dormant until Phase 4. | 2027-Q1                 |
| 8   | samer-jordan-legal         | Document Jordan PDPC registration + Levantine dialect message templates, dormant until Phase 5.                         | 2027-Q2                 |
| 9   | law-firm-router            | Maintain cross-jurisdiction conflict log; trigger re-meeting when founder advances to a new phase.                      | Ongoing                 |
| 10  | cs-cfo-advisor             | Build Phase 1+2 cash model with explicit gate-conditions tied to signed pilot + returned patient.                       | Day 14 (2026-06-12)     |
| 11  | cs-cro-advisor             | Map TAM by phase with realistic conversion assumptions; flag distractions from KSA pipeline.                            | Day 14 (2026-06-12)     |
| 12  | cs-general-counsel-advisor | Source 2 licensed-advocate referrals per Phase 2-5 country for future engagement (relationship-warm, not retained).     | 2026-06-30              |
| 13  | cs-ceo-advisor             | Public/internal communication correcting "all seven" → "KSA first, phased" narrative.                                   | Day 3 (2026-06-01)      |
| 14  | cs-chief-of-staff          | Log this decision; schedule revisit at Day 30 (`docs/30-day-plan.md` Gate 4); surface stale-decision audit at 90 days.  | 2026-06-29 + 2026-08-28 |

---

## 9. Closing tags (mandatory per country agent)

- **مسعود:** "للنقاش مع المستشار المرخّص"
- **خالد:** "للنقاش مع المستشار القانوني المرخّص في الإمارات"
- **فهد:** "للنقاش مع المحامي المرخّص في الكويت"
- **جاسم:** "للنقاش مع المحامي المرخّص في قطر"
- **عيسى:** "للنقاش مع المحامي المرخّص في البحرين"
- **سعيد:** "للنقاش مع المحامي المرخّص في عُمان"
- **سامر:** "للمناقشة مع المحامي المرخّص في الأردن"

---

> **Chief of Staff closing:** Decision logged. Next checkpoint: Day 7 (2026-06-05) — SDAIA filing receipt + Meta BAPI submitted + 10 cold contacts logged, per `docs/30-day-plan.md §3 Week 1 gate`. **The seven-country headline is the destination, not this quarter's bet.** If KSA Phase 1 closes by 2026-06-29 with a signed pilot + verified returned patient, this meeting reconvenes on 2026-07-05 to authorize Phase 2 (UAE Federal). Otherwise, this meeting reconvenes to revise the strategy itself, not just the sequencing.
