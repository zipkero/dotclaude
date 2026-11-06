---
description: >-
  Run N (3-5, default 3) independent agents on the same question and cross-verify their reports into a read-only consensus summary.
  Use only when the user explicitly asks for multiple agents cross-checked (e.g. "3개 에이전트로 각각 분석해서 교차검증해줘").
argument-hint: "[N(3~5)] <질문>"
disallowed-tools: Write, Edit, NotebookEdit
---

Scope: $ARGUMENTS

## 역할
- 한 질문을 N개 agent가 같은 프롬프트로 따로 분석하고, main이 교차검증해 하나의 결론으로 합친다.
- main은 파일을 고치지 않는다(Bash 포함).

## 절차
1. 맨 앞이 정수면 N(3~5, 범위 밖이면 가까운 값으로 맞추고 알린다), 없으면 N=3이고, 대상이 비어 있으면 대화의 최근 미해결 질문을 잡아 알린다.
2. 질문, 꼭 답할 하위 질문, 핵심 파일 절대경로와 아래 규칙을 담은 프롬프트 하나를 모든 agent에게 똑같이 준다.
   - 사용자의 목적과 이미 정한 결정을 적고, 결정을 바꿔야 할 사실은 결함이 아니라 사용자 결정 사항으로 적게 한다.
   - 주장마다 직접 읽은 `file:line`이나 직접 돌린 명령·조회와 그 결과를 붙인다.
   - 파일과 데이터를 바꾸지 않는다(Bash 포함).
   - 결론을 한 줄로 먼저 쓰고, 확인한 사실과 추정을 나누며, 추정에는 확인할 방법을 붙인다.
   - 질문의 답이나 다음 행동을 바꾸지 않는 지적은 쓰지 않는다.
3. `general-purpose` subagent N개를 띄운다.
4. 결과가 모이면 `file:line`이나 실행 결과로 합의한 주장은 직접 확인을 갈음하고, 추정으로 합의한 주장·갈린 곳·한 agent만 짚은 발견은 main이 직접 열거나 돌려서 확인한다.

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
- 확정하지 못한 것과 확정하려면 필요한 것, 정한 결정과 충돌하는 사실을 포함한 사용자 결정이 필요한 지점.
````
