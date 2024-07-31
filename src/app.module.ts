import { Module } from '@nestjs/common';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { GruposModule } from './grupos/grupos.module';
import { Sub_GruposModule } from './sub_grupos/sub_grupos.module';
import { ProductosModule } from './productos/productos.module';
import { Venta_de_pedidosModule } from './venta_de_pedidos/venta_de_pedidos.module';
import { Detalle_ventasModule } from './detalle_ventas/detalle_ventas.module';
import { LoginModule } from './auth/login/login.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_MYSQL_HOST,
      port: +process.env.DB_MYSQL_PORT,
      username: process.env.DB_MYSQL_USERNAME,
      password: process.env.DB_MYSQL_PASSWORD,
      database: process.env.DB_MYSQL_NAME_DB,
      autoLoadEntities: false,
      synchronize: false,
    }),
    LoginModule,
    UsuariosModule,
    GruposModule,
    Sub_GruposModule,
    ProductosModule,
    Venta_de_pedidosModule,
    Detalle_ventasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
