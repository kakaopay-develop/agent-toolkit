import { z } from 'zod';
import { KakaoPayClient } from './client';
import type { Context } from './configuration';

import demoPaymentTool from './payment/demoPayment';
import getPaymentTool from './payment/getPayment';
import readyPaymentTool from './payment/readyPayment';
import approvePaymentTool from './payment/approvePayment';
import cancelPaymentTool from './payment/cancelPayment';
import requestSubscriptionTool from './subscription/requestSubscription';
import inactiveSubscriptionTool from './subscription/inactiveSubscription';
import getSubscriptionTool from './subscription/getSubscription';

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
  execute: (
    _client: KakaoPayClient,
    _context: Context,
    _params: any
  ) => Promise<any>;
};

const tools = (context: Context): Tool[] => [
  demoPaymentTool(context),
  getPaymentTool(context),
  readyPaymentTool(context),
  approvePaymentTool(context),
  cancelPaymentTool(context),
  requestSubscriptionTool(context),
  inactiveSubscriptionTool(context),
  getSubscriptionTool(context),
];

export default tools;
