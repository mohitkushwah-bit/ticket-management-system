#!/bin/bash
# Cache session context to optimize future prompts and outputs
# Stores key patterns, decisions, and file context from each session

CACHE_DIR=".copilot-cache"
mkdir -p "$CACHE_DIR"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
CACHE_FILE="$CACHE_DIR/context_cache.jsonl"

# Read session context from stdin
INPUT=$(cat)

# Extract useful context signals
SESSION_FILES=$(echo "$INPUT" | jq -r '.filesModified // [] | join(", ")' 2>/dev/null)
SESSION_TOOLS=$(echo "$INPUT" | jq -r '.toolsUsed // [] | join(", ")' 2>/dev/null)

# Append to rolling cache (JSONL format for easy parsing)
ENTRY=$(jq -n \
  --arg ts "$TIMESTAMP" \
  --arg files "$SESSION_FILES" \
  --arg tools "$SESSION_TOOLS" \
  --argjson raw "$INPUT" \
  '{timestamp: $ts, files_modified: $files, tools_used: $tools, context: $raw}' 2>/dev/null)

if [[ -n "$ENTRY" ]]; then
  echo "$ENTRY" >> "$CACHE_FILE"
fi

# Keep only last 50 entries to avoid unbounded growth
if [[ -f "$CACHE_FILE" ]]; then
  LINES=$(wc -l < "$CACHE_FILE")
  if [[ "$LINES" -gt 50 ]]; then
    tail -50 "$CACHE_FILE" > "$CACHE_FILE.tmp" && mv "$CACHE_FILE.tmp" "$CACHE_FILE"
  fi
fi

# Build a summary of frequently modified files for future context
if [[ -f "$CACHE_FILE" ]]; then
  # Extract top files modified across sessions
  jq -r '.files_modified' "$CACHE_FILE" 2>/dev/null | \
    tr ',' '\n' | sed 's/^ //g' | sort | uniq -c | sort -rn | head -20 \
    > "$CACHE_DIR/frequent_files.txt" 2>/dev/null
fi

echo '{"continue": true}'
exit 0
