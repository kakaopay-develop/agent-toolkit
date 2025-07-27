import { z } from 'zod';
import { KakaoPayClient } from '../api';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

import { KAKAO_PAY_API_ENDPOINTS } from '../client';

export const cancelPaymentPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 결제를 취소합니다.

필요한 인수:
- tid (string): 결제 고유번호
- cancel_amount (number): 취소 금액
- cancel_tax_free_amount (number): 취소 비과세 금액
`;

export const cancelPaymentParameters = (
  _context: Context = {}
): z.AnyZodObject =>
  z.object({
    tid: z.string().describe('결제 고유번호 (20자)'),
    cancel_amount: z.number().int().positive().describe('취소 금액'),
    cancel_tax_free_amount: z
      .number()
      .int()
      .min(0)
      .describe('취소 비과세 금액'),
  });

export const cancelPayment = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof cancelPaymentParameters>>
) => {
  const response = await client.post(KAKAO_PAY_API_ENDPOINTS.PAYMENT_CANCEL, {
    cid: context.cid,
    ...params,
  });
  return response.data;
};

const tool = (context: Context): Tool => ({
  method: 'cancel_payment',
  name: 'Cancel Payment',
  description: cancelPaymentPrompt(context),
  parameters: cancelPaymentParameters(context),
  actions: {
    payment: {
      cancel: true,
    },
  },
  execute: cancelPayment,
});

export default tool;
