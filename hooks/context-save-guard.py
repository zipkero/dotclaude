import json, os, sys, tempfile

THRESHOLD = 450_000

data = json.load(sys.stdin)
if data.get("stop_hook_active"):
    sys.exit(0)

marker_dir = os.path.join(tempfile.gettempdir(), "claude-context-save-guard")
marker = os.path.join(marker_dir, data["session_id"])
if os.path.exists(marker):
    sys.exit(0)

usage = None
with open(data["transcript_path"], errors="ignore") as f:
    for line in f:
        try:
            entry = json.loads(line)
        except ValueError:
            continue
        message = entry.get("message")
        if entry.get("isSidechain") or not isinstance(message, dict):
            continue
        if message.get("usage"):
            usage = message["usage"]

if not usage:
    sys.exit(0)
tokens = sum(usage.get(k) or 0 for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
if tokens < THRESHOLD:
    sys.exit(0)

os.makedirs(marker_dir, exist_ok=True)
open(marker, "w").close()
print(f"context가 {tokens // 1000}K 토큰에 이르렀다. /context-save를 실행해 CONTEXT.md를 저장하고, 사용자에게 /clear 후 /context-restore로 이어가라고 알린다.", file=sys.stderr)
sys.exit(2)
