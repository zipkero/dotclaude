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
- 한 질문을 N개 agent가 같은 프롬프트로 따로 분석하고, main이 교차검증해 하나의 결론으로 합친다.
- agent도 main도 파일을 고치지 않고(Bash 포함), 결과는 대화로만 낸다.

## 절차
1. 맨 앞이 정수면 N(3~5, 범위 밖이면 가까운 값으로 맞추고 알린다), 없으면 N=3이고, 대상이 비어 있으면 대화의 최근 미해결 질문을 잡아 알린다.
2. 질문, 꼭 답할 하위 질문, 핵심 파일 절대경로와 아래 규칙을 담은 프롬프트 하나를 모든 agent에게 똑같이 준다.
   - 코드를 직접 읽고 모든 주장에 `file:line`을 붙인다.
   - 파일을 고치지 않는다.
   - 결론을 한 줄로 먼저 쓰고, 확인한 사실과 추정을 나눈다.
3. `general-purpose` subagent N개를 한 메시지에서 동시에 띄운다.
4. 결과가 모이면 갈린 곳과 한 agent만 짚은 발견만 main이 직접 열어 확인한다.

## 출력 구조
````markdown
# <대상> — N개 agent 교차검증

## 결론
- 핵심 답과 동의한 agent 수(`M/N`), 전원 합의가 아니면 "불일치 있음".

## 합의 사항
- 여러 agent가 같은 근거로 닿은 결론과 `file:line`.

## 불일치와 판정
- 갈린 지점과, 직접 확인한 `file:line` 기준으로 어느 쪽이 맞는지. 없으면 "없음".

## 단독 발견
- 한 agent만 짚었지만 근거가 확인된 것.

## 남은 추정과 다음 단계
- 확정하지 못한 것과 확정하려면 필요한 것, 사용자 결정이 필요한 지점.
````
