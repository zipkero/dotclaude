---
description: >-
  Create the initial project documents for a project that has none — README.md, ROADMAP.md, docs/product.md,
  docs/design.md — defining the target outcome, service completion criteria, and milestones
argument-hint: "[프로젝트명 또는 한 줄 설명]"
disable-model-invocation: true
---

프로젝트 루트에 `README.md`·`ROADMAP.md`·`docs/product.md`·`docs/design.md`를 만든다.

프로젝트 이름 또는 한 줄 설명: $ARGUMENTS

## 대상 프로젝트 루트
- 사용자가 알려 준 경로, 아니면 작업 디렉토리에서 프로젝트 `CLAUDE.md`·VCS 루트·manifest로 찾고, 셋 다 없으면 어느 디렉토리를 프로젝트 루트로 쓸지 사용자에게 묻는다(전역 `~/.claude/CLAUDE.md`는 단서가 아니다).

## 산출 경로
- 루트의 `README.md`, `ROADMAP.md`, `docs/product.md`, `docs/design.md` 넷만 만들고, 하나라도 이미 있으면 아무것도 쓰지 않고 알린다.
- main이 직접 쓴다.

## 작성 규칙
- 사실(기술, 명령어, 현재 동작)은 확인한 파일이나 실행 결과로만 적고, 정해지지 않은 항목은 빈칸 대신 뺀다.
- 작업 후보는 kebab-case 이름만 적고, 체크박스·작업 순서·개별 작업의 완료 조건은 넣지 않는다.
- `docs/product.md`는 사용자 관점(대상 사용자, 핵심 흐름, 기능별 동작, 정책), `docs/design.md`는 기술 관점(현재 구현과 목표 설계, 책임 경계, 데이터 흐름, 실패 처리, 기술 위험)의 확정된 내용만 담는다.

## README.md 구조
```markdown
# <프로젝트명>

## 개요
<한 줄 설명, 해결하려는 문제와 대상 사용자>

## 현재 상태

## 사용 방법

## 문서
- [ROADMAP.md](./ROADMAP.md)
- [docs/product.md](./docs/product.md)
- [docs/design.md](./docs/design.md)
```

## ROADMAP.md 구조
```markdown
# <프로젝트명> 로드맵

## 최종 결과물
- 대상 사용자:
- 핵심 사용자 가치:
- 완성 상태:

## 서비스 완료 기준
1. <밖에서 확인할 수 있는 완료 조건>

## 마일스톤

### M1. <이 단계에서 완성되는 결과>
- 의존 관계:
- 전환 기준:
- 작업 후보: `<kebab-case 이름>`

## 보류·제외 범위
<이유와 다시 검토할 조건>
```

완료하면 프로젝트 루트와 근거, 만든 파일, 정보가 없어 뺀 항목을 알린다.
