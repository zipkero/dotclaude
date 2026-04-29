# Core Behavior

## Language & Tone
- 응답은 한국어로, 정중하되 과한 격식은 피하는 톤을 쓴다. 직접적이고 사실 기반으로 답한다.
- `.claude/` 파일에서 본문(룰·설명)은 한국어로 작성하되, frontmatter의 `name`/`description`, 섹션 heading, 시스템 식별자(`Phased`, `Per-Request`, `[ ]`/`[x]`, `approved`/`rejected`, `$ARGUMENTS`, `spec.md` 등)는 영어로 둔다.
- `docs/<feature-name>/` 산출물은 한국어로 작성한다.

## Response
- 결론을 먼저 말하고, 정확성이나 의사결정에 도움이 될 때만 부연한다.
- 트레이드오프나 실패 케이스는 정확성·설계·향후 리스크에 영향을 줄 때 함께 다룬다.
- 요청 범위를 넘는 리팩터링은 하지 않고 작업 범위를 유지한다.
- 사용자의 방향이 근거를 살펴봤을 때 부적절해 보이면, 진행하기 전에 이견과 근거를 먼저 제시한다. 의심스러운 지시를 묵묵히 따르지 않는다.
- 응답의 단정·우려는 확인된 근거 위에서만 하고, 확인 못 한 부분은 분리해 보고한다. 요청에 없는 일반 우려(보안·성능 등)를 끌어오지 않으며, 이름 일치만으로 같음을 단정하거나 DB·ES·외부 호출처럼 직접 확인 못 하는 경로에 대해 단정하지 않는다.
- 매핑 식별자(`SPEC §5.N`, `ANALYSIS §X.Y`, `file:line`, `T<n>` Task ID 등)를 응답 본문 문장에 단어처럼 박지 않는다. 사용자가 그 위치를 직접 열어볼 가치가 있거나 정확성 입증에 결정적일 때만 1-2개로 한정한다.
- 코드/시스템에 정의되지 않은 비유어(예: "게이팅", "게이트 조건")를 정의된 식별자·패턴인 것처럼 박지 않는다. 실제 동작으로 풀어 쓰거나(예: "PlanMarkUp 존재 여부를 검사하는 if 조건"), 비유임을 분명히 표시한다. 응답 본문과 `docs/<feature-name>/` 산출물 모두에 적용된다.

## Clarification
- 모호함이 정확성·아키텍처·리스크·구현 방향에 영향을 줄 때만 질문하고, 그 외에는 명시적인 가정을 두고 진행한다.

## Code
- 명시적으로 요청된 파일과 구간만 수정한다. 다만 요청 변경의 정합성을 위해 필요한 경우(예: 시그니처 변경의 호출부)에는 그 범위까지 손댄다.
- 응답에는 변경된 코드만 보여주고, 파일 수정은 Edit 도구로 한다.
- 필요해 보이지만 요청되지 않은 변경은 적용하지 않고 설명만 남긴다. 정당화 없이 새 의존성을 추가하지 않는다.

## Document Layout
feature 단위 산출물은 `docs/<feature-name>/` 아래에 두며, 다음 네 문서로 구성한다.
- `spec.md` — 요구사항 (무엇이 있어야 하는가)
- `analysis.md` — 분석 + 설계 (구조, 데이터 흐름, 인터페이스, 영향, 리스크, 결정)
- `implement.md` — 실행 체크리스트 (Task 단위)
- `README.md` — feature 단위 요약, Status, 히스토리

`<feature-name>`은 `/spec-init`에서 결정하고 이후 단계에서 그대로 재사용한다. `verify.md`는 두지 않으며, verify의 판단이 implement.md 체크박스에 반영되는 방식은 §Verify Handoff에서 다룬다.

## Execution & Orchestration

### Defaults
- 사용자 turn당 assistant 응답은 1개로 한정하며, 내부 orchestration은 예외로 둔다.
- 사용자 확인을 받아 단계별로 진행하는 것은, 사용자가 명시적으로 요청했거나 작업에 상태 변경이 따르거나 되돌리기 어려울 때로 한정한다.

### Flows
flow는 두 가지다. Phased는 산출물(spec → analysis → implement)을 작업 기록으로 보존하고, Per-Request는 영속 문서 없이 바로 실행한다. 핸드오프, 후속 참조, 범위가 작지 않거나 후속 추적이 가치 있을 때는 Phased를, 그 외에는 Per-Request를 택한다.

- **Phased** (사용자 주도): `prompt → /spec-init → /analyze-init → /implement-init → implement → verify`. 각 phase가 작성한 문서를 다음 phase가 입력으로 사용한다. slash command는 사용자가 직접 호출하며 자동으로 이어지지 않는다. `implement`와 `verify`는 자연어 트리거이므로, 사용자가 phase 진행 시점을 통제한다.
- **Per-Request** (자동): `prompt → implement → verify`. slash command가 없고 활성 `docs/<feature>/` scope도 없는 자연어 prompt에서 진입한다.

`analyze` skill은 두 flow와 직교하는 독립 디버깅 유틸리티이며, `/spec-init`의 pre-phase로 쓰지 않는다.

### Orchestration Rules
- orchestration subagent는 두지 않는다. main이 `analyze`/`implement`/`verify` skill을 직접 호출하며, subagent로 위임하지 않는다.
- 읽기 전용 탐색에서 여러 파일에 걸친 대량 grep/Read가 필요한 경우(예: 10+ 파일에 걸친 흐름 추적, 코드베이스 전역 키워드 조사)에는 `Explore` subagent를 쓸 수 있다. Explore가 main에 요약을 반환하므로 원본 결과가 main context를 차지하지 않는다. 단일 파일 조회나 직접 Read/Grep으로 비용이 적게 끝나는 조회에는 쓰지 않는다.
- analyze skill의 Blocker 처리: `infeasible`이나 `scope undefined`는 중단·보고 후 사용자에게 전달하고, `needs input`은 사용자 입력을 받은 뒤 재개한다. 임시방편을 지어내지 않는다.
- 테스트 소유권은 verify skill에 있다. implement skill과 implement-init command는 룰을 중복 기술하지 말고 참조만 한다.

### Verify Handoff
verify skill은 판단만 반환하며, implement.md 체크박스는 main이 양방향으로 관리한다.

verify는 사용자가 명시적으로 호출해야 실행된다. main은 implement 직후 자동으로 verify를 이어가지 않으며, Per-Request mode와 이미 `[x]`인 Task의 재검증도 동일하게 사용자 호출이 있어야 한다.

- **Approved**: main이 대상 implement.md 체크박스를 `[ ]`에서 `[x]`로 바꾸고 다른 파일은 건드리지 않는다. 전환 직후 implement.md의 모든 Task가 `[x]`가 되었으면, feature README의 `[ ] IMPLEMENT`를 `[x] IMPLEMENT`로 전환하고 history에 `- <yyyy-MM-dd>: IMPLEMENT 완료` 한 줄을 추가한다. 결과는 사용자에게 알린다.
- **Rejected**:
  - 대상 체크박스가 `[ ]`였다면(implement 직후의 일반 케이스) 그대로 둔다.
  - 이미 `[x]`였던 Task를 재검증하다가 reject되면 main이 `[x]`를 `[ ]`로 되돌린다. 그 결과 implement.md가 더 이상 "모든 Task `[x]`" 상태가 아니게 되었다면, README의 `[x] IMPLEMENT`도 `[ ] IMPLEMENT`로 되돌리고 history에 그 사실을 한 줄 남긴다.
  - 어느 경우든 issues와 reject 사유를 사용자에게 전달하고, 자동으로 재시도하지 않는다. 다음 `implement` 트리거가 같은 Task를 다시 잡는다.

Per-Request mode도 같은 프로토콜을 따르되, implement.md가 없으므로 결과는 대화 출력으로만 남는다.

### Feature README Ownership
- repo-root `/README.md`는 절대 수정하지 않는다. slash command는 feature별 README(`docs/<feature-name>/README.md`)만 갱신한다.
- 각 command의 Status 전환 룰은 해당 command 파일(`commands/spec-init.md`, `commands/analyze-init.md`, `commands/implement-init.md`)에 둔다. `[x] IMPLEMENT`로의 전환만은 command가 아니라 main이 §Verify Handoff Approved 절차에 따라 수행한다.
- feature 완료는 "implement.md의 모든 Task가 `[x]`"로 관찰하며, 구현 후 별도의 상태 플래그를 두지 않는다.

### Revision & Rollback
- 요구사항이 바뀌면 spec.md를 먼저 갱신하고, 영향받은 analysis.md → implement.md 섹션에만 전파한다. 무관한 섹션은 그대로 둔다.
- implement 도중 설계가 바뀌면 analysis.md를 먼저 개정한 뒤 영향받은 implement.md Task를 갱신한다.
- verify가 reject한 경우, 해당 Task를 수정하고 implement/verify를 다시 돌린다. 승인 전까지 체크박스는 `[ ]`로 둔다.
- slash command의 덮어쓰기 의미는 각 command 파일의 Overwrite Rule 섹션에 둔다.

## Extension
- 이 파일과 같은 위치에 `EXTENSION.md`가 있으면 추가 지시로 읽고 따른다.
