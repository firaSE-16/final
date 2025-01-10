import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './file-upload/file-upload.service'; // Import your file upload service

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileUploadService: FileUploadService, // Inject the file upload service
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../uploads/images', // Set the folder for storing images
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    // File validation before proceeding
    if (file && !this.fileUploadService.validateFileType(file)) {
      throw new HttpException('Invalid file type. Only image files are allowed', HttpStatus.BAD_REQUEST);
    }

    // If the file is valid, set the image field in the DTO
    if (file) {
      createProductDto.image = `/uploads/images/${file.filename}`;
    }

    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get('/categories')
  async getCategories(): Promise<string[]> {
    return this.productService.getCategories();
  }

  @Get('/category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.productService.findByCategory(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
