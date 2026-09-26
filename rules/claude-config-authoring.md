---
paths:
  - "**/agents/*.md"
  - "**/commands/*.md"
  - "**/skills/**/SKILL.md"
---

# Claude Code 설정 파일 작성 기준

- agent 본문에 절차를 다시 적지 않는다.
- 파일을 쓰지 않는 agent는 `disallowedTools`로, 그 역할로 턴이 끝나는 command·skill은 `disallowed-tools`로 쓰기 도구를 뺀다.
- 쓰기 도구를 뺀 역할에도 Bash로 파일을 고치지 않는다는 경계는 본문에 적는다.
