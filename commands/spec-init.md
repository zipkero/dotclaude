---
description: Create spec.md (requirements + completion criteria) under features/<feature-dir>/ and initialize the feature README
argument-hint: "<feature-name>"
disable-model-invocation: true
---

> 사용 시점: Phased 흐름의 첫 단계로, `/design-init` / `/implement-init`이 참조하는 SPEC을 만든다.

`features/<feature-dir>/spec.md`를 작성하고 `features/<feature-dir>/README.md`를 초기화한다. `<feature-dir>` 전체 형식과 만드는 룰은 §산출 경로에
둔다. SPEC은 요구사항 수준에서 **무엇이 있어야 하는가**(범위·목표·제약·제외·완료 조건)를 잡는다.

Feature name: $ARGUMENTS

## 역할
- design.md와 implement.md가 참조하는 기준 문서다.
- 정적 문서이며 진행 상황을 추적하는 문서가 아니다. 이후 단계는 SPEC을 수정하지 않고, 고쳐야 하면 `/spec-init` 재실행으로 되돌아온다.
- 요구사항 수준의 완료 조건만 다룬다 — "X·Y·Z가 관찰될 때 feature가 완성되었다고 본다."

## 전제 조건
- feature name이 비어 있으면 중단한다.
  - 안내: "feature name을 인자로 전달하세요. 예: `/spec-init payment-integration`"
- 작성 전에 범위·목표·제약·제외 범위·완료 조건의 해석 차이가 결과를 실제로 바꾸면 질문으로 정리한다.
  질문 방식과 모호함 구분은 CLAUDE.md §요청 해석이 소유한다.
- 미확정 판단이 남아 있으면 추정으로 채워 spec.md를 생성하지 않는다.
- 질문으로 정리한 판단은 대화에만 남기지 않고 §1–§5 중 맞는 섹션에 반영한다.

## 산출 경로
`features/`의 위치는 `commands/project-init.md` §대상 프로젝트 루트로 확인한 루트 바로 아래다.

폴더 전체 이름 `<feature-dir>` = `<yyyyMMdd>-<nnn>-<feature-name>` 으로 자동 산출한다.
- `<feature-name>`: `$ARGUMENTS`로 받은 슬러그.
- `<yyyyMMdd>`: `/spec-init` 실행일.
- `<nnn>`: 같은 날 순번 (`001`부터). `features/` 아래에서 `<yyyyMMdd>-` prefix로 시작하는 기존 폴더 중 가장 큰 번호의 다음 값으로 정한다. 같은 날 첫
  feature이면 `001`.

같은 날 같은 `<feature-name>`으로 재실행하면(`features/<yyyyMMdd>-<nnn>-<feature-name>` 형태로 정확히 일치하는 폴더가 이미 있으면) 새 `<nnn>`을 매기지
않고 그 기존 폴더를 재사용한다. 그 안의 spec.md / README.md / design.md / implement.md에는 아래 §덮어쓰기 규칙이 그대로 적용된다.

산출물 경로:
- `features/<feature-dir>/`에 두는 문서는 `spec.md`, `design.md`, `implement.md`, `README.md` 넷뿐이다.
- `features/<feature-dir>/spec.md`
- `features/<feature-dir>/README.md` (생성하거나 갱신)
- `features/<feature-dir>/` 디렉토리가 없으면 만든다.

## 덮어쓰기 규칙
- `spec.md`가 이미 있으면 덮어쓰기 전에 사용자 확인을 받는다.
- `design.md`나 `implement.md`가 이미 있으면, SPEC을 덮어쓸 때 그 내용이 무효화될 수 있음을 사용자에게 경고하고 명시적 확인을 받은 뒤에만 진행한다.
  이후 design.md와 implement.md의 영향받은 섹션을 갱신해야 함을 사용자에게 상기시킨다 (CLAUDE.md §문서 구조 참고).
- `README.md`가 이미 있으면 새로 만들지 않고 §README.md 구조 말미 규칙을 적용한다. 하위 승인 상태 초기화는
  §재작성 시 하위 승인 상태 초기화를 따른다.

## 재작성 시 하위 승인 상태 초기화
`/spec-init`으로 기존 spec.md를 다시 쓰거나 `/design-init`으로 기존 design.md를 다시 쓸 때, 하위 승인 상태를 다음
규칙으로 초기화한다. 두 재작성에 공통 적용되며 규칙 본문은 이 자리 하나뿐이다.
- 초기화 대상: feature README.md 상태판의 `IMPLEMENT`를 `[ ]`로, implement.md의 모든 Task 체크박스를 `[ ]`로
  되돌린다. `/spec-init` 재작성이면 `DESIGN`도 `[ ]`로 되돌린다.
- 보존 대상: implement.md·design.md 파일 자체, 각 Task의 내용·ID·순서. README.md 상태판의 `SPEC`은 이 규칙이
  건드리지 않는다.
- 작업 히스토리에 `- <yyyy-MM-dd>: <SPEC|DESIGN> 재작성으로 하위 승인 상태 초기화` 한 줄을 남기고 되돌린 항목을 함께 적는다.
- 각 체크박스가 뜻하는 불변식은 `[x] DESIGN`은 `commands/design-init.md` §역할이,
  Task 체크박스는 `skills/verify/SKILL.md` §역할이, `[x] IMPLEMENT`는 같은 파일 §verify 후처리가 정의한다.

## 요구사항 확정
`/spec-init` 작성 전에 무엇을 요구사항으로 받아들일지 다음 순서로 정한다.

- 조사: 조사 대상 루트는 `commands/project-init.md` §대상 프로젝트 루트를 따라 확인한다. 그 루트의
  `README.md`·`ROADMAP.md`·`docs/product.md`·`docs/design.md` 중 있는 문서만 조사하고, 없는 문서는 조사와
  기록을 모두 건너뛴다. README에서는 현재 확인된 동작만 가져온다. ROADMAP에서는 이 feature가 속한 마일스톤의 결과·의존 관계·전환 기준·범위 경계를 본다.
  `docs/product.md`에서는 관련 사용자 흐름·외부 동작·설정·정책을 가져온다. `docs/design.md`에서는 프로젝트
  수준 확정 제약·확정된 설계 결정만 가져온다. 제안·미확정 결정은 사용자가 확정한 뒤에 요구사항이 된다.
- 지정 문서: 사용자가 저장소 안의 다른 문서를 이 feature의 입력으로 지정하면 그 문서도 같은 조사 대상으로 본다.
  위 네 문서를 대체하지 않고 더한다. 가져오는 기준은 문서가 담은 내용을 따른다 — 확정된 설계 결정과 제약은
  `docs/design.md`와 같게, 사용자에게 보이는 동작은 `docs/product.md`와 같게 다룬다.
- 기록 위치: 조사에 쓴 출처(경로 + 관련 섹션 제목)는 spec.md §1 범위의 입력 맥락에 남긴다.
- 본문 반영 의무: 거기서 가져온 요구사항·제약은 링크만 남기지 않고 §2 목표 / §3 제약 / §5 완료 조건 본문에 자체
  완결적으로 반영한다. 조사한 문서끼리 또는 현재 코드와 어긋나 범위·완료 조건이 갈리면 §전제 조건의 질문 게이트를
  따른다.

무엇을 요구사항으로 받아들일지는 다음 세 기준으로 가른다.
1. 사용자가 예시로 든 구현 방식·비교 대상은 사용자가 확정하기 전까지 요구사항이 아니다.
2. 사용자가 반복해서 강조한 문제·위험·운영 조건은 §2 목표 / §3 제약 / §5 완료 조건 후보로 본다.
3. feature 범위는 담당 마일스톤 안에서 확인된 최종 사용 가능 상태를 기준으로 잡고, 초기 구현 가능 범위로
   축소하지 않는다.

## spec.md 구조

### 승인 전 확인
- 사용자가 SPEC 승인 전에 답해야 할 feature 고유의 판단 질문을 만들 수 있을 때만 이 섹션을 두고, 없으면 빈 섹션 없이 생략한다.
- 사용자가 항목에 답하면 `/spec-init` 재실행으로 전문을 다시 쓰면서 그 결과를 §1–§5 중 맞는 섹션에 반영하고 해당 항목을 이 섹션에서 지운다.
  사용자가 명시적으로 보류한 항목은 `- (보류) <판단 질문>. 관련 본문: §N` 형태로 남긴다.
  남아 있는 항목은 아직 답을 받지 않은 질문이라는 뜻이며, 이후 단계는 이 표기로 답을 받았는지 판정한다.
- 항목은 `- <판단 질문>. 관련 본문: §N` 형식으로 쓴다. 질문에는 그 feature에서 무엇이 걸려 있는지가 드러나야 하며,
  어느 feature에나 그대로 성립하는 질문("범위가 의도와 맞는지 확인" 류)은 두지 않는다.
- 본문을 요약·복제하는 진술은 두지 않는다 — 본문에서 파생 가능한 수치·요약이나 "승인하면 요구사항이 고정된다" 같은 문서 타입 상수가 그 예다.
- 보류로 확정된 항목만 §3 제약 또는 §4 제외 범위에 두고, 여기에는 그에 대한 판단 질문만 둔다. 범위를 정하지 못한 모호함은 문서에 담지 않고 쓰기 전에
  질문으로 정리한다(§전제 조건).
- §1–§5 앞에 두는 서문이며 번호를 매기지 않는다. `§N` 참조 대상이 아니다. 본문 섹션을 갱신할 때 질문과 위치 참조가 여전히 유효한지 함께
  확인한다.

### 1. 범위
- 이 feature가 다루는 영역. 작업의 경계.
- 입력 맥락: 조사 출발점이 되는 파일·오류 메시지·기존 동작. 대화에서 나온 단서를 남겨
  design 단계가 대화 없이 재개할 수 있게 한다. 없으면 생략한다.
  `/spec-init` 전에 설계를 논의했다면 그 논의에서 사용자가 정한 방향과, 검토했으나 접은 접근을 접은 이유와 함께 남긴다.
  설계 판단 자체는 design.md 소관이므로 여기에는 논의의 출발점만 적는다.

### 2. 목표
- 이 작업이 존재하는 이유. 사용자·이해관계자에게 어떤 결과를 만들어내는지.

### 3. 제약
- 엄격한 한계: 성능, 호환성, 규제, 플랫폼, 일정, 의존성.

### 4. 제외 범위
- 명시적으로 범위 밖인 항목. design·implement 단계에서의 범위 확장을 막는다.

### 5. 완료 조건
- feature가 완성되었음을 신호하는 관찰 가능한 조건들.
- 요구사항 수준은 밖에서 관찰 가능한 동작을 적고, Task 수준(implement.md)은 내부 실행을 적는다.
- "관찰 가능"의 의미는 대상 유형에 따라 달라지며, 관찰자가 항상 사람인 것은 아니다.
  - UI → 사용자에게 보이는 화면·인터랙션
  - Library/SDK → 호출자에게 반환되는 값·예외
  - CLI → stdout / stderr / exit code
  - Backend API → HTTP response·status code
  - Data pipeline → DB row·event·후속 소비용 파일 산출물
  - Infra/ops → health endpoint·metric·log signal
- 동작 보존이 조건이면 무엇과 비교하는지 함께 적는다.
- 각 기준은 동작을 관찰함으로써 검증할 수 있어야 한다.
- `verify`는 각 Task를 판단할 때 이 기준들을 직접 인용한다.
- 각 조건은 번호 목록(`1.`, `2.`, …)으로 쓴다.
  N번 항목은 이후 단계(design.md·implement.md)에서 `SPEC §5.N`으로 참조된다 — design.md 본문 인라인 인용과
  implement.md 참조 필드의 추적 단위다. 이 규칙은 `SPEC §5.N` 표기만 소유한다.
  접두사 없는 `§5`는 각 문서가 자기 5번 섹션을 가리킬 때 쓰는 별개 표기다.
- 번호는 영구 식별자다. 기존 번호는 재배열·삭제·재번호하지 않고 보존하며, 새 조건은 다음 번호로만 추가한다.

반례 (내부 실행 — design.md / implement.md에 들어갈 내용이며 spec.md가 아니다):
- "OrderListService가 DB에서 주문 목록을 가져온다"

## README.md 구조 (여기서 초기화)
```markdown
# <feature-name>

## 요약
<spec.md §1–§2 기반 1-2줄 설명>

## 상태
- [x] SPEC
- [ ] DESIGN
- [ ] IMPLEMENT

## 문서
- [spec.md](./spec.md)
- [design.md](./design.md) (DESIGN 단계에서 생성)
- [implement.md](./implement.md) (IMPLEMENT 단계에서 생성)

## 작업 히스토리
- <yyyy-MM-dd>: SPEC 작성
```

README.md가 이미 있으면 기존 문서 섹션은 유지하고 작업 히스토리를 한 줄 추가한다. 상태 섹션 처리는 §재작성 시 하위 승인
상태 초기화를 따른다.

## 금지
- 설계·아키텍처·데이터 흐름·인터페이스 내용은 다루지 않는다 (design.md 소관).
- 파일·모듈·타입·함수 나열은 두지 않는다 (저수준 디테일은 범위 밖).
- 구현 순서·체크리스트·TODO는 두지 않는다 (implement.md 소관).
- spec.md 안에는 상태 마커(`- [ ]` / `- [x]`)를 두지 않는다. 이 단계의 유일한 체크리스트는 README.md 상태 섹션이다.
- 승인 전 확인·§1–§5 외의 섹션은 두지 않는다. 보류로 확정한 항목은 별도 '열린 질문' 섹션이 아니라 §3 제약 또는 §4 제외 범위로 표현한다.

## 후속 단계 계약
- `/design-init <feature-dir>`이 이 spec.md를 읽고 같은 디렉토리에 design.md를 만든다.
- `/implement-init <feature-dir>`이 design.md(완료 조건 매핑을 위해 spec.md도)를 읽고 implement.md를 만든다.
- `<feature-dir>`은 `/spec-init`이 만든 폴더 전체 이름(`<yyyyMMdd>-<nnn>-<feature-name>`)이며, 이후 단계는 인자로 그 전체 이름을 받는다.

## 핵심 질문
> 우리가 풀려는 문제는 무엇이며, 어떻게 만드는지와는 무관하게 어떤 관찰 가능한 조건에서 풀렸다고 보는가?
