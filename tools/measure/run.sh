#!/bin/sh
# usage: MODEL=<model> sh run.sh <config-dir> <project-repo> <run-dir> <prompt>
# <run-dir>이 없으면 <config-dir>을 컨테이너 ~/.claude로, <project-repo>의 git clone을 /work로 두고 새 세션을 시작한다.
# <run-dir>이 이미 있으면 같은 세션을 --resume으로 이어 다음 턴을 돌린다(<config-dir>·<project-repo>는 무시).
# 결과: <run-dir>/t<N>.json(claude -p 출력), t<N>.err, status-t<N>.txt(git status)
set -eu
: "${MODEL:?MODEL을 이 세션의 main 모델로 지정한다}"
IMAGE=${IMAGE:-cr-measure}
cfg=$1; proj=$2; run=$3; prompt=$4
token=$(tr -d '\r\n' < "$HOME/.config/claude/review-token")

if [ -d "$run" ]; then
  n=$(ls "$run"/t*.json | wc -l); n=$((n + 1))
  sid=$(jq -r .session_id "$run/t1.json" | tr -d '\r')
  set -- --resume "$sid"
else
  mkdir -p "$run/home"
  cp -r "$cfg" "$run/home/.claude"
  git clone -q "$proj" "$run/work"
  n=1
  set --
fi

abs() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else (cd "$1" && pwd); fi; }
home=$(abs "$run/home/.claude"); work=$(abs "$run/work")

# CLAUDE_CONFIG_DIR을 지정해 .claude.json도 마운트한 설정 폴더 안에 두어, --resume 턴에서도 남게 한다.
MSYS_NO_PATHCONV=1 docker run --rm -e CLAUDE_CODE_OAUTH_TOKEN="$token" -e CLAUDE_CONFIG_DIR=/home/node/.claude \
  -v "$home:/home/node/.claude" -v "$work:/work" "$IMAGE" \
  claude -p --model "$MODEL" --output-format json --permission-mode bypassPermissions "$@" "$prompt" \
  < /dev/null > "$run/t$n.json" 2> "$run/t$n.err" || true
git -C "$run/work" status --porcelain > "$run/status-t$n.txt"
echo "$run/t$n.json"
