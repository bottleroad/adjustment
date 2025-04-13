# Monthly Adjustment (월별 카드 사용 내역 관리)

## 프로젝트 소개
Monthly Adjustment는 월별 카드 사용 내역을 효율적으로 관리할 수 있는 웹 애플리케이션입니다. 일시불과 할부 결제를 구분하여 관리하고, 카드사별 사용 금액을 한눈에 파악할 수 있습니다.

## 주요 기능

### 1. 카드 사용 내역 관리
- 카드 사용 내역 등록/조회/삭제
- 일시불/할부 구분 관리
- 결제 금액, 시간, 날짜 정보 관리
- 일시불 항목 일괄 삭제 기능

### 2. 카드 사용 통계
- 전체 사용 금액 합계 표시
- 카드사별 사용 금액 요약
- 일시불/할부 결제 구분 통계

### 3. 필터링 기능
- 전체 내역 조회
- 일시불 내역만 조회
- 할부 내역만 조회

## 기술 스택

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **상태 관리**: React Context API
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **Authentication**: Supabase Auth

### 배포
- **Hosting**: Vercel
- **Database Hosting**: Supabase Cloud

## 데이터 구조

### Task 테이블
```typescript
interface Task {
  id: number
  title: string
  card_type: 'shinhan' | 'hyundai' | 'samsung' | 'bc' | 'kb' | 'lotte' | 'other'
  amount: number
  time: string
  store: string // '일시불' 또는 '할부' 구분
  date: string
  created_at: string
}
```

## 주요 구현 사항

### 1. 반응형 디자인
- TailwindCSS를 활용한 모바일 퍼스트 디자인
- 다크 모드 지원

### 2. 실시간 데이터 처리
- Supabase 실시간 데이터베이스 연동
- 낙관적 UI 업데이트

### 3. 사용자 경험
- 직관적인 아이콘 사용 (일시불: 카드, 할부: 시계)
- 간편한 필터링 시스템
- 금액의 천 단위 콤마 표시

## 환경 설정

### 필수 환경 변수
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 실행 방법

1. 저장소 클론
```bash
git clone https://github.com/bottleroad/adjustment.git
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 빌드
```bash
npm run build
```

## 프로젝트 구조
```
adjustment/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tasks/
│   │   │       ├── route.ts         # 기본 CRUD API
│   │   │       └── all/
│   │   │           └── route.ts     # 전체 삭제 API
│   │   ├── layout.tsx
│   │   └── page.tsx                 # 메인 페이지
│   ├── components/
│   │   ├── add-task.tsx            # 태스크 추가 컴포넌트
│   │   ├── card-summary.tsx        # 카드별 요약 컴포넌트
│   │   ├── task-list.tsx           # 태스크 목록 컴포넌트
│   │   └── total-amount.tsx        # 총액 표시 컴포넌트
│   ├── contexts/
│   │   └── TaskContext.tsx         # 태스크 상태 관리
│   └── lib/
│       └── supabase.ts             # Supabase 클라이언트
├── public/
├── .env                            # 환경 변수
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.ts             # Tailwind 설정
└── tsconfig.json                  # TypeScript 설정
```

## 주요 파일 설명

### Frontend
- `src/app/page.tsx`: 메인 대시보드 페이지
- `src/components/`: UI 컴포넌트들
- `src/contexts/TaskContext.tsx`: 전역 상태 관리

### Backend
- `src/app/api/`: API 라우트 핸들러
- `src/lib/supabase.ts`: 데이터베이스 연결 설정

### 설정 파일
- `.env`: 환경 변수 설정
- `tailwind.config.ts`: UI 스타일링 설정
- `tsconfig.json`: TypeScript 컴파일러 설정

## 라이센스
MIT License
