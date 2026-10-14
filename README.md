# .claude

Claude Code 개인 설정 저장소.

> 늘 지키는 규칙은 CLAUDE.md에, 단계별 절차는 각 command·skill 파일에 둔다.
> 이 README는 구조와 설계 의도만 설명한다.

## 설계 의도

### 왜 이렇게 나눴나
- 작업을 검증할 수 있는 단위로 쪼개고, 단위마다 근거를 보고 완료를 판정한 뒤 그 결과를 문서에 남긴다.
- 목적은 세션이 바뀌어도 이어서 할 수 있고, 나중에 다른 사람이 확인할 수 있는 기록을 만드는 것이다.
- `features/<feature-dir>/` 아래 문서(`spec.md` → `design.md` → `implement.md` + `README.md`)는 단계 사이를 잇는 기준 문서다.
  다음 단계는 대화가 아니라 앞 단계가 남긴 문서를 읽는다.
- `implement` → `verify` → 체크박스 바꾸기는 따로 떨어진 판단 단계다.
  verify가 근거를 보고 승인한 Task만 완료로 기록된다.

### 주요 결정
- **skill은 방법, agent는 따로 떼어 맡기는 실행자, command는 산출물 형식이다.**
  agent는 `skills:`로 짝 skill을 불러오고(`analyze`↔`analyzer`, `implement`↔`implementer`, `verify`↔`verifier`), main도 같은 skill을 직접 쓸 수 있다.
  agent에 맡기는 이유는 읽은 파일과 추론이 main 컨텍스트에 쌓이지 않게 하려는 것이다.
  작성 기준은 `rules/claude-config-authoring.md`에 있다.
- **verify reject는 기본적으로 사용자가 판단한다.**
  자동 재시도는 사용자가 직접 부르는 `/implement-loop`와, 명시 요청으로만 도는 `implement-orca`에서만 한다.
  reject 뒤 처리는 `skills/verify/SKILL.md` §verify 후처리, 재시도 한도와 정지 조건은 `commands/implement-loop.md`가 정한다.
- **완료 조건은 spec.md가, 설계는 design.md가 갖는다.**
  `implement.md`는 Task별 검증 조건과 `spec.md` §5 매핑을 갖는다.
- **문서 고치는 방식은 문서마다 다르다.**
  `spec.md`·`design.md`는 다음 문서가 기대는 내용이 바뀌면 command로 전체를 다시 쓰고, 영향받는 Task의 승인만 취소한다(`rules/feature-docs.md`).
  `implement.md`와 feature `README.md`는 Task ID와 체크박스를 지키기 위해 main이 필요한 부분만 고친다.

## 흐름

두 가지 방식이 있고, 고르는 기준은 CLAUDE.md §phase 제어에 있다.

- **Phased**: `prompt → /spec-init → /design-init → /implement-init → implement → verify`
  - 문서 단계는 slash command로, `implement`·`verify`는 자연어로 부른다.
  - implement가 `completed`면 같은 턴에 verify가 이어진다.
    구현만 요청하면 verify를 권하고 멈춘다.
  - 마지막 `implement → verify`는 한 Task씩 부르거나 `/implement-loop`로 이어서 돌린다.
  - 프로젝트 문서가 없는 새 프로젝트는 먼저 `/project-init`을 한 번 돌리고, 거기서 나온 작업 후보를 `/spec-init`에 넘긴다.
- **Per-Request**: `prompt → implement`
  - slash command 없이 자연어로 시작한다.
  - `verify`는 판정이 따로 필요할 때만 부르고, 결과는 대화에만 남는다.

`analyze`·`explain`은 어느 방식에서든 부를 수 있다.

## 구조

```
CLAUDE.md          # 늘 지키는 규칙 (응답, 언어, 범위, 사전 확인, phase 제어, agent·skill 사용)
```

### agents/ — 일을 맡는 실행자

main에게 일을 받아 짝 skill이나 command 절차대로 처리하고 결과를 돌려준다.

- `analyzer` — 분석과 설계 문서 작성.
  사용자가 독립 분석을 원하면 파일 없이 결과만 돌려준다.
  `/design-init`·`/implement-init`에서는 `design.md`·`implement.md`를 직접 쓰고 요약만 돌려준다.
  답 안 된 질문, 정해지지 않은 Decision Point, 매핑 안 된 완료 조건처럼 진행을 막는 게 있으면 쓰지 않고 목록을 돌려준다.
  feature `README.md`와 코드는 고치지 않는다.
- `implementer` — Phased에서 `implement` skill로 코드를 고친다.
  체크박스는 건드리지 않는다.
  verify가 `approved`를 낸 뒤에만 main이 바꾼다.
  Per-Request는 main이 `implement` skill을 직접 쓰므로 이 agent를 거치지 않는다.
- `verifier` — `verify` 판정만 돌려준다.
  문서·체크박스·코드는 고치지 않는다.

### commands/ — slash command

Phased command는 `features/<feature-dir>/` 아래에 문서를 쓰고 feature `README.md` 상태를 바꾼다.
`project-init`만 프로젝트 루트 문서와 `docs/` 문서를 쓴다.

`project-init`·`implement-loop`·`config-review`는 `disable-model-invocation: true`라서 사용자가 직접 부를 때만 돈다.
`/spec-init`·`/design-init`·`/implement-init`은 모델도 부를 수 있지만, 언제 부르는지는 CLAUDE.md §phase 제어가 정한다.

`context-restore`·`cross-analyze`는 읽기 전용이라 `disallowed-tools`로 쓰기 도구를 막는다.
이 제한은 다음 사용자 메시지에서 풀리고 Bash와 subagent에는 걸리지 않으므로, 본문에도 파일을 고치지 않는다고 적는다.

- `project-init.md` — 프로젝트 루트에 `README.md`·`ROADMAP.md`·`docs/product.md`·`docs/design.md`를 만든다(`/project-init [프로젝트명 또는 한 줄 설명]`).
  최종 결과물, 서비스 완료 기준, 마일스톤, 작업 후보를 잡는다.
  이 중 하나라도 이미 있으면 아무것도 쓰지 않는다.
  이후 갱신은 사용자가 하고, feature가 끝나면 verify 후처리가 갱신 후보만 알린다.
- `spec-init.md` — `spec.md`를 쓰고 feature `README.md`를 만든다(`/spec-init <feature-name>`). `<feature-dir>` 이름은 이 command가 정한다.
- `design-init.md` — `spec.md`로 `design.md`를 만든다(`/design-init <feature-dir>`).
- `implement-init.md` — `design.md`로 `implement.md`를 만든다(`/implement-init <feature-dir>`).
- `implement-loop.md` — 남은 Task를 `implement` → `verify` → 체크박스 순서로 이어서 돌린다(`/implement-loop <feature-dir>`).
  반복, 재시도, 정지 조건만 정하고 구현·판정 규칙은 각 skill을 따른다.

Phased와 따로 쓰는 command:

- `config-review.md` — 전역 설정을 점검한다(`/config-review`).
  역할, 중복, 방어 문장, 모호한 표현, 흐름, Claude Code 변경으로 낡은 설정, README 정확성을 본다.
  요청 없이는 고치지 않는다.
- `cross-analyze.md` — 같은 질문을 N개 agent에 똑같이 맡기고 main이 교차검증해 합의·불일치를 알린다(`/cross-analyze [N] <질문>`). 읽기 전용이다.
- `context-save.md` — 지금 작업 위치를 프로젝트 루트 `CONTEXT.md`에 저장한다(`/context-save`). `CONTEXT.md`만 고친다.
- `context-restore.md` — `CONTEXT.md`로 작업 맥락을 되살리고 원본 문서·작업 트리와 대조한다(`/context-restore`). 읽기 전용이며 보고하고 멈춘다.

### skills/ — skill

- `analyze` — 원인을 찾고 설계 선택지를 비교해 하나를 추천한다.
  main이 직접 쓰고, 사용자가 독립 분석을 원할 때만 analyzer에 맡긴다.
  결과는 대화로만 낸다.
  같은 턴에서 다른 작업에 이어 불릴 수 있어 `disallowed-tools`를 걸지 않고 본문으로만 막는다.
- `explain` — 기존 코드·변경·시스템이 무엇이고 어떻게 동작하는지 설명한다.
  원인 찾기·대안 비교는 `analyze`, 기존 동작 이해는 `explain`이다.
  결과는 대화로만 내고, 파일은 사용자가 문서화를 따로 요청할 때만 쓴다.
- `implement` — Phased에서는 `implement.md`의 다음 Task를 하고, Per-Request에서는 요청한 변경을 한다.
  주석 기준은 `rules/code-common.md` §주석과 언어별 `rules/` 파일에 있다.
- `verify` — 직전 Task가 목적·검증 조건과 spec.md 완료 조건을 채웠는지 판정한다.
  판정만 돌려주고, 체크박스는 main이 §verify 후처리대로 바꾼다.
  테스트 규칙은 나눠서 둔다: 언제 테스트 Task를 만드는지는 `commands/implement-init.md` §테스트 Task, implement가 테스트를 쓰는 조건은 `skills/implement/SKILL.md` §테스트 코드 작성, 테스트를 근거로 인정하는 기준은 `skills/verify/SKILL.md` §근거.
- `commit-push` — 이번 작업 파일만 스테이징하고 커밋하며, 요청하면 푸시한다(`/commit-push [제목만]`).
  커밋 요청은 다른 지시에 섞여 오므로 `disable-model-invocation`을 걸지 않는다.
- `implement-orca` — Task 하나, 여러 Task, Per-Request 변경의 `implement` → `verify`를 로컬 agent 대신 서로 다른 Codex 워커로 돌린다(`/implement-orca <대상>`).
  `description`으로 Codex·Orca를 명시한 요청에만 걸리게 한다.

### rules/ — 파일 종류별 기준

frontmatter `paths`에 맞는 파일을 읽거나 쓸 때만 로드된다.
늘 로드되는 CLAUDE.md와 달리, 그 종류 파일을 만질 때만 컨텍스트를 쓴다.

작업 디렉토리 안의 파일에만 걸린다.
저장소 밖 코드를 다룰 때는 로드되지 않으므로 필요한 규칙을 직접 읽어야 한다(공식 문서가 아니라 이 환경에서 확인한 동작).
`paths` 대신 `globs`를 쓰면 범위 지정으로 인식되지 않아 세션 시작 때 항상 로드된다(v2.1.220에서 확인).

- `code-common.md` — go·csharp·js·ts·python·kotlin·sql·ps1·sh 공통 기준(공개 API 변경 영향, 놓치기 쉬운 경계, 주석).
- `go.md` / `csharp.md` / `javascript-typescript.md` — 언어별 기준. python·kotlin은 아직 언어별 파일이 없어 공통 기준만 걸린다.
- `claude-config-authoring.md` — Claude Code 설정 파일(agent·command·skill)을 쓸 때의 기준. 역할 분담, 쓰기 도구 제한, 본문 언어와 한 줄 한 문장.
- `feature-docs.md` — `features/<feature-dir>/` 문서 기준. 산출물 언어, 문서 고치는 방식과 순서, 재작성 때 승인 취소.

## 운영

- `.gitignore`는 추적할 파일만 허용하는 방식이다.
  `features/` 문서는 로컬 작업물이라 추적하지 않는다.
- 세션 데이터, 캐시, credential은 추적하지 않는다.
- 인코딩·줄바꿈은 `.editorconfig`, LF 정규화는 `.gitattributes`가 맡는다.
- `settings.json`은 기계마다 다른 값(`statusLine`·`hooks` 스크립트 절대경로, plugin marketplace 캐시 경로) 때문에 추적하지 않는다.
- 응답 길이와 preamble 생략은 내장 output style `Concise`가 맡고, CLAUDE.md에는 다시 적지 않는다.
  `outputStyle`은 추적하지 않는 설정 파일에 있으므로 기계마다 한 번 지정한다.
