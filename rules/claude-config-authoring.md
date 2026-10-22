---
paths:
  - "**/CLAUDE.md"
  - "**/rules/*.md"
  - "**/agents/*.md"
  - "**/commands/*.md"
  - "**/skills/**/SKILL.md"
---

# Claude Code 설정 파일 작성 기준

- 본문은 한국어, frontmatter `name`·`description`은 영어로 쓰고, Markdown은 한 줄에 한 문장을 쓴다.
- 일하는 방법은 skill, 따로 떼어 맡기는 실행자는 agent, 산출물 형식과 사용자가 직접 부르는 절차는 command에 두고, agent는 `skills:`로 짝 skill을 불러오며 그 절차를 다시 적지 않는다.
- 판단만 하는 agent와 그 일로 턴이 끝나는 command는 `disallowedTools`·`disallowed-tools`로 쓰기 도구를 막는다.
- 판단만 하는 agent·command·skill은 Bash로도 파일을 고치지 않는다는 문장을 본문이나 짝 skill에 둔다.
- 규칙이 잘못 작동하면 경고나 단서를 덧붙이지 말고 그 규칙 자체를 고친다.
