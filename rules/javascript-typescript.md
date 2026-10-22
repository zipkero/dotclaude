---
paths:
  - "**/*.{js,jsx,mjs,cjs}"
  - "**/*.{ts,tsx,mts,cts}"
---

# JavaScript / TypeScript 작업 기준

- 패키지 매니저는 lockfile로 판단한다: `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.
- 빠진 `await`와 처리되지 않는 Promise를 확인한다.
