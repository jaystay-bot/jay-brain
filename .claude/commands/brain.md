# /brain

TASK:
Sync local CLAUDE.md with master brain repo.

STEPS:
1. Ensure brain repo exists locally
2. Pull latest changes
3. Copy CLAUDE.md into current project
4. Confirm file is loaded

COMMANDS (PowerShell):
if (!(Test-Path .\jay-brain)) { git clone https://github.com/jaystay-bot/jay-brain.git }
git -C .\jay-brain pull
Copy-Item .\jay-brain\CLAUDE.md .\CLAUDE.md -Force
type .\CLAUDE.md

SUCCESS:
- CLAUDE.md exists in current repo
- File is not empty
- Latest brain rules are loaded

STOP AFTER SYNC
