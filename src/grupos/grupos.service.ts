import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_grupos`,
    );
    return resultQuery;
  }

  async findByIdGrupo(id: number): Promise<GrupoDTO> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_grupos WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }

  async insertNewGrupo(grupoDTO: GrupoDTO): Promise<void> {
    const { nombre } = grupoDTO;
    const query = `INSERT INTO e_commerce_grupos(nombre) VALUES (?)`;

    return await this.dataSource.query(query, [nombre]);
  }

  async updateGrupo(id: number, grupoDTO: GrupoDTO): Promise<GrupoDTO> {
    const { nombre } = grupoDTO;
    const query = `UPDATE e_commerce_grupos set nombre = ? where id = ?`;

    return await this.dataSource.query(query, [nombre, id]);
  }

  async deleteGrupo(id: number): Promise<void> {
    const resultQuery = await this.dataSource.query(
      `DELETE from e_commerce_grupos WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }
}