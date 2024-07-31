import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosServices } from './productos.service';

//funciones que se aplican a clases, métodos o propiedades y modifican su comportamiento.

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [ProductosServices],
  controllers: [ProductosController],
})
export class ProductosModule {}
