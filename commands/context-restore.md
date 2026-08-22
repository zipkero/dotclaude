---
description: >-
  Restore architecture, design, or delivery context from a project-root CONTEXT.md and verify it against linked source
  and Phased documents. Read-only: reports the restored context and stops. Use when resuming work in a new session,
  picking up saved context, revisiting an unexpected design change, or asking what to do next during spec, analysis,
  planning, or implementation work.
disallowed-tools: Write, Edit, NotebookEdit
---

## 역할

- 프로젝트 루트의 `CONTEXT.md`에서 설계 또는 전달 작업의 현재 위치를 복원한다.
- 연결된 원본 문서를 확인해 오래되거나 어긋난 맥락을 그대로 이어가지 않는다.
- 복원 보고까지가 이 command의 역할이다.

## 적용 경계

- 읽기 전용으로 동작하며 Bash로도 파일을 고치지 않는다.
- Phased 문서나 지정된 진행 추적자가 있으면 Task 상태, 요구사항과 구현 계획은 해당 문서를 기준으로 복원한다.
- `CONTEXT.md`는 작업을 중단시킨 설계 변경, 현재 논점과 다음 작업을 보완한다.
- `문서 반영 필요`에 기록된 확정 사항은 원본 문서보다 나중에 결정됐을 수 있으므로 단순 충돌로 버리지 않는다.
- `저장:` 시각을 충돌 판정 근거로 쓰지 않는다. 어느 쪽이 최신인지 판정하지 않고 양쪽을 보고한다.
- 읽을 프로젝트 루트는 `commands/project-init.md` §대상 프로젝트 루트를 따라 확인한다.

## 복원 절차

1. 프로젝트 루트의 `CONTEXT.md`를 전체 읽는다.
2. 저장된 맥락과 원본 문서에서 확인되지 않는 내용은 추정으로 채우지 않는다.
   파일이 없으면 저장된 맥락이 없다고 알린 뒤, 프로젝트 루트의 문서와 `features/` 아래 feature README
   상태판에서 확인되는 현재 위치만 전하고 멈춘다. 이 경우 §복원 보고를 만들지 않는다.
   파일이 있고 항목이 비었거나 근거를 찾지 못하면 그 항목을 `저장 안 됨`으로 보고한다.
3. `현재 작업 문서`, `먼저 읽을 문서`와 `확정된 결정`에서 참조한 프로젝트 문서를 읽는다.
4. 참조 파일이 없거나 `CONTEXT.md`와 원본·Phased 문서가 충돌하면 그 차이를 §적용 경계대로 먼저 보고한다.
5. `문서 반영 필요` 항목은 아직 원본에 반영되지 않은 확정 사항으로 복원한다.
6. 현재 목표, 현재 상태, 현재 작업 문서, 확정된 결정, 미확정 판단, 다음 작업과 완료 기준을 짧게 복원한다.
7. 복원 보고 후 멈춘다.

## 복원 후 경계

- 다음 작업의 실제 수행은 사용자의 별도 요청으로 시작하며,
  CLAUDE.md §phase 제어와 §agent·skill 라우팅을 그대로 따른다.
  복원이 문서 phase의 자동 진행이나 agent 위임 규칙을 건너뛰는 근거가 되지 않는다.
- `CONTEXT.md`에 없는 새 설계 결정은 확정하지도, 추정·제안·판단으로 표시해 보고에 넣지도 않는다.
- 복원 결과를 `CONTEXT.md`에 다시 쓰지 않는다.
  사용자가 `/context-save`를 부를 때만 이어받기 상태를 갱신한다.

## 복원 보고

다음 순서로 간결하게 보고하며, 이 항목 외에 다른 항목을 추가하지 않는다.

1. 현재 목표
2. 저장 시점, 현재 상태와 현재 작업 문서
3. 확정된 결정
4. 미확정 판단 — 저장된 쟁점만 그대로 보고하고, 어느 쪽이 맞는지 판단하거나 새 선택지를 덧붙이지 않는다
5. 저장된 다음 작업과 완료 기준
6. 원본에 아직 반영되지 않은 확정 사항 — 없으면 생략한다
7. 누락되거나 원본 문서와 충돌한 맥락
