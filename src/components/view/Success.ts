import { View } from "../base/View";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
  total: number;
}

interface ISuccessSettings {
  onClick: () => void;
}

export class Success extends View<ISuccessSettings, ISuccess> {
  protected _close: HTMLElement;
  protected _total: HTMLElement;

  constructor(element: HTMLElement, settings: ISuccessSettings) {
    super(element, settings);

    this._close = ensureElement<HTMLElement>('.order-success__close', this.element);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.element);

    this._close.addEventListener('click', () => {
      if (this.settings.onClick) {
        this.settings.onClick();
      }
    })
  }

  render(state: Partial<ISuccess>): HTMLElement {
    if (state.total !== undefined) {
      this.setText(this._total, `Списано ${state.total} синапсов`);
    }
    return super.render(state);
  }
}
