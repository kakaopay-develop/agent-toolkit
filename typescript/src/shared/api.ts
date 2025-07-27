import type { Context } from './configuration';
import tools, { Tool } from './tools';
import { KakaoPayClient } from './client';

class KakaoPayAPI {
  kakaoPayClient: KakaoPayClient;
  context: Context;
  tools: Tool[];

  constructor(secretKey: string, context?: Context) {
    this.context = context || {};
    this.kakaoPayClient = new KakaoPayClient(secretKey);
    this.tools = tools(this.context);
  }

  async run(method: string, arg: any): Promise<string> {
    try {
      const tool = this.tools.find((t) => t.method === method);
      if (!tool) {
        throw new Error(`Invalid MCP method: ${method}`);
      }

      const output = await tool.execute(this.kakaoPayClient, this.context, arg);
      return JSON.stringify(output);
    } catch (error: any) {
      if (error.response) {
        return JSON.stringify({
          error: { http_status: error.response.status, ...error.response.data },
        });
      }

      const errorMessage = error.message || 'Unknown error';
      return JSON.stringify({
        error: {
          error_message: errorMessage,
        },
      });
    }
  }
}

export default KakaoPayAPI;
export { KakaoPayClient };
