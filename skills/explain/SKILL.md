---
name: explain
description: >-
  Explain what code, changes, tasks, and systems are and how they work through evidence-backed walkthroughs, diagrams, and key source excerpts. Use
  when the user asks for a walkthrough of how code, a change, or a system works end to end; not for a one-line term or follow-up clarification,
  unresolved cause investigation, a new design recommendation, implementation, or formal approval.
---

## 역할
- 코드, 변경, Task, 시스템이 무엇이고 어떻게 동작하는지, 처음 보는 사람도 코드를 다 읽지 않고 알 수 있게 설명한다.
- main이 직접 하고 결과는 대화로만 내며, 사용자가 문서로 남겨 달라고 할 때만 CLAUDE.md §문서화대로 쓴다.

## 읽을 것
- 대상과 함께, 대상을 부르는 쪽과 결과를 받는 쪽, 관련 테스트까지 읽는다.
- `$ARGUMENTS`가 비어 있으면 활성 feature(`implement` skill §컨텍스트 로딩)나 대화에서 잡은 대상을 밝히고 쓴다.
- feature 문서 내용은 지금 코드와 맞는지 확인하고 쓰며, 확인한 사실·문서에 적힌 이유·추측을 구분한다.

## 표현
- 어려운 용어는 처음 나올 때 풀고, 단계마다 무엇을 왜 하는지 쉬운 말로 적는다.
- 흐름은 코드 블록 안에 실제 함수·파일 이름으로 문자 다이어그램을 그리고, 한글 뒤에는 위아래 줄과 맞춰야 하는 문자를 두지 않는다.
- 동작의 변경 전후와 여러 대상 비교는 표로, 코드의 변경 전후는 `diff` 블록으로 쓴다.

## 출력 구조
넓은 데서 좁은 데로 내려가고, 앞에서 설명한 건 반복하지 않는다.
1. 결론 — 대상이 무엇을 하는지와 사용자에게 주는 영향, 1-2문장.
2. 전체 그림 — 대상이 속한 큰 흐름 다이어그램과 그 안의 대상 위치.
   변경·Task·버그 수정이면 그 앞에 이전 동작, 남아 있던 문제, 이번에 바꾼 것을 적는다.
3. 흐름 — 대표 입력 하나가 진입점부터 반환까지 지나가는 호출 흐름 다이어그램과, 단계마다 무엇을 왜 하는지.
   변경이면 다이어그램에서 달라진 단계를 표시하고, 그 단계에서 왜 이렇게 구현했는지 적는다.
4. 예외와 경계 — 주요 실패 경로, 경계 조건, 실패 시 남는 상태, 기존 기능과의 상호작용.
5. 근거 — 중요한 부분의 짧은 발췌와 `file:line`.
6. 한계 — 얼마나 확실한지, 테스트가 어디까지 보장하는지, 확인 못 한 것.
