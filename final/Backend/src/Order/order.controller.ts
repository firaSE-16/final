import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.create(createOrderDto);
      return {
        status: HttpStatus.CREATED,
        message: 'Order created successfully',
        order,
      };
    } catch (error) {
      this.logger.error('Error creating order:', error);
      throw new InternalServerErrorException(
        'Unable to create order. Please try again.'
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const orders = await this.orderService.findAll();
      return { status: HttpStatus.OK, orders };
    } catch (error) {
      this.logger.error('Error retrieving orders:', error);
      throw new InternalServerErrorException(
        'Unable to fetch orders. Please try again.'
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.orderService.findOne(id);
      return { status: HttpStatus.OK, order };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error retrieving order with ID "${id}":`, error);
      throw new InternalServerErrorException(
        'Unable to fetch the order. Please try again.'
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    try {
      const updatedOrder = await this.orderService.update(id, updateOrderDto);
      return {
        status: HttpStatus.OK,
        message: 'Order updated successfully',
        updatedOrder,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating order with ID "${id}":`, error);
      throw new InternalServerErrorException(
        'Unable to update the order. Please try again.'
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.orderService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting order with ID "${id}":`, error);
      throw new InternalServerErrorException(
        'Unable to delete the order. Please try again.'
      );
    }
  }
}
