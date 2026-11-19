---
description: >-
  Read-only audit of the global configuration — role boundaries, duplication, unnecessary rules, ambiguity, flow integrity, conformance to current official
  Claude Code documentation, README accuracy, rules that add avoidable work, verdict rules that reject non-defects, and violated rules that a deterministic mechanism could enforce — returning edit proposals for approval
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
   - 완료 조건을 어긴 변경이 걸리지 않고 통과하게 만드는 규칙
4. 명확성 — 아래가 있는가.
   - 두 가지로 읽히는 표현(부정이 걸리는 범위, 대상과 멀리 떨어진 부정어, 대신 할 행동 없는 금지 포함)
   - 이중 부정, 우선순위 없이 겹치는 예외
   - 규칙끼리나 한 문장 안 절끼리의 충돌
   - 따로 따를 수 있는 지시를 한 문장에 이어 붙여 뒤쪽 지시나 단서가 묻히는 곳
   - 같은 개념을 파일마다 다른 이름으로 부르는 곳
   - 명사구를 쌓거나 영어 구조를 옮겨, 무엇을 하라는지 한 번에 읽히지 않는 문장
5. 흐름 — 각 단계 산출물만으로 다음 단계를 이어갈 수 있고, `§` 참조가 실제 섹션을 가리키며, 쓰는 쪽과 읽는 쪽의 항목·값이 맞는가.
6. 공식 문서 — 저장소가 쓰는 모델 값·도구·설정 키·frontmatter 필드·hook 입력과 종료 코드·CLI 플래그·환경 변수를 `code.claude.com/docs/en/`의 `skills`·`sub-agents`·`memory`·`hooks`·`cli-reference`·`env-vars` 페이지와 대조하고, `https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md`를 `curl`로 받아 그 이름들이 removed·deprecated·renamed로 나오는지 Grep한다.
7. `README.md` — 실제 동작·파일 구성과 맞는가.
8. 성능 — 덜어내도 결과(요청 범위·완료 조건·검증·테스트 실행)가 그대로인 멈춤이나 일을 만드는 아래 규칙이 있는가.
   - 위임한 일을 다시 하게 하거나, 정한 결정을 다시 묻게 하거나, 작은 일에 subagent를 띄우게 하는 규칙
   - 산출물(Task·검증 조건·테스트)을 필요한 것보다 늘리거나 필요 없어진 산출물을 남기게 하는 규칙
   - 원칙 대신 닫힌 나열이나 예외 없는 강제(항상·반드시·`~만`)로 판단 범위를 좁히는 규칙
9. 판정 비례성 — 판정 기준이 실제로 생기는 결함이 아닌 표현·형식이나 생길 근거가 없는 입력으로 reject를 만드는가.
10. 결정적 승격 — 실제로 어긴, 글로 적힌 규칙 중 frontmatter(`disallowedTools`·`hooks` 등), `hooks/` 스크립트, `verify` skill §reject 분류로 막을 수 있는 것이 있는가.
    있으면 after는 그 장치로 내고, 막는 조건과 놓치는 경우를 적으며, 원래 문장은 놓치는 경우가 없을 때만 지운다.

제안은 `rules/claude-config-authoring.md`대로 원인인 규칙을 고치는 안으로 내고, after도 2·3·4·5·8번으로 다시 점검한다.
새 규칙은 원인인 규칙을 고쳐서는 결함을 없애지 못하고 §출력 형식의 근거가 있을 때만 더한다.

## 정한 결정
점검에서 다시 제안하지 않는, 사용자가 정한 것이다.
- main이 verifier 판정을 다시 확인하는 범위는 따로 정하지 않는다.
- `commit-push`에 기본 브랜치에서 커밋할지 정하는 문장을 두지 않는다 — 커밋할 브랜치는 사용자가 요청에서 정한다.
- 테스트를 세는 단위는 Task·문장이 아니라 SPEC §5 조건이고, 조건 안의 경우와 판단 로직 테스트는 그 위에 더한다 — 문장마다 쓰면 비용이 문장 수만큼 는다.
- implementer는 증상이 보인 곳을 막는 대신 원인을 고치며, 같은 원인이 있는 곳을 모두 찾는다.
- 외부 시스템 응답 원본은 저장소 밖이 아니라 각 프로젝트 main checkout 루트의 `.evidence/`에 둔다.
- 관점 4의 이중 부정·우선순위 없이 겹치는 예외 점검은 세션 사례 없이 둔다.

## 출력 형식
- 발견마다 ID, 관점 번호, 위치, before/after diff, 글자 수 변화를 적고 끝에 합계를 적으며, 승인·적용은 ID로 받는다.
- 한 파일의 발견이 많아 문장 단위 diff로는 정리가 안 되면, 그 파일은 다시 쓴 전문과 빠지는 규칙 목록으로 낸다.
- 발견은 `문구`와 `동작`으로 나눈다: 바뀌는 파일이나 그 값을 읽는 모델 중 어느 것의 행동도 달라지지 않으면 `문구`, 하나라도 달라지면 `동작`이다.
- `문구` after는 before의 조건·범위·주어와 `만`·`아니라`, 하나라도/전부 같은 수량 표현이 그대로인지 문장마다 대조한다.
- `문구`는 적용을 요청받으면 한꺼번에 적용한다.
- `동작`은 달라지는 점과 근거를 붙여 파일별로 묶어 승인받는다.
- 적용한 뒤에는 바꾼 이름·`§`·값을 Grep으로 다시 찾는다.
- 근거가 없는 발견은 내지 않으며, 근거는 발견 종류마다 아래와 같다.
  - 글만으로 드러나는 결함(1·2·7번, 규칙끼리나 한 문장 안 절끼리의 충돌, 이중 부정, 우선순위 없이 겹치는 예외, 없는 `§`, 쓰는 쪽과 읽는 쪽의 값 불일치, 3번 `문구`, 4번 번역투 `문구`): 그 `file:line`(하네스 중복이면 겹치는 하네스 문장 인용)
  - 6번: 공식 문서 위치
  - 3·8번 `동작` 중 규칙을 지우는 제안: 지워도 요청 범위·완료 조건·검증·테스트 실행이 그대로임을 보이는 `file:line`
  - 모델이 다르게 읽거나 실행한다는 결함(두 가지로 읽히는 표현, 이어 붙여 묻히는 지시, 같은 개념의 다른 이름, 경로 해석 등)과 규칙을 지우는 제안이 아닌 3·8번 `동작`, 9·10번 `동작`: 그 문장이 들어간 커밋 이후 세션 기록(`~/.claude/projects/*/*.jsonl`을 Grep)에서 실제로 그렇게 된 사례의 경로와 줄, 그 문장이 걸린 세션이 없으면 승인받은 뒤 그 문장이 걸리는 과제를 §측정 방법으로 돌려 그렇게 된 출력
- 3·8번과 hook이 아닌 10번 `동작`에는 그 규칙이 걸리는 과제를 붙이고, 승인되면 §측정 방법으로 적용 전후 판을 과제마다 2회 이상 돌려 결과가 같은지와 비용(턴·토큰·도구 호출·subagent 수) 측정값을 보고한다.
- 10번 hook은 세션 기록의 어긴 호출과 같은 도구의 정상 호출을 hook 입력 JSON으로 stdin에 넣어 종료 코드(어긴 호출 2, 정상 0)를 보고한다.
- 확인한 범위와, 그 문장이 걸린 세션이 없어 내지 않은 후보(위치, 의심하는 읽기, 걸리는 과제)를 적는다.
- 사용자가 제안을 기각하거나 이유를 들어 고르거나 승인하지 않은 `동작`이 남으면, §정한 결정에 해당하는지 보고 넣을지 묻는다.

## 측정 방법
판은 이 세션의 `~/.claude`가 섞이지 않도록 `~/.claude/tools/measure/`로 Docker 컨테이너에서 돌린다.
0. 기계마다 한 번 `claude setup-token`으로 받은 토큰을 `~/.config/claude/review-token`에 저장한다.
1. 이미지 `cr-measure`가 없거나 이 세션의 `claude --version`과 다르면 `docker build --build-arg CLAUDE_VERSION=<버전> -t cr-measure ~/.claude/tools/measure`로 만든다.
2. `sh prep.sh <git-ref|WORKTREE> <폴더>`로 적용 전·후 설정 사본을 만든다.
3. 과제와 판마다 `MODEL=<이 세션의 main 모델> sh run.sh <설정 사본> <대상 프로젝트 저장소> <판 폴더> "<과제>"`를 돌리고, 사용자 답이 필요한 과제는 같은 판 폴더로 다시 불러 이어 돌린다.
4. `python3 summarize.py <판 폴더>...`(Windows는 `python`)로 측정값을 내고, `CLAUDE.md loaded: False`인 판은 버리고 원인을 고친 뒤 다시 돌린다.

컨테이너에는 hook·플러그인이 없고 Windows에서만 생기는 동작(PowerShell 도구, Git Bash hook, Windows 경로)도 생기지 않으므로, 그 동작에 걸리는 발견은 측정하지 않았다고 적는다.
판 폴더는 보고한 뒤 지운다.
