---
paths:
  - "**/CLAUDE.md"
  - "**/rules/*.md"
  - "**/agents/*.md"
  - "**/commands/*.md"
  - "**/skills/**/SKILL.md"
---

# Claude Code 설정 파일 작성 기준

- 본문은 한국어, frontmatter `name`·`description`은 영어로 쓴다.
- Markdown은 한 줄에 한 문장을 쓴다.
- 일하는 방법은 skill, 따로 떼어 맡기는 실행자는 agent, 산출물 형식은 command에 둔다.
- agent는 `skills:`로 짝 skill을 불러오고, 그 절차를 본문에 다시 적지 않는다.
- 산출물을 만드는 agent는 직접 파일을 쓰고, 판단만 하는 agent는 파일을 쓰지 않는다.
- 파일을 쓰지 않는 agent는 `disallowedTools`로, 그 일로 턴이 끝나는 command·skill은 `disallowed-tools`로 쓰기 도구를 막는다.
- 쓰기 도구를 막아도 Bash로는 고칠 수 있으므로, Bash로 파일을 고치지 않는다는 문장을 본문에 둔다.
- 규칙이 잘못 작동하면 경고나 단서를 덧붙이지 말고 그 규칙 자체를 고친다.
