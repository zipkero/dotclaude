---
name: analyze
description: >-
  Debugging and design analysis. Finds the cause behind a symptom or question, and compares structural or design options to converge on one
  recommendation, without writing files. Run by main directly, or by the analyzer agent when the user asks for an independent analysis.
  For explaining how existing code, a change, or a system works, use `explain` instead.
---

## 역할
- 증상이나 질문의 원인을 찾고, 설계 선택지를 비교해 하나로 정한다.
- 분석 요청에서는 파일을 고치지 않는다(Bash 포함).

## 분석 방법
- 대상은 `$ARGUMENTS`가 가리키는 feature·파일·심볼이고, 비어 있으면 활성 feature(`~/.claude/skills/implement/SKILL.md` §컨텍스트 로딩)나 대화에서 다루던 대상으로 정하고, 무엇으로 정했는지 밝힌다.
- 원인은 실행·데이터 흐름을 따라가며 실패 지점까지 단계마다 근거를 붙인다.
- 선택지가 여럿이면 이 질문에서 실제로 차이가 나는 기준으로 비교해 하나로 정하고, 버린 대안과 이유를 적는다.
- 정한 안 중 사용자가 대가(지연·장애 시 동작·비용 등)를 감수해야 하는 것만 다음 단계에서 받아들일지 묻는다.

## 출력 구조
1. 결론 — 1-2문장
   고칠 게 없으면 "문제 없음"과 그 이유.
2. 분석 — 원인이면 실행·데이터 흐름과 근본 원인, 선택지 비교면 기준별 비교.
3. 다음 단계 — 결론이 "문제 없음"이 아니면 `Phased 대상` 또는 `Per-Request 가능`과 이유 한 줄.

필요할 때만 곁가지 발견, 권고, 막힌 지점(무엇이 있으면 풀리는지)을 더한다.
