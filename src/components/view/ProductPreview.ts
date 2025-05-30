import { View } from "../base/View";
import { IProduct, IViewSettings } from "../../types";
import { ensureElement, cloneTemplate } from "../../utils/utils";

export class ProductPreview extends View<IViewSettings, IProduct> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(product: IProduct, settings: IViewSettings) {
    const template = ensureElement<HTMLTemplateElement>('#card-preview');
    const element = cloneTemplate<HTMLElement>('#card-preview');

    super(element, settings);

    this._title = ensureElement<HTMLElement>('.card__title', this.element);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.element);
    this._category = ensureElement<HTMLElement>('.card__category', this.element);
    this._description = ensureElement<HTMLElement>('.card__text', this.element);
    this._price = ensureElement<HTMLElement>('.card__price', this.element);
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.element);

    this.render(product);

    this._button.addEventListener('click', () => {
      this.settings.events.emit('basket:add', { id: product.id });
    });
  }

  render(data: IProduct): HTMLElement {
    this._title.textContent = data.title;
    this._image.src = data.image;
    this._image.alt = data.title;
    this._category.textContent = data.category;
    this._description.textContent = data.description;
    this._price.textContent = data.priceText;

    return this.element;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public disableButton(titleText: string) {
    this._button.disabled = true;
    this._button.title = titleText;
  }
}



