import { CreateSubscriptionPlanDto } from "../../subscription-plan/dto/create-subscription-plan.dto";
import { SplitType } from "../enums";

interface Subaccount {
  id: string;
  split_type?: SplitType;
  transaction_charge?: number;
}
export interface InitializeOptions {
  first_name: string;
  last_name?: string;
  email?: string;
  currency: string;
  amount: string;
  phone_number?: string;
  tx_ref: string;
  subscriptionPlan?:CreateSubscriptionPlanDto;
  userId?: string;
  callback_url?: string;
  return_url?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  subaccounts?: Subaccount[];
}

export interface InitializeResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}
