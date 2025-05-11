import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import {
  ChapaService,
  CreateSubaccountOptions,
  InitializeOptions,
  VerifyOptions,
} from 'src/app/modules/chapa-sdk';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly chapaService: ChapaService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('initialize')
  async initialize(@Body() initializeOptions: InitializeOptions) {
    const tx_ref = await this.chapaService.generateTransactionReference();
    try {
      return await this.chapaService.initialize({
        ...initializeOptions,
        tx_ref,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('subscription-plan')
  async initializeSubscriptionPayment(
    @Body() initializeOptions: InitializeOptions,
  ) {
    const tx_ref = await this.chapaService.generateTransactionReference();
    const return_url = `${process.env.FRONTEND_URL}/payment/status`;
    const callback_url = `${process.env.BACKEND_URL}/payment/verify/subscription-plan/${tx_ref}`;
    return await this.paymentService.payForSubscription({
      ...initializeOptions,
      tx_ref,
      return_url,
      callback_url,
    });
  }

  @Get('verify/subscription-plan/:tx_ref')
  verify(@Param() verifyOptions: VerifyOptions) {
    return this.paymentService.verifySubscriptionPayment(verifyOptions);
  }
  @Get('verify-success')
  verifySuccess() {
    return `
      <html>
        <head>
          <title>Payment Successful</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f2f0f9;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              background: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
            }
            button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment. Your transaction has been completed.</p>
            <button onclick="window.close();">Close</button>
          </div>
          <script>
            // Automatically close the window after 5 seconds
            setTimeout(function() {
              window.close();
            }, 10000);
          </script>
        </body>
      </html>
    `;
  }

  @Post('subaccount')
  createSubaccount(@Body() createSubaccountOptions: CreateSubaccountOptions) {
    return this.chapaService.createSubaccount(createSubaccountOptions);
  }
  @Get('get-banks')
  getBanks() {
    return this.chapaService.getBanks();
  }

  @Post('mobile-initialize')
  initializeMobile(@Body() initializeMobile: InitializeOptions) {
    return this.chapaService.mobileInitialize(initializeMobile);
  }
}
