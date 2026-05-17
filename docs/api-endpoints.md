# 주요 API 엔드포인트 (Backend)

백엔드 서버의 주요 API 엔드포인트 목록입니다.

- **기본 베이스 URL**: `http://localhost:4000`

---

## 1. 프로젝트 (Projects)

| HTTP 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| `GET` | `/projects` | 전체 프로젝트 목록 조회 (참여 인원 포함) |
| `GET` | `/projects/:id` | 특정 프로젝트 상세 조회 |
| `POST` | `/projects` | 새 프로젝트 생성 |
| `PUT` | `/projects/:id` | 프로젝트 정보 수정 |
| `DELETE` | `/projects/:id` | 프로젝트 삭제 |

---

## 2. 헬스체크 (Health Check)

| HTTP 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| `GET` | `/health` | 서버 상태 확인 및 헬스체크 |
