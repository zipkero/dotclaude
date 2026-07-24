---
description: >-
  Restore architecture, design, or delivery context from a project-root CONTEXT.md and verify it against linked source
  and Phased documents. Read-only: reports the restored context and stops. Use when resuming work in a new session,
  picking up saved context, revisiting an unexpected design change, or asking what to do next during spec, analysis,
  planning, or implementation work.
---

> 사용 시점: 새 세션에서 작업 재개, 저장된 맥락 확인, 중단시킨 설계 변경의 재검토, 다음 작업 문의.

# Context Restore

## 목적

- 프로젝트 루트의 `CONTEXT.md`에서 설계 또는 전달 작업의 현재 위치를 복원한다.
- 연결된 원본 문서를 확인해 오래되거나 어긋난 맥락을 그대로 이어가지 않는다.
- 복원 보고까지가 이 command의 역할이다. 다음 작업의 수행은 다루지 않는다.

## 적용 경계

- main이 직접 처리하며 agent에 위임하지 않는다.
- 읽기 전용으로 동작하고 파일을 수정하지 않는다.
- Phased 문서가 있으면 Task 상태, 요구사항과 구현 계획은 해당 문서를 기준으로 복원한다.
- `CONTEXT.md`는 작업을 중단시킨 설계 변경, 현재 논점과 다음 작업을 보완한다.
- `문서 반영 필요`에 기록된 확정 사항은 원본 문서보다 나중에 결정됐을 수 있으므로 단순 충돌로 폐기하지 않는다.
- 프로젝트 루트를 하나로 결정할 수 없으면 사용자에게 대상 프로젝트를 확인한다.
- Git branch, commit, status, diff는 조사하지 않는다.

## 복원 절차

1. 프로젝트 루트의 `CONTEXT.md`를 전체 읽는다.
2. 파일이 없으면 저장된 맥락이 없다고 알리고 추정으로 재구성하지 않는다.
3. `현재 작업 문서`, `먼저 읽을 문서`와 `확정된 결정`에서 참조한 프로젝트 문서를 읽는다.
4. 참조 파일이 없거나 `CONTEXT.md`와 원본 또는 Phased 문서가 충돌하면 그 차이를 먼저 보고한다.
5. `문서 반영 필요`에 명시되지 않은 충돌은 현재 원본 문서를 기준으로 복원한다.
6. `문서 반영 필요` 항목은 아직 원본에 반영되지 않은 확정 사항으로 복원한다.
   원본과 명시적으로 충돌하면 양쪽 내용을 함께 보고하고 어느 쪽이 현재 결정인지 확정하지 않는다.
7. 현재 목표, 현재 상태, 현재 작업 문서, 확정된 결정, 미확정 판단, 다음 작업과 완료 기준을 짧게 복원한다.
8. 복원 보고 후 멈춘다. 다음 작업을 시작하지 않는다.

## 복원 후 경계

- 다음 작업의 실제 수행은 사용자의 별도 요청으로 시작하며,
  CLAUDE.md §phase 제어와 §agent·skill 라우팅을 그대로 따른다.
  복원이 문서 phase의 자동 진행이나 agent 위임 규칙을 우회하는 근거가 되지 않는다.
- `CONTEXT.md`에 없는 새 설계 결정을 임의로 확정하지 않는다.
- 복원 결과를 `CONTEXT.md`에 다시 쓰지 않는다.
  사용자가 `/context-save`를 호출할 때만 인수인계 상태를 갱신한다.

## 복원 보고

다음 순서로 간결하게 보고한다.

1. 현재 목표
2. 현재 상태와 현재 작업 문서
3. 확정된 결정
4. 미확정 판단 — 항목별로 사용자와 논의된 쟁점인지 미논의 후보인지 구분해 보고하고,
   미논의 후보는 앞으로 논의가 필요한 제안으로 소개하되 이미 논의된 것처럼 표현하지 않는다
5. 저장된 다음 작업과 완료 기준
6. 누락되거나 원본 문서와 충돌한 맥락
