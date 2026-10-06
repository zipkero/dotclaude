---
description: >-
  Restore architecture, design, or delivery context from a project-root CONTEXT.md and verify it against linked source
  documents and the current workspace state. Read-only: reports the restored context and stops. Use when resuming
  Phased or Per-Request work in a new session, picking up saved context, revisiting an unexpected design change, or
  asking what to do next.
disallowed-tools: Write, Edit, NotebookEdit
---

## 역할
- 실행 주체는 main이며 subagent에 맡기지 않는다.
- 프로젝트 루트 `CONTEXT.md`에서 설계 또는 전달 작업의 현재 위치를 복원하고, 연결된 원본과 작업 트리에 대조해 오래되거나 어긋난 맥락을 그대로 잇지 않는다.
- 읽기 전용이며 Bash로도 파일을 고치지 않는다.
  복원 보고에서 턴을 끝낸다.
- 프로젝트 루트는 `commands/project-init.md` §대상 프로젝트 루트로 확인한다.

## 복원 절차
1. `CONTEXT.md`를 전체 읽는다.
   없으면 저장된 맥락이 없다고 알리고, 루트 문서와 `features/` 아래 feature README 상태판에서 확인되는 위치만 전하고 멈춘다.
2. `현재 작업 문서`, `먼저 읽을 파일`, `확정된 결정`이 가리키는 파일을 읽는다.
   feature 산출물이나 진행 추적자가 있으면 Task 상태·요구사항·구현 계획은 그 문서를 기준으로, 없으면 저장된 요청 범위와 변경 파일의 현재 내용을 기준으로 복원한다.
   Git 저장소면 저장된 branch·기준 HEAD를 `git status`와 대조해, 사라지거나 어긋난 변경은 차이로, HEAD가 달라진 것은 참고로 보고한다.
3. 참조 파일이 없거나 `CONTEXT.md`와 원본이 어긋나면 그 차이를 먼저 보고한다.
   `문서 반영 필요`의 확정 사항이 원본과 어긋나면 어느 쪽도 버리거나 최신으로 단정하지 않고 양쪽을 보고한다.

## 복원 보고
아래 항목만 이 순서로 간결하게 적는다.
저장값이 `없음`이면 `없음`, 비었거나 근거를 찾지 못했으면 `저장 안 됨`이다.

1. 현재 목표
2. 저장 시점, 현재 상태와 현재 작업 문서
3. 확정된 결정
4. 미확정 판단
5. 저장된 다음 작업과 완료 기준
6. 원본에 아직 반영되지 않은 확정 사항
7. 누락되거나 원본 문서·작업 트리와 어긋난 맥락
