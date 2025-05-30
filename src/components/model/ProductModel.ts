import { IProductData, IProduct } from "../../types/index";

export class Product implements IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  priceText: string;  // цена уже подготовлена для отображения
  priceValue: number | null; // цена в виде числа (для расчетов)

  constructor(data: IProductData) {
    this.id = data.id;
    this.description = data.description;
    this.image = data.image;
    this.title = data.title;
    this.category = data.category;
    this.priceValue = data.price;
    this.priceText = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
  }
};