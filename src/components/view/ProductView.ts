import { View } from "../base/View";
import { IProduct, IViewSettings } from "../../types";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { EventNames } from "../../utils/eventNames";

export class ProductView extends View<IViewSettings, IProduct> {

  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;

  constructor(product: IProduct, settings: IViewSettings) {
    const element = cloneTemplate<HTMLElement>('#card-catalog');

    super(element, settings); // передаём settings в базовый класс

    this._title = ensureElement<HTMLElement>('.card__title', this.element);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.element);
    this._price = ensureElement<HTMLElement>('.card__price', this.element);
    this._category = ensureElement<HTMLElement>('.card__category', this.element);

    this.render(product);

    this.element.addEventListener('click', () => {
      this.settings.events.emit(EventNames.ProductSelect, { id: product.id });
    });
  }

  render(data: IProduct): HTMLElement {
    this.setText(this._title, data.title);
    this._image.src = data.image;
    this._image.alt = data.title;
    this.setText(this._price, data.priceText);
    this.setText(this._category, data.category);
    this.element.dataset.id = data.id;

    return this.element;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
