---
name: verify
description: >-
  Judge whether the most recent implement Task satisfies its implement.md verification criteria, and whether any spec.md §5 criteria
  completed by this Task actually hold. Returns approved/rejected with evidence.
---

## 역할
- 방금 구현한 Task가 자기 검증 기준을 채웠는지 판단한다.
- 이 Task로 끝나는 `SPEC §5.N`이 실제로 성립하는지도 판단한다.
- Phased에서는 `implement` 다음에 돌고, Per-Request에서는 사용자가 부를 때만 돈다.
- 판단하는 동안 코드·테스트·문서를 고치지 않는다.

## 컨텍스트 로딩
### Phased mode
- 들어가는 조건은 `implement` skill §컨텍스트 로딩과 같다.
- spec.md의 완료 조건·제약·제외 범위와 implement.md를 읽는다.
- 대상은 직전 `implement`가 작업한 `[ ]` Task다.
- 사용자가 이미 `[x]`인 Task를 짚으면 같은 기준으로 다시 검증한다.
- 대상이 하나로 정해지지 않으면 멈춘다.
  verifier는 `판정 불가`를 돌려주고, main은 사용자에게 묻는다.

### Per-Request mode
요청 범위와 코드 변경만 보고 판단한다.
feature 문서는 읽거나 쓰지 않는다.

### 검증할 변경 범위
- 기본은 아직 commit하지 않은 working tree 변경이다.
- 이미 commit됐으면 main이 commit SHA, 파일 목록, 비교 범위를 넘긴다.
- reject 뒤 다시 검증할 때는 reject 사유를 고친 변경만 본다.
  앞 판정에서 성립한 항목은 이번에 바뀐 파일에 기대지 않았다면 그대로 인정한다.
  main은 이 범위를 직전 `implement`의 고친 파일 목록에서 구하고, 없으면 git 이력에서 후보를 찾아 사용자에게 확인받는다.
- 범위를 정하지 못하면 판정하지 않는다.
  verifier는 `판정 불가`를 돌려준다.

## 근거
- 이번에 직접 읽은 파일과 직접 돌린 테스트 결과만 근거로 쓴다.
- 이전 대화 내용이나 참조 필드(`SPEC §5.N`, `DESIGN §N`)는 근거가 아니다.
- 최소한 코드 변경은 읽고, 가능하면 테스트도 돌린다.
- 변경 범위에 테스트가 있는데 돌리지 않았으면 한계로 적는다.
- 이번 변경에서 새로 쓰거나 고친 테스트는 통과만으로 근거가 되지 않는다.
  그 테스트가 실제로 회귀를 잡는지 본다.
- assertion을 약하게 만들거나 이유 없이 경우를 지운 테스트는 `correctness`로 reject한다.
- 근거로 확인할 수 없으면 `evidence`로 reject한다.

## 판단 순서
구현을 보기 전에 판정 기준 목록부터 만든다.
기준마다 출처를 붙이고, 하나씩 따로 판정할 수 있게 쓴다.
1. Task의 `목적`이 말하는 동작이 실제로 되는가. 검증 조건을 통과했다는 것만으로 대신하지 않는다.
2. Task의 검증 조건을 채우는가.
3. 매핑된 `SPEC §5.N`과 spec.md의 제약·제외 범위를 지키는가.
4. design.md의 결정을 벗어나지 않는가.
5. Phased에서는 §완료되는 요구사항 판정을 한다.

## 완료되는 요구사항 판정
- 이 Task를 `[x]`로 바꾸면 매핑된 Task가 모두 `[x]`가 되는 `SPEC §5.N`이 대상이다.
- implement.md의 참조 필드를 거꾸로 모아서 찾는다.
  `[철회]`는 빼고, 대상이 없을 수도 있다.
- 각 `SPEC §5.N`마다 매핑된 Task들의 변경을 합쳐서 그 조건이 성립하는지 본다.
- 앞선 `[x]` Task의 결과가 필요하면 그 파일과 테스트를 다시 확인한다.
- 결과는 넷 중 하나다.
  - `성립`
  - `불성립`: 성립하지 않는 것을 확인했다.
    `correctness`로 reject한다.
  - `미확인`: 근거가 모자라 확인하지 못했다.
    `불성립`이 없으면 `evidence`로 reject한다.
  - `매핑 누락`: 성립하지 않는 문장이 이 Task나 앞선 `[x]` Task의 목적·검증 조건 어디에도 없다.
    코드가 아니라 매핑 문제이므로 reject하지 않는다.
    그 문장을 담은 다른 Task가 있으면 `task-<nnn>`을 적는다.

## verifier 위임 기준
- Phased에서는 근거를 모으기 전에 verifier agent에 맡긴다.
- Per-Request에서는 main이 직접 판단한다.
  사용자가 독립 검증을 원하면 verifier에 맡긴다.
- 위임 프롬프트에는 `<feature-dir>`, 대상 `task-<nnn>` 제목(Per-Request는 요청 인용), 재검증인지, 변경 범위, 직전 `implement`의 비고·한계와 접근 이탈을 적는다.

## 출력 구조
Phased에서는 아래 모양으로 낸다.
`<…>`는 채울 자리, `|`는 그중 하나를 고른다는 뜻이다.

```markdown
1. 판정: `approved` | `rejected`
2. 대상 Task: task-<nnn>: <제목>
3. 완료되는 요구사항
   - SPEC §5.<N>: `성립` | `불성립` | `미확인` | `매핑 누락` — <근거>
4. 문제
   - 분류: `style/minor` | `correctness` | `design/scope` | `evidence`
   - 수정 소유 단계: `implement` | `implement-init` | `design-init` | `spec-init`
   - <구체적인 문제와 근거>
5. 검증
   - 기준 일치: <관찰한 동작과 그 기준의 출처>
   - 범위·동작 정확성: <범위를 넘거나 못 미친 변경, 깨진 기존 동작>
   - 근거: <변경 내용, 테스트 결과, 또는 한계>
   - 요구사항 판단: <참조한 `SPEC §5.N` 중 이번에 끝나지 않는 것과 이유>
6. 설명
   - <무엇이 어떻게 바뀌었는지 2-3문장>
   - <남은 위험>
```

- 3번은 판정한 `SPEC §5.N`마다 한 줄이다.
  없으면 `없음`으로 쓴다.
- 4번은 `rejected`일 때만, 6번은 `approved`일 때만 쓴다.
  남은 위험은 있을 때만 쓴다.
- 분류가 `evidence`면 `수정 소유 단계` 대신 `- 해소 조건: <다시 검증하려면 필요한 입력·환경>`을 쓴다.
- 문제가 여럿이어도 분류와 수정 소유 단계는 하나만 쓴다.
  - 분류는 `design/scope`, `correctness`, `style/minor`, `evidence` 순서로 앞선 것을 고른다.
  - 수정 소유 단계는 `spec-init`, `design-init`, `implement-init`, `implement` 순서로 앞선 것을 고른다.
  - 분류로 잡히지 않은 근거 부족은 해소 조건과 함께 문제 설명에 적는다.
- 5번에는 판단에 실제로 영향을 준 것만 쓴다.

Per-Request에서는 같은 모양에서 3번, `수정 소유 단계`, `요구사항 판단`을 빼고, 2번에 사용자 요청을 인용한다.

판정할 수 없으면 위 모양 대신 `- 판정 불가: 대상 | 범위 — <후보와 사유>` 한 줄만 낸다.

## reject 분류
분류와 상관없이 reject면 Task는 승인되지 않는다.
분류는 `/implement-loop`의 재시도 방식(`commands/implement-loop.md` §재시도)만 바꾼다.
- `style/minor`: 관례나 작성 기준(`rules/code-common.md`, `implement` §코드 작성)을 어겼지만 동작은 맞다.
- `correctness`: 완료 조건·목적·검증 조건을 못 채우거나, 버그가 있거나, 공개 식별자의 주석이 코드와 다르다.
- `design/scope`: design.md의 결정을 벗어나거나, 요청 범위를 넘거나 못 미친다.
  구현을 고칠지 design.md를 고칠지 정해야 한다.
- `evidence`: 근거를 모으지 못해 판단하지 못했다.

## verify 후처리
main이 하는 일이다.

### approved
1. `매핑 누락`이 있으면 그 문장을 맡는 Task의 참조 필드에 `SPEC §5.N`을 먼저 더한다.
   맡을 Task가 없으면 체크박스를 바꾸지 않고, `commands/implement-init.md` §매핑의 미매핑 처리로 사용자에게 묻는다.
2. Task 체크박스를 `[x]`로 바꾼다.
   접근 이탈이 보고됐으면 그 Task의 접근 필드를 실제 구현에 맞게 고친다.
3. `최근 reject`를 지우고, `승인 근거`를 `<yyyy-MM-dd> <짧은 HEAD SHA | working tree> — <근거 한 줄>`로 쓴다.
4. 모든 Task가 `[x]`면 feature README의 `[ ] IMPLEMENT`를 `[x] IMPLEMENT`로 바꾸고, 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 완료`를 더한다.
   이 feature 때문에 낡은 프로젝트 루트 문서(`commands/project-init.md` §산출 경로)는 고치지 않고 갱신 후보로 알린다.

### rejected
1. `[ ]`인 Task는 그대로 둔다.
   고칠 코드가 앞선 `[x]` Task 쪽에 있어도 이 Task의 재작업으로 보고, 앞선 체크박스는 되돌리지 않는다.
2. `최근 reject`를 `<분류> — <문제 한 줄>`로 쓴다.
3. 이미 `[x]`였던 Task를 재검증하다 reject되면 `[ ]`로 되돌리고 `승인 근거`를 지운다.
   README가 `[x] IMPLEMENT`였으면 `[ ] IMPLEMENT`로 되돌리고 작업 히스토리에 적는다.
4. 문제 항목을 사용자에게 전한다.
   자연어로 `implement` → `verify`를 부른 경우에는 다시 구현하지 않고 사용자 판단을 기다린다.
   다음 `implement`가 같은 Task를 다시 잡는다.
