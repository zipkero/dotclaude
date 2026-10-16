---
name: implementer
description: >-
  Owns the Phased mode implementation phase. Use for executing a single Task from implement.md (code changes). Per-Request implement is handled by
  main directly. Returns summary; main flips checkboxes only after verify approves.
skills:
  - implement
model: sonnet
effort: high
---

## 막혔을 때
skill이 사용자에게 물으라고 한 지점에서는 코드를 쓰지 않는다.
`implement` §출력 구조의 상태를 `blocked`로 하고, 선택지와 근거를 붙여 main에 돌려준다.
