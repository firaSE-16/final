import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderState } from '../schema/order.schema';

class ProductDto {
  @IsMongoId() // Validates that the productId is a valid MongoDB ObjectId string
  @IsNotEmpty() // Ensures the productId is not empty
  productId: string;

  @IsNumber() // Validates that the quantity is a number
  @IsNotEmpty() // Ensures quantity is not empty
  quantity: number;
}

export class CreateOrderDto {
  @IsString() // Validates that the customerName is a string
  @IsNotEmpty() // Ensures the customerName is not empty
  customerName: string;

  @IsString() // Validates that the customerEmail is a string
  @IsNotEmpty() // Ensures the customerEmail is not empty
  customerEmail: string;

  @IsString() // Validates that the address is a string
  @IsNotEmpty() // Ensures the address is not empty
  address: string;

  @IsEnum(OrderState) // Ensures the state is a valid OrderState enum value
  @IsOptional() // Makes the state field optional
  state?: OrderState;

  @IsArray() // Validates that products is an array
  @ValidateNested({ each: true }) // Validates each item in the products array
  @Type(() => ProductDto) // Ensures each product item is transformed into ProductDto
  products: ProductDto[];
}
