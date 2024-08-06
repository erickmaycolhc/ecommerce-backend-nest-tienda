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
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_detalle_ventas`,
      );
      if (!resultQuery.length) {
        throw new HttpException(
          'No detalle_ventas found',
          HttpStatus.NOT_FOUND,
        );
      }
      return resultQuery;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching detalle_ventas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdDetalle_venta(id: number): Promise<Detalle_VentaDTO> {
    try {
      const resultQuery = await this.dataSource.query(
        `SELECT * from e_commerce_detalle_ventas WHERE id = ?`,
        [id],
      );
      if (!resultQuery.length) {
        throw new Error('detalle_venta no encontrado');
      }
      return resultQuery[0];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching detalle_venta',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insertNewDetalle_venta(
    detalle_VentaDTO: Detalle_VentaDTO,
  ): Promise<void> {
    const { id_orden, producto_id, cantidad, precio_venta } = detalle_VentaDTO;
    if (!id_orden || !producto_id || !cantidad || !precio_venta) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `INSERT INTO e_commerce_detalle_ventas(id_orden, producto_id ,cantidad, precio_venta) VALUES (?, ?, ?, ?)`;
    try {
      return await this.dataSource.query(query, [
        id_orden,
        producto_id,
        cantidad,
        precio_venta,
      ]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'El detalle_venta ya existe.',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al insertar el detalle_venta.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateDetalle_venta(
    id: number,
    detalle_VentaDTO: Detalle_VentaDTO,
  ): Promise<Detalle_VentaDTO> {
    const { cantidad, precio_venta } = detalle_VentaDTO;
    if (!cantidad || !precio_venta) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Missing required fields or invalid data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const query = `UPDATE e_commerce_detalle_ventas set cantidad = ?, precio_venta = ? where id = ?`;
    try {
      const updateDetalle_venta = await this.dataSource.query(query, [
        cantidad,
        precio_venta,
        id,
      ]);
      if (updateDetalle_venta.affectedRows === 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'detalle_venta  not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return updateDetalle_venta;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Duplicate entry for detalle_venta ',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error updating detalle_venta  in the database',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteDetalle_venta(id: number): Promise<void> {
    try {
      const resultQuery = await this.dataSource.query(
        `DELETE from e_commerce_detalle_ventas WHERE id = ?`,
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
          error: 'Error deleting detalle_venta',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
