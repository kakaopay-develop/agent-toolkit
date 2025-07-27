import { BaseToolkit } from '@langchain/core/tools';
import KakaoPayTool from './tool';
import KakaoPayAPI from '../shared/api';
import tools from '../shared/tools';
import { isToolAllowed, type Configuration } from '../shared/configuration';

class KakaoPayAgentToolkit implements BaseToolkit {
  private _kakaopay: KakaoPayAPI;
  tools: KakaoPayTool[];

  constructor({
    secretKey,
    configuration,
  }: {
    secretKey: string;
    configuration: Configuration;
  }) {
    this._kakaopay = new KakaoPayAPI(secretKey, configuration.context);

    const context = configuration.context || {};
    const filteredTools = tools(context).filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    this.tools = filteredTools.map(
      (tool) =>
        new KakaoPayTool(
          this._kakaopay,
          tool.method,
          tool.description,
          tool.parameters
        )
    );
  }

  getTools(): KakaoPayTool[] {
    return this.tools;
  }
}

export default KakaoPayAgentToolkit;
