import { IBuyer, TPayment, ValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment = null;
  protected email: string = "";
  protected phone: string = "";
  protected address: string = "";

  constructor(protected events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    let changed = false;

    if (data.payment !== undefined && data.payment !== this.payment) {
      this.payment = data.payment;
      changed = true;
    }
    if (data.email !== undefined && data.email !== this.email) {
      this.email = data.email;
      changed = true;
    }
    if (data.phone !== undefined && data.phone !== this.phone) {
      this.phone = data.phone;
      changed = true;
    }
    if (data.address !== undefined && data.address !== this.address) {
      this.address = data.address;
      changed = true;
    }
    if (changed) {
      this.events.emit("buyer:changed");
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearData(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed", this.getData());
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.address || this.address.trim() === "") {
      errors.address = "Введите адрес доставки";
    }

    if (!this.email || this.email.trim() === "") {
      errors.email = "Укажите email";
    }

    if (!this.phone || this.phone.trim() === "") {
      errors.phone = "Введите номер телефона";
    }

    return errors;
  }
}
