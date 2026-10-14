---
description: >-
  Launch N (3-5, default 3) independent agents that each analyze the SAME question with an identical prompt, then main cross-verifies their reports and returns a
  consensus/disagreement summary. Read-only — no files are written. Use when the user wants a rigorous, high-confidence analysis of a code/behavior
  question and explicitly wants multiple agents cross-checked (e.g. "3개 에이전트로 각각 분석해서 교차검증해줘").
argument-hint: "[N(3~5)] <질문>"
disallowed-tools: Write, Edit, NotebookEdit
---

Scope: $ARGUMENTS

## 역할
- 한 질문을 N개 agent가 같은 프롬프트로 따로 분석하고, main이 결과를 교차검증해 하나의 결론으로 합친다.
- 결과는 대화로만 낸다.
- agent도 main도 파일을 만들거나 고치지 않는다.
  Bash로도 마찬가지다.

## 인자 처리
- 맨 앞이 정수면 N, 나머지가 분석 대상이다.
  정수가 없으면 N=3이다.
- N은 3~5다.
  범위 밖이면 가까운 값으로 맞추고, 시작 전에 요청값과 실제 N을 알린다.
- 대상이 비어 있으면 대화에서 가장 최근의 풀리지 않은 질문을 잡고 시작 전에 알린다.
  분명하지 않으면 묻는다.

## 절차
1. 프롬프트 하나를 쓰고, 모든 agent에게 글자 하나 다르지 않게 똑같이 준다.
   프롬프트에는 질문, 꼭 답할 하위 질문, 아는 범위의 핵심 파일·심볼 절대경로, 아래 규칙을 넣는다.
   - 코드를 직접 읽고 모든 주장에 `file:line`을 붙인다.
   - 파일을 고치지 않는다.
   - 결론을 한 줄로 먼저 쓰고, 사용자 결정이 필요한 지점은 남긴다.
   - 확인한 사실과 추정을 나눈다.
2. `general-purpose` subagent N개를 한 메시지에서 동시에 띄운다(각각 별도 Agent 호출).
3. 모두 돌아오면 §출력 구조대로 교차검증한다.
   - main은 의견이 갈린 곳, 한 agent만 짚은 발견, 추정을 사실로 올릴 때 필요한 곳만 직접 연다.
   - agent가 지정 파일을 못 찾았거나 다른 파일로 대신했으면 그 한계를 적는다.

## 출력 구조
````markdown
# <대상> — N개 agent 교차검증

## 결론
- 핵심 답과 동의한 agent 수(`M/N`). 전원 합의가 아니면 "불일치 있음"을 같이 적는다.

## 합의 사항
- 여러 agent가 같은 근거로 닿은 결론과 `file:line`, 동의한 agent 수.

## 불일치와 판정
- 갈린 지점, 각 주장, 직접 확인한 `file:line` 기준으로 어느 쪽 근거가 강한지. 없으면 "없음".

## 단독 발견
- 한 agent만 짚었지만 근거가 확인된 것. 없으면 뺀다.

## 확인된 사실 vs 남은 추정
- 사실: agent별 사실·추정을 합쳐 다시 나눈 것. 한 agent의 추정을 다른 agent가 `file:line`으로 확인했으면 사실로 올린다.
- 추정/미확인: 확정하지 못한 이유와 확정하려면 필요한 것.

## 남은 질문 / 다음 단계
- 사용자 결정이 필요한 지점, 또는 더 열어 봐야 할 대상.
````
