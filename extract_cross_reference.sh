#!/usr/bin/env bash
set -euo pipefail

# Check jq is installed
if ! command -v jq >/dev/null 2>&1; then
  echo "Please install jq before running this script."
  echo "Opening: https://jqlang.github.io/jq/download/"
  open "https://jqlang.github.io/jq/download/"
  read -p "Press Enter to exit..." _
  exit 1
fi

# Ensure output directory exists
mkdir -p cross_reference

# extract relations from the dictionary
jq -f "cross_reference/extract.jq" "bhat.json" > "cross_reference/from-ja.json"
jq -f "cross_reference/extract.jq" "bhat-to-eng.json" > "cross_reference/from-eng_.json"
jq -f "cross_reference/extract.jq" "bhat-to-lineparine.json" > "cross_reference/from-lineparine_.json"

# translate the labels
jq -f "cross_reference/eng-to-ja.jq" "cross_reference/from-eng_.json" > "cross_reference/from-eng.json"
jq -f "cross_reference/lineparine-to-ja.jq" "cross_reference/from-lineparine_.json" > "cross_reference/from-lineparine.json"

# convert to JSONL
jq -c ".[]" "cross_reference/from-ja.json" > "cross_reference/from-ja.jsonl"
jq -c ".[]" "cross_reference/from-eng.json" > "cross_reference/from-eng.jsonl"
jq -c ".[]" "cross_reference/from-lineparine.json" > "cross_reference/from-lineparine.jsonl"

# delete the redundant files
rm -f "cross_reference/from-eng_.json" \
      "cross_reference/from-lineparine_.json" \
      "cross_reference/from-ja.json" \
      "cross_reference/from-eng.json" \
      "cross_reference/from-lineparine.json"
