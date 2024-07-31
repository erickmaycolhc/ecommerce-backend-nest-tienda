import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GrupoDTO } from './dto/GrupoDTO';

@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Get()
  findAllGrupos() {
    return this.gruposService.findAllGrupos();
  }

  @Get('/:id')
  findByIdGrupo(@Param('id') id: number) {
    return this.gruposService.findByIdGrupo(id);
  }

  @Post()
  insertNewGrupo(@Body() grupoDTO: GrupoDTO) {
    return this.gruposService.insertNewGrupo(grupoDTO);
  }

  @Put('/grupo/:id')
  updateGrupo(@Param('id') id: number, @Body() grupoDTO: GrupoDTO) {
    return this.gruposService.updateGrupo(id, grupoDTO);
  }

  @Delete('/:id')
  deleteGrupo(@Param('id') id: number) {
    return this.gruposService.deleteGrupo(id);
  }
}
