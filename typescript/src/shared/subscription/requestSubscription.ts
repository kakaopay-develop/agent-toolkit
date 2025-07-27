import { z } from 'zod';
import { KakaoPayClient } from '../api';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

import { KAKAO_PAY_API_ENDPOINTS } from '../client';

export const requestSubscriptionPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 정기 결제를 요청합니다.

필요한 인수:
- sid (string): 정기 결제 키
- partner_order_id (string): 가맹점 주문번호
- partner_user_id (string): 가맹점 회원 ID
- item_name (string): 상품명
- quantity (number): 상품 수량
- total_amount (number): 상품 총액
- tax_free_amount (number): 상품 비과세 금액
`;

export const requestSubscriptionParameters = (
  _context: Context = {}
): z.AnyZodObject =>
  z.object({
    sid: z.string().describe('정기 결제 키 (20자)'),
    partner_order_id: z.string().describe('가맹점 주문번호 (최대 100자)'),
    partner_user_id: z.string().describe('가맹점 회원 ID (최대 100자)'),
    item_name: z.string().describe('상품명 (최대 100자)'),
    quantity: z.number().int().positive().describe('상품 수량'),
    total_amount: z.number().int().positive().describe('상품 총액'),
    tax_free_amount: z.number().int().min(0).describe('상품 비과세 금액'),
  });

export const requestSubscription = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof requestSubscriptionParameters>>
) => {
  const response = await client.post(
    KAKAO_PAY_API_ENDPOINTS.SUBSCRIPTION_REQUEST,
    { cid: context.cid, ...params }
  );
  return response.data;
};

const tool = (context: Context): Tool => ({
  method: 'request_subscription',
  name: 'Request Subscription',
  description: requestSubscriptionPrompt(context),
  parameters: requestSubscriptionParameters(context),
  actions: {
    subscription: {
      request: true,
    },
  },
  execute: requestSubscription,
});

export default tool;
