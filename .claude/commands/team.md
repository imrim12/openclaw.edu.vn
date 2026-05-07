---
description: Spawn a multi-agent team (product, marketing, devs, qa-lead, qas, security, principle) to deliver a feature or set of screens in parallel. Pass the work description as the argument.
---

You are about to spawn a team to deliver the work described after `/team`.

# Roles available

Each lives in `.claude/agents/`:

- **product** — Product Manager. Drives the live (or staging) product via Chrome DevTools MCP as the target persona, asks whether each feature actually advances the project goal (task-completion lens), dispatches value gaps to `qa-lead` and risk concerns to `security`. Does not write code, does not author or verify test cases, does not assess security itself.
- **marketing** — Marketing Specialist. Walks the same product as `product`, but reads it through a brand / positioning / acquisition / trust-signal lens grounded in `requirement.md` §3, §5, §17, §19 (decision-and-trust lens). Dispatches messaging gaps to `qa-lead` and brand-risk concerns to `security`. Same hard rules as `product` — no code, no test cases, no security assessment.
- **developer** — Nuxt/Vue/UnoCSS/Vitest implementer. Strict TS.
- **qa-lead** — authors test-case CSVs in `.claude/workspace/test-cases/`. Absorbs `product` + `marketing` dispatches and `security` pre-assessment verdicts before locking the plan.
- **qa** — drives Chrome DevTools MCP to execute test-case CSVs.
- **security** — OWASP / Nuxt security review. **Two phases** in this workflow: (1) pre-implementation risk assessment of `product`'s and `marketing`'s dispatched concerns; (2) post-implementation code review.
- **principle** — conventions, DRY/SOLID, strict TS, framework-first review.

# Team composition

- **1× product** — first wave. Walks the spec and (if anything is running) the live or staging product as the target persona — task-completion lens. Dispatches value concerns to `qa-lead` and risk concerns to `security`. Owns `.claude/workspace/product/`.
- **1× marketing** — first wave (parallel with `product`). Walks the same surface using the same persona, but reads it as a brand / positioning / trust-signal review. Dispatches messaging concerns to `qa-lead` and brand-risk concerns to `security`. Owns `.claude/workspace/marketing/`.
- **1× security** — pre-implementation risk note (combines `product` + `marketing` dispatches) goes to `qa-lead` so the test plan absorbs the verdict. Post-implementation code review runs after dev completes (same agent, separate task).
- **1× qa-lead** — writes test cases informed by `product`, `marketing`, and `security`'s pre-assessment. Blocks dev start until plans exist for the screens being built.
- **1× principle** — conventions, framework-fit, TS strictness review after dev completes.
- **N× developer** — one per screen / feature area, parallelized. Each owns its own slice and does not edit another dev's slice.
- **N× qa** — one per major flow being tested in parallel. Each consumes a CSV from `qa-lead` and runs it via Chrome DevTools MCP.

## Sizing N

Choose N based on the number of independent screens / features in the request:

| Scope | devs | qas |
|---|---|---|
| 1–2 screens | 1 | 1 |
| 3–4 screens | 2 | 2 |
| 5+ screens | 3–4 | 3–4 |

Cap at 4 of each role unless the request is unusually large. If scope is unclear, ask before spawning.

# Workflow

The product **and** marketing agents go first, in parallel, so both lenses (task completion + decision/trust) gate the test plan and the risk assessment — *before* dev work locks in.

1. **Plan tasks** — break the work into screen- / feature-sized tasks with `TaskCreate`. Each task names the owning role (set via `TaskUpdate` `owner`).
2. **Create the team** — `TeamCreate` with a descriptive `team_name` (e.g. `feature-checkout-2026-05-06`).
3. **Spawn `product` and `marketing` together.** Assign one task per screen in scope to each agent: walk the live (or staging, or spec-only) surface as the **same** persona. Each agent files two dispatches per screen — a `qa-lead` task and a `security` pre-assessment task — plus a verdict report. The persona name and the entry URL must match between `product` and `marketing` so the two reviews are parallax on the same walk; tell each agent the other is running and instruct them to check `.claude/workspace/{product,marketing}/` for each other's reports. Block `qa-lead` and `security` (pre-assessment) tasks on **both** the `product` and `marketing` tasks via `addBlockedBy`.
4. **Spawn `security` (pre-assessment) and `qa-lead` once `product` and `marketing` dispatches land.**
   - `security` writes a risk-assessment note covering concerns from **both** `product` and `marketing` (technical exploit risks + brand risks). Post the verdict (severity, mitigation hooks) to `qa-lead` via `SendMessage`. File the result at `.claude/workspace/reviews/<feature>-pre-impl.md`.
   - `qa-lead` writes / revises the test-case CSV, **incorporating** value gaps (from `product`), messaging / trust gaps (from `marketing`), and security's risk verdict. The test plan should have explicit rows for any P0/P1 concern from any of the three sources, and the row's `notes` column should cite which dispatch it answers (e.g. `product P0 #12`, `marketing P1 #4`).
   - Block `qa-lead`'s task on `security`'s pre-assessment so the plan absorbs the verdict before locking. For trivial features `qa-lead` may proceed with a draft and revise after security's note — record the choice in the task.
   - **When `product` and `marketing` reach the same dispatch independently, escalate the severity by one tier** — two lenses agreeing is a strong signal. Both agents flag this in their reports; `qa-lead` reflects the escalation in the CSV.
5. **Spawn devs in parallel** — once `qa-lead` produces a CSV for a screen, the corresponding dev task is unblocked and the dev claims it.
6. **Spawn qas in parallel** — each `qa` picks up a completed dev slice with its matching CSV.
7. **Spawn `security` (post-implementation review) and `principle`** — review each dev slice as it lands. Findings become new tasks back to the relevant developer (Critical / Blocker = P0). Track this as a separate task from the pre-assessment one.
8. **Iterate** — devs address review findings; qas re-run failed cases until green. If `product` or `marketing` flags a regression late (e.g. live behaviour or copy drifts during dev), they file fresh dispatches and the cycle re-enters at step 4 for the affected screen.
9. **Wrap up** — when all tasks are complete and all reviews are clean, send `shutdown_request` to all teammates, then `TeamDelete`.

# Spawning agents

Use the `Agent` tool with `team_name`, `name`, and `subagent_type` set to the role name. Send all parallel spawns in **one message** with multiple `Agent` calls — that's what runs them concurrently.

Example for the product walk:

```json
{
  "subagent_type": "product",
  "team_name": "<your-team-name>",
  "name": "pm-checkout",
  "description": "Walk checkout as target persona, task-completion lens",
  "prompt": "Read requirement.md §1, §6.1, §10 (project goal + personas + use cases) and the task assigned to you. Walk the live (or staging) checkout surface as persona <NAME> (mirror with marketing). Task-completion lens: can the persona accomplish the goal? File two dispatches per screen — a TaskCreate to qa-lead with value gaps and a TaskCreate to security with risk concerns. Save your report to .claude/workspace/product/<feature>-<id>.report.md. When done, mark your task completed and send marketing + qa-lead + security each a one-paragraph summary."
}
```

Example for the marketing walk (parallel with product):

```json
{
  "subagent_type": "marketing",
  "team_name": "<your-team-name>",
  "name": "mkt-checkout",
  "description": "Walk checkout as target persona, decision/trust lens",
  "prompt": "Read requirement.md §1, §3, §5, §17, §19 (brand promise + tone + competitive positioning + visual identity) and the task assigned to you. Walk the same surface as pm-checkout, using the same persona <NAME>. Decision/trust lens: would the persona engage and trust the result? Run the eight M1–M8 questions in agents/marketing.md. File two dispatches per screen — a TaskCreate to qa-lead with messaging gaps and a TaskCreate to security with brand-risk concerns. Save your report to .claude/workspace/marketing/<feature>-<id>.report.md. When done, mark your task completed and post a one-paragraph summary; flag any concern that converges with pm-checkout's report (escalate severity by one tier)."
}
```

Example for security pre-assessment (note the explicit phase distinction):

```json
{
  "subagent_type": "security",
  "team_name": "<your-team-name>",
  "name": "sec-pre-checkout",
  "description": "Pre-implementation risk assessment from product dispatch",
  "prompt": "Phase: PRE-IMPLEMENTATION risk assessment (not the post-impl code review). Read .claude/workspace/product/<feature>-<id>.security.md AND .claude/workspace/marketing/<feature>-<id>.security.md (if both exist) — you cover both technical exploit risks AND brand risks. For each concern, write a verdict — vulnerability or brand-risk class, exploitability in this codebase, recommended mitigation, severity. Save the report to .claude/workspace/reviews/<feature>-pre-impl.md. Send the severity summary to qa-lead via SendMessage so they can absorb it into the test plan. When done, mark the task completed."
}
```

Example for one developer (unchanged from the prior workflow):

```json
{
  "subagent_type": "developer",
  "team_name": "<your-team-name>",
  "name": "dev-checkout",
  "description": "Implement checkout screen",
  "prompt": "Pick up the next task assigned to you in the team task list. Read the matching test-case CSV under .claude/workspace/test-cases/ and any product/security concerns at .claude/workspace/product/ and .claude/workspace/reviews/<feature>-pre-impl.md before implementing. When the slice is done, mark the task completed and stand by for review feedback."
}
```

# Coordination rules

- **`product` and `marketing` do NOT modify product code, write test cases, or assess security themselves.** They ask their lens-specific questions and dispatch. `product` covers task-completion; `marketing` covers decision-and-trust. They explicitly do **not** overlap — re-read the lens table in `agents/marketing.md` before assigning work.
- **`product` and `marketing` use the SAME persona on the SAME walk.** Pick the persona once when assigning the tasks, name it in both prompts, and instruct each to read the other's report from `.claude/workspace/{product,marketing}/`. When their dispatches converge on a concern independently, both flag the convergence in their reports and `qa-lead` escalates the test-plan row by one severity tier.
- **`security` has two distinct deliverables in this workflow** — pre-implementation risk note (combining `product` + `marketing` dispatches) and post-implementation code review. Track them as separate tasks. Pre-impl notes live under `.claude/workspace/reviews/<feature>-pre-impl.md`; post-impl notes under `.claude/workspace/reviews/<feature>-security.md`.
- **`qa-lead`'s test plan must visibly reflect product + marketing + security pre-assessment.** A locked plan that ignores any of the three sources is a process failure — qa-lead annotates which CSV rows answer which dispatch (in the `notes` column or a header block).
- Devs do not edit each other's screens. If cross-cutting work is needed (shared composable, shared store), one dev owns the shared module and others depend on it via task ordering (`addBlockedBy`).
- QAs do not modify product code. Bugs go back to the assigned dev as new tasks via `TaskCreate`.
- Security and principle findings at "Critical" / "Blocker" severity are P0 tasks that block merge.
- Status updates happen via `TaskUpdate`, not chat. Use `SendMessage` only when one teammate needs a clarification from another or the team lead — or for the explicit hand-off security → qa-lead in step 4, and the convergence flag product ↔ marketing in step 3.
- Refer to teammates by name, never UUID.
- Idle teammates are normal between turns — don't comment on idleness unless it's actually blocking work.

# Before spawning

Read the user's argument carefully:

- What feature(s) or screen(s)?
- **What's the project goal each feature must serve?** Quote it from the spec into `product`'s prompt — that's the ruler `product` will measure against.
- **What's the brand promise each surface must reinforce?** Quote it from `requirement.md` §3 / §5 into `marketing`'s prompt — that's the ruler `marketing` will measure against.
- **Which persona drives this walk?** Pick one of the four canonical SME personas (see `agents/product.md` §2) and pin it in both `product` and `marketing` prompts.
- Any specific acceptance criteria?
- Any starting risks the user has flagged in the request — pass them into both `product` and `marketing` prompts as seed concerns (each through their own lens).
- Any constraints (deadline, must-not-touch areas, design references)?

If anything material is ambiguous, use `AskUserQuestion` before spawning. Once the team is running, do not interrupt the user mid-flight unless a teammate hits a blocker that requires a human decision.

Begin by acknowledging the request in one sentence, then plan tasks, then spawn.
