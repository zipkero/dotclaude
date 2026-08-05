#!/usr/bin/env node
// 이 저장소의 hook을 현재 기계의 settings.json에 등록한다.
//
// settings.json은 기계마다 다른 값(statusLine 경로, Windows 전용 marketplace)을 들고 있어 추적하지 않는다.
// 그래서 clone한 기계에서는 이 스크립트를 한 번 돌려 hook만 넣는다. 여러 번 돌려도 결과는 같다.
//
//   node hooks/install.mjs [settings.json 경로]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOKS_DIR = dirname(fileURLToPath(import.meta.url));

// 등록할 hook 정의. hook이 늘어나면 이 배열에 더한다.
const WANTED = [
  {
    event: 'PostToolUse',
    matcher: 'Write|Edit',
    script: 'md-width.mjs',
    hook: {
      type: 'command',
      command: 'node "$HOME/.claude/hooks/md-width.mjs"',
      timeout: 15,
      statusMessage: 'Markdown 폭 검사',
    },
  },
];

const settingsPath = process.argv[2] ?? join(homedir(), '.claude', 'settings.json');

let settings = {};
if (existsSync(settingsPath)) {
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (err) {
    console.error(`${settingsPath}를 읽을 수 없습니다: ${err.message}`);
    console.error('JSON이 깨져 있으면 그 파일의 설정 전체가 조용히 무시됩니다. 먼저 고쳐야 합니다.');
    process.exit(1);
  }
} else {
  console.log(`${settingsPath}가 없어 새로 만듭니다.`);
}

const added = [];
const skipped = [];

for (const { event, matcher, script, hook } of WANTED) {
  if (!existsSync(join(HOOKS_DIR, script))) {
    console.error(`${script}가 ${HOOKS_DIR}에 없습니다. 저장소가 온전한지 확인하세요.`);
    process.exit(1);
  }

  settings.hooks ??= {};
  settings.hooks[event] ??= [];

  const already = settings.hooks[event].some((entry) =>
    (entry.hooks ?? []).some((h) => h.command === hook.command),
  );
  if (already) {
    skipped.push(`${event}(${matcher}) → ${script}`);
    continue;
  }

  // 같은 matcher가 이미 있으면 그 안에 더하고, 없으면 항목을 새로 만든다.
  const sameMatcher = settings.hooks[event].find((entry) => entry.matcher === matcher);
  if (sameMatcher) {
    sameMatcher.hooks ??= [];
    sameMatcher.hooks.push(hook);
  } else {
    settings.hooks[event].push({ matcher, hooks: [hook] });
  }
  added.push(`${event}(${matcher}) → ${script}`);
}

if (added.length === 0) {
  console.log('이미 등록되어 있음 — 변경 없음');
  for (const s of skipped) console.log(`  ${s}`);
  process.exit(0);
}

writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
console.log(`${settingsPath}에 등록 완료`);
for (const a of added) console.log(`  + ${a}`);
for (const s of skipped) console.log(`  = ${s} (이미 있음)`);
