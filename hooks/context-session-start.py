import json, os, sys

# Windows Python은 파이프 입출력을 locale 인코딩(cp949)으로 처리해, 그대로 두면 Claude Code가 받는 한국어가 깨진다.
for stream in (sys.stdin, sys.stdout, sys.stderr):
    stream.reconfigure(encoding="utf-8")

data = json.load(sys.stdin)
source = data.get("source")

if source == "compact":
    print("autocompact가 일어났다. 진행 중인 단위만 마치고 /context-save로 CONTEXT.md를 저장한 뒤 사용자에게 /clear 후 /context-restore로 이어가라고 알린다.")
elif source in ("startup", "clear") and os.path.exists(os.path.join(data.get("cwd") or "", "CONTEXT.md")):
    print("작업 디렉토리에 CONTEXT.md가 있다. 사용자의 첫 요청이 이전 작업을 이어가는 것이면 먼저 /context-restore로 맥락을 복원한다.")
