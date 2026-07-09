# 언어별 작업 기준

## 적용 범위
- 이 문서는 전역 언어별 기준의 진입점이다.
- 프로젝트의 `CLAUDE.md`, formatter, linter, compiler, test 설정이 있으면 그 기준을 우선한다.
- 여러 언어가 함께 바뀌면 각 언어 기준을 해당 파일에만 적용하고, 공통 변경 판단은 현재 프로젝트 관례를 우선한다.

## 공통 기준
- 공개 API, exported type, 컴포넌트 props, serialization shape 변경은 호출부와 테스트 영향을 함께 확인한다.
- 오류, null, async, cancellation, resource ownership처럼 누락 시 결함으로 이어지는 경계를 우선 확인한다.
- 코드 주석 기준은 `skills/implement/SKILL.md` §주석 작성 기준을 따른다.
- 리뷰 의견은 수정 가능한 구체 지점에 연결하고, 선호 차이만 있는 의견은 실제 유지보수 위험이 있을 때만 남긴다.

## 언어별 문서
- Go 파일을 수정하거나 검토할 때는 `~/.claude/docs/languages/go.md`를 읽고 적용한다.
- C# 파일을 수정하거나 검토할 때는 `~/.claude/docs/languages/csharp.md`를 읽고 적용한다.
- JavaScript 또는 TypeScript 파일을 수정하거나 검토할 때는 `~/.claude/docs/languages/javascript-typescript.md`를 읽고 적용한다.
