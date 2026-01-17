# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейсы данных

##### Товар (IProduct)

Описывает структуру товара в каталоге.

```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

##### Покупатель (IBuyer)

Описывает данные покупателя, необходимые для оформления заказа.

```
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

Тип способа оплаты:
`type TPayment = 'card' | 'cash' | null;`

##### Результат валидации (ValidationErrors)

Описывает структуру объекта с ошибками валидации данных покупателя.

```
type ValidationErrors = {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

##### Ответ сервера (IApiProductResponse)

Описывает структуру ответа сервера при запросе каталога товаров.

```
interface IApiProductResponse {
  total: number; // Общее количество товаров
  items: IProduct[]; // Массив товаров
}
```

##### Заказ (IOrderData)

Описывает структуру данных, отправляемых на сервер для оформления заказа.

```
interface IOrderData {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
```

##### Ответ сервера (IOrderResponse)

Описывает структуру данных, получаемых при успешном оформлении заказа

```
interface IOrderResponse {
  id: string;
  total: number;
}
```

### Модели данных

#### Класс ProductList

Хранит товары, которые можно купить в приложении.

Конструктор:  
`constructor()` - не принимает параметров, инициализирует пустые данные.

Поля класса:  
`products: IProduct[]` - массив всех товаров в каталоге (пустой массив по умолчанию).  
`selectedProducts: IProduct | null` - товар, выбранный для подробного отображения (null по умолчанию).

Методы:  
`setProducts(products: IProduct[]): void` - сохраняет переданный массив товаров.
`getProducts(): IProduct[]` - возвращает массив всех товаров.
`getProductById(productId: string): IProduct | undefined` - возвращает товар по его ID или undefined, если товар не найден.
`setSelectedProduct(product: IProduct | null): void` - сохраняет товар, выбранный для подробного отображения.
`getSelectedProduct(): IProduct | null` - возвращает товар, выбранный для подробного отображения.

#### Класс Basket

Хранит товары, которые пользователь выбрал для покупки.

Конструктор:  
`constructor()` - не принимает параметров, инициализирует пустую корзину.

Поля класса:  
`items: IProduct[]` - массив товаров, выбранных покупателем для покупки (пустой массив по умолчанию).

Методы:  
`getItems(): IProduct[]` - получает массив товаров, которые находятся в корзине.
`addItem(item: IProduct): void` - добавляет товар в массив корзины.
`deleteItem(item: IProduct): void` - удаляет товар из массива корзины.
`clearBasket(): void` - очищает корзину.
`getTotalSum(): number` - возвращает общую стоимость всех товаров в корзине.
`getTotalAmount(): number` - возвращает количество товаров в корзине.
`contains(itemId: string): boolean` - проверяет наличие товара в корзине по его id.

#### Класс Buyer

Хранит данные покупателя, которые необходимо указать при оформлении заказа.

Конструктор:  
`constructor()` - не принимает параметров, инициализирует пустые данные.

Поля класса:  
`payment: TPayment` - способ оплаты.
`email: string` - электронная почта.
`phone: string` - номер телефона.
`address: string` - адрес доставки.

Методы:  
`setData(data: Partial<IBuyer>): void` - сохраняет переданные данные.
`getData(): IBuyer` - возвращает данные покупателя.
`clearData(): void` - очищает все данные покупателя.
`validate(): ValidationErrors` - выполняет валидацию данных и возвращает объект с ошибками.

### Слой Коммуникации

#### Класс WeblarekApi

Отвечает за взаимодействие с сервером магазина.
Использует композицию, чтобы выполнять запросы на сервер с помощью методов`get` и `post` класса Api.

Конструктор:  
`constructor(api: IApi)` - В конструктор передается объект, реализующий интерфейс `IApi`.

Поля класса:  
`api: IApi` - экземпляр класса для выполнения HTTP-запросов.

Методы:  
`getProducts(): Promise<IProduct[]>` - делает get-запрос на эндпоинт /product/ и возвращает массив товаров.
`postOrder(order: IOrderData): Promise<IOrderResponse>` - выполняет POST-запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода, и возвращает результат.

### Слой Представления (View)

#### Интерфейсы

##### Данные для шапки сайта

```
interface IHeader {
    counter: number;
}
```

##### Данные для каталога

```
interface IGallery {
    catalog: HTMLElement[];
}
```

##### Данные для модального окна

```
interface IModal {
    content?: HTMLElement;
}
```

##### Данные для корзины товаров

```
interface IBasket {
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
}
```

##### Данные для превью карточки

```
interface ICardPreview extends IProduct {
  buttonText: string,
  buttonDisabled: boolean
}
```

##### Данные для карточки в корзине

```
interface ICardBasket extends IProduct {
  index: number
}
```

##### Данные для форм

```
interface IForm {
    errors?: string[];
    valid?: boolean;
}
```

```
interface IOrderForm extends IForm {
    payment: TPayment;
    address: string;
}
```

```
interface IContactsForm extends IForm {
    email: string;
    phone: string;
}
```

##### Данные для успешного оформления заказа

```
interface IOrderSuccess {
    total: number;
}
```

#### Класс Header

Отображает шапку сайта с логотипом и кнопкой корзины со счетчиком товаров.

Наследование: `Header extends Component<IHeader>`

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на корневой DOM-элемент шапки.

Поля класса:  
`counterElement: HTMLElement` - элемент для отображения количества товаров в корзине.
`basketButton: HTMLButtonElement` - кнопка корзины.

Методы:  
`set counter(value: number): void` - сеттер для обновления счётчика в корзине.

#### Класс Gallery

Отображает каталог товаров в виде сетки карточек.

Наследование: `Gallery extends Component<IGallery>`

Конструктор:  
`constructor(container: HTMLElement)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на DOM-элемент (каталог).

Поля класса:  
`catalogElement: HTMLElement` - контейнер для карточек товаров.

Методы:  
`set catalog(items: HTMLElement[]): void` - сеттер для добавления карточек товаров в контейнер.

#### Класс Modal

Отвечает за управление модальным окном.

Наследование: `Modal extends Component<IModal>`

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на DOM-элемент (модальное окно).

Поля класса:  
`closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
`contentElement: HTMLElement` - контейнер для контента модального окна.

Методы:
`open(): void` - открывает модальное окно.
`close(): void` - закрывает модальное окно.
`set content(content: HTMLElement): void` - сеттер для добавления контента в модальное окно.

#### Класс BasketView

Отображает содержимое корзины.

Наследование: `BasketView extends Component<IBasket>`

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на DOM-элемент (корзина).

Поля класса:  
`listElement: HTMLUListElement` - контейнер для списка товаров в корзине.
`totalPriceElement: HTMLElement` - элемент для отображения общей стоимости.
`orderButton: HTMLButtonElement` - кнопка оформления заказа.

Методы:
`set items(value: HTMLElement[]): void` - отображает список товаров.
`set total(value: number): void` - обновляет общую стоимость.
`set buttonDisabled(value: boolean): void` - активирует/деактивирует кнопку оформления.

#### Абстрактный класс Form

Базовый класс для всех форм (оформления заказа, контактов).

Наследование: `Form<T extends IForm> extends Component<T>`

Конструктор:  
`constructor(container: HTMLElement)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на DOM-элемент формы.

Поля класса:  
`errorElement: HTMLElement` - контейнер для отображения ошибок.
`submitButton: HTMLButtonElement` - кнопка отправки формы.

Методы:
`set errors(value: string): void` - отображает ошибоки.
`set valid(value: boolean): void` - активирует/деактивирует кнопку отправки формы.

##### Класс OrderForm

Отображает форму выбора способа оплаты и ввода адреса доставки.

Наследование: `OrderForm extends Form<IOrderForm>`

Конструктор:  
`constructor(container: HTMLElement, actions: IFormElementActions)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на DOM-элемент формы.

Поля класса:  
`paymentCardButton: HTMLButtonElement` - кнопка выбора способа оплаты (card).
`paymentCashButton: HTMLButtonElement` - кнопка выбора способа оплаты (cash).
`addressInput: HTMLInputElement` - поле ввода адреса.

Методы:
`set payment(value: TPayment): void` - установка способа оплаты.
`set address(value: string): void` - установка адреса.

##### Класс ContactsForm

Отображает форму ввода контактных данных (email и телефон).

Наследование: `ContactsForm extends Form<IContactsForm>`

Конструктор:  
`constructor(container: HTMLElement, actions: IFormElementActions)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на DOM-элемент формы.

Поля класса:  
`emailInput: HTMLInputElement` - поле ввода email.
`phoneInput: HTMLInputElement` - поле ввода номера телефона.

Методы:
`set email(value: string): void` - установка email.
`set phone(value: string): void` - установка номера телефона.

#### Абстрактный класс ProductCard

Базовый класс для всех типов карточек товаров.

Наследование: `ProductCard<T extends IProduct> extends Component<T>`

Конструктор:  
`constructor(container: HTMLElement, actions?: ICardActions)` - В конструктор передается ссылка на DOM-элемент контейнера карточки товара и объект с обработчиками событий.

Поля класса:  
`titleElement: HTMLElement` - элемент для названия товара.
`priceElement: HTMLElement` - элемент для цены товара.

Методы:  
`set title(value: string): void` - сеттер для названия товара.
`set price(value: number | null): void` - сеттер для цены товара.

##### Класс CardCatalog

Отображает карточку в каталоге товаров.

Наследование: `class CardCatalog extends ProductCard<IProduct>`

Конструктор:  
`constructor(container: HTMLElement, actions?: ICardActions)`

Дополнительные поля класса:  
`imageElement: HTMLImageElement` - изображение товара.
`categoryElement: HTMLElement` - категория товара.

Дополнительные методы:  
`set category(value: string): void` - сеттер для добавления изображения.
`set image(value: string): void` - сеттер для добавления категории.

##### Класс CardPreview

Отображает описание карточки в модальном окне.

Наследование: `CardPreview extends ProductCard<ICardPreview>`

Конструктор:  
`constructor(container: HTMLElement, actions?: ICardActions)`

Дополнительные поля класса:  
`imageElement: HTMLImageElement` - изображение товара.
`categoryElement: HTMLElement` - категория товара.
`descriptionElement: HTMLElement` - описание товара.
`buttonElement: HTMLButtonElement` - кнопка «В корзину» / «Удалить из корзины».

Дополнительные методы:
`set category(value: string): void` - сеттер для добавления изображения.
`set image(value: string): void` - сеттер для добавления категории.
`set description(value: string): void` - сеттер для добавления описания товара.
`set buttonText(value: string): void` - сеттер для смены текста кнопки.
`set buttonDisabled(value: boolean): void` - сеттер для активации/деактивации кнопки.

##### Класс BasketCard

Отображает карточку товара в корзине.

Наследование: `BasketCard extends ProductCard<ICardBasket>`

Конструктор:  
`constructor(container: HTMLElement, actions?: ICardActions)`

Дополнительные поля класса:  
`indexElement: HTMLElement` - индекс товара в списке.
`deleteButton: HTMLButtonElement` - кнопка удаления товара из корзины.

Дополнительные методы:  
`set index(value: number): void` - сеттер для индекса товара.

#### Класс OrderSuccess

Отображает сообщение об успешном оформлении заказа.

Наследование: `OrderSuccess extends Component<IOrderSuccess>`

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - В конструктор передается экземпляр брокера событий для обработки взаимодействий и ссылка на DOM-элемент (корзина).

Поля класса:  
`totalPriceElement: HTMLElement` - элемент для отображения списанной суммы.
`closeButton: HTMLButtonElement` - кнопка закрытия.

Методы:
`set total(value: number): void` - обновляет сумму списания.

### События

#### Интерфейсы

##### Обработчики событий карточек (ICardActions)

```
interface ICardActions {
  onClick?: (event: MouseEvent) => void;
  onDeleteButtonClick?: (event: MouseEvent) => void;
  onClickAddToBasket?: (event: MouseEvent) => void;
}
```

##### Обработчики событий форм (IFormElementActions)

```
interface IFormElementActions {
  onClick?: (data: object) => void;
  onSubmit?: () => void;
}
```

#### События Моделей Данных

##### События ProductList

- `products:changed` - генерируется при изменении списка товаров.
- `preview:changed` - генерируется при выборе карточки товара.

##### События Basket

- `basket:changed` - генерируется при любом изменении корзины (добавление/удаление/очистка).

##### События Buyer

- `buyer:changed` - генерируется при изменении любых данных покупателя.

#### События слоя Представления

##### События Header

- `header:basket:open` - генерируется при клике на кнопку корзины в шапке.

##### События Modal

- `modal:close` - генерируется при закрытии модального окна.

##### События BasketView

- `basket:order` - генерируется при нажатии на кнопку оформления заказа

##### События Форм

- `order:change` - генерируется при изменении формы
- `order:submit` - генерируется при отправке формы заказа
- `succes:order:submit` - генерируется при отправке формы контактных данных

##### События CardCatalog

- `card:select` - генерируется при клике на карточку в каталоге

##### События OrderSuccess

- `success:close` - генерируется при закрытии сообщения об успешном заказе

### Presenter

Презентер реализован в main.ts и отвечает за:

- Инициализацию всех компонентов
- Настройку обработчиков событий
- Координацию взаимодействия между моделями данных и view
- Управление состоянием приложения
