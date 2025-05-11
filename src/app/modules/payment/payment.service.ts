import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ChapaService, InitializeOptions, VerifyOptions } from '../chapa-sdk';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
import { InvoiceService } from '../invoice/invoice.service';
import { SubscriptionPlan } from '../subscription-plan/entities/subscription-plan.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { InvoiceStatus } from '../invoice/enums/invoice-status.enum';
import { UsersService } from '../users/users.service';



@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly chapaService: ChapaService,
    private readonly userService: UsersService,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const newPayment = this.paymentRepository.create(createPaymentDto);
    return await this.paymentRepository.save(newPayment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async payForSubscription(initializeOptions: InitializeOptions): Promise<any> {
    try {
      const responseData: any = {};
      
      if (!initializeOptions.subscriptionPlan) {
        throw new Error('Subscription plan data is required');
      }
      const newSubscriptionPlan = await this.subscriptionPlanService.create(initializeOptions.subscriptionPlan);
      if (!initializeOptions.userId) {
        throw new Error('User ID is required');
      }
      const user = await this.userService.findById(initializeOptions.userId);
      const subscriptionPlan = await this.subscriptionPlanService.findOne(newSubscriptionPlan.id);
      const pendingInvoice = await this.invoiceService.findOne(newSubscriptionPlan.invoice.id)
      const response = await this.chapaService.initialize({...initializeOptions, amount:String(subscriptionPlan.plan.current_price)});
      if (!response.status) {
        throw new Error("Payment initialization failed");
      }
      let purchase = await this.paymentRepository
        .createQueryBuilder("payment")
        .where("payment.user = :userId", { userId: initializeOptions.userId })
        .andWhere("payment.tx_ref = :tx_ref", { tx_ref: initializeOptions.tx_ref })
        .andWhere("payment.subscriptionPlan = :subscriptionPlanId", { subscriptionPlanId: subscriptionPlan.id })
        .getOne();
  
      if (!purchase) {
        purchase = new Payment();
      }
  
      purchase.user = user;
      purchase.tx_ref = initializeOptions.tx_ref;
      purchase.payment_date = new Date();
      purchase.payment_method = subscriptionPlan.payment_method || 'default_payment_method';
      purchase.subscriptionPlan = subscriptionPlan;
      purchase.amount = parseFloat(String(subscriptionPlan.plan.current_price));
      purchase.status = "PENDING";
  
      const savedPurchase = await this.paymentRepository.save(purchase);
      const populatedPurchase = await this.paymentRepository
        .createQueryBuilder("payment")
        .where("payment.id = :id", { id: savedPurchase.id })
        .getOne();
      responseData.purchased = {...populatedPurchase,invoice:pendingInvoice };
      responseData.checkout_url = response.data.checkout_url;
  
      return responseData;
    } catch (error) {
      console.error("Error in payForSubscription:", error);
      throw error;
    }
  }
  
  async verifySubscriptionPayment(verifyOptions: VerifyOptions): Promise<any> {
    try {
      const verify =await this.chapaService.verify(verifyOptions)
      const payment = await this.findOneByTxRef(verifyOptions.tx_ref)
      let subscriptionPlan:SubscriptionPlan
      let invoice:Invoice

      if (verify.status === "success") {
     payment.status = "COMPLETED";
     subscriptionPlan = await this.subscriptionPlanService.updateIsPayed(payment.subscriptionPlan.id);
     const invoiceUpdate:Invoice = {...payment.subscriptionPlan.invoice ,status:InvoiceStatus.PAID }
    invoice = await this.invoiceService.update(invoiceUpdate.id,invoiceUpdate )
   } else {
     payment.status = "FAILED";
   }

   let updatedPayment = await this.paymentRepository.save(payment);
  //  if (updatedPayment?.subscriptionPlan) {
  //    delete updatedPayment.subscriptionPlan;
  //  }
     return {...verify,data:{...verify.data , payment:updatedPayment , 
      // subscriptionPlan, invoice
     } }
     }
     catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({where:{id}});
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findOneByTxRef(tx_ref: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({where:{tx_ref}, relations:["subscriptionPlan",  'subscriptionPlan.invoice']});
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${tx_ref} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const existingPayment = await this.findOne(id);
    const updatedPayment = Object.assign(existingPayment, updatePaymentDto);
    return await this.paymentRepository.save(updatedPayment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async payForTicket(initializeOptions: InitializeOptions ):Promise<any>{
    try {
      const responseData: any = {};
      
      const response = await this.chapaService.initialize(initializeOptions)
      if(response.status){
        let purchase = await this.paymentRepository
          .createQueryBuilder("payment")
          .getOne()

          if(purchase){
            purchase.tx_ref = initializeOptions.tx_ref
            purchase.payment_date = new Date()
            purchase.payment_method ="Chapa"
            purchase.amount = parseFloat(initializeOptions.amount)
  
            await this.paymentRepository.update(purchase.id, purchase);
            const purchased = await this.paymentRepository.save(purchase);
  
            if(purchased) {
              const populatedPurchase = await this.paymentRepository
                .createQueryBuilder("payment")
                .where("payment.id = :id", { id: purchased.id })
                .getOne();
              responseData.purchased = { ...populatedPurchase }; 
            }
  
      }else{
        const purchase = new Payment();
        purchase.tx_ref = initializeOptions.tx_ref;
        purchase.payment_date = new Date();
        purchase.payment_method = "Direct";
        purchase.amount = parseFloat(initializeOptions.amount)
        const purchased = await this.paymentRepository.save(purchase);
        if (purchased) {
          const populatedPurchase = await this.paymentRepository
            .createQueryBuilder("payment")
            .where("payment.id = :id", { id: purchased.id })
            .getOne();
          responseData.purchased = { ...populatedPurchase };
        }
        responseData.checkout_url = response.data.data;

        return responseData;
      }
      responseData.checkout_url = response.data.data;

      return responseData;
    }
    return responseData;

    } catch (error) {
      console.log(error ,"error happened");
      if (error.response) {
        throw new HttpException(
          error?.response?.data?.message,
          error?.response?.status,
        );
      } else if (error.name === "ValidationError") {
        throw new HttpException(error?.errors?.[0], HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async verifyTicketPayment(verifyOptions: VerifyOptions): Promise<any> {
    try {
      const verify =await this.chapaService.verify(verifyOptions)
      const payment = await this.findOneByTxRef(verifyOptions.tx_ref)

       if (verify.status === "success") {
      payment.status = "COMPLETED";
      await this.subscriptionPlanService.updateIsPayed(payment.subscriptionPlan.id);
    } else {
      payment.status = "FAILED";
    }

    const updatedPayment = await this.paymentRepository.save(payment);
    updatedPayment

      return {...verify, payment:updatedPayment }
     }
     catch (error) {
      throw error
    }
  }

}
