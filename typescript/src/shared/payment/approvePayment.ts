import { z } from 'zod';
import { KakaoPayClient } from '../api';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

import { KAKAO_PAY_API_ENDPOINTS } from '../client';

export const approvePaymentPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 단건 결제를 승인합니다.

필요한 인수:
- tid (string): 결제 고유번호
- partner_order_id (string): 가맹점 주문번호
- partner_user_id (string): 가맹점 회원 ID
- pg_token (string): 결제승인 요청을 인증하는 토큰
`;

export const approvePaymentParameters = (
  _context: Context = {}
): z.AnyZodObject =>
  z.object({
    tid: z.string().describe('결제 고유번호 (결제 준비에서 받은 tid)'),
    partner_order_id: z
      .string()
      .describe('가맹점 주문번호 (결제 준비 API 요청과 일치)'),
    partner_user_id: z
      .string()
      .describe('가맹점 회원 ID (결제 준비 API 요청과 일치)'),
    pg_token: z
      .string()
      .describe(
        '결제승인 요청을 인증하는 토큰 (결제 수단 선택 완료 후 리다이렉트에서 받음)'
      ),
  });

export const approvePayment = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof approvePaymentParameters>>
) => {
  const response = await client.post(KAKAO_PAY_API_ENDPOINTS.PAYMENT_APPROVE, {
    cid: context.cid,
    ...params,
  });
  return response.data;
};

const tool = (context: Context): Tool => ({
  method: 'approve_payment',
  name: 'Approve Payment',
  description: approvePaymentPrompt(context),
  parameters: approvePaymentParameters(context),
  actions: {
    payment: {
      approve: true,
    },
  },
  execute: approvePayment,
});

export default tool;
