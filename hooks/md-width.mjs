#!/usr/bin/env node
// Markdown 한 줄 표시폭 검사 — PostToolUse(Write|Edit) hook.
// CLAUDE.md §언어의 150칸 규칙을 집행한다. 초과 줄을 stderr로 알리고 exit 2로 돌려준다.
//
// 표시폭은 비ASCII 문자를 2칸으로 센다 (한글·CJK 기준. 이모지는 근사값).
// 예외 — fenced code block 안쪽, 표 행, 그리고 한 줄에 담을 수 없는 토큰이 있어
// 줄바꿈으로는 해결되지 않는 줄(긴 URL·경로 등).
//
// 일괄 점검: node md-width.mjs --scan <파일...>

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';

const MAX_WIDTH = 150;

// 검사 대상은 CLAUDE.md §언어가 정한 범위 — 전역설정 본문, feature 산출물, 프로젝트 루트 문서.
// 남의 저장소 문서까지 막지 않으려고 좁혀 둔 것이므로, 넓히려면 여기에 패턴을 더한다.
function inScope(path) {
  const p = path.replace(/\\/g, '/');
  const configDir = `${homedir().replace(/\\/g, '/')}/.claude/`;
  if (p.startsWith(configDir)) return true;
  if (/(^|\/)features\/[^/]+\//.test(p)) return true;
  return /(^|\/)(README|ROADMAP)\.md$/.test(p);
}

function displayWidth(text) {
  let w = 0;
  for (const ch of text) w += ch.codePointAt(0) > 0x7f ? 2 : 1;
  return w;
}

function findViolations(path) {
  const violations = [];
  let inFence = false;

  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    if (/^\s*\|/.test(line)) return;

    const width = displayWidth(line);
    if (width <= MAX_WIDTH) return;

    // 가장 긴 토큰이 들여쓰기와 함께 한 줄에 들어가지 못하면 줄바꿈으로 고칠 수 없다.
    const indentWidth = displayWidth(line.match(/^\s*/)[0]);
    const maxToken = Math.max(
      ...line.trim().split(/\s+/).map(displayWidth),
    );
    if (indentWidth + maxToken > MAX_WIDTH) return;

    violations.push({ line: i + 1, width });
  });

  return violations;
}

const args = process.argv.slice(2);

if (args[0] === '--scan') {
  let total = 0;
  for (const path of args.slice(1)) {
    for (const v of findViolations(path)) {
      console.log(`${path} : ${v.line}줄 = ${v.width}칸`);
      total++;
    }
  }
  console.log(`초과 ${total} 건`);
  process.exit(0);
}

const raw = readFileSync(0, 'utf8');
if (!raw.trim()) process.exit(0);

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.exit(0);
}

const path = payload?.tool_input?.file_path;
if (!path || !path.endsWith('.md')) process.exit(0);
if (!inScope(path)) process.exit(0);

let violations;
try {
  violations = findViolations(path);
} catch {
  process.exit(0);
}
if (violations.length === 0) process.exit(0);

console.error(
  `${path} — 한 줄 표시폭 ${MAX_WIDTH}칸 초과 ${violations.length}건. 문장·절 경계에서 줄을 나눠 고칠 것.`,
);
for (const v of violations) console.error(`  ${v.line}줄: ${v.width}칸`);
process.exit(2);
