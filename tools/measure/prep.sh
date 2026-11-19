#!/bin/sh
# usage: sh prep.sh <git-ref|WORKTREE> <out-dir>
# ~/.claude 추적 파일을 <git-ref> 시점(WORKTREE면 작업 트리)으로 <out-dir>에 복사하고,
# hook·플러그인 항목을 뺀 settings.json을 더한다.
set -eu
ref=$1; out=$2
repo=$(cd "$(dirname "$0")/../.." && pwd)
rm -rf "$out"; mkdir -p "$out"
if [ "$ref" = WORKTREE ]; then
  git -C "$repo" ls-files | while IFS= read -r f; do
    mkdir -p "$out/$(dirname "$f")"; cp "$repo/$f" "$out/$f"
  done
else
  git -C "$repo" archive "$ref" | tar -x -C "$out"
fi
if [ -f "$repo/settings.json" ]; then
  jq 'del(.hooks, .enabledPlugins, .extraKnownMarketplaces, .pluginConfigs)' "$repo/settings.json" > "$out/settings.json"
fi
echo "$out"
