import { IProduct } from "../../types/index";

export class Basket {
  protected items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (item.price === null) {
      console.log(`Товар ${item.title} недоступен для покупки`);
    } else {
      this.items.push(item);
    }
  }

  deleteItem(item: IProduct): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  clearBasket(): void {
    this.items = [];
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
