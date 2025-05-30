import { Model } from "./base/model";
import { BasketModel, IBasketModel } from "./model/BasketModel";
import { OrderModel, IOrderModel } from "./model/OrderModel";
import { IProduct, IClientData } from "../types";
import { IEvents } from "./base/events";

interface IAppState {
  items: IProduct[];
  basket: IBasketModel;
  order: IOrderModel;
};

export class AppState extends Model<IAppState> {
    items: IProduct[];
    basket: IBasketModel;
    order: IOrderModel;

    constructor(events: IEvents) {
        super({}, events);
        
        this.items = [];
        this.basket = new BasketModel(events);
        this.order = new OrderModel(events);
    }

    setItems (items: IProduct[]) {
        this.items = items;
        this.emitChanges('items:changed', { items: this.items });
    }

    async getItem(id: string): Promise<IProduct> {
        const item = this.items.find(item => item.id === id);
        if (!item) {
            throw new Error(`Товар с id ${id} не найден`);
        }
        return item;
    }

    // собираем даные с корзины 
    setOrder(clientData: IClientData) {
        this.order.clientData = clientData;
        this.order.items = Array.from(this.basket.items);
        this.order.total = this.basket.getTotalPrice(this.items);
        this.emitChanges('order:changed', this.order);
      }
      
    getOrderData() {
      return this.order.getOrderData();
    }
}