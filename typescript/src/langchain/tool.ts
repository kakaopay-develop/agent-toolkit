import { z } from 'zod';
import { StructuredTool } from '@langchain/core/tools';
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager';
import { RunnableConfig } from '@langchain/core/runnables';
import KakaoPayAPI from '../shared/api';

class KakaoPayTool extends StructuredTool {
  kakaopayAPI: KakaoPayAPI;
  method: string;
  name: string;
  description: string;
  schema: z.ZodObject<any, any, any, any>;

  constructor(
    kakaopayAPI: KakaoPayAPI,
    method: string,
    description: string,
    schema: z.ZodObject<any, any, any, any, { [x: string]: any }>
  ) {
    super();
    this.kakaopayAPI = kakaopayAPI;
    this.method = method;
    this.name = method;
    this.description = description;
    this.schema = schema;
  }

  _call(
    arg: z.output<typeof this.schema>,
    _runManager?: CallbackManagerForToolRun,
    _parentConfig?: RunnableConfig
  ): Promise<any> {
    return this.kakaopayAPI.run(this.method, arg);
  }
}

export default KakaoPayTool;
