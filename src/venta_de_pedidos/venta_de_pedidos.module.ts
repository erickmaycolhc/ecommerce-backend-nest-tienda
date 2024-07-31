import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta_de_pedidosController } from './venta_de_pedidos.controller';
import { Venta_de_pedidosService } from './venta_de_pedidos.service';

//funciones que se aplican a clases, métodos o propiedades y modifican su comportamiento.

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [Venta_de_pedidosService],
  controllers: [Venta_de_pedidosController],
})
export class Venta_de_pedidosModule {}
