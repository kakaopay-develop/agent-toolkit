import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/openai';
import OpenAI from 'openai';
type ChatCompletionMessageParam =
  OpenAI.Chat.Completions.ChatCompletionMessageParam;

require('dotenv').config();

const openai = new OpenAI();

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
  let messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: `5000원짜리 커피 결제 링크 생성해 줘`,
    },
  ];

  while (true) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools: kakaopayAgentToolkit.getTools(),
    });

    const message = completion.choices[0].message;

    messages.push(message);

    if (message.tool_calls) {
      const toolMessages = await Promise.all(
        message.tool_calls.map((tc: any) =>
          kakaopayAgentToolkit.handleToolCall(tc)
        )
      );
      messages = [...messages, ...toolMessages];
    } else {
      console.log(completion.choices[0].message);
      break;
    }
  }
})();
