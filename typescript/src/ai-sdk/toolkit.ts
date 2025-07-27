import KakaoPayAPI from '../shared/api';
import tools from '../shared/tools';
import { isToolAllowed, type Configuration } from '../shared/configuration';
import type {
  CoreTool,
  LanguageModelV1StreamPart,
  Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware,
} from 'ai';
import KakaoPayTool from './tool';

class KakaoPayAgentToolkit {
  private _kakaopay: KakaoPayAPI;

  tools: { [key: string]: CoreTool };

  constructor({
    secretKey,
    configuration,
  }: {
    secretKey: string;
    configuration: Configuration;
  }) {
    this._kakaopay = new KakaoPayAPI(secretKey, configuration.context);
    this.tools = {};

    const context = configuration.context || {};
    const filteredTools = tools(context).filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      this.tools[tool.method] = KakaoPayTool(
        this._kakaopay,
        tool.method,
        tool.description,
        tool.parameters
      );
    });
  }

  getTools(): { [key: string]: CoreTool } {
    return this.tools;
  }

  /**
   * Get KakaoPay API instance for direct access
   */
  getKakaoPayAPI(): KakaoPayAPI {
    return this._kakaopay;
  }
}

export default KakaoPayAgentToolkit;
