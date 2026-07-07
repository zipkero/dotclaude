# JavaScript / TypeScript 작업 기준

## 적용 범위
- 이 문서는 전역 기본값이다. 프로젝트의 `CLAUDE.md`, `package.json`, lockfile, ESLint, Prettier, `tsconfig` 설정이 있으면 그 기준을 우선한다.
- JavaScript, JSX, TypeScript, TSX 파일을 수정하거나 검토할 때 적용한다.

## 코드 작성
- 패키지 매니저는 lockfile 기준으로 판단한다: `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.
- 기존 module system, framework, state management, styling 관례를 따른다.
- TypeScript에서는 불필요한 `any`를 추가하지 않는다.
- 타입 단언은 런타임 근거가 있거나 외부 경계에서 값을 좁히는 경우에만 제한적으로 사용한다.
- 공개 함수, 컴포넌트 props, exported type 변경은 호출부와 테스트 영향을 함께 확인한다.

## 비동기와 런타임 경계
- 누락된 `await`, 처리되지 않는 Promise, 중복 요청, 취소나 timeout 가능성을 확인한다.
- browser, Node.js, bundler, server/client boundary 차이를 명확히 구분한다.
- 외부 입력은 타입만 믿지 말고 런타임 검증이 필요한 경계인지 확인한다.
- React 코드에서는 렌더링 중 side effect를 피하고, 기존 상태/효과 API 사용 규칙과 컴포넌트 분리 관례를 따른다.

## 테스트와 주석
- 기존 script와 test runner 관례를 우선한다.
- 프로젝트 관례가 없고 JS/TS 코드 동작을 바꿨다면 `test`, `lint`, `typecheck` 계열 package script를 확인한다.
- 타입으로 표현 가능한 설명은 주석보다 타입 정의, 이름, 경계 검증을 우선한다.
- 복잡한 narrowing, runtime compatibility, bundler 제약, browser 차이, server/client boundary처럼 오해하면 결함이 되는 제약만 설명한다.
