---
name: verify
description: >-
  Judge whether the most recent implement Task satisfies its implement.md verification criteria, and whether any spec.md §5 criteria
  completed by this Task actually hold. Returns approved/rejected with evidence.
---

## 역할
verify는 Phased mode에서 `implement` 다음에 도는 판단 도구이며, Per-Request mode에서는 사용자가 부를 때만 돈다.
두 가지를 본다.
1. **Task 판단** — 방금 만든 Task가 자기 검증 조건을 채웠는가?
2. **완료되는 요구사항 판단** — 이 Task의 approve로 매핑 Task 묶음이 전부 완료되는 `SPEC §5.N`이 있다면, 그 완료 조건이 실제로 성립하는가?

Task `[x]`는 현재 승인된 spec.md·design.md 기준으로 검증되었다는 뜻이며, 상위 문서 재작성으로 초기화된 Task는 기존 구현 결과가 남아 있어도 현재 기준으로 다시 검증한다.

## 근거 원칙
- 판단은 파일·변경 내용·테스트 결과를 인용한다.
  최소 근거는 코드 변경 내용이고, 권장은 변경 내용 + 테스트 결과다.
- 앞선 대화의 논의는 근거가 아니며, 파일을 다시 읽거나 테스트를 다시 돌린다.
- 참조 필드(`SPEC §5.N`, `DESIGN §X.Y`)는 매핑 표시이며 근거는 본문·변경 내용·테스트 결과에서 가져온다.
- 모은 근거로 확인할 수 없으면 `evidence`로 reject하고 한계를 밝힌다.

## 판단 순서
구현과 테스트를 평가하기 전에 판정 기준 목록을 출처와 함께, 각각 독립적으로 판정할 수 있는 문장으로 정한다.
1. 대상 Task의 `목적`이 적은 동작이 성립하는가. 검증 조건 통과로 대신하지 않으며, spec.md·design.md가 그 경우를 다루지 않는 것은 성립의 근거가 아니다.
2. 대상 Task의 검증 조건.
3. 매핑된 `SPEC §5.N`과 spec.md의 제약·제외 범위를 어기지 않는가.
4. design.md의 설계 결정을 벗어나지 않는가.

## 컨텍스트 로딩
1. Phased mode — 들어가는 조건은 `implement` skill §컨텍스트 로딩과 같되, "implement 뜻"을 "검증 뜻"으로 읽는다.
   - spec.md의 완료 조건·제약·제외 범위와 implement.md를 읽는다.
   - 대상은 직전 `implement`가 실행한, 판단을 기다리는 `[ ]` Task이며 그 검증 조건이 Task-level 기준이다.
     사용자가 이미 `[x]`인 Task를 콕 집어 부르면 같은 기준으로 재검증한다.
   - 대상이 하나로 잡히지 않으면(여러 개가 기다리거나 직전 implement 대상이 분명하지 않음) 판단 전에 멈춘다.
     verifier는 후보와 사유를 main에 돌려주고, main이 판단하는 경우에는 사용자에게 확인한다.
   - 완료되는 요구사항은 대상 Task를 `[x]`로 쳤을 때 매핑 Task가 전부 `[x]`가 되는 `SPEC §5.N`이다.
     implement.md 참조 필드를 거꾸로 모아 구하며 비어 있을 수 있다.
2. Per-Request mode — 그 밖의 경우다.
   요청 범위와 코드 변경 내용만으로 판단하고 feature 산출물을 읽거나 쓰지 않는다.

검증할 변경 범위는 두 mode 모두 기본적으로 아직 commit되지 않은 working tree 변경분이다.
- 이미 commit됐으면(세션을 다시 열고 Task를 지목한 경우 포함) main이 commit SHA·파일 목록·비교 범위를 넘긴다.
- reject 뒤 같은 Task를 다시 검증할 때는 reject 사유를 고친 변경분이며, 앞 판정에서 성립한 항목 중 그 변경분 파일을 근거로 삼지 않은 것만 유지한다.
  main은 그 범위를 직전 `implement`의 고친 파일 목록에서 구하고, 없으면 git 이력에서 후보를 뽑아 사용자에게 확인받는다.
- 범위를 확정하지 못하면 판정을 내지 않고 멈춘다.

## verifier 위임 기준
- Phased mode에서 변경이 여러 파일에 걸치고 동작·상태·외부 I/O·동시성·경계 중 하나 이상에 영향을 주며, 근거를 모으는 데 파일·테스트를 여러 차례 열어야 하면 근거를 모으기 전에 verifier agent에 맡긴다.
- Per-Request mode는 main이 직접 판단하고, 사용자가 독립 검증을 요청하면 같은 기준으로 verifier agent에 맡긴다.
- 위임 프롬프트에는 `<feature-dir>`, 대상 Task의 `task-<nnn>` 제목(Per-Request는 검증할 요청 인용), 재검증 여부, 변경 범위, 직전 `implement`의 비고·한계를 적는다.
  spec.md·design.md·implement.md의 기준 본문은 옮기거나 요약하지 않는다.

## 완료되는 요구사항 판정
- Phased mode에서 완료되는 `SPEC §5.N`마다 "매핑된 Task들의 변경이 합쳐져서 이 완료 조건 문장이 성립하는가"를 본다.
  근거 규칙은 §근거 원칙과 같고, 앞선 `[x]` Task의 산출물이 필요하면 그 파일·테스트를 다시 확인한다.
- 하나라도 성립하지 않으면 Task 검증 조건과 상관없이 판정은 `rejected`이고 분류는 `correctness`다.
- 성립하지 않는 문장이 대상 Task나 앞선 `[x]` Task의 `목적`·검증 조건에 없으면 코드가 아니라 매핑의 흠이다.
  reject하지 않고 §출력 구조 4번에 `불성립 — 매핑 누락`으로 적으며, 그 문장을 담은 다른 Task가 있으면 `task-<nnn>`을 밝힌다.

## 출력 구조
Phased mode 출력은 아래 모양이다.
`<…>`는 채울 자리, `|`는 그중 하나이며, 그 밖의 글자는 적힌 그대로 쓴다.

```markdown
<!-- prowl-workflow: v1 verify -->
1. 판정: `approved` | `rejected`
2. 대상 Task: `task-<nnn>: <제목>`
3. 검증
   - 기준 일치: <관찰한 동작. 필요하면 인용한 출처 `SPEC §5.N` / Task `목적`·검증 조건 / `DESIGN §X.Y`>
   - 범위·동작 정확성: <…>
   - 근거: <변경 내용, 테스트 결과, 또는 밝힌 한계>
   - 요구사항 판단: <완료되는 `SPEC §5.N`의 판단 근거. 이번에 완료되지 않는 `SPEC §5.N`이 있으면 그 이유>
4. 완료되는 요구사항
   - SPEC §5.<N>: `성립` | `불성립` — <근거>
5. 문제
   - 분류: `style/minor` | `correctness` | `design/scope`
   - 수정 소유 단계: `implement` | `implement-init` | `design-init` | `spec-init`
   - <구체적인 문제와 근거>
6. 설명
   - <무엇이 어떻게 바뀌었는지 2-3 문장>
   - <남은 위험>
```

분류가 `evidence`면 5번은 아래 모양이다.

```markdown
5. 문제
   - 분류: `evidence`
   - 해소 조건: <다시 검증하는 데 필요한 입력·환경·조건>
   - <구체적인 문제와 근거>
```

- 3번에는 이번 Task 판단에 실제로 영향을 준 항목만 적는다.
- 4번은 §컨텍스트 로딩이 계산한 완료되는 `SPEC §5.N`마다 한 줄이다.
  없으면 4번은 `4. 완료되는 요구사항: 없음` 한 줄이다.
- 5번은 `rejected`일 때, 6번은 `approved`일 때만 둔다.
  6번의 남은 위험은 따로 적을 게 있을 때만 둔다.
- 여러 자리를 고쳐야 하면 수정 소유 단계는 파이프라인상 가장 앞선 단계다.

Per-Request mode 출력은 표시 줄, 3번의 요구사항 판단, 4번이 없는 같은 구조이며, 2번에는 사용자가 말한 변경을 인용한다.

## reject 분류
모든 분류는 똑같이 Task 승인을 막으며, 분류에 따라 갈리는 것은 `/implement-loop`의 재시도 처리뿐이다(`commands/implement-loop.md` §재시도).
- `style/minor`: 이름 짓기·주석·포맷처럼 적용되는 프로젝트·언어 관례와 `rules/code-common.md` §주석·implement §지침을 어긴 문제로, 정확성은 깨지지 않는다.
- `correctness`: 동작이 spec.md 완료 조건이나 implement.md의 `목적`·검증 조건을 채우지 못하거나, 버그가 들어갔거나, 불변 조건을 깨거나, 잘못된 출력을 내거나, 공개 식별자의 주석이 적은 동작·계약이 코드와 어긋난다.
- `design/scope`: 구현이 design.md Decision Points에서 이탈하거나, 요청 범위를 넘거나 못 미치거나, 합의한 경계를 어긴다.
  구현을 고칠지 design.md를 고쳐 쓸지 결정이 필요하다.
- `evidence`: 근거를 모으지 못해 성립 여부를 확인하지 못했다.

## verify 후처리
main 전용 절차다.

- **Approved**:
  - 매핑 누락이 적혀 있으면 그 문장을 소유하는 Task의 참조 필드에 해당 `SPEC §5.N`을 먼저 더한다.
    소유하는 Task가 없으면 체크박스를 바꾸지 않고 `commands/implement-init.md` §매핑의 미매핑 결정으로 올린다.
  - 대상 Task 체크박스를 `[ ]` → `[x]`로 바꾸고, 직전 `implement`가 접근 이탈을 보고했으면 그 Task의 접근 필드도 실제 구현대로 고친다.
    다른 파일은 건드리지 않는다.
  - 그래서 implement.md의 모든 Task가 `[x]`가 되면 feature README의 `[ ] IMPLEMENT`를 `[x] IMPLEMENT`로 바꾸고 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 완료`를 더한다.
    이때 이번 feature로 낡은 프로젝트 루트 문서를 고치지 않고 보고한다.
    후보는 `docs/product.md`(사용자에게 보이는 동작 추가), `docs/design.md`(feature 밖에서도 성립하는 결정), `ROADMAP.md`(마일스톤 전환 기준 충족), 루트 `README.md`(설치·실행 방법 변경)다.
- **Rejected**:
  - `[ ]`였던 대상 체크박스는 그대로 둔다.
    완료되는 요구사항 불성립을 고치는 일이 앞선 `[x]` Task의 코드에 걸쳐도 같은 Task의 재작업으로 보고 앞선 체크박스는 되돌리지 않는다.
  - 이미 `[x]`였던 Task를 재검증하다 rejected되면 `[ ]`로 되돌린다.
    README가 `[x] IMPLEMENT`였으면 `[ ] IMPLEMENT`로 되돌리고 작업 히스토리에 한 줄 남긴다.
  - §출력 구조의 문제 항목을 사용자에게 전한다.
    자연어 `implement` → `verify` 경로에서는 다시 구현하지 않고 사용자 판단으로 올리며, 다음 `implement` 호출이 같은 Task를 다시 잡는다.

## 테스트 evidence 규칙
- verify는 근거를 모을 때만 테스트를 실행하고, 테스트·운영 코드·문서를 고치지 않는다.
- 변경 범위 테스트가 있는데 실행되지 않았다면 한계로 적는다.
- 같은 변경 안에 더하거나 고친 테스트는 통과만으로 근거가 되지 않으며, 구현 변경과 함께 회귀 경우를 실제로 다루는지 확인한다.
  assertion을 약하게 만들거나 근거 없이 경우를 지운 테스트는 `correctness`로 reject한다.
