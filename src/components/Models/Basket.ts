import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Basket {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  // CRUD
  // create - read - update - delete

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (item.price === null) {
      console.log(`Товар ${item.title} недоступен для покупки`);
    } else {
      this.items.push(item);
      this.events.emit("basket:changed", { items: this.items });
    }
  }

  deleteItem(item: IProduct): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit("basket:changed", { items: this.items });
    }
  }

  clearBasket(): void {
    this.items = [];
    this.events.emit("basket:changed", { items: this.items });
  }

  getTotalSum(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getTotalAmount(): number {
    return this.items.length;
  }

  contains(itemId: string): boolean {
    return this.items.some((item) => item.id === itemId);
  }
}
