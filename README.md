# 포커스 어퍼처 (Focus Aperture) — 7일 집중 조리개

HR 분야 성인 대상 **Powerful Focus 프로그램** (교재: *Powerful Focus*, Thibaut Meurisse).
흐릿함을 걷어내고 한 점에 초점을 맞추는 7일 — 수강생들이 챕터별로 함께 실습하고, 서로의 결과를 실시간 차트로 확인하는 인터랙티브 사이트입니다.

## 구성

| 일차 | 주제 | 실습 | 결과 도표 |
|---|---|---|---|
| Day 1 | 무엇을 원하는가 | 15가지 질문 · 명료함 자가진단 | 명료함 레이더, 응답 완성도, 키워드 빈도 |
| Day 2 | 내 목표는 진짜 내 것인가 | 5개 영역 목표 · 사랑/두려움 기반 | 영역별 지수 막대, 균형 도넛, 목표 주인 도넛 |
| Day 3 | 무엇을 해야 하는가 | 간극 점검 · 전략 세우기 | 3대 점검 막대, 가능성 도넛, 달성도 분포 |
| Day 4 | 어떻게 해야 하는가 | 80/20 · 전략 vs 전술 · 한 그루의 나무 | **파레토 차트**, 활동 4분면, 시간 성격 도넛 |
| Day 5 | 단순화하기 | 제로베이스 · 백지 기법 · 거절 · 방해 줄이기 | 결정 도넛, 확보 시간, 방해 요인 분포 |
| Day 6 | 쓸모없는 입력 줄이기 | 학습 vs 실행 · 과부하 진단 | 학습/실행 도넛, 실행 비율, 과부하 레이더 |
| Day 7 | 마찰과 에너지 낭비 없애기 | 마찰 설계 · 오늘의 3가지 | 마찰 전·후, 진행 결과 도넛 |
| 종합 | 집중 지수 | — | 7축 레이더, 지표 바, 일차별 완성도, 참가자 진행 매트릭스 |

각 일차는 왼쪽 **실습**, 오른쪽 **실시간 결과**(내 결과 + 참가자 비교 + 함께 나눈 답변)로 구성되며 입력하면 자동 저장됩니다.
종합 화면에서 내 답변을 `.md`로 저장하거나 인쇄/PDF로 내보낼 수 있습니다.

## 실행 방법

빌드가 필요 없는 정적 사이트입니다.

- GitHub Pages: 저장소 **Settings → Pages → Deploy from a branch → `main` / `(root)`**
- 로컬: 폴더에서 `python3 -m http.server` 후 `http://localhost:8000`
- 수강생 초대: `https://<계정>.github.io/powerful_focus/?room=세션코드`

## 모드

### 1) 데모 모드 (기본)
`js/config.js`의 `firebaseDatabaseURL`이 비어 있으면 결과가 **그 브라우저에만** 저장되고, 샘플 참가자 7명이 자동으로 채워집니다. 화면 점검·시연용입니다.

### 2) 실시간 공유 모드 (수업용)
수강생끼리 실제로 결과를 공유하려면 무료 Firebase Realtime Database를 연결하세요.

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 만들기
2. **Build → Realtime Database → 데이터베이스 만들기**
3. **규칙(Rules)** 탭에 아래 내용을 붙여 넣고 게시
4. `js/config.js`의 `firebaseDatabaseURL`에 데이터베이스 주소 입력 후 커밋

```json
{
  "rules": {
    "rooms": {
      "$room": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

> 이 규칙은 세션 코드를 아는 누구나 읽고 쓸 수 있습니다. 개인 정보나 민감한 내용을 쓰지 않도록 수강생에게 안내하고, 수업이 끝나면 규칙을 `false`로 바꾸거나 `rooms`를 삭제하세요. 같은 세션 코드를 쓴 사람끼리만 결과가 공유되며, 닉네임만 사용합니다.

## 파일 구조

```
index.html          진입점
css/style.css       디자인
js/config.js        Firebase 주소 등 설정
js/days.js          7일 커리큘럼 · 필드 · 차트 정의 · 집중 지수 계산
js/charts.js        Chart.js 스타일 헬퍼 (레이더·파레토·4분면 등)
js/store.js         저장소 (Firebase REST 폴링 / localStorage)
js/app.js           화면 렌더링
vendor/chart.umd.js Chart.js (로컬 포함)
```

## 저작권 안내
이 저장소의 실습 문항은 교재의 개념을 바탕으로 새로 구성한 것이며 교재 본문을 복제하지 않습니다. 교재는 Thibaut Meurisse의 *Powerful Focus*입니다.
