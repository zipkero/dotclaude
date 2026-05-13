---
name: implement
description: "Execute the next Task from docs/<feature-dir>/implement.md. For Per-Request prompts without a feature directory, execute the requested change directly."
---

## 컨텍스트 로딩
1. Phased mode — 다음 둘 중 하나일 때 진입한다.
   - `$ARGUMENTS`가 `docs/<feature-dir>/` 또는 `docs/<feature-dir>/implement.md`와 매치하거나,
   - 현재 대화가 활성 `docs/<feature-dir>/` scope를 가리키는 경우. 이 scope의 정의는 다음과 같다 — 이 대화에서 해당 feature에 대해 `/spec-init` / `/analyze-init` / `/implement-init`이 실행되었거나, 이번 turn에서 사용자가 implement 의도로 해당 feature를 명시적으로 지목한 경우(예: "docs/foo/ 구현 시작", "foo 피처 다음 Task 진행"). 실행 의도 없이 feature 이름이 지나가듯 언급된 것만으로는 Phased mode에 진입하지 않는다.

   동작:
   - implement.md를 읽는다. 없으면 중단하고 사용자에게 `/implement-init`을 실행하도록 안내한다.
   - analysis.md(설계 기준)와 spec.md(완료 조건 매핑)도 함께 읽는다.
   - implement.md 위에서부터 첫 미완료 Task를 잡는다 — 위치가 곧 의존성 순서다(`commands/implement-init.md` §순서). 그 Task의 목적 / 접근 / 검증 조건 필드를 실행 기준으로 삼는다.
2. Per-Request mode — Phased mode의 어느 조건도 만족하지 않을 때 진입한다.
   - `docs/<feature-dir>/`를 만들지 않는다.
   - 요청 범위를 그대로 받아 바로 변경을 적용한다. §비확장 기본 원칙을 따른다.

## 비확장 기본 원칙
요청이 명시적으로 요구하지 않는 한, 구현은 다음을 추가하지 않는다.
- 신규 인터페이스·추상화·public API·경계
- 신규 의존성·설정 항목
- 요청 변경의 정합성을 위해 필요한 범위를 넘는 인접 코드 리팩터링

이 중 어느 것이라도 요청 충족에 필요해 보이면, 코드를 쓰지 말고 사용자에게 먼저 의견을 묻는다. 사용자가 명시적으로 허용한 경우에만 진행한다. 조용히 확장하지 않으며, 사용자에게 `/spec-init`로 전환하라고 안내하지도 않는다 — 사용자가 slash command를 호출하지 않은 것 자체가 Per-Request 선택이다.

또한 현재 Task(Per-Request에서는 사용자 요청) 범위 밖에서 발견한 문제(기존 버그, 잘못된 주석, dead code 등)는 같은 turn에서 수정하지 않고 §출력 구조의 비고·한계 항목에 보고만 한다.

## 미결정 분석 시 중단
analysis.md §5에 미해결 Decision Point("미해결" 정의는 `commands/implement-init.md` §전제 조건)가 있고 그것이 현재 Task에 영향을 준다면, 코드를 쓰지 말고 사용자에게 결정을 먼저 묻는다. 부분 산출물을 임시로 저장하지 않으며, 결정 후 작업을 재개한다.

## 출력 구조
main에 반환하는 보고는 다음을 포함한다. 해당 항목이 없으면 생략한다.
1. Code or logic — 변경의 요지. 코드 블록 재게시는 하지 않으며, diff/Edit 결과로 갈음한다.
2. Key points — 실행한 Task 식별자(Phased: `task-<nnn>` 제목, Per-Request: 사용자 요청 인용)와 핵심 변경점.
3. Files touched — 수정한 경로의 명시적 목록. 다음 `verify` 호출의 diff 범위로 사용되며, 변경이 verify 전에 commit되었을 때 특히 유용하다.
4. 비고·한계 — 범위 밖 발견 사항이나 검증 한계가 있을 때만.

## 완료
- Phased mode: implement.md 체크박스를 수정하지 않는다. 체크박스 전환은 verify가 `approved`를 반환한 뒤 main이 수행한다 (`skills/verify/SKILL.md` §verify 후처리). 다음 단계로 `verify`를 권고한다.
- Per-Request mode: 문서를 갱신하지 않는다.

## 테스트 코드 작성
테스트 룰(테스트 Task로 인정되는 조건, implement가 테스트를 작성하는 범위, 버그 수정 예외, Per-Request 처리, 누락 보고)은 verify skill이 단독으로 소유한다 — `skills/verify/SKILL.md` §테스트 규칙을 따른다. 여기서 중복 기술하지 않는다.

## 지침
- 기존 컨벤션을 따른다 — 같은 디렉토리 기존 파일의 명명·구조·에러 처리 패턴에 맞춘다.
  - lint·format 설정이 있으면 그 설정을 우선한다.
  - 불확실하면 같은 종류의 가장 최근 수정된 파일을 참조로 삼는다.
