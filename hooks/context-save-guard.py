import json, os, sys, tempfile

THRESHOLD = 450_000

# Windows Python은 파이프 입출력을 locale 인코딩(cp949)으로 처리해, 그대로 두면 Claude Code가 받는 한국어가 깨진다.
for stream in (sys.stdin, sys.stdout, sys.stderr):
    stream.reconfigure(encoding="utf-8")

data = json.load(sys.stdin)
if data.get("stop_hook_active"):
    sys.exit(0)

marker_dir = os.path.join(tempfile.gettempdir(), "claude-context-save-guard")
marker = os.path.join(marker_dir, data["session_id"])
if os.path.exists(marker):
    sys.exit(0)

def last_usage(path):
    with open(path, "rb") as f:
        size = f.seek(0, os.SEEK_END)
        chunk = 1 << 20
        while True:
            start = max(0, size - chunk)
            f.seek(start)
            lines = f.read(size - start).splitlines()
            # 읽기 시작점에서 잘린 첫 줄은 json으로 읽히지 않아, 다음 확장에서 온전히 읽는다.
            for line in reversed(lines if start == 0 else lines[1:]):
                try:
                    entry = json.loads(line)
                except ValueError:
                    continue
                message = entry.get("message")
                if not entry.get("isSidechain") and isinstance(message, dict) and message.get("usage"):
                    return message["usage"]
            if start == 0:
                return None
            chunk *= 4


usage = last_usage(data["transcript_path"])
if not usage:
    sys.exit(0)
tokens = sum(usage.get(k) or 0 for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
if tokens < THRESHOLD:
    sys.exit(0)

os.makedirs(marker_dir, exist_ok=True)
open(marker, "w").close()
print(f"context가 {tokens // 1000}K 토큰에 이르렀다. 진행 중인 단위만 마치고 /context-save로 CONTEXT.md를 저장한 뒤 사용자에게 /clear 후 /context-restore로 이어가라고 알린다.", file=sys.stderr)
sys.exit(2)
