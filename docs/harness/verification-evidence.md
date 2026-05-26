# Verification Evidence

verify.md를 만들지는 않지만, 승인 근거는 남긴다.

## 목적

- 왜 approved 되었는지 나중에 추적할 수 있어야 한다.
- reject가 반복되는 패턴을 찾을 수 있어야 한다.
- verify 판단이 단순 의견이 아니라 evidence 기반이었음을 보여야 한다.

## 최소 Evidence

다음 중 하나 이상이 존재해야 한다.

- code diff
- 테스트 결과
- 로그
- 실행 결과
- 설정 변경 결과

## 권장 기록 형식

```markdown
## Verification History

- 2026-05-26 task-001 approved
  - evidence:
    - go test ./...
    - src/auth/login.go
  - note:
    - 로그인 실패 처리 추가
```

## Reject 기록

```markdown
- 2026-05-26 task-001 rejected
  - category: correctness
  - reason:
    - 실패 경로 미처리
  - evidence:
    - test failure
```

## Owner

- 판단 규칙: skills/verify/SKILL.md
- 기록 위치 결정: feature README 또는 프로젝트 정책
- 본 문서는 evidence 보존 원칙만 설명한다.
