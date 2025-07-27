# KakaoPay Agent Toolkit - TypeScript

KakaoPay Agent Toolkit은 AI 에이전트 프레임워크(LangChain, Vercel AI SDK, OpenAI SDK)가 function calling을 통해 KakaoPay 오픈 API와 연동할 수 있도록 지원합니다. AI 에이전트와 애플리케이션에서 결제, 정기결제, 상태 조회 등의 워크플로우를 쉽게 구축할 수 있는 도구를 제공합니다.

## 지원 프레임워크

- **LangChain** - LangChain 지원
- **Vercel AI SDK** - Vercel AI SDK 지원
- **OpenAI** - OpenAI SDK 지원
- **Model Context Protocol (MCP)** - MCP 지원

## 설치

다음 명령어로 설치하세요:

```bash
npm install @kakaopay-develop/agent-toolkit
```

### 요구사항

- Node 18+

## 사용법

라이브러리는 KakaoPay 오픈 API 시크릿 키로 설정해야 합니다. 또한 툴킷에서 사용할 수 있는 액션을 지정할 수 있습니다.

```typescript
import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/ai-sdk';

const kakaopayAgentToolkit = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: {
      cid: 'TC0ONETIME',
    },
    actions: {
      payment: {
        demo: true,
        ready: true,
        approve: true,
        cancel: true,
        get: true,
      },
      subscription: {
        request: true,
        inactive: true,
        get: true,
      },
    },
  },
});
```

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

## 프레임워크별 사용법

### Vercel AI SDK

```typescript
import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/ai-sdk';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const kakaopayToolkit = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: { cid: 'TC0ONETIME' },
    actions: { payment: { demo: true } },
  },
});

const { text: result } = await generateText({
  model: openai('gpt-4o'),
  tools: kakaopayToolkit.getTools(),
  maxSteps: 10,
  prompt: '5000원짜리 커피 결제 링크 생성해 줘',
});
```

### LangChain

```typescript
import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

const kakaopayAgentToolkit = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: { cid: 'TC0ONETIME' },
    actions: { payment: { demo: true } },
  },
});

const llm = new ChatOpenAI({ model: 'gpt-4o' });
const tools = kakaopayAgentToolkit.getTools();

const agent = createReactAgent({
  llm: llm,
  tools: tools,
});

const result = await agent.invoke({
  messages: [
    {
      role: 'user',
      content: '5000원짜리 커피 결제 링크 생성해 줘',
    },
  ],
});
```

### OpenAI Function Calling

```typescript
import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/openai';
import OpenAI from 'openai';

const kakaopayToolkit = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: { cid: 'TC0ONETIME' },
    actions: { payment: { demo: true } },
  },
});

const openai = new OpenAI();
const tools = kakaopayToolkit.getTools();

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '5000원짜리 커피 결제 링크 생성해 줘' }],
  tools: tools,
});
```

## 컨텍스트 설정

기본값으로 사용할 컨텍스트 값을 제공할 수 있습니다:

```typescript
const kakaopayAgentToolkit = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: {
      cid: 'TC0ONETIME',
    },
  },
});
```

## Model Context Protocol (MCP)

KakaoPay Agent Toolkit은 [Model Context Protocol (MCP)](https://modelcontextprotocol.com/)도 지원합니다. MCP 서버를 통해 KakaoPay 오픈 API와 연동할 수 있습니다.

```typescript
import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/modelcontextprotocol';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: { cid: 'TC0ONETIME' },
    actions: { payment: { demo: true } },
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('KakaoPay MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
```

## 예제

각 프레임워크별 예제는 `examples/` 디렉토리에서 확인할 수 있습니다:

- `examples/ai-sdk/` - Vercel AI SDK 예제
- `examples/langchain/` - LangChain 예제
- `examples/openai/` - OpenAI SDK 예제
- `examples/mcp-bot/` - MCP 기반 챗봇 예제

### 예제 실행

```bash
# AI SDK 예제
cd examples/ai-sdk
npm install
npx ts-node index.ts

# LangChain 예제
cd examples/langchain
npm install
npx ts-node index.ts

# OpenAI 예제
cd examples/openai
npm install
npx ts-node index.ts

# MCP Bot 예제
cd examples/mcp-bot
npm install
npm run dev
```

## 환경 변수

다음 환경 변수를 설정해야 합니다:

```bash
KAKAOPAY_SECRET_KEY=your_kakaopay_secret_key_here  # KakaoPay 오픈 API 시크릿 키
OPENAI_API_KEY=your_openai_api_key_here            # AI 모델 사용 시 필요
```

## 개발 / 테스트 / 빌드

```bash
npm run build   # 빌드
npm run lint    # 린트
npm run dev     # 개발 모드 (watch)
```
