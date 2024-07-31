import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Detalle_ventasService } from './detalle_ventas.service';
import { Detalle_VentaDTO } from './dto/Detalle_ventaDTO';

@Controller('detalle_ventas')
export class Detalle_ventasController {
  constructor(private readonly detalle_ventasService: Detalle_ventasService) {}

  @Get()
  findAllDetalle_ventas() {
    return this.detalle_ventasService.findAllDetalle_ventas();
  }

  @Get('/:id')
  findByIdDetalle_venta(@Param('id') id: number) {
    return this.detalle_ventasService.findByIdDetalle_venta(id);
  }

  @Post()
  insertNewDetalle_venta(@Body() detalle_VentaDTO: Detalle_VentaDTO) {
    return this.detalle_ventasService.insertNewDetalle_venta(detalle_VentaDTO);
  }

  @Put('/detalle_venta/:id')
  updateDetalle_venta(
    @Param('id') id: number,
    @Body() detalle_VentaDTO: Detalle_VentaDTO,
  ) {
    return this.detalle_ventasService.updateDetalle_venta(id, detalle_VentaDTO);
  }

  @Delete('/:id')
  deleteDetalle_venta(@Param('id') id: number) {
    return this.detalle_ventasService.deleteDetalle_venta(id);
  }
}
