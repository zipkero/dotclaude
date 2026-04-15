# .claude

Claude Code 개인 설정 저장소.

## 구조

```
CLAUDE.md          # 프로젝트/글로벌 공통 규칙 (Korean, agent orchestration 등)
config.json        # Claude Code 기본 설정
```

### agents/~ 커스텀 서브에이전트 정의
- `analyzer.md` — 분석 에이전트
- `implementer.md` — 구현 에이전트
- `reviewer.md` — 리뷰 에이전트

### commands/~ 슬래시 커맨드 정의.
- `implement-init.md` — IMPLEMENT.md 작성
- `plan-init.md` — PLAN.md 작성

### skills/
스킬 정의 (analyze, implement, review).

## 관리 방침

- `.gitignore`에서 화이트리스트 방식으로 추적 대상 관리
- 세션 데이터, 캐시, credentials 등은 추적 제외
