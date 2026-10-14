---
paths:
  - "**/*.cs"
---

# C# 작업 기준

- nullable reference type 설정을 확인하고, null 가능성은 타입과 guard로 드러낸다.
- 문서화 주석은 `///` XML doc의 `<summary>`로 쓰고, 그 밖의 주석은 `//`로 쓴다.
- async API를 추가하거나 고칠 때는 `CancellationToken`이 끝까지 전달되는지 확인한다.
