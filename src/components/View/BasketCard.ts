import { ensureElement } from "../../utils/utils";
import { ProductCard } from "./ProductCard";
import { ICardActions } from "../base/Events";
import { IProduct } from "../../types";

interface ICardBasket extends IProduct {
  index: number;
}

export class BasketCard extends ProductCard<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (actions?.onDeleteButtonClick) {
      this.deleteButton.addEventListener("click", actions.onDeleteButtonClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}
