import { z } from 'zod';
import { KakaoPayClient } from '../api';
import type { Context } from '../configuration';
import type { Tool } from '../tools';

import { KAKAO_PAY_API_ENDPOINTS } from '../client';
import { ReadyPaymentSchema } from './readyPayment';

export const demoPaymentPrompt = (_context: Context = {}) => `
이 도구는 카카오페이 데모 결제 링크를 생성합니다.

필요한 인수:
- item_name (string): 상품명
- total_amount (number): 상품 총액
- link_type (string): 링크 유형 (PC 또는 MOBILE)
`;

export const demoPaymentParameters = (_context: Context = {}): z.AnyZodObject =>
  z.object({
    item_name: z
      .string()
      .default('테스트 상품명')
      .describe('상품명 (최대 100자)'),
    total_amount: z
      .number()
      .int()
      .positive()
      .default(1000)
      .describe('상품 총액'),
    link_type: z.enum(['PC', 'MOBILE']).default('PC').describe('링크 유형'),
  });

type ReadyPaymentType = z.infer<typeof ReadyPaymentSchema>;

// 응답 타입 정의
interface PaymentReadyResponse {
  tid: string;
  next_redirect_pc_url: string;
  next_redirect_mobile_url: string;
  created_at: string;
}

export const demoPayment = async (
  client: KakaoPayClient,
  context: Context,
  params: z.infer<ReturnType<typeof demoPaymentParameters>>
) => {
  const apiParams: ReadyPaymentType = {
    partner_order_id: 'partner_order_id',
    partner_user_id: 'partner_user_id',
    item_name: params.item_name,
    quantity: 1,
    total_amount: params.total_amount,
    tax_free_amount: 0,
    approval_url: 'https://payment-demo.kakaopay.com/online/approval',
    cancel_url: 'https://payment-demo.kakaopay.com/online/cancel',
    fail_url: 'https://payment-demo.kakaopay.com/online/fail',
  };

  const response = await client.post(KAKAO_PAY_API_ENDPOINTS.PAYMENT_READY, {
    cid: context.cid,
    ...apiParams,
  });
  const responseData = response.data as PaymentReadyResponse;
  const link =
    params.link_type === 'PC'
      ? responseData.next_redirect_pc_url
      : responseData.next_redirect_mobile_url;
  return {
    demo_link: `${link}?kpayTid=${responseData.tid}`,
    tid: responseData.tid,
  };
};

const tool = (context: Context): Tool => ({
  method: 'demo_payment',
  name: 'Demo Payment',
  description: demoPaymentPrompt(context),
  parameters: demoPaymentParameters(context),
  actions: {
    payment: {
      demo: true,
    },
  },
  execute: demoPayment,
});

export default tool;
