import { z } from 'zod';
import { KakaoPayClient } from '../api';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

import { KAKAO_PAY_API_ENDPOINTS } from '../client';

export const inactiveSubscriptionPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 정기 결제를 비활성화합니다.

필요한 인수:
- sid (string): 정기 결제 고유번호 
`;

export const inactiveSubscriptionParameters = (
  _context: Context = {}
): z.AnyZodObject =>
  z.object({
    sid: z.string().describe('정기 결제 고유번호 (20자)'),
  });

export const inactiveSubscription = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof inactiveSubscriptionParameters>>
) => {
  const response = await client.post(
    KAKAO_PAY_API_ENDPOINTS.SUBSCRIPTION_INACTIVE,
    { cid: context.cid, ...params }
  );
  return response.data;
};

const tool = (context: Context): Tool => ({
  method: 'inactive_subscription',
  name: 'Inactive Subscription',
  description: inactiveSubscriptionPrompt(context),
  parameters: inactiveSubscriptionParameters(context),
  actions: {
    subscription: {
      inactive: true,
    },
  },
  execute: inactiveSubscription,
});

export default tool;
