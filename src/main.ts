import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { ProductList } from "./components/Models/ProductList";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Api } from "./components/base/Api";
import { WeblarekApi } from "./components/WeblarekApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { IProduct, IOrderData } from "./types";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { BasketCard } from "./components/View/BasketCard";
import { BasketView } from "./components/View/BasketView";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { OrderSuccess } from "./components/View/OrderSuccess";

const events = new EventEmitter();

const productListModel = new ProductList(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const weblarekApi = new WeblarekApi(api);

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketElement = cloneTemplate(basketTemplate);
const basketView = new BasketView(events, basketElement);

const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

async function loadProductsFromServer() {
  try {
    const products = await weblarekApi.getProducts();
    productListModel.setProducts(products);
  } catch (error) {
    console.error("Ошибка при загрузке товаров с сервера:", error);
  }
}

function createBasketCards(items: IProduct[]) {
  return items.map((item, index) => {
    const cardElement = cloneTemplate(cardBasketTemplate);
    const card = new BasketCard(cardElement, {
      onDeleteButtonClick: (e) => {
        e.preventDefault();
        basketModel.deleteItem(item);
      },
    });

    return card.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });
}

events.on("products:changed", () => {
  const products = productListModel.getProducts();
  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: (e) => {
        e.preventDefault();
        events.emit("card:select", { product });
      },
    });

    return card.render({
      title: product.title,
      price: product.price,
      image: `${CDN_URL}/${product.image}`,
      category: product.category,
    });
  });

  gallery.render({ catalog: cards });
});

events.on("card:select", ({ product }: { product: IProduct }) => {
  productListModel.setSelectedProduct(product);
});

events.on("preview:changed", () => {
  const product = productListModel.getSelectedProduct();

  if (!product) {
    return;
  }

  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClickAddToBasket: (e) => {
      e.preventDefault();
      if (basketModel.contains(product.id)) {
        basketModel.deleteItem(product);
      } else {
        basketModel.addItem(product);
      }
      events.emit("modal:close");
    },
  });

  const previewElement = cardPreview.render({
    title: product.title,
    price: product.price,
    image: `${CDN_URL}/${product.image}`,
    category: product.category,
    description: product.description,
    buttonText:
      product.price === null
        ? "Недоступно"
        : basketModel.contains(product.id)
          ? "Удалить из корзины"
          : "В корзину",
    buttonDisabled: product.price === null,
  });

  modal.render({ content: previewElement });
  modal.open();
});

events.on("header:basket:open", () => {
  const items = basketModel.getItems();
  const basketCards = createBasketCards(items);

  const basketContainer = basketView.render({
    items: basketCards,
    total: basketModel.getTotalSum(),
    buttonDisabled: basketModel.getTotalAmount() === 0,
  });

  modal.render({ content: basketContainer });
  modal.open();
});

events.on("basket:changed", () => {
  header.render({ counter: basketModel.getTotalAmount() });

  const items = basketModel.getItems();
  const basketCards = createBasketCards(items);

  basketView.render({
    items: basketCards,
    total: basketModel.getTotalSum(),
    buttonDisabled: items.length === 0,
  });
});

const orderElement = cloneTemplate(orderTemplate);
const orderForm = new OrderForm(orderElement as HTMLFormElement, {
  onClick: (data) => {
    events.emit("order:change", data);
  },
  onSubmit: () => {
    events.emit("order:submit");
  },
});

events.on("basket:order", () => {
  events.emit("buyer:changed");
  modal.render({ content: orderElement });
  modal.open();
});

const contactsElement = cloneTemplate(contactsTemplate);
const contactsForm = new ContactsForm(contactsElement as HTMLFormElement, {
  onClick: (data) => {
    events.emit("order:change", data);
  },
  onSubmit: () => {
    events.emit("success:order:submit");
  },
});

events.on("order:submit", () => {
  const errors = buyerModel.validate();

  if (!errors.payment && !errors.address) {
    modal.render({ content: contactsElement });
  }
});

events.on("order:change", (data) => {
  buyerModel.setData(data);
  events.emit("buyer:changed");
});

events.on("buyer:changed", () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address,
    valid: false,
  });

  orderForm.errors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(", ");

  orderForm.valid = !errors.payment && !errors.address;

  contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: false,
  });

  contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join(", ");

  contactsForm.valid = !errors.email && !errors.phone;
});

events.on("success:order:submit", async () => {
  try {
    const orderData: IOrderData = {
      ...buyerModel.getData(),
      items: basketModel.getItems().map((item) => item.id),
      total: basketModel.getTotalSum(),
    };

    const { total } = await weblarekApi.postOrder(orderData);

    const orderSuccessElement = cloneTemplate(successTemplate);
    const orderSuccess = new OrderSuccess(events, orderSuccessElement);
    orderSuccess.render({ total });
    modal.render({ content: orderSuccessElement });

    basketModel.clearBasket();
    buyerModel.clearData();
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
  }
});

events.on("modal:close", () => {
  modal.close();
});

events.on("success:close", () => {
  modal.close();
});

loadProductsFromServer();
