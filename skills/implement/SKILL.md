---
name: implement
description: "Execute the next Task from docs/<feature-name>/implement.md. For Per-Request prompts without a feature directory, execute the requested change directly."
---

## Context Loading
1. Phased mode — 다음 둘 중 하나일 때 진입한다.
   - `$ARGUMENTS`가 `docs/<feature-name>/` 또는 `docs/<feature-name>/implement.md`와 매치하거나,
   - 현재 대화가 활성 `docs/<feature-name>/` scope를 가리키는 경우. 이 scope의 정의는 다음과 같다 — 이 대화에서 해당 feature에 대해 `/spec-init` / `/analyze-init` / `/implement-init`이 실행되었거나, 이번 turn에서 사용자가 implement 의도로 해당 feature를 명시적으로 지목한 경우(예: "docs/foo/ 구현 시작", "foo 피처 다음 Task 진행"). 실행 의도 없이 feature 이름이 지나가듯 언급된 것만으로는 Phased mode에 진입하지 않는다.

   동작:
   - implement.md를 읽는다. 없으면 중단하고 사용자에게 `/implement-init`을 실행하도록 안내한다.
   - analysis.md(설계 기준)와 spec.md(완료 조건 매핑)도 함께 읽는다.
   - 의존성이 충족된 첫 미완료 Task를 찾는다. 그 Task의 목적 / 접근 / 검증 조건 필드를 실행 기준으로 삼는다.
2. Per-Request mode — Phased mode의 어느 조건도 만족하지 않을 때 진입한다.
   - `docs/<feature>/`를 만들지 않는다.
   - 요청 범위를 그대로 받아 바로 변경을 적용한다. 아래 Non-expansion baseline을 따른다.

## Non-expansion baseline
요청이 명시적으로 요구하지 않는 한, 구현은 다음을 추가하지 않는다.
- 신규 인터페이스·추상화·public API·경계
- 신규 의존성·설정 항목
- 요청 변경의 정합성을 위해 필요한 범위를 넘는 인접 코드 리팩터링

이 중 어느 것이라도 요청 충족에 필요해 보이면, 코드를 쓰지 말고 사용자에게 먼저 의견을 묻는다. 사용자가 명시적으로 허용한 경우에만 진행한다. 조용히 확장하지 않으며, 사용자에게 `/spec-init`로 전환하라고 안내하지도 않는다 — 사용자가 slash command를 호출하지 않은 것 자체가 Per-Request 선택이다.

## Output Structure
1. Code or logic
2. Key points
3. Files touched — 수정한 경로의 명시적 목록. 다음 `verify` 호출의 diff 범위로 사용되며, 변경이 verify 전에 commit되었을 때 특히 유용하다.
4. Notes or limitations (있으면)

## Completion
- Phased mode: implement.md 체크박스를 수정하지 않는다 (체크박스 전환은 verify-gated이며 CLAUDE.md §Verify Handoff에 따른다). 실행한 Task를 식별하는 짧은 요약을 반환하고, 다음 `implement` 호출 전에 이 Task를 verify하도록 권고한다 — 미검증 Task는 `[ ]`로 남으며 다음 implement 트리거가 같은 Task를 다시 잡는다.
- Per-Request mode: 문서를 갱신하지 않는다.

## Test Code Authoring
테스트 룰(테스트 Task로 인정되는 조건, 버그 수정 예외, Per-Request 처리, 누락 보고)은 verify skill이 단독으로 소유한다 — `skills/verify/SKILL.md` §Test Rules에서 본다. 여기서 중복 기술하지 않는다.

implement는 그 룰에 따른 테스트 Task에 한해서만 테스트 코드를 작성한다.

## Guidelines
- 구현은 최소한으로, 범위 안에서 한다.
- 기존 컨벤션을 따른다 — 같은 디렉토리 기존 파일의 명명·구조·에러 처리 패턴에 맞춘다.
  - lint·format 설정이 있으면 그 설정을 우선한다.
  - 불확실하면 같은 종류의 가장 최근 수정된 파일을 참조로 삼는다.
- 필요할 때만 짧게 설명한다.
