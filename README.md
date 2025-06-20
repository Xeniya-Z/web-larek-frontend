# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Архитектура проекта

Приложение разделено на несколько основных уровней:

- Модель (Model) — отвечает за хранение и обработку данных. Реализована через абстрактный класс Model и конкретные классы состояния.

- Представление (View) — отвечает за визуализацию и взаимодействие с пользователем.

- Контроллер / Брокер событий (EventEmitter) — обеспечивает связь между моделью и представлением через события.

Архитектура построена по принципу MVP (Model–View–Presenter). Взаимодействие между компонентами осуществляется через события и абстрактные базовые классы.


### Базовые классы


**Абстрактный класс Model**

Model - базовый абстрактный класс для всех моделей приложения. 


Конструктор: `constructor(data: Partial<T>, events: IEvents)`
Принимает часть данных модели и объект событийного брокера, реализующего интерфейс IEvents. 


Содержит метод emitChanges для уведомления об изменении данных через EventEmitter.



**Абстрактный класс View<T>**

View<T> - базовый класс для всех отображений: принимает корневой DOM-элемент и настройки, содержит метод render для отображения данных, список событий и брокер событий для взаимодействия с другими частями приложения.


Конструктор: `(root: HTMLElement, settings: S): IView<T>`
Принимает клонированный шаблон или существующий элемент,a также настройки для отображения


Особенности:

- Хранит корневой DOM-элемент

- Метод render(data: T): HTMLElement для отрисовки содержимого

- Метод copy() для клонирования компонента

- Используется как базовый класс для всех визуальных компонентов.




**Класс EventEmitter**

Класс EventEmitter обеспечивает работу с событиями внутри приложения. Реализует паттерн «наблюдатель» (Observer), позволяющий организовать асинхронное взаимодействие между компонентами приложения. Он предоставляет методы для подписки на события, их эмитации и управления подписчиками.

Конструктор: без параметров.


Особенности:

- Установка (on) и удаление (off) слушателей событий

- Инициация событий с передачей данных (emit)

- Подписка на все события (onAll)

- Сброс всех подписчиков (offAll)

- Генерация коллбека для автоматической отправки события (trigger).



**Класс AppState**

AppState — основной класс для управления состоянием приложения. Он хранит данные о товарах, корзине и заказе, а также обеспечивает взаимодействие с событиями через механизм событийного брокера.


Конструктор: `constructor(events: IEvents)`
Принимает объект событийного брокера, реализующий интерфейс IEvents.


Содержит методы:

- setItems(items: IProduct[]): void
Обновляет список товаров и генерирует событие 'items:changed' с обновлёнными товарами.

- async getItem(id: string): Promise<IProduct>
Возвращает товар по ID. Если товар не найден — выбрасывает ошибку.

- setOrder(clientData: IClientData): void
Формирует данные заказа на основе данных клиента и содержимого корзины, обновляет модель заказа и генерирует событие 'order:changed'.

- getOrderData(): ReturnType<IOrderModel['getOrderData']>
Возвращает текущие данные заказа.


Свойства:
- items: IProduct[] — массив доступных товаров.

- basket: IBasketModel — объект модели корзины, управляющий добавлением, удалением и подсчётом товаров.

- order: IOrderModel — объект модели заказа, хранящий данные клиента и содержимое заказа.



**Класс Api**

Api — класс, реализующий взаимодействие с серверным API. Отвечает за формирование и отправку HTTP-запросов, а также обработку ответов.


Конструктор `constructor(baseUrl: string, options: RequestInit = {})`
Принимает базовый URL и глобальные опции для всех запросов(опционально).


Особенности:

- Хранит базовый URL для всех запросов

- Настраивает общие заголовки, включая Content-Type: application/json

- Поддерживает методы GET, POST, PUT и DELETE

- Автоматически преобразовывает данные в JSON при отправке

- Метод handleResponse(response: Response): Promise<any> обрабатывает ответ сервера, преобразует его в JSON или выбрасывает ошибку при неуспешном ответе.

- Обрабатывает ответы сервера, парсит JSON и выбрасывает ошибки при неуспешных статусах.



**Класс FormErrors**

FormErrors управляет ошибками, которые возникают при заполнении формы заказа. Он хранит список ошибок для каждого поля и уведомляет пользователя о необходимости исправить данные.


Конструктор: `constructor(data: Partial<IFormErrors>, events: IEvents)`
Принимает частичные данные ошибок и объект событийного брокера, реализующего интерфейс IEvents.


Методы:

- validateOrder(): boolean — проверяет заполненность обязательных полей (email, телефон, адрес), обновляет formErrors и генерирует событие 'formErrors:change'. Возвращает true, если ошибок нет.

- clearErrors(): void — очищает список ошибок и генерирует событие 'formErrors:change'.


Свойства:

- order: IOrderData — объект с текущими данными заказа, включая клиентские данные.

- formErrors: Partial<Record<keyof IClientData, string>> — объект с текстами ошибок по полям (email, phone, address и т.д.).



**Класс BasketModel**

BasketModel управляет корзиной покупок. Он позволяет добавлять товары в корзину, удалять их и рассчитывать общую стоимость.


Конструктор: `constructor(events: IEvents, data?: Partial<IBasketModel>)`
Принимает объект событийного брокера и необязательные начальные данные модели.


Свойства:

- items: Set<string> — множество ID товаров в корзине (без дубликатов)


Методы:

- addItem: Добавляет товар в корзину

- removeItem: Удаляет товар из корзины

- getTotalPrice: Рассчитывает общую стоимость товаров в корзине

- getItems: возвращает массив ID товаров из корзины

- clear: очищает корзину.




**Класс OrderModel**

OrderModel управляет данными заказа, включая список товаров, данные клиента, общую стоимость и ошибки валидации. Позволяет проверять корректность введённых данных на разных шагах оформления заказа и получать итоговые данные заказа.


Конструктор `constructor(events: IEvents, data?: Partial<IOrderModel>)`
Принимает объект событийного брокера и необязательные начальные данные модели.


Свойства:

- items: массив ID товаров в заказе.

- clientData: данные клиента (email, телефон, адрес, способ оплаты).

- total: общая стоимость заказа.

- formErrors: объект с ошибками валидации по полям клиента.


Методы:

- validateStepOne(): проверяет обязательные поля для первого шага (адрес и способ оплаты), обновляет formErrors. Возвращает true, если ошибок нет.

- validateStepTwo(): проверяет обязательные поля второго шага (телефон и email), включая формат, обновляет formErrors. Возвращает true, если ошибок нет.

- getOrderData(): возвращает текущие данные заказа.



**Класс Product**

Product представляет данные одного товара. Он хранит основные свойства товара и подготавливает отображаемое значение цены.


Конструктор `constructor(data: IProductData)`
Принимает объект с данными товара и инициализирует свойства.


Свойства:

- id: уникальный идентификатор товара.

- description: описание товара.

- image: URL изображения товара.

- title: название товара.

- category: категория товара.

- priceText: цена в виде строки, подготовленная для отображения (например, «100 синапсов» или «Бесценно»)

- priceValue: числовое значение цены для расчетов (null, если цена отсутствует)



**Класс Page**

Page управляет визуальным представлением страницы. Он отображает список с карточками товаров и количество уже добавленных товаров в корзине.


Конструктор `constructor(container: HTMLElement, settings: IViewSettings)`
Принимает корневой HTML-элемент страницы и объект настроек, содержащий событийный брокер, реализующий интерфейс IEvents.


Свойства:

- counter — количество товаров в корзине, отображается в иконке корзины

- catalog — список карточек товаров, отображаемых в каталоге.

- locked — состояние блокировки страницы 


Методы:

- render: обновляет отображение страницы в соответствии с переданными данными.


**Класс Modal**

Modal отвечает за отображение и управление модальным окном, которое используется для предпросмотра товара с его полным описанием или оформления заказа.


Конструктор `container: HTMLElement, settings: IViewSettings`
Принимает контейнер модального окна и объект настроек, содержащий событийный брокер, реализующий интерфейс IEvents.


Свойства:

- protected _closeButton: HTMLButtonElement — кнопка закрытия модального окна

- protected _content: HTMLElement — контейнер для динамически вставляемого содержимого

- protected events: IEvents — объект для работы с глобальными событиями

- protected container: HTMLElement (унаследовано от Component) — корневой DOM-элемент компонента


Сеттеры:

- set content(value: HTMLElement): void — заменяет содержимое модального окна на переданный элемент


Методы:

- open(): void — открывает модальное окно, добавляя класс modal_active и отправляя событие modal:open

- close(): void — закрывает модальное окно, очищает содержимое и отправляет событие modal:close

- render(data: IModalData): HTMLElement — отображает переданные данные, автоматически открывает модальное окно и возвращает контейнер



### Компоненты и их назначение



**Компонент: BasketItemView**

Отображает один товар в корзине. Получает данные о товаре (IBasketItemView) и отображает его название, цену и порядковый номер в списке.
Реагирует на клик по кнопке удаления: запускает событие basket:remove с id товара для удаления его из корзины.



**Компонент: BasketView**

Отвечает за отображение корзины с выбранными товарами. Получает список элементов, общую стоимость и список выбранных ID товаров. Отображает либо список товаров, либо сообщение о пустой корзине.

Реагирует на клик по кнопке оформления заказа: испускает событие order:open.



**Компонент Form**

Компонент Form управляет отображением и поведением HTML-формы, включая ввод данных, валидацию, отображение ошибок и выбор способа оплаты.



**Компонент: Success**

Отображает сообщение об успешном оформлении заказа. Получает данные об итоговой сумме заказа (ISuccess) и отображает сообщение с числом списанных синапсов.

Реагирует на клик по кнопке закрытия окна: вызывает переданный обработчик onClick, позволяя закрыть модальное окно или перейти к следующему действию.