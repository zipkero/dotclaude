# .claude

Claude Code 개인 설정 저장소.
늘 지키는 규칙은 `CLAUDE.md`에, 단계별 절차는 각 command·skill에 두고, 이 README는 구조와 의도만 설명한다.

## 의도
- 작업을 검증할 수 있는 단위로 쪼개고, 단위마다 근거를 보고 완료를 판정해 문서에 남긴다.
  세션이 바뀌어도 이어서 할 수 있고, 나중에 다른 사람이 확인할 수 있게 하려는 것이다.
- `features/<feature-dir>/`의 `spec.md`(완료 조건) → `design.md`(설계) → `implement.md`(Task와 검증 조건)가 단계 사이를 잇고, 다음 단계는 대화가 아니라 이 문서들을 읽는다.
- verify가 승인한 Task만 `[x]`가 되고, reject는 `/implement-loop`·`implement-orca`가 아니면 사용자가 판단한다.
- skill은 방법, agent는 컨텍스트를 아끼려고 따로 떼어 맡기는 실행자, command는 산출물 형식과 사용자가 직접 부르는 절차다(`rules/claude-config-authoring.md`).

## 흐름
- **Phased**: `/spec-init → /design-init → /implement-init → implement → verify`
  문서 단계는 slash command, `implement`·`verify`는 자연어로 부르고, 남은 Task는 `/implement-loop`로 이어서 돌릴 수 있다.
  새 프로젝트는 먼저 `/project-init`으로 루트 문서와 마일스톤을 만든다.
- **Per-Request**: `prompt → implement`, `verify`는 필요할 때만 부르고 결과는 대화에만 남는다.
- Phased를 권하는 기준은 `CLAUDE.md` §phase 제어, 지금 어느 쪽인지는 `implement` skill §컨텍스트 로딩이 정하고, `analyze`·`explain`은 어디서든 부른다.

## 구조
| 경로 | 내용 |
|---|---|
| `CLAUDE.md` | 늘 지키는 규칙 |
| `agents/analyzer.md` | 독립 분석, `design.md`·`implement.md` 작성 |
| `agents/implementer.md` | Phased 구현(체크박스는 main이 바꾼다) |
| `agents/verifier.md` | verify 판정만 |
| `commands/project-init.md` | 루트 `README.md`·`ROADMAP.md`·`docs/product.md`·`docs/design.md` 생성 |
| `commands/spec-init.md` · `design-init.md` · `implement-init.md` | feature 문서 생성 |
| `commands/implement-loop.md` | 남은 Task 반복 실행 |
| `commands/config-review.md` | 전역 설정 점검 |
| `commands/cross-analyze.md` | N개 agent 교차검증 분석 |
| `commands/context-save.md` · `context-restore.md` | `CONTEXT.md` 저장·복원 |
| `skills/analyze` · `explain` | 원인 분석·선택지 비교 / 동작 설명 |
| `skills/implement` · `verify` | 구현 / 판정과 판정 뒤 기록 |
| `skills/commit-push` | 스테이징·커밋·푸시 |
| `skills/implement-orca` | implement·verify를 Codex 워커로 실행 |
| `rules/` | `paths`에 맞는 파일을 만질 때만 로드되는 언어별·문서별 기준 |

## 운영 메모
- `project-init`·`implement-loop`·`config-review`는 `disable-model-invocation: true`라 사용자가 직접 부를 때만 돈다.
- `context-restore`·`cross-analyze`·`config-review`는 `disallowed-tools`로 쓰기 도구를 막지만 Bash와 subagent에는 걸리지 않으므로 본문에도 적는다.
- `rules/`는 작업 디렉토리 안 파일에만 걸리고, `paths` 대신 `globs`를 쓰면 항상 로드된다(v2.1.220에서 확인).
- `.gitignore`는 허용 목록 방식이며 `features/`, 세션 데이터, credential, 기계마다 다른 `settings.json`은 추적하지 않는다.
- 응답 길이는 output style `Concise`가 맡고, `outputStyle`은 기계마다 한 번 지정한다.
