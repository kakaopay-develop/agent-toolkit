import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { Configuration, isToolAllowed } from '../shared/configuration';
import KakaoPayAPI from '../shared/api';
import tools from '../shared/tools';
import { version } from '../../package.json';

class KakaoPayAgentToolkit extends McpServer {
  private _kakaopay: KakaoPayAPI;

  constructor({
    secretKey,
    configuration,
  }: {
    secretKey: string;
    configuration: Configuration;
  }) {
    super({
      name: 'KakaoPay',
      version: version,
    });

    this._kakaopay = new KakaoPayAPI(secretKey, configuration.context);

    const context = configuration.context || {};
    const filteredTools = tools(context).filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        async (arg: any, _extra: RequestHandlerExtra<any, any>) => {
          const result = await this._kakaopay.run(tool.method, arg);
          return {
            content: [
              {
                type: 'text' as const,
                text: String(result),
              },
            ],
          };
        }
      );
    });
  }
}

export default KakaoPayAgentToolkit;
