---
description: Create spec.md (requirements + completion criteria) under features/<feature-dir>/ and initialize the feature README
argument-hint: "<feature-name>"
---

`features/<feature-dir>/spec.md`를 쓰고 `README.md`를 만든다.
spec.md는 범위·목표·제약·제외·완료 조건만 다루고, 설계·인터페이스·파일 목록·구현 순서는 넣지 않는다.

Feature name: $ARGUMENTS

## 쓰는 방법
- main이 직접 쓴다.
- `features/`는 프로젝트 루트(`commands/project-init.md` §대상 프로젝트 루트) 바로 아래이고, 폴더 이름은 `<yyyyMMdd>-<nnn>-<feature-name>`이다(`<nnn>`은 같은 날짜의 다음 번호, 첫 번째는 `001`).
- ROADMAP 마일스톤 작업은 마일스톤 하나를 feature 하나로 하고, 인자가 기존 `features/<feature-dir>`이거나 같은 `<feature-name>` 폴더가 있으면 그 폴더를 쓴다.
- spec.md가 이미 있으면 `rules/feature-docs.md` §재작성 시 승인 취소를 따른다.

## 요구사항 정리
- 프로젝트 루트 문서와 사용자가 알려 준 문서에서 이 feature에 걸리는 동작·제약을 spec.md만 읽어도 알 수 있게 옮겨 적는다.
- §5 완료 조건은 §2 목표를 이뤘는지 판정하는 데 필요한 것만 두고, 이번 변경으로 바뀌지 않는 기존 동작·제약은 §3에 둔다.
- 요구사항은 문서에 확정으로 적혔거나 사용자가 확정한 것뿐이며, 예로 든 구현 방식이나 제안은 확정 전까지 넣지 않는다.
- 조사하다 새로 발견한 문제·위험과, 해석에 따라 §5 범위가 달라지는 요청 표현은 본문 대신 승인 전 확인에 질문으로 올린다.

## spec.md 구조
```markdown
# <feature-name> 명세

## 승인 전 확인
- <사용자 판단이 필요한 질문>. 관련 본문: §N

## 1. 범위
<담당 마일스톤(`ROADMAP M<n>`, 있으면), 다루는 영역과 경계>

- 입력 맥락: <조사를 시작할 파일·기존 동작, 참고한 문서, 미리 정한 방향과 버린 접근>

## 2. 목표
<왜 필요한지, 사용자에게 어떤 결과를 주는지, 사용자나 문서가 밝힌 품질·규모 수준>

## 3. 제약
<꼭 지켜야 하는 성능·호환성·플랫폼·일정·의존성 한계와 사용자가 지정한 검증 방법>

## 4. 제외 범위
<이번에 하지 않는 것>

## 5. 완료 조건
1. <사용자·호출자·운영 지표가 확인할 수 있는 동작>
```
- 승인 전 확인 처리는 `rules/feature-docs.md` §승인 전 확인을 따르고, 보류한 결정은 §3이나 §4에 적는다.
- 입력 맥락은 없으면 뺀다.
- `SPEC §5.N` 번호는 design.md가 생긴 뒤 바꾸지 않으며, 새 조건은 다음 번호로 더하고 뺄 조건은 `[철회] <이유>`로 바꾼 뒤 참조하던 문서도 고친다.

## README.md 구조
이미 있으면 새로 만들지 않고 작업 히스토리에 한 줄을 더한다.
```markdown
# <feature-name>

## 요약
<1-2줄>

## 상태
- [x] SPEC
- [ ] DESIGN
- [ ] IMPLEMENT

## 문서
- [spec.md](./spec.md)
- [design.md](./design.md)
- [implement.md](./implement.md)

## 작업 히스토리
- <yyyy-MM-dd>: SPEC 작성
```

다음 단계는 `/design-init <feature-dir>`이다.
