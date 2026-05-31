# Aooda Demo Script — 15 Minutes

> Use after the prospect says "yes, show me." Designed for screen-share via Zoom or in-person tablet. Pure Arabic, Jordanian dialect.
>
> Goal: get them to ask "كم بدها تكلفني تجربتها؟" — that's the buying signal. If they don't ask, the demo failed. The demo is NOT for showing features — it's for showing them the pain of NOT having Aooda.

## Pre-demo prep (5 min before)

- [ ] Open the demo dashboard at `https://awdah-ochre.vercel.app/dashboard/demo` (logged in)
- [ ] Have ROI calculator open in second tab
- [ ] Have the pilot agreement PDF ready
- [ ] Have Calendly link ready for "next steps" booking
- [ ] Mute notifications, close Slack/Telegram

## 1. Opener (1 min)

> "شكراً إنك أعطيتني 15 دقيقة. أنا رح أخفف عليك ما رح أعرض كل شي — رح أوريك 3 إشيا وبس، وكل وقت بدك تقاطعني، تفضل."
>
> "أنا قبل ما أشتغل على عودة، تكلمت مع أكثر من 20 صاحب عيادة بالأردن، وكل واحد فيهم قال نفس الـشي: 'فيه مرضى عندي ضايعين، أنا أعرف عنهم، بس ما عندي وقت أتواصل معهم.' هاد بالضبط شو عودة بيحل."

## 2. The pain (3 min) — show, don't tell

Open the demo dashboard. Point at the "Dormant patients" segment.

> "هاي بياناتنا الوهمية لعيادة مع 1,400 مريض. شوف ربع المرضى تقريباً — 350 مريض — ما زاروا من 6 شهور أو أكثر. هاي مش غريب، هاي النسبة الطبيعية بكل عيادة بالأردن."

Click on a patient row. Show last visit date + total spent.

> "أبو وليد هذا، آخر زيارة قبل 7 شهور، صرف 240 دينار بآخر سنتين. لو رجع زيارة وحدة، عيادتك تكسب 80-120 دينار. مضروبة بـ350 مريض، الخسارة المحتملة شهرياً ضخمة."

Use ROI calculator:

```
350 dormant × 20% reactivation × 100 JOD avg visit = 7,000 JOD/شهر محتملة
```

> "هاي خسارة بصمت. والـسبب الوحيد إنها صامتة هو إنك ما عندك نظام يطلعلك الأرقام، وما عندك طريقة عملية تتواصل مع 350 مريض."

## 3. The solution (4 min) — show, very briefly

Switch to the "Send campaign" view.

> "لو ضغطت زر واحد، عودة بيسوي 3 إشيا:
>
> 1. يختار من المرضى النائمين الأكثر قيمة (مثلاً اللي صرفوا أكثر من 100 دينار)
> 2. يرسلهم رسالة واتساب رسمية باسم كل مريض، تذكير لطيف، مش spam
> 3. يتابع كم منهم رجعوا فعلاً بالـ14 يوم اللي بعد"

Show a sample WhatsApp preview using `recall_dormant_v1`:

```
مرحباً أبو وليد،
مرّت سبعة أشهر منذ آخر زيارتك لعيادة الياسمين. نتمنى تكون بخير.
لو تحب تحجز موعد متابعة، نحن هنا.
للرد بـ "إيقاف" لعدم استقبال رسائل لاحقاً.
```

> "كل رسالة قالب معتمد رسمياً من Meta — ما في spam ولا حظر للحساب. بياناتك عليها audit log كامل + توافق مع نظام حماية البيانات الأردني."

Switch to monthly statement preview.

> "نهاية كل شهر، بتستلم تقرير: كم رسالة رسلنا، كم مريض رجع، كم إيراد استرجعت — قبل ما تدفع شي. ولو في أي زيارة بتشك إنها مش بسبب رسالتنا، تنقر زر 'استبعاد' وبتطلع من الفاتورة على طول. بدون نقاش."

## 4. The offer (3 min) — be specific, be brief

> "Pilot عودة الآن:
> • مجاناً 60 يوم، كامل المنتج
> • بنحط بياناتك بـ24 ساعة
> • أول حملة بنرسلها مع موظفتك خلال أسبوع
> • بعد 60 يوم، أنت تختار من 3:
>
> 1. حر — 0 دينار، بس عودة يوقف
> 2. ثابت — 50 دينار شهرياً، بدون نسبة، predictable
> 3. مشترك — 25 دينار + 15% بس من المرضى اللي رجعوا فعلاً (مع زر استبعاد لأي زيارة بتشكها)
>
> اختيارك بيكون بعد ما تشوف الأرقام، مش قبل."

## 5. The ask (2 min) — qualify before close

Ask these 3 in order. Don't push to close if they fail any.

1. **"كم مريض عندك بقاعدة البيانات تقريباً؟"** — need ≥200 for Aooda to make sense
2. **"البيانات بـExcel، بـSheet، بـبرنامج، ولا بـكشكول؟"** — need digital format
3. **"مين هو القرار النهائي بأي شغلة جديدة بتدخل العيادة — أنت لحالك ولا فيه شريك؟"** — need decision-maker yes/no

If yes-yes-yes:

> "ممتاز. عشان نبدأ، رح أرسلك:
>
> 1. اتفاقية الـpilot — صفحتين، أنت تقراها وتوقعها رقمياً
> 2. نموذج Excel فاضي — تعبيه بمرضاك أو ترسلنا بياناتك الحالية وأنا أحوّلها
> 3. لينك لحجز جلسة الإطلاق — 30 دقيقة لإكمال الـsetup
>
> كل هاد بـ48 ساعة. هل نمشي؟"

If they hesitate:

> "تمام. شو اللي يخليك مش متأكد؟"

Listen. Don't argue. Take notes. Send follow-up in 2 days with the specific concern addressed.

## 6. Close (2 min)

If they signed verbally:

- Send the 3 items within 1 hour
- Set Calendly invite for kickoff
- Add to tracker as `pilot_signed_at = today`

If they said "let me think":

- Set follow-up for +3 days
- Note what they need to think about
- Don't lower the price to close — never discount the pilot

If they said no:

- Ask: "شو اللي كان يخليك تقول نعم؟"
- Their answer is the most valuable thing from the call
- Log it in `docs/voc/quote-bank.md`

## Common questions during demo (have answer ready)

1. "كم عيادة عندكم الآن؟" → Honest. "أنت ضمن الـ5 الأولى — مش عندي شي أخفيه. هاي pilot لإثبات الفكرة قبل التوسع."
2. "مين بيكتب الرسائل؟" → "القوالب كلها موافق عليها مسبقاً من Meta. النظام بس بيختار القالب وبيعبي اسم المريض وتاريخ آخر زيارة. زي ما تختار شي من قائمة بـExcel."
3. "بياناتي تطلع من العيادة؟" → "البيانات على Neon بفرانكفورت، مشفّرة، عقد DPA توقعه أنت. ما حد يفتحها — حتى نحن. كلش معاملة على البيانات بتتسجل بـaudit log قابل للتدقيق."
4. "لو المريض شكى؟" → "كل رسالة فيها كلمة 'إيقاف' للرد. لو رد بها، النظام يوقف الإرسال له على طول وما نقدر نعاود."
5. "كم بتاخذوا؟" → الرد بالخطة المالية أعلاه + التأكيد إن لو ما رجع أحد، ما يدفع شي.

## Post-demo (within 1 hour)

- Send follow-up WhatsApp summarizing the offer + next steps
- Log demo in tracker (`last_status = demo_done`, `next_action = decision_call`)
- If interest signaled: send 3-item package
- If no decision yet: schedule +3 day follow-up call
- Update CRM with key quotes for future reference

## Demo recording

Record EVERY demo (with consent) for review. Watch the failed ones the next day — patterns of disengagement reveal where the pitch breaks.

## Anti-patterns during demo

- Don't say "AI", "machine learning", "Claude", "GPT", "neural", "automated robot"
- Don't show the 3D hero scene — Jordanian conservative buyers find it gimmicky
- Don't talk about tech stack (Next.js, Supabase, Neon)
- Don't explain how the system works internally — black box is fine
- Don't apologize for any feature being basic — early product simplicity is a feature
- Don't compare to Dentle/Yolo by name — let them ask first
- Don't promise specific numbers ("you'll recover 50 patients") — promise the process, not the outcome
