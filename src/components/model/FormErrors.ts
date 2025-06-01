import { Model } from "../base/model";
import { IClientData, IFormErrors } from "../../types";
import { IEvents } from "../base/events";
import { EventNames } from "../../utils/eventNames";

export class FormErrors extends Model<IFormErrors> {
  clientData: IClientData = {
    payment: '',
    email: '',
    phone: '',
    address: ''
  };

  formErrors: Partial<Record<keyof IClientData, string>> = {};

  constructor(data: Partial<IFormErrors>, events: IEvents) {
    super(data, events);
  }

  validateOrder(): boolean {
    const errors: Partial<Record<keyof IClientData, string>> = {};

    if (!this.clientData.email) {
      errors.email = 'Необходимо указать email';
    }

    if (!this.clientData.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    if (!this.clientData.address) {
      errors.address = 'Необходимо указать адрес';
    }

    this.formErrors = errors;
    this.events.emit(EventNames.FormErrorsChange, this.formErrors);

    return Object.keys(errors).length === 0;
  }

  clearErrors(): void {
    this.formErrors = {};
    this.events.emit(EventNames.FormErrorsChange, this.formErrors);
  }
}