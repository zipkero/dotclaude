---
name: verify
description: "Judge whether the most recent implement Task satisfies its implement.md verification criteria, and whether any spec.md §5 criteria completed by this Task actually hold. Invoked via verifier agent; main delegates and handles post-processing. Returns approved/rejected with evidence."
---

## 역할
verify는 `implement` turn 직후에 실행되는 판단 도구로, 두 고도를 본다.
1. **Task 판단** — 방금 만든 Task가 자기 검증 조건을 만족했는가?
2. **완료되는 요구사항 판단** — 이 Task의 approve로 매핑 Task 집합이 전부 완료되는 `SPEC §5.N`이 있다면, 그 완료 조건이 실제로 성립하는가?

별도의 feature 단위 verify 단계는 두지 않는다 — 전 Task에 걸친 `SPEC §5.N`이 마지막 Task에서 완료될 때, 같은 규칙으로 feature 수준 검증이 일어난다. 체크박스 전환은 §verify 후처리에 둔다.

## 근거 원칙
판단은 **파일·diff·테스트 결과**를 인용해야 하며 대화 추론에 의존하지 않는다.

- 최소 evidence는 code diff, 권장은 diff + 테스트 결과.
- 내부 계산·조건·변환만 수정하고 correctness가 diff에 보이는 경우엔 diff 기반 추론도 유효 evidence.
- "전에 논의했음"은 evidence가 아니며, 파일을 다시 읽거나 테스트를 다시 돌린다.
- 참조 필드(`SPEC §5.N`, `ANALYSIS §X.Y`)는 매핑 메타데이터이며 evidence는 본문·diff·테스트 결과에서 가져온다.
- 확보된 evidence로 correctness를 확립할 수 없으면 reject하고 한계를 명시한다.

## 판단 위계
- 1차 기준은 대상 Task의 검증 조건이다.
- 2차 기준은 매핑된 `SPEC §5.N`을 위반하지 않는지다. 단, 이번 approve로 완료되는 `SPEC §5.N`은
  위반 없음이 아니라 성립 확인까지 요구한다(§완료되는 요구사항 판정).
- 3차 기준은 analysis.md의 설계 결정과 제외 범위를 벗어나지 않는지다.

## 컨텍스트 로딩
1. Phased mode — 진입 조건은 `implement` skill §컨텍스트 로딩과 동일하다.
   - spec.md 완료 조건을 읽는다 (요구사항 레벨 기준).
   - implement.md를 읽는다. 기본 검증 대상은 직전 `implement`가 실행한 Task(여전히 `[ ]`이며 판단 대기 상태)이며, 그 Task의 검증 조건 필드를 Task-level 기준으로 삼는다.
   - 사용자가 이미 `[x]`인 특정 Task를 명시적으로 지목해 호출한 경우 → 재검증 모드. 같은 기준으로 판단한다.
   - 검증할 변경 범위는 기본적으로 아직 commit되지 않은 working tree 변경분이다. 변경이 이미 commit된
     경우(세션 재개 후 사용자가 Task를 지목해 호출하는 경우 포함), main이 이 skill을 호출할 때 diff 범위
     (commit SHA, 파일 목록, 또는 비교 범위)를 명시적으로 전달한다.
   - 완료되는 요구사항을 계산한다 — 대상 Task를 `[x]`로 가정했을 때 매핑 Task가 전부 `[x]`가 되는
     `SPEC §5.N` 목록. implement.md 참조 필드를 역으로 집계해 구하며, 목록은 비어 있을 수 있다.
     재검증 모드에서도 같은 규칙으로 계산한다.
   - 설계 의도 일치 여부가 쟁점일 때 analysis.md Decision Points를 읽는다.
2. 그 외 → Per-Request mode. 요청 범위와 code diff만으로 verify한다.
   - 검증할 변경 범위 규칙은 Phased mode와 동일하다.
   - 어떤 문서도 읽거나 쓰지 않는다.

대상 Task 식별이 모호하면(여러 개가 대기 중이거나 직전 implement 대상이 단일하게 잡히지 않는 경우), 판단 전에 식별 후보와 사유를 묶어 main에 반환한다(CLAUDE.md §agent·skill 라우팅).

## 완료되는 요구사항 판정
Phased mode에서 §컨텍스트 로딩이 계산한 완료되는 `SPEC §5.N` 각각에 대해 판단한다. Per-Request mode에는 적용하지 않는다.

- 판단 질문은 "매핑된 Task들의 변경이 **합쳐져서** 이 완료 조건이 성립하는가"다. 개별 Task 통과의
  합산으로 갈음하지 않고 완료 조건 문장 자체를 기준으로 본다.
- evidence 규칙은 Task 판단과 동일하다(§근거 원칙). 앞선 `[x]` Task의 산출물이 근거로 필요하면
  해당 파일·테스트를 다시 확인한다.
- 하나라도 불성립이면 Task 검증 조건 충족 여부와 무관하게 Status는 `rejected`다. category는
  §reject 분류를 따른다(완료 조건 불충족은 `correctness`).

## 출력 구조
1. Status: `approved` | `rejected`
2. Target Task: implement.md Task 제목(Phased) 또는 사용자가 발화한 변경(Per-Request)을 인용한다.
3. Validation — 이번 Task 판단에 실제로 영향을 준 항목만 적는다. 항목을 채우려고 무관한 spec.md §5나 다른 모듈을 evidence로 끌어오지 않는다.
   - 기준 일치 — 관찰된 동작을 평문으로 기술하고, 필요한 경우 `SPEC §5.N` / Task 검증 조건 / `ANALYSIS §X.Y` 중 인용한 출처를 덧붙인다. Phased mode에서만 spec·analysis 인용을 두며, Per-Request에서는 사용자 요청과의 일치만 본다.
   - 범위·동작 정확성
   - Evidence (diff, 테스트 결과, 또는 명시적 한계)
4. Completed requirements — 완료되는 `SPEC §5.N`이 있으면 각각 성립/불성립을 evidence와 함께 적고,
   없으면 `없음`으로 표기한다. Per-Request mode에서는 항목을 생략한다.
5. rejected인 경우 — Issues
   - Category: `style/minor` | `correctness` | `design/scope`
   - 구체적 issue를 evidence와 함께 나열한다.
6. approved인 경우 — Explanation
   - 무엇이 어떻게 바뀌었는지 (2-3 문장).
   - 잔여 risk (특기할 것이 있을 때만).

## reject 분류
모든 reject category는 동등하게 Task 승인을 막으며, 해소 전까지 체크박스는 `[x]`로 전환되지 않는다. category는 사용자가 다음 단계를 결정하는 데 도움을 주기 위해서만 둔다.
- `style/minor`: 명명·주석·포맷 등 비-동작적 issue로, 정확성은 깨지지 않는다.
- `correctness`: 동작이 spec.md 완료 조건이나 implement.md 검증 조건을 만족하지 않거나, 버그가 포함되었거나, invariant를 위반하거나, 잘못된 출력을 낸다.
- `design/scope`: 구현이 analysis.md Decision Points에서 이탈하거나, 요청 범위를 초과·미달하거나, 합의된 경계를 위반한다. 결정이 필요하다 — 구현을 수정하거나 analysis.md를 개정한다.

## verify 후처리
main이 verify 판단을 받아 수행하는 절차다.

- **Approved**:
  - main이 대상 implement.md Task 체크박스를 `[ ]` → `[x]`로 바꾸고 다른 파일은 건드리지 않는다.
  - 전환 후 implement.md의 모든 Task가 `[x]`가 되었으면, feature README의 `[ ] IMPLEMENT`를 `[x] IMPLEMENT`로 전환하고 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 완료` 한 줄을 추가한다.
- **Rejected**:
  - 대상 체크박스가 `[ ]`였다면(implement 직후의 일반 케이스) 그대로 둔다.
  - 완료되는 요구사항 불성립으로 rejected된 경우도 동일하다 — 대상 Task 체크박스는 `[ ]`로 남고,
    해소 수정이 앞선 `[x]` Task의 코드에 걸치더라도 같은 Task의 재작업 범위로 본다. 앞선 Task
    체크박스는 되돌리지 않는다.
  - 이미 `[x]`였던 Task를 재검증하다가 rejected되면 main이 `[x]` → `[ ]`로 되돌린다. 그 결과 implement.md가 더 이상 "모든 Task `[x]`" 상태가 아니면 README의 `[x] IMPLEMENT`를 `[ ] IMPLEMENT`로 되돌리고 작업 히스토리에 그 사실을 한 줄 남긴다.
  - issues와 reject 사유는 사용자에게 전달하며, 다음 `implement` 호출이 같은 Task를 다시 잡는다.
- Per-Request mode는 verify 결과를 대화 출력으로만 남기며, 체크박스·README를 갱신하지 않는다.

## 테스트 evidence 규칙
- verify는 evidence 수집 목적으로만 테스트를 실행한다. 테스트·운영 코드·문서를 수정하지 않는다.
- 변경 범위 테스트가 존재하지만 실행되지 않았다면 한계로 기록한다.
- 같은 변경 안에 추가·수정된 테스트는 통과만으로 evidence가 되지 않는다. 구현 diff와 함께 회귀 케이스를 실제로 다루는지 확인한다. test-gaming(assertion 약화, 사례 무근거 제거)으로 보이면 `correctness`로 reject한다.

테스트 Task 포함 기준은 `commands/implement-init.md` §테스트 Task 포함 기준이, 테스트 코드 작성 범위는 `skills/implement/SKILL.md` §테스트 코드 작성이 소유한다.

## 지침
- 현재 Task와 그 approve로 완료되는 요구사항만 판단한다. 다른 대기 중인 Task나 향후 작업에 대한 의견은 두지 않는다.
- 변경 diff의 주석이 `skills/implement/SKILL.md` §주석 작성 기준을 위반하면 `style/minor`로 reject한다.
