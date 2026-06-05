# InsureKit - 프로젝트 맥락 문서
> Claude와 새 세션 시작할 때 이 파일을 먼저 읽고 작업하세요.

## 프로젝트 개요
- **앱명**: InsureKit (보험영업 AI 툴킷)
- **목적**: 보험 영업사원이 고객 관리, 서류 보관, 일정 팔로업을 하는 SaaS
- **판매 방식**: A안 - 고객사별 별도 Supabase + Vercel 배포
- **현재 상태**: 테스트 배포 단계 (3~5명 무료 베타)

## 기술 스택
- **프레임워크**: Next.js 14 (App Router)
- **DB/스토리지**: Supabase (PostgreSQL + Storage)
- **배포**: Vercel (Hobby 무료 플랜)
- **스타일**: 인라인 스타일 (CSS-in-JS 없음)
- **언어**: TypeScript

## GitHub / 배포 정보
- **GitHub**: doublek92k/Repository-name-insure-app
- **메인 URL**: https://insurekit.vercel.app
- **Vercel 프로젝트명**: insurekit
- **Supabase 프로젝트 ID**: tlffsjvkyccwxdpdmcxs
- **로컬 경로**: C:\Users\insure-app

## Supabase 테이블 구조
```
customers   : id(bigserial PK), name, age, job, phone, status, score, memo
documents   : id, customer, type, memo, file_url, file_name, created_at
schedule    : id, customer, date, note, done, created_at
consultations: id, customer_id, content, created_at
```
- **Storage 버킷**: documents (Public) - 파일 업로드용
- **RLS**: 비활성화 (UNRESTRICTED) - anon 키로 전체 접근

## 파일 구조
```
app/
  layout.tsx          - 사이드바 레이아웃 (모바일 햄버거 포함)
  page.tsx            - 홈 대시보드 (통계카드, 파이차트, 바차트, 팔로업 배너)
  customers/
    page.tsx          - 고객 목록 (필터, 엑셀 내보내기, 고객 추가)
    [id]/page.tsx     - 고객 상세 (수정, 삭제, 점수 자동계산, 상담 히스토리)
  documents/page.tsx  - 서류 보관함 (파일 업로드/다운로드)
  schedule/page.tsx   - 일정 & 팔로업 (체크박스, 오늘 일정 강조)
  api/consult/route.ts - 상담AI API (미활성 - ANTHROPIC_API_KEY 필요)
lib/
  supabase.ts         - Supabase 클라이언트 (URL + anon 키 하드코딩)
```

## 완성된 기능
- 홈 대시보드: 통계카드 6개, 파이차트(상태별), 바차트(점수 TOP6), 팔로업 배너
- 고객 관리: 목록/필터/추가/수정/삭제, 엑셀 내보내기
- 고객 상세: 점수 자동계산(나이·직업·상태·메모 기반), 상담 히스토리
- 서류 보관함: 파일 첨부 업로드/다운로드 (Supabase Storage)
- 일정 & 팔로업: 날짜별 관리, 완료 체크, 오늘 일정 강조
- 레이아웃: 모바일 반응형 (햄버거 메뉴)
- 미구현: 다크모드, 로그인/회원가입(멀티테넌시)

## 고객사 배포 방법 (A안)
고객 1명 추가할 때마다:
1. Supabase에서 새 프로젝트 생성 (무료)
2. customers/documents/schedule/consultations 테이블 생성 (SQL 동일하게)
3. documents 버킷 생성 (Public) + Storage 정책 추가
4. lib/supabase.ts의 URL과 anon 키를 새 프로젝트 값으로 변경
5. Vercel에 새 배포 (같은 GitHub 레포 연결, 환경변수만 다르게)
6. 고객 전용 URL 발급: xxx-insurekit.vercel.app

## 현재 배포된 고객사 목록
| 고객명 | URL | Supabase ID | 상태 |
|--------|-----|-------------|------|
| 테스트(본인) | insurekit.vercel.app | tlffsjvkyccwxdpdmcxs | 운영중 |

## 다음 작업 후보
- [ ] 방식 B 전환: Supabase Auth + RLS로 멀티테넌시
- [ ] 상담AI 활성화 (ANTHROPIC_API_KEY 구매 후)
- [ ] 커스텀 도메인 연결 (insurekit.kr)
- [ ] 고객별 배포 자동화 스크립트

## 새 세션에서 Claude에게 전달할 말
"insure-app 프로젝트 이어서 작업해줘.
GitHub: doublek92k/Repository-name-insure-app
CLAUDE.md 먼저 읽고 현재 상태 파악한 뒤 진행해줘."
@AGENTS.md
