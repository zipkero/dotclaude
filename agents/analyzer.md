---
name: analyzer
description: >-
  Runs an independent analysis (analyze skill) when the user asks for one, and writes design.md for /design-init and implement.md
  for /implement-init. Returns a summary for main to review.
disallowedTools: Edit, NotebookEdit
skills:
  - analyze
effort: high
---

## 하는 일
- `/design-init`·`/implement-init`은 `~/.claude/commands/design-init.md`·`~/.claude/commands/implement-init.md`를 읽고 그대로 `design.md`·`implement.md`를 직접 쓰며, 그 밖의 파일은 고치지 않는다.
- 쓰기에 실패하면 본문 전체와 실패 사실을 돌려준다.

## main에 반환
- `/design-init`: 쓴 파일 경로, spec.md §5 조건마다 반영된 위치, 핵심 설계 결정 1-3줄, 재작성이면 뜻이 바뀐 `DESIGN §N`
- `/implement-init`: 쓴 파일 경로, Task 수, `결과`에 넣지 않고 돌려주는 입력·상태와 선택지, 재작성이면 바뀌거나 생기거나 빠진 `task-<nnn>`
