import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserLoginDTO } from './dto/LoginDto';

@Injectable()
export class LoginService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async signIn(correo: string, password: string): Promise<UserLoginDTO> {
    const user = await this.dataSource.query(
      `SELECT * from e_commerce_usuarios WHERE correo = ?`,
      [correo],
    );

    console.log('user => ', user);

    //verificar si el arreglo está vacío o si contiene el usuario esperado
    if (user.length === 0) {
      throw new UnauthorizedException();
    }
    // Compara la contraseña
    if (user[0].password !== password) {
      throw new UnauthorizedException();
    }

    // eliminar solo los campos que necesitas
    const { password: _, ...result } = user[0];

    return result;
  }
}
