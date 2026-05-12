---
description: Create spec.md (requirements + completion criteria) under docs/<feature-dir>/ and initialize the feature README
---

> 사용 시점: Phased flow의 첫 단계로, `/analyze-init` / `/implement-init`이 참조하는 SPEC을 만든다.

`docs/<feature-dir>/spec.md`를 작성하고 `docs/<feature-dir>/README.md`를 초기화한다. `<feature-dir>` 풀 형식과 산출 룰은 §산출 경로에 둔다. SPEC은 요구사항 레벨에서 **무엇이 있어야 하는가**(범위·목표·제약·제외·완료 조건)를 잡으며, 설계나 구현 순서는 다루지 않는다.

Feature name: $ARGUMENTS

## 역할
- analysis.md와 implement.md가 참조하는 기준 문서다.
- 정적 문서이며 진행 상황 트래커가 아니다. implement나 verify가 SPEC을 수정하지 않는다.
- 요구사항 레벨의 완료 조건만 다룬다 — "X·Y·Z가 관찰될 때 feature가 완성되었다고 본다." implement.md의 더 좁은 Task-level 검증 조건과는 구분한다.

## 전제 조건
- feature name이 비어 있으면 중단한다.
  - 사유: feature name이 출력 경로(`docs/<feature-dir>/`)의 마지막 마디를 결정하며 이후 command가 폴더 풀 이름을 그대로 재사용한다.
  - 안내: "feature name을 인자로 전달하세요. 예: `/spec-init payment-integration`"
- 의도가 모호하면 작성 전에 사용자에게 질문한다.

## 산출 경로
폴더 풀 이름 `<feature-dir>` = `<yyyyMMdd>-<nnn>-<feature-name>` 으로 자동 산출한다.
- `<feature-name>`: `$ARGUMENTS`로 받은 슬러그.
- `<yyyyMMdd>`: `/spec-init` 실행일.
- `<nnn>`: 같은 날 순번 (`001`부터). `docs/` 아래에서 `<yyyyMMdd>-` prefix로 시작하는 기존 폴더 중 가장 큰 번호의 다음 값으로 정한다. 같은 날 첫 feature이면 `001`.

같은 날 같은 `<feature-name>`으로 재실행하면(`docs/<yyyyMMdd>-<nnn>-<feature-name>` 형태로 정확히 일치하는 폴더가 이미 있으면) 새 `<nnn>`을 매기지 않고 그 기존 폴더를 재사용한다. 그 안의 spec.md / README.md / analysis.md / implement.md에는 아래 Overwrite Rule이 그대로 적용된다.

산출물 경로:
- `docs/<feature-dir>/spec.md`
- `docs/<feature-dir>/README.md` (생성하거나 갱신)
- `docs/<feature-dir>/` 디렉토리가 없으면 만든다.

## 덮어쓰기 규칙
- `spec.md`가 이미 있으면 덮어쓰기 전에 사용자 확인을 받는다.
- `analysis.md`나 `implement.md`가 이미 있으면, SPEC을 덮어쓸 때 그 내용이 무효화될 수 있음을 사용자에게 경고하고 명시적 확인을 받은 뒤에만 진행한다. 이후 analysis.md와 implement.md의 영향받은 섹션을 갱신해야 함을 사용자에게 상기시킨다 (CLAUDE.md §문서 구조 참고).
- `README.md`가 이미 있으면 새로 만들지 않고 §README.md 구조 말미 규칙(기존 Status·문서 섹션은 유지하고 작업 히스토리 라인만 추가)을 적용한다.

## spec.md 구조

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
  - Data pipeline → DB row·event·하류용 파일 산출물
  - Infra/ops → health endpoint·metric·log signal
- 각 기준은 동작을 관찰함으로써 검증할 수 있어야 한다.
- `verify`는 각 Task를 판단할 때 이 기준들을 직접 인용한다.

예시 (한국어 산출물, 대상 유형별로 묶음):
- UI: "로그인한 사용자가 주문 내역을 확인할 수 있다"
- Library: "parseConfig()가 유효하지 않은 YAML 입력에 대해 SchemaError를 던진다"
- CLI: "deploy --dry-run 실행 시 변경 계획을 stdout에 출력하고 exit 0으로 종료한다"
- Infra: "/health 엔드포인트가 정상 시 200, DB 장애 시 503을 반환한다"

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

## 후속 단계 계약
- `/analyze-init <feature-dir>`이 이 spec.md를 읽고 같은 디렉토리에 analysis.md를 만든다.
- `/implement-init <feature-dir>`이 analysis.md(완료 조건 매핑을 위해 spec.md도)를 읽고 implement.md를 만든다.
- `<feature-dir>`은 `/spec-init`이 만든 폴더 풀 이름(`<yyyyMMdd>-<nnn>-<feature-name>`)이며, 이후 단계는 인자로 그 풀 이름을 받는다.

## 핵심 질문
> 우리가 풀려는 문제는 무엇이며, 어떻게 만드는지와는 무관하게 어떤 관찰 가능한 조건에서 풀렸다고 보는가?
