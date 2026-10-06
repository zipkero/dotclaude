---
name: explain
description: >-
  Explain what code, changes, tasks, and systems are and how they work through evidence-backed walkthroughs and key source excerpts. Use when the
  requested outcome is understanding existing behavior, assumptions, design choices, or verification limits; not when the primary outcome is
  unresolved cause investigation, a new design recommendation, implementation, or formal approval.
---

## 역할
설명 도구이며 phase가 아니다.
main이 직접 실행하고 출력은 대화로만 나가며, 사용자가 설명을 문서로 남기라고 따로 요청할 때만 CLAUDE.md §문서화대로 파일을 쓴다.
사용자가 코드를 다 읽지 않아도 후속 변경과 장애 대응을 판단할 수 있게 하는 것이 목적이다.
구현 수정·승인/거절·상태 전환은 하지 않고 `analyze`·`verify`를 자동으로 부르지 않는다.
설명에 필요한 조사는 이 안에서 한다.

## 컨텍스트 로딩
- `$ARGUMENTS`가 `features/<feature-dir>/`나 그 아래 파일이면 그 feature로 좁히고 필요한 문서 부분만 읽되, 문서의 설명은 현재 구현과 대조한 뒤 쓴다.
- 파일·심볼·commit·diff면 그 대상과 필요한 호출부·테스트·주변 맥락을 읽는다.
- 비어 있으면 활성 feature 범위(`implement` skill §컨텍스트 로딩의 정의를 "설명 뜻"으로 읽는다)를 쓰고, 없으면 대화 맥락에서 잡은 대상을 밝히고 진행한다.

## 근거 원칙
- 각 주장은 실제로 읽은 코드·문서·diff·실행 결과로 잇는다.
  테스트 실행 뒤 관련 코드가 바뀌었으면 이전 결과를 근거로 쓰지 않는다.
- 테스트가 있다는 것과 돌려서 통과했다는 것을 나누고, 테스트를 근거로 쓸 때는 이름 대신 입력·조건·assertion·관찰 결과와 한계를 적는다.
- 확인한 사실 / 문서에 기록된 이유 / 추론한 의도 / 검증되지 않은 가정을 나누고, 당시 검토된 대안과 이번에 새로 제안하는 대안도 나눈다.

## 출력 구조
1. 결론 — 1-2문장. 대상이 무엇을 하는지와 사용자에게 미치는 영향.
2. 흐름 — 대표 입력이나 시나리오를 따라 경계에서 무엇이 들어와 어떤 결정·변환을 거쳐 무엇이 나오는지. 파일별 diff 나열로 대신하지 않는다.
3. 근거 — 중요한 결정과 계약을 보여 주는 간결한 발췌와 `file:line`, 각 발췌가 증명하는 것.
4. 한계 — 확신 수준, 현재 테스트가 보장하는 범위, 확인하지 못한 것, 더 읽을 위치와 그때 확인할 질문.

대상에 해당할 때만 더한다.
- 계약과 불변 조건 — 보장하는 코드, 적용 범위, 위반 시 장애.
- 상태 전이 — 전후 상태, 전이 조건, 저장 위치와 transaction 경계, 중간 실패 시 이미 반영된 상태와 남은 작업.
- 외부 경계 — 실패·응답 유실 뒤 성공 여부를 판단할 수 있는지, 재시도가 만드는 중복·불일치, 오류의 전파.
- 결함 — 확인된 결함은 영향과 근거를 앞세우고, 근거 있는 실패 가능성은 따로 나누며 각 반례를 현재 테스트가 다루는지 적는다.
- 막힌 지점 — `target undefined`(대상을 정할 수 없음) / `evidence unavailable`(근거에 닿을 수 없어 핵심이 추정으로 남음) / `needs input`(사용자 결정·외부 정보 필요). 읽은 것과 찾은 것, 푸는 조건을 적고, 일부만 막혔으면 나머지는 설명한다.

버그는 발생 조건·원인·잘못된 가정·수정 전후 동작·회귀 근거를, 기능은 필요·새 동작·설계 선택을, Milestone·기능 단위는 현재 가능한 동작과 남은 공백을 더한다.
마지막에 가장 기억해야 할 동작·계약·위험을 짧게 남긴다.
