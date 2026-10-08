---
name: commit-push
description: >-
  Stage, commit, and optionally push the current work with the user's commit message template. Use whenever the user asks to stage, commit, or push
  (e.g. "스테이징/커밋/푸시", "커밋해", "커밋 메시지 추천"), including when the request is mixed into another instruction.
argument-hint: "[제목만]"
---

## 절차
1. 현재 브랜치와 `git status`를 확인한다.
   사용자가 지정한 브랜치(예: "메인에")와 현재 브랜치가 다르면 멈추고 묻는다.
2. 이번 작업 파일만 스테이징하고, 이번 작업과 무관한 변경은 스테이징하지 않은 채 보고에 적는다.
3. §메시지 템플릿으로 커밋한다.
4. 사용자가 푸시까지 요청했으면 현재 브랜치의 upstream으로 푸시하고, 거절되면 멈추고 보고한다.
5. `$ARGUMENTS`가 "제목만"이거나 사용자가 메시지 추천만 요청했으면 커밋하지 않고 제목 후보만 낸다.

## 메시지 템플릿
```
<제목: 달라지는 동작을 짧은 명사형으로 요약>

<본문: 이유가 제목에 다 드러나지 않을 때만. diff만으로 알 수 없는 이유·제약·버린 대안을 한 줄에 한 문장씩>
```
- `Co-Authored-By` 같은 attribution 줄은 붙이지 않는다.

## 보고
커밋 SHA와 제목, 푸시 여부와 대상 브랜치, 스테이징하지 않은 변경 파일을 적는다.
