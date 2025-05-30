import { View } from "../base/View";
import { IViewSettings } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends View<IViewSettings, IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, settings: IViewSettings) {
        super(container, settings);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.element.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement | null) {
        this._content.replaceChildren(value);
    }

    open() {
        this.element.classList.add('modal_active');
        this.settings?.events.emit('modal:open');
    }

    close() {
        this.element.classList.remove('modal_active');
        this.content = null;
        this.settings?.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        this.content = data.content;
        super.render(data);
        this.open();
        return this.element;
  }
}
