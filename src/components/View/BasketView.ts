import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export class BasketView extends Component<IBasket> {
  protected listElement: HTMLUListElement;
  protected totalPriceElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container,
    );
    this.totalPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.orderButton.addEventListener("click", () => {
      events.emit("basket:order");
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalPriceElement.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    if (this.orderButton) {
      if (value) {
        this.orderButton.setAttribute("disabled", "disabled");
      } else {
        this.orderButton.removeAttribute("disabled");
      }
    }
  }
}
