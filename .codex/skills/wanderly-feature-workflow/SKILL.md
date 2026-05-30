---
name: wanderly-feature-workflow
description: Use when turning Wanderly product ideas, feature requests, bugs, or vague implementation prompts into a staged AI workflow with tickets, specs, implementation plans, code execution, verification, and Obsidian knowledge notes.
---

# Wanderly Feature Workflow

## Overview

Use this skill to run Wanderly work through explicit gates: idea intake, ticket, spec, design decision, implementation plan, implementation, verification, and knowledge capture. The goal is to prevent vague prompts from jumping straight to code.

## Core Rule

Move the work one stage at a time unless the user explicitly provides an approved artifact for a later stage.

```text
Idea -> Ticket -> Spec -> Plan -> Code -> Verification -> Review -> Knowledge
```

If the user asks to implement a vague idea, create or request the missing ticket/spec/plan first. If the user says the stage is approved, proceed to the next stage.

## Required Context

Before producing a ticket, spec, or plan, inspect:

- `AGENTS.md` for repo rules.
- `docs/product-spec.md` for product scope and feature tiers.
- `README.md` and `package.json` for workspace and command context.
- Existing feature folders under `apps/mobile`, `apps/web`, `apps/api`, and `packages/shared` when relevant.

Honor Wanderly boundaries:

- Mobile product work belongs in `apps/mobile`.
- Web dashboard work belongs in `apps/web`.
- Backend business logic belongs in NestJS feature modules under `apps/api/src`.
- Shared HTTP contracts belong in `packages/shared`.
- Shared web UI belongs in `packages/ui`.

## Obsidian Location

If the user has a vault path, write workflow notes there. If no vault path is known, ask once. If the user wants repo-local notes, use:

```text
docs/obsidian/
  00 Inbox/
  01 Tickets/
  02 Specs/
  03 Implementation Plans/
  04 Decisions/
  05 Bugs/
  06 Testing Notes/
  07 Release Notes/
  08 Knowledge/
```

Use templates from `assets/obsidian-templates/` when creating new notes.

## Stage 1: Idea Intake

Trigger examples:

- "I have an idea..."
- "Build a feature where..."
- "Can we add..."
- "Create the workflow/spec for..."

Actions:

1. Summarize the idea in product language.
2. Identify affected surfaces: `mobile`, `web`, `api`, `shared`, `ui`, or infra.
3. Check whether the idea is MVP, V2, or V3 using `docs/product-spec.md`.
4. Ask at most one clarifying question if scope or success criteria are ambiguous.
5. Create a ticket note from `Ticket.md`.

Do not implement in this stage.

## Stage 2: Spec

Use `superpowers:brainstorming` when turning an idea or ticket into a feature spec.

The spec must cover:

- Goal and user story.
- In-scope and out-of-scope work.
- User flow or backend flow.
- API/data contracts if applicable.
- UI states: loading, empty, success, error, disabled.
- Auth, permissions, and ownership rules.
- Edge cases.
- Acceptance criteria.
- Testing expectations.

Write the spec note from `Spec.md`, then stop for user approval.

## Stage 3: Decisions

Create a decision note from `Decision.md` when the implementation has a meaningful fork, such as:

- manual code vs deep link,
- polling vs realtime,
- schema shape,
- mobile-only vs shared contract,
- temporary local state vs persisted backend behavior.

Keep decisions short: context, decision, reason, consequences.

## Stage 4: Implementation Plan

Use `superpowers:writing-plans` after the user approves the spec.

The plan must include:

- Exact files likely created or modified.
- Task-by-task checklist.
- Tests before implementation for behavior changes.
- Verification commands.
- Commit boundaries if requested.
- Rollback or follow-up notes for risky changes.

For this repo, prefer narrow verification commands first:

```bash
npm run typecheck -w web
npm run build -w web
npm run build -w api
npm run test -w api
```

Use root-level commands only when the change crosses several workspaces:

```bash
npm run lint
npm run typecheck
npm run build
```

Write the plan note from `Implementation Plan.md`, then stop for approval.

## Stage 5: Implementation

Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` when implementing an approved plan.

Use `superpowers:test-driven-development` for features, bug fixes, and behavior changes:

1. Write the failing test.
2. Run it and confirm the expected failure.
3. Implement the minimum code.
4. Run the test and confirm it passes.
5. Refactor only while tests stay green.

Never run `npm install` unless the user explicitly asks. If a dependency is needed, tell the user the exact root-level install command.

## Stage 6: Verification

Use `superpowers:verification-before-completion` before claiming the work is done.

Report the exact command results. If a command cannot run because dependencies, credentials, Docker, or network access are unavailable, state that plainly and give the user the command to run.

## Stage 7: Knowledge Capture

After verification, update or create:

- Testing note from `Testing Note.md`.
- Release note from `Release Note.md` when user-facing behavior changed.
- Knowledge note from `Knowledge Note.md` for reusable domain or technical decisions.
- Ticket status and links to spec, plan, decision notes, commits, or PR.

Capture what future agents need to avoid rediscovering the same context.

## Done Criteria

Do not mark a ticket done until:

- Acceptance criteria are checked.
- Verification commands have fresh results.
- User-facing changes have release notes when appropriate.
- Non-obvious implementation or product decisions are captured.
- Follow-ups are listed separately from completed scope.
