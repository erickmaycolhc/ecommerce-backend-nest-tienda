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
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_usuarios`,
      );

      if (!resultQuery.length) {
        throw new HttpException('No usuarios found', HttpStatus.NOT_FOUND);
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching usuarios',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdUsuario(id: number): Promise<UsuarioDTO> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_usuarios WHERE id = ?`,
        [id],
      );

      if (!resultQuery.length) {
        throw new HttpException('Usuario not found', HttpStatus.NOT_FOUND);
      }
      return resultQuery[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insertNewUsuario(usuarioDTO: UsuarioDTO): Promise<void> {
    const { nombre, correo, password, estado } = usuarioDTO;
    if (!nombre || !correo || !password || estado === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const fecha_creacion = usuarioDTO.fecha_creacion || new Date();
    const query = `INSERT INTO e_commerce_usuarios(nombre, correo,password ,fecha_creacion,estado) VALUES (?, ?, ?, ?, ?)`;

    try {
      return await this.dataSource.query(query, [
        nombre,
        correo,
        password,
        fecha_creacion,
        estado,
      ]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'El usuario ya existe.',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al insertar el usuario.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateUsuario(id: number, usuarioDTO: UsuarioDTO): Promise<UsuarioDTO> {
    const { nombre, correo, password, estado } = usuarioDTO;
    // Validación de los campos requeridos
    if (!nombre || !correo || !password || estado === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const fecha_creacion = usuarioDTO.fecha_creacion || new Date();
    const query = `UPDATE e_commerce_usuarios set nombre= ?, correo = ?, password= ?, fecha_creacion = ?, estado= ? where id = ?`;

    try {
      const result = await this.dataSource.query(query, [
        nombre,
        correo,
        password,
        fecha_creacion,
        estado,
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Usuario not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return usuarioDTO; // Devolver el objeto actualizado
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Duplicate entry for usuario',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error updating usuario in the database',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteUsuario(id: number): Promise<void> {
    try {
      const resultQuery = await this.dataSource.query(
        `DELETE from e_commerce_usuarios WHERE id = ?`,
        [id],
      );
      //Ninguna fila fue eliminada, lo que probablemente significa que no existe un usuario con ese id.
      if (resultQuery.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Usuario not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
