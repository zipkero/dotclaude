# .claude

Claude Code의 개인 설정 저장소.

> 룰의 본문은 CLAUDE.md에 둔다. 이 README는 구조와 설계 의도를 설명한다.

## Design Intent

### 이 구조가 존재하는 이유
- Claude Code의 기본 동작은 단일 덩어리 응답이다. 이 설정은 그 흐름을 **phased·검증 가능한 단계**로 쪼개어 각 단계를 진행하기 전에 검토할 수 있게 한다.
- `docs/<feature-dir>/` 아래의 feature별 문서(`spec.md` → `analysis.md` → `implement.md` + `README.md`)는 구현 메모가 아니라 **phase 사이의 contract** 역할을 한다. 다음 phase는 대화 맥락이 아니라 앞 phase가 남긴 문서를 읽는다. (`<feature-dir>` 형식은 CLAUDE.md §Document Layout 참고)
- `implement` → `verify` → 체크박스 전환은 명시적인 판단 단계다. 산출물을 근거로 한 판단을 거친 Task만 done으로 기록되며, 흐름에 떠밀려 넘어가지 않는다.

### 핵심 설계 결정
- **phase 단위 작업은 agent에 위임**: `/analyze-init`은 `analyzer` agent, `/implement-init`과 `implement` skill 호출은 `implementer` agent가 처리해 main 컨텍스트에 코드 탐색·문서 작성 잡음이 누적되지 않게 한다. 사용자가 명시 호출하는 `verify` skill과 디버깅용 `analyze` skill은 main이 직접 호출한다. evidence discipline(판단을 대화 기억이 아니라 파일·diff·테스트 결과로 인용한다는 원칙)은 verify skill의 prompt 룰로 강제한다. 읽기 전용 탐색에 한해 `Explore` subagent로 main 컨텍스트를 격리할 수 있으며, 자세한 조건은 CLAUDE.md §Orchestration Rules에 둔다.
- **`analyze` skill은 독립 디버깅 유틸리티이지 pre-phase가 아니다**: 파일을 작성하지 않는 즉석 조사 도구로, `analysis.md`를 작성하는 Phased 설계 phase인 `/analyze-init`과는 별개다. Phased 작업은 `/spec-init`로 바로 진입한다.
- **verify reject는 사용자 판단에 맡기며 자동 재시도하지 않는다**: prompt 기반 orchestration으로는 재시도 횟수를 결정론적으로 강제할 수 없으므로 reject는 사용자 판단으로 올린다. verify skill은 reject를 `style/minor` / `correctness` / `design/scope`로 분류해 다음 단계 결정을 돕는다.
- **feature별 폴더 구조**: `docs/<feature-dir>/`에는 `spec.md`, `analysis.md`, `implement.md`, `README.md`만 둔다. `verify.md`는 두지 않으며, verify가 판단을 대화로 반환하면 implement.md 체크박스 전환(`[ ]`↔`[x]`)은 main이 CLAUDE.md §Verify Handoff에 따라 수행한다.
- **SPEC이 완료 조건의 소유자, ANALYSIS는 설계 전용**: `spec.md` §5는 요구사항 레벨의 완료 조건을 가지고, `analysis.md`는 구조·데이터 흐름·인터페이스·영향·리스크·Decision Points만 담는다(체크리스트 없음). `implement.md`는 각 Task를 `spec.md` §5에 매핑하면서 더 좁은 Task-level 검증 조건을 함께 둔다.
- **Phased flow는 사용자가 통제한다**: `/spec-init` → `/analyze-init` → `/implement-init`은 slash command이고, `implement`와 `verify`는 자연어 트리거다. 진행 시점은 사용자가 결정한다.

### 수정 시 보존할 것
- evidence discipline: verify는 대화 추론이 아니라 파일·diff·테스트 결과를 인용한다.
- 판단만 반환하는 verify: verify는 파일을 쓰지 않으며, 체크박스 갱신 룰은 CLAUDE.md §Verify Handoff에 둔다.
- phase contract: 다음 phase는 대화 맥락이 아니라 앞 phase가 남긴 문서를 읽는다.
- phase 전이는 사용자가 통제하며, command는 사용자 발화 기반이고 자동으로 이어지지 않는다.
- feature README의 Status 전환 소유권은 각 `commands/*-init.md`에 명시한다 (단 `[x] IMPLEMENT` 전환은 main이 CLAUDE.md §Verify Handoff Approved에 따라 수행).

## Workflow

flow는 두 가지다. 진입 시점만 여기 요약하고, 선택 기준·핸드오프·reject 처리는 CLAUDE.md §Execution & Orchestration에 둔다.

- **Phased**: `prompt → /spec-init → /analyze-init → /implement-init → implement → verify`. 사용자가 각 phase 진입 시점을 직접 통제한다.
- **Per-Request**: `prompt → implement → verify`. slash command 없이 자연어 prompt만으로 진입한다. verify는 두 mode 모두 사용자 명시 호출이 필요하며, main이 implement 직후 자동으로 verify를 이어가지 않는다.

`analyze` skill은 두 flow 어느 쪽에서도 호출할 수 있는 독립 디버깅 유틸리티다 (자세한 정의는 `skills/analyze/SKILL.md`).

## Structure

```
CLAUDE.md          # 룰 본문 (응답 언어, orchestration, policy, 문서 layout)
config.json        # Claude Code 기본 설정
```

### agents/ — phase 위임 정의

각 agent는 main에서 phase 작업을 받아 산출물을 만들고 main에는 요약만 돌려준다.

- `analyzer` — `/analyze-init` 실행. `spec.md`를 입력으로 `analysis.md`를 작성한다.
- `implementer` — `/implement-init` 실행, `implement` skill 호출 (Phased / Per-Request 모두). `implement.md` 체크박스는 직접 건드리지 않는다 (verify-gated).

### commands/ — slash command 정의

각 command는 `docs/<feature-dir>/` 아래에 산출물을 작성하고 feature `README.md`의 Status를 갱신한다.

- `spec-init.md` — `spec.md`를 작성하고 feature `README.md`를 초기화한다 (`/spec-init <feature-name>`). `<feature-dir>` 풀 형식(`<yyyyMMdd>-<nnn>-<feature-name>`)을 자동 산출한다 — 자세한 룰은 `commands/spec-init.md` §Output Paths에 있다.
- `analyze-init.md` — `spec.md`로부터 `analysis.md`를 만든다 (`/analyze-init <feature-dir>`)
- `implement-init.md` — `analysis.md`로부터 `implement.md`를 만든다 (`/implement-init <feature-dir>`)

### skills/ — skill 정의

- `analyze` — 독립 디버깅·코드 이해 유틸리티. 파일을 쓰지 않고 대화로만 출력한다.
- `implement` — Phased에서는 `implement.md`의 다음 Task를 실행하고, Per-Request에서는 산출물 없이 변경을 수행한다. 다음 `verify` 호출이 명시적인 diff 범위를 가질 수 있도록 **Files touched** 리스트를 함께 출력한다.
- `verify` — 직전 implement Task가 DoD를 만족하는지 판단한다. 판단만 대화로 반환하며, implement.md 체크박스 전환은 main이 CLAUDE.md §Verify Handoff에 따라 수행한다. 테스트 관련 룰(테스트 Task가 필요한 시점, implement가 테스트 코드를 쓰는 조건, 유효한 테스트 evidence 기준)은 `skills/verify/SKILL.md` §Test Rules에서 단독으로 소유한다.

## Management

- `.gitignore`는 추적 파일에 대해 허용 목록 방식을 사용한다.
- 세션 데이터, 캐시, credential은 추적에서 제외한다.
