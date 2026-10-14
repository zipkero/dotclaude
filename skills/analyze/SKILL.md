---
name: analyze
description: >-
  Debugging and design analysis. Finds the cause behind a symptom or question, and compares structural or design options to converge on one
  recommendation, without writing files. Run by main directly, or by the analyzer agent when the user asks for an independent analysis.
  For explaining how existing code, a change, or a system works, use `explain` instead.
---

## 역할
- 증상이나 질문의 원인을 찾고, 설계 선택지를 비교해 하나를 추천한다.
- 파일을 쓰지 않는다.
  Bash로도 쓰지 않는다.
- 결과는 대화로만 낸다.
- `/design-init`·`/implement-init`에서 analyzer가 하는 설계 판단도 이 방법을 따른다.
  산출물 형식은 그 command가 정한다.

## 컨텍스트 로딩
- `$ARGUMENTS`가 `features/<feature-dir>/`나 그 아래 파일이면 그 feature로 범위를 좁힌다.
  spec.md·design.md·implement.md 중 필요한 부분만 읽는다.
- 파일이나 심볼이면 그 대상과 주변 코드를 읽는다.
- 비어 있으면 활성 feature(`implement` skill §컨텍스트 로딩)를 대상으로 한다.
  활성 feature가 없으면 대화에서 대상을 잡고, 무엇으로 잡았는지 밝힌다.

## 분석 방법
- 원인은 실행·데이터 흐름을 따라 실패 지점까지 근거로 잇는다.
- 확인한 사실과 추정을 나눈다.
- 선택지가 여럿이면 비용, 유지보수, 검증 방법을 비교해 하나를 추천한다.
- 뺀 대안과 이유도 적는다.
- 보안·성능 같은 일반 점검 항목은 이 프로젝트에서 실제로 확인한 것만 적는다.

## analyzer 위임 기준
- 보통은 main이 직접 분석한다.
- 사용자가 독립 분석을 원할 때만 analyzer agent에 맡긴다.
- 맡길 때는 질문, 범위, 이미 정해진 전제, 이미 확인한 사실을 적는다.

## 출력 구조
1. 결론 — 1-2문장. 고칠 게 없으면 "문제 없음"과 무엇을 봤는지, 왜 괜찮은지.
2. 분석 — 실행 흐름, 데이터 흐름, 근본 원인. 상태 변화나 실패 지점은 관련 있을 때만 쓴다.

필요할 때만 더한다.
- 목적·문제 — 사용자가 "왜"를 물었을 때.
- 곁가지 발견 — 질문 밖에서 눈에 띈 것.
- 권고 — 답하는 데 필요할 때.
- 다음 단계 — 구현으로 이어질 것 같으면 `Phased 대상` 또는 `Per-Request 가능`과 이유 한 줄. 기준은 CLAUDE.md §phase 제어다.
- 막힌 지점 — 대상을 정할 수 없거나, 지금 제약으로는 불가능하거나, 사용자 결정이나 외부 정보가 있어야 결론이 날 때. 무엇을 봤는지, 무엇이 있으면 풀리는지 적고 멈춘다.
