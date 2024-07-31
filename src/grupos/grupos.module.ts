import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';

//funciones que se aplican a clases, métodos o propiedades y modifican su comportamiento.

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [GruposService],
  controllers: [GruposController],
})
export class GruposModule {}
