# KakaoPay MCP Bot - Next.js + Vercel AI SDK 예제

이 예제는 Next.js, Vercel AI SDK, KakaoPay Agent Toolkit을 활용한 카카오페이 챗봇 UI 예제입니다.

## 설치

```bash
npm install
```

## 환경 변수

`.env.local` 파일에 다음을 추가하세요:

```
KAKAOPAY_SECRET_KEY=your_kakaopay_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## 실행

```bash
npm run dev   # 개발 서버 실행
```

## 주요 기능

- MCP 기반 AI 챗봇 UI
- 카카오페이 결제/상태조회/취소
- 실시간 대화형 인터페이스
- 반응형 UI, 브랜드 컬러 적용

## 예시 프롬프트

- "5000원짜리 커피 결제 링크 생성해 줘"
- "모든 결제 상태 확인해 줘"
- "결제 취소해 줘"

## 기술 스택

- Next.js 14
- Vercel AI SDK
- Model Context Protocol (MCP)
- Tailwind CSS
- KakaoPay Agent Toolkit
- OpenAI GPT-4
