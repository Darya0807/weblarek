import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ProductList {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("products:changed", { products: this.products });
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(productId: string): IProduct | undefined {
    return this.products.find((product) => product.id === productId);
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.events.emit("preview:changed", { product: this.selectedProduct });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
