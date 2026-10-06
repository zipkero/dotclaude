---
description: >-
  Audit the global configuration — role prompt sufficiency, responsibility boundaries, flow completeness, rule consistency, conformance to current
  official Anthropic guidance, README accuracy, context health, and trimming opportunities
argument-hint: "[대상 파일 또는 skill]"
disable-model-invocation: true
---

> 사용 시점: 전역설정에 변경이 누적되었을 때, 또는 Claude Code 업데이트로 설정 키·하네스 동작이 바뀌었을 때 사용자가 의식적으로 호출한다.

전역설정(`~/.claude`)을 다시 읽고 §관점으로 감사한다.

## 실행 주체와 범위
- main이 모든 대상 파일을 직접 읽고 판정하며 subagent에 맡기지 않는다.
- 범위는 `git ls-files`의 추적 파일 전체이고, 사용자가 대상을 지정하면 그 대상과 판단에 필요한 참조만 읽는다.
- 판정 기준은 그 파일을 읽는 모델이 안정적으로 따르는가다.
  agent frontmatter에 `model`이 있으면 그 모델, 없으면 main 모델이며, 여러 주체가 읽는 파일은 가장 약한 쪽 기준이다.
- 공식 문서는 WebSearch·WebFetch로 직접 가져오며, 가져오지 못한 자료는 그 사실만 적고 근거로 쓰지 않는다.

## 관점
1. 역할 프롬프트 — 각 agent·command·skill이 책임·필수 입력·출력을 정의하고, frontmatter `description`이 발동 조건과 역할 범위를 드러내며, 절차가 만들라는 산출물이 출력 형식에 자리를 갖는가.
   판단 기준·중단 조건은 모델 재량이며, 그 재량이 이 환경에서 실제로 잘못된 결과를 냈을 때만 부족이다.
2. 책임 경계 — 결정·파일 수정·상태 전환·최종 판단 권한이 역할 사이에 섞이지 않고, 본문이 `description` 밖의 정책을 들거나 남이 소유한 기준을 소유자 표시 없이 대체하지 않는가.
3. 플로우 — 각 phase 산출물만으로 다음 phase와 중단된 세션을 재개할 수 있고, 승인 전 확인·미해결 결정·접근 이탈·변경 범위·무효화된 승인이 대화 기억에 기대지 않는가.
   `CLAUDE.md` §agent·skill 라우팅부터 실행 주체까지의 위임 체인, 소유권 참조가 실제로 그 기준을 든 자리에 닿는지, 문서를 쓰는 쪽과 읽는 쪽의 형식, `SPEC §5.N`·`task-<nnn>`의 수명 규칙, 재작성·철회·승인 되돌리기 경로, 어디서도 호출되지 않는 command·skill·agent를 본다.
4. 룰 — 룰끼리의 충돌, 두 갈래로 읽혀 결과가 달라지는 표현, 함께 로드되는 자리의 중복, 적용 순간에 로드되지 않는 오배치(파일 종류 기준은 `rules/**`, 흐름 기준은 그 command·skill, 늘 필요한 기준은 `CLAUDE.md`), `CLAUDE.md`의 자기 룰 위반, 되돌릴 수 있는 국소 변경까지 막는 넓은 질문·중단 게이트를 본다.
5. 방어 지침 — 룰이 오작동할까 봐 붙인 단서, 강도만 올린 경고, 앞줄의 재진술, 모델이 원래 하는 일의 절차 나열은 "이 줄을 지우면 어떤 실수가 생기는가"에 답하지 못하면 제거로 낸다.
   기본값은 제거다.
6. 공식 권고 — `code.claude.com/docs`, `platform.claude.com/docs`(prompt engineering 기준 문서는 `/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices`), `anthropic.com/engineering`, `claude.com/blog`, `github.com/anthropics/claude-code`의 CHANGELOG·releases에서 가져온 문서만 근거로 쓴다.
   권고가 겨냥한 상황과 같은 종류의 설정이 최신 권장과 어긋나는지, Claude Code 변경으로 무효가 된 모델 값·도구·설정 키·frontmatter 필드·하네스 기본값 전제가 남았는지 보고, 관찰한 동작과 문서가 보장하는 범위를 나눠 적는다.
7. Context health — 파일별 분량과 총량, 위임 역할보다 많은 절차, 공식 룰처럼 남은 인수인계·실험 기록, 하네스 시스템 프롬프트가 이미 강제하는 동작의 재진술(그 파일을 읽는 주체가 받는 프롬프트 기준)을 본다.
8. `README.md` — 실제 동작과 맞는지, 폐기된 기능·구조가 남았거나 새 파일이 빠졌는지, 표기·예시·링크가 깨졌는지 본다.
   다른 관점은 적용하지 않는다.

## 출력 형식
- 전체 판정: `정상` / `부족`(역할 프롬프트나 흐름에 구멍) / `과함`(context health 악화) / `충돌`(룰 간 모순) 중 해당하는 값 모두.
- 역할 프롬프트 판정(파일별): `충분` / `부분 부족` / `부족`.
- 발견마다 위치(파일·섹션), 현재 표현, 제안 표현(before/after diff). 오배치는 현재 위치 → 제안 위치와 옮길 사유로 적는다.
- 발견은 두 부류로 나눈다.
  - `문구` — 표현·중복·위치·일관성만 바뀌고 동작은 그대로인 것. 사용자가 적용을 요청하면 개별 확인 없이 한 번에 적용하고 고친 것을 보고한다.
  - `동작` — 적용하면 실제 행동이 달라지는 것. 적용 후 무엇이 달라지는지를 참조 식별자 없는 평문 한두 줄로 붙이고, 사용자의 명시 승인 후에만 적용한다.
    `README.md` §출력 형식 계약에 적힌 자리의 표지 단어·값·위치·이름을 바꾸는 발견은 `동작`이다.
- 순서는 `동작` > 소유·위치 오배치 > `문구`이고, 같은 부류는 영향 범위가 넓은 것부터다.
  `README.md` 부정확은 따로 묶는다.
- 함께 갱신할 파일을 밝히고, 발견이 없으면 확인한 범위와 남은 위험을 적는다.

## 제외
- 선호·일반론만 근거로 한 문구 변경, 실제 손해가 없는 참조 부정확이나 중복.
- 이 환경에서 관찰되지 않은 실패를 막으려고 지침을 더하는 제안.
- 새 워크플로우·정책 체계의 설계.
- 실사용 빈도를 사용자에게 확인하기 전의 파일·흐름 통째 제거 제안.
