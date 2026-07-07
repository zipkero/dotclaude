# Go 작업 기준

## 적용 범위
- 이 문서는 전역 기본값이다. 프로젝트의 `CLAUDE.md`, `go.mod`, formatter, linter, test 설정이 있으면 그 기준을 우선한다.
- Go 파일을 수정하거나 검토할 때 적용한다.

## 코드 작성
- `gofmt` 또는 `go fmt` 결과를 기준으로 삼는다.
- 기존 프로젝트가 달리 정하지 않으면 표준 라이브러리와 작은 명시적 구현을 우선한다.
- 공개 API 변경은 호출부, 테스트, 문서 영향을 함께 확인한다.
- 패키지 경계는 역할 중심으로 유지하고, 단순한 변경을 위해 새 추상화를 만들지 않는다.

## 오류와 동시성
- 오류는 숨기지 말고 호출자가 판단할 수 있는 context와 함께 반환한다.
- `panic`은 초기화 실패나 복구 불가능한 프로그래밍 오류에만 제한한다.
- goroutine을 추가하거나 수정할 때는 종료 조건, cancellation, channel close 책임을 확인한다.
- `context.Context`가 이미 흐르는 경로에서는 cancellation과 timeout 전달을 끊지 않는다.

## 테스트와 주석
- 기존 테스트 관례를 따른다.
- 순수 로직은 table-driven test를 우선 고려한다.
- 프로젝트 관례가 없고 Go 코드 동작을 바꿨다면 `go test ./...`를 우선 검증 명령으로 고려한다.
- exported identifier에는 프로젝트 관례에 따라 Go doc 스타일 주석을 유지한다.
- error wrapping, goroutine lifecycle, context cancellation처럼 오해하면 결함이 되는 제약만 설명한다.
