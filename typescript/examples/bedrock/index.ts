import { config } from '@dotenvx/dotenvx';
import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/bedrock';
import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
} from '@aws-sdk/client-bedrock-runtime';

const envFilePath = '.env';
config({ path: envFilePath });

const client = new BedrockRuntimeClient({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const modelId = 'anthropic.claude-3-haiku-20240307-v1:0';

const kpConfig = {
  secretKey: process.env.KAKAOPAY_SECRET_KEY!,
  configuration: {
    actions: {
      payment: {
        demo: true, // 데모 결제 활성화
      },
    },
    context: {
      cid: 'TC0ONETIME',
    },
  },
};

const kakaopayToolkit = new KakaoPayAgentToolkit(kpConfig);
const tools = kakaopayToolkit.getTools();

const userMessage = '5,000원짜리 커피 결제 데모 링크 만들어줘';

(async (): Promise<void> => {
  const messages: Message[] = [
    {
      role: 'user',
      content: [{ text: userMessage }],
    },
  ];

  console.log(`User: ${userMessage}`);
  console.log('AI가 응답을 생성하고 있습니다...\n');

  while (true) {
    const response = await client.send(
      new ConverseCommand({
        modelId: modelId,
        messages: messages,
        toolConfig: {
          tools: tools,
        },
      })
    );

    const reply = response.output?.message;
    if (!reply) {
      console.log('모델로부터 응답을 받지 못했습니다.');
      break;
    }
    messages.push(reply);

    const toolsCalled = reply.content?.filter((content) => content.toolUse);
    if (toolsCalled && toolsCalled.length > 0) {
      console.log('AI가 카카오페이 도구를 사용하고 있습니다...');

      const toolResults = await Promise.all(
        toolsCalled.map(async (block) => {
          if (
            !block.toolUse?.toolUseId ||
            !block.toolUse?.name ||
            !block.toolUse?.input
          ) {
            throw new Error('필수 toolUse 속성이 누락되었습니다');
          }

          console.log(`- 도구 사용: ${block.toolUse.name}`);
          console.log(
            `- 입력 파라미터:`,
            JSON.stringify(block.toolUse.input, null, 2)
          );

          const toolCall = {
            toolUseId: block.toolUse.toolUseId,
            name: block.toolUse.name,
            input: block.toolUse.input,
          };

          const result = await kakaopayToolkit.handleToolCall(toolCall);

          console.log(`- 결과:`, result.content[0].text);
          console.log('');

          return {
            toolResult: {
              toolUseId: result.toolUseId,
              content: result.content,
            },
          };
        })
      );

      messages.push({
        role: 'user',
        content: toolResults,
      });
    } else {
      const textContent = reply.content?.find((content) => content.text);
      console.log('AI:', textContent?.text || reply);
      break;
    }
  }
})().catch((error) => {
  console.error('오류가 발생했습니다:', error);
  process.exit(1);
});
