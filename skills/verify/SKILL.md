---
name: verify
description: >-
  Judge whether the most recent implement Task (or a Per-Request change) satisfies its verification criteria, and whether any spec.md §5
  criteria completed by this Task actually hold. Returns approved/rejected with evidence.
---

## 역할
- 방금 구현한 Task가 목적과 검증 조건을 채웠는지, 이 Task로 끝나는 `SPEC §5.N`이 실제로 성립하는지 판단한다.
- 판단하는 동안 git 추적 파일을 고치거나 소스·테스트·문서를 새로 만들지 않는다(Bash 포함).

## 대상과 범위
- Phased mode 판정은 `implement` skill §컨텍스트 로딩과 같고, 대상은 직전 `implement`가 작업한 `[ ]` Task다(사용자가 `[x]` Task를 짚으면 재검증).
- Per-Request는 요청 범위와 코드 변경만 보고, feature 문서는 읽지 않는다.
- 검증할 변경은 main이 넘긴 비교 범위나 고친 파일 목록이고, 넘긴 게 없으면 commit하지 않은 working tree다.
- 대상이나 범위가 하나로 정해지지 않으면 판정하지 않고 `판정 불가`를 낸다.

## 근거
- 이번에 직접 읽은 코드와 직접 돌린 테스트만 근거로 쓰고, 이전 대화나 참조 필드는 근거가 아니다.
- 이번 변경에서 쓰거나 고친 테스트는 통과만으로 인정하지 않고, 실제로 회귀를 잡는지 본다.
- assertion을 약하게 하거나 경우를 지운 테스트는 `correctness`, 근거로 확인할 수 없으면 `evidence`로 reject한다.

## 판단 기준
1. Task 목적이 말하는 동작이 실제로 되는가(검증 조건 통과로 대신하지 않는다).
2. 검증 조건을 채우는가.
3. spec.md의 완료 조건·제약·제외 범위와 design.md의 결정을 지키는가.
4. Phased에서는 이 Task를 `[x]`로 바꾸면 매핑 Task가 모두 `[x]`가 되는 `SPEC §5.N`(`[철회]` 제외)마다, 매핑 Task들의 변경을 합쳐 그 조건이 성립하는지 본다.
   - `성립` / `불성립`(→ `correctness`) / `미확인`(→ `evidence`) 중 하나로 적는다.
   - 성립하지 않는 문장이 매핑 Task의 목적·검증 조건에 없으면 코드 문제가 아니므로 reject하지 않고 `매핑 누락`으로 적는다.

## verifier 위임 기준
- Phased는 verifier agent에 맡기고, Per-Request는 사용자가 독립 검증을 원할 때만 맡긴다.
- 위임 프롬프트에는 `<feature-dir>`, 대상 Task나 요청, 재검증인지, 변경 범위, 직전 `implement`의 비고와 접근 이탈을 적는다.

## 출력 구조
```markdown
1. 판정: `approved` | `rejected`
2. 대상: task-<nnn>: <제목> | <요청 인용>
3. 완료되는 요구사항
   - SPEC §5.<N>: `성립` | `불성립` | `미확인` | `매핑 누락` — <근거>
4. 문제
   - 분류: `style/minor` | `correctness` | `design/scope` | `evidence`
   - 수정 소유 단계: `implement` | `implement-init` | `design-init` | `spec-init`
   - <문제와 근거>
5. 근거 — <확인한 기준마다 관찰한 동작, 테스트 결과, 한계>
6. 설명 — <무엇이 어떻게 바뀌었는지와 남은 위험>
```
- 3번은 Phased에서만, 4번은 `rejected`일 때만, 6번은 `approved`일 때만 쓴다.
- 분류가 `evidence`면 `수정 소유 단계` 대신 `- 해소 조건: <다시 검증하려면 필요한 입력·환경>`을 쓴다.
- 문제가 여럿이면 분류는 `design/scope` > `correctness` > `style/minor` > `evidence`, 수정 소유 단계는 가장 앞선 단계 하나를 쓴다.
- 판정할 수 없으면 `- 판정 불가: 대상 | 범위 — <사유>` 한 줄만 낸다.

## reject 분류
- `style/minor`: 관례나 `rules/code-common.md`를 어겼지만 동작은 맞다.
- `correctness`: 목적·검증 조건·완료 조건을 못 채우거나, 버그가 있거나, 공개 식별자의 주석이 코드와 다르다.
- `design/scope`: design.md 결정을 벗어나거나 요청 범위를 넘거나 못 미쳐, 구현과 design.md 중 무엇을 고칠지 정해야 한다.
- `evidence`: 근거를 모으지 못해 판단하지 못했다.

## verify 후처리
main이 하는 일이다.
- approved
  - `매핑 누락`이 있으면 그 문장을 맡는 Task의 참조에 `SPEC §5.N`을 더한다.
  - 맡을 Task가 없으면 체크박스를 바꾸지 않고 사용자에게 `commands/implement-init.md` §매핑의 세 선택지를 묻는다.
  - 체크박스를 `[x]`로 바꾸고, 접근 이탈이 있었으면 접근 필드를 실제 구현대로 고친다.
  - `최근 reject`를 지우고 `- 승인 근거: <yyyy-MM-dd> <짧은 HEAD SHA | working tree> — <근거 한 줄>`을 참조 아래에 쓴다.
  - 모든 Task가 `[x]`면 README를 `[x] IMPLEMENT`로 바꾸고 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 완료`를 더하며, 낡은 프로젝트 루트 문서는 갱신 후보로만 알린다.
- rejected
  - 참조 아래에 `- 최근 reject: <분류> — <문제 한 줄>`을 쓰고 체크박스는 `[ ]`로 둔다.
  - 이미 `[x]`였던 Task면 `[ ]`로 되돌리고 `승인 근거`를 지우며, README가 `[x] IMPLEMENT`였으면 되돌리고 히스토리에 적는다.
  - 문제를 사용자에게 전하고, `/implement-loop`·`implement-orca`가 아니면 다시 구현하지 않고 사용자 판단을 기다린다.
