import { z } from 'zod';
import { KakaoPayClient } from '../api';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

import { KAKAO_PAY_API_ENDPOINTS } from '../client';

export const getPaymentPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 주문 상태를 조회합니다.

필요한 인수:
- tid (string): 결제 고유번호
`;

export const getPaymentParameters = (_context: Context = {}): z.AnyZodObject =>
  z.object({
    tid: z.string().describe('결제 고유번호'),
  });

export const getPayment = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof getPaymentParameters>>
) => {
  const response = await client.post(KAKAO_PAY_API_ENDPOINTS.PAYMENT_ORDER, {
    cid: context.cid,
    ...params,
  });
  return response.data;
};

const tool = (context: Context): Tool => ({
  method: 'get_payment',
  name: 'Get Payment',
  description: getPaymentPrompt(context),
  parameters: getPaymentParameters(context),
  actions: {
    payment: {
      get: true,
    },
  },
  execute: getPayment,
});

export default tool;
