import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IForm {
  errors?: string[];
  valid?: boolean;
}

export abstract class Form<T extends IForm> extends Component<T> {
  protected errorElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
  }

  set errors(value: string) {
    this.errorElement.textContent = value;
  }

  set valid(value: boolean) {
    if (this.submitButton) {
      if (!value) {
        this.submitButton.setAttribute("disabled", "disabled");
      } else {
        this.submitButton.removeAttribute("disabled");
      }
    }
  }
}
