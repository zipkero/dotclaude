# .claude

Claude Code의 개인 설정 저장소.

> 전역 행동 룰과 소유권 지정은 CLAUDE.md에, 각 phase의 절차는 해당 command·skill 파일에 둔다.
> 이 README는 구조와 설계 의도만 설명한다.

## 설계 의도

### 이 구조가 존재하는 이유
- Claude Code의 기본 동작은 한 번에 답하는 방식이다. 이 설정은 그 흐름을 **phased·검증 가능한 단계**로 쪼개어 각 단계를 진행하기 전에 검토할 수 있게 한다.
- `features/<feature-dir>/` 아래의 feature별 문서(`spec.md` → `analysis.md` → `implement.md` + `README.md`)는 구현 메모가 아니라 **phase 사이를 잇는 기준 문서** 역할을 한다. 다음 phase는 대화 맥락이 아니라 앞 phase가 남긴 문서를 읽는다. (`<feature-dir>` 형식은 `commands/spec-init.md` §산출 경로 참고)
- `implement` → `verify` → 체크박스 전환은 명시적인 판단 단계다. 산출물을 근거로 한 판단을 거친 Task만 done으로 기록된다.

### 핵심 설계 결정
- **phase 단위 작업은 agent에 맡긴다**: 산출물을 만드는 동안 읽은 코드와 검증 내용이 main 컨텍스트에 쌓이지 않도록 떼어놓는다. 어느 작업이 어느 agent로 가는지는 CLAUDE.md §agent·skill 라우팅이 소유하고, 각 agent 정의는 아래 §agents/에 정리돼 있다.
- **`analyze` skill은 독립 디버깅 도구이지 앞단 phase가 아니다**: Phased 작업은 `/spec-init`로 바로 들어가며, 디버깅 조사는 어디서든 `analyze` skill로 부른다(정의는 `skills/analyze/SKILL.md`).
- **verify reject는 사용자 판단에 맡기며 자동으로 다시 하지 않는다**: 프롬프트로 도는 구조에서는 재시도 횟수를 확실하게 강제할 수 없으므로 reject는 사용자 판단으로 올린다. verify skill은 reject를 분류해 다음 단계 결정을 돕는다(분류 정의는 `skills/verify/SKILL.md` §reject 분류).
- **feature별 폴더 구조**: 산출물 구성은 `commands/spec-init.md` §산출 경로가 소유하고, verify 판단 이후의 체크박스·README 전환은 `skills/verify/SKILL.md` §verify 후처리가 소유한다.
- **SPEC이 완료 조건의 소유자, ANALYSIS는 설계 전용**: `spec.md` §5는 요구사항 수준의 완료 조건을 가지고, `analysis.md`는 승인 전 확인·근거 서문과 구조·데이터 흐름·인터페이스·영향 범위·Decision Points를 담는다(설계를 막는 위험은 §5에 넣고, 체크리스트는 두지 않는다). `implement.md`는 각 Task를 `spec.md` §5에 매핑하면서 더 좁은 Task-level 검증 조건을 함께 둔다.
- **Phased 흐름은 사용자가 통제한다**: `/spec-init` → `/analyze-init` → `/implement-init`은 slash command이고, `implement`와 `verify`는 자연어로 부른다. 진행 시점은 사용자가 정한다.
- **결과에 영향을 주는 모호함은 질문으로 정리한 뒤 진행한다**: 그런 판단은 추정으로 채우지 않고 질문으로 닫은 뒤에 문서·코드를 만든다.
  질문 방식과 모호함 구분은 CLAUDE.md §요청 해석이 소유한다.

## 흐름

흐름은 두 가지다. 시작 시점만 여기 요약하고, 선택 기준·넘겨주기는 CLAUDE.md §phase 제어 / §agent·skill 라우팅 / §verify 책임에, verify 후처리(체크박스·README 상태 전환, reject 처리)는 `skills/verify/SKILL.md` §verify 후처리에 둔다.

- **Phased**: `prompt → /spec-init → /analyze-init → /implement-init → implement → verify`. 문서 phase 시작 시점은 사용자가 직접 정하고,
  구현과 검증 전체를 명시 요청한 경우에만 implement → verify가 이어서 진행된다(CLAUDE.md §phase 제어).
  루트 문서가 아직 없는 새 프로젝트는 앞에 `/project-init`을 한 번 두고, 거기서 나온 마일스톤별 feature 후보를 `/spec-init`의 인자로 넘긴다.
- **Per-Request**: `prompt → implement → verify`. slash command 없이 자연어 prompt만으로 시작한다.

`analyze` skill은 두 흐름 어느 쪽에서도 부를 수 있다 (정의는 `skills/analyze/SKILL.md`).

## 구조

```
CLAUDE.md          # 전역 행동 룰 + 소유권 지정 (응답·언어·작업 분배·정책·문서 구조)
```

### agents/ — phase 위임 정의

각 agent는 main에서 phase 작업을 받아 처리하고 결과를 main에 돌려준다. 반환 계약은 각 agent 파일이 소유한다.

- `analyzer` — `/analyze-init`·`/implement-init` 실행. 계획 산출물(`analysis.md`, `implement.md`) 본문을 만들어 main에 돌려주며, 파일 기록은 main이 한다. 코드는 고치지 않는다.
- `implementer` — Phased mode에서 `implement` skill 호출. 코드 변경을 맡는다. `implement.md` 체크박스는 직접 건드리지 않으며, verify가 `approved`로 판단한 뒤에만 main이 바꾼다. (Per-Request mode는 main이 `implement` skill을 직접 부르므로 이 agent를 거치지 않는다.)
- `verifier` — Phased mode에서 `verify` skill 호출. 판단만 돌려주며, 어떤 문서·체크박스·코드도 고치지 않는다 (뒤이은 전환은 §verify 후처리 소관). (Per-Request mode는 main이 `verify` skill을 직접 부르므로 이 agent를 거치지 않는다.)

### commands/ — slash command 정의

Phased 흐름 command는 `features/<feature-dir>/` 아래에 산출물을 쓰고 feature `README.md`의 상태를 갱신한다 (기록 주체는 CLAUDE.md §agent·skill 라우팅 참고). 그 앞에 오는 `project-init`만 프로젝트 루트에 쓴다.

- `project-init.md` — 프로젝트 루트 `README.md`와 `ROADMAP.md`를 초기화한다 (`/project-init [프로젝트명]`). 최종 결과물·서비스 완료 기준·마일스톤·feature 후보를 잡으며, feature 문서는 만들지 않는다. 루트 문서가 없는 새 프로젝트에서만 쓴다.
- `spec-init.md` — `spec.md`를 쓰고 feature `README.md`를 초기화한다 (`/spec-init <feature-name>`). `<feature-dir>` 이름은 이 command가 자동으로 만든다.
- `analyze-init.md` — `spec.md`로부터 `analysis.md`를 만든다 (`/analyze-init <feature-dir>`)
- `implement-init.md` — `analysis.md`로부터 `implement.md`를 만든다 (`/implement-init <feature-dir>`)

Meta command (Phased 흐름과 독립):

- `config-review.md` — 전역설정을 점검한다 (`/config-review`). 역할 프롬프트가 충분한지, 책임 경계가 겹치지 않는지, 규칙끼리 어긋나지 않는지, README가 맞는지, 컨텍스트를 얼마나 쓰는지, 줄일 곳이 있는지를 사용자가 직접 부를 때 본다. 발견만 보고하고 자동으로 고치지 않는다.
- `cross-analyze.md` — 같은 분석 질문을 N개 agent에 같은 프롬프트로 따로 분석시키고 main이 교차검증해 합의·불일치를 보고한다 (`/cross-analyze [N] <질문>`). 읽기 전용이다.
- `context-save.md` — 지금 설계·전달 작업이 어디까지 왔는지를 프로젝트 루트 `CONTEXT.md`에 저장해 세션을 이어받을 시작점을 만든다 (`/context-save`). 기본적으로 `CONTEXT.md`만 고친다.
- `context-restore.md` — `CONTEXT.md`에서 작업 맥락을 되살리고 원본·Phased 문서와 대조한다 (`/context-restore`). 읽기 전용이며 보고에서 멈춘다. 다음 작업은 사용자의 별도 요청과 CLAUDE.md §phase 제어를 따른다.

### skills/ — skill 정의

- `analyze` — 독립 디버깅·코드 이해 도구. 증상·질문에서 원인을 찾는다. 파일을 쓰지 않고 대화로만 출력한다.
- `explain-change` — 이미 있는 변경을 배경·핵심 생각·흐름·판단까지 풀어 설명한다 (`/explain-change`). `disable-model-invocation`이라 명시 호출로만 뜬다. 설명 깊이는 항목별 done 조건으로 잡는다.
- `implement` — Phased에서는 `implement.md`의 다음 Task를 실행하고, Per-Request에서는 산출물 없이 변경을 한다. 다음 `verify` 호출이 분명한 변경 범위를 가질 수 있도록 고친 파일 목록을 함께 출력한다.
- `verify` — 직전 implement Task가 spec.md 완료 조건과 implement.md 검증 조건을 채웠는지 판단한다. 판단만 대화로 돌려주며, implement.md 체크박스 전환은 main이 `skills/verify/SKILL.md` §verify 후처리에 따라 한다. 테스트 관련 룰은 영역별로 나눠서 소유한다 — 테스트 Task 포함 시점은 `commands/implement-init.md` §테스트 Task 포함 기준, implement가 테스트 코드를 쓰는 조건은 `skills/implement/SKILL.md` §테스트 코드 작성, 유효한 테스트 근거 기준은 `skills/verify/SKILL.md` §테스트 evidence 규칙.

### rules/ — 파일 경로로 걸리는 작업 기준

frontmatter `paths`에 매치되는 파일을 읽을 때만 컨텍스트에 들어온다. 항상 로드되는 CLAUDE.md와 달리 해당 언어를 만질 때만 비용을 낸다.

- `code-common.md` — go·csharp·js·ts 공통 기준 (공개 API 변경 영향, 결함으로 이어지는 경계).
- `go.md` / `csharp.md` / `javascript-typescript.md` — 언어별 기준. 각 파일이 자기 언어의 소유자이며 별도 라우팅 문서를 두지 않는다.

## 운영

- `.gitignore`는 추적 파일에 대해 허용 목록 방식을 쓴다.
- 세션 데이터, 캐시, credential은 추적에서 뺀다.
