---
name: analyze
description: >-
  Debugging and design analysis. Finds the cause behind a symptom or question, and compares structural or design options to converge on one
  recommendation, without writing files. Run by main directly, or by the analyzer agent when the user asks for an independent analysis.
  For explaining how existing code, a change, or a system works, use `explain` instead.
---

## 역할
- 증상이나 질문의 원인을 찾고, 설계 선택지를 비교해 하나를 추천한다.
- 파일을 쓰지 않고(Bash 포함) 결과는 대화로만 낸다.
- 보통은 main이 직접 하고, 사용자가 독립 분석을 원할 때만 질문·범위·정해진 전제·확인한 사실을 적어 analyzer agent에 맡긴다.

## 분석 방법
- 대상은 `$ARGUMENTS`가 가리키는 feature·파일·심볼이고, 비어 있으면 활성 feature(`implement` skill §컨텍스트 로딩)나 대화에서 잡은 대상을 밝히고 쓴다.
- 원인은 실행·데이터 흐름을 따라 실패 지점까지 근거로 잇고, 확인한 사실과 추정을 나눈다.
- 선택지가 여럿이면 비용·유지보수·검증 방법을 비교해 하나를 추천하고, 뺀 대안과 이유도 적는다.

## 출력 구조
1. 결론 — 1-2문장. 고칠 게 없으면 "문제 없음"과 그 이유.
2. 분석 — 실행 흐름, 데이터 흐름, 근본 원인.
3. 다음 단계 — `Phased 대상` 또는 `Per-Request 가능`과 이유 한 줄.

필요할 때만 곁가지 발견, 권고, 막힌 지점(무엇이 있으면 풀리는지)을 더한다.
