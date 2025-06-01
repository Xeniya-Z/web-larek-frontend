import { View } from "../base/View";
import { IViewSettings } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventNames } from "../../utils/eventNames";

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

    _toggleModal(state: boolean = true) {
        this.toggleClass(this.element, 'modal_active', state);
    }

    _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    open() {
        this._toggleModal();
        document.addEventListener('keydown', this._handleEscape);
        this.settings.events.emit(EventNames.ModalOpen);
    }

    close() {
        this._toggleModal(false);
        document.removeEventListener('keydown', this._handleEscape);
        this.content = null;
        this.settings.events.emit(EventNames.ModalClose);
    }

    render(data: IModalData): HTMLElement {
        this.content = data.content;
        super.render(data);
        this.open();
        return this.element;
  }
}
