---
description: >-
  Audit the global configuration — role boundaries, duplication, defensive rules, ambiguity, flow integrity, conformance to current official
  Claude Code documentation, and README accuracy
argument-hint: "[대상 파일 또는 skill]"
disable-model-invocation: true
---

> 사용 시점: 전역설정에 변경이 누적되었을 때, 또는 Claude Code 업데이트로 설정 키·하네스 동작이 바뀌었을 때 사용자가 의식적으로 호출한다.

전역설정(`~/.claude`)을 다시 읽고 §관점으로 감사한다.

## 범위
- main이 `git ls-files`의 추적 파일 전체를 직접 읽고, 사용자가 대상을 지정하면 그 대상과 판단에 필요한 참조만 읽는다.
- 판정 기준은 그 파일을 읽는 모델이 안정적으로 따르는가다.
  agent frontmatter에 `model`이 있으면 그 모델, 없으면 main 모델이며, 여러 주체가 읽는 파일은 가장 약한 쪽 기준이다.

## 관점
1. 역할 — 각 파일이 `description`의 역할만 하고 `rules/claude-config-authoring.md`의 역할 분담을 지키는가, 다른 파일이 소유한 기준이나 결정·파일 수정·상태 전환 권한을 침범하지 않는가, 적용 순간에 로드되는 자리(파일 종류 기준은 `rules/`, 흐름 기준은 그 command·skill, 늘 필요한 기준은 `CLAUDE.md`)에 있는가.
2. 중복 — 같은 뜻이 함께 로드되는 자리(같은 파일, `CLAUDE.md`와 command·skill, 하네스 시스템 프롬프트)에 다른 표현으로 다시 있는가.
3. 방어 지침 — 룰이 오작동할까 봐 붙인 단서, 강도만 올린 경고, 한 뜻을 늘여 쓴 문장, 모델이 원래 하는 일의 절차 나열에 해당하는 줄은 모두 삭제 제안으로 낸다.
4. 명확성 — 두 갈래로 읽혀 결과가 달라지는 표현과 룰끼리의 충돌.
5. 플로우 — 각 phase 산출물만으로 다음 phase와 중단된 세션을 이어갈 수 있는가.
   위임 체인, 소유권 참조가 실제 기준에 닿는지, 문서를 쓰는 쪽과 읽는 쪽의 형식, 어디서도 호출되지 않는 command·skill·agent를 본다.
6. 공식 문서 — Claude Code 변경으로 무효가 된 모델 값·도구·설정 키·frontmatter 필드·하네스 기본값 전제가 남았는가.
   `code.claude.com/docs`와 `github.com/anthropics/claude-code`의 CHANGELOG를 WebFetch로 직접 가져와 근거로 쓰고, 가져오지 못했으면 그 사실만 적는다.
7. `README.md` — 실제 동작과 맞는지, 폐기된 기능이 남았거나 새 파일이 빠졌는지, 링크가 깨졌는지 본다.

제안은 기존 룰을 고치거나 지우는 쪽으로 내고, 새 지침은 이 환경에서 관찰된 실패가 있을 때만 더한다.

## 출력 형식
- 발견마다 관점 번호, 위치(파일·섹션), before/after diff, 줄 수 증감을 적고, 끝에 전체 줄 수 합계를 적는다.
- 발견은 `문구`(동작 그대로)와 `동작`(행동이 달라짐)으로 나누며, `README.md` §출력 형식 계약에 적힌 표지 단어·값·위치·이름을 바꾸는 것은 `동작`이다.
  `문구`는 적용 요청 시 한 번에 적용하고, `동작`은 달라지는 것을 한두 줄로 붙여 사용자 승인 후 적용한다.
- 발견이 없으면 확인한 범위를 적는다.
