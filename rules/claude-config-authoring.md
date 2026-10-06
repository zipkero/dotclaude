---
paths:
  - "**/CLAUDE.md"
  - "**/rules/*.md"
  - "**/agents/*.md"
  - "**/commands/*.md"
  - "**/skills/**/SKILL.md"
---

# Claude Code 설정 파일 작성 기준

- 일하는 방법은 skill, 맥락을 떼어 놓은 실행자는 agent, 과제별 산출물 형식은 command가 갖고, agent는 `skills:`로 짝 skill을 불러오며 본문에 절차를 다시 적지 않는다.
- 산출물을 만드는 agent는 그 산출물을 직접 쓰고, 판단만 하는 agent는 어떤 파일도 쓰지 않는다.
- 파일을 쓰지 않는 agent는 `disallowedTools`로, 그 역할로 턴이 끝나는 command·skill은 `disallowed-tools`로 쓰기 도구를 뺀다.
- 쓰기 도구를 뺀 역할에도 Bash로 파일을 고치지 않는다는 경계는 본문에 적는다.
- 룰이 오작동하면 단서·경고·재진술을 덧붙이지 않고, 그 룰의 발동 조건·표현·형식을 고쳐 쓴다.
