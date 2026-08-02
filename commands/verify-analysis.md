---
description: Independently verify analysis.md against its approved spec.md, project sources, code, tests, and configuration
---

> 사용 시점: `/analyze-init` 이후, `/implement-init` 이전. ANALYSIS 작성과 승인을 분리한다.

Feature directory: $ARGUMENTS

## 역할과 실행 주체
- verifier agent가 현재 `analysis.md`를 승인된 `spec.md`와 실제 코드·테스트·설정에 독립적으로 대조해 `approved` 또는 `rejected` 후보를 반환한다.
- verifier는 문서·코드·체크박스를 수정하지 않는다. main이 근거를 검토해 최종 판단과 README 상태 전환을 수행한다.
- 별도 검증 결과 Markdown 문서는 만들지 않는다.

## 전제 조건
- feature directory가 비어 있으면 중단한다.
- `README.md`, `spec.md`, `analysis.md`가 없으면 필요한 선행 command를 안내하고 중단한다.
- README의 `SPEC`이 `[x]`가 아니면 `/spec-init`이 필요하다고 보고하고 중단한다.
- 재검증이면 현재 `ANALYSIS`, `IMPLEMENT`, Task 체크박스 상태와 승인 뒤 바뀐 문서·코드·설정 범위를 함께 확인한다.

## 판단 기준
1. 모든 `SPEC §5.N`이 관련 설계 본문에 추적되며 요구사항이 추가·누락·약화되지 않았다.
2. 책임 경계, 데이터 소유권, 호출 방향과 실패 처리 위치가 실제 코드·설정에 맞다.
3. 진입점부터 산출물까지의 흐름, 상태 전이, 외부 연동과 실패 경로가 구현 Task를 만들 수 있을 만큼 확정됐다.
4. 경계를 가로지르는 인터페이스와 실제 변경 대상·의존 관계가 빠짐없이 설명됐다.
5. 주요 Decision Point에 채택안, 근거와 주요 대안의 대가가 남아 있어 다음 단계에서 설계를 다시 결정할 필요가 없다.
6. 확인 사실과 추정이 구분되고, 미답 `승인 전 확인`이나 미채택 결정이 다음 단계로 유실되지 않았다.
7. 새 세션에서 `spec.md`와 `analysis.md`만 읽고 설계를 새로 정하지 않은 채 implement.md를 작성할 수 있다.

## 검증 절차
1. `SPEC §5.N`과 analysis.md의 구조·데이터 흐름·인터페이스·영향 범위·Decision Points를 기준 목록으로 만든다.
2. 관련 프로젝트 문서와 실제 코드·테스트·설정을 직접 조사한다. analysis.md의 `근거`나 analyzer의 요약만으로 사실을 확정하지 않는다.
3. 기준마다 직접 확인한 원본을 근거로 연결하고 `충족`, `불충족`, `근거 부족`으로 판정한다.
4. 하나라도 `불충족` 또는 `근거 부족`이면 `rejected`, 모두 `충족`이면 `approved` 후보로 판단한다.

## 반환 형식
1. 판정: `approved` | `rejected` 후보
2. 대상: feature와 `analysis.md`
3. 검증: 판단 기준 순서대로 기준, 출처, 직접 확인한 근거와 결과를 적는다.
4. 문제: 거절 사유와 다시 필요한 command(`/analyze-init`, 승인된 요구사항 변경은 `/spec-init`); 없으면 `없음`
5. 남은 한계: 실행하지 못했거나 확인할 수 없던 근거; 없으면 `없음`

## 상태 전환
- main은 후보 판단과 근거를 검토한 뒤에만 최종 상태를 전환한다.
- 최초 검증이 `approved`이면 README의 `ANALYSIS`만 `[x]`로 바꾸고 `- <yyyy-MM-dd>: ANALYSIS 승인`을 작업 히스토리에 추가한다.
- 승인된 ANALYSIS를 내용 변경 없이 재검증해 `approved`이면 현재 Task 체크박스와 `IMPLEMENT` 상태를 보존한다.
- 최종 `rejected`이면 `ANALYSIS`를 `[ ]`로 유지하고 `/implement-init`으로 진행하지 않는다.
- 이미 승인된 ANALYSIS의 재검증이 `rejected`이면 `ANALYSIS`, `IMPLEMENT`를 `[ ]`로 되돌리고 기존 `implement.md`의 모든 Task 체크박스를 `[ ]`로
  바꾼 뒤 `- <yyyy-MM-dd>: ANALYSIS 재검증 거절로 구현 승인 상태 초기화`를 작업 히스토리에 추가한다.

## 핵심 질문
> 이 분석을 실제 코드와 함께 읽은 독립 검증자가 설계를 다시 결정하지 않고 구현 체크리스트로 넘길 수 있는가?
