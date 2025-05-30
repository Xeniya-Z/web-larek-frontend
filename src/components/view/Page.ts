import { View } from "../base/View";
import { IViewSettings, IPage } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Page extends View<IViewSettings, IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected settings: IViewSettings) {
    super(container, settings);

    this._counter = ensureElement('.header__basket-counter');
    this._catalog = ensureElement('.gallery');
    this._wrapper = ensureElement('.page__wrapper');
    this._basket = ensureElement('.header__basket');

    this._basket.addEventListener('click', () => {
      this.settings.events.emit('bids:open');
    });
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
  }

  render(data: Partial<IPage>): HTMLElement {
    if (data.counter !== undefined) this.counter = data.counter;
    if (data.catalog !== undefined) this.catalog = data.catalog;
    if (data.locked !== undefined) this.locked = data.locked;

    return this.element;
  }
}