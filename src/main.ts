import "./scss/styles.scss";

import { ProductList } from "./components/Models/ProductList";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";

import { Api } from "./components/base/Api";
import { WeblarekApi } from "./components/WeblarekApi";
import { API_URL } from "./utils/constants";

const productListModel = new ProductList();
const buyerModel = new Buyer();
const basketModel = new Basket();

const testProduct1 = apiProducts.items[1];
const testProduct2 = apiProducts.items[2];
const testProduct3 = apiProducts.items[3];

// Каталог товаров
productListModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productListModel.getProducts());

productListModel.setSelectedProduct(testProduct1);
console.log("Выбранный товар:", productListModel.getSelectedProduct());

const foundProduct = productListModel.getProductById(testProduct3.id);
console.log("Найденный товар по ID:", foundProduct);

// Корзина товаров
basketModel.addItem(testProduct1);
basketModel.addItem(testProduct2); // Проверка на price = null
basketModel.addItem(testProduct3);
console.log("Товары в корзине:", basketModel.getItems());
console.log("Общая сумма:", basketModel.getTotalSum());
console.log("Количество товаров:", basketModel.getTotalAmount());
console.log("Товар есть в корзине?", basketModel.contains(testProduct1.id));

basketModel.deleteItem(testProduct1);
console.log("После удаления:", basketModel.getItems());

basketModel.clearBasket();
console.log("После очистки корзины:", basketModel.getItems());

// Данные покупателя
buyerModel.setData({
  payment: "card",
  phone: "1234512345",
  address: "ул. Ленина, д. 3",
});
console.log("Данные покупателя (неполные):", buyerModel.getData());
console.log(
  "Результат валидации:",
  Object.keys(buyerModel.validate()).length === 0
    ? "Все данные заполнены корректно"
    : buyerModel.validate()
);

// Все поля заполнены
buyerModel.setData({ email: "d.kissa25@mail.ru" });
console.log("Данные покупателя (полные):", buyerModel.getData());
console.log(
  "Результат валидации:",
  Object.keys(buyerModel.validate()).length === 0
    ? "Все данные заполнены корректно"
    : buyerModel.validate()
);

buyerModel.clearData();
console.log("После очистки:", buyerModel.getData());

// Работа с сервером
const api = new Api(API_URL);
const weblarekApi = new WeblarekApi(api);

async function loadProductsFromServer() {
  try {
    const products = await weblarekApi.getProducts();
    productListModel.setProducts(products);
    console.log(
      "Каталог товаров, загруженный с сервера:",
      productListModel.getProducts()
    );
  } catch (error) {
    console.error("Ошибка при загрузке товаров с сервера:", error);
  }
}

loadProductsFromServer();
