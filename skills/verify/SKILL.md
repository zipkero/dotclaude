---
name: verify
description: "Judge whether the most recent implement Task satisfies its implement.md verification criteria, and whether any spec.md §5 criteria completed by this Task actually hold. Phased mode runs via the verifier agent; Per-Request mode runs in main. Post-processing is always main's. Returns approved/rejected with evidence."
---

## 역할
verify는 `implement` 바로 다음에 도는 판단 도구로, 두 가지를 본다.
1. **Task 판단** — 방금 만든 Task가 자기 검증 조건을 채웠는가?
2. **완료되는 요구사항 판단** — 이 Task의 approve로 매핑 Task 묶음이 전부 완료되는 `SPEC §5.N`이 있다면, 그 완료 조건이 실제로 성립하는가?

feature 단위 verify 단계를 따로 두지 않는다 — 여러 Task에 걸친 `SPEC §5.N`이 마지막 Task에서 완료될 때, 같은 규칙으로 feature 수준 검증이 일어난다. 체크박스 바꾸기는 §verify 후처리에 둔다.

## 근거 원칙
판단은 **파일·변경 내용·테스트 결과**를 인용해야 하며 대화에서 짐작한 것에 기대지 않는다.

- 최소 근거는 코드 변경 내용, 권장은 변경 내용 + 테스트 결과.
- 내부 계산·조건·변환만 고쳤고 맞게 고쳤는지가 변경 내용에 그대로 보이면, 변경 내용에 기댄 판단도 유효한 근거다.
- "전에 논의했음"은 근거가 아니며, 파일을 다시 읽거나 테스트를 다시 돌린다.
- 참조 필드(`SPEC §5.N`, `ANALYSIS §X.Y`)는 어디에 매핑됐는지 표시일 뿐이며 근거는 본문·변경 내용·테스트 결과에서 가져온다.
- 모은 근거로 맞는지 확인할 수 없으면 reject하고 한계를 밝힌다.

## 판단 순서
- 첫째 기준은 대상 Task의 검증 조건이다.
- 둘째 기준은 매핑된 `SPEC §5.N`과 spec.md의 제약·제외 범위를 어기지 않는지다. 단, 이번 approve로 완료되는 `SPEC §5.N`은
  어기지 않음이 아니라 성립 확인까지 요구한다(§완료되는 요구사항 판정).
- 셋째 기준은 analysis.md의 설계 결정을 벗어나지 않는지다.

## 컨텍스트 로딩
1. Phased mode — 들어가는 조건은 `implement` skill §컨텍스트 로딩과 같다. 이 mode는 verifier agent가 맡는다.
   - spec.md의 완료 조건과 제약·제외 범위를 읽는다 (요구사항 수준 기준).
   - implement.md를 읽는다. 기본 검증 대상은 직전 `implement`가 실행한 Task(아직 `[ ]`이며 판단을 기다리는 상태)이며, 그 Task의 검증 조건 필드를 Task-level 기준으로 삼는다.
   - 사용자가 이미 `[x]`인 특정 Task를 콕 집어 불렀으면 → 재검증 모드. 같은 기준으로 판단한다.
   - 검증할 변경 범위는 기본적으로 아직 commit되지 않은 working tree 변경분이다. 변경이 이미 commit된
     경우(세션을 다시 열고 사용자가 Task를 지목해 부르는 경우 포함), main이 이 skill을 부를 때 변경 범위
     (commit SHA, 파일 목록, 또는 비교 범위)를 명시적으로 넘긴다.
   - 완료되는 요구사항을 계산한다 — 대상 Task를 `[x]`로 쳤을 때 매핑 Task가 전부 `[x]`가 되는
     `SPEC §5.N` 목록. implement.md 참조 필드를 거꾸로 모아 구하며, 목록은 비어 있을 수 있다.
     재검증 모드에서도 같은 규칙으로 계산한다.
   - 설계 뜻과 맞는지가 쟁점일 때 analysis.md Decision Points를 읽는다.
2. 그 외 → Per-Request mode. 요청 범위와 코드 변경 내용만으로 verify한다. 이 mode는 main이 직접 맡으며 verifier agent를 거치지 않는다.
   - 검증할 변경 범위 규칙은 Phased mode와 같다.
   - 어떤 문서도 읽거나 쓰지 않는다.

Phased mode에서 대상 Task를 가려내기 모호하면(여러 개가 기다리거나 직전 implement 대상이 하나로 잡히지 않는 경우), 판단 전에 후보와 사유를 묶어 main에 돌려준다(CLAUDE.md §agent·skill 라우팅).

## 완료되는 요구사항 판정
Phased mode에서 §컨텍스트 로딩이 계산한 완료되는 `SPEC §5.N` 각각에 대해 판단한다. Per-Request mode에는 적용하지 않는다.

- 판단 질문은 "매핑된 Task들의 변경이 **합쳐져서** 이 완료 조건이 성립하는가"다. 개별 Task 통과를 더한 것으로
  대신하지 않고 완료 조건 문장 자체를 기준으로 본다.
- 근거 규칙은 Task 판단과 같다(§근거 원칙). 앞선 `[x]` Task의 산출물이 근거로 필요하면
  해당 파일·테스트를 다시 확인한다.
- 하나라도 성립하지 않으면 Task 검증 조건을 채웠는지와 상관없이 Status는 `rejected`다. category는
  §reject 분류를 따른다(완료 조건 불충족은 `correctness`).

## 출력 구조
1. 판정: `approved` | `rejected`
2. 대상 Task: implement.md Task 제목(Phased) 또는 사용자가 말한 변경(Per-Request)을 인용한다.
3. 검증 — 이번 Task 판단에 실제로 영향을 준 항목만 적는다. 항목을 채우려고 상관없는 spec.md §5나 다른 모듈을 근거로 끌어오지 않는다.
   - 기준 일치 — 관찰한 동작을 평문으로 적고, 필요하면 `SPEC §5.N` / Task 검증 조건 / `ANALYSIS §X.Y` 중 인용한 출처를 덧붙인다. Phased mode에서만 spec·analysis 인용을 두며, Per-Request에서는 사용자 요청과 맞는지만 본다.
   - 범위·동작 정확성
   - 근거 (변경 내용, 테스트 결과, 또는 밝힌 한계)
4. 완료되는 요구사항 — 완료되는 `SPEC §5.N`이 있으면 각각 성립/불성립을 근거와 함께 적고,
   없으면 `없음`으로 적는다. Per-Request mode에서는 항목을 뺀다.
5. rejected인 경우 — 문제
   - 분류: `style/minor` | `correctness` | `design/scope`
   - 구체적인 문제를 근거와 함께 늘어놓는다.
6. approved인 경우 — 설명
   - 무엇이 어떻게 바뀌었는지 (2-3 문장).
   - 남은 위험 (따로 적을 게 있을 때만).

## reject 분류
모든 reject category는 똑같이 Task 승인을 막으며, 풀리기 전까지 체크박스는 `[x]`로 바뀌지 않는다. category는 사용자가 다음 단계를 정하는 데 도움을 주려고만 둔다.
- `style/minor`: 이름 짓기·주석·포맷 등 동작과 무관한 문제로, 정확성은 깨지지 않는다.
- `correctness`: 동작이 spec.md 완료 조건이나 implement.md 검증 조건을 채우지 못하거나, 버그가 들어갔거나, 불변 조건을 깨거나, 잘못된 출력을 낸다.
- `design/scope`: 구현이 analysis.md Decision Points에서 이탈하거나, 요청 범위를 넘거나 못 미치거나, 합의한 경계를 어긴다. 결정이 필요하다 — 구현을 고치거나 analysis.md를 고쳐 쓴다.

## verify 후처리
main 전용 절차다. verifier agent는 이 섹션을 실행하지 않으며, 판단을 돌려준 뒤 멈춘다.

- **Approved**:
  - main이 대상 implement.md Task 체크박스를 `[ ]` → `[x]`로 바꾸고 다른 파일은 건드리지 않는다.
  - 바꾼 뒤 implement.md의 모든 Task가 `[x]`가 되었으면, feature README의 `[ ] IMPLEMENT`를 `[x] IMPLEMENT`로 바꾸고 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 완료` 한 줄을 더한다.
- **Rejected**:
  - 대상 체크박스가 `[ ]`였다면(implement 직후의 보통 경우) 그대로 둔다.
  - 완료되는 요구사항이 성립하지 않아 rejected된 경우도 같다 — 대상 Task 체크박스는 `[ ]`로 남고,
    고치는 일이 앞선 `[x]` Task의 코드에 걸치더라도 같은 Task의 재작업 범위로 본다. 앞선 Task
    체크박스는 되돌리지 않는다.
  - 이미 `[x]`였던 Task를 다시 검증하다가 rejected되면 main이 `[x]` → `[ ]`로 되돌린다. 그래서 implement.md가 더 이상 "모든 Task `[x]`" 상태가 아니면 README의 `[x] IMPLEMENT`를 `[ ] IMPLEMENT`로 되돌리고 작업 히스토리에 그 사실을 한 줄 남긴다.
  - issues와 reject 사유는 사용자에게 전하며, 다음 `implement` 호출이 같은 Task를 다시 잡는다.
- Per-Request mode는 verify 결과를 대화 출력으로만 남기며, 체크박스·README를 고치지 않는다.

## 테스트 evidence 규칙
- verify는 근거를 모을 목적으로만 테스트를 실행한다. 테스트·운영 코드·문서를 고치지 않는다.
- 변경 범위 테스트가 있는데 실행되지 않았다면 한계로 적는다.
- 같은 변경 안에 더하거나 고친 테스트는 통과만으로 근거가 되지 않는다. 구현 변경 내용과 함께 회귀 경우를 실제로 다루는지 확인한다. 테스트 꼼수(assertion 약하게 만들기, 근거 없이 경우 지우기)로 보이면 `correctness`로 reject한다.

테스트 Task 포함 기준은 `commands/implement-init.md` §테스트 Task 포함 기준이, 테스트 코드 작성 범위는 `skills/implement/SKILL.md` §테스트 코드 작성이 소유한다.

## 지침
- 현재 Task와 그 approve로 완료되는 요구사항만 판단한다. 다른 기다리는 Task나 앞으로의 작업에 대한 의견은 두지 않는다.
- 변경 내용의 주석이 `rules/code-common.md` §주석 작성 기준을 어기면 `style/minor`로 reject한다. 주석이 필요한 자리를 비워 둔 경우도 같게 본다.
