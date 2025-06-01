import { View } from "../base/View";
import { IViewSettings } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventNames } from "../../utils/eventNames";

interface IBasketItemView {
  id: string;
  title: string;
  priceValue: number;
  index: number;
}

export class BasketItemView extends View<IViewSettings, IBasketItemView> {
  private _title: HTMLElement;
  private _price: HTMLElement;
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement;
  private data: IBasketItemView;

  protected init(): void {
    this._title = ensureElement<HTMLElement>('.card__title', this.element);
    this._price = ensureElement<HTMLElement>('.card__price', this.element);
    this._index = ensureElement<HTMLElement>('.basket__item-index', this.element);
    this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.element);

    this.setupListeners(() => {
      this._deleteButton.addEventListener('click', () => {
        this.settings.events.emit(EventNames.BasketRemove, { id: this.data?.id });
      });
    });
  }

  render(data: IBasketItemView): HTMLElement {
    this.data = data;

    this.setText(this._title, data.title);
    this.setText(this._price, `${data.priceValue} синапсов`);
    this.setText(this._index, String(data.index + 1));

    return this.element;
  }
}