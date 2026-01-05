import {
  IApi,
  IProduct,
  IApiProductResponse,
  IOrderData,
  IOrderResponse,
} from "../types/index";

export class WeblarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      const response: IApiProductResponse = await this.api.get("/product/");
      return response.items;
    } catch (error) {
      console.error("Ошибка при загрузке товаров", error);
      throw error;
    }
  }

  async postOrder(order: IOrderData): Promise<IOrderResponse> {
    try {
      const response: IOrderResponse = await this.api.post("/order/", order);
      console.log("Заказ успешно отправлен.");
      return response;
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
      throw error;
    }
  }
}
