---
paths:
  - "**/CLAUDE.md"
  - "**/rules/*.md"
  - "**/agents/*.md"
  - "**/commands/*.md"
  - "**/skills/**/SKILL.md"
  - "**/hooks/*.sh"
---

# Claude Code 설정 파일 작성 기준

- 본문은 한국어, frontmatter `name`·`description`은 영어로 쓰고, Markdown은 한 줄에 한 문장을 쓴다.
- 일하는 방법은 skill, 따로 떼어 맡기는 실행자는 agent, 산출물 형식과 사용자가 직접 부르는 절차는 command에 둔다.
- agent는 `skills:`로 짝 skill을 불러오고, 그 skill의 절차를 agent 본문에 다시 적지 않는다.
- 여러 init command가 함께 쓰는 feature 문서 수정 절차는 `rules/feature-docs.md`에 둔다.
- 판단만 하는 agent·command·skill은 Bash로도 작업 트리 파일(git이 무시하는 파일 제외)을 고치지 않는다는 문장을 본문이나 짝 skill에 둔다.
- 그중 agent와, 판단을 마치면 턴이 끝나는 command는 `disallowedTools`·`disallowed-tools`로도 쓰기 도구를 막는다.
- 규칙이 잘못 작동하거나 규칙끼리 충돌하면 경고·단서·조건을 덧붙이지 말고 원인인 규칙 자체를 고친다.
- 특정 agent에만 걸 hook은 그 agent frontmatter `hooks:`에 `sh "$HOME/.claude/hooks/<이름>.sh"`와 `onFailure: block`으로 두고, 모든 세션에 걸 hook만 기계마다 `settings.json`에 등록한다.
- `~/.claude/hooks/` 스크립트는 macOS와 Windows Git Bash의 `sh`에서 함께 돌도록 POSIX sh와 POSIX 옵션으로 쓰고, POSIX 밖의 명령은 hook 입력 JSON을 읽는 `jq`만 쓴다.
- `jq` 출력은 Windows에서 줄 끝에 `\r`이 붙으므로 `tr -d '\r'`를 거쳐 비교한다.
