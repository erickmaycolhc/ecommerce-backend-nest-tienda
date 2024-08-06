export interface Venta_de_pedidoDTO {
  id_orden: number;
  fecha_creacion: Date;
  usuario_id: number;
  precio_venta_total: number;
}

export interface ProductoVenta {
  id: number;
  cantidad: String;
  name: String;
}

export interface UsuarioVenta {
  id: number;
  name: String;
}

export interface VentaDto {
  productos: ProductoVenta[];
  usuario: UsuarioVenta;
}

export interface BoletaDTO {
  boleta: {
    productos: ProductosDTO[];
    total_compra: number;
  };
}

export interface ProductosDTO {
  id_orden: number;
  producto_nombre: string;
  grupo_nombre: string;
  sub_grupo_nombre: string;
  cantidad: number;
  precio_venta: number;
  usuario_id: number;
}

export interface TotalVentaDTO {
  venta_total_productos: number;
}
