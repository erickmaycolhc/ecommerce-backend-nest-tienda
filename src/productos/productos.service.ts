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
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * FROM e_commerce_productos`,
      );
      if (!resultQuery.length) {
        throw new HttpException('No productos found', HttpStatus.NOT_FOUND);
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          stauts: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching productos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllProductosPorGruposUrl(
    url: string,
  ): Promise<ProductosGrupoDTO[]> {
    try {
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
      if (!query.length) {
        throw new HttpException('No productos found', HttpStatus.NOT_FOUND);
      }

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
      if (!queryfinally.length) {
        throw new HttpException('No productos found', HttpStatus.NOT_FOUND);
      }
      return queryfinally;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching productos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllProductosPorSub_grupoUrl(
    url: string,
  ): Promise<ProductosGrupoDTO[]> {
    try {
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

      if (!query.length) {
        throw new HttpException('No productos found', HttpStatus.NOT_FOUND);
      }
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
      if (!queryfinally.length) {
        throw new HttpException('No productos found', HttpStatus.NOT_FOUND);
      }
      return queryfinally;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching productos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdProducto(id: number): Promise<ProductoDTO> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_productos WHERE id = ?`,
        [id],
      );

      if (!resultQuery.length) {
        throw new HttpException('No producto found', HttpStatus.NOT_FOUND);
      }

      return resultQuery[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching producto',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insertNewProducto(productoDTO: ProductoDTO): Promise<void> {
    const { nombre, precio_de_venta, imagen, sub_grupo_id, url } = productoDTO;
    if (!nombre || !precio_de_venta || !imagen || !sub_grupo_id || !url) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `INSERT INTO e_commerce_productos(nombre, precio_de_venta, imagen, sub_grupo_id, url) VALUES (?, ?, ?, ?, ?)`;

    try {
      return await this.dataSource.query(query, [
        nombre,
        precio_de_venta,
        imagen,
        sub_grupo_id,
        url,
      ]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'El producto ya existe.',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al insertar el producto.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateProducto(
    id: number,
    productoDTO: ProductoDTO,
  ): Promise<ProductoDTO> {
    const { nombre, precio_de_venta, imagen, sub_grupo_id, url } = productoDTO;

    if (!nombre || !precio_de_venta || !imagen || !sub_grupo_id || !url) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `UPDATE e_commerce_productos set nombre = ?, precio_de_venta = ?, imagen = ?, sub_grupo_id = ?, url = ? where id = ?`;

    try {
      const updateProducto = await this.dataSource.query(query, [
        nombre,
        precio_de_venta,
        imagen,
        sub_grupo_id,
        url,
        id,
      ]);
      if (updateProducto.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'producto  not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return updateProducto;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Duplicate entry for producto ',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error updating producto  in the database',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteProducto(id: number): Promise<void> {
    try {
      const resultQuery = await this.dataSource.query(
        `DELETE from e_commerce_productos WHERE id = ?`,
        [id],
      );
      if (resultQuery.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'producto not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting producto',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
