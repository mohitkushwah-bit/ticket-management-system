#!/bin/bash
# Log model tool usage after each tool call
# This hook runs on PostToolUse to capture what tools the agent used

SESSION_DIR=".copilot-sessions"
mkdir -p "$SESSION_DIR"

# Use a SEPARATE file for tool traces to avoid polluting the prompt log
TOOL_LOG="$SESSION_DIR/tools_$(date +%Y-%m-%d).log"
RAW_LOG="$SESSION_DIR/raw_$(date +%Y-%m-%d).jsonl"

# Read the response context from stdin
INPUT=$(cat)

TIMESTAMP=$(date +"%H:%M:%S")

# Extract fields from the known PostToolUse structure
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"' 2>/dev/null)

# Build a concise log entry showing what tool was called and on what
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.filePath // .tool_input.command // empty' 2>/dev/null)

# Format: [TIME] [TOOL] tool_name -> target
if [[ -n "$FILE_PATH" && "$FILE_PATH" != "null" ]]; then
  # Shorten the file path for readability (remove cwd prefix)
  CWD=$(echo "$INPUT" | jq -r '.cwd // empty' 2>/dev/null)
  SHORT_PATH=$(echo "$FILE_PATH" | sed "s|$CWD/||")
  echo "[$TIMESTAMP] [$TOOL_NAME] $SHORT_PATH" >> "$TOOL_LOG"
else
  echo "[$TIMESTAMP] [$TOOL_NAME]" >> "$TOOL_LOG"
fi

# Always save raw JSON for full analysis
echo "$INPUT" >> "$RAW_LOG"

echo '{"continue": true}'
exit 0
