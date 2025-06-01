import { View } from "../base/View";
import { IViewSettings } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { EventNames } from "../../utils/eventNames";

export interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
};

export class BasketView extends View<IViewSettings, IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(element: HTMLElement, protected settings: IViewSettings) {
        super(element, settings);

        this._list = ensureElement<HTMLElement>('.basket__list', this.element);
        this._total = ensureElement<HTMLElement>('.basket__price', this.element);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.element);
        if (this._button) {
            this.setDisabled(this._button, true);
            this._button.addEventListener('click', () => {
                settings.events.emit(EventNames.OrderOpen);
            });
        }
        this.items = [];
      
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
      }

    public getElement(): HTMLElement {
        return this.element;
    }

}