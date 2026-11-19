"""usage: python summarize.py <run-dir>...

run.sh가 만든 판마다 모든 턴을 더한 측정값과 main의 도구 호출 순서, 작업 트리 변경, 응답 앞부분을 출력한다.
CLAUDE.md loaded가 False인 판은 설정 사본이 로드되지 않은 것이므로 버린다.
"""
import glob
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")


def target(c):
    i = c.get("input", {})
    v = i.get("file_path") or i.get("skill") or i.get("subagent_type") or i.get("command") or i.get("pattern") or ""
    return str(v).replace("\n", " ")[:80]


def tool_uses(path):
    for line in open(path, encoding="utf-8"):
        if '"tool_use"' not in line:
            continue
        content = json.loads(line).get("message", {}).get("content")
        if isinstance(content, list):
            yield from (c for c in content if c.get("type") == "tool_use")


for run in sys.argv[1:]:
    turns = sorted(glob.glob(os.path.join(run, "t*.json")), key=lambda p: int(os.path.basename(p)[1:-5]))
    if not turns:
        print(f"##### {run}: 결과 없음")
        continue
    last = turns[-1]
    try:
        r = json.load(open(last, encoding="utf-8"))
    except ValueError:
        print(f"##### {run}: {last} 파싱 실패, {last[:-5]}.err 확인")
        continue
    sessions = glob.glob(os.path.join(run, "home", ".claude", "projects", "*", r["session_id"] + ".jsonl"))
    if not sessions:
        print(f"##### {run}: 세션 기록 없음")
        continue
    main = sessions[0]
    subs = glob.glob(main[:-6] + "/subagents/*")
    agent_types = [json.load(open(p, encoding="utf-8")).get("agentType") for p in subs if p.endswith(".meta.json")]
    sub_logs = [p for p in subs if p.endswith(".jsonl")]
    text = open(main, encoding="utf-8").read()
    results = [json.load(open(p, encoding="utf-8")) for p in turns]
    cost = sum(x.get("total_cost_usd", 0) for x in results)
    num_turns = sum(x.get("num_turns", 0) for x in results)
    tokens_in = sum(x.get("usage", {}).get(k, 0) for x in results for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
    tokens_out = sum(x.get("usage", {}).get("output_tokens", 0) for x in results)
    main_calls = [f"{c['name']}:{target(c)}" for c in tool_uses(main)]
    total_calls = len(main_calls) + sum(1 for p in sub_logs for _ in tool_uses(p))
    status = open(os.path.join(run, f"status-{os.path.basename(last)[:-5]}.txt"), encoding="utf-8").read().split("\n")

    print(f"\n##### {run} (턴 {len(turns)}회)")
    print(f"num_turns {num_turns} cost ${cost:.2f} in {tokens_in} out {tokens_out} "
          f"tools {total_calls} subagents {agent_types}")
    print("CLAUDE.md loaded:", "Contents of /home/node/.claude/CLAUDE.md" in text)
    for call in main_calls:
        print("  ", call)
    print("changed:", [s for s in status if s])
    print((r.get("result") or "")[:600])
