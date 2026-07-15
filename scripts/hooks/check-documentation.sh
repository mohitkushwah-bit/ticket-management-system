#!/bin/bash
# Check if documentation needs updating after code changes
# This hook runs after tool use to remind about documentation updates

# Read stdin for hook context
INPUT=$(cat)

# Extract the tool name that was just used
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName // empty' 2>/dev/null)

# Only check after file edit operations
if [[ "$TOOL_NAME" == *"edit"* ]] || [[ "$TOOL_NAME" == *"create"* ]]; then
  # Get the file that was modified
  FILE_PATH=$(echo "$INPUT" | jq -r '.toolInput.filePath // empty' 2>/dev/null)
  
  if [[ -n "$FILE_PATH" ]]; then
    # Check if it's a source file (not test, not config)
    if [[ "$FILE_PATH" == *.ts ]] || [[ "$FILE_PATH" == *.tsx ]]; then
      if [[ "$FILE_PATH" != *.test.* ]] && [[ "$FILE_PATH" != *.spec.* ]]; then
        # Check if there's a corresponding README or docs
        DIR=$(dirname "$FILE_PATH")
        
        # Output a reminder message
        echo '{"systemMessage": "Reminder: If this change adds new functionality, modifies API contracts, or changes configuration, consider updating the relevant README.md or documentation."}'
        exit 0
      fi
    fi
  fi
fi

# Default: continue without message
echo '{"continue": true}'
exit 0
