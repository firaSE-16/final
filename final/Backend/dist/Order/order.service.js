"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schema/order.schema");
let OrderService = OrderService_1 = class OrderService {
    constructor(orderModel) {
        this.orderModel = orderModel;
        this.logger = new common_1.Logger(OrderService_1.name);
    }
    async create(createOrderDto) {
        try {
            const newOrder = new this.orderModel(createOrderDto);
            return await newOrder.save();
        }
        catch (error) {
            this.logger.error('Error creating order:', error);
            throw new common_1.InternalServerErrorException('Could not create order. Please try again later.');
        }
    }
    async findAll() {
        try {
            return await this.orderModel
                .find()
                .populate('products.productId')
                .exec();
        }
        catch (error) {
            this.logger.error('Error fetching orders:', error);
            throw new common_1.InternalServerErrorException('Could not fetch orders. Please try again later.');
        }
    }
    async findOne(id) {
        try {
            const order = await this.orderModel
                .findById(id)
                .populate('products.productId')
                .exec();
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
            }
            return order;
        }
        catch (error) {
            this.logger.error(`Error fetching order with ID "${id}":`, error);
            throw error instanceof common_1.NotFoundException
                ? error
                : new common_1.InternalServerErrorException('Could not fetch the order. Please try again later.');
        }
    }
    async update(id, updateOrderDto) {
        try {
            const updatedOrder = await this.orderModel
                .findByIdAndUpdate(id, updateOrderDto, { new: true })
                .exec();
            if (!updatedOrder) {
                throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
            }
            return updatedOrder;
        }
        catch (error) {
            this.logger.error(`Error updating order with ID "${id}":`, error);
            throw error instanceof common_1.NotFoundException
                ? error
                : new common_1.InternalServerErrorException('Could not update the order. Please try again later.');
        }
    }
    async remove(id) {
        try {
            const result = await this.orderModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
            }
        }
        catch (error) {
            this.logger.error(`Error deleting order with ID "${id}":`, error);
            throw error instanceof common_1.NotFoundException
                ? error
                : new common_1.InternalServerErrorException('Could not delete the order. Please try again later.');
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderService);
//# sourceMappingURL=order.service.js.map