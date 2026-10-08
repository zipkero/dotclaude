---
name: explain
description: >-
  Explain what code, changes, tasks, and systems are and how they work through evidence-backed walkthroughs and key source excerpts. Use when the
  user asks for a walkthrough of how code, a change, or a system works end to end; not for a one-line term or follow-up clarification,
  unresolved cause investigation, a new design recommendation, implementation, or formal approval.
---

## 역할
설명 도구이며 phase가 아니다.
사용자가 코드를 다 읽지 않아도 후속 변경과 장애 대응을 판단할 수 있게 하는 것이 목적이다.
main이 직접 실행하고 필요한 조사도 이 안에서 하며, 출력은 대화로만 나간다.
사용자가 설명을 문서로 남기라고 따로 요청할 때만 CLAUDE.md §문서화대로 파일을 쓴다.
구현 수정·승인/거절·상태 전환은 하지 않고 `analyze`·`verify`를 자동으로 부르지 않는다.

## 컨텍스트 로딩
- `$ARGUMENTS`가 `features/<feature-dir>/`나 그 아래 파일이면 그 feature로 좁히고 필요한 문서 부분만 읽되, 문서의 설명은 현재 구현과 대조한 뒤 쓴다.
- 파일·심볼·commit·diff면 그 대상과 필요한 호출부·테스트·주변 맥락을 읽는다.
- 비어 있으면 활성 feature 범위(`implement` skill §컨텍스트 로딩의 정의를 "설명 뜻"으로 읽는다)를 쓰고, 없으면 대화 맥락에서 잡은 대상을 밝히고 진행한다.

## 근거 원칙
- 각 주장은 실제로 읽은 코드·문서·diff·실행 결과로 잇고, 실행 뒤 코드가 바뀌었으면 그 결과를 근거로 쓰지 않는다.
- 테스트가 있다는 것과 돌려서 통과했다는 것을 나누고, 테스트를 근거로 쓸 때는 이름 대신 무엇을 어떤 조건에서 확인하는지와 한계를 적는다.
- 확인한 사실 / 문서에 기록된 이유 / 추론한 의도 / 검증되지 않은 가정을 나누고, 당시 검토된 대안과 이번에 새로 제안하는 대안도 나눈다.

## 출력 구조
1. 결론 — 1-2문장. 대상이 무엇을 하는지와 사용자에게 미치는 영향.
2. 흐름 — 대표 입력이나 시나리오를 따라 무엇이 들어와 어떤 결정·변환을 거쳐 무엇이 나오는지. 파일별 diff 나열로 대신하지 않고, 변경 전후나 여러 대상을 비교할 때는 표로 쓴다.
3. 근거 — 중요한 결정과 계약을 보여 주는 간결한 발췌와 `file:line`, 각 발췌가 증명하는 것.
4. 한계 — 확신 수준, 현재 테스트가 보장하는 범위, 확인하지 못한 것과 더 읽을 위치.

대상에 해당할 때만 더한다.
- 계약·상태·외부 경계 — 지켜지는 불변 조건, 상태 전이와 중간 실패 시 남는 상태, 외부 실패·재시도가 만드는 중복·불일치와 그 위반 시 장애.
- 결함 — 확인된 결함과 근거 있는 실패 가능성을 나누고, 각각 현재 테스트가 다루는지 적는다.
- 막힌 지점 — `target undefined`(대상을 정할 수 없음) / `evidence unavailable`(근거에 닿을 수 없어 핵심이 추정으로 남음) / `needs input`(사용자 결정·외부 정보 필요). 읽은 것과 찾은 것, 푸는 조건을 적고, 일부만 막혔으면 나머지는 설명한다.

대상이 버그면 원인과 수정 전후 동작을, 기능이면 새 동작과 설계 선택을, 기능 묶음이면 현재 가능한 동작과 남은 공백을 더한다.
마지막에 가장 기억해야 할 동작·계약·위험을 짧게 남긴다.
