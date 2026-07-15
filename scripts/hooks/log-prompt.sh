#!/bin/bash
# Log every user prompt and model response for session analysis
# This hook runs on UserPromptSubmit

SESSION_DIR=".copilot-sessions"
mkdir -p "$SESSION_DIR"

LOG_FILE="$SESSION_DIR/prompts_$(date +%Y-%m-%d).log"
RAW_LOG="$SESSION_DIR/raw_$(date +%Y-%m-%d).jsonl"

# Read the prompt context from stdin
INPUT=$(cat)

TIMESTAMP=$(date +"%H:%M:%S")

# Extract prompt — the field is confirmed as .prompt from raw logs
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' 2>/dev/null)

# Fallback to other fields if .prompt is empty
if [[ -z "$PROMPT" || "$PROMPT" == "null" ]]; then
  PROMPT=$(echo "$INPUT" | jq -r '
    .message //
    .userMessage //
    .content //
    .input //
    .text //
    empty
  ' 2>/dev/null)
fi

# Final fallback: raw JSON
if [[ -z "$PROMPT" || "$PROMPT" == "null" ]]; then
  PROMPT=$(echo "$INPUT" | jq -c '.' 2>/dev/null || echo "$INPUT")
fi

# Append prompt to daily log
echo "" >> "$LOG_FILE"
echo "[$TIMESTAMP] [PROMPT] $PROMPT" >> "$LOG_FILE"

# Save raw JSON for debugging
echo "$INPUT" >> "$RAW_LOG"

echo '{"continue": true}'
exit 0

echo '{"continue": true}'
exit 0
