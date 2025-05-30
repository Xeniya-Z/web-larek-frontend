import { Model } from "../base/model";
import { IClientData, IFormErrors, IOrderData } from "../../types";
import { IEvents } from "../base/events";

export class FormErrors extends Model<IFormErrors> {
  order: IOrderData = {
    items: [],
    total: 0,
    clientData: {
      email: '',
      phone: '',
      address: '',
      payment: ''
    }
  };

  formErrors: Partial<Record<keyof IClientData, string>> = {};

  constructor(data: Partial<IFormErrors>, events: IEvents) {
    super(data, events);
  }

  validateOrder(): boolean {
    const errors: Partial<Record<keyof IClientData, string>> = {};

    if (!this.order.clientData.email) {
      errors.email = 'Необходимо указать email';
    }

    if (!this.order.clientData.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    if (!this.order.clientData.address) {
      errors.address = 'Необходимо указать адрес';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);

    return Object.keys(errors).length === 0;
  }

  clearErrors(): void {
    this.formErrors = {};
    this.events.emit('formErrors:change', this.formErrors);
  }
}