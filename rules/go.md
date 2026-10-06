---
paths:
  - "**/*.go"
---

# Go 작업 기준

## 주석
- doc comment는 `// Name ...` 형태로 쓰며, package doc도 한 줄 규칙에서 예외가 아니다.
- struct 필드·상수·지역 선언에 붙는 주석은 godoc에 렌더되더라도 doc comment로 보지 않는다.
- 한국어로 쓸 때도 식별자 이름을 그대로 첫 낱말로 두고, 조사는 한국어 표기대로 붙여 쓴다 — `// Role은 …`, `// Package llm은 …`.
  `Name ` prefix를 검사하는 lint를 켠 프로젝트에서는 프로젝트 설정을 우선한다.

## 동시성
- goroutine을 추가하거나 수정할 때는 종료 조건, cancellation, channel close 책임을 확인한다.
- `context.Context`가 이미 흐르는 경로에서는 cancellation과 timeout 전달을 끊지 않는다.
