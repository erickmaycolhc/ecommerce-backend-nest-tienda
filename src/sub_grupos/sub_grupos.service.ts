import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Sub_GrupoDTO } from './dto/UsuarioDTO';

@Injectable()
export class Sub_GruposService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllSub_grupos(): Promise<Sub_GrupoDTO[]> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_sub_grupos`,
      );

      if (!resultQuery.length) {
        throw new HttpException('No Sub_grupos found', HttpStatus.NOT_FOUND);
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          stauts: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching sub_grupos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdSub_grupo(id: number): Promise<Sub_GrupoDTO> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_sub_grupos WHERE id = ?`,
        [id],
      );

      if (!resultQuery.length) {
        throw new HttpException('No sub_grupo found', HttpStatus.NOT_FOUND);
      }

      return resultQuery[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching sub_grupo',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insertNewSub_grupo(sub_grupoDTO: Sub_GrupoDTO): Promise<void> {
    const { nombre, grupo_id, url } = sub_grupoDTO;
    if (!nombre || !grupo_id || !url === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `INSERT INTO e_commerce_sub_grupos(nombre, grupo_id, url) VALUES (?, ?, ?)`;
    try {
      return await this.dataSource.query(query, [nombre, grupo_id, url]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'El sub_grupo ya existe.',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al insertar el sub_grupo.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateSub_grupo(
    id: number,
    sub_grupoDTO: Sub_GrupoDTO,
  ): Promise<Sub_GrupoDTO> {
    const { nombre, grupo_id, url } = sub_grupoDTO;
    if (!nombre || !grupo_id || !url === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `UPDATE e_commerce_sub_grupos set nombre = ?, grupo_id = ?, url = ? where id = ?`;

    try {
      const updateSub_grupo = await this.dataSource.query(query, [
        nombre,
        grupo_id,
        url,
        id,
      ]);
      if (updateSub_grupo.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'sub_grupo  not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return updateSub_grupo;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Duplicate entry for sub_grupo ',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error updating sub_grupo  in the database',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteSub_grupo(id: number): Promise<void> {
    try {
      const resultQuery = await this.dataSource.query(
        `DELETE from e_commerce_sub_grupos WHERE id = ?`,
        [id],
      );

      if (resultQuery.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'sub_grupo not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting sub_grupo',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
