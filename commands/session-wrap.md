---
description: Extract session learnings into handoff, rule candidates, skill candidates, and docs update candidates
---

> 사용 시점: 작업 세션이 끝났거나, 다음 세션으로 넘길 맥락을 정리해야 하거나, 반복 실수·좋은 패턴을 전역 설정에 반영할지 판단해야 할 때 사용자가 호출한다.
> 분석 범위: 이번 대화에서 수행한 요청, 읽고 수정한 파일, 실행한 명령, verify 결과, reject·혼란·재작업 지점.

이번 세션을 정리한다. 목적은 단순 요약이 아니라 **다음 작업에 재사용 가능한 학습 후보를 추출하는 것**이다. 파일은 자동 수정하지 않는다. 반영이 필요한 항목은 후보로만 제시하고, 사용자의 명시 승인 후 별도 작업으로 적용한다.

## 출력 원칙

- 확인한 사실과 추정을 분리한다.
- 실제로 관찰한 세션 내용만 근거로 삼는다.
- 규칙·skill·문서 추가를 제안할 때는 어느 파일이 owner인지 함께 제시한다.
- 세션에서 확인하지 못한 내용은 보강 후보로만 둔다.
- 다음 세션에서 바로 이어갈 수 있도록 handoff를 먼저 작성한다.

## 출력 형식

### 1. Handoff
- 현재 작업 상태
- 완료된 일
- 남은 일
- 다음에 먼저 열어봐야 할 파일
- 주의해야 할 제약

### 2. Evidence
- 읽은 주요 파일
- 수정한 파일
- 실행한 명령
- verify 결과
- 확인하지 못한 항목

### 3. Learnings
- 이번 세션에서 반복된 혼란
- 효과가 좋았던 작업 방식
- 다음에도 재사용할 판단 기준

### 4. Rule Candidates
각 후보는 다음 형식으로 작성한다.

```text
- owner: <CLAUDE.md | commands/... | skills/... | agents/... | .claude/rules/...>
- reason: 왜 규칙으로 승격할 가치가 있는가
- candidate: 추가하거나 바꿀 문장
- risk: 규칙화했을 때 과도하게 일반화될 위험
```

### 5. Skill Candidates
반복 절차로 만들 가치가 있는 항목만 제안한다.

```text
- owner: skills/<name>/SKILL.md 또는 commands/<name>.md
- trigger: 언제 호출되는가
- steps: 반복 가능한 절차
- exit criteria: 완료 판단 기준
```

### 6. Docs Update Candidates
프로젝트 문서나 README에 반영해야 할 항목을 제안한다.

```text
- owner: <문서 경로>
- change: 반영할 내용
- reason: 문서에 남겨야 하는 이유
```

### 7. Cleanup Candidates
더 이상 필요 없거나 과해진 설정을 제안한다.

```text
- target: <파일·섹션>
- reason: 왜 줄이거나 제거할 수 있는가
- expected effect: 줄였을 때 좋아지는 점
```

## 금지

- 세션 정리 중 코드·문서·설정 파일을 수정하지 않는다.
- 한 번의 세션에서 나온 단발성 선호를 즉시 전역 규칙으로 확정하지 않는다.
- 실패 원인을 근거 없이 특정 agent·skill·모델 탓으로 단정하지 않는다.
- 사용자가 승인하지 않은 rule·skill·docs 변경을 적용하지 않는다.

## 핵심 질문

> 이번 세션에서 다음에도 반복될 가능성이 있는 것은 무엇인가? 그것은 rule, skill, docs, handoff 중 어디에 남기는 것이 가장 적절한가?
