---
description: >-
  Restore work context from a project-root CONTEXT.md, check it against linked documents and Git state, and report it
  read-only. Use when resuming work in a new session or asking what to do next.
disallowed-tools: Write, Edit, NotebookEdit
---

## 역할
- main이 프로젝트 루트 `CONTEXT.md`로 작업 위치를 되살리되, 원본 문서·작업 트리와 어긋난 내용은 그대로 이어받지 않는다.
- 파일을 고치지 않고(Bash 포함), 복원 보고를 내고 턴을 끝낸다.

## 복원 절차
1. `CONTEXT.md`를 읽고, 없으면 루트 문서와 `features/*/README.md`의 `## 상태`로 알 수 있는 것만 전하고 멈춘다.
2. `현재 작업 문서`·`먼저 읽을 파일`·`확정된 결정`이 가리키는 파일을 읽고, Task 상태는 feature 문서를 기준으로 한다.
3. 저장된 branch·HEAD·변경 파일을 지금 Git 상태와 비교해, 그 사이 커밋된 것과 어긋난 것을 나눈다.
4. 저장 후 7일이 넘었으면 오래된 맥락일 수 있다고 알린다.
5. `문서 반영 필요` 항목이 원본에 반영됐는지 확인한다.

## 복원 보고
없는 항목은 뺀다.
1. 요약 — 목표, 멈춘 곳, 작업 문서, 저장 시점과 지난 시간
2. 어긋남 — 원본·작업 트리와 다른 내용
3. 이어서 할 일 — 대기 중인 사용자 응답, 다음 작업과 완료 기준
4. 이어받는 전제 — 확정된 결정, 작업 제약, 미확정 판단, 실패한 접근, 문서 반영 필요
