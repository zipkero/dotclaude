---
description: Create analysis.md (analysis + design) under docs/<feature-dir>/ from spec.md
---

> 사용 시점: `/spec-init` 이후, `/implement-init` 이전. `/implement-init`이 소비할 설계 기준을 만든다.

`docs/<feature-dir>/analysis.md`를 작성한다. ANALYSIS는 feature를 어떻게 구조화하고 어떤 설계 선택을 commit했는지를 잡는다.

Feature directory: $ARGUMENTS

## 역할
- spec.md에서 도출한 설계 기준이며, 모든 구조·설계 결정을 보유한다 — 그래야 implement.md를 순수 체크리스트로 둘 수 있다.
- 정적 문서이며 진행 상황 트래커가 아니다.
- 자기 완결적이어야 한다. 새 세션(`/clear` 이후)에서도 `spec.md + analysis.md`만으로 implement.md를 만들 수 있어야 한다.
- spec.md §5 완료 조건의 본문 텍스트를 그대로 옮겨오지 않는다. 출처 표기는 `SPEC §5.N`으로 두되, 해당 결정·구조가 어떤 동작에 어떻게 기여하는지는 평문으로 풀어 적는다.

## 전제 조건
- feature directory가 비어 있으면 중단한다. 안내: "feature directory(`<yyyyMMdd>-<nnn>-<feature-name>`)를 인자로 전달하세요. 예: `/analyze-init 20260506-001-payment-integration`"
- `docs/<feature-dir>/spec.md`가 없으면 중단하고 `/spec-init`을 먼저 실행하도록 안내한다.
- 작성 전에 spec.md 전체를 읽는다. 범위는 spec.md §1에 의해 제한되며, 요구사항을 새로 추가하지 않는다.

## 덮어쓰기 규칙
- `analysis.md`가 이미 있으면 덮어쓰기 전에 사용자 확인을 받는다.
- `implement.md`가 존재하면, ANALYSIS 덮어쓰기가 implement.md 내용을 무효화할 수 있음을 경고하고 명시적 확인을 받은 뒤에만 진행한다. 이후 implement.md의 영향받은 섹션을 갱신해야 함을 사용자에게 상기시킨다.

## analysis.md 구조

### 근거
- 작성 전에 실제로 읽은 spec.md 범위와, 코드베이스에서 확인한 사실(기존 경계·타입·삭제 여부 등)을 적는다.
- §1–§5 설계 판단이 무엇에 근거했는지의 출처다. 확인한 사실과 추정을 섞지 않는다.
- §1–§5 앞에 두는 서문이며 번호를 매기지 않는다. `§N` 참조 대상이 아니다.

### 1. 구조
- 모듈·컴포넌트·레이어 배치와 feature를 어떤 구조로 나누는지를 다룬다.
- 파일이 아니라 경계 중심으로 기술하며, 경계가 자명하지 않을 때만 타입·인터페이스 이름을 명시한다.
- 기존 모듈 안에서 끝나는 변경에는 §1을 채우려고 새 모듈·레이어를 만들어 넣지 않는다.

### 2. 데이터 흐름
- request → 처리 → response 경로, 상태 전이, 외부 통합 지점.
- 흐름이 비선형이면 글이나 Mermaid로 다이어그램을 둔다.
- 선형 흐름을 인위적으로 쪼개거나 없는 상태·통합 지점을 만들어 채우지 않는다.

### 3. 인터페이스
- 외부 경계: API signature, event 형태, 인접 모듈과의 계약.
- 경계를 가로지르는 인터페이스만 포함하며, 내부 helper의 signature는 범위 밖이다.

### 4. 영향 범위
- 이 변경이 실제로 건드리는 기존 모듈·파일·DB 테이블만 둔다. 호출부나 스키마를 직접 읽어 검증한다.
- 하위 호환·마이그레이션 항목은 이 저장소의 기존 호출자·저장 데이터·외부 contract가 실제로 깨지는 경우에만 둔다. 가설적 우려는 범위 밖이다.
- 검증된 것이 없으면 "해당 없음"으로 적는다.

### 5. Decision Points
- 판단이 필요했던 모든 설계 선택을 둔다. 각 항목은 고려한 옵션, 트레이드오프, 채택 옵션, 근거를 포함한다.
- 설계를 막는 리스크는 여기에 두고, 그것을 해소하는 옵션과 짝지어 기록한다.
- 다루는 범위 (implement.md가 결정을 상속하지 않도록):
  - 구조적 선택 (모듈 형태, 레이어링, 분할·병합)
  - 데이터 모델·상태 모델 선택
  - 가능한 인터페이스 형태가 여럿일 때
  - 정확성에 영향을 주는 비자명한 실행 순서
- 판단 거리가 없는 작은 feature는 "해당 없음"으로 적고 넘어간다.

## README 갱신
완료 시:
- README.md Status `[ ] ANALYSIS`를 `[x] ANALYSIS`로 전환한다.
- 작업 히스토리 라인을 추가한다 — `- <yyyy-MM-dd>: ANALYSIS 작성`.

## 금지
- 체크박스(`- [ ]` / `- [x]`)를 두지 않는다. ANALYSIS는 정적 문서다.
- 구현 체크리스트·파일별 TODO·Task 순서는 두지 않는다 (implement.md 소관).
- 저수준 코딩 디테일(변수명, 루프 본문, private helper)은 다루지 않는다.
- spec.md 너머로 범위를 확장하지 않는다.
- 추측성 항목은 두지 않는다 — 일반 보안·성능·컴플라이언스·contract 체크리스트, 가설적 실패 모드, spec.md·코드·사용자 prompt에 근거 없는 호환성·마이그레이션 우려.
- 근거·§1–§5 외의 섹션은 두지 않는다. 특히: 'SPEC 추적' 매트릭스(spec.md §5 연결은 해당 설계를 기술하는 본문에 `SPEC §5.N`을 인라인으로 달아 표현하고, Task 단위 매핑은 implement.md 참조 필드가 소유한다), 독립 '리스크' 섹션(설계를 막는 리스크는 §5 Decision Points에 해소 옵션과 짝지어 둔다), 독립 '검증 관점' 섹션(Task별 검증은 implement.md 검증 조건이 소유한다), '열린 질문' 섹션.

## 후속 단계 계약
- `/implement-init <feature-dir>`이 analysis.md(구조 + 결정)와 spec.md §5(완료 조건 매핑)를 읽고 implement.md를 만든다.

## 핵심 질문
> 이 feature를 어떻게 구조화하며, 데이터는 어디로 흐르고, 어떤 설계 선택을 commit했는가?
