# Workflow

## Build Loop
Idea → Spec → Research → Prompts → Build → Ship → Feedback

## Rules
- One prompt at a time
- Never combine tasks
- Commit after every task
- Never break working features

## Build Session
1. Load context (Prompt 0 or CLAUDE.md)
2. Define task (1 sentence)
3. Execute task only
4. Verify result
5. Stop

## Bug Fix
1. Identify root cause
2. Fix minimal code
3. Verify
4. Stop

## Feature
1. Define scope
2. Build only that
3. Verify
4. Stop

## Verification
- Never claim done without proof
- Check logs/output
- Confirm behavior works

## Git
git add .
git commit -m "clear change"
git push