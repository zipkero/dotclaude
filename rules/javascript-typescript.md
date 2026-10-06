---
paths:
  - "**/*.{js,jsx,mjs,cjs}"
  - "**/*.{ts,tsx,mts,cts}"
---

# JavaScript / TypeScript 작업 기준

- 패키지 매니저는 lockfile 기준으로 판단한다: `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.
- 누락된 `await`와 처리되지 않는 Promise를 확인한다.
- browser, Node.js, bundler, server/client boundary 차이를 명확히 구분한다.
- 외부 입력은 타입만 믿지 말고 런타임 검증이 필요한 경계인지 확인한다.
