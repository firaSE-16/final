import { OrderState } from '../schema/order.schema';
declare class ProductDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerEmail: string;
    address: string;
    state?: OrderState;
    products: ProductDto[];
}
export {};
