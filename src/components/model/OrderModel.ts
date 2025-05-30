import { Model } from "../base/model";
import { IClientData, IOrderData } from "../../types";
import { IEvents } from "../base/events";

export interface IOrderModel {
  items: string[];
  clientData: IClientData;
  total: number;
  formErrors: Partial<Record<keyof IClientData, string>>;
  validateStepOne(): boolean;
  validateStepTwo(): boolean;  
  getOrderData(): IOrderData
};

export class OrderModel extends Model<IOrderModel>  {
  items: string[] = [];
  clientData: IClientData = {
    email: '',
    phone: '',
    address: '',
    payment: '',
  };
  total: number = 0;
  formErrors: Partial<Record<keyof IClientData, string>> = {};

  constructor(events: IEvents, data: Partial<IOrderModel> = {}) {
    super(data, events);
  }


  validateStepOne(): boolean {
    this.formErrors = {};

    if (!this.clientData.address) {
      this.formErrors.address = 'Необходимо указать адрес';   
    }

    if (!['card', 'cash'].includes(this.clientData.payment)) {
      this.formErrors.payment = 'Необходимо выбрать способ оплаты';
    }

    return Object.keys(this.formErrors).length === 0;
  };


  validateStepTwo(): boolean {
    this.formErrors = {};
  
    if (!this.clientData.phone) {
      this.formErrors.phone = 'Необходимо указать телефон';
    } else {
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(this.clientData.phone)) {
        this.formErrors.phone = 'Телефон должен содержать от 10 до 15 цифр';
      }
    }
  
    if (!this.clientData.email) {
      this.formErrors.email = 'Необходимо указать email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.clientData.email)) {
        this.formErrors.email = 'Неверный формат email';
      }
    }
  
    return Object.keys(this.formErrors).length === 0;
  }
  
  getOrderData(): IOrderData {
    return {
      items: this.items,
      clientData: this.clientData,
      total: this.total,
    };
  }
}


