import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

require('dotenv').config();

const llm = new ChatOpenAI({
  model: 'gpt-4o',
});

const kakaopayAgentToolkit = new KakaoPayAgentToolkit({
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

(async (): Promise<void> => {
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
  console.log(result);
})();
