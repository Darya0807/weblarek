import { ensureElement } from "../../utils/utils";
import { ProductCard } from "./ProductCard";
import { ICardActions } from "../base/Events";
import { IProduct } from "../../types";
import { CategoryKey } from "./CardCatalog";
import { categoryMap } from "../../utils/constants";

interface ICardPreview extends IProduct {
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends ProductCard<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (actions?.onClickAddToBasket) {
      this.buttonElement.addEventListener("click", actions.onClickAddToBasket);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (value) {
      this.buttonElement.setAttribute("disabled", "disabled");
    } else {
      this.buttonElement.removeAttribute("disabled");
    }
  }
}
