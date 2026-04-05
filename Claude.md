# AGENTS

OPENDER (analysis)
- Find exact root cause (file + line)
- No edits
- No guessing

CLAUDER (fix)
- Apply smallest possible fix
- Max 2 files
- No refactor unless asked

TRUTH (verify)
- Verify via real UI/API
- Must confirm it works


# RULES

- One task only
- No scope expansion
- No guessing
- If unclear → continue analyzing


# WORKFLOW (STRICT)

1. OPENDER → root cause (file + line)
2. CLAUDER → minimal fix
3. TRUTH → verify

Output:
- root cause
- files changed
- patch summary
- verification result


# LIMITS

- Max 2 files
- No repo-wide edits
- No hidden extra fixes


# VERIFY

- Run: npx tsc --noEmit (if TS)
- Never claim success without proof


# FAIL

If verify fails:
- STOP
- Do NOT attempt another fix


# HARD STOP

After task:
- STOP immediately
- No extra changes
- No suggestions
