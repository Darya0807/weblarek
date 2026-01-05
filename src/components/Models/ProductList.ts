import { IProduct } from "../../types/index";

export class ProductList {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(productId: string): IProduct | undefined {
    return this.products.find((product) => product.id === productId);
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
