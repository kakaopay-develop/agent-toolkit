import { z } from 'zod';
import { KAKAO_PAY_API_ENDPOINTS, KakaoPayClient } from '../client';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

export const readyPaymentPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 결제를 준비합니다.

필요한 인수:
- partner_order_id (string): 가맹점 주문번호
- partner_user_id (string): 가맹점 회원 ID
- item_name (string): 상품명
- quantity (number): 상품 수량
- total_amount (number): 상품 총액
- tax_free_amount (number): 상품 비과세 금액
- approval_url (string): 결제 성공 시 redirect url
- cancel_url (string): 결제 취소 시 redirect url
- fail_url (string): 결제 실패 시 redirect url
`;

export const ReadyPaymentSchema = z.object({
  partner_order_id: z.string().describe('가맹점 주문번호 (최대 100자)'),
  partner_user_id: z.string().describe('가맹점 회원 ID (최대 100자)'),
  item_name: z.string().describe('상품명 (최대 100자)'),
  quantity: z.number().int().positive().describe('상품 수량'),
  total_amount: z.number().int().positive().describe('상품 총액'),
  tax_free_amount: z.number().int().min(0).describe('상품 비과세 금액'),
  approval_url: z.string().url().describe('결제 성공 시 redirect url'),
  cancel_url: z.string().url().describe('결제 취소 시 redirect url'),
  fail_url: z.string().url().describe('결제 실패 시 redirect url'),
});

export const readyPaymentParameters = (
  _context: Context = {}
): z.AnyZodObject => ReadyPaymentSchema;

export const readyPayment = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof readyPaymentParameters>>
) => {
  const response = await client.post(KAKAO_PAY_API_ENDPOINTS.PAYMENT_READY, {
    cid: context.cid,
    ...params,
  });
  return response.data;
};

const tool = (context: Context): Tool => ({
  method: 'ready_payment',
  name: 'Ready Payment',
  description: readyPaymentPrompt(context),
  parameters: readyPaymentParameters(context),
  actions: {
    payment: {
      ready: true,
    },
  },
  execute: readyPayment,
});

export default tool;
