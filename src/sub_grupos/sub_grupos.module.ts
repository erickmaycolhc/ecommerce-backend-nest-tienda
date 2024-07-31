import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub_GruposController } from './sub_grupos.controller';
import { Sub_GruposService } from './sub_grupos.service';
//funciones que se aplican a clases, métodos o propiedades y modifican su comportamiento.

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [Sub_GruposService],
  controllers: [Sub_GruposController],
})
export class Sub_GruposModule {}
