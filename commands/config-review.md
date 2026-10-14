---
description: >-
  Audit the global configuration — role boundaries, duplication, defensive rules, ambiguity, flow integrity, conformance to current official
  Claude Code documentation, and README accuracy
argument-hint: "[대상 파일 또는 skill]"
disable-model-invocation: true
---

전역 설정(`~/.claude`)을 다시 읽고 §관점대로 점검한다.

## 범위
- main이 `git ls-files`의 추적 파일을 모두 직접 읽는다.
- 사용자가 대상을 지정하면 그 대상과 판단에 필요한 파일만 읽는다.
- 기준은 그 파일을 읽는 모델이 안정적으로 따를 수 있는가다.
  agent에 `model`이 있으면 그 모델, 없으면 main 모델이 기준이다.
  여러 쪽이 읽는 파일은 그중 가장 약한 모델이 기준이다.

## 관점
1. 역할
   - 파일이 `description`에 적힌 일만 하는가.
   - `rules/claude-config-authoring.md`의 역할 분담을 지키는가.
   - 다른 파일이 정한 기준이나, 결정·파일 수정·상태 변경 권한을 가져다 쓰지 않는가.
   - 필요한 순간에 로드되는 자리에 있는가. 파일 종류 기준은 `rules/`, 흐름 기준은 해당 command·skill, 늘 필요한 기준은 `CLAUDE.md`다.
2. 중복 — 함께 로드되는 곳(같은 파일, `CLAUDE.md`와 command·skill, 하네스 시스템 프롬프트)에 같은 뜻이 다른 표현으로 또 있는가.
3. 방어 문장 — 규칙이 잘못 작동할까 봐 붙인 단서, 세게 말하기만 한 경고, 한 가지 뜻을 늘여 쓴 문장, 모델이 원래 하는 일을 절차로 나열한 것.
   원래 규칙의 표현 때문에 생긴 문제면 그 규칙을 고치고 단서를 지우는 제안을, 아니면 삭제 제안을 낸다.
4. 명확성 — 두 가지로 읽혀 결과가 달라지는 표현, 규칙끼리의 충돌.
5. 흐름 — 각 단계의 산출물만으로 다음 단계나 끊긴 세션을 이어갈 수 있는가.
   - 위임 관계와 `§` 참조가 실제로 있는 섹션을 가리키는가.
   - 어디서도 부르지 않는 command·skill·agent가 있는가.
   - 쓰는 쪽과 읽는 쪽의 항목·값·이름이 맞는가.
   - 아무도 읽지 않는 항목, 정의되지 않은 값, 읽는 쪽에 필요 없는 형식 규칙이 있는가.
6. 공식 문서 — Claude Code가 바뀌어서 더 이상 맞지 않는 모델 값, 도구, 설정 키, frontmatter 필드, 하네스 기본값 전제가 남아 있는가.
   `code.claude.com/docs`와 `github.com/anthropics/claude-code`의 CHANGELOG를 WebFetch로 직접 가져와 근거로 쓴다.
   못 가져왔으면 그렇다고만 적는다.
7. `README.md` — 실제 동작과 맞는가. 없어진 기능이 남았거나, 새 파일이 빠졌거나, 링크가 깨졌는가.

제안은 기존 규칙을 고치거나 지우는 쪽으로 낸다.
새 규칙은 이 환경에서 실제로 문제가 생겼을 때만 더한다.

## 출력 형식
- 발견마다 관점 번호, 위치(파일·섹션), before/after diff, 줄 수 변화를 적는다.
- 끝에 전체 줄 수 변화 합계를 적는다.
- 발견은 `문구`(동작은 그대로)와 `동작`(행동이 달라짐)으로 나눈다.
  다른 파일이 읽고 분기하는 단어·값·필드 이름을 바꾸면 `동작`이다.
- `문구`는 적용을 요청받으면 한꺼번에 적용한다.
- `동작`은 무엇이 달라지는지 한두 줄 붙이고, 사용자 승인을 받은 뒤 적용한다.
- 발견이 없으면 확인한 범위를 적는다.
