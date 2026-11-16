#!/bin/sh
# SessionStart(matcher compact): compaction 직후 프로젝트 루트 CONTEXT.md를 모델 컨텍스트에 다시 넣는다.
# 세션을 하위 디렉토리에서 시작했을 수 있으므로 .git이 있는 디렉토리까지 올라가며 찾는다.
d=$(printf '%s' "${CLAUDE_PROJECT_DIR:-$PWD}" | tr '\134' '/')
while [ ! -f "$d/CONTEXT.md" ]; do
  parent=$(dirname "$d")
  if [ -e "$d/.git" ] || [ "$parent" = "$d" ] || [ "$parent" = "." ]; then exit 0; fi
  d=$parent
done
printf '## 복원된 작업 맥락 (%s)\n' "$d/CONTEXT.md"
printf '이 파일은 compaction 요약보다 오래됐을 수 있다. `저장:` 시각을 확인하고, 요약·Git 상태와 어긋나는 내용은 그대로 이어받지 말고 알린다. 원본과 맞춰 볼 필요가 있으면 /context-restore를 쓴다.\n\n'
cat "$d/CONTEXT.md"
