# .claude

Claude Code의 개인 설정 저장소.

> 룰의 본문은 CLAUDE.md에 둔다. 이 README는 구조와 설계 의도를 설명한다.

## Design Intent

### 이 구조가 존재하는 이유
- Claude Code의 기본 동작은 한 번에 답하는 방식이다. 이 설정은 그 흐름을 **phased·검증 가능한 단계**로 쪼개어 각 단계를 진행하기 전에 검토할 수 있게 한다.
- `docs/<feature-dir>/` 아래의 feature별 문서(`spec.md` → `analysis.md` → `implement.md` + `README.md`)는 구현 메모가 아니라 **phase 사이를 잇는 기준 문서** 역할을 한다. 다음 phase는 대화 맥락이 아니라 앞 phase가 남긴 문서를 읽는다. (`<feature-dir>` 형식은 `commands/spec-init.md` §산출 경로 참고)
- `implement` → `verify` → 체크박스 전환은 명시적인 판단 단계다. 산출물을 근거로 한 판단을 거친 Task만 done으로 기록된다.

### 핵심 설계 결정
- **phase 단위 작업은 agent에 위임**: 산출물을 만드는 동안의 코드 탐색·검증 read 잡음이 main 컨텍스트에 누적되지 않도록 분리한다. analyzer 산출물 본문 자체는 가드상 main이 기록하지만, 그 본문을 만들기 위한 입력 읽기·설계 추론은 agent에 격리된다.
  - `/analyze-init`·`/implement-init` → `analyzer` agent
  - `implement` skill → Phased mode는 `implementer` agent에 위임, Per-Request mode는 main이 직접 호출
  - `verify` skill → `verifier` agent
  - 디버깅용 `analyze` skill은 main이 직접 호출한다.
  - 여러 파일에 걸친 grep/Read에는 `Explore` subagent로 main 컨텍스트를 보호한다 (자세한 조건은 CLAUDE.md §agent·skill 라우팅).
- **`analyze` skill은 독립 디버깅 유틸리티이지 pre-phase가 아니다**: Phased 작업은 `/spec-init`로 바로 진입하며, 디버깅 조사는 어디서든 `analyze` skill로 호출한다(정의는 `skills/analyze/SKILL.md`).
- **verify reject는 사용자 판단에 맡기며 자동 재시도하지 않는다**: prompt 기반 orchestration으로는 재시도 횟수를 결정론적으로 강제할 수 없으므로 reject는 사용자 판단으로 올린다. verify skill은 reject를 `style/minor` / `correctness` / `design/scope`로 분류해 다음 단계 결정을 돕는다.
- **feature별 폴더 구조**: `docs/<feature-dir>/`에는 `spec.md`, `analysis.md`, `implement.md`, `README.md`만 둔다. `verify.md`는 두지 않으며, verify 판단 이후의 체크박스·README 전환은 `skills/verify/SKILL.md` §verify 후처리가 소유한다.
- **SPEC이 완료 조건의 소유자, ANALYSIS는 설계 전용**: `spec.md` §5는 요구사항 레벨의 완료 조건을 가지고, `analysis.md`는 구조·데이터 흐름·인터페이스·영향·리스크·Decision Points만 담는다(체크리스트 없음). `implement.md`는 각 Task를 `spec.md` §5에 매핑하면서 더 좁은 Task-level 검증 조건을 함께 둔다.
- **Phased flow는 사용자가 통제한다**: `/spec-init` → `/analyze-init` → `/implement-init`은 slash command이고, `implement`와 `verify`는 자연어 트리거다. 진행 시점은 사용자가 결정한다.

## Workflow

flow는 두 가지다. 진입 시점만 여기 요약하고, 선택 기준·핸드오프는 CLAUDE.md §phase 제어 / §agent·skill 라우팅 / §verify 책임에, verify 후처리(체크박스·README Status 전환, reject 처리)는 `skills/verify/SKILL.md` §verify 후처리에 둔다.

- **Phased**: `prompt → /spec-init → /analyze-init → /implement-init → implement → verify`. 사용자가 각 phase 진입 시점을 직접 통제한다.
- **Per-Request**: `prompt → implement → verify`. slash command 없이 자연어 prompt만으로 진입한다.

`analyze` skill은 두 flow 어느 쪽에서도 호출할 수 있는 독립 디버깅 유틸리티다 (자세한 정의는 `skills/analyze/SKILL.md`).

## Structure

```
CLAUDE.md          # 룰 본문 (응답 언어, orchestration, policy, 문서 layout)
EXTENSION.md       # CLAUDE.md를 잇는 추가 지시 (있으면 함께 읽힘)
```

### agents/ — phase 위임 정의

각 agent는 main에서 phase 작업을 받아 처리하고 결과를 main에 돌려준다. `implementer`·`verifier`는 요약·판단만 돌려주고, `analyzer`는 디스크에 쓰지 못해(report-file 가드) 산출물 본문 전체를 돌려주며 기록은 main이 한다.

- `analyzer` — `/analyze-init`·`/implement-init` 실행. 계획 산출물(`analysis.md`, `implement.md`) 본문을 생산해 main에 반환하며, 디스크 기록은 main이 한다(서브에이전트 report-file 가드). 코드는 수정하지 않는다.
- `implementer` — Phased mode에서 `implement` skill 호출. 코드 변경을 담당한다. `implement.md` 체크박스는 직접 건드리지 않으며, verify가 `approved`로 판단한 뒤에만 main이 전환한다. (Per-Request mode는 main이 `implement` skill을 직접 호출하므로 이 agent를 거치지 않는다.)
- `verifier` — `verify` skill 호출 (Phased / Per-Request 모두). 판단만 반환하며, 어떤 문서·체크박스·코드도 수정하지 않는다 (후속 전환은 §verify 후처리 소관).

### commands/ — slash command 정의

Phased flow command는 `docs/<feature-dir>/` 아래에 산출물을 작성하고 feature `README.md`의 Status를 갱신한다 (기록 주체는 CLAUDE.md §agent·skill 라우팅 참고).

- `spec-init.md` — `spec.md`를 작성하고 feature `README.md`를 초기화한다 (`/spec-init <feature-name>`). `<feature-dir>` 풀 형식(`<yyyyMMdd>-<nnn>-<feature-name>`)을 자동 산출한다 — 자세한 룰은 `commands/spec-init.md` §산출 경로에 있다.
- `analyze-init.md` — `spec.md`로부터 `analysis.md`를 만든다 (`/analyze-init <feature-dir>`)
- `implement-init.md` — `analysis.md`로부터 `implement.md`를 만든다 (`/implement-init <feature-dir>`)

Meta command (Phased flow와 독립):

- `global-review.md` — 전역설정의 정합성·README 정확성·축소 여지를 사용자 의식적 호출로 점검한다 (`/global-review`). 발견 보고만 하고 자동 수정하지 않는다.
- `flow.md` — 선택한 코드 범위(패키지·파일·심볼·최근 변경분)의 호출 흐름·상태 전이·존재 이유를 다이어그램과 함께 대화로 풀어준다 (`/flow [범위]`). 파일을 만들거나 수정하지 않는다.

### skills/ — skill 정의

- `analyze` — 독립 디버깅·코드 이해 유틸리티. 파일을 쓰지 않고 대화로만 출력한다.
- `implement` — Phased에서는 `implement.md`의 다음 Task를 실행하고, Per-Request에서는 산출물 없이 변경을 수행한다. 다음 `verify` 호출이 명시적인 diff 범위를 가질 수 있도록 **Files touched** 리스트를 함께 출력한다.
- `verify` — 직전 implement Task가 DoD를 만족하는지 판단한다. 판단만 대화로 반환하며, implement.md 체크박스 전환은 main이 `skills/verify/SKILL.md` §verify 후처리에 따라 수행한다. 테스트 관련 룰은 영역별로 분산 소유한다 — 테스트 Task 포함 시점은 `commands/implement-init.md` §테스트 Task 포함 기준, implement가 테스트 코드를 쓰는 조건은 `skills/implement/SKILL.md` §테스트 코드 작성, 유효한 테스트 evidence 기준은 `skills/verify/SKILL.md` §테스트 evidence 규칙.

## Management

- `.gitignore`는 추적 파일에 대해 허용 목록 방식을 사용한다.
- 세션 데이터, 캐시, credential은 추적에서 제외한다.
