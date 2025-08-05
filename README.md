# 카카오페이 Agent Toolkit

카카오페이 Agent Toolkit은 OpenAI Agent SDK, LangChain, Vercel AI SDK, Model Context Protocol(MCP) 등 다양한 에이전트 프레임워크에서 카카오페이 API를 함수 호출(Function Calling) 방식으로 연동할 수 있도록 지원합니다. 이 툴킷은 TypeScript와 MCP 환경 모두를 지원하며, 결제·정기 결제·상태조회·취소 등 AI 에이전트 및 애플리케이션을 위한 다양한 결제 플로우를 쉽게 구현할 수 있습니다.

## 준비하기

자세한 준비 사항은 [카카오페이 개발자 문서 - AI 연동 - 사전 준비사항](https://developers.kakaopay.com/docs/payment/online/ai#payment-ai-intro-prepare)을 참조하세요.

## 지원 프레임워크

- **Vercel AI SDK** - `@kakaopay-develop/agent-toolkit/ai-sdk`
- **LangChain** - `@kakaopay-develop/agent-toolkit/langchain`
- **OpenAI SDK** - `@kakaopay-develop/agent-toolkit/openai`
- **Model Context Protocol (MCP)** - `@kakaopay-develop/agent-toolkit/modelcontextprotocol`

## 지원 도구

### 결제 관련 도구

- `demo_payment`: 데모 결제 링크 생성
- `ready_payment`: 결제 준비 요청
- `approve_payment`: 결제 승인 처리
- `cancel_payment`: 결제 취소 처리
- `get_payment`: 결제 상태 조회

### 정기결제 관련 도구

- `request_subscription`: 정기결제 요청
- `inactive_subscription`: 정기결제 비활성화
- `get_subscription`: 정기결제 상태 조회

## 사용 시나리오

### MCP 서버 사용 시

MCP 지원 도구(Claude Desktop, Cursor, Windsurf 등)에서 카카오페이를 연동하고 싶을 때 선택합니다.

**주요 특징:**
- MCP 표준 프로토콜 지원
- 설정만으로 즉시 사용 가능

**[📖 MCP 서버 상세 가이드](./modelcontextprotocol/README.md)** - MCP 호스트 연동 방법, 설정 옵션 등

### TypeScript SDK 사용 시

특정 AI 프레임워크(LangChain, Vercel AI SDK, OpenAI SDK)와 카카오페이를 연동하고 싶을 때 선택합니다.

**주요 특징:**
- LangChain, Vercel AI SDK, OpenAI SDK 등 다양한 프레임워크 지원
- 연동 애플리케이션 개발 가능

**[📖 TypeScript SDK 상세 가이드](./typescript/README.md)** - AI 프레임워크 연동 방법, 설정 옵션, 예제 등

## 프로젝트 구조

```
kakaopay/agent-toolkit/
├── typescript/                    # TypeScript SDK 및 핵심 구현체
│   ├── src/
│   │   ├── shared/               # 공통 로직 및 결제/정기 결제 모듈
│   │   ├── ai-sdk/               # AI SDK 연동용 툴킷
│   │   ├── langchain/            # LangChain 연동용 툴킷
│   │   ├── openai/               # OpenAI function calling 연동용 툴킷
│   │   └── modelcontextprotocol/ # MCP TypeScript 모듈
│   └── examples/
│       ├── ai-sdk/               # AI SDK 연동 예제
│       ├── langchain/            # LangChain SDK 연동 예제
│       ├── openai/               # OpenAI 연동 예제
│       └── mcp-bot/              # 챗봇 UI 예제
└── modelcontextprotocol/         # MCP 서버
```

## 요구사항

- Node 18+

## 라이선스

MIT License 

## Disclaimer

카카오페이 Agent Toolkit은 AI 기반 자동화 도구로, 결과의 정확성이나 완전성을 보장하지 않습니다. 실제 결제 등 중요한 작업 전에는 반드시 별도의 검증을 거치시기 바랍니다. 카카오페이는 본 도구의 사용 결과에 대해 책임지지 않습니다. 