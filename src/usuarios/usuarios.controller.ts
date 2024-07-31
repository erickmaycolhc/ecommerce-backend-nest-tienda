import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuarioDTO } from './dto/UsuarioDTO';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAllUsuarios() {
    return this.usuariosService.findAllUsuarios();
  }

  @Get('/:id')
  findByIdUsuario(@Param('id') id: number) {
    return this.usuariosService.findByIdUsuario(id);
  }

  @Post()
  insertNewUsuario(@Body() usuarioDTO: UsuarioDTO) {
    return this.usuariosService.insertNewUsuario(usuarioDTO);
  }

  @Put('/usuario/:id')
  updateUsuario(@Param('id') id: number, @Body() usuarioDTO: UsuarioDTO) {
    return this.usuariosService.updateUsuario(id, usuarioDTO);
  }

  @Delete('/:id')
  deleteUsuario(@Param('id') id: number) {
    return this.usuariosService.deleteUsuario(id);
  }
}
