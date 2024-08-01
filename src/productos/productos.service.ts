import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductoDTO } from './dto/ProductoDTO';

@Injectable()
export class ProductosServices {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllProductos(): Promise<ProductoDTO[]> {
    const resultQuery = await this.dataSource.query(
      `SELECT * FROM e_commerce_productos`,
    );
    return resultQuery;
  }

  async findByIdProducto(id: number): Promise<ProductoDTO> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_productos WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }

  async insertNewProducto(productoDTO: ProductoDTO): Promise<void> {
    const { nombre, precio_de_venta, imagen, sub_grupo_id } = productoDTO;
    const query = `INSERT INTO e_commerce_productos(nombre, precio_de_venta, imagen, sub_grupo_id) VALUES (?, ?, ?, ?)`;

    return await this.dataSource.query(query, [
      nombre,
      precio_de_venta,
      imagen,
      sub_grupo_id,
    ]);
  }

  async updateProducto(
    id: number,
    productoDTO: ProductoDTO,
  ): Promise<ProductoDTO> {
    const { nombre, precio_de_venta, imagen, sub_grupo_id } = productoDTO;
    const query = `UPDATE e_commerce_productos set nombre = ?, precio_de_venta = ?, imagen = ?, sub_grupo_id = ? where id = ?`;

    return await this.dataSource.query(query, [
      nombre,
      precio_de_venta,
      imagen,
      sub_grupo_id,
      id,
    ]);
  }

  async deleteProducto(id: number): Promise<void> {
    const resultQuery = await this.dataSource.query(
      `DELETE from e_commerce_productos WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }
}
