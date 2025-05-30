export interface IView<T> { 
  element: HTMLElement;
  copy(): IView<T>;
  render(data?: T): HTMLElement;
}

export interface IViewConstructor<T, S> {
  new (root: HTMLElement, settings: S): IView<T>;
}

export abstract class View<S extends object, T> {
  ['constructor']!: new (root: HTMLElement, settings: S) => this;
  protected isConfiguredListeners = false;
  
  constructor(protected element: HTMLElement, protected settings: S) {
      this.init();
  }

  copy(settings?: S): typeof this {
    return new this.constructor(
        this.element.cloneNode(true) as HTMLElement,
        Object.assign({}, this.settings, settings ?? {})
    );
}

protected setupListeners(callback: () => void) {
    if (!this.isConfiguredListeners) {
        callback();
        this.isConfiguredListeners = true;
    }
}

protected init() {}

render(data?: Partial<T>): HTMLElement {
  Object.assign(this, data ?? {});
  return this.element;
}


toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
}

protected setText(element: HTMLElement, value: unknown) {
    if (element) {
        element.textContent = String(value);
    }
}

setDisabled(element: HTMLElement, state: boolean) {
    if (element) {
        if (state) element.setAttribute('disabled', 'disabled');
        else element.removeAttribute('disabled');
    }
}

protected setHidden(element: HTMLElement) {
    element.style.display = 'none';
}

protected setVisible(element: HTMLElement) {
    element.style.removeProperty('display');
}
}
