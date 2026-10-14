---
description: Create spec.md (requirements + completion criteria) under features/<feature-dir>/ and initialize the feature README
argument-hint: "<feature-name>"
---

`features/<feature-dir>/spec.md`를 쓰고 `features/<feature-dir>/README.md`를 만든다.
spec.md는 무엇이 필요한지(범위, 목표, 제약, 제외, 완료 조건)만 다룬다.
설계, 인터페이스, 파일 목록, 구현 순서는 넣지 않는다.

Feature name: $ARGUMENTS

## 역할
- main이 직접 쓴다.
- design.md와 implement.md가 기준으로 삼는 문서다.

## 산출 경로
- `features/`는 프로젝트 루트(`commands/project-init.md` §대상 프로젝트 루트) 바로 아래에 둔다.
- `<feature-dir>`은 `<yyyyMMdd>-<nnn>-<feature-name>`이다.
  날짜는 오늘이고, `<nnn>`은 같은 날짜 폴더 중 가장 큰 번호의 다음 번호다(첫 번째는 `001`).
- ROADMAP의 작업 후보 중 같은 것이 있으면 그 이름을 `<feature-name>`으로 쓴다.
- 오늘 날짜에 같은 이름 폴더가 이미 있으면 새로 만들지 않고 그 폴더를 쓴다.
- feature 폴더에는 `spec.md`, `design.md`, `implement.md`, `README.md`만 둔다.

## 덮어쓰기
- spec.md가 이미 있으면 덮어쓰기 전에 묻는다.
  design.md·implement.md가 있으면 같이 고쳐야 하고, 영향받는 Task의 승인이 취소된다는 것도 알린다.
- README.md가 이미 있으면 새로 만들지 않고 작업 히스토리에 한 줄을 더한다.
  상태판은 `rules/feature-docs.md` §재작성 시 승인 취소를 따른다.

## 요구사항 정리
- 프로젝트 루트 문서(`commands/project-init.md` §산출 경로)와 사용자가 알려 준 문서를 읽는다.
- 그중 이 feature에 걸리는 동작·마일스톤 기준·제약을 spec.md에 옮겨 적는다.
  spec.md만 읽어도 알 수 있게 쓴다.
- 요구사항은 문서에 확정으로 적힌 것과 사용자가 확정한 것뿐이다.
  사용자가 예로 든 구현 방식이나 문서의 제안은 확정 전까지 요구사항이 아니다.
- 사용자가 여러 번 강조한 문제·위험·운영 조건은 §2·§3·§5에 넣을지 검토한다.
- 조사하다 새로 발견한 문제·위험은 본문에 넣지 말고 승인 전 확인에 질문으로 올린다.
- 해석에 따라 범위나 완료 조건이 달라지면 쓰기 전에 묻는다.
- feature 범위는 담당 마일스톤 안에서 실제로 쓸 수 있는 상태까지로 잡는다.

## spec.md 구조
아래 섹션만 둔다.
`<…>`는 채울 자리다.

```markdown
# <feature-name> 명세

## 승인 전 확인
- <사용자 판단이 필요한 질문>. 관련 본문: §N

## 1. 범위
<담당 마일스톤이 있으면 `ROADMAP M<n>`, 이 feature가 다루는 영역과 경계>

- 입력 맥락: <조사를 시작할 파일·기존 동작, 참고한 문서(경로 + 섹션), 미리 정한 방향, 버린 접근과 그 이유>

## 2. 목표
<이 작업이 왜 필요한지, 사용자에게 어떤 결과를 주는지>

## 3. 제약
<성능·호환성·규제·플랫폼·일정·의존성의 꼭 지켜야 하는 한계>

## 4. 제외 범위
<이번에 하지 않는 것>

## 5. 완료 조건
1. <밖에서 확인할 수 있는 동작. 기존 동작을 유지하는 경우면 비교 대상>
```

- 승인 전 확인은 사용자 판단이 필요한 질문이 있을 때만 둔다.
  - 답을 받으면 §1–§5에 반영하고 항목을 지운다.
  - 사용자가 보류하면 `- (보류) <질문>. 관련 본문: §N`으로 남기고, 그 결정은 §3이나 §4에 적는다.
  - `(보류)`가 아닌 항목이 남아 있으면 아직 답을 못 받은 것이다.
    다음 단계는 이걸 보고 멈춘다.
- 입력 맥락은 design 단계가 대화 없이 시작할 수 있게 하는 출발점이다.
  없으면 뺀다.
- 완료 조건은 사용자, 호출자, 후속 소비자, 운영 지표 중 누군가가 확인할 수 있는 동작으로 쓴다.
- N번 조건은 `SPEC §5.N`으로 참조된다.
  design.md가 생긴 뒤에는 번호를 바꾸지 않는다.
  - 새 조건은 다음 번호로 더한다.
  - 조건을 빼면 번호를 당기지 않고 `[철회] <이유>`로 바꾼다.
    그 번호를 참조하던 design.md·implement.md도 같이 고친다.

## README.md 구조
```markdown
# <feature-name>

## 요약
<spec.md §1–§2를 바탕으로 1-2줄>

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

## 다음 단계
`/design-init <feature-dir>`로 design.md를, `/implement-init <feature-dir>`로 implement.md를 만든다.
`<feature-dir>`은 전체 이름을 쓴다.
