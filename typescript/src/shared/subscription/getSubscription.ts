import { z } from 'zod';
import { KakaoPayClient } from '../api';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

import { KAKAO_PAY_API_ENDPOINTS } from '../client';

export const getSubscriptionPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 정기 결제를 승인합니다.

필요한 인수:
- sid (string): 정기 결제 고유번호 
`;

export const getSubscriptionParameters = (
  _context: Context = {}
): z.AnyZodObject =>
  z.object({
    sid: z.string().describe('정기 결제 고유번호 (20자)'),
  });

export const getSubscription = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof getSubscriptionParameters>>
) => {
  const response = await client.post(KAKAO_PAY_API_ENDPOINTS.SUBSCRIPTION_GET, {
    cid: context.cid,
    ...params,
  });
  return response.data;
};

const tool = (context: Context): Tool => ({
  method: 'get_subscription',
  name: 'Get Subscription',
  description: getSubscriptionPrompt(context),
  parameters: getSubscriptionParameters(context),
  actions: {
    subscription: {
      get: true,
    },
  },
  execute: getSubscription,
});

export default tool;
