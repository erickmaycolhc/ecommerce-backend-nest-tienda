import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductosServices } from './productos.service';
import { ProductoDTO } from './dto/ProductoDTO';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosServices) {}

  @Get()
  findAllProductos() {
    return this.productosService.findAllProductos();
  }

  @Get('/:id')
  findByIdProducto(@Param('id') id: number) {
    return this.productosService.findByIdProducto(id);
  }

  @Post()
  insertNewProducto(@Body() productoDTO: ProductoDTO) {
    return this.productosService.insertNewProducto(productoDTO);
  }

  @Put('/producto/:id')
  updateProducto(@Param('id') id: number, @Body() productoDTO: ProductoDTO) {
    return this.productosService.updateProducto(id, productoDTO);
  }

  @Delete('/:id')
  deleteProducto(@Param('id') id: number) {
    return this.productosService.deleteProducto(id);
  }
}
