import axios, { AxiosInstance } from 'axios';

export class KakaoPayClient {
  private client: AxiosInstance;

  constructor(secretKey: string) {
    const baseURL = 'https://open-api.kakaopay.com';

    this.client = axios.create({
      baseURL: `${baseURL}`,
      headers: {
        Authorization: `SECRET_KEY ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async post<T>(
    url: string,
    data?: any
  ): Promise<import('axios').AxiosResponse<T>> {
    return await this.client.post<T>(url, data);
  }
}

export const KAKAO_PAY_API_ENDPOINTS = {
  PAYMENT_READY: '/online/v1/payment/ready',
  PAYMENT_APPROVE: '/online/v1/payment/approve',
  PAYMENT_ORDER: '/online/v1/payment/order',
  PAYMENT_CANCEL: '/online/v1/payment/cancel',
  SUBSCRIPTION_REQUEST: '/online/v1/payment/subscription',
  SUBSCRIPTION_INACTIVE: '/online/v1/payment/manage/subscription/inactive',
  SUBSCRIPTION_GET: '/online/v1/payment/manage/subscription/status',
} as const;
