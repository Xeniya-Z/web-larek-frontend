// Интерфейс для данных карточки товара, получаемых с API
import { IEvents } from "../components/base/events";

export interface IProductData {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
};

// Интерфейс для данных клиента
export interface IClientData {
  payment: 'card' | 'cash' | '';
  email: string;
  phone: string;
  address: string;
};

// интерфейс данных уходящих при отправке заказа
export interface IOrderData {
  items: string[];
  clientData: IClientData;
  total: number;
};

// Интерфейс для положительного ответа от API при оформлении заказа
export interface IOrderResult {
  id: string;
  total: number;
};

// интерфейс для ошибки заказа приходящей с API при оформлении заказа
export interface IOrderError {
 error: string;
};

// интерфейс для карточки (для работы на странице)
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  priceText: string;  // цена уже подготовлена для отображения
  priceValue: number | null; // цена в виде числа (для расчетов)
};

// интерфейс отображения страницы
export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
};

export interface IFormErrors {
  formErrors: Partial<Record<keyof IOrderData, string>>;
  order: IOrderData;
};

export interface IViewSettings {
  events: IEvents;
};