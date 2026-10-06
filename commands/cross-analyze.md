---
description: >-
  Launch N (3-5, default 3) independent agents that each analyze the SAME question with an identical prompt, then main cross-verifies their reports and returns a
  consensus/disagreement summary. Read-only — no files are written. Use when the user wants a rigorous, high-confidence analysis of a code/behavior
  question and explicitly wants multiple agents cross-checked (e.g. "3개 에이전트로 각각 분석해서 교차검증해줘").
argument-hint: "[N(3~5)] <질문>"
disallowed-tools: Write, Edit, NotebookEdit
---

> 사용 시점: 결론의 신뢰도가 중요해 여러 agent에게 같은 질문을 독립적으로 풀게 하고, main이 그 결과를 교차검증해 합의·불일치를 가려내고 싶을 때. 단일 관점으로 충분하면 자연어 `analyze`를 쓴다.

Scope: $ARGUMENTS

## 역할
- 한 분석 질문을 N개 agent가 같은 프롬프트로 독립 분석하고, main이 보고를 교차검증해 하나의 결론으로 합친다.
- 결과는 대화에만 남으며, agent도 main도 Bash를 포함해 파일을 만들거나 고치지 않는다.
- agent마다 각도를 나누고 싶은 요청은 이 command가 아니라 개별 지시로 처리한다.

## 인자 처리
- 맨 앞 토큰이 정수면 N 후보로, 나머지를 분석 대상으로 본다(예: `/cross-analyze 5 <질문>`). 정수가 없으면 N=3이다.
- N은 3~5이며, 밖이면 가까운 한계값으로 맞추고 착수 전에 요청값과 실제 N을 한 줄로 알린다.
- 대상이 비어 있으면 대화에서 가장 최근에 논의된 미해결 분석 질문을 잡아 착수 전에 한 줄로 알리고, 분명하지 않으면 묻는다.

## 절차
1. 분석 질문, 반드시 답할 하위 질문, 아는 범위의 핵심 파일·심볼 절대경로, 아래 고정 규칙을 담은 프롬프트 하나를 쓰고 모든 agent에게 문구까지 똑같이 준다.
   - 코드를 직접 읽고 모든 주장에 `file:line` 근거를 붙인다.
   - 파일을 수정하지 않는다(읽기 전용).
   - 결론을 한 줄로 먼저 제시하고 근거를 단다.
   - 사용자 결정이 필요한 지점을 발견하면 보고에 남긴다.
2. `general-purpose` subagent N개를 한 메시지에서 동시에 띄운다(각각 별도 Agent 호출).
3. 모두 돌아오면 교차검증한다.
   main은 불일치 판정과 단독 발견·추정 승격에 필요한 자리만 직접 연다.
   - 합의 — 다수가 같은 근거(가능하면 같은 `file:line`)로 닿은 결론. 동의한 agent 수를 적는다.
   - 불일치 — 숨기지 않고, 누가 무엇을 다르게 말했는지와 직접 확인한 `file:line` 기준으로 어느 쪽 근거가 강한지 적는다.
   - 단독 발견 — 한 agent만 짚었어도 근거가 확인되면 채택하고 "단독 발견"으로 표기한다.
   - 사실/추정 — agent별 사실·추정을 합쳐 다시 가르고, 한 agent의 추정을 다른 agent가 `file:line`으로 확인했으면 사실로 올린다.
   - agent가 지정 파일을 못 찾았거나 다른 파일로 대신했으면 그 한계를 보고에 적는다.
4. 아래 구조로 보고한다.
   결론을 받은 뒤 구현으로 이어갈지는 사용자가 정한다.

## 출력 구조
````markdown
# <대상> — N개 agent 교차검증

## 결론 (한 줄 + 신뢰도)
- 핵심 답 + 동의한 agent 수(`M/N`) 표기. 전원 합의가 아니면 "불일치 있음"을 함께 적는다.

## 합의 사항
- 근거 `file:line`과 함께. (동의한 agent 수 표기)

## 불일치와 판정
- 갈린 지점 / 각 주장 / 어느 쪽이 맞는지 + 판정 근거(직접 확인한 `file:line`).
- 불일치가 없으면 "없음"이라고 적는다.

## 단독 발견 (있으면)
- 한 agent만 짚었으나 근거 확인된 것.

## 확인된 사실 vs 남은 추정
- 사실: … (file:line)
- 추정/미확인: … (왜 확정 못 했는지, 확정하려면 무엇이 필요한지)

## 남은 질문 / 다음 단계
- 사용자 결정이 필요한 지점, 또는 추가로 열어봐야 할 대상.
````
