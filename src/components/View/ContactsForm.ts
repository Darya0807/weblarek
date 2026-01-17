import { ensureElement } from "../../utils/utils";
import { Form, IForm } from "./Form";
import { IFormElementActions } from "../base/Events";

interface IContactsForm extends IForm {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected actions: IFormElementActions,
  ) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      actions.onClick?.({ email: this.emailInput.value });
    });

    this.phoneInput.addEventListener("input", () => {
      actions.onClick?.({ phone: this.phoneInput.value });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      actions.onSubmit?.();
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
