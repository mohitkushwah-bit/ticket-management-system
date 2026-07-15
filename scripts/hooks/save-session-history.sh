#!/bin/bash
# Save full session history (prompts + responses) at session end
# Reads the VS Code transcript file to get complete conversation

SESSION_DIR=".copilot-sessions"
mkdir -p "$SESSION_DIR"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="$SESSION_DIR/prompts_$(date +%Y-%m-%d).log"
SESSION_FILE="$SESSION_DIR/session_${TIMESTAMP}.md"

# Read session context from stdin
INPUT=$(cat)

# Extract the transcript path from the hook input
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null)

echo "" >> "$LOG_FILE"
echo "[$( date +%H:%M:%S )] [SESSION_END] =========================" >> "$LOG_FILE"

# If we have the transcript file, extract prompts and responses
if [[ -n "$TRANSCRIPT_PATH" && -f "$TRANSCRIPT_PATH" ]]; then
  echo "# Copilot Session — $TIMESTAMP" > "$SESSION_FILE"
  echo "" >> "$SESSION_FILE"

  # Parse the transcript JSONL — extract user messages and assistant responses
  while IFS= read -r line; do
    ROLE=$(echo "$line" | jq -r '.role // .type // empty' 2>/dev/null)
    CONTENT=$(echo "$line" | jq -r '.content // .text // .message // empty' 2>/dev/null)

    if [[ -n "$CONTENT" && "$CONTENT" != "null" ]]; then
      # Truncate very long responses for the summary
      if [[ ${#CONTENT} -gt 2000 ]]; then
        CONTENT="${CONTENT:0:2000}... [truncated]"
      fi

      if [[ "$ROLE" == "user" ]]; then
        echo "## User" >> "$SESSION_FILE"
        echo "$CONTENT" >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
      elif [[ "$ROLE" == "assistant" ]]; then
        echo "## Assistant" >> "$SESSION_FILE"
        echo "$CONTENT" >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
      fi
    fi
  done < "$TRANSCRIPT_PATH"

  echo "" >> "$LOG_FILE"
  echo "[$( date +%H:%M:%S )] [INFO] Full transcript saved to: $SESSION_FILE" >> "$LOG_FILE"
else
  # Fallback: log the raw stop event
  echo "# Copilot Session — $TIMESTAMP" > "$SESSION_FILE"
  echo "" >> "$SESSION_FILE"
  echo "## Raw Session Context" >> "$SESSION_FILE"
  echo '```json' >> "$SESSION_FILE"
  echo "$INPUT" | jq '.' 2>/dev/null >> "$SESSION_FILE" || echo "$INPUT" >> "$SESSION_FILE"
  echo '```' >> "$SESSION_FILE"
fi

echo '{"continue": true}'
exit 0
