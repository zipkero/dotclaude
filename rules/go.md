---
paths:
  - "**/*.go"
---

# Go 작업 기준

## 주석
- doc comment는 `// Name ...` 형태로 쓴다.
- struct 필드·상수·지역 선언에 붙는 주석은 godoc에 보이더라도 doc comment로 치지 않는다.
- 한국어로 쓸 때도 식별자 이름을 맨 앞에 두고 조사를 붙인다.
  예: `// Role은 …`, `// Package llm은 …`.
- 프로젝트가 `Name ` 접두어를 검사하는 lint를 쓰면 프로젝트 설정을 따른다.

## 동시성
- goroutine을 추가하거나 고칠 때는 언제 끝나는지, 취소는 어떻게 되는지, channel은 누가 닫는지 확인한다.
- `context.Context`가 이미 전달되는 경로에서는 취소와 timeout 전달을 끊지 않는다.
