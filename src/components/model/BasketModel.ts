import { Model } from "../base/model";
import { IProduct } from '../../types/index';
import { IEvents } from "../base/events";
import { EventNames } from "../../utils/eventNames";

export interface IBasketModel {
  items: Set<string>;
  addItem(id: string): void;
  removeItem(id: string): void;
  getTotalPrice(productList: IProduct[]): number;
  getItems(): string[]
  clear(): void;
};

export class BasketModel extends Model<IBasketModel> {
  items = new Set<string>();

  constructor(events: IEvents, data?: Partial<IBasketModel>) {
    super(data ?? {}, events);
    if (data?.items) {
      this.items = data.items;
    }
  }

  addItem(id: string): void {
    if (!this.items.has(id)) {
      this.items.add(id);
      this.emitChanges(EventNames.BasketItemAdded, { id });
    }
  }

  removeItem(id: string): void {
    if (this.items.has(id)) {
      this.items.delete(id);
      this.emitChanges(EventNames.BasketItemRemoved, { id });
    }
  }

  getTotalPrice(productList: IProduct[]): number {
    let total = 0;
    for (const id of this.items) {
      const product = productList.find(p => p.id === id);
      if (product && product.priceValue !== null) {
        total += product.priceValue;
      }
    }
    return total
  }

  getItems(): string[] {
    return Array.from(this.items);
  }
  
  clear(): void {
    if (this.items.size > 0) {
      this.items.clear();
      this.emitChanges(EventNames.BasketChanged, {});
    }
  }
  
}