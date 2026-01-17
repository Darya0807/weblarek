import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected totalPriceElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.totalPriceElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      events.emit("success:close");
    });
  }

  set total(value: number) {
    this.totalPriceElement.textContent = `Списано ${value} синапсов`;
  }
}
