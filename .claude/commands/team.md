---
description: Spawn a multi-agent team (devs, qa-lead, qas, security, principle) to deliver a feature or set of screens in parallel. Pass the work description as the argument.
---

You are about to spawn a team to deliver the work described after `/team`.

# Roles available

Each lives in `.claude/agents/`:

- **developer** — Nuxt/Vue/UnoCSS/Vitest implementer. Strict TS.
- **qa-lead** — authors test-case CSVs in `.claude/workspace/test-cases/`.
- **qa** — drives Chrome DevTools MCP to execute test-case CSVs.
- **security** — OWASP / Nuxt security review.
- **principle** — conventions, DRY/SOLID, strict TS, framework-first review.

# Team composition

- **1× qa-lead** — writes test cases first; blocks dev start until plans exist for the screens being built. Owns `.claude/workspace/test-cases/`.
- **N× developer** — one per screen / feature area, parallelized. Each owns its own slice and does not edit another dev's slice.
- **N× qa** — one per major flow being tested in parallel. Each consumes a CSV from qa-lead and runs it via Chrome DevTools MCP.
- **1× security** — reviews each implementation slice after dev completes.
- **1× principle** — reviews each implementation slice after dev completes.

## Sizing N

Choose N based on the number of independent screens / features in the request:

| Scope | devs | qas |
|---|---|---|
| 1–2 screens | 1 | 1 |
| 3–4 screens | 2 | 2 |
| 5+ screens | 3–4 | 3–4 |

Cap at 4 of each role unless the request is unusually large. If scope is unclear, ask before spawning.

# Workflow

1. **Plan tasks** — break the work into screen- / feature-sized tasks with `TaskCreate`. Each task names the owning role (set via `TaskUpdate` `owner`).
2. **Create the team** — `TeamCreate` with a descriptive `team_name` (e.g. `feature-checkout-2026-05-06`).
3. **Spawn qa-lead first** — assign tasks to author test cases for every screen in scope. Block dev tasks on the relevant qa-lead task via `addBlockedBy`.
4. **Spawn devs in parallel** — once qa-lead produces a CSV for a screen, the corresponding dev task is unblocked and the dev claims it.
5. **Spawn qas in parallel** — each qa picks up a completed dev slice with its matching CSV.
6. **Spawn security and principle** — review each dev slice as it lands. Findings become new tasks back to the relevant dev (Critical / Blocker = P0).
7. **Iterate** — devs address review findings; qas re-run failed cases until green.
8. **Wrap up** — when all tasks are complete and all reviews are clean, send `shutdown_request` to all teammates, then `TeamDelete`.

# Spawning agents

Use the `Agent` tool with `team_name`, `name`, and `subagent_type` set to the role name. Example for one developer:

```json
{
  "subagent_type": "developer",
  "team_name": "<your-team-name>",
  "name": "dev-checkout",
  "description": "Implement checkout screen",
  "prompt": "Pick up the next task assigned to you in the team task list. Read the matching test-case CSV under .claude/workspace/test-cases/ before implementing. When the slice is done, mark the task completed and stand by for review feedback."
}
```

Send all parallel spawns in **one message** with multiple `Agent` calls — that's what runs them concurrently.

# Coordination rules

- Devs do not edit each other's screens. If cross-cutting work is needed (shared composable, shared store), one dev owns the shared module and others depend on it via task ordering (`addBlockedBy`).
- QAs do not modify product code. Bugs go back to the assigned dev as new tasks via `TaskCreate`.
- Security and principle findings at "Critical" / "Blocker" severity are P0 tasks that block merge.
- Status updates happen via `TaskUpdate`, not chat. Use `SendMessage` only when one teammate needs a clarification from another or the team lead.
- Refer to teammates by name, never UUID.
- Idle teammates are normal between turns — don't comment on idleness unless it's actually blocking work.

# Before spawning

Read the user's argument carefully:

- What feature(s) or screen(s)?
- Any specific acceptance criteria?
- Any constraints (deadline, must-not-touch areas, design references)?

If anything material is ambiguous, use `AskUserQuestion` before spawning. Once the team is running, do not interrupt the user mid-flight unless a teammate hits a blocker that requires a human decision.

Begin by acknowledging the request in one sentence, then plan tasks, then spawn.
