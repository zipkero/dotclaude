# Runtime Gates

Harness 관점에서 위험 작업은 정책만으로 관리하지 않는다.

## 목적

AI가 수행할 수 있는 작업과 수행 전에 승인이 필요한 작업을 구분한다.

## Gate 대상

### Destructive

- 파일 삭제
- 디렉터리 삭제
- 브랜치 삭제
- force push

### External

- 외부 전송
- API 호출
- 웹훅 호출

### Data

- DB 변경
- migration
- 대량 업데이트

### Security

- secret 출력
- credential 노출
- 인증 정보 변경

## Gate 수준

### Level 1

자동 진행 가능

예시:

- 읽기
- 테스트
- 문서 생성

### Level 2

사용자 확인 필요

예시:

- 운영 설정 변경
- DB 변경
- force push

### Level 3

명시 승인 + 재확인 필요

예시:

- 데이터 삭제
- 외부 전송
- credential 변경

## 향후 방향

Claude Code Hook 또는 별도 agent-harness RuntimeGate로 구현 가능.

```go
BeforeAction()
AfterAction()
RequireApproval()
```
