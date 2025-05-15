// Интерфейс для данных карточки товара, получаемых с API
interface IProductData {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
};

// Интерфейс для данных клиента
interface IClientData {
  payment: 'cash' | 'online';
  email: string;
  phone: string;
  address: string;
};

// интерфейс данных уходящих при отправке заказа
interface IOrderData {
  items: string[];
  clientData: IClientData;
  total: number;
};

// Интерфейс для положительного ответа от API при оформлении заказа
interface IOrderResult {
  id: string;
  total: number;
};

// интерфейс для ошибки заказа приходящей с API при оформлении заказа
interface IOrderError {
 error: string;
};

// интерфейс API клиента
interface IProductsAPI {
  getProducts: () => Promise<IProductData[]>;
  orderProducts: (order: IOrderData) => Promise<IOrderResult>;
};

// интерфейс для карточки (для работы на странице)
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: string;
};

// интерфейс приложения в целом
interface IAppState {
  catalog: IProduct[];
  basket: IBasketModel;
  preview: string | null;
  order: IOrderData | null;
};

// интерфейс для открытия карточек с товаром
interface ICardActions {
  onClick: (event: MouseEvent) => void;
};

// интерфейс модели для управления списком товаров
interface IProductsModel {
  items: IProduct[];
  setItems: (items: IProduct[]) => void;
  getItem: (id: string) => Promise<IProduct>;
};

// интерфейс модели корзины
interface IBasketModel {
  items: Set<string>;
  addItem(id: string): void;
  removeItem(id: string): void;
  getTotalPrice(): number;
};

// интерфейс для базового отображения (для абстрактного класса)
interface IView<T> {
  element: HTMLElement;
  copy(): IView<T>;
  render(data?: T): HTMLElement;
};

// интерфейс для базового конструктора отображения
interface IViewConstructor<T, S> {
  new (root: HTMLElement, settings: S): IView<T>;
};

// интерфейс отображения страницы
interface IPage {
  counter: number;
  catalog: HTMLElement[];
};

// интерфейс отображения корзины
interface IBasketView {
  items: HTMLElement[];
  total: number;
};