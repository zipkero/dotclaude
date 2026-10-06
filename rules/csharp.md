---
paths:
  - "**/*.cs"
---

# C# 작업 기준

- nullable reference type 설정을 확인하고, null 가능성은 타입과 guard로 명확히 표현한다.
- 문서화 주석은 `///` XML doc의 `<summary>`로 쓰고, 그 밖의 주석은 `//`로 둔다.
- async API를 추가하거나 수정할 때는 `CancellationToken` 전달 경로를 유지할 수 있는지 확인한다.
