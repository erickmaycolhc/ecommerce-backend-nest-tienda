export interface ProductoDTO {
  id: number;
  nombre: string;
  precio_de_venta: number;
  imagen: string;
  cantidad?: string;
  sub_grupo_id: number;
}
