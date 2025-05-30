import { View } from "../base/View";
import { IViewSettings } from "../../types";
import { ensureElement, ensureAllElements } from "../../utils/utils";

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends View<IViewSettings, IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

    private _valid = false;

	constructor(protected element: HTMLFormElement, settings: IViewSettings) {
		super(element, settings);

		this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.element);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.element);

		this.element.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.element.addEventListener('submit', (e: Event) => {
			console.log(`${this.element.name}:submit`);
			e.preventDefault();
			this.settings.events.emit(`${this.element.name}:submit`);
		});

		const paymentButtons = ensureAllElements<HTMLButtonElement>(
			'button[name="card"], button[name="cash"]',
			this.element
		);

		paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const selected = button.name as 'cash' | 'card';

				paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');

				this.settings.events.emit('order.payment:change', {
					field: 'payment',
					value: selected,
				});
			});
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.settings.events.emit(`${this.element.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
        this._valid = value;
		this._submit.disabled = !value;
	}

  get valid(): boolean {
      return this._valid;
  }

	set errors(value: Partial<Record<keyof T, string>>) {
		const messages = Object.values(value).filter(Boolean);
		this.setText(this._errors, messages.join('\n'));
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.element;
	}
}
