import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/ai-sdk';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

// KakaoPay 툴킷 초기화
const kakaopayToolkit = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: {
      cid: 'TC0ONETIME',
    },
    actions: {
      payment: {
        demo: true,
        get: true,
        ready: true,
        approve: true,
        cancel: true,
      },
      subscription: {
        get: true,
        request: true,
        inactive: true,
      },
    },
  },
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
      tools: kakaopayToolkit.getTools(),
      maxSteps: 10,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
