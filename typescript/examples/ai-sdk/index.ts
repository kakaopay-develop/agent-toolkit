import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/ai-sdk';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

require('dotenv').config();

const kakaopayToolkit = new KakaoPayAgentToolkit({
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    context: {
      cid: 'TC0ONETIME',
    },
    actions: {
      payment: {
        demo: true,
      },
    },
  },
});

(async () => {
  // (or) Invoke through toolkit for specific use-cases
  const { text: result } = await generateText({
    model: openai('gpt-4o'),
    tools: kakaopayToolkit.getTools(),
    maxSteps: 10,
    prompt: '5000원짜리 커피 결제 링크 생성해 줘',
  });
  console.log(result);
})();
