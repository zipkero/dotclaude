---
description: Run features/<feature-dir>/implement.md Tasks in a loop - implement, verify, advance, and stop when a decision needs the user
argument-hint: "<feature-dir>"
disable-model-invocation: true
---

> 사용 시점: `/implement-init` 이후. 체크리스트가 준비된 상태에서 남은 Task를 연속으로 실행한다.

Feature directory: $ARGUMENTS

## 역할
`implement` → `verify` → 체크박스 전환을 사용자 개입 없이 반복한다.
구현은 `skills/implement/SKILL.md`, 판단은 `skills/verify/SKILL.md`, 판단 이후 기록은 같은 파일 §verify 후처리를 따르며, 이 command는 반복·재시도·정지 조건만 소유한다.

## 실행 주체
main이 루프를 돌린다.
각 반복의 `implement`는 implementer agent에, `verify`는 verifier agent에 맡긴다.

## 전제 조건
- `features/<feature-dir>/implement.md`가 없으면 중단하고 `/implement-init`을 먼저 실행하도록 안내한다.
- 루프가 도는 동안은 Phased mode로 고정한다.

## 루프
1. **대상 Task 선택** — implement.md 위에서부터 첫 `[ ]` Task. §자동 진행 제외로 미룬 Task는 건너뛰고, 없으면 완료로 끝낸다.
2. **자동 진행 가능 여부 확인** — §자동 진행 제외에 따라 멈추거나 미룬다.
3. **implement** — `상태`가 `blocked`이면 §정지 조건으로 간다.
4. **verify** — verifier agent에 판단을 받는다.
5. **판정 처리** — `approved`면 §verify 후처리를 하고 1로, `rejected`면 대상 Task의 `최근 reject`를 §verify 후처리대로 바꾸고 §재시도로 간다.

## 재시도
- 분류가 `evidence`면 구현하지 않는다.
  main은 해소 조건이 요구하는 입력·환경을 갖춰 해소 조건과 Task `확인`의 명령·테스트를 실행하고, 모은 근거와 직전 해소 조건을 넘겨 4번부터 다시 한다.
  이 근거 재검증은 Task당 누적 2회까지이며 구현 재시도와 따로 센다.
  해소 조건의 입력·환경을 갖출 수 없거나 2회를 쓰면 §정지 조건 7로 간다.
- `수정 소유 단계`가 `implement`이고 분류가 `design/scope`가 아니면, verify의 reject 사유·근거를 그대로 다음 `implement` 입력에 넘겨 같은 Task로 3번부터 다시 한다.
  체크박스는 `[ ]`로 둔다.
  구현 재시도는 Task당 2회(최대 3번 구현)이며, 소진하면 §정지 조건 3으로 간다.
- 그 밖의 reject는 재시도하지 않고 §정지 조건 1로 간다.

## 자동 진행 제외
- 검증 조건 `확인`에 수동 확인이 포함된 Task는 실행 가능한 근거를 함께 가리켜도 멈춰 사용자에게 올린다.
  수동 확인 부분의 근거는 루프가 모을 수 없다.
- 수동 확인이 이미 확인한 동작을 다른 OS·실기기에서 다시 보는 것뿐이면 멈추지 않고, 그 Task를 `[ ]`로 둔 채 미룬 뒤 다음 Task로 넘어가며 확인 항목은 §정지·완료 보고에 모은다.

## 정지 조건
아래 중 먼저 걸리는 조건에서 멈추고 §정지·완료 보고를 낸다.
남은 Task는 건드리지 않는다.

1. **사용자가 문서를 고칠지 판단해야 하는 경우** (`decision_needed`)
   - §재시도가 넘긴 reject
   - spec.md·design.md·implement.md 수정을 요구하는 `blocked`(Task 경계를 다시 잡아야 한다는 보고 포함)
   - 대상 Task에 걸린 design.md §5의 미해결 Decision Point(`skills/implement/SKILL.md` §미결정 분석 시 중단)
   - 완료 조건끼리의 충돌이나 지금 설계로 달성할 수 없음
   - 매핑 누락의 소유 Task가 없어 §verify 후처리가 미매핑 결정으로 올린 approve
2. **이미 성립한 동작이 성립하지 않는다고 드러난 경우** (`regression`) — implement가 `skills/implement/SKILL.md` §비확장 기본 원칙의 예외로 `blocked`를 냈다.
3. 재시도 한도를 소진한 경우 (`retry_exhausted`)
4. §자동 진행 제외가 멈추라고 한 Task를 만난 경우 (`manual_check`)
5. 그 밖의 사유로 implement가 `blocked`를 돌려준 경우 (`blocked`)
6. 되돌리기 어렵거나 외부에 영향을 주는 일이 필요한 경우 (CLAUDE.md §사전 확인) (`approval_needed`)
7. 근거를 더 보완할 수 없는 경우 — 해소 조건의 입력·환경을 갖출 수 없거나 근거 재검증 2회를 소진함 (`evidence_exhausted`)

루프가 고치는 문서는 implement.md와 feature README뿐이며, implement.md의 필드는 §verify 후처리가 고치라고 할 때만 고친다.

## 정지·완료 보고
첫 줄은 `<!-- prowl-workflow: v1 implement-loop -->`다.
1. 진행 결과 — 이번 루프에서 `[x]`로 바뀐 Task 목록.
2. 멈춘 자리 — 대상 `task-<nnn>`과 정지 조건 번호, 그렇게 판단한 근거.
   이어서 `정지 사유:` 줄에 그 조건의 값을 backtick으로 적고, 조건 7이면 `해소 조건:` 줄도 적는다.
   완료로 끝났으면 뺀다.
   구현이 코드를 고친 뒤 멈췄으면 검증받지 않고 남은 파일 목록을 함께 적는다.
3. 재시도 이력 — 재시도가 있었던 Task별 구현 재시도·근거 재검증 횟수와 reject 사유 한 줄. 없으면 뺀다.
4. 다음 행동 — 정지 조건 2면 성립하지 않는 동작·그것이 속한 Task·확인한 근거만 짚고 고칠 문서는 짚지 않는다.
   그 밖에는 `수정 소유 단계`가 `implement`가 아닐 때 그 단계가 소유한 문서를, `implement`일 때 멈춘 사유가 가리키는 자리(implement.md의 Task, design.md의 Decision Point, spec.md 완료 조건)를 짚는다.
   여러 문서면 순서는 `rules/feature-docs.md`를 따른다.
5. 미룬 확인 — §자동 진행 제외로 미룬 Task와 다른 OS·실기기에서 볼 확인 항목. 없으면 뺀다.
