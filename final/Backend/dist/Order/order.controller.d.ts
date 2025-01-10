import { HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrderController {
    private readonly orderService;
    private readonly logger;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<{
        status: HttpStatus;
        message: string;
        order: import("./schema/order.schema").Order;
    }>;
    findAll(): Promise<{
        status: HttpStatus;
        orders: import("./schema/order.schema").Order[];
    }>;
    findOne(id: string): Promise<{
        status: HttpStatus;
        order: import("./schema/order.schema").Order;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        status: HttpStatus;
        message: string;
        updatedOrder: import("./schema/order.schema").Order;
    }>;
    remove(id: string): Promise<void>;
}
