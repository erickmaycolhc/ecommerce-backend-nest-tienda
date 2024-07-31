import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Sub_GruposService } from './sub_grupos.service';
import { Sub_GrupoDTO } from './dto/UsuarioDTO';

@Controller('sub_grupos')
export class Sub_GruposController {
  constructor(private readonly sub_gruposService: Sub_GruposService) {}

  @Get()
  findAllUsuarios() {
    return this.sub_gruposService.findAllSub_grupos();
  }

  @Get('/:id')
  findByIdUsuario(@Param('id') id: number) {
    return this.sub_gruposService.findByIdSub_grupo(id);
  }

  @Post()
  insertNewUsuario(@Body() sub_grupoDTO: Sub_GrupoDTO) {
    return this.sub_gruposService.insertNewSub_grupo(sub_grupoDTO);
  }

  @Put('/sub_grupo/:id')
  updateUsuario(@Param('id') id: number, @Body() sub_grupoDTO: Sub_GrupoDTO) {
    return this.sub_gruposService.updateSub_grupo(id, sub_grupoDTO);
  }

  @Delete('/:id')
  deleteUsuario(@Param('id') id: number) {
    return this.sub_gruposService.deleteSub_grupo(id);
  }
}
