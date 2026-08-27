# .claude

Claude Code의 개인 설정 저장소.

> 전역 행동 룰과 소유권 지정은 CLAUDE.md에, 각 phase의 절차는 해당 command·skill 파일에 둔다.
> 이 README는 구조와 설계 의도만 설명한다.

## 설계 의도

### 이 구조가 존재하는 이유
- 이 설정은 작업을 **검증 경계**로 쪼개어, 각 단위의 완료를 근거로 판정하고 그 판정을 문서에 남긴다.
  목적은 모델이 한 번에 처리하는 능력을 보완하는 것이 아니라, 세션을 넘어 재개할 수 있고 제3자가 나중에 확인할 수 있는 기록을 만드는 것이다.
- `features/<feature-dir>/` 아래의 feature별 문서(`spec.md` → `design.md` → `implement.md` + `README.md`)는 구현 메모가 아니라 **phase 사이를 잇는
  기준 문서** 역할을 한다. 다음 phase는 대화 맥락이 아니라 앞 phase가 남긴 문서를 읽는다. (`<feature-dir>` 형식은 `commands/spec-init.md` §산출 경로
  참고)
- `implement` → `verify` → 체크박스 전환은 명시적인 판단 단계다. 산출물을 근거로 한 판단을 거친 Task만 완료로 기록된다.
  Phased 밖에서 쓰는 진행 추적자의 체크박스는 이 판정을 거치지 않으므로 완료 기록이 아니라 진행 표시다
  (구분은 CLAUDE.md §agent·skill 라우팅이 소유한다).

### 핵심 설계 결정
- **phase 단위 작업은 agent에 맡긴다**: 산출물을 만들며 읽은 입력과 설계 추론이 main 컨텍스트에 쌓이지 않도록 떼어놓고, main은 기록된 결과 문서만
  읽어 검토한다. `/design-init`·`/implement-init`이 그 자리이고, `/project-init`·`/spec-init`은 main이 직접 쓴다. 위임 대상은
  CLAUDE.md §agent·skill 라우팅과 위임하는 command 파일의 §실행 주체가 나눠 소유하며, 각 agent 정의는 아래 §agents/에 있다.
- **`analyze` skill은 독립 디버깅 도구이지 앞단 phase가 아니다**: 기존 프로젝트의 Phased 작업은 `/spec-init`로 바로 들어가며, 디버깅 조사는 어디서든
  `analyze` skill로 부른다(정의는 `skills/analyze/SKILL.md`).
- **verify reject는 기본적으로 사용자 판단에 맡긴다**: 재시도를 자동으로 돌리는 자리는 사용자가 직접 부르는 `/implement-loop` 하나뿐이다.
  정책은 `skills/verify/SKILL.md` §verify 후처리가, 루프의 재시도 한도는 `commands/implement-loop.md` §재시도가, 정지 조건은 같은 파일 §정지 조건이
  소유한다.
  verify skill은 reject를 분류해 다음 단계 결정을 돕는다(분류 정의는 `skills/verify/SKILL.md` §reject 분류).
- **feature별 폴더 구조**: 산출물 구성은 `commands/spec-init.md` §산출 경로가 소유하고, verify 판단 이후의 체크박스·README 전환은
  `skills/verify/SKILL.md` §verify 후처리가 소유한다.
- **SPEC이 완료 조건의 소유자, DESIGN은 설계 전용**: `spec.md` §5는 요구사항 수준의 완료 조건을, `design.md`는 설계 판단을,
  `implement.md`는 Task-level 검증 조건과 `spec.md` §5 매핑을 가진다. 각 문서의 섹션 구성은 해당 command 파일이 소유한다.
- **문서 정정 방식은 문서 종류로 갈린다**: `spec.md`·`design.md`는 섹션끼리 전제를 공유하므로 부분 수정하지 않고 `/spec-init`·`/design-init`으로
  전문을 다시 쓴다. `implement.md`와 feature `README.md`는 Task ID와 체크박스 항목을 지우면 안 되므로 main이 영향받은 자리만 고친다
  (CLAUDE.md §문서 구조).
- **Phased 흐름은 사용자가 통제한다**: `/spec-init` → `/design-init` → `/implement-init`은 slash command이고, `implement`와 `verify`는 자연어로
  부른다. 진행 시점은 사용자가 정한다.

## 흐름

흐름은 두 가지다. 시작 시점만 여기 요약하고, 선택 기준·넘겨주기는 CLAUDE.md §phase 제어 / §agent·skill 라우팅에,
verify 후처리(체크박스·README 상태 전환, reject 처리)는 `skills/verify/SKILL.md` §verify 후처리에 둔다.

- **Phased**: `prompt → /spec-init → /design-init → /implement-init → implement → verify`. 문서 phase 시작 시점은 사용자가 직접 정하고,
  구현과 검증 전체를 명시 요청한 경우에만 implement → verify가 이어서 진행된다(CLAUDE.md §phase 제어).
  마지막 `implement → verify` 사이클을 한 Task씩 부르는 대신 `/implement-loop`로 남은 Task를 이어서 돌릴 수도 있다.
  프로젝트 문서가 아직 없는 새 프로젝트는 앞에 `/project-init`을 한 번 두고, 거기서 나온 마일스톤별 작업 후보를 `/spec-init`의 인자로 넘긴다.
- **Per-Request**: `prompt → implement`. slash command 없이 자연어 prompt만으로 시작한다.
  `verify`는 판정 보고가 따로 필요할 때 부르는 선택 단계이고, 결과는 대화에만 남는다(CLAUDE.md §phase 제어).

`analyze` skill은 두 흐름 어느 쪽에서도 부를 수 있다 (정의는 `skills/analyze/SKILL.md`).

## 구조

```
CLAUDE.md          # 전역 행동 룰 + 소유권 지정 (응답·언어·작업 분배·정책·문서 구조)
```

### agents/ — phase 위임 정의

각 agent는 main에서 phase 작업을 받아 처리하고 결과를 main에 돌려준다. 반환 계약은 각 agent 파일 또는 그 파일이 가리키는 skill이 소유한다.

- `analyzer` — `/design-init`·`/implement-init` 실행. 계획 산출물(`design.md`, `implement.md`)을 직접 기록하고 main에는 검토용 요약만 돌려준다.
  승인 전 확인에 남은 질문, 미해결 Decision Point, 미매핑 SPEC §5처럼 기록을 막는 지점을 찾으면 기록하지 않고 목록만 돌려준다.
  feature `README.md`와 코드는 고치지 않는다.
- `implementer` — Phased mode에서 `implement` skill 호출. 코드 변경을 맡는다. `implement.md` 체크박스는 직접 건드리지 않으며, verify가 `approved`로
  판단한 뒤에만 main이 바꾼다. (Per-Request mode는 main이 `implement` skill을 직접 부르므로 이 agent를 거치지 않는다.)
- `verifier` — 위임된 `verify` 판단만 돌려주며, 어떤 문서·체크박스·코드도 고치지 않는다 (뒤이은 전환은 §verify 후처리 소관). 위임 기준은
  `skills/verify/SKILL.md` §verifier 위임 기준이 소유한다.

### commands/ — slash command 정의

Phased 흐름 command는 `features/<feature-dir>/` 아래에 산출물을 쓰고 feature `README.md`의 상태를 갱신한다 (기록 주체는 CLAUDE.md §agent·skill
라우팅과 위임하는 command 파일의 §실행 주체 참고). 그 앞에 오는 `project-init`만 프로젝트 루트 문서와 `docs/` 문서를 쓴다.

문서 phase command 넷과 `implement-loop`, `config-review`는 frontmatter `disable-model-invocation: true`를 두어 사용자가 직접 부를 때만
실행된다. `/spec-init`·`/design-init`·`/implement-init`은 위 §핵심 설계 결정의 "Phased 흐름은 사용자가 통제한다"를, `/project-init`은 자기
머리말이 정한 "최초 1회"를, `implement-loop`은 CLAUDE.md §agent·skill 라우팅의 "사용자가 직접 부를 때만 실행된다"를 설정으로 집행하고,
`config-review`는 자기 머리말이 정한 "의식적으로 호출한다"를 집행한다.
나머지 meta command는 자연어 호출을 허용한다.

읽기 전용으로 선언한 `context-restore`·`cross-analyze`는 frontmatter `disallowed-tools`로 쓰기 도구를 뺀다
(`rules/claude-config-authoring.md`). 제약은 다음 사용자 메시지에서 풀리며, Bash 경로와 `cross-analyze`가 띄우는 subagent의
도구 풀은 이 설정으로 막히지 않으므로 본문 경계로 남는다.

- `project-init.md` — 프로젝트 루트에 `README.md`·`ROADMAP.md`·`docs/product.md`·`docs/design.md` 넷을 만든다
  (`/project-init [프로젝트명 또는 한 줄 설명]`). 최종 결과물·서비스 완료 기준·마일스톤·작업 후보를 잡는다.
  이 중 하나라도 이미 있으면 아무 파일도 쓰지 않는다. 이후 갱신은 사용자가 관리하며, feature 완료 시
  `skills/verify/SKILL.md` §verify 후처리가 갱신 후보만 보고한다.
- `spec-init.md` — `spec.md`를 쓰고 feature `README.md`를 초기화한다 (`/spec-init <feature-name>`). `<feature-dir>` 이름은 이 command가 자동으로
  만든다.
- `design-init.md` — `spec.md`로부터 `design.md`를 만든다 (`/design-init <feature-dir>`)
- `implement-init.md` — `design.md`로부터 `implement.md`를 만든다 (`/implement-init <feature-dir>`)
- `implement-loop.md` — `implement.md`의 남은 Task를 `implement` → `verify` → 체크박스로 연속 실행한다 (`/implement-loop <feature-dir>`).
  구현·판단 규칙은 각 skill 소관이고, 이 command는 반복·재시도·정지 조건만 소유한다.
  구현 수정만으로 통과시킬 수 없다고 판정되면 문서를 고치지 않고 멈춰 사용자에게 올린다.

Meta command (Phased 흐름과 독립):

- `config-review.md` — 전역설정을 점검한다 (`/config-review`). 역할 프롬프트가 충분한지, 책임 경계가 겹치지 않는지, phase·세션 흐름이 끊기지 않는지,
  규칙끼리 어긋나지 않는지, 공식 권고와 어긋나지 않는지, README가 맞는지, 컨텍스트를 얼마나 쓰는지, 줄일 곳이 있는지를 사용자가 직접 부를 때 본다.
  요청 없이는 고치지 않는다 (부류별 적용 조건은 그 파일 §출력 형식).
- `cross-analyze.md` — 같은 분석 질문을 N개 agent에 같은 프롬프트로 따로 분석시키고 main이 교차검증해 합의·불일치를 보고한다
  (`/cross-analyze [N] <질문>`). 읽기 전용이다.
- `context-save.md` — 지금 설계·전달 작업이 어디까지 왔는지를 프로젝트 루트 `CONTEXT.md`에 저장해 세션을 이어받을 시작점을 만든다 (`/context-save`).
  `CONTEXT.md`만 고치고, 기준 문서가 없으면 요청 범위·변경 파일·검증 결과를 기준으로 적는다.
- `context-restore.md` — `CONTEXT.md`에서 작업 맥락을 되살리고 원본·Phased 문서와 작업 트리에 대조한다 (`/context-restore`). 읽기 전용이며 보고에서
  멈춘다. 다음 작업은 사용자의 별도 요청과 CLAUDE.md §phase 제어를 따른다.

### skills/ — skill 정의

- `analyze` — 독립 디버깅·코드 이해·설계 선택지 비교 도구. 증상·질문에서 원인을 찾고, 설계 방향 요청에는 선택지를 비교해 추천안 하나로 수렴한다.
  파일을 쓰지 않고 대화로만 출력한다.
  같은 턴 안에서 다른 작업에 이어 불릴 수 있어 `disallowed-tools`를 걸지 않고 본문 경계로만 막는다(`rules/claude-config-authoring.md`).
- `implement` — Phased에서는 `implement.md`의 다음 Task를 실행하고, Per-Request에서는 산출물 없이 변경을 한다. 다음 `verify` 호출이 분명한 변경
  범위를 가질 수 있도록 고친 파일 목록을 함께 출력한다. 주석을 언제 남기고 고치는지는 이 skill이 소유하고(§주석),
  주석 언어는 CLAUDE.md §언어가, 언어별 doc comment 관례는 각 `rules/` 파일이 소유한다.
- `verify` — 직전 implement Task가 spec.md 완료 조건과 implement.md 검증 조건을 채웠는지 판단한다. 판단만 대화로 돌려주며, implement.md 체크박스
  전환은 main이 `skills/verify/SKILL.md` §verify 후처리에 따라 한다. 테스트 관련 룰은 영역별로 나눠서 소유한다 — 테스트 Task 포함 시점은
  `commands/implement-init.md` §테스트 Task 포함 기준, implement가 테스트 코드를 쓰는 조건은 `skills/implement/SKILL.md` §테스트 코드 작성, 유효한
  테스트 근거 기준은 `skills/verify/SKILL.md` §테스트 evidence 규칙.

### rules/ — 파일 경로로 걸리는 작업 기준

frontmatter `paths`에 매치되는 파일을 읽을 때만 컨텍스트에 들어온다. 항상 로드되는 CLAUDE.md와 달리 그 파일 종류를 만질 때만 비용을 낸다.

매칭은 **작업 디렉토리 트리 안의 파일**에만 걸린다. 바깥 경로의 파일을 읽을 때는 로드되지 않으므로, 저장소 밖 코드를 다룰 때는 필요한 룰을 직접 읽어야
한다 (공식 문서가 보장하는 범위가 아니라 이 환경에서 확인한 동작).
`paths` 대신 `globs`를 쓰면 범위 지정 필드로 인식되지 않아 세션 시작 시 무조건 로드된다 (v2.1.220 확인).

- `code-common.md` — go·csharp·js·ts·python·kotlin 공통 기준 (공개 API 변경 영향, 결함으로 이어지는 경계).
- `go.md` / `csharp.md` / `javascript-typescript.md` — 언어별 기준. 각 파일이 자기 언어의 소유자이며 별도 라우팅 문서를 두지 않는다.
- `claude-config-authoring.md` — Claude Code 설정 파일(agent·command·skill)을 쓸 때의 frontmatter·본문 작성 기준.

## 운영

- `.gitignore`는 추적 파일에 대해 허용 목록 방식을 쓴다. `features/` 산출물은 로컬 작업물이며 추적하지 않는다.
- 세션 데이터, 캐시, credential은 추적에서 뺀다.
- 인코딩·줄바꿈은 `.editorconfig`, LF 정규화는 `.gitattributes`가 소유한다.
- `settings.json`은 기계에 묶인 값 때문에 추적하지 않는다 —
  `statusLine`의 Windows exe 경로, `hooks`가 부르는 `conhost.exe`·`%USERPROFILE%` 절대경로, plugin marketplace 캐시 경로.
- 응답 길이와 preamble 생략은 내장 output style `Concise`가 담당한다.
  `CLAUDE.md` §응답은 언어·톤·설명 깊이와, 근거/추정 구분·주장 범위·참조 표기·before/after 표기처럼 output style이 다루지 않는 보고 규칙을 소유한다.
  `outputStyle`은 설정 파일에 있어 추적되지 않으므로 기계마다 한 번 지정한다.
