---
paths:
  - "**/*.cs"
---

# C# 작업 기준

## 적용 범위
- 프로젝트에 `.editorconfig`, analyzer, formatter, test 설정이 있으면 그 기준을 우선한다.

## 코드 작성
- nullable reference type 설정을 확인하고, null 가능성은 타입과 guard로 명확히 표현한다.
- LINQ는 가독성이 유지되는 범위에서 사용하고, 중첩으로 의도가 흐려지면 명시적 흐름을 우선한다.
- 의존성 주입, 옵션, 로깅, 설정 구성 패턴은 기존 프로젝트 관례를 따른다.
- `///` XML doc은 analyzer나 공개 패키지 관례가 요구할 때만 `<summary>` 한 문장으로 쓰고, 그 밖의 주석은 `//`로 둔다.

## 오류와 비동기
- 예외는 실패 상황 표현에 사용하고, catch 후 근거 없이 삼키지 않는다.
- async API를 추가하거나 수정할 때는 `CancellationToken` 전달 경로를 유지할 수 있는지 확인한다.
- `ConfigureAwait`, synchronization context, background task 처리 방식은 기존 프로젝트 관례를 따른다.
- `IDisposable` 또는 `IAsyncDisposable` 소유권이 생기면 해제 책임을 명확히 한다.

## 테스트
- 기존 테스트 프레임워크와 assertion 스타일을 따른다.
- 프로젝트 관례가 없고 C# 코드 동작을 바꿨다면 `dotnet test`를 우선 검증 명령으로 고려한다.
