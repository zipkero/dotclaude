---
description: >-
  Read-only audit of the global configuration — role boundaries, duplication, unnecessary rules, ambiguity, flow integrity, conformance to current official
  Claude Code documentation, README accuracy, rules that add avoidable work, and verdict rules that reject non-defects — returning edit proposals for approval
argument-hint: "[대상 파일·skill 또는 중점 관점]"
disable-model-invocation: true
disallowed-tools: Write, Edit, NotebookEdit
---

main이 전역 설정(`~/.claude`)의 `git ls-files` 추적 파일(인자가 대상을 지정하면 그 대상과 관련 파일)을 직접 읽고 아래 관점으로 점검한다.
인자가 중점을 말하면 범위는 그대로 두고 그 관점의 발견을 먼저 낸다.
점검하는 턴에는 Bash로도 파일을 고치지 않는다.
모든 관점과 제안하는 after 문장에 우선하는 기준은 사람이 읽기 좋은가가 아니라 그 파일을 읽는 모델(agent `model`, 없으면 main)이 안정적으로 따를 수 있는가다(`README.md`는 7번으로 따로 본다).

## 관점
1. 역할 — 파일이 `description`의 일만 하고, `rules/claude-config-authoring.md`의 역할 분담을 지키며, 필요한 순간에 로드되는 자리에 있는가.
2. 중복 — 함께 로드되는 곳(같은 파일, `CLAUDE.md`와 command·skill, 하네스 시스템 프롬프트)에 같은 뜻이 또 있거나, 여러 파일이 같은 규칙을 다른 말로 적는가.
3. 필요성·충분성 — 아래가 있는가.
   - 지워도 행동이 달라지지 않는 문장(세기만 올린 경고, 늘여 쓴 문장, 모델이 원래 하는 일의 나열)
   - 원 규칙을 고치면 필요 없어지는 방어 단서
   - 완료 조건을 어기는 변경을 못 잡게 하는 규칙
4. 명확성 — 두 가지로 읽히는 표현, 규칙끼리의 충돌, 우선순위나 경계로 엮이지 않았는데 쉼표로 이어 붙인 서로 다른 규칙, 같은 개념을 파일마다 다른 이름으로 부르는 곳이 있는가.
5. 흐름 — 각 단계 산출물만으로 다음 단계를 이어갈 수 있고, `§` 참조가 실제 섹션을 가리키며, 쓰는 쪽과 읽는 쪽의 항목·값이 맞는가.
6. 공식 문서 — 저장소가 쓰는 모델 값·도구·설정 키·frontmatter 필드를 `code.claude.com/docs/en/`의 `skills`·`sub-agents`·`memory` 페이지와 대조하고, `https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md`를 `curl`로 받아 그 이름들이 removed·deprecated·renamed로 나오는지 Grep한다.
7. `README.md` — 실제 동작·파일 구성과 맞는가.
8. 성능 — 결과(요청 범위·완료 조건·검증·테스트 실행)는 그대로 두고 덜어낼 수 있는 멈춤이나 일을 만드는 아래 규칙이 있는가.
   - 위임한 일을 다시 하게 하거나, 정한 결정을 다시 묻게 하거나, 작은 일에 subagent를 띄우게 하는 규칙
   - 산출물(Task·검증 조건·테스트)을 필요한 것보다 늘리거나 필요 없어진 산출물을 남기게 하는 규칙
   - 원칙 대신 닫힌 나열이나 예외 없는 강제(항상·반드시·`~만`)로 판단 범위를 좁히는 규칙
9. 판정 비례성 — 판정 기준이 실제로 생기는 결함이 아닌 표현·형식이나 생길 근거가 없는 입력으로 reject를 만드는가.

제안은 기존 규칙을 고치거나 지우는 쪽으로 낸다.
새 규칙이나 기존 문장에 덧붙이는 조건·예외·괄호는 그것이 없어 생긴 결함에 §출력 형식의 근거가 있을 때만 더한다.

## 정한 결정
점검에서 다시 제안하지 않는, 사용자가 정한 것이다.
- main이 verifier 판정을 다시 확인하는 범위는 따로 정하지 않는다.
- `commit-push`에 기본 브랜치에서 커밋할지 정하는 문장을 두지 않는다 — 커밋할 브랜치는 사용자가 요청에서 정한다.
- 테스트를 세는 단위는 Task·문장이 아니라 SPEC §5 조건이고, 조건 안의 경우와 판단 로직 테스트는 그 위에 더한다 — 문장마다 쓰면 비용이 문장 수만큼 는다.
- implementer는 드러난 경로가 아니라 원인을 고치고 같은 원인이 있는 곳을 모두 찾는다.
- 외부 시스템 응답 원본은 저장소 밖이 아니라 각 프로젝트 main checkout 루트의 `.evidence/`에 둔다.

## 출력 형식
- 발견마다 ID, 관점 번호, 위치, before/after diff, 글자 수 변화를 적고 끝에 합계를 적으며, 승인·적용은 ID로 받는다.
- 한 파일의 발견이 많아 문장 단위 diff로는 정리가 안 되면, 그 파일은 다시 쓴 전문과 빠지는 규칙 목록으로 낸다.
- 바뀌는 파일이나 그 값을 읽는 어느 모델의 행동도 그대로인 `문구`와, 하나라도 달라지는 `동작`으로 나눈다.
- `문구`는 적용을 요청받으면 한꺼번에 적용한다.
- `동작`은 달라지는 점과 근거를 붙여 파일별로 묶어 승인받는다.
- 적용한 뒤에는 바꾼 이름·`§`·값을 Grep으로 다시 찾는다.
- 근거가 없는 발견은 내지 않으며, 근거는 발견 종류마다 아래와 같다.
  - 글만으로 드러나는 결함(1·2·7번, 규칙끼리의 충돌, 없는 `§`, 쓰는 쪽과 읽는 쪽의 값 불일치, 3번 `문구`): 그 `file:line`
  - 6번: 공식 문서 위치
  - 모델이 다르게 읽거나 실행한다는 결함(두 가지로 읽히는 표현, 경로 해석 등)과 3·8·9번 `동작`: 그 문장이 들어간 커밋 이후 세션 기록(`~/.claude/projects/*/*.jsonl`을 Grep)에서 실제로 그렇게 된 사례의 경로와 줄
- 3·8번 `동작`에는 그 규칙이 걸리는 과제를 붙이고, 승인되면 대상 프로젝트의 `git worktree` 사본에서 `claude -p`로 적용 전후 판을 과제마다 2회 이상 돌려 결과가 같은지와 비용(턴·토큰·도구 호출·subagent 수) 측정값을 보고한다.
  `CLAUDE.md`는 `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1`과 `--append-system-prompt-file`로 두 판을 넣고, 따로 넣을 수 없는 변경은 돌리지 않는다.
- 발견이 없으면 확인한 범위를 적는다.
- 사용자가 제안을 기각하거나 이유를 들어 고르거나 승인하지 않은 `동작`이 남으면, §정한 결정에 해당하는지 보고 넣을지 묻는다.
