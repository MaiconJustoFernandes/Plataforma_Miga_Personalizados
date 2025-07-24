import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { InsumsService } from './insums.service';
import { CreateInsumDto } from './insums/dto/create-insum.dto';
import { UpdateInsumDto } from './insums/dto/update-insum.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('insums')
export class InsumsController {
  constructor(private readonly insumsService: InsumsService) {}

  @Post()
  create(@Body() createInsumDto: CreateInsumDto) {
    return this.insumsService.create(createInsumDto);
  }

  @Get()
  findAll() {
    return this.insumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.insumsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateInsumDto: UpdateInsumDto) {
    return this.insumsService.update(id, updateInsumDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.insumsService.remove(id);
  }
}
