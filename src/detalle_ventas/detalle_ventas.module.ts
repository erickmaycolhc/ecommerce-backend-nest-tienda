import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detalle_ventasController } from './detalle_ventas.controller';
import { Detalle_ventasService } from './detalle_ventas.service';

//funciones que se aplican a clases, métodos o propiedades y modifican su comportamiento.

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [Detalle_ventasService],
  controllers: [Detalle_ventasController],
})
export class Detalle_ventasModule {}
