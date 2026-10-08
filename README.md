# .claude

Claude Code의 개인 설정 저장소.

> 전역 행동 룰과 소유권 지정은 CLAUDE.md에, 각 phase의 절차는 해당 command·skill 파일에 둔다.
> 이 README는 구조와 설계 의도만 설명한다.

## 설계 의도

### 이 구조가 존재하는 이유
- 이 설정은 작업을 **검증 경계**로 쪼개어, 각 단위의 완료를 근거로 판정하고 그 판정을 문서에 남긴다.
  목적은 모델이 한 번에 처리하는 능력을 보완하는 것이 아니라, 세션을 넘어 재개할 수 있고 제3자가 나중에 확인할 수 있는 기록을 만드는 것이다.
- `features/<feature-dir>/` 아래의 feature별 문서(`spec.md` → `design.md` → `implement.md` + `README.md`)는 구현 메모가 아니라 **phase 사이를 잇는 기준 문서** 역할을 한다.
  다음 phase는 대화 맥락이 아니라 앞 phase가 남긴 문서를 읽는다.
  (`<feature-dir>` 형식은 `commands/spec-init.md` §산출 경로 참고)
- `implement` → `verify` → 체크박스 전환은 명시적인 판단 단계다.
  산출물을 근거로 한 판단을 거친 Task만 완료로 기록된다.
  Phased 밖에서 쓰는 진행 추적자의 체크박스는 이 판정을 거치지 않으므로 완료 기록이 아니라 진행 표시다
  (구분은 CLAUDE.md §phase 제어가 소유한다).

### 핵심 설계 결정
- **skill은 방법, agent는 맥락을 떼어 놓은 실행자, command는 과제별 산출물 형식이다**: `analyze`↔`analyzer`, `implement`↔`implementer`, `verify`↔`verifier`처럼 agent는 `skills:`로 짝 skill을 불러오고, main도 같은 skill을 직접 쓸 수 있다(작성 기준은 `rules/claude-config-authoring.md`).
  agent에 맡기는 이유는 읽은 입력과 추론이 main 컨텍스트에 쌓이지 않게 하는 것이며, main은 돌려받은 결과만 검토한다.
  skill 실행의 위임 기준은 각 skill이, command의 실행 주체는 각 command 파일의 §실행 주체(그 섹션이 없으면 §역할)가 소유한다.
  `/design-init`·`/implement-init`은 analyzer에 맡기고, `/project-init`·`/spec-init`은 main이 직접 쓴다.
- **verify reject는 기본적으로 사용자 판단에 맡긴다**: 재시도를 자동으로 돌리는 자리는 사용자가 직접 부르는 `/implement-loop` 하나뿐이다.
  정책은 `skills/verify/SKILL.md` §verify 후처리가, 루프의 재시도 한도는 `commands/implement-loop.md` §재시도가, 정지 조건은 같은 파일 §정지 조건이 소유한다.
  verify skill은 reject를 분류해 다음 단계 결정을 돕는다(분류 정의는 `skills/verify/SKILL.md` §reject 분류).
- **SPEC이 완료 조건의 소유자, DESIGN은 설계 전용**: `spec.md` §5는 요구사항 수준의 완료 조건을, `design.md`는 설계 판단을,
  `implement.md`는 Task-level 검증 조건과 `spec.md` §5 매핑을 가진다.
  각 문서의 구성은 그 문서를 만드는 command 파일이, 판단 이후의 체크박스·README 전환은 `skills/verify/SKILL.md` §verify 후처리가 소유한다.
- **문서 정정 방식은 문서 종류로 갈린다**: `spec.md`·`design.md`는 하위 문서가 기대는 내용이 바뀌면 `/spec-init`·`/design-init`으로 전문을 다시 쓰고, 그 밖의 정정은 main이 그 자리만 고친다.
  재작성은 영향받는 Task의 승인만 취소한다(`rules/feature-docs.md` §재작성 시 승인 취소).
  `implement.md`와 feature `README.md`는 Task ID와 체크박스 항목을 지우면 안 되므로 main이 영향받은 자리만 고친다.

## 흐름

흐름은 두 가지이며, 고르는 기준과 넘겨주기는 CLAUDE.md §phase 제어·§agent·skill 라우팅이 정한다.

- **Phased**: `prompt → /spec-init → /design-init → /implement-init → implement → verify`. 문서 phase는 slash command, `implement`·`verify`는 자연어로 부르며 시작 시점은 사용자가 정한다.
  implement가 `completed`이면 같은 턴에 verify가 이어지고, 사용자가 구현만 요청하면 verify를 권하고 멈춘다(`skills/implement/SKILL.md` §완료).
  마지막 `implement → verify` 사이클을 한 Task씩 부르는 대신 `/implement-loop`로 남은 Task를 이어서 돌릴 수도 있다.
  프로젝트 문서가 아직 없는 새 프로젝트는 앞에 `/project-init`을 한 번 두고, 거기서 나온 마일스톤별 작업 후보를 `/spec-init`의 인자로 넘기며, 기존 프로젝트는 `/spec-init`로 바로 들어간다.
- **Per-Request**: `prompt → implement`. slash command 없이 자연어 prompt만으로 시작한다.
  `verify`는 판정 보고가 따로 필요할 때 부르는 선택 단계이고, 결과는 대화에만 남는다(`skills/verify/SKILL.md` §역할·§컨텍스트 로딩).

`analyze`·`explain` skill은 phase가 아니며 두 흐름 어느 쪽에서도 부를 수 있다.

## 구조

```
CLAUDE.md          # 전역 행동 룰 + 소유권 지정 (응답·언어·작업 분배·정책·문서 구조)
```

### agents/ — 위임 실행자 정의

각 agent는 main에서 작업을 받아 짝 skill이나 command 절차대로 처리하고 결과를 main에 돌려준다.
반환 계약은 각 agent 파일 또는 그 파일이 가리키는 skill이 소유한다.

- `analyzer` — 분석·설계 위임. `analyze` skill을 불러와, 사용자가 독립 분석을 요청하면 파일 없이 결과만 돌려주고(`skills/analyze/SKILL.md` §analyzer 위임 기준) `/design-init`·`/implement-init`에서는 계획 산출물(`design.md`, `implement.md`)을 직접 기록해 검토용 요약만 돌려준다.
  승인 전 확인에 남은 질문, 미해결 Decision Point, 미매핑 SPEC §5처럼 기록을 막는 지점을 찾으면 기록하지 않고 목록만 돌려준다.
  feature `README.md`와 코드는 고치지 않는다.
- `implementer` — Phased mode에서 `implement` skill 호출. 코드 변경을 맡는다.
  `implement.md` 체크박스는 직접 건드리지 않으며, verify가 `approved`로 판단한 뒤에만 main이 바꾼다.
  (Per-Request mode는 main이 `implement` skill을 직접 부르므로 이 agent를 거치지 않는다.)
- `verifier` — 위임된 `verify` 판단만 돌려주며, 어떤 문서·체크박스·코드도 고치지 않는다 (뒤이은 전환은 §verify 후처리 소관).
  위임 기준은 `skills/verify/SKILL.md` §verifier 위임 기준이 소유한다.

### commands/ — slash command 정의

Phased 흐름 command는 `features/<feature-dir>/` 아래에 산출물을 쓰고 feature `README.md`의 상태를 갱신한다 (기록 주체는 각 command 파일의 §실행 주체 또는 §역할과 `rules/feature-docs.md` 참고).
그 앞에 오는 `project-init`만 프로젝트 루트 문서와 `docs/` 문서를 쓴다.

`project-init`·`implement-loop`·`config-review`는 frontmatter `disable-model-invocation: true`를 두어 사용자가 직접 부를 때만 실행된다.

`/spec-init`·`/design-init`·`/implement-init`은 모델 호출을 열어 두고, 부르는 조건은 CLAUDE.md §phase 제어가 정한다
(명시 요청 또는 "문제 없으면 다음 단계" 같은 조건부 승인이 있을 때만).
나머지 meta command는 자연어 호출을 허용한다.

읽기 전용으로 선언한 `context-restore`·`cross-analyze`는 frontmatter `disallowed-tools`로 쓰기 도구를 뺀다
(`rules/claude-config-authoring.md`).
제약은 다음 사용자 메시지에서 풀리며, Bash 경로와 `cross-analyze`가 띄우는 subagent의 도구 풀은 이 설정으로 막히지 않으므로 본문 경계로 남는다.

- `project-init.md` — 프로젝트 루트에 `README.md`·`ROADMAP.md`·`docs/product.md`·`docs/design.md` 넷을 만든다
  (`/project-init [프로젝트명 또는 한 줄 설명]`). 최종 결과물·서비스 완료 기준·마일스톤·작업 후보를 잡는다.
  이 중 하나라도 이미 있으면 아무 파일도 쓰지 않는다.
  이후 갱신은 사용자가 관리하며, feature 완료 시 `skills/verify/SKILL.md` §verify 후처리가 갱신 후보만 보고한다.
- `spec-init.md` — `spec.md`를 쓰고 feature `README.md`를 초기화한다 (`/spec-init <feature-name>`).
  `<feature-dir>` 이름은 이 command가 자동으로 만든다.
- `design-init.md` — `spec.md`로부터 `design.md`를 만든다 (`/design-init <feature-dir>`)
- `implement-init.md` — `design.md`로부터 `implement.md`를 만든다 (`/implement-init <feature-dir>`)
- `implement-loop.md` — `implement.md`의 남은 Task를 `implement` → `verify` → 체크박스로 연속 실행한다 (`/implement-loop <feature-dir>`).
  구현·판단 규칙은 각 skill 소관이고, 이 command는 반복·재시도·정지 조건만 소유한다.
  근거 부족 reject는 다시 구현하지 않고 근거를 보완해 다시 판단받는다.
  구현 수정만으로 통과시킬 수 없다고 판정되면 문서를 고치지 않고 멈춰 사용자에게 올린다.

Meta command (Phased 흐름과 독립):

- `config-review.md` — 전역설정을 점검한다 (`/config-review`). 역할을 지키고 침범하지 않는지, 중복·방어 지침·모호한 표현이 없는지,
  phase·세션 흐름이 끊기지 않는지, Claude Code 변경으로 무효가 된 설정이 없는지, README가 맞는지를 사용자가 직접 부를 때 본다.
  요청 없이는 고치지 않는다 (부류별 적용 조건은 그 파일 §출력 형식).
- `cross-analyze.md` — 같은 분석 질문을 N개 agent에 같은 프롬프트로 따로 분석시키고 main이 교차검증해 합의·불일치를 보고한다
  (`/cross-analyze [N] <질문>`). 읽기 전용이다.
- `context-save.md` — 지금 설계·전달 작업이 어디까지 왔는지를 프로젝트 루트 `CONTEXT.md`에 저장해 세션을 이어받을 시작점을 만든다 (`/context-save`).
  `CONTEXT.md`만 고치고, 기준 문서가 없으면 요청 범위·변경 파일·검증 결과를 기준으로 적는다.
- `context-restore.md` — `CONTEXT.md`에서 작업 맥락을 되살리고 원본·feature 산출물과 작업 트리에 대조한다 (`/context-restore`).
  읽기 전용이며 보고에서 멈춘다.
  다음 작업은 사용자의 별도 요청과 CLAUDE.md §phase 제어를 따른다.

### skills/ — skill 정의

- `analyze` — 디버깅·설계 선택지 비교 방법. 증상·질문에서 원인을 찾고, 설계 방향 요청에는 선택지를 비교해 추천안 하나로 수렴한다.
  main이 직접 쓰고 사용자가 독립 분석을 요청할 때만 analyzer agent에 맡기며, 분석 결과는 파일 없이 대화로만 낸다.
  같은 턴 안에서 다른 작업에 이어 불릴 수 있어 `disallowed-tools`를 걸지 않고 본문 경계로만 막는다(`rules/claude-config-authoring.md`).
- `explain` — 기존 코드·변경·시스템이 무엇이고 어떻게 작동하는지 근거와 함께 설명한다.
  목적, 흐름, 계약과 가정, 결정, 근거의 한계를 잇는다.
  `analyze`와는 산출물로 갈린다 — 원인 규명·대안 비교는 `analyze`, 기존 동작 이해는 `explain`이며 경계는 두 파일의 `description`이 서로 표시한다.
  대화로만 출력하고 파일은 사용자가 문서화를 따로 요청할 때만 쓰며, `disallowed-tools`를 걸지 않는 이유는 `analyze`와 같다.
- `implement` — Phased에서는 `implement.md`의 다음 Task를 실행하고, Per-Request에서는 산출물 없이 변경을 한다.
  다음 `verify` 호출이 분명한 변경 범위를 가질 수 있도록 고친 파일 목록을 함께 출력한다.
  주석 기준과 주석 언어는 `rules/code-common.md` §주석과 언어별 `rules/` 파일이 소유한다.
- `verify` — 직전 implement Task가 spec.md 완료 조건과 implement.md의 `목적`·검증 조건을 채웠는지 판단한다.
  판단만 대화로 돌려주며, implement.md 체크박스 전환은 main이 `skills/verify/SKILL.md` §verify 후처리에 따라 한다.
  테스트 관련 룰은 영역별로 나눠서 소유한다 — 테스트 Task 포함 시점은 `commands/implement-init.md` §테스트 Task 포함 기준, implement가 테스트 코드를 쓰는 조건은 `skills/implement/SKILL.md` §테스트 코드 작성, 유효한 테스트 근거 기준은 `skills/verify/SKILL.md` §근거 원칙.
- `commit-push` — 이번 작업 파일만 스테이징하고 메시지 템플릿으로 커밋하며, 요청 시 푸시한다 (`/commit-push [제목만]`).
  커밋 요청은 다른 지시에 섞여 자연어로 오므로 `disable-model-invocation`을 걸지 않는다.
  커밋 메시지 규칙은 이 skill이 소유한다.
- `implement-orca` — 한 Task, 연속된 Task 묶음, 또는 Per-Request 변경의 `implement` → `verify`를 로컬 implementer·verifier agent 대신 서로 다른 Codex 워커로 순차 실행한다 (`/implement-orca <대상>`).
  frontmatter `description`이 발동을 사용자의 명시적인 Codex 워커·Orca dispatch 요청으로 좁힌다 —
  손으로 친 자연어 지시에서도 로드되어야 하므로 `disable-model-invocation`을 걸지 않는다.
  절차는 이 파일이 갖지 않는다 — Orca 명령과 코디네이터 절차는 `skills/orchestration/SKILL.md`가 가리키는 버전별 가이드,
  워커 lifecycle(`worker_done`·heartbeat·`ask`)은 Orca가 워커에 주입하는 preamble,
  구현·판단은 워커 쪽 전역 설정과 skill, 판단 이후 기록은 `skills/verify/SKILL.md` §verify 후처리가 소유한다.
  이 파일이 직접 드는 것은 워커 배치와, preamble이 싣지 않는 지시문 두 줄뿐이다.

### rules/ — 파일 경로로 걸리는 작업 기준

frontmatter `paths`에 매치되는 파일을 읽거나 쓸 때만 컨텍스트에 들어온다.
항상 로드되는 CLAUDE.md와 달리 그 파일 종류를 만질 때만 비용을 낸다.

매칭은 **작업 디렉토리 트리 안의 파일**에만 걸린다.
바깥 경로의 파일을 읽을 때는 로드되지 않으므로, 저장소 밖 코드를 다룰 때는 필요한 룰을 직접 읽어야 한다 (공식 문서가 보장하는 범위가 아니라 이 환경에서 확인한 동작).
`paths` 대신 `globs`를 쓰면 범위 지정 필드로 인식되지 않아 세션 시작 시 무조건 로드된다 (v2.1.220 확인).

- `code-common.md` — go·csharp·js·ts·python·kotlin·sql·ps1·sh 공통 기준 (공개 API 변경 영향, 결함으로 이어지는 경계, 주석 기준과 주석 언어).
- `go.md` / `csharp.md` / `javascript-typescript.md` — 언어별 기준. 각 파일이 자기 언어의 소유자이며 별도 라우팅 문서를 두지 않는다.
  python·kotlin은 언어별 파일이 아직 없어 `code-common.md`의 공통 기준만 적용된다.
- `claude-config-authoring.md` — Claude Code 설정 파일(agent·command·skill)을 쓸 때의 기준. skill·agent·command의 역할 분담(§핵심 설계 결정)과 쓰기 도구 제한, 본문 언어와 한 줄 한 문장 같은 frontmatter·본문 작성 기준을 둔다.
- `feature-docs.md` — `features/<feature-dir>/` 문서를 읽거나 쓸 때 걸리는 작업 기준. 산출물 언어와 한 줄 한 문장, 문서 정정 방식, spec → design → implement 반영 순서,
  진행 상태(체크박스·상태판)의 main 소유, 재작성 시 승인 취소를 둔다.
  Phased 밖의 대화에는 로드되지 않는다.

## 출력 형식 계약

이 설정이 만드는 작업 문서와 Phased 보고는 다른 도구가 읽는 형식이다.
아래 자리의 문구는 다듬어도 되지만, 표지 단어·값·위치·이름을 바꾸면 동작 변경으로 다룬다.

- 작업 문서 첫 줄 표시 `<!-- prowl-workflow: v1 -->` — `commands/spec-init.md`(spec.md 규칙, README 템플릿), `commands/design-init.md`, `commands/implement-init.md`, `commands/project-init.md`(ROADMAP 템플릿).
- 작업 문서 형식 — feature 폴더 이름과 feature `README.md` `## 상태`의 SPEC·DESIGN·IMPLEMENT 체크박스, `spec.md` §5 번호 항목(`commands/spec-init.md`), `design.md` 절 번호(`commands/design-init.md`), `implement.md` Task 줄·필드 이름(`최근 reject`·`승인 근거` 포함)·참조 형식(`commands/implement-init.md`), `ROADMAP.md` 마일스톤과 작업 후보(`commands/project-init.md`).
- `skills/verify/SKILL.md` §출력 구조·§reject 분류 — 첫 줄 표시, 판정 값, 대상 Task의 `task-<nnn>`, 완료되는 요구사항 줄 형식, 분류 네 값, `해소 조건` 항목.
- `skills/implement/SKILL.md` §출력 구조 — 첫 줄 표시, 상태 값, 핵심의 `task-<nnn>`.
- `commands/implement-loop.md` — §실행 주체의 verify 담당(verifier agent), §재시도의 근거 부족 재검증 규칙, §정지 조건의 조건별 정지 사유 값, §정지·완료 보고의 첫 줄 표시와 멈춘 자리의 `task-<nnn>`·`정지 사유`·`해소 조건`.
- 요청 종류를 가리는 이름 — skill `implement`·`verify`, command `implement-loop`, agent `implementer`·`verifier`.

## 운영

- `.gitignore`는 추적 파일에 대해 허용 목록 방식을 쓴다.
  `features/` 산출물은 로컬 작업물이며 추적하지 않는다.
- 세션 데이터, 캐시, credential은 추적에서 뺀다.
- 인코딩·줄바꿈은 `.editorconfig`, LF 정규화는 `.gitattributes`가 소유한다.
- `settings.json`은 기계에 묶인 값 때문에 추적하지 않는다 —
  `statusLine`·`hooks`가 부르는 스크립트의 절대경로, plugin marketplace 캐시 경로.
- 응답 길이·설명 깊이·preamble 생략은 내장 output style `Concise`가 담당하며, `CLAUDE.md`는 이를 다시 적지 않는다.
  `CLAUDE.md` §응답은 근거/추정 구분·주장 범위·참조 표기·before/after 표기처럼 output style이 다루지 않는 보고 규칙을 소유한다.
  `outputStyle`은 설정 파일에 있어 추적되지 않으므로 기계마다 한 번 지정한다.
