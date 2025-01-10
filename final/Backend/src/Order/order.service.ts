import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schema/order.schema';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const newOrder = new this.orderModel(createOrderDto);
      return await newOrder.save();
    } catch (error) {
      this.logger.error('Error creating order:', error);
      throw new InternalServerErrorException(
        'Could not create order. Please try again later.'
      );
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderModel
        .find()
        .populate('products.productId') // Populate productId reference
        .exec();
    } catch (error) {
      this.logger.error('Error fetching orders:', error);
      throw new InternalServerErrorException(
        'Could not fetch orders. Please try again later.'
      );
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.orderModel
        .findById(id)
        .populate('products.productId') // Populate productId reference
        .exec();
      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
      return order;
    } catch (error) {
      this.logger.error(`Error fetching order with ID "${id}":`, error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
            'Could not fetch the order. Please try again later.'
          );
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(id, updateOrderDto, { new: true })
        .exec();
      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
      return updatedOrder;
    } catch (error) {
      this.logger.error(`Error updating order with ID "${id}":`, error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
            'Could not update the order. Please try again later.'
          );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.orderModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
    } catch (error) {
      this.logger.error(`Error deleting order with ID "${id}":`, error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
            'Could not delete the order. Please try again later.'
          );
    }
  }
}
