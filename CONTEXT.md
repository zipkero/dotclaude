# Context

저장: 2026-10-11 20:32 +0900

## 현재 목표
context 450K에서 `Stop` hook이 `/context-save`를 실행하게 하고 autocompact는 512K window 안전망으로 두는 구성을, 다른 컴퓨터에서도 같은 상태로 쓰게 한다.

## 현재 상태
이 컴퓨터에는 적용을 마쳤다. `settings.json`이 git 추적 밖이라, 다른 컴퓨터에서는 hook 등록과 window 값을 직접 넣어야 한다.
- 마지막 검증: 스크립트를 이 세션의 대화 기록 파일로 직접 실행했다. 임계값을 10K로 낮춘 복사본은 첫 실행 exit 2, 두 번째는 exit 0(표시 파일), `stop_hook_active: true`는 exit 0이었다. 실제 450K는 82K라 exit 0이었다. 실제 대화에서 450K에 이르러 동작하는 것은 확인하지 못했다.
- 멈춤 원인: 다른 컴퓨터의 `settings.json`은 git으로 전달되지 않는다. 그 컴퓨터에서 pull한 뒤 아래 다음 작업을 해야 한다.
- Git: `main`, `hooks/`·`.gitignore`·이 파일을 커밋해 push함 (기준 HEAD `2cb198f`의 다음 커밋)

## 현재 작업 문서
없음

## 확정된 결정
- 임계값은 450K이고 autocompact는 끄지 않고 `autoCompactWindow: 512000`(약 499K에서 시작)으로 안전망을 둔다. — [hooks/context-save-guard.py](hooks/context-save-guard.py)
- `settings.json`은 git으로 추적하지 않고 `hooks/`와 `CONTEXT.md`만 추적한다. — [.gitignore](.gitignore)

## 미확정 판단
없음

## 다음 작업

- 작업: 다른 컴퓨터의 `~/.claude/settings.json`에 아래 두 항목을 추가한다. 기존 `Stop` hook이 있으면 그 `hooks` 배열에 항목을 더하고, 없으면 아래 형태로 새로 만든다.

  ```json
  "autoCompactWindow": 512000,
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "python3 -I ~/.claude/hooks/context-save-guard.py", "timeout": 10 }
        ]
      }
    ]
  }
  ```

- 완료 기준: 그 컴퓨터에 `hooks/context-save-guard.py`가 있고, `python3 -I -m json.tool ~/.claude/settings.json`이 성공하며, 위 두 항목이 들어 있다.

## 먼저 읽을 파일
- [hooks/context-save-guard.py](hooks/context-save-guard.py) (변경)
- [.gitignore](.gitignore) (변경)

## 문서 반영 필요
- 다른 컴퓨터용 `settings.json` 추가 내용은 이 파일에만 있다.
