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
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_sub_grupos`,
    );
    return resultQuery;
  }

  async findByIdSub_grupo(id: number): Promise<Sub_GrupoDTO> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_sub_grupos WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }

  async insertNewSub_grupo(sub_grupoDTO: Sub_GrupoDTO): Promise<void> {
    const { nombre, grupo_id } = sub_grupoDTO;
    const query = `INSERT INTO e_commerce_sub_grupos(nombre, grupo_id) VALUES (?, ?)`;

    return await this.dataSource.query(query, [nombre, grupo_id]);
  }

  async updateSub_grupo(
    id: number,
    sub_grupoDTO: Sub_GrupoDTO,
  ): Promise<Sub_GrupoDTO> {
    const { nombre, grupo_id } = sub_grupoDTO;
    const query = `UPDATE e_commerce_sub_grupos set nombre = ?, grupo_id = ? where id = ?`;

    return await this.dataSource.query(query, [nombre, grupo_id, id]);
  }

  async deleteSub_grupo(id: number): Promise<void> {
    const resultQuery = await this.dataSource.query(
      `DELETE from e_commerce_sub_grupos WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }
}
