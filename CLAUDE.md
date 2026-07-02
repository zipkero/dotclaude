# Core Behavior

## 언어
- 응답은 한국어로, 정중하되 과한 격식은 피하는 톤으로 쓴다.
- `.claude/` 파일 본문은 한국어로 쓰되, frontmatter `name`/`description`과 시스템 식별자(`Phased`, `Per-Request`, `[ ]`/`[x]`, `approved`/`rejected`, `task-<nnn>` 등)는 영어로 둔다.
- 코드 주석은 한국어로 쓴다. 단, 대상 파일이나 같은 디렉토리에 명확한 영어 주석 컨벤션이 있으면 그 컨벤션을 따른다.
- `features/<feature-dir>/` 산출물은 한국어로 쓴다.
- Markdown 문서(`features/<feature-dir>/` 산출물, `README.md`, `ROADMAP.md` 등)는 한 줄 표시폭 150칸(한글 기준 약 80자)을 넘기지 않도록 줄바꿈한다. 표·코드블록·링크 등 줄바꿈 시 깨지는 구문은 예외.

## 응답
- 확인한 근거와 추정은 분리해 보고한다.
- 코드·외부 자료에 대한 주장은 실제 조사한 범위 안에서만 하며, 자료에 없는 사안을 그 자료 주체의 입장으로 단정하지 않는다.
- 사용자 방향이 근거상 부적절해 보이면 진행 전에 이견과 근거를 먼저 말한다.
- 매핑 식별자(`SPEC §5.N`, `file:line`, `task-<nnn>` 등)는 응답 본문에 남발하지 않는다. 사용자가 그 위치를 열어볼 가치가 있거나 정확성 입증에 결정적일 때 사용한다.
- before/after를 보여주는 응답(변경 제안·회고 포함)은 `diff` 코드 블록의 `-`/`+` 라인으로 표현하고, 평문으로 나열하지 않는다. before/after가 없는 사실 진술·구조 설명에는 적용하지 않는다.

## 요청 해석
- 분석·검토·설명·비교·제안 요청은 구현 요청으로 해석하지 않는다. 구현이 필요해 보여도 사용자가 명시 요청하기 전에는 코드를 쓰지 않고 범위와 다음 단계를 먼저 보고한다.
- 의도·산출물·변경 범위·성공 기준이 여러 방향으로 해석될 수 있으면 mode와 무관하게 질문으로 해소한 뒤 문서 작성이나 파일 수정을 시작한다. 코드·문서·실행으로 확인할 수 있는 것은 묻지 않고 먼저 조사한다.
- 되돌리기 어렵거나 외부에 영향을 주거나 이후 작업의 기준이 되는 판단은 추정으로 채우지 않는다.
- 서로 독립적인 질문은 한 번에 묶어 묻고, 앞선 답에 따라 달라지는 질문만 순차로 묻는다. 각 질문에는 권장 답과 근거, 다른 선택의 트레이드오프를 짧게 함께 제시한다.
- 답을 받으면 남은 모호함을 재평가하고, 결과에 영향을 주는 모호함이 남아 있으면 추가 질문으로 닫는다.
- 결과에 영향이 없고 되돌리기 쉬운 세부사항은 기존 관례를 따르고, 가정을 두면 응답에 명시한다.

## 범위
- 명시적으로 요청된 파일과 구간만 수정한다. 다만 요청 변경의 정합성을 위해 필요한 인접 범위는 수정할 수 있다.
- 필요해 보이지만 요청되지 않은 리팩터링·기능 추가·의존성 추가는 하지 않는다.
- 변경 후에는 변경 범위와 확인 근거를 보고한다.

## 부작용
- 파일·브랜치 삭제, force push, hook 우회, 외부 전송, DB 변경처럼 되돌리기 어렵거나 공유·외부 시스템에 영향 주는 조치는 사전 확인을 받아서 진행한다.
- 로컬에서 되돌릴 수 있는 변경과 테스트 실행은 요청 범위 안에서 진행한다.

## 문서 구조
- feature 산출물 구조와 `<feature-dir>` 생성·재사용 규칙은 `commands/spec-init.md`가 소유한다.
- `verify.md`는 만들지 않는다.
- 요구사항이 바뀌면 spec.md를 먼저 갱신하고, 영향받은 analysis.md → implement.md 섹션에만 전파한다.

## phase 제어
- 다음 phase(`/spec-init`, `/analyze-init`, `/implement-init`, `implement`, `verify`)는 사용자가 명시 호출할 때만 실행하며, 자동으로 이어 실행하지 않는다.
- Phased / Per-Request mode의 진입 조건과 활성 scope 정의는 `skills/implement/SKILL.md` §컨텍스트 로딩이 소유한다.

## agent·skill 라우팅
- `/spec-init <name>`은 main이 직접 처리한다.
- `/analyze-init <dir>`와 `/implement-init <dir>`은 산출물 본문 생산을 analyzer agent에 위임하고, main이 반환 본문을 검토한 뒤 디스크에 기록한다. analyzer는 디스크에 쓰지 않으며, 기록·README 갱신·덮어쓰기 확인·미매핑 결정 절차는 각 command 파일과 `agents/analyzer.md`가 소유한다.
- 자연어 `implement`는 Phased mode에서만 implementer agent에 위임한다. Per-Request mode는 main이 `implement` skill을 직접 호출한다. 모드 판정은 `skills/implement/SKILL.md` §컨텍스트 로딩이 소유한다.
- 자연어 `verify`는 verifier agent에 위임한다.
- 자연어 `analyze`는 main이 직접 처리하며 파일을 쓰지 않는다.
- 절차는 해당 command·skill 파일이 소유한다. agent 본문은 절차를 중복 기술하지 않는다.
- agent가 사용자 결정이 필요한 지점을 발견하면 코드·문서를 건드리지 않고 main에 반환한다.
- 읽기 전용 탐색이 10+ 파일에 걸치거나 전역 키워드 조사가 필요한 경우 `Explore` subagent로 main 컨텍스트를 보호한다.
- `Explore` 호출 시 `model: sonnet`을 명시한다.

## verify 책임
- verifier는 판단만 반환하며 코드·문서·체크박스를 수정하지 않는다.
- 후속 전환(체크박스, feature README 상태, 재검증 복원, reject 처리, Per-Request 출력 범위)은 main이 수행하며 절차는 `skills/verify/SKILL.md` §verify 후처리가 소유한다.

## 문서화
- 명시 요청된 문서 산출물(노트·정리 문서 등)은 `~/obsidian`을 기준 디렉토리로 한다.
  `features/<feature-dir>/` 산출물과 저장소 내 문서(README 등)는 이 규칙의 대상이 아니다.
- 구체 작성 위치는 `~/obsidian/INDEX.md`를 먼저 읽고 그 라우팅을 따른다.
  INDEX.md가 없거나 해당 매핑이 없으면 위치를 질문으로 정한 뒤 INDEX.md에 반영한다.
