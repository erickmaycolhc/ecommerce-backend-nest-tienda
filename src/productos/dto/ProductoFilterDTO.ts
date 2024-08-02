export interface ProductosGrupoDTO {
  id: number;
  producto: Producto;
  grupo: Grupo;
  sub_grupo: Sub_grupo;
  imagen: string;
}

export interface Grupo {
  name: string;
  url: string;
}

export interface Producto {
  name: string;
  url: string;
}

export interface Sub_grupo {
  name: string;
  url: string;
}
