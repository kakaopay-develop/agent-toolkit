import KakaoPayAPI from '../shared/api';
import { Configuration, isToolAllowed } from '../shared/configuration';
import tools from '../shared/tools';
import { zodToJsonSchema } from 'zod-to-json-schema';

export interface BedrockTool {
  toolSpec: {
    name: string;
    description: string;
    inputSchema: {
      json: any;
    };
  };
}

export interface BedrockToolBlock {
  toolUseId: string;
  name: string;
  input: any;
}

export interface BedrockToolResult {
  toolUseId: string;
  content: Array<{
    text: string;
  }>;
}

class KakaoPayAgentToolkit {
  private _kakaopay: KakaoPayAPI;
  tools: BedrockTool[];

  constructor({
    secretKey,
    configuration,
  }: {
    secretKey: string;
    configuration: Configuration;
  }) {
    const context = configuration.context || {};
    const filteredTools = tools(context).filter((tool) =>
      isToolAllowed(tool, configuration)
    );
    this._kakaopay = new KakaoPayAPI(secretKey, context);
    this.tools = filteredTools.map((tool) => ({
      toolSpec: {
        name: tool.method,
        description: tool.description,
        inputSchema: {
          json: zodToJsonSchema(tool.parameters),
        },
      },
    }));
  }

  getTools(): BedrockTool[] {
    return this.tools;
  }

  /**
   * Processes a single Bedrock tool call by executing the requested function.
   *
   * @param {BedrockToolBlock} toolCall - The tool call object from Bedrock containing
   *   function name, arguments, and tool use ID.
   * @returns {Promise<BedrockToolResult>} A promise that resolves to a tool result
   *   object containing the result of the tool execution with the proper format for Bedrock.
   */
  async handleToolCall(toolCall: BedrockToolBlock): Promise<BedrockToolResult> {
    const response = await this._kakaopay.run(toolCall.name, toolCall.input);
    return {
      toolUseId: toolCall.toolUseId,
      content: [
        {
          text: response,
        },
      ],
    };
  }

  /**
   * Get KakaoPay API instance for direct access
   */
  getKakaoPayAPI(): KakaoPayAPI {
    return this._kakaopay;
  }
}

export default KakaoPayAgentToolkit;
