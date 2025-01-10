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
var OrderController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
let OrderController = OrderController_1 = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.logger = new common_1.Logger(OrderController_1.name);
    }
    async create(createOrderDto) {
        try {
            const order = await this.orderService.create(createOrderDto);
            return {
                status: common_1.HttpStatus.CREATED,
                message: 'Order created successfully',
                order,
            };
        }
        catch (error) {
            this.logger.error('Error creating order:', error);
            throw new common_1.InternalServerErrorException('Unable to create order. Please try again.');
        }
    }
    async findAll() {
        try {
            const orders = await this.orderService.findAll();
            return { status: common_1.HttpStatus.OK, orders };
        }
        catch (error) {
            this.logger.error('Error retrieving orders:', error);
            throw new common_1.InternalServerErrorException('Unable to fetch orders. Please try again.');
        }
    }
    async findOne(id) {
        try {
            const order = await this.orderService.findOne(id);
            return { status: common_1.HttpStatus.OK, order };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error retrieving order with ID "${id}":`, error);
            throw new common_1.InternalServerErrorException('Unable to fetch the order. Please try again.');
        }
    }
    async update(id, updateOrderDto) {
        try {
            const updatedOrder = await this.orderService.update(id, updateOrderDto);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Order updated successfully',
                updatedOrder,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error updating order with ID "${id}":`, error);
            throw new common_1.InternalServerErrorException('Unable to update the order. Please try again.');
        }
    }
    async remove(id) {
        try {
            await this.orderService.remove(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error deleting order with ID "${id}":`, error);
            throw new common_1.InternalServerErrorException('Unable to delete the order. Please try again.');
        }
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "remove", null);
exports.OrderController = OrderController = OrderController_1 = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map