---
paths:
  - "**/*.go"
---

# Go 작업 기준

## 적용 범위
- 프로젝트에 `go.mod`, formatter, linter, test 설정이 있으면 그 기준을 우선한다.

## 코드 작성
- `gofmt` 또는 `go fmt` 결과를 기준으로 삼는다.
- 기존 프로젝트가 달리 정하지 않으면 표준 라이브러리와 작은 명시적 구현을 우선한다.
- 패키지 경계는 역할 중심으로 유지하고, 단순한 변경을 위해 새 추상화를 만들지 않는다.
- doc comment는 `// Name ...` 형태로 쓴다.
- doc comment는 그 선언 하나를 한 줄로 설명하고, package doc도 예외가 아니다.
- struct 필드·상수·지역 선언에 붙는 주석은 godoc에 렌더되더라도 doc comment로 보지 않는다.
- 한국어로 쓸 때도 식별자 이름을 그대로 첫 낱말로 두고, 조사는 한국어 표기대로 붙여 쓴다 — `// Role은 …`, `// Package llm은 …`.
  revive `exported`나 GoLand 주석 inspection은 `Name ` prefix를 요구하므로, 이 검사를 켠 프로젝트에서는 프로젝트 설정을 우선한다.

## 오류와 동시성
- 오류는 숨기지 말고 호출자가 판단할 수 있는 context와 함께 반환한다.
- `panic`은 초기화 실패나 복구 불가능한 프로그래밍 오류에만 제한한다.
- goroutine을 추가하거나 수정할 때는 종료 조건, cancellation, channel close 책임을 확인한다.
- `context.Context`가 이미 흐르는 경로에서는 cancellation과 timeout 전달을 끊지 않는다.

## 테스트
- 기존 테스트 관례를 따른다.
- 순수 로직은 table-driven test를 우선 고려한다.
- 프로젝트 관례가 없고 Go 코드 동작을 바꿨다면 `go test ./...`를 우선 검증 명령으로 고려한다.
