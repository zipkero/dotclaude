---
description: >-
  Restore architecture, design, or delivery context from a project-root CONTEXT.md and verify it against linked source
  documents and the current workspace state. Read-only: reports the restored context and stops. Use when resuming
  Phased or Per-Request work in a new session, picking up saved context, revisiting an unexpected design change, or
  asking what to do next.
disallowed-tools: Write, Edit, NotebookEdit
---

## 역할
- main이 직접 한다.
- 프로젝트 루트 `CONTEXT.md`로 작업 위치를 되살린다.
- 원본 문서와 작업 트리에 대조해, 낡거나 어긋난 내용은 그대로 이어받지 않는다.
- 읽기만 한다.
  Bash로도 파일을 고치지 않는다.
- 복원 보고를 내고 턴을 끝낸다.
- 프로젝트 루트는 `commands/project-init.md` §대상 프로젝트 루트로 찾는다.

## 복원 절차
1. `CONTEXT.md`를 전부 읽는다.
   없으면 저장된 맥락이 없다고 알리고, 루트 문서와 `features/` 아래 README 상태판에서 알 수 있는 것만 전하고 멈춘다.
2. `현재 작업 문서`, `먼저 읽을 파일`, `확정된 결정`이 가리키는 파일을 읽는다.
   - feature 문서가 있으면 Task 상태와 요구사항은 그 문서를 기준으로 한다.
   - 없으면 저장된 요청 범위와 변경 파일의 현재 내용을 기준으로 한다.
   - `현재 상태`에 적힌 background 작업이나 worker는 결과를 받을 곳이 아직 있는지 본다.
3. Git 저장소면 저장된 branch, HEAD, 커밋 안 된 변경을 지금 상태와 비교한다.
   - 사라진 변경이 `<저장 시점 HEAD>..HEAD` 커밋에 들어갔으면 커밋된 것으로 본다.
   - 그렇지 않으면 차이로 보고한다.
   - HEAD가 달라졌으면 그 사이 커밋 수를 참고로 알린다.
4. 저장 후 얼마나 지났는지 계산한다.
   7일이 넘었으면 오래된 맥락일 수 있다고 알린다.
5. `문서 반영 필요` 항목마다 원본에 이미 반영됐는지 확인한다.

## 복원 보고
내용이 있는 항목만 이 순서로 적는다.
1. 요약 — 목표, 멈춘 곳, 현재 작업 문서, 저장 시점과 지난 시간
2. 어긋남 — 빠졌거나 원본·작업 트리와 다른 내용, 7일 경과 경고
3. 이어서 할 일 — 대기 중인 사용자 응답, 복원한 Task 상태 기준의 다음 작업과 완료 기준
4. 이어받는 전제 — 확정된 결정, 작업 제약, 미확정 판단, 실패한 접근, 문서 반영 필요(반영됨/미반영)
