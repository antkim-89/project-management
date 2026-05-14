# Database ERD

이 프로젝트의 데이터베이스 엔티티 간 관계를 나타내는 ERD(Entity Relationship Diagram)입니다.

```mermaid
erDiagram
    USER ||--o| RANK : "has"
    USER ||--o{ ASSIGNMENT : "assigned to"
    USER ||--o{ EQUIPMENT : "owns"
    USER ||--o{ LEAVE_REQUEST : "requests"
    USER ||--o{ USER_SKILL : "possesses"
    
    PROJECT ||--o{ ASSIGNMENT : "contains"
    SKILL_SET ||--o{ USER_SKILL : "included in"

    USER {
        string id PK
        string email
        string name
        string rankId FK
        string avatarUrl
        datetime createdAt
    }

    RANK {
        string id PK
        string name
        int baseSalary
    }

    PROJECT {
        string id PK
        string title
        string description
        string status "Active | At Risk | Completed"
        datetime startDate
        datetime endDate
        float budget
    }

    ASSIGNMENT {
        string id PK
        string userId FK
        string projectId FK
        string role
        int contributionPercentage
        datetime startDate
        datetime endDate
    }

    EQUIPMENT {
        string id PK
        string type "Laptop | Monitor | Mobile"
        string modelName
        string serialNumber
        string userId FK
        string status "Assigned | Maintenance"
    }

    LEAVE_REQUEST {
        string id PK
        string userId FK
        datetime startDate
        datetime endDate
        string type "Annual | Sick | Personal"
        string status "Pending | Approved | Rejected"
        string reason
    }

    SKILL_SET {
        string id PK
        string name
        string category "Frontend | Backend | Design"
    }

    USER_SKILL {
        string id PK
        string userId FK
        string skillId FK
        int proficiency "1-5"
    }
```

## 엔티티 상세 설명

- **USER**: 시스템 사용자 정보.
- **RANK**: 사용자의 직급 및 기본 단가 정보.
- **PROJECT**: 관리 대상 프로젝트 정보 및 상태.
- **ASSIGNMENT**: 프로젝트에 투입된 인력 정보와 역할.
- **EQUIPMENT**: 사용자에게 할당된 자산(노트북, 모니터 등).
- **LEAVE_REQUEST**: 사용자의 휴가 신청 내역 및 결재 상태.
- **SKILL_SET**: 기술 스택 마스터 데이터.
- **USER_SKILL**: 사용자가 보유한 기술과 숙련도 정보.
