---
name: verify
description: "Judge whether the most recent implement Task satisfies spec.md completion criteria and its implement.md verification criteria. Invoked via verifier agent; main delegates and handles post-processing. Returns approved/rejected with evidence."
---

## 역할
verify는 **Task-level 판단 도구**다. `implement` turn 직후에 실행되어 단 하나의 질문에 답한다 — 방금 만든 Task가 DoD를 만족했는가?

- verify는 판단만 반환하며, implement.md 체크박스는 main이 양방향으로 관리한다 (§verify 후처리 참고).
- feature-level 검증 패스는 두지 않으며, `verify.md`도 두지 않는다.

## 근거 원칙
판단은 **파일·diff·테스트 결과**를 인용해야 하며, 대화 추론에 의존하지 않는다. verifier agent는 implement 도중 누적된 대화 추론과 분리된 컨텍스트에서 실행되며, 결론은 산출물에서 다시 도출한다.
- Phased mode: spec.md, analysis.md, implement.md, code diff, 테스트 결과.
- Per-Request mode: 사용자 요청(원래 발화 그대로), code diff, 테스트 결과.

correctness 주장이 "전에 논의했음"에 의존한다면 그것은 유효한 evidence가 아니다. 파일을 다시 읽거나 테스트를 다시 돌린다.

implement.md Task의 참조 필드(`SPEC §5.N`, `ANALYSIS §X.Y`)는 매핑 메타데이터이며 그 자체로는 evidence가 아니다. evidence는 spec.md·analysis.md 본문, code diff, 테스트 결과에서 가져온다.

## 컨텍스트 로딩
1. `$ARGUMENTS`가 `docs/<feature-dir>/` 또는 그 하위 파일과 매치하거나, 대화가 활성 `docs/<feature-dir>/` scope를 가리킬 때(`implement` skill §컨텍스트 로딩과 동일 정의) → Phased mode.
   - spec.md 완료 조건을 읽는다 (요구사항 레벨 기준).
   - implement.md를 읽는다. 기본 검증 대상은 직전 `implement`가 실행한 Task(여전히 `[ ]`이며 판단 대기 상태)이며, 그 Task의 검증 조건 필드를 Task-level 기준으로 삼는다.
   - 사용자가 이미 `[x]`인 특정 Task를 명시적으로 지목해 호출한 경우 → 재검증 모드. 같은 기준(spec.md §5 매핑 + Task 검증 조건)으로 판단한다. reject되면 main이 `[x]`를 `[ ]`로 되돌린다(§verify 후처리).
   - 설계 의도 일치 여부가 쟁점일 때 analysis.md Decision Points를 읽는다.
2. 그 외 → Per-Request mode. 요청 범위와 code diff만으로 verify한다.
   - diff source: working tree (직전 implement turn의 미커밋 변경). 이미 commit된 경우, main이 이 skill을 호출할 때 diff 범위를 명시적으로 전달한다 (commit SHA, 또는 implement 출력의 Files touched 목록).
   - 어떤 문서도 읽거나 쓰지 않는다.

대상 Task를 모호하지 않게 식별할 수 없으면(여러 개가 대기 중이거나 직전 implement 대상으로 단일 식별이 불가능한 경우), 판단 전에 사용자에게 명시를 요청한다.

## 출력 구조
1. Status: `approved` | `rejected`
2. Target Task: implement.md Task 제목(Phased) 또는 사용자가 발화한 변경(Per-Request)을 인용한다.
3. Validation — 아래 항목 중 이번 Task의 판단에 실제로 영향을 주는 것만 적는다. 항목을 채우려고 무관한 spec.md §5나 다른 모듈을 evidence로 끌어오지 않는다.
   - 요청·Task 일치
   - spec.md 완료 조건 일치 — 관찰된 동작을 평문으로 기술하고, 섹션 번호를 덧붙인다. — Phased only
   - Task 검증 조건 일치 — Phased only
   - 설계 의도 일치 — 구현이 analysis.md Decision Point에서 이탈했는지 판단할 때만 그 항목을 인용한다. — Phased only
   - 범위 정확성
   - 동작 정확성
   - Evidence (diff, 테스트 결과, 또는 명시적 한계)
4. rejected인 경우 — Issues
   - Category: `style/minor` | `correctness` | `design/scope`
   - 구체적 issue를 evidence와 함께 나열한다.
5. approved인 경우 — Explanation
   - 무엇이 어떻게 바뀌었는지 (2-3 문장).
   - 잔여 risk (특기할 것이 있을 때만).

## reject 분류
모든 reject category는 동등하게 Task 승인을 막으며, 해소 전까지 체크박스는 `[x]`로 전환되지 않는다. category는 사용자가 다음 단계를 결정하는 데 도움을 주기 위해서만 둔다.
- `style/minor`: 명명·주석·포맷 등 비-동작적 issue로, 정확성은 깨지지 않는다.
- `correctness`: 동작이 spec.md 완료 조건이나 implement.md 검증 조건을 만족하지 않거나, 버그가 포함되었거나, invariant를 위반하거나, 잘못된 출력을 낸다.
- `design/scope`: 구현이 analysis.md Decision Points에서 이탈하거나, 요청 범위를 초과·미달하거나, 합의된 경계를 위반한다. 결정이 필요하다 — 구현을 수정하거나 analysis.md를 개정한다.

## verify 후처리
verify skill은 판단만 반환하며, implement.md 체크박스와 feature README Status 전환은 main이 수행한다. 자동 재시도는 없다.

- **Approved**:
  - main이 대상 implement.md Task 체크박스를 `[ ]` → `[x]`로 바꾸고 다른 파일은 건드리지 않는다.
  - 전환 후 implement.md의 모든 Task가 `[x]`가 되었으면, feature README의 `[ ] IMPLEMENT`를 `[x] IMPLEMENT`로 전환하고 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 완료` 한 줄을 추가한다.
- **Rejected**:
  - 대상 체크박스가 `[ ]`였다면(implement 직후의 일반 케이스) 그대로 둔다.
  - 이미 `[x]`였던 Task를 재검증하다가 rejected되면 main이 `[x]` → `[ ]`로 되돌린다. 그 결과 implement.md가 더 이상 "모든 Task `[x]`" 상태가 아니면 README의 `[x] IMPLEMENT`를 `[ ] IMPLEMENT`로 되돌리고 작업 히스토리에 그 사실을 한 줄 남긴다.
  - issues와 reject 사유는 사용자에게 전달하며, 자동으로 재시도하지 않는다. 다음 `implement` 호출이 같은 Task를 다시 잡는다.
- Per-Request mode는 verify 결과를 대화 출력으로만 남기며, 체크박스·README를 갱신하지 않는다.

README Status 전환 책임:

| Status 라인     | 전환 주체              |
|-----------------|------------------------|
| `[x] SPEC`      | `/spec-init`           |
| `[x] ANALYSIS`  | `/analyze-init`        |
| `[x] IMPLEMENT` | main (verify Approved) |

## 테스트 규칙 (권위 — verify skill 소유)
다른 문서는 이 룰을 참조하며, 다른 곳에서는 중복 기술하지 않는다.

### implement.md에 테스트 Task가 들어가는 경우 (`/implement-init`이 참조)
analysis.md §2 Data Flow나 §5 Decision Points가 의미 있는 회귀 위험(상태 변화, 외부 I/O, 동시성, 신규 경계)을 시사할 때, implement.md에 명시적 테스트 Task를 추가한다.

### implement가 테스트 코드를 작성하는 경우 (`implement` skill이 참조)
implement는 **테스트 Task에 한해서만** 테스트 코드를 작성한다. 다음 중 하나라도 해당하면 테스트 Task로 본다.
- Task 제목이나 접근 필드가 명시적으로 테스트로 지칭되는 경우 (예: "…테스트 작성", "unit/integration/e2e test").
- 검증 조건의 `확인` 필드가 테스트 실행을 명시하는 경우 (예: "CI/로컬에서 해당 테스트가 통과한다").

그 외의 암묵적 테스트 추가는 두지 않는다.

버그 수정 예외: 수정한 버그를 재현하는 단일 회귀 테스트는 수정과 함께 포함할 수 있다. feature 추가는 이 예외에 해당하지 않는다.

Per-Request mode에서는 조용히 테스트를 추가하지 않는다. 변경에 의미 있는 회귀 위험이 있으면 `implement`가 Notes에 누락을 명시하고, 테스트 추가 여부는 사용자가 후속 turn에서 결정한다.

기존 테스트가 변경 범위에 비해 누락·부족해 보이면 `implement`가 Notes에 누락을 명시하며, 조용히 추가하지 않는다.

### verify 시 테스트 evidence
- verify는 evidence 수집의 일부로 테스트를 실행한다. 테스트 코드·운영 코드·문서를 수정하지 않는다.
- 최소 evidence는 code diff이며, 권장은 diff + 테스트 결과다. 변경 범위에 대한 테스트가 존재하지만 실행되지 않았다면 한계로 기록한다.
- 변경이 내부 계산·조건·변환만 수정하고(외부 상태·I/O·의존성 변경 없음) correctness가 diff에 보이는 경우에는, diff 기반 추론도 유효 evidence다.
- 검증 대상과 동일한 변경 안에서 테스트가 함께 수정되었다면 그 테스트만으로 evidence를 삼지 않는다. 수정이 test-gaming(assertion 약화, 사례 무근거 제거)으로 보이면 `correctness`로 reject한다.
- 가용 evidence로 correctness를 확립할 수 없으면 reject하고 한계를 명시한다.

## 지침
- 현재 Task만 판단한다. 다른 대기 중인 Task나 향후 작업에 대한 의견은 두지 않는다.
- Per-Request mode는 대화 출력만 반환하며, 파일을 쓰거나 체크박스를 전환하지 않는다.
