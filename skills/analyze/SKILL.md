---
name: analyze
description: >-
  Standalone debugging, code-comprehension, and design-option utility. Explains causes and structures behind a symptom or question, and compares
  structural or design options before any spec work, without writing files.
---

## 역할
그때그때 하는 조사 도구이며 phase가 아니다. 파일을 쓰지 않고 출력은 대화로만 나간다.
실행 주체는 main이며 subagent에 맡기지 않는다.

`/design-init`과는 다르다. 이 skill은 독립 디버깅·코드 이해·설계 선택지 비교용이며, `/design-init`은 `design.md`를 쓰는 Phased 설계 phase다.
Phased 흐름의 진행 순서는 CLAUDE.md §phase 제어가 소유한다.

## 컨텍스트 로딩
1. `$ARGUMENTS`가 `features/<feature-dir>/` 또는 그 아래 파일과 매치하면 → feature mode. 분석 범위를 이 feature로 한정하고,
   spec.md·design.md·implement.md 중 질문에 필요한 부분만 읽는다.
2. `$ARGUMENTS`가 특정 파일·심볼을 가리키면 → 그 대상을 분석하고 필요한 만큼 주변 맥락을 함께 읽는다.
3. `$ARGUMENTS`가 비어 있으면 다음과 같이 한다.
   - 활성 `features/<feature-dir>/` 범위가 있으면 (1)처럼 읽는다. 활성 범위의 뜻은 `implement` skill §컨텍스트 로딩과 같되, "implement 뜻"을 "분석
     뜻"으로 읽는다.
   - 그 외에는 대화 맥락으로 분석하며, 맥락에 충분한 단서(에러 메시지, 파일 경로, 증상)가 있을 때 가정을 밝히고 진행한다.

## 출력 구조
필수:
1. 결론 — 1-2 문장. 조사 결과 할 일이 없을 때는 "문제 없음"도 유효한 결론이며, 무엇을 조사했고 왜 손댈 필요가 없는지를 함께 적는다. 분석을
   정당화하려고 걱정거리를 지어내지 않는다.
2. 실행 흐름 / 데이터 흐름 / 근본 원인 — 핵심 분석.

상황별 (해당할 때만 넣는다):
3. 목적·문제 — 요청에 "왜"가 들어 있을 때.
4. 곁가지 발견 — 본 질문 밖에서 눈에 띈 것이 있을 때.
5. 권고 — 사용자 요청에 답하는 데 필요할 때만 둔다. 구조·설계 방향을 묻는 요청에서 조사로 좁혀진 선택지가 둘 이상이면, 각 선택지의 대가·유지보수
   영향·검증 방법을 비교한 뒤 추천안 하나로 수렴하고 배제한 대안과 그 이유를 남긴다.
6. 다음 단계 분류 — 사용자의 구현 뜻이 보이고 분석 결과가 구현 범위에 영향을 줄 때만 둔다.
   `Phased 대상` 또는 `Per-Request 가능`과 한 줄 사유를 적는다. 판정 기준은 CLAUDE.md §phase 제어가 소유한다.
7. 막힌 지점 — 사유를 적고 멈춘다. 세 가지다.
   - `scope undefined`: 주어진 맥락을 조사한 뒤에도 대상 시스템·영역을 정할 수 없다.
   - `infeasible`: 지금 제약으로는 구현이 불가능하다. 소스에서 가져온 구체적인 근거가 필요하다.
   - `needs input`: 사용자 결정이나 외부 정보 없이는 분석이 결론에 이르지 못한다.

   모든 막힌 지점은 다음을 담는다.
   - 근거: 무엇을 조사했고(파일·로그·에러) 무엇을 찾았는지.
   - 푸는 조건: 막힌 것을 푸는 구체적인 정보·결정·변경.

## 지침
- 추상적인 설명이 아니라 실제 동작에 근거해 설명한다.
- 상태 변화·실패 지점은 관련 있을 때만 넣는다.
- 막힌 지점은 관련 소스(파일·로그·에러 흐름)를 읽은 뒤에만 선언한다.
- 일반 점검 항목(보안·성능·규정·SLO·계약)은 이 프로젝트의 코드·spec에서 확인한 것만 보고에 넣는다.
