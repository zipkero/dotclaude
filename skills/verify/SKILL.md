---
name: verify
description: >-
  Judge whether the most recent implement Task satisfies its implement.md verification criteria, and whether any spec.md §5 criteria
  completed by this Task actually hold. Delegation to the verifier agent follows §verifier 위임 기준;
  post-processing is always main's. Returns approved/rejected with evidence.
---

## 역할
verify는 Phased mode에서 `implement` 다음에 도는 판단 도구이며, Per-Request mode에서는 사용자가 부를 때만 돈다. 두 가지를 본다.
1. **Task 판단** — 방금 만든 Task가 자기 검증 조건을 채웠는가?
2. **완료되는 요구사항 판단** — 이 Task의 approve로 매핑 Task 묶음이 전부 완료되는 `SPEC §5.N`이 있다면, 그 완료 조건이 실제로 성립하는가?

feature 단위 verify 단계를 따로 두지 않는다 — 여러 Task에 걸친 `SPEC §5.N`이 마지막 Task에서 완료될 때, 같은 규칙으로 feature 수준 검증이 일어난다.
체크박스 바꾸기는 §verify 후처리에 둔다. Task `[x]`는 현재 승인된 spec.md·design.md 기준으로 검증되었다는 뜻이며,
상위 문서 재작성으로 초기화된 Task는 기존 구현 결과가 남아 있어도 현재 기준으로 다시 검증해야 한다.

## 근거 원칙
판단은 **파일·변경 내용·테스트 결과**를 인용한다.

- 최소 근거는 코드 변경 내용, 권장은 변경 내용 + 테스트 결과.
- 내부 계산·조건·변환만 고쳤고 맞게 고쳤는지가 변경 내용에 그대로 보이면, 변경 내용에 기댄 판단도 유효한 근거다.
- "전에 논의했음"은 근거가 아니며, 파일을 다시 읽거나 테스트를 다시 돌린다.
- 참조 필드(`SPEC §5.N`, `DESIGN §X.Y`)는 어디에 매핑됐는지 표시일 뿐이며 근거는 본문·변경 내용·테스트 결과에서 가져온다.
- 모은 근거로 맞는지 확인할 수 없으면 reject하고 한계를 밝힌다.

## 판단 순서
구현과 테스트를 평가하기 전에 판정 기준 목록부터 다음 순서로 확정한다. 각 기준은 출처와 함께 독립적으로 판정할 수 있는 문장으로 적는다.

- 첫째 기준은 대상 Task의 검증 조건이다.
- 둘째 기준은 매핑된 `SPEC §5.N`과 spec.md의 제약·제외 범위를 어기지 않는지다. 단, 이번 approve로 완료되는 `SPEC §5.N`은
  어기지 않음이 아니라 성립 확인까지 요구한다(§완료되는 요구사항 판정).
- 셋째 기준은 design.md의 설계 결정을 벗어나지 않는지다.

## 컨텍스트 로딩
1. Phased mode — 들어가는 조건은 `implement` skill §컨텍스트 로딩과 같다.
   - spec.md의 완료 조건과 제약·제외 범위를 읽는다 (요구사항 수준 기준).
   - implement.md를 읽는다. 기본 검증 대상은 직전 `implement`가 실행한 Task(아직 `[ ]`이며 판단을 기다리는 상태)이며, 그 Task의 검증 조건 필드를
     Task-level 기준으로 삼는다.
   - 사용자가 이미 `[x]`인 특정 Task를 콕 집어 불렀으면 → 재검증 모드. 같은 기준으로 판단한다.
   - 검증할 변경 범위는 기본적으로 아직 commit되지 않은 working tree 변경분이다. 변경이 이미 commit된
     경우(세션을 다시 열고 사용자가 Task를 지목해 부르는 경우 포함), main이 이 skill을 부를 때 변경 범위
     (commit SHA, 파일 목록, 또는 비교 범위)를 명시적으로 넘긴다.
     main은 그 범위를 직전 `implement` 반환의 고친 파일 목록에서 구하고, 그것이 없으면 git 이력에서 후보를 뽑아
     사용자에게 확인받는다. 범위를 확정하지 못하면 판정을 내지 않고 멈춘다.
   - 완료되는 요구사항을 계산한다 — 대상 Task를 `[x]`로 쳤을 때 매핑 Task가 전부 `[x]`가 되는
     `SPEC §5.N` 목록. implement.md 참조 필드를 거꾸로 모아 구하며, 목록은 비어 있을 수 있다.
     재검증 모드에서도 같은 규칙으로 계산한다.
   - 설계 뜻과 맞는지가 쟁점일 때 design.md Decision Points를 읽는다.
2. 그 외 → Per-Request mode. 요청 범위와 코드 변경 내용만으로 verify한다.
   - 검증할 변경 범위 규칙은 Phased mode와 같다.
   - Phased 산출물(spec.md·design.md·implement.md)을 읽거나 쓰지 않는다.

Phased mode에서 대상 Task를 가려내기 모호하면(여러 개가 기다리거나 직전 implement 대상이 하나로 잡히지 않는 경우) 판단 전에 멈춘다. verifier는 후보와
사유를 묶어 main에 돌려주고, main이 직접 판단하는 경우에는 사용자에게 확인한다.

## verifier 위임 기준
- Phased mode에서 변경이 여러 파일에 걸치고 동작·상태·외부 I/O·동시성·경계 중 하나 이상에 영향을 주며,
  근거를 모으는 데 파일·테스트를 여러 차례 열어야 하면 verifier agent에 맡긴다.
  같은 조건이라도 몇 번의 도구 호출로 근거가 모이면 main이 직접 판단한다.
- Per-Request mode는 main이 직접 판단한다. 사용자가 독립 검증을 따로 요청하면 같은 기준으로 verifier agent에 맡긴다.
- 변경 내용만으로 판정할 수 있는 문서·오타·정적 설정 문구는 main이 직접 판단한다.
- 위임 여부는 근거를 모으기 전에 정한다.
- 위임 프롬프트에 `<feature-dir>`, 대상 Task의 `task-<nnn>` 제목, 재검증 모드인지 여부를 적는다.
  verifier는 main의 대화를 받지 않으므로 §컨텍스트 로딩이 말하는 "직전 `implement`"를 스스로 구할 수 없다.
  Per-Request 위임에는 대상 Task 대신 검증할 사용자 요청을 인용한다.

## 완료되는 요구사항 판정
Phased mode에서 §컨텍스트 로딩이 계산한 완료되는 `SPEC §5.N` 각각에 대해 판단한다. Per-Request mode에는 적용하지 않는다.

- 판단 질문은 "매핑된 Task들의 변경이 **합쳐져서** 이 완료 조건이 성립하는가"다. 개별 Task 통과를 더한 것으로
  대신하지 않고 완료 조건 문장 자체를 기준으로 본다.
- 근거 규칙은 Task 판단과 같다(§근거 원칙). 앞선 `[x]` Task의 산출물이 근거로 필요하면
  해당 파일·테스트를 다시 확인한다.
- 하나라도 성립하지 않으면 Task 검증 조건을 채웠는지와 상관없이 판정은 `rejected`다. 분류는
  §reject 분류를 따른다(완료 조건 불충족은 `correctness`).

## 출력 구조
1. 판정: `approved` | `rejected`
2. 대상 Task: implement.md Task 제목(Phased) 또는 사용자가 말한 변경(Per-Request)을 인용한다.
3. 검증 — 이번 Task 판단에 실제로 영향을 준 항목만 적는다. 항목을 채우려고 상관없는 spec.md §5나 다른 모듈을 근거로 끌어오지 않으며,
   다른 Task나 앞으로의 작업에 대한 의견도 두지 않는다.
   - 기준 일치 — 관찰한 동작을 평문으로 적고, 필요하면 `SPEC §5.N` / Task 검증 조건 / `DESIGN §X.Y` 중 인용한 출처를 덧붙인다. Phased mode에서만
     spec·analysis 인용을 두며, Per-Request에서는 사용자 요청과 맞는지만 본다.
   - 범위·동작 정확성
   - 근거 (변경 내용, 테스트 결과, 또는 밝힌 한계)
4. 완료되는 요구사항 — 완료되는 `SPEC §5.N`이 있으면 각각 성립/불성립을 근거와 함께 적고,
   없으면 `없음`으로 적는다. Per-Request mode에서는 항목을 뺀다.
5. rejected인 경우 — 문제
   - 분류: `style/minor` | `correctness` | `design/scope`
   - 수정 소유 단계: `implement` | `implement-init` | `design-init` | `spec-init` 중 하나. 여러 자리를 고쳐야 하면 파이프라인상 가장 앞선
     단계를 적는다.
   - 구체적인 문제를 근거와 함께 적는다.
6. approved인 경우 — 설명
   - 무엇이 어떻게 바뀌었는지 (2-3 문장).
   - 남은 위험 (따로 적을 게 있을 때만).

## reject 분류
모든 reject 분류는 똑같이 Task 승인을 막는다.
- `style/minor`: 이름 짓기·주석·포맷처럼 적용되는 프로젝트·언어 관례와 implement §주석·§지침을 어긴 문제로, 정확성은 깨지지 않는다.
- `correctness`: 동작이 spec.md 완료 조건이나 implement.md 검증 조건을 채우지 못하거나, 버그가 들어갔거나, 불변 조건을 깨거나, 잘못된 출력을 낸다.
- `design/scope`: 구현이 design.md Decision Points에서 이탈하거나, 요청 범위를 넘거나 못 미치거나, 합의한 경계를 어긴다. 결정이 필요하다 — 구현을
  고치거나 design.md를 고쳐 쓴다.

## verify 후처리
main 전용 절차다. verifier agent는 이 섹션을 실행하지 않으며, 판단을 돌려준 뒤 멈춘다.

- **Approved**:
  - main이 대상 implement.md Task 체크박스를 `[ ]` → `[x]`로 바꾸고 다른 파일은 건드리지 않는다.
  - 바꾼 뒤 implement.md의 모든 Task가 `[x]`가 되었으면, feature README의 `[ ] IMPLEMENT`를 `[x] IMPLEMENT`로 바꾸고 작업 히스토리에
    `- <yyyy-MM-dd>: IMPLEMENT 완료` 한 줄을 더한다.
  - IMPLEMENT 완료 시 프로젝트 루트에 있는 문서 중 이번 feature로 낡은 것을 보고한다. 파일은 고치지 않으며 갱신 여부와 내용은 사용자가 정한다.
    후보 판정 — spec.md §5가 사용자에게 보이는 동작을 더했으면 `docs/product.md`,
    design.md §5에 이 feature 밖에서도 성립하는 결정이 있으면 `docs/design.md`,
    담당 마일스톤의 전환 기준을 채웠으면 `ROADMAP.md`, 설치·실행 방법이 바뀌었으면 루트 `README.md`.
    없는 문서와 해당하지 않는 후보는 보고에서 뺀다.
- **Rejected**:
  - 대상 체크박스가 `[ ]`였다면(implement 직후의 보통 경우) 그대로 둔다.
  - 완료되는 요구사항이 성립하지 않아 rejected된 경우도 같다 — 대상 Task 체크박스는 `[ ]`로 남고,
    고치는 일이 앞선 `[x]` Task의 코드에 걸치더라도 같은 Task의 재작업 범위로 본다. 앞선 Task
    체크박스는 되돌리지 않는다.
  - 이미 `[x]`였던 Task를 다시 검증하다가 rejected되면 main이 `[x]` → `[ ]`로 되돌린다. 그래서 implement.md가 더 이상 "모든 Task `[x]`" 상태가 아니면
    README의 `[x] IMPLEMENT`를 `[ ] IMPLEMENT`로 되돌리고 작업 히스토리에 그 사실을 한 줄 남긴다.
  - §출력 구조의 문제 항목을 사용자에게 전하며, 다음 `implement` 호출이 같은 Task를 다시 잡는다.
  - 자연어 `implement` → `verify` 경로에서는 reject를 자동으로 다시 구현하지 않고 사용자 판단으로 올린다.
    자동 재시도는 `/implement-loop`만 하며, 그 한도는 `commands/implement-loop.md` §재시도가, 정지 조건은 같은 파일 §정지 조건이 소유한다.
- Per-Request mode는 verify 결과를 대화 출력으로만 남기며, 체크박스·README를 고치지 않는다.

## 테스트 evidence 규칙
- verify는 근거를 모을 목적으로만 테스트를 실행한다. 테스트·운영 코드·문서를 고치지 않는다.
- 변경 범위 테스트가 있는데 실행되지 않았다면 한계로 적는다.
- 같은 변경 안에 더하거나 고친 테스트는 통과만으로 근거가 되지 않는다. 구현 변경 내용과 함께 회귀 경우를 실제로 다루는지 확인한다. 테스트
  꼼수(assertion 약하게 만들기, 근거 없이 경우 지우기)로 보이면 `correctness`로 reject한다.

테스트 Task 포함 기준은 `commands/implement-init.md` §테스트 Task 포함 기준이,
테스트 코드 작성 범위는 `skills/implement/SKILL.md` §테스트 코드 작성이 소유한다.
