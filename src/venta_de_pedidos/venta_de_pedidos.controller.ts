import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Venta_de_pedidoDTO, VentaDto } from './dto/Venta_de_pedidoDTO';
import { Venta_de_pedidosService } from './venta_de_pedidos.service';

@Controller('venta/pedidos')
export class Venta_de_pedidosController {
  constructor(
    private readonly venta_de_pedidosService: Venta_de_pedidosService,
  ) {}

  @Get()
  findAllVenta_de_pedidos() {
    return this.venta_de_pedidosService.findAllVenta_de_pedidos();
  }

  @Get('/boleta/:id_orden')
  Boleta(@Param('id_orden') id_orden: number) {
    return this.venta_de_pedidosService.Boleta(id_orden);
  }

  @Get('/:id_orden')
  findByIdVenta_de_pedido(@Param('id_orden') id_orden: number) {
    return this.venta_de_pedidosService.findByIdVenta_de_pedido(id_orden);
  }

  @Post()
  saveVenta(@Body() ventaDTO: VentaDto) {
    return this.venta_de_pedidosService.saveVenta(ventaDTO);
  }

  @Delete('/:id')
  deleteVenta_de_pedido(@Param('id') id: number) {
    return this.venta_de_pedidosService.deleteVenta_de_pedido(id);
  }
}
