---
name: task-review
description: "Explain a completed implement.md Task as a method-by-method walkthrough of the implementation. Focuses on flow, method responsibilities, tests, trade-offs, and remaining risks. Does not produce an approve/reject judgment and does not modify files. Use when the user asks for a task review, implementation explanation, code walkthrough, or detailed code-based review."
---

## 역할
완료된 `implement.md` Task 하나를 코드 흐름 중심으로 설명하는 walkthrough 유틸리티다. 파일을 쓰지 않고 출력은 대화로만 나간다. 판정·체크박스 갱신은 하지 않는다.

- `verify`와 다르다 — 승인·반려 판단이 아니라 코드 설명이다.
- `analyze`와 다르다 — 자유 형식 조사가 아니라, 한 Task의 구현 결과를 정해진 구조로 설명한다.

## 컨텍스트 로딩
Phased mode일 때만 진입한다. 진입 조건은 다음 중 하나다.
- `$ARGUMENTS`가 `docs/<feature-dir>/` 또는 그 하위 파일과 매치한다.
- 현재 대화가 활성 `docs/<feature-dir>/` scope를 가리킨다(활성 scope 정의는 `skills/implement/SKILL.md` §컨텍스트 로딩과 동일하되 "implement 의도"를 "review 의도"로 읽는다).

진입 후:
- implement.md를 읽는다.
- 대상 Task는 사용자가 `$ARGUMENTS`나 발화로 지목한 Task. 지목이 없으면 가장 최근에 완료된(`[x]`) Task.
- 해당 Task가 참조하는 spec.md·analysis.md 섹션과 변경된 소스·테스트 파일을 읽는다.

## Blocker
walkthrough를 시작하지 않고 사유를 명시한다. 각 Blocker는 Evidence(무엇을 조사했는지)와 Unblock requires(차단을 해제할 정보·결정)를 포함한다.

- `scope undefined`: Phased scope 밖 호출(Per-Request 등), `implement.md` 부재, 또는 대상 Task 단일 식별 실패.
- `needs input`: 대상 Task는 정해졌지만 변경된 소스 또는 참조 spec 영역을 결정할 수 없다.

## 출력 구조
한국어로 작성한다. 순서:

1. Task N 리뷰 — Task의 목적과 구현 범위를 짧게.
2. 전체 플로우 — 진입점에서 결과까지 주요 메소드와 계층을 거치는 흐름을 단계로 보여준다. 이후 섹션은 이 플로우를 따라간다.
3. 메소드별 설명 — 핵심 메소드를 코드 흐름대로 풀어 설명한다. 각 메소드는 (1) 책임 (2) 입력·전제 (3) 처리 순서 (4) 반환·다음 메소드로 넘기는 값 (5) 경계 분리나 설계상의 의미 순서로 설명한다. Task의 중심 메소드는 처리 순서를 단계 목록으로 반드시 풀어 적고, 보조 메소드는 역할과 연결 지점만 짧게 둔다. 메소드는 처음 언급할 때 소속 파일을 함께 링크하고, 이후에는 메소드명만 사용한다.
4. 테스트와 검증 — 함수 이름만 나열하지 않고, 어떤 입력 조건에서 어떤 동작·오류를 확인하며 플로우의 어느 부분을 보호하는지 설명한다. 검증 명령을 실행했다면 결과를 함께 적는다.
5. Trade-off — 선택한 방식, 현재 범위에서 적절한 이유, 한계가 생길 수 있는 상황.
6. 남은 리스크 — 확인된 사실과 추정 가능성을 구분한다.

라인 번호를 따라가는 설명(예: "88번째 줄에서 …")은 쓰지 않는다. 파일 링크와 라인 링크는 근거가 필요한 첫 언급에만 사용하고, 같은 파일을 다시 언급할 때는 메소드명·테스트명만 사용한다.

## 지침
- 보안·성능·SLO 같은 일반 체크리스트를 대상에 투사하지 않는다. 이 프로젝트의 코드·spec에 직접 근거가 없으면 출력에 포함하지 않는다.
- 구현 리뷰와 직접 관련 없는 git working tree 상태, untracked 여부, 승인/반려 판단은 쓰지 않는다.
