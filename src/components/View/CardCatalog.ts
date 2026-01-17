import { ensureElement } from "../../utils/utils";
import { ProductCard } from "./ProductCard";
import { categoryMap } from "../../utils/constants";
import { IProduct } from "../../types";
import { ICardActions } from "../base/Events";

export type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends ProductCard<IProduct> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

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

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
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
}
