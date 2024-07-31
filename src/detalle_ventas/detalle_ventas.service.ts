import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Detalle_VentaDTO } from './dto/Detalle_ventaDTO';

@Injectable()
export class Detalle_ventasService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllDetalle_ventas(): Promise<Detalle_VentaDTO[]> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_detalle_ventas`,
    );
    return resultQuery;
  }

  async findByIdDetalle_venta(id: number): Promise<Detalle_VentaDTO> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_detalle_ventas WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }

  async insertNewDetalle_venta(
    detalle_VentaDTO: Detalle_VentaDTO,
  ): Promise<void> {
    const { id_orden, producto_id, cantidad, precio_venta } = detalle_VentaDTO;
    const query = `INSERT INTO e_commerce_detalle_ventas(id_orden, producto_id ,cantidad, precio_venta) VALUES (?, ?, ?, ?)`;

    return await this.dataSource.query(query, [
      id_orden,
      producto_id,
      cantidad,
      precio_venta,
    ]);
  }

  async updateDetalle_venta(
    id: number,
    detalle_VentaDTO: Detalle_VentaDTO,
  ): Promise<Detalle_VentaDTO> {
    const { cantidad, precio_venta } = detalle_VentaDTO;
    const query = `UPDATE e_commerce_detalle_ventas set cantidad = ?, precio_venta = ? where id = ?`;

    return await this.dataSource.query(query, [cantidad, precio_venta, id]);
  }

  async deleteDetalle_venta(id: number): Promise<void> {
    const resultQuery = await this.dataSource.query(
      `DELETE from e_commerce_detalle_ventas WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }
}
