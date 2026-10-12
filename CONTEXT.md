# Context

저장: 2026-10-12 09:26 +0900

## 현재 목표
context 450K에서 `Stop` hook이 `/context-save`를 지시하고, `/clear`·autocompact 뒤에는 `SessionStart` hook이 복원·저장을 안내하며, autocompact는 600K window 안전망으로 두는 구성을 모든 기계에 같게 적용한다.

## 현재 상태
호스트 `moonyoung`의 `C:/Users/zipke/.claude/settings.json`에 README §운영의 등록 내용(절대경로)을 넣었다.
커밋 `60c42db`를 만든 기계(호스트 이름 미기록)는 `autoCompactWindow: 512000`과 `Stop` hook만 등록된 상태이고, `SessionStart` hook과 600K window는 아직 없다.
- 마지막 검증: `moonyoung`에서 두 스크립트를 stdin 입력으로 직접 실행했다. 실제 대화에서 450K·`/clear`·autocompact에 이르러 동작하는 것은 확인하지 못했다.
- 멈춤 원인: `settings.json`은 git으로 전달되지 않아, 다른 기계는 pull 뒤 직접 등록해야 한다.
- Git: `main`, 저장 시점 HEAD `60c42db` (이 변경은 아직 커밋하지 않음)

## 현재 작업 문서
없음

## 확정된 결정
- `Stop` hook 임계값은 450K이고, autocompact는 끄지 않고 `autoCompactWindow: 600000`으로 안전망을 둔다. — [README.md §운영](README.md)
- `settings.json`은 git으로 추적하지 않고, 기계마다 README §운영의 내용을 그 기계의 절대경로로 등록한다. — [README.md §운영](README.md)

## 작업 제약
없음

## 미확정 판단
- autocompact가 600K window의 정확히 어느 토큰 수에서 시작하는지는 공식 문서에 없다. — [README.md §운영](README.md)

## 시도했지만 실패한 접근
없음

## 대기 중인 사용자 응답
없음

## 다음 작업

- 작업: 커밋 `60c42db`를 만든 기계에서 pull한 뒤, `~/.claude/settings.json`을 README §운영의 등록 내용대로 바꾼다 (`autoCompactWindow`를 600000으로, `SessionStart` hook 추가, `Stop` hook 경로를 절대경로로).
- 완료 기준: 그 기계에 `hooks/context-save-guard.py`·`hooks/context-session-start.py`가 있고, `python3 -I -m json.tool ~/.claude/settings.json`이 성공하며, README §운영의 세 항목이 들어 있다.

## 먼저 읽을 파일
- [README.md](README.md) (변경)
- [hooks/context-save-guard.py](hooks/context-save-guard.py)
- [hooks/context-session-start.py](hooks/context-session-start.py) (변경)
- [commands/context-save.md](commands/context-save.md) (변경)

## 문서 반영 필요
없음
