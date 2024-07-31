import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from './login.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { LoginService } from './login.service';

//funciones que se aplican a clases, métodos o propiedades y modifican su comportamiento.

@Module({
  imports: [UsuariosModule],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
