import { ensureElement } from "../../utils/utils";
import { Form, IForm } from "./Form";
import { IFormElementActions } from "../base/Events";
import { TPayment } from "../../types";

interface IOrderForm extends IForm {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentCardButton: HTMLButtonElement;
  protected paymentCashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected actions: IFormElementActions,
  ) {
    super(container);

    this.paymentCardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.paymentCashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.paymentCardButton.addEventListener("click", () => {
      actions.onClick?.({ payment: "card" });
    });

    this.paymentCashButton.addEventListener("click", () => {
      actions.onClick?.({ payment: "cash" });
    });

    this.addressInput.addEventListener("input", () => {
      actions.onClick?.({ address: this.addressInput.value });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      actions.onSubmit?.();
    });
  }

  set payment(value: TPayment) {
    this.paymentCardButton.classList.remove("button_alt-active");
    this.paymentCashButton.classList.remove("button_alt-active");

    if (value === "card") {
      this.paymentCardButton.classList.add("button_alt-active");
    } else if (value === "cash") {
      this.paymentCashButton.classList.add("button_alt-active");
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
