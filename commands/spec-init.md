---
description: Create spec.md (requirements + completion criteria) under features/<feature-dir>/ and initialize the feature README
argument-hint: "<feature-name>"
---

> 사용 시점: Phased 흐름의 첫 단계로, `/design-init` / `/implement-init`이 참조하는 SPEC을 만든다.

`features/<feature-dir>/spec.md`를 작성하고 `features/<feature-dir>/README.md`를 초기화한다.
SPEC은 요구사항 수준에서 무엇이 있어야 하는가(범위·목표·제약·제외·완료 조건)를 잡으며, 설계·인터페이스·파일 나열·구현 순서는 다루지 않는다.

Feature name: $ARGUMENTS

## 역할
- 실행 주체는 main이며 subagent에 맡기지 않는다.
- design.md와 implement.md가 참조하는 정적 기준 문서다.
  고치는 방식은 `rules/feature-docs.md`를 따른다.

## 전제 조건
- 해석 차이가 범위나 완료 조건을 실제로 바꾸면 쓰기 전에 묻고, 정한 답은 §1–§5에 반영한다.

## 산출 경로
- `features/`는 `commands/project-init.md` §대상 프로젝트 루트로 확인한 루트 바로 아래다.
- `<feature-dir>`은 `<yyyyMMdd>-<nnn>-<feature-name>`이다.
  `<yyyyMMdd>`는 실행일, `<nnn>`은 그날 날짜로 시작하는 기존 폴더 중 가장 큰 번호의 다음 값(첫 feature는 `001`)이다.
- 같은 날 같은 `<feature-name>` 폴더가 이미 있으면 새 번호를 매기지 않고 재사용한다.
- `features/<feature-dir>/`에 두는 문서는 `spec.md`, `design.md`, `implement.md`, `README.md` 넷뿐이다.

## 덮어쓰기 규칙
- `spec.md`가 이미 있으면 덮어쓰기 전에 확인받고, `design.md`·`implement.md`가 있으면 영향받는 섹션을 갱신해야 하며 영향받는 Task의 승인이 취소된다는 것을 함께 알린다.
- `README.md`가 이미 있으면 새로 만들지 않고 문서 섹션을 유지한 채 작업 히스토리 한 줄을 더하며, 상태판은 `rules/feature-docs.md` §재작성 시 승인 취소를 따른다.

## 요구사항 확정
- 프로젝트 루트 문서(`commands/project-init.md` §산출 경로) 중 있는 것과 사용자가 지정한 문서를 조사해, 이 feature에 걸리는 동작·마일스톤 기준·제약을 §2·§3·§5 본문에 자체 완결적으로 옮긴다.
  문서끼리 또는 현재 코드와 어긋나 범위·완료 조건이 갈리면 §전제 조건대로 묻는다.
- 요구사항은 조사·지정 문서에 확정으로 적힌 것과 사용자가 확정한 것이다.
  사용자가 예시로 든 구현 방식·비교 대상과 문서의 제안·미확정 결정은 확정 전까지 요구사항이 아니다.
- 사용자가 반복해 강조한 문제·위험·운영 조건은 §2·§3·§5 후보로 보고, 조사에서 새로 드러난 문제·위험은 본문 대신 승인 전 확인의 질문으로 올린다.
- feature 범위는 담당 마일스톤 안에서 확인된 최종 사용 가능 상태로 잡는다.

## spec.md 구조
`<…>`는 채울 자리이며, 아래 섹션 밖의 섹션과 체크박스는 두지 않는다.

```markdown
<!-- prowl-workflow: v1 -->
# <feature-name> 명세

## 승인 전 확인
- <판단 질문>. 관련 본문: §N

## 1. 범위
<이 feature가 다루는 영역과 작업의 경계>

- 입력 맥락: <조사 출발점이 되는 파일·기존 동작, 조사에 쓴 출처(경로 + 섹션 제목), 사전 논의에서 정한 방향과 접은 접근과 그 이유>

## 2. 목표
<이 작업이 존재하는 이유와 사용자·이해관계자에게 만드는 결과>

## 3. 제약
<성능·호환성·규제·플랫폼·일정·의존성의 엄격한 한계>

## 4. 제외 범위
<명시적으로 범위 밖인 항목>

## 5. 완료 조건
1. <밖에서 관찰 가능한 동작. 동작 보존이면 비교 대상>
```

- 승인 전 확인은 그 feature에서 무엇이 걸려 있는지 드러나는 판단 질문이 있을 때만 둔다.
  답을 받으면 `rules/feature-docs.md`대로 §1–§5에 반영하고 항목을 지우며, 사용자가 보류한 항목은 `- (보류) <판단 질문>. 관련 본문: §N`으로 남기고 그 결정은 §3이나 §4에 둔다.
  남아 있는 항목은 답을 받지 않은 질문이며 이후 단계가 이 표기로 판정한다.
- 입력 맥락은 design 단계가 대화 없이 재개할 수 있게 하는 출발점이며, 없으면 뺀다.
- 완료 조건의 관찰자는 사용자·호출자·후속 소비자·운영 신호 중 하나다.
  `verify`는 Task를 판단할 때 이 조건을 직접 인용한다.
- N번 조건은 이후 `SPEC §5.N`으로 참조되며, design.md가 생긴 뒤부터 영구 식별자다.
  새 조건은 다음 번호로만 더한다.
  조건을 뺄 때는 번호를 당기지 않고 `[철회] <이유>`로 바꾸며, 그 번호를 참조하던 design.md·implement.md 자리를 함께 고친다.

## README.md 구조 (여기서 초기화)
```markdown
<!-- prowl-workflow: v1 -->
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

## 후속 단계
`/design-init <feature-dir>`이 spec.md로 design.md를, `/implement-init <feature-dir>`이 design.md와 spec.md §5로 implement.md를 만든다.
이후 단계는 `<feature-dir>` 전체 이름을 인자로 받는다.
