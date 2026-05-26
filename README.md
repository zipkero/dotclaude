# .claude

Claude Code의 개인 설정 저장소.

> 룰의 본문은 CLAUDE.md에 둔다. 이 README는 구조와 설계 의도를 설명한다.

## Design Intent

### 이 구조가 존재하는 이유
- Claude Code의 기본 동작은 한 번에 답하는 방식이다. 이 설정은 그 흐름을 phased·검증 가능한 단계로 쪼개어 각 단계를 진행하기 전에 검토할 수 있게 한다.
- feature 문서는 phase 사이를 잇는 기준 문서 역할을 한다.
- implement → verify → 상태 전환은 명시적인 판단 단계다.
- 세션 종료 후에는 session-wrap을 통해 학습 후보(rule, skill, docs)를 추출한다.

### Harness 방향

현재 구조는 다음 축을 가진다.

- Scaffolding — commands, skills, agents, docs
- Context — phase 문서 handoff, Explore 분리
- Planning — spec-init, analyze-init, implement-init
- Orchestration — analyzer, implementer, verifier
- Verification — verify evidence 기반 판단
- Compound — session-wrap, global-review

## Workflow

### Phased

```text
prompt
→ /spec-init
→ /analyze-init
→ /implement-init
→ implement
→ verify
→ /session-wrap
```

### Per-Request

```text
prompt
→ implement
→ verify
```

## Additional Commands

- global-review — 구조, context health, harness 균형 점검
- flow — 코드 흐름 분석
- session-wrap — handoff, learnings, rule 후보, skill 후보 추출

## Harness Documents

```text
docs/harness/
├── verification-evidence.md
└── runtime-gates.md
```

- verification-evidence.md — verify 근거 보존 원칙
- runtime-gates.md — 위험 작업 승인 체계
