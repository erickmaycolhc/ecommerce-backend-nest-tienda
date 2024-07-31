import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsuarioDTO } from './dto/UsuarioDTO';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllUsuarios(): Promise<UsuarioDTO[]> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_usuarios`,
    );
    return resultQuery;
  }

  async findByIdUsuario(id: number): Promise<UsuarioDTO> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_usuarios WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }

  async insertNewUsuario(usuarioDTO: UsuarioDTO): Promise<void> {
    const { nombre, correo, password, estado } = usuarioDTO;
    const fecha_creacion = usuarioDTO.fecha_creacion || new Date();
    const query = `INSERT INTO e_commerce_usuarios(nombre, correo,password ,fecha_creacion,estado) VALUES (?, ?, ?, ?, ?)`;

    return await this.dataSource.query(query, [
      nombre,
      correo,
      password,
      fecha_creacion,
      estado,
    ]);
  }

  async updateUsuario(id: number, usuarioDTO: UsuarioDTO): Promise<UsuarioDTO> {
    const { nombre, correo, password, estado } = usuarioDTO;
    const fecha_creacion = usuarioDTO.fecha_creacion || new Date();
    const query = `UPDATE e_commerce_usuarios set nombre= ?, correo = ?, password= ?, fecha_creacion = ?, estado= ? where id = ?`;

    return await this.dataSource.query(query, [
      nombre,
      correo,
      password,
      fecha_creacion,
      estado,
      id,
    ]);
  }

  async deleteUsuario(id: number): Promise<void> {
    const resultQuery = await this.dataSource.query(
      `DELETE from e_commerce_usuarios WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }
}
