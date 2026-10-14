---
name: explain
description: >-
  Explain what code, changes, tasks, and systems are and how they work through evidence-backed walkthroughs, diagrams, and key source excerpts. Use
  when the user asks for a walkthrough of how code, a change, or a system works end to end; not for a one-line term or follow-up clarification,
  unresolved cause investigation, a new design recommendation, implementation, or formal approval.
---

## 역할
- 코드, 변경, Task, 시스템이 무엇이고 어떻게 동작하는지 설명한다.
- 처음 보는 사람도 코드를 다 읽지 않고, 대상이 전체 흐름에서 무슨 일을 하는지 알 수 있게 한다.
- main이 직접 하고, 결과는 대화로만 낸다.
- 사용자가 문서로 남겨 달라고 할 때만 CLAUDE.md §문서화대로 파일을 쓴다.

## 컨텍스트 로딩
대상과 함께, 대상을 부르는 쪽과 결과를 받는 쪽까지 읽는다.
- `$ARGUMENTS`가 `features/<feature-dir>/`나 그 아래 파일이면 그 feature로 좁힌다.
  문서 내용은 지금 코드와 맞는지 확인하고 쓴다.
- 파일·심볼·commit·diff면 그 대상과 관련 테스트를 읽는다.
- 비어 있으면 활성 feature(`implement` skill §컨텍스트 로딩)를 대상으로 한다.
  활성 feature가 없으면 대화에서 대상을 잡고, 무엇으로 잡았는지 밝힌다.

## 근거
- 실제로 읽은 코드·문서·실행 결과에 근거해 설명한다.
- 실행한 뒤 코드가 바뀌었으면 그 실행 결과는 쓰지 않는다.
- 테스트가 있다는 것과 돌려서 통과했다는 것을 구분한다.
- 확인한 사실, 문서에 적힌 이유, 추측한 의도를 구분한다.

## 표현
- 어려운 용어는 처음 나올 때 풀어 쓴다.
- 단계마다 무엇을 하는지, 왜 필요한지 쉬운 말로 적는다.
- 흐름은 코드 블록 안에 문자 다이어그램으로 그리고, 노드는 실제 함수·파일 이름을 쓴다.
- 한글은 2칸을 차지하므로, 한글 뒤에 위아래 줄과 맞춰야 하는 문자를 두지 않는다.
- 변경 전후나 여러 대상 비교는 표로 쓴다.

## 출력 구조
넓은 데서 좁은 데로 내려간다.
앞에서 설명한 건 뒤에서 반복하지 않는다.
1. 결론 — 1-2문장. 대상이 무엇을 하는지, 사용자에게 어떤 영향이 있는지.
2. 전체 그림 — 대상이 속한 큰 흐름을 다이어그램으로 보이고, 그 안에서 대상 위치를 표시한다.
3. 흐름 — 대표 입력 하나를 따라 진입점부터 반환까지 실제 호출 흐름을 다이어그램으로 보이고, 단계마다 무엇을 왜 하는지 풀어 쓴다.
4. 근거 — 중요한 부분의 짧은 코드 발췌와 `file:line`, 그 발췌가 보여 주는 것.
5. 한계 — 얼마나 확실한지, 테스트가 어디까지 보장하는지, 확인 못 한 것과 더 볼 곳.

해당할 때만 흐름 뒤에 더한다.
- 버그면 원인과 수정 전후 동작, 기능이면 새 동작과 설계 이유.
- 지켜야 하는 조건, 상태 변화, 중간에 실패하면 남는 상태, 외부 실패·재시도로 생기는 중복이나 불일치.
- 확인된 결함과 가능성 있는 결함을 나누고, 테스트가 다루는지 적는다.
- 대상을 정할 수 없거나, 근거에 접근할 수 없거나, 사용자 결정이 필요하면 무엇을 봤는지와 무엇이 있으면 풀리는지 적는다.
  일부만 막혔으면 나머지는 설명한다.
