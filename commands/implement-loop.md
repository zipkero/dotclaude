---
description: Run features/<feature-dir>/implement.md Tasks in a loop - implement, verify, advance, and stop when a decision needs the user
argument-hint: "<feature-dir>"
disable-model-invocation: true
---

> 사용 시점: `/implement-init` 이후. 체크리스트가 준비된 상태에서 남은 Task를 연속으로 실행한다.

Feature directory: $ARGUMENTS

## 역할
`implement` → `verify` → 체크박스 전환을 사용자 개입 없이 반복한다. 구현·판단·기록 규칙을 새로 만들지 않는다 —
구현은 `skills/implement/SKILL.md`, 판단은 `skills/verify/SKILL.md`, 판단 이후 기록은 같은 파일 §verify 후처리를 그대로 따른다.
이 command가 소유하는 것은 **반복·재시도·정지 조건**뿐이다.

## 실행 주체
main이 루프를 돌린다. 각 반복의 `implement`는 implementer agent에 맡기고, `verify` 위임 여부는 `skills/verify/SKILL.md` §verifier 위임 기준을 따르며,
체크박스와 feature README 갱신은 main이 한다 (CLAUDE.md §agent·skill 라우팅).

## 전제 조건
- feature directory가 비어 있으면 중단한다.
  - 안내: "feature directory를 인자로 전달하세요. 예: `/implement-loop 20260506-001-payment-integration`"
- `features/<feature-dir>/implement.md`가 없으면 중단하고 `/implement-init`을 먼저 실행하도록 안내한다.
- 루프가 도는 동안은 Phased mode로 고정한다.

## 루프
1. **대상 Task 선택** — implement.md 위에서부터 첫 `[ ]` Task. 없으면 완료로 끝낸다.
2. **자동 진행 가능 여부 확인** — §자동 진행 제외에 걸리면 멈춘다.
3. **implement** — 대상 Task를 구현한다. 반환된 `상태`가 `blocked`이면 verify로 넘어가지 않고 §정지 조건 4로 간다.
4. **verify** — 판단을 받는다.
5. **판정 처리**
   - `approved` → §verify 후처리대로 체크박스를 `[x]`로 바꾸고, 필요하면 feature README를 갱신한다. 1로 돌아간다.
   - `rejected` → §재시도로 간다.

## 재시도
- verify가 낸 `수정 소유 단계`가 `implement`이면 같은 Task로 3번으로 돌아간다. 체크박스는 `[ ]`로 둔다.
- 재시도할 때 verify가 낸 reject 사유·근거를 다음 `implement` 입력에 그대로 넘긴다. 같은 지적을 다시 받지 않게 하는 것이 목적이다.
- 한도는 재시도 2회다 (한 Task당 최대 3번 구현). 소진하면 정지한다.
- `수정 소유 단계`가 `implement`가 아닌 문제는 재시도 대상이 아니다 — §정지 조건 1로 간다. reject 뒤의 재시도·정지 판정은 분류가 아니라
  `수정 소유 단계`만 따른다.
- 예외는 `design/scope` 분류 하나다. `수정 소유 단계`가 `implement`여도 재시도하지 않고 §정지 조건 1로 간다.
  설계에서 이탈했을 때 구현을 고칠지 analyze.md를 고칠지는 사용자가 정한다(`skills/verify/SKILL.md` §reject 분류).
- 파급 점검은 `skills/implement/SKILL.md` §재작업 시 파급 점검이 소유한다. 점검 결과 설계 변경이 필요하다고 보고되면 §정지 조건 1로 간다.

## 자동 진행 제외
대상 Task의 검증 조건 `확인` 필드에 수동 확인이 포함되면, 그 Task는 자동으로 진행하지 않고 멈춰 사용자에게 올린다.
실행 가능한 근거(테스트·빌드·lint·명령 출력)를 함께 가리켜도 같다 — 수동 확인 부분의 근거를 루프가 모을 수 없기 때문이다.

## 정지 조건
아래 중 하나를 만나면 루프를 멈추고 §정지·완료 보고를 낸다. 남은 Task는 건드리지 않는다.

1. **사용자가 문서를 고칠지 판단해야 하는 경우** — 형태를 가리지 않는다.
   `수정 소유 단계`가 `implement`가 아닌 문제, `design/scope` 분류, 그리고 verify가 돌기 전에 드러난 아래 경우가 모두 여기로 온다.
   - implement가 접근 이탈을 "설계 변경이 필요함"으로 보고한 경우
   - 대상 Task가 analyze.md §5의 미해결 Decision Point에 걸리는 경우 (`skills/implement/SKILL.md` §미결정 분석 시 중단)
   - 완료 조건끼리 부딪히거나 지금 설계로는 달성할 수 없다고 드러난 경우
2. 재시도 한도를 소진한 경우
3. §자동 진행 제외에 걸린 Task를 만난 경우
4. **implement가 `blocked`를 돌려준 경우** — 대상 Task가 외부에서 관찰할 수 있는 동작 하나를 완성하지 못해
   Task 경계를 다시 잡아야 한다고 보고한 경우를 포함한다. 막힌 사유가 spec.md·analyze.md 수정을 요구하면 더 앞선 조건 1로 본다.
5. 되돌리기 어렵거나 외부에 영향을 주는 일이 필요한 경우 (CLAUDE.md §사전 확인)

## 금지
- **spec.md와 analyze.md를 고치지 않는다.** 고쳐야 하는 상황은 정지 조건 1로 올린다.
  - 예외는 하나다 — `skills/implement/SKILL.md` §완료가 허용하는 접근 필드 정정(단순 구현 상세 차이). implement.md의 접근 필드만 바뀌고 판정 기준은
    그대로다.
- spec.md §5 완료 조건이나 Task 검증 조건을 약하게·넓게 고쳐 통과시키지 않는다.
- 테스트 통과를 목적으로 assertion을 약하게 만들거나 케이스를 지우지 않는다 (`skills/verify/SKILL.md` §테스트 evidence 규칙).
- Task 순서를 바꾸거나 건너뛰지 않는다. 막힌 Task를 남겨두고 다음 Task로 넘어가지 않는다.

## 정지·완료 보고
1. 진행 결과 — 이번 루프에서 `[x]`로 바뀐 Task 목록.
2. 멈춘 자리 — 대상 Task와 정지 조건 번호, 그리고 그렇게 판단한 근거. 완료로 끝났으면 뺀다.
3. 재시도 이력 — 재시도가 있었던 Task별 시도 횟수와 reject 사유 한 줄. 없으면 뺀다.
4. 다음 행동 — 정지 조건 1이면 고쳐야 할 문서와 섹션을 짚는다.
   `수정 소유 단계`가 나왔고 그것이 `implement`가 아니면 그 단계가 소유한 문서를 짚고,
   그 밖에는 멈춘 사유가 가리키는 자리(analyze.md의 해당 Decision Point, 또는 spec.md 완료 조건)를 짚는다.
   여러 문서를 고쳐야 하면 수정 순서는 CLAUDE.md §문서 구조를 따른다.

## 핵심 질문
> 지금 Task를 구현만으로 통과시킬 수 있는가, 아니면 사람이 판단할 자리인가?
