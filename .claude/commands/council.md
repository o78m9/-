# Council — Multi-Agent Advisory Board

Convene a council of specialized advisors to analyze the user's question from multiple perspectives, then deliver a unified recommendation.

## How to use

```
/council <your question or decision>
```

Examples:

- `/council هل نضيف feature جديدة قبل deploy؟`
- `/council ما الأولوية الأن — marketing أو engineering؟`
- `/council كيف نزيد revenue بأسرع وقت؟`

---

## Instructions for Claude

When invoked, follow these steps exactly:

### Step 1 — Classify the question

Read the user's question and determine which council members are most relevant:

| Domain          | Agent File                                                     | Invoke when                                         |
| --------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| Strategy/Vision | `claude-skills/agents/c-level/cs-ceo-advisor.md`               | Any strategic or big-picture decision               |
| Technology      | `claude-skills/agents/c-level/cs-cto-advisor.md`               | Tech decisions, architecture, engineering tradeoffs |
| Product         | `claude-skills/agents/product/cs-product-manager.md`           | Feature prioritization, user needs, roadmap         |
| Finance         | `claude-skills/agents/finance/cs-financial-analyst.md`         | Cost, revenue, ROI, budget decisions                |
| Growth          | `claude-skills/agents/business-growth/cs-growth-strategist.md` | Acquisition, retention, revenue growth              |
| Engineering     | `claude-skills/agents/engineering/cs-senior-engineer.md`       | Code quality, architecture, technical debt          |

For most questions, invoke **3-5 relevant agents**. For simple questions, 2-3 is enough. Never invoke all 6 unless the question truly spans all domains.

### Step 2 — Spawn agents in parallel

Use the Agent tool to spawn all selected agents simultaneously (in a single message with multiple Agent tool calls). Each agent must:

1. Read its agent file to load its persona and expertise
2. Read the relevant skill references if needed
3. Answer the user's question strictly from its domain perspective
4. Keep its response focused: **verdict + 2-3 key points + 1 risk**

Agent prompt template:

```
You are [AGENT NAME] for the Aooda project (Arabic RTL medical SaaS for clinic patient reactivation).

Read your persona file at: C:\projects\ai-customer-base\claude-skills\agents\[PATH]

The council is deliberating this question:
"[USER QUESTION]"

Project context:
- Stack: Next.js 15, TypeScript, Tailwind v4, Supabase, Neon PostgreSQL
- Status: 13/14 phases complete, Phase 14 (Deploy) remaining
- Goal: World-class quality — Apple/Linear/Stripe/Vercel level

Respond ONLY from your domain expertise. Structure:
**Verdict:** [clear yes/no/recommendation in one sentence]
**Key Points:**
- [point 1]
- [point 2]
- [point 3 if needed]
**Risk:** [one main risk to flag]
```

### Step 3 — Synthesize

After all agents respond, produce a **Council Decision** section:

```
## Council Decision

**Consensus:** [Where agents agree]
**Tension:** [Where agents disagree — name the tradeoff]
**Recommendation:** [Final actionable recommendation — what to do next]
**First Step:** [Single concrete next action]
```

Keep the synthesis tight — max 150 words. The user needs a decision, not a summary.

---

## Output format

```
# Council in Session 🏛️

**Question:** [user's question]
**Advisors:** [list of agents invoked]

---

## [Agent Name] — [Domain]
[Agent response]

---

## [Agent Name] — [Domain]
[Agent response]

---
[...more agents...]
---

## Council Decision
[synthesis]
```
