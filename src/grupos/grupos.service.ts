import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GrupoDTO } from './dto/GrupoDTO';

@Injectable()
export class GruposService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllGrupos(): Promise<GrupoDTO[]> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_grupos`,
      );

      if (!resultQuery.length) {
        throw new HttpException('No grupos found', HttpStatus.NOT_FOUND);
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching grupos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdGrupo(id: number): Promise<GrupoDTO> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_grupos WHERE id = ?`,
        [id],
      );

      if (!resultQuery.length) {
        throw new HttpException('No grupo found', HttpStatus.NOT_FOUND);
      }

      return resultQuery[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching Grupo',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insertNewGrupo(grupoDTO: GrupoDTO): Promise<void> {
    const { nombre, url } = grupoDTO;
    if (!nombre || !url === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `INSERT INTO e_commerce_grupos(nombre, url) VALUES (?, ?)`;

    try {
      return await this.dataSource.query(query, [nombre, url]);
    } catch (error) {
      // ER_DUP_ENTRY = Se ha producido un intento de insertar un valor duplicado en una columna
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'El grupo ya existe.',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al insertar el grupo.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateGrupo(id: number, grupoDTO: GrupoDTO): Promise<GrupoDTO> {
    const { nombre, url } = grupoDTO;
    if (!nombre || !url === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `UPDATE e_commerce_grupos set nombre = ?, url = ? where id = ?`;

    try {
      const updateGrupo = await this.dataSource.query(query, [nombre, url, id]);
      if (updateGrupo.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Grupo not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return updateGrupo;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Duplicate entry for Grupo',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error updating Grupo in the database',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteGrupo(id: number): Promise<void> {
    try {
      const resultQuery = await this.dataSource.query(
        `DELETE from e_commerce_grupos WHERE id = ?`,
        [id],
      );

      if (resultQuery.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Grupo not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting grupo',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
