---
name: analyze
description: >-
  Standalone debugging and design-option utility. Finds the cause behind a symptom or question, and compares structural or design options
  before any spec work, without writing files. For explaining how existing code, a change, or a system works, use `explain` instead.
---

## 역할
그때그때 하는 조사 도구이며 phase가 아니다. main이 직접 실행하고, 파일을 쓰지 않으며 출력은 대화로만 나간다.

## 컨텍스트 로딩
- `$ARGUMENTS`가 `features/<feature-dir>/`나 그 아래 파일이면 분석 범위를 그 feature로 좁히고, spec.md·design.md·implement.md 중 질문에 필요한 부분만 읽는다.
- 특정 파일·심볼이면 그 대상과 필요한 주변 맥락을 읽는다.
- 비어 있으면 활성 feature 범위(`implement` skill §컨텍스트 로딩의 정의를 "분석 뜻"으로 읽는다)를 쓰고, 없으면 대화 맥락의 단서(에러 메시지, 파일 경로, 증상)로 가정을 밝히고 진행한다.

## 출력 구조
1. 결론 — 1-2문장. 할 일이 없으면 "문제 없음"과 무엇을 조사했고 왜 손댈 필요가 없는지.
2. 실행 흐름 / 데이터 흐름 / 근본 원인 — 핵심 분석. 상태 변화·실패 지점은 관련 있을 때만.

해당할 때만 더한다.
- 목적·문제 — 요청에 "왜"가 들어 있을 때.
- 곁가지 발견 — 본 질문 밖에서 눈에 띈 것.
- 권고 — 요청에 답하는 데 필요할 때. 구조·설계 방향 요청에서 선택지가 둘 이상이면 대가·유지보수 영향·검증 방법을 비교해 추천안 하나로 수렴하고, 배제한 대안과 이유를 남긴다.
- 다음 단계 분류 — 구현 뜻이 보이고 분석이 구현 범위에 영향을 줄 때 `Phased 대상` 또는 `Per-Request 가능`과 한 줄 사유(기준은 CLAUDE.md §phase 제어).
- 막힌 지점 — `scope undefined`(조사 뒤에도 대상 시스템·영역을 정할 수 없음) / `infeasible`(지금 제약으로 구현 불가, 소스 근거 필요) / `needs input`(사용자 결정·외부 정보 없이는 결론 불가). 무엇을 조사해 무엇을 찾았는지와 푸는 조건을 함께 적고 멈춘다.

보안·성능·규정 같은 일반 점검 항목은 이 프로젝트의 코드·spec에서 확인한 것만 넣는다.
