---
paths:
  - "**/*.go"
---

# Go 작업 기준

## 주석
- doc comment는 `// Name ...` 형태로 쓴다.
- struct 필드, `const`·`var` 블록 안 개별 항목, 지역 선언의 주석은 `// Name ...` 형태가 아니어도 된다.
- 한국어로 쓸 때도 식별자 이름을 맨 앞에 두고 조사를 붙인다(`// Role은 …`, `// Package llm은 …`).
- 프로젝트 lint가 이름 뒤 공백(`Name `)을 검사하면 `// Role 은 …`처럼 이름 뒤를 띄운다.

## 동시성
- goroutine을 추가하거나 고칠 때는 언제 끝나는지, 취소는 어떻게 되는지, channel은 누가 닫는지 확인한다.
- `context.Context`가 이미 전달되는 경로에서는 취소와 timeout 전달을 끊지 않는다.
