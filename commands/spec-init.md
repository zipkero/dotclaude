---
description: Create spec.md (requirements + completion criteria) under docs/<feature-dir>/ and initialize the feature README
---

> 사용 시점: Phased flow의 첫 단계로, `/analyze-init` / `/implement-init`이 참조하는 SPEC을 만든다.

`docs/<feature-dir>/spec.md`를 작성하고 `docs/<feature-dir>/README.md`를 초기화한다. `<feature-dir>` 전체 형식과 산출 룰은 §산출 경로에 둔다. SPEC은 요구사항 레벨에서 **무엇이 있어야 하는가**(범위·목표·제약·제외·완료 조건)를 잡으며, 설계나 구현 순서는 다루지 않는다.

Feature name: $ARGUMENTS

## 역할
- analysis.md와 implement.md가 참조하는 기준 문서다.
- 정적 문서이며 진행 상황 트래커가 아니다. implement나 verify가 SPEC을 수정하지 않는다.
- 요구사항 레벨의 완료 조건만 다룬다 — "X·Y·Z가 관찰될 때 feature가 완성되었다고 본다." implement.md의 더 좁은 Task-level 검증 조건과는 구분한다.

## 전제 조건
- feature name이 비어 있으면 중단한다.
  - 사유: feature name이 출력 경로(`docs/<feature-dir>/`)의 마지막 마디를 결정하며 이후 command가 폴더 전체 이름을 그대로 재사용한다.
  - 안내: "feature name을 인자로 전달하세요. 예: `/spec-init payment-integration`"
- 작성 전에 범위·목표·제약·제외 범위·완료 조건이 여러 방향으로 해석될 수 있으면 질문으로 해소한다. 질문 방식과 모호함 구분은 CLAUDE.md §요청 해석이 소유한다.
- 미확정 판단이 남아 있으면 추정으로 채워 spec.md를 생성하지 않는다.
- 질문으로 해소한 판단은 대화에만 남기지 않고 §1–§5 중 맞는 섹션에 반영한다.

## 산출 경로
폴더 전체 이름 `<feature-dir>` = `<yyyyMMdd>-<nnn>-<feature-name>` 으로 자동 산출한다.
- `<feature-name>`: `$ARGUMENTS`로 받은 슬러그.
- `<yyyyMMdd>`: `/spec-init` 실행일.
- `<nnn>`: 같은 날 순번 (`001`부터). `docs/` 아래에서 `<yyyyMMdd>-` prefix로 시작하는 기존 폴더 중 가장 큰 번호의 다음 값으로 정한다. 같은 날 첫 feature이면 `001`.

같은 날 같은 `<feature-name>`으로 재실행하면(`docs/<yyyyMMdd>-<nnn>-<feature-name>` 형태로 정확히 일치하는 폴더가 이미 있으면) 새 `<nnn>`을 매기지 않고 그 기존 폴더를 재사용한다. 그 안의 spec.md / README.md / analysis.md / implement.md에는 아래 §덮어쓰기 규칙이 그대로 적용된다.

산출물 경로:
- `docs/<feature-dir>/spec.md`
- `docs/<feature-dir>/README.md` (생성하거나 갱신)
- `docs/<feature-dir>/` 디렉토리가 없으면 만든다.

## 덮어쓰기 규칙
- `spec.md`가 이미 있으면 덮어쓰기 전에 사용자 확인을 받는다.
- `analysis.md`나 `implement.md`가 이미 있으면, SPEC을 덮어쓸 때 그 내용이 무효화될 수 있음을 사용자에게 경고하고 명시적 확인을 받은 뒤에만 진행한다. 이후 analysis.md와 implement.md의 영향받은 섹션을 갱신해야 함을 사용자에게 상기시킨다 (CLAUDE.md §문서 구조 참고).
- `README.md`가 이미 있으면 새로 만들지 않고 §README.md 구조 말미 규칙(기존 Status·문서 섹션은 유지하고 작업 히스토리 라인만 추가)을 적용한다.

## spec.md 구조

### 승인 전 확인
- 사용자가 SPEC 승인 전에 답해야 할 feature 고유의 판단 질문을 만들 수 있을 때만 이 섹션을 두고, 없으면 빈 섹션 없이 생략한다.
- 어느 feature에나 성립하는 일반 확인 질문("범위가 의도와 맞는지 확인" 류)은 두지 않는다.
- 항목은 `- <판단 질문>. 관련 본문: §N` 형식으로 쓴다.
- 본문을 요약·복제하는 진술은 두지 않는다 — 본문에서 파생 가능한 수치·요약이나 "승인하면 요구사항이 고정된다" 같은 문서 타입 상수가 그 예다.
- 보류로 확정된 항목만 §3 제약 또는 §4 제외 범위에 두고, 여기에는 그에 대한 판단 질문만 둔다. 범위를 결정하지 못한 모호함은 문서에 수용하지 않고 작성 전 질문으로 해소한다(§전제 조건).
- §1–§5 앞에 두는 서문이며 번호를 매기지 않는다. `§N` 참조 대상이 아니다. 본문 섹션을 갱신할 때 질문과 위치 참조가 여전히 유효한지 함께 확인한다.

### 1. 범위
- 이 feature가 다루는 영역. 작업의 경계.

### 2. 목표
- 이 작업이 존재하는 이유. 사용자·이해관계자에게 어떤 결과를 만들어내는지.

### 3. 제약
- 엄격한 한계: 성능, 호환성, 규제, 플랫폼, 일정, 의존성.

### 4. 제외 범위
- 명시적으로 범위 밖인 항목. analyze·implement 단계에서의 범위 확장을 막는다.

### 5. 완료 조건
- feature가 완성되었음을 신호하는 관찰 가능한 조건들.
- 요구사항 레벨이며 Task 레벨이 아니다. 요구사항 레벨은 외부에서 관찰 가능한 동작을 기술하고, Task 레벨은 내부 실행을 기술한다.
- "관찰 가능"의 의미는 대상 유형에 따라 달라지며, 관찰자가 항상 사람인 것은 아니다.
  - UI → 사용자에게 보이는 화면·인터랙션
  - Library/SDK → 호출자에게 반환되는 값·예외
  - CLI → stdout / stderr / exit code
  - Backend API → HTTP response·status code
  - Data pipeline → DB row·event·후속 소비용 파일 산출물
  - Infra/ops → health endpoint·metric·log signal
- 각 기준은 동작을 관찰함으로써 검증할 수 있어야 한다.
- `verify`는 각 Task를 판단할 때 이 기준들을 직접 인용한다.
- 각 조건은 번호 리스트(`1.`, `2.`, …)로 쓴다. N번 항목은 이후 단계(analysis.md·implement.md)에서 `SPEC §5.N`으로 참조된다 — analysis.md 본문 인라인 인용과 implement.md 참조 필드의 추적 단위다. 이 계약은 `SPEC §5.N` 표기만 소유한다. 접두사 없는 `§5`는 각 문서가 자기 5번 섹션을 가리킬 때 쓰는 별개 표기다.
- 번호는 영구 식별자다. 기존 항목을 재배열·삭제·재번호하면 그 번호를 참조하던 analysis.md·implement.md가 조용히 깨진다. 기존 번호는 보존하고, 새 조건은 다음 번호로만 추가한다.

반례 (내부 실행 — analysis.md / implement.md에 들어갈 내용이며 spec.md가 아니다):
- "OrderListService가 DB에서 주문 목록을 가져온다"
- "YAMLParser.parse()가 호출된다"
- "healthcheck handler가 DB.ping()을 수행한다"

## README.md 구조 (여기서 초기화)
```markdown
# <feature-name>

## 요약
<spec.md §1–§2 기반 1-2줄 설명>

## 상태
- [x] SPEC
- [ ] ANALYSIS
- [ ] IMPLEMENT

## 문서
- [spec.md](./spec.md)
- [analysis.md](./analysis.md) (ANALYSIS 단계에서 생성)
- [implement.md](./implement.md) (IMPLEMENT 단계에서 생성)

## 작업 히스토리
- <yyyy-MM-dd>: SPEC 작성
```

README.md가 이미 있으면 기존 Status·문서 섹션은 유지하고 작업 히스토리 라인만 한 줄 추가한다. SPEC을 다시 작성하는 경우라도 `[x] SPEC`은 그대로 둔다.

## 금지
- 설계·아키텍처·데이터 흐름·인터페이스 내용은 다루지 않는다 (analysis.md 소관).
- 파일·모듈·타입·함수 나열은 두지 않는다 (저수준 디테일은 범위 밖).
- 구현 순서·체크리스트·TODO는 두지 않는다 (implement.md 소관).
- spec.md 안에는 상태 마커(`- [ ]` / `- [x]`)를 두지 않는다. SPEC은 상태를 갖지 않으며, 이 단계의 유일한 체크리스트는 README.md Status다.
- 승인 전 확인·§1–§5 외의 섹션은 두지 않는다. 보류로 확정한 항목은 별도 '열린 질문' 섹션이 아니라 §3 제약 또는 §4 제외 범위로 표현한다.

## 후속 단계 계약
- `/analyze-init <feature-dir>`이 이 spec.md를 읽고 같은 디렉토리에 analysis.md를 만든다.
- `/implement-init <feature-dir>`이 analysis.md(완료 조건 매핑을 위해 spec.md도)를 읽고 implement.md를 만든다.
- `<feature-dir>`은 `/spec-init`이 만든 폴더 전체 이름(`<yyyyMMdd>-<nnn>-<feature-name>`)이며, 이후 단계는 인자로 그 전체 이름을 받는다.

## 핵심 질문
> 우리가 풀려는 문제는 무엇이며, 어떻게 만드는지와는 무관하게 어떤 관찰 가능한 조건에서 풀렸다고 보는가?
