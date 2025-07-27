import type { CoreTool } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';
import KakaoPayAPI from '../shared/api';

export default function KakaoPayTool(
  kakaopayAPI: KakaoPayAPI,
  method: string,
  description: string,
  schema: z.ZodObject<any, any, any, any, { [x: string]: any }>
): CoreTool {
  return tool({
    description: description,
    parameters: schema,
    execute: (arg: z.output<typeof schema>) => {
      return kakaopayAPI.run(method, arg);
    },
  });
}
