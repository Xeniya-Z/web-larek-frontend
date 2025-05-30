import { Api, ApiListResponse } from '../base/api';
import { IOrderData, IOrderResult, IProductData } from '../../types/index';

// интерфейс API клиента
export interface IProductsAPI {
  getProductList: () => Promise<IProductData[]>;
  getProduct: (id: string) => Promise<IProductData>;
  orderProducts: (order: IOrderData) => Promise<IOrderResult>;
};

export class ProductsAPI extends Api implements IProductsAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProduct(id: string): Promise<IProductData> {
        return this.get(`/product/${id}`).then(
            (item: IProductData) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getProductList(): Promise<IProductData[]> {
        return this.get('/product').then((data: ApiListResponse<IProductData>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderProducts(order: IOrderData): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}