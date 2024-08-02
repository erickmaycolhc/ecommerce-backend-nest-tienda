import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductoDTO } from './dto/ProductoDTO';
import { ProductosGrupoDTO } from './dto/ProductoFilterDTO';

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

  async findAllProductosPorGruposUrl(
    url: string,
  ): Promise<ProductosGrupoDTO[]> {
    const query = await this.dataSource.query(
      `SELECT 
       e_commerce_productos.id,
       e_commerce_productos.nombre AS nombre_producto,
         e_commerce_productos.url AS url_producto,
         e_commerce_grupos.nombre AS nombre_grupo,
         e_commerce_grupos.url AS url_grupo,
         e_commerce_sub_grupos.nombre AS nombre_sub_grupo,
         e_commerce_sub_grupos.url AS url_sub_grupo,
         e_commerce_productos.precio_de_venta,
         e_commerce_productos.imagen
       FROM e_commerce_productos
        INNER JOIN e_commerce_sub_grupos ON e_commerce_sub_grupos.id = e_commerce_productos.sub_grupo_id
        INNER JOIN e_commerce_grupos ON e_commerce_grupos.id = e_commerce_sub_grupos.grupo_id
       WHERE e_commerce_grupos.url = ?`,
      [url],
    );
    console.log('query => ', query);
    const queryfinally: ProductosGrupoDTO[] = await Promise.all(
      query.map((producto) => {
        return {
          id: producto.id,
          producto: {
            name: producto.nombre_producto,
            url: producto.url_producto,
          },
          grupo: {
            name: producto.nombre_grupo,
            url: producto.url_grupo,
          },
          sub_grupo: {
            name: producto.nombre_sub_grupo,
            url: producto.url_sub_grupo,
          },
          precio: producto.precio_de_venta,
          imagen: producto.imagen,
        };
      }),
    );
    console.log('queryfinally => ', queryfinally);
    return queryfinally;
  }

  async findAllProductosPorSub_grupoUrl(
    url: string,
  ): Promise<ProductosGrupoDTO[]> {
    const query = await this.dataSource.query(
      `SELECT 
       e_commerce_productos.id,
       e_commerce_productos.nombre AS nombre_producto,
         e_commerce_productos.url AS url_producto,
         e_commerce_grupos.nombre AS nombre_grupo,
         e_commerce_grupos.url AS url_grupo,
         e_commerce_sub_grupos.nombre AS nombre_sub_grupo,
         e_commerce_sub_grupos.url AS url_sub_grupo,
         e_commerce_productos.precio_de_venta,
         e_commerce_productos.imagen
       FROM e_commerce_productos
        INNER JOIN e_commerce_sub_grupos ON e_commerce_sub_grupos.id = e_commerce_productos.sub_grupo_id
        INNER JOIN e_commerce_grupos ON e_commerce_grupos.id = e_commerce_sub_grupos.grupo_id
         WHERE e_commerce_sub_grupos.url = ?`,
      [url],
    );
    console.log('query => ', query);
    const queryfinally: ProductosGrupoDTO[] = await Promise.all(
      query.map((producto) => {
        return {
          id: producto.id,
          producto: {
            name: producto.nombre_producto,
            url: producto.url_producto,
          },
          grupo: {
            name: producto.nombre_grupo,
            url: producto.url_grupo,
          },
          sub_grupo: {
            name: producto.nombre_sub_grupo,
            url: producto.url_sub_grupo,
          },
          precio: producto.precio_de_venta,
          imagen: producto.imagen,
        };
      }),
    );
    console.log('queryfinally => ', queryfinally);
    return queryfinally;
  }

  async findByIdProducto(id: number): Promise<ProductoDTO> {
    const resultQuery = await this.dataSource.query(
      `SELECT * from e_commerce_productos WHERE id = ?`,
      [id],
    );
    return resultQuery;
  }

  async insertNewProducto(productoDTO: ProductoDTO): Promise<void> {
    const { nombre, precio_de_venta, imagen, sub_grupo_id, url } = productoDTO;
    const query = `INSERT INTO e_commerce_productos(nombre, precio_de_venta, imagen, sub_grupo_id, url) VALUES (?, ?, ?, ?, ?)`;

    return await this.dataSource.query(query, [
      nombre,
      precio_de_venta,
      imagen,
      sub_grupo_id,
      url,
    ]);
  }

  async updateProducto(
    id: number,
    productoDTO: ProductoDTO,
  ): Promise<ProductoDTO> {
    const { nombre, precio_de_venta, imagen, sub_grupo_id, url } = productoDTO;
    const query = `UPDATE e_commerce_productos set nombre = ?, precio_de_venta = ?, imagen = ?, sub_grupo_id = ?, url = ? where id = ?`;

    return await this.dataSource.query(query, [
      nombre,
      precio_de_venta,
      imagen,
      sub_grupo_id,
      url,
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
