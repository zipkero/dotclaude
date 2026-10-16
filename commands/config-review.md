---
description: >-
  Audit the global configuration — role boundaries, duplication, unnecessary rules, ambiguity, flow integrity, conformance to current official
  Claude Code documentation, and README accuracy
argument-hint: "[대상 파일 또는 skill]"
disable-model-invocation: true
disallowed-tools: Write, Edit, NotebookEdit
---

전역 설정(`~/.claude`)의 `git ls-files` 추적 파일(사용자가 대상을 지정하면 그 대상과 관련 파일)을 main이 직접 읽고(Bash로도 고치지 않는다) 아래 관점으로 점검한다.
기준은 그 파일을 읽는 모델(agent `model`, 없으면 main)이 안정적으로 따를 수 있는가다.
기존 규칙도 점검 대상이며, 남길 이유가 보이지 않으면 지우는 쪽으로 제안한다.

## 관점
1. 역할 — 파일이 `description`의 일만 하고, `rules/claude-config-authoring.md`의 역할 분담을 지키며, 필요한 순간에 로드되는 자리에 있는가.
2. 중복 — 함께 로드되는 곳(같은 파일, `CLAUDE.md`와 command·skill, 하네스 시스템 프롬프트)에 같은 뜻이 또 있는가.
3. 필요성 — 지워도 행동이 달라지지 않는 문장(방어 단서, 세기만 올린 경고, 늘여 쓴 문장, 모델이 원래 하는 일의 나열)과, 매번 읽히지만 드문 경우에만 쓰이는 규칙이 있는가.
4. 명확성 — 두 가지로 읽히는 표현이나 규칙끼리의 충돌이 있는가.
5. 흐름 — 각 단계 산출물만으로 다음 단계를 이어갈 수 있고, `§` 참조가 실제 섹션을 가리키며, 쓰는 쪽과 읽는 쪽의 항목·값이 맞는가.
6. 공식 문서 — `code.claude.com/docs`와 `github.com/anthropics/claude-code` CHANGELOG를 WebFetch로 가져와, 낡은 모델 값·도구·설정 키·frontmatter 필드가 있는지 본다(못 가져왔으면 그렇다고 적는다).
7. `README.md` — 실제 동작·파일 구성과 맞는가.

제안은 기존 규칙을 고치거나 지우는 쪽으로 내고, 새 규칙은 이 환경에서 실제로 문제가 생겼을 때만 더한다.

## 출력 형식
- 발견마다 관점 번호, 위치, before/after diff, 줄 수 변화를 적고 끝에 합계를 적는다.
- 한 파일의 발견이 많아 문장 단위 diff로는 정리가 안 되면, 그 파일은 다시 쓴 전문과 빠지는 규칙 목록으로 낸다.
- 동작이 그대로인 `문구`와 행동이 달라지는 `동작`(다른 파일이 읽는 값·이름 변경 포함)으로 나눈다.
- `문구`는 적용을 요청받으면 한꺼번에 적용하고, `동작`은 달라지는 점을 붙여 파일별로 묶어 승인받는다.
- 발견이 없으면 확인한 범위를 적는다.
