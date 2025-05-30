import './scss/styles.scss';
import { ProductsAPI } from './components/api/ProductsApi';
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/view/BasketView';
import { BasketItemView } from './components/view/BasketItemView';
import { Form } from './components/view/Form';
import { Modal } from './components/view/modal';
import { Page } from './components/view/Page';
import { Product } from './components/model/ProductModel';
import { ProductView } from './components/view/ProductView';
import { ProductPreview } from './components/view/ProductPreview';
import { Success } from './components/view/Success';
import { ensureElement, cloneTemplate } from './utils/utils';
import { AppState } from './components/AppState';
import { IProduct, IClientData } from "./types/index";

//шаблоны
const pageContainer = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLElement>('.modal');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderFormOneTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTwoTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// клонирование шаблонов для компонентов
const orderFormOne = cloneTemplate<HTMLFormElement>(orderFormOneTemplate);
const orderFormTwo = cloneTemplate<HTMLFormElement>(contactsFormTwoTemplate);
const successElement = cloneTemplate<HTMLElement>(successTemplate);

const basketContainer = basketTemplate.content.querySelector('.basket') as HTMLElement;
const basketList = basketContainer.querySelector('.basket__list') as HTMLElement;

// создаем объекты
const events = new EventEmitter();
const app = new AppState(events);
const page = new Page(pageContainer, { events });
const api = new ProductsAPI(CDN_URL, API_URL);
const modal = new Modal(modalContainer, { events });
const basketView = new BasketView(basketContainer, { events });
const orderFormView = new Form<IClientData>(orderFormOne, { events });
const orderFormViewTwo = new Form<IClientData>(orderFormTwo, { events });
const successView = new Success(successElement, {
  onClick: () => {
    modal.close();
  }
});

// чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// загружаем товары с апи
api.getProductList()
  .then((productDataList) => {
    const items = productDataList.map(item => new Product(item));
    app.setItems(items);
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
});

// обновляем каталог на странице при изменении списка товаров
events.on('items:changed', (data: {items: IProduct[]}) => {
  const productViews = data.items.map(item => new ProductView(item, { events }));
  const productElements = productViews.map(view => view.getElement());

  page.render({
    catalog: productElements,
    counter: 0
  });
});

// открываем карточку товара в модальном окне при его выборе(превью)
events.on('product:select', async (data: { id: string }) => {
  try {
    const product = await app.getItem(data.id);
    const isInBasket = app.basket.items.has(product.id);
    const priceIsInvalid = product.priceValue == null || product.priceValue === 0;

    const preview = new ProductPreview(product, { events });

    if (isInBasket || priceIsInvalid) {
      preview.disableButton(isInBasket ? 'Товар уже в корзине' : 'Товар недоступен для покупки');
    }

    modal.render({ content: preview.getElement() });
  } catch (err) {
    console.error('Ошибка открытия карточки:', err);
  }
});

// добавляем товар в корзину по его id
events.on('basket:add', (data: { id: string }) => {
  app.basket.addItem(data.id);
});

// обновляем counter на странице и закрываем модальное окно
events.on('basket:itemAdded', (data: { id: string }) => {
  page.counter = app.basket.items.size;

  modal.close();
});

// обновляем counter после удаления из корзины
events.on('basket:itemRemoved', () => {
  page.counter = app.basket.items.size;
});

// открываем корзину: очищаем список и добавляем элементы товаров из корзины(отрисовка)
events.on('bids:open', async () => {
  basketList.innerHTML = '';
  
  const itemsElements = Array.from(app.basket.items).map((itemId, index) => {
    const product = app.items.find(item => item.id === itemId);

    const itemTemplate = cloneTemplate<HTMLElement>(basketItemTemplate);
    const view = new BasketItemView(itemTemplate as HTMLElement, { events });
  
    const element = view.render({
      id: product.id,
      title: product.title,
      priceValue: product.priceValue,
      index,
    });

    basketList.appendChild(element);
    return element;
  });

  basketView.items = itemsElements;
  basketView.selected = Array.from(app.basket.items);
  basketView.total = app.basket.getTotalPrice(app.items);

  try {
    modal.render({ content: basketView.getElement() });
  } catch (err) {
    console.error('Ошибка открытия корзины:', err);
  }
});

// удаляем товар
events.on('basket:remove', (data: { id: string }) => {
  app.basket.removeItem(data.id);
  events.emit('bids:open');
});

// оформление заказа: шаг 1
// открываем первую форму оформления заказа
events.on('order:open', () => {
  if (app.basket.items.size === 0) {
    return;
  }
  modal.render({ content: orderFormOne });
});

// подписываемся на изменение ошибок
events.on('formErrors:change', (errors) => {
	orderFormView.errors = errors;
});

// событие выбора адреса
events.on('order.address:change', (data: { field: string; value: string }) => {
	app.order.clientData.address = data.value;
	const isValid = app.order.validateStepOne();
	orderFormView.valid = isValid;
  orderFormView.errors = { address: app.order.formErrors.address ?? '' };

});

// событие выбор оплаты
events.on('order.payment:change', (data: { field: string; value: 'card' | 'cash' }) => {
	app.order.clientData.payment = data.value;
	const isValid = app.order.validateStepOne();
	orderFormView.valid = isValid;
  orderFormView.errors = { payment: app.order.formErrors.payment ?? '' };

});

// оформление заказа: шаг 2
// открываем вторую форму оформления заказа
events.on('order:submit', () => {
  if (app.order.validateStepOne()) {
    // Рендерим второй шаг, передаём в него clientData
    modal.render({
      content: orderFormViewTwo.render({
        ...app.order.clientData,
        valid: true,
        errors: []
      })
    });
    orderFormViewTwo.valid = app.order.validateStepTwo();
  }
});

// событие выбор телефона
events.on('contacts.phone:change', (data: {field: string, value: string}) => {
  app.order.clientData.phone = data.value;
  orderFormViewTwo.valid = app.order.validateStepTwo();
  orderFormViewTwo.errors = { phone: app.order.formErrors.phone ?? '' };
});

// событие выбора имейла
events.on('contacts.email:change', (data: {field: string, value: string}) => {
  app.order.clientData.email = data.value;
  orderFormViewTwo.valid = app.order.validateStepTwo();

  orderFormViewTwo.errors = { email: app.order.formErrors.email ?? '' };
});

// подтверждаем контактные данные, формируем заказ для последующей отправки данных
events.on('contacts:submit', () => {
  if (app.order.validateStepTwo()) {
    const total = app.basket.getTotalPrice(app.items);
    //собираем данные для заказа
    app.setOrder(app.order.clientData); 
    // получаем собранные данные
    const orderData = app.getOrderData();

    successView.render({ total });
    modal.render({ content: successElement });

    app.basket.clear();
    page.counter = 0;

  } else {
    const errors = app.order.formErrors;
    orderFormViewTwo.errors = {
      phone: errors.phone ?? '',
      email: errors.email ?? '',
    };    
  }
});
