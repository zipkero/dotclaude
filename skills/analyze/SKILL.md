---
name: analyze
description: "Standalone debugging and code comprehension utility. Explains causes, flows, and structures without writing files. Not a pre-phase for /spec-init."
---

## Role
즉석 조사 유틸리티이며 phase가 아니다. 파일을 쓰지 않고 출력은 대화로만 나간다.

`/analyze-init`과는 다르다. 이 skill은 독립 디버깅·코드 이해용이며, `/analyze-init`은 `analysis.md`를 작성하는 Phased 설계 phase다. 이 skill은 pre-phase가 아니므로 Phased 작업은 `/spec-init`로 바로 진입한다.

## Context Loading
1. `$ARGUMENTS`가 `docs/<feature-name>/` 또는 그 하위 파일과 매치하면 → feature mode. 존재하는 spec.md, analysis.md, implement.md를 그 순서로 읽고 분석 범위를 이 feature로 한정한다.
2. `$ARGUMENTS`가 특정 파일·심볼을 가리키면 → 그 대상을 분석하고 필요한 만큼 주변 맥락을 함께 읽는다.
3. `$ARGUMENTS`가 비어 있으면 다음과 같이 처리한다.
   - 활성 `docs/<feature-name>/` scope가 있으면 (1)처럼 로드한다. 활성 scope의 정의는 `implement` skill §Context Loading과 동일하되, "implement 의도"를 "분석 의도"로 읽는다. 대화에 feature 이름이 지나가듯 언급된 것만으로는 진입하지 않는다.
   - 그 외에는 대화 맥락 기반으로 분석하며, 맥락에 충분한 신호(에러 메시지, 파일 경로, 증상)가 있을 때 명시적 가정으로 진행한다.

## Output Structure
필수:
1. Summary — 1-2 문장 결론. 조사 결과 조치 가능한 것이 없을 때는 `No issues found`도 유효한 결론이며, 무엇을 조사했고 왜 조치가 불필요한지를 함께 적는다. 분석을 정당화하기 위해 우려를 지어내지 않는다.
2. Execution flow / data flow / root cause — 핵심 분석.

상황별 (해당 시 포함):
3. Purpose or problem — 요청에 "왜"가 포함될 때.
4. Key observations — 부차 발견이 있을 때.
5. Recommendation — 다음 행동 제안이 필요할 때.
6. Blocker — 사유를 적고 중단한다. 세 종류:
   - `scope undefined`: 가용 맥락을 조사한 뒤에도 대상 시스템·영역을 결정할 수 없다.
   - `infeasible`: 현재 제약상 구현이 불가능하다. 소스에서 가져온 구체적 evidence가 필요하다.
   - `needs input`: 사용자 결정이나 외부 정보 없이는 분석이 수렴하지 못한다.

   모든 Blocker는 다음을 포함한다.
   - Evidence: 무엇을 조사했고(파일·로그·에러) 무엇을 발견했는지.
   - Unblock requires: 차단을 해제할 구체적 정보·결정·변경.

## Guidelines
- 추론·구조·원인에 집중한다.
- 추상화가 아니라 실제 동작에 근거해 설명한다.
- 상태 변화·실패 지점은 관련 있을 때만 포함한다.
- Blocker는 evidence 기반으로만 선언한다. 선언 전에 관련 소스(파일·로그·에러 trace)를 읽으며, 가정만으로 선언하지 않는다.
- 모든 Blocker는 unblock path를 포함한다 — 어떤 정보·결정·변경이 차단을 해제하는지.
- 일반 체크리스트(보안·성능·컴플라이언스·SLO·contract)를 대상에 투사하지 않는다. 각 항목은 보고 전에 이 프로젝트의 코드·spec에 대해 검증해야 하며, 미검증 일반 우려는 출력에 포함하지 않는다.
