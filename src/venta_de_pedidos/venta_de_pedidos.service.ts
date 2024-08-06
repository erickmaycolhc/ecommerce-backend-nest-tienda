import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BoletaDTO,
  Venta_de_pedidoDTO,
  VentaDto,
} from './dto/Venta_de_pedidoDTO';
import { ProductoDTO } from 'src/productos/dto/ProductoDTO';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class Venta_de_pedidosService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllVenta_de_pedidos(): Promise<Venta_de_pedidoDTO[]> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from  e_commerce_venta_de_pedidos`,
      );
      if (!resultQuery.length) {
        throw new HttpException(
          'No venta_de_pedidos found',
          HttpStatus.NOT_FOUND,
        );
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching venta_de_pedidos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdVenta_de_pedido(id_orden: number): Promise<Venta_de_pedidoDTO> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from  e_commerce_venta_de_pedidos WHERE id_orden = ?`,
        [id_orden],
      );

      // Verificar si se encontró el pedido
      if (!resultQuery.length) {
        throw new Error('Pedido no encontrado');
      }

      return resultQuery[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching venta_de_pedidos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Procesa la venta de un cliente
   * @param ventaDTO
   * @returns Respuesta exitosa
   */
  async saveVenta(ventaDTO: VentaDto): Promise<VentaDto> {
    try {
      // OBTENIENDO DETALLES DE CADA PRODUCTO
      const products: ProductoDTO[] = await Promise.all(
        ventaDTO.productos.map(async (item) => {
          const cantidadDeProductos = await this.dataSource.query(
            `SELECT * FROM e_commerce_productos WHERE id = ?`,
            [item.id],
          );

          if (!cantidadDeProductos.length) {
            throw new HttpException(
              'productos  not found',
              HttpStatus.NOT_FOUND,
            );
          }
          return {
            ...cantidadDeProductos[0],
            cantidad: item.cantidad,
          };
        }),
      );

      let precioTotal = products.reduce(
        (sum, current) => sum + current.precio_de_venta,
        0,
      );

      // GUARDANDO ORDEN
      const queryInsertOrder: ResultSetHeader = await this.dataSource.query(
        `INSERT INTO  e_commerce_venta_de_pedidos(fecha_creacion, usuario_id, precio_venta_total) VALUES (?, ?, ?)`,
        [new Date(), ventaDTO.usuario.id, precioTotal],
      );

      // GUARDANDO LOS PRODUCTOS DESPUES DE REGISTRAR LA ORDEN
      // insertId es el id_orden
      products.map(async (item) => {
        await this.dataSource.query(
          `INSERT INTO e_commerce_detalle_ventas(id_orden, producto_id, cantidad, precio_venta) VALUES (?, ?, ?, ?)`,
          [
            queryInsertOrder.insertId,
            item.id,
            item.cantidad,
            item.precio_de_venta,
          ],
        );
      });

      return;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching venta_de_pedidos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //falta agregar una columna precio_venta_total en este detalle
  async Boleta(id_orden: number): Promise<BoletaDTO> {
    try {
      const boletaInicial = await this.dataSource.query(
        `SELECT 
          edv.id_orden,
          ep.nombre AS producto_nombre,
          eg.nombre AS grupo_nombre,
          esg.nombre AS sub_grupo_nombre,
          edv.cantidad,
          edv.precio_venta,
          evp.usuario_id
        FROM 
            e_commerce_detalle_ventas edv
        JOIN 
            e_commerce_productos ep ON edv.producto_id = ep.id
        JOIN 
            e_commerce_sub_grupos esg ON ep.sub_grupo_id = esg.id
        JOIN 
            e_commerce_grupos eg ON esg.grupo_id = eg.id
        JOIN 
            e_commerce_venta_de_pedidos evp ON edv.id_orden = evp.id_orden
        WHERE 
            edv.id_orden = ?;`,
        [id_orden],
      );

      if (!boletaInicial.length) {
        throw new HttpException(
          'venta_de_pedidos not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const total_venta = await this.dataSource.query(
        `SELECT precio_venta_total FROM e_commerce_venta_de_pedidos where id_orden = ?`,
        [id_orden],
      );

      if (!total_venta.length) {
        throw new HttpException(
          'venta_de_pedidos not found',
          HttpStatus.NOT_FOUND,
        );
      }
      //manejar posibles problemas de datos faltantes o errores
      const totalCompra = total_venta[0]?.precio_venta_total || 0;

      //cambiamos finalmente a boleta con los datos requeridos
      const boletaFinal: BoletaDTO = {
        boleta: {
          productos: boletaInicial,
          total_compra: totalCompra,
        },
      };
      return boletaFinal;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching venta_de_pedidos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteVenta_de_pedido(id: number): Promise<void> {
    try {
      const resultQuery = await this.dataSource.query(
        `DELETE from  e_commerce_venta_de_pedidos WHERE id = ?`,
        [id],
      );

      if (resultQuery.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Venta_de_pedidos not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting venta_de_pedidos',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
